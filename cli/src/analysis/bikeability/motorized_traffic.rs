use crate::osm::get_tag;
use osm_io::osm::model::way::Way;

/// Calculates the motorized traffic factor for the given way.
pub fn calculate(way: &Way) -> f32 {
    // No motorized traffic at all.
    match get_tag(way, "motor_vehicle") {
        Some(value) => match value.as_str() {
            "no" => return 1.0,
            _ => {}
        },
        None => {}
    }

    match get_tag(way, "highway") {
        Some(value) => match value.as_str() {
            "path" => {
                return 1.0;
            }
            "living_street" => {
                return 0.7;
            }
            "residential" => {
                return 0.5;
            }
            _ => {}
        },
        None => {}
    }
    0.0
}
