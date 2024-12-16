use std::{path::PathBuf, time::Instant};

use anyhow;

use osm_io::osm::model::{element::Element, tag::Tag, way::Way};
use osm_io::osm::pbf;
use osm_io::osm::pbf::compression_type::CompressionType;
use osm_io::osm::pbf::file_info::FileInfo;

use crate::db::ways::get_rated_ways;

/// Load the ratings from the database and updates the ways in the PBF.
/// in_path: Path to the original PBF.
/// out_path: Path to the updated PBF.
/// db: DB connection string.
pub fn merge_ratings_into_osm_planet(
    in_path: &PathBuf,
    out_path: &PathBuf,
    db: &String,
) -> Result<(), anyhow::Error> {
    let rated_ways = get_rated_ways(db)?;

    log::info!("Started pbf io pipeline");

    let reader = pbf::reader::Reader::new(&in_path)?;
    let mut file_info = FileInfo::default();
    file_info.with_writingprogram_str("streetcritic-rating");
    let mut writer =
        pbf::writer::Writer::from_file_info(out_path.clone(), file_info, CompressionType::Zlib)?;

    writer.write_header()?;

    let mut count_elements = 0;
    let time_pipeline_start = Instant::now();
    let mut last_log = Instant::now();
    for element in reader.elements()? {
        match &element {
            Element::Way { way } => {
                if rated_ways.contains_key(&way.id()) {
                    // TODO Lets save the rating as maxspeed for now. Quick hack.
                    let mut tags = vec![];
                    for tag in way.tags() {
                        if tag.k() != "maxspeed" {
                            tags.push(tag.clone());
                        }
                    }
                    tags.push(Tag::new(
                        "maxspeed".into(),
                        rated_ways.get(&way.id()).unwrap().to_string(),
                    ));
                    writer.write_element(Element::Way {
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
                        ),
                    })?;
                    log::trace!("Updated way {} in pbf", way.id());
                    continue;
                }
            }
            _ => {}
        }
        writer.write_element(element)?;
        count_elements += 1;
        if last_log.elapsed().as_secs() >= 10 {
            log::info!("Read {} elements", count_elements);
            last_log = Instant::now();
        }
    }

    writer.close()?;

    log::info!(
        "Finished pbf io pipeline, time: {:?}",
        time_pipeline_start.elapsed().as_secs()
    );
    Ok(())
}
