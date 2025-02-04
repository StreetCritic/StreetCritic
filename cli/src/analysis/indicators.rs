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

    let bike_comfort = (1.0 * indicators.get("priority").unwrap()
        + 2.0 * indicators.get("surface").unwrap())
        / 3.0;
    indicators.insert("bike_comfort".into(), bike_comfort);

    let bike_safety = (2.0 * indicators.get("priority").unwrap()
        + 1.0 * indicators.get("surface").unwrap()
        + 3.0 * indicators.get("speed_limit").unwrap()
        + 4.0 * indicators.get("motorized_traffic").unwrap())
        / 10.0;
    indicators.insert("bike_safety".into(), bike_safety);

    let beauty = (3.0 * 0.5 + 1.0 * indicators.get("motorized_traffic").unwrap()) / 4.0;
    indicators.insert("beauty".into(), beauty);

    indicators
}
