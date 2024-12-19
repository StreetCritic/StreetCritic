use crate::osm::filter::{match_tags, Filter, FilterExpr};
use osm_io::osm::model::way::Way;

/// Calculates the surface factor for the given way.
pub fn calculate(way: &Way) -> f32 {
    if
        match_tags(way.tags(), &vec![
            FilterExpr::Filter(Filter{
                tag: Some("surface".into()),
                tag_regexp: None,
                value: None,
                value_regexp: Some(
                "^(gravel|concrete:lanes|concrete:plates|paving_stones|compacted|fine_gravel)$".into()),
            }),
        ])
     {
        0.7
    } else if
        match_tags(way.tags(), &vec![
            FilterExpr::Filter(Filter{
                tag: Some("surface".into()),
                value: Some(Some("sett".into())),
                tag_regexp: None,
                value_regexp: None,
            }),
        ])
     {
        0.5
    } else if
        match_tags(way.tags(), &vec![
            FilterExpr::Filter(Filter{
                tag: Some("surface".into()),
                value_regexp: Some("cobblestone$".into()),
                tag_regexp: None,
                value: None,
            }),

            FilterExpr::Filter(Filter{
                tag: Some("surface".into()),
                tag_regexp: None,
                value: None,
                value_regexp: Some(
                "^(metal|wood|unpaved|gravel|pebblestone|ground|earth|dirt|grass|grass_paver|mud|sand|woodchips)$".into()),
            }),
        ])
     {
        0.25
    } else {
        1.0
    }
}
