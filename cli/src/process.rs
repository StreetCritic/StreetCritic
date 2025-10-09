use std::sync::{Arc, atomic::{AtomicUsize, Ordering}, Mutex};
use std::{path::Path, time::Instant};

use anyhow;

use osm_io::osm::{model::{element::Element, tag::Tag, way::Way}, pbf::thread_local_accumulator::ThreadLocalAccumulator};
use osm_io::osm::pbf;
use osm_io::osm::pbf::compression_type::CompressionType;
use osm_io::osm::pbf::file_info::FileInfo;

use crate::analysis::indicators;
use crate::db::ways::get_rated_ways;

pub struct Options<'a> {
    /// Input PBF.
    pub in_path: &'a Path,
    /// Output PBF.
    pub out_path: &'a Path,
    /// Connection string to StreetCritic database.
    pub db_conn: Option<String>,
    /// Should ratings from DB be merged into the output PBF?
    pub merge_ratings: bool,
    /// Should way scores be calculated?
    pub calculate_scores: bool,
}

/// Load the ratings from the database and updates the ways in the PBF.
/// in_path: Path to the original PBF.
/// out_path: Path to the updated PBF.
/// db: DB connection string.
pub fn process(opts: &Options) -> Result<(), anyhow::Error> {
    let rated_ways = if opts.merge_ratings {
        Some(get_rated_ways(
            opts.db_conn
                .as_ref()
                .expect("Missing database connection string")
                .as_str(),
        )?)
    } else {
        None
    };

    log::info!("Processing PBF...");

    let reader = pbf::reader::Reader::new(opts.in_path)?;
    let mut file_info = FileInfo::default();
    file_info.with_writingprogram_str("streetcritic-rating");
    let writer = Arc::new(Mutex::new(pbf::parallel_writer::ParallelWriter::from_file_info(
        4 * 8000 * 32,
        8000,
        opts.out_path.to_path_buf(),
        file_info,
        CompressionType::Zlib,
    )?));

    let writer_clone = writer.clone();

    let tl_acc = ThreadLocalAccumulator::new(8000);
    {
        let mut writer_guard = writer.lock().unwrap();
        writer_guard.write_header()?;
    }


    let count_elements = Arc::new(AtomicUsize::new(0));
    let count_elements_clone = count_elements.clone();
    let time_pipeline_start = Instant::now();
    let mut last_log = Instant::now();

    let calculate_scores = opts.calculate_scores;
    let merge_ratings = opts.merge_ratings;

    reader.parallel_for_each(num_cpus::get(), move |element| {
        if let Element::Way { way } = &element {
            log::trace!("Processing way {}", way.id());
            let mut tags = vec![];
            for tag in way.tags() {
                tags.push(tag.clone());
            }
            if merge_ratings && rated_ways.as_ref().unwrap().contains_key(&way.id()) {
                log::trace!("Way {} has general rating", way.id());
                tags.push(Tag::new(
                    "streetcritic:rating:general".into(),
                    rated_ways
                        .as_ref()
                        .unwrap()
                        .get(&way.id())
                        .unwrap()
                        .to_string(),
                ));
            }
            if calculate_scores {
                let indicators = indicators::calculate(way);
                for (key, value) in indicators {
                    log::trace!("indicator {}: {}", key, value);
                    tags.push(Tag::new(
                        format!("streetcritic:indicator:{}", key).into(),
                        value.to_string(),
                    ));
                }
            }
            tl_acc.add(Element::Way {
                way: Way::new(
                    way.id(),
                    // TODO maybe honor these. We're doing an update here!
                    way.version(),
                    way.timestamp(),
                    way.changeset(),
                    way.uid(),
                    way.user().clone(),
                    way.visible(),
                    way.refs().clone(),
                    tags,
                )});
        } else if element.is_sentinel() {
            let mut writer_guard = writer_clone.lock().unwrap();
            writer_guard.write_elements(tl_acc.elements())?;
        } else {
            tl_acc.add(element);
        }
        count_elements_clone.fetch_add(1, Ordering::Relaxed);
        // if last_log.elapsed().as_secs() >= 10 {
        //     log::info!("Read {} elements", count_elements);
        //     last_log = Instant::now();
        // }
        Ok(())
    })?;

    writer.lock().unwrap().close()?;

    log::info!(
        "PBF completely read, elements: {}, time: {} ms",
        count_elements.load(Ordering::SeqCst),
        time_pipeline_start.elapsed().as_millis()
    );
    Ok(())
}
