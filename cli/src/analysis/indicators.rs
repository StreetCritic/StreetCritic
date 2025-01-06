pub mod motorized_traffic;
pub mod priority;
pub mod speed_limit;
pub mod surface;

use osm_io::osm::model::way::Way;
use std::collections::HashMap;

/// Calculates the indicators for the given way.
pub fn calculate(way: &Way) -> HashMap<String, f32> {
    let mut indicators = HashMap::new();

    indicators.insert("priority".into(), priority::calculate(way));
    indicators.insert("surface".into(), surface::calculate(way));
    indicators.insert("speed_limit".into(), speed_limit::calculate(way));
    indicators.insert(
        "motorized_traffic".into(),
        motorized_traffic::calculate(way),
    );

    let bikeability = (2.0 * indicators.get("priority").unwrap()
        + 1.0 * indicators.get("surface").unwrap()
        + 1.0 * indicators.get("speed_limit").unwrap()
        + 2.0 * indicators.get("motorized_traffic").unwrap())
        / 6.0;
    indicators.insert("bikeability".into(), bikeability);
    indicators
}
