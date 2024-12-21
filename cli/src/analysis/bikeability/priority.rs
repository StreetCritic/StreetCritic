use crate::osm::get_tag;
use osm_io::osm::model::way::Way;

/// Is this a bicycle road?
pub fn calculate(way: &Way) -> f32 {
    match get_tag(&way, "bicycle_road") {
        Some(value) => match value.as_str() {
            "yes" => return 1.0,
            "no" => {}
            _ => {
                log::warn!("Unknown value for tag bicycle_road: {}", value);
            }
        },
        None => {}
    }

    match get_tag(&way, "bicycle") {
        Some(value) => match value.as_str() {
            "road" => 1.0,
            "yes" | "no" | "designated" | "use_sidepath" | "permissive" | "dismount"
            | "private" => 0.0,
            _ => {
                log::warn!("Unknown value for tag bicycle: {}", value);
                0.0
            }
        },
        None => 0.0,
    }
    // let cycle_way = get_tag(&way, "cycle_way");
    // match bicycle_road {
    //     Some(value) => match value.as_str() {
    //         "road" => 1.0,
    //         _ => { log::warn!("Unknown value for tag bicycle: {}", value); 0.0},
    //     },
    //     None => 0.0,
    // }
}
