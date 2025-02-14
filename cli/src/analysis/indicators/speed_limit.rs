use crate::osm::get_tag;
use osm_io::osm::model::way::Way;
use regex::Regex;

/// Calculates the speed limit indicator for the given way.
pub fn calculate(way: &Way) -> f32 {
    // No motorized traffic at all.
    match get_tag(way, "highway") {
        Some(value) => match value.as_str() {
            "living_street" => return 1.0,
            _ => {}
        },
        None => {}
    };

    match get_tag(way, "maxspeed") {
        Some(value) => {
            let speed_regex = Regex::new(r"(\d+)(.*)").unwrap();
            for (_, [speed_str, unit]) in speed_regex.captures_iter(value).map(|c| c.extract()) {
                if unit.trim() != "" && unit.trim() != "mph" {
                    return 0.5;
                }
                let raw_speed = speed_str.parse::<f32>().unwrap();
                let speed = match unit.trim() {
                    "mph" => raw_speed * 1.609344,
                    "" => raw_speed,
                    _ => panic!(),
                };
                if speed >= 80.0 {
                    return 0.0;
                }
                if speed <= 20.0 {
                    return 1.0;
                }
                let min_speed = 20.0;
                let max_speed = 80.0;
                let min_factor = 0.0;
                let max_factor = 1.0;
                let a = (min_factor - max_factor) / (max_speed - min_speed);
                return a * speed + max_factor - min_speed * a;
            }
        }
        None => {}
    };
    0.5
}

#[cfg(test)]
mod tests {
    use osm_io::osm::model::tag::Tag;

    fn way_with_limit(limit: &str) -> Way {
        Way::new(
            1,
            1,
            1,
            1,
            1,
            "".into(),
            true,
            vec![],
            vec![Tag::new("maxspeed".into(), limit.into())],
        )
    }

    use super::*;
    #[test]
    fn test_calculation() {
        assert_eq!(calculate(&way_with_limit("10")), 1.0);
        assert_eq!(calculate(&way_with_limit("20")), 1.0);
        assert_eq!(calculate(&way_with_limit("50")), 0.49999997);
        assert_eq!(calculate(&way_with_limit("70")), 0.1666666);
        assert_eq!(calculate(&way_with_limit("80")), 0.0);
        assert_eq!(calculate(&way_with_limit("30 mph")), 0.5286614);
        assert_eq!(calculate(&way_with_limit("20 xyz")), 0.5);
    }
}
