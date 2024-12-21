pub mod filter;

use osm_io::osm::model::way::Way;

/**
 * Return tag value if tag is present.
 */
pub fn get_tag<'a>(way: &'a Way, key: &str) -> Option<&'a String> {
    way.tags().iter().find_map(|tag| {
        if tag.k().as_str() == key {
            Some(tag.v())
        } else {
            None
        }
    })
}
