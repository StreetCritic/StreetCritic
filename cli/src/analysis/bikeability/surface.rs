use crate::osm::get_tag;
use osm_io::osm::model::way::Way;

/// Calculates the surface factor for the given way.
pub fn calculate(way: &Way) -> f32 {
    let surface = get_tag(way, "surface");
    match surface {
        Some(surface) => match surface.as_str() {
            "asphalt" | "chipseal" | "concrete" => 1.0,
            "concrete:plates" | "paving_stones" | "clay" | "tartan" | "compacted"
            | "fine_gravel" | "bricks" | "metal_grid" => 0.7,
            "concrete:lanes" => 0.65,
            "paving_stones:lanes" => 0.6,
            "sett" | "paved" => 0.5,
            "metal" | "wood" | "rubber" | "salt" | "acrylic" | "carpet" | "plastic" => 0.3,
            "artificial_turf" | "gravel" | "snow" | "shells" | "tiles" | "cobblestone"
            | "unhewn_cobblestone" | "unpaved" | "ground" | "earth" | "dirt" | "grass_paver"
            | "woodchips" => 0.25,
            "grass" | "mud" | "ice" | "sand" => 0.15,
            "stepping_stones" | "rock" | "pebblestone" => 0.1,
            _ => {
                log::warn!("Unknown way surface \"{}\"", surface);
                0.5
            }
        },
        None => 0.5,
    }
}
