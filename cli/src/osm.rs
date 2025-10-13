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

/**
 * Return true if the tag is present and equals value.
 */
pub fn tag_eq<'a>(way: &'a Way, key: &str, value: &str) -> bool {
    for tag in way.tags() {
        if tag.k().as_str() == key && tag.v() == value {
            return true;
        }
    }
    false
}
