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
            "path" | "pedestrian" | "footway" | "cycleway" | "steps" => {
                return 1.0;
            }
            "living_street" | "crossing" => {
                return 0.7;
            }
            "service" | "track" => {
                return 0.6;
            }
            "residential" => {
                return 0.5;
            }
            "tertiary" | "unclassified" => {
                return 0.2;
            }
            "secondary" => {
                return 0.1;
            }
            "primary" | "trunk" | "motorway" | "motorway_link" => {
                return 0.0;
            }
            _ => {
                log::debug!("Unknown value for tag highway: {}", value);
                return 0.0;
            }
        },
        None => {}
    }
    0.0
}
