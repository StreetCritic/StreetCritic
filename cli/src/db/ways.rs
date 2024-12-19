use postgres::{Client, NoTls};

use regex::Regex;
use std::collections::HashMap;

pub fn get_rated_ways(db: &str) -> Result<HashMap<i64, f32>, anyhow::Error> {
    let mut client = Client::connect(db, NoTls)?;
    let mut ratings = HashMap::new();
    let way_regex = Regex::new(
        r"\{'property': , 'dataset': OpenStreetMap, 'record_id': w(\d+), 'update_time': NULL, 'confidence': NULL\}",
    )?;

    for row in client.query("SELECT rated_segments.rating, segment_sources.sources FROM rated_segments LEFT JOIN segment_sources ON rated_segments.segment_id=segment_sources.segment_id WHERE rating IS NOT NULL", &[])? {
        let rating: f32 = row.get(0);
        let sources: &str = row.get(1);
        // ratings.insert(segment_id,
        log::trace!("rating: {}, sources: {}", &rating, &sources);
        for (_, [way_id_str]) in way_regex.captures_iter(sources).map(|c| c.extract()) {
            let way_id = way_id_str.parse::<i64>()?;
            log::trace!("way {} gets rating {}", way_id, rating);
            ratings.insert(way_id, rating);
        }
    }
    Ok(ratings)
}
