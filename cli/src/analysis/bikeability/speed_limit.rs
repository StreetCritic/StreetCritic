use crate::osm::get_tag;
use osm_io::osm::model::way::Way;

/// Calculates the speed limit indicator for the given way.
pub fn calculate(way: &Way) -> f32 {
    // No motorized traffic at all.
    match get_tag(way, "highway") {
        Some(value) => match value.as_str() {
            "living_street" => 1.0,
            _ => 0.0,
        },
        None => 0.0,
    }
}
