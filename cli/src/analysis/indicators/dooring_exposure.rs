use crate::osm::{get_tag, tag_eq};
use osm_io::osm::model::way::Way;

enum Direction {
    Left,
    Right,
}

/// Calculates the dooring exposure indicator for the given way and direction.
fn calculate_for_direction(way: &Way, direction: Direction) -> f32 {
    let direction_key = match direction {
        Direction::Left => "left",
        Direction::Right => "right",
    };
    // No parking at all, no dooring exposure
    if tag_eq(way, "parking:both", "no")
        || tag_eq(way, format!("parking:{}", direction_key).as_str(), "no")
    {
        return 1.0;
    }

    // orientation is not parallel, no dooring exposure
    if tag_eq(
        way,
        format!("parking:{}:orientation", direction_key).as_str(),
        "diagonal",
    ) || tag_eq(
        way,
        format!("parking:{}:orientation", direction_key).as_str(),
        "perpendicular",
    ) {
        return 1.0;
    }

    // There is some dooring exposure.
    if get_tag(way, "parking:both").is_some()
        || get_tag(way, format!("parking:{}", direction_key).as_str()).is_some()
    {
        return 0.25;
    }

    // Default value if not enough data available.
    0.5
}

/// Calculates the dooring exposure indicator for the given way.
pub fn calculate(way: &Way) -> f32 {
    (calculate_for_direction(way, Direction::Left) + calculate_for_direction(way, Direction::Right))
        / 2.0
}

#[cfg(test)]
mod tests {
    use osm_io::osm::model::tag::Tag;

    fn way_with_tags(tags: Vec<Tag>) -> Way {
        Way::new(1, 1, 1, 1, 1, "".into(), true, vec![], tags)
    }

    use super::*;
    #[test]
    fn test_calculation() {
        assert_eq!(calculate(&way_with_tags(vec![])), 0.5);
        assert_eq!(
            calculate(&way_with_tags(vec![Tag::new(
                "parking:both".into(),
                "lane".into()
            )])),
            0.25
        );
        assert_eq!(
            calculate(&way_with_tags(vec![Tag::new(
                "parking:both".into(),
                "no".into()
            )])),
            1.0
        );
        assert_eq!(
            calculate(&way_with_tags(vec![Tag::new(
                "parking:left".into(),
                "no".into()
            )])),
            0.75
        );
        assert_eq!(
            calculate(&way_with_tags(vec![
                Tag::new("parking:right".into(), "no".into()),
                Tag::new("parking:left".into(), "no".into()),
            ])),
            1.0
        );
        assert_eq!(
            calculate(&way_with_tags(vec![
                Tag::new("parking:right".into(), "lane".into()),
                Tag::new("parking:left".into(), "no".into()),
            ])),
            0.625
        );
        assert_eq!(
            calculate(&way_with_tags(vec![
                Tag::new("parking:right".into(), "lane".into()),
                Tag::new("parking:right:orientation".into(), "diagonal".into()),
                Tag::new("parking:left".into(), "no".into()),
            ])),
            1.0
        );
    }
}
