use crate::osm::filter::{match_tags, Filter, FilterCombination, FilterExpr};
use osm_io::osm::model::way::Way;

/// Calculates the way factor for the given way.
pub fn calculate(way: &Way) -> f32 {
    let factor;
    // let nice_speed_limit = if area.get_attribute("country") == "UK" {
    //     "^([1]?[0-9]|20)(?: mph)?$"
    // } else {
    //     "^([1-2]?[0-9]|30)$"
    // };

    // } else if !match_tags(
    //     way.tags(),
    //     &vec![
    //         FilterExpr::Filter(Filter {
    //             tag: Some("access".to_string()),
    //             value: Some(Some("yes".to_string())),
    //             tag_regexp: None,
    //             value_regexp: None,
    //         }),
    //         FilterExpr::Filter(Filter {
    //             tag: Some("access".to_string()),
    //             value: Some(None),
    //             tag_regexp: None,
    //             value_regexp: None,
    //         }),
    //     ],
    // ) {
    //     factor = 0.0;

    } else if match_tags(
        way.tags(),
        &vec![FilterExpr::Filter(Filter {
            tag: Some("cycleway".to_string()),
            value: Some(Some("lane".to_string())),
            tag_regexp: None,
            value_regexp: None,
        })],
    ) {
        factor = 1.0;
    } else if match_tags(
        way.tags(),
        &vec![FilterExpr::Filter(Filter {
            tag: Some("cycleway".to_string()),
            value: Some(Some("opposite".to_string())),
            tag_regexp: None,
            value_regexp: None,
        })],
    ) {
        factor = 0.9;
        if match_tags(
            way.tags(),
            &vec![FilterExpr::Filter(Filter {
                tag: Some("designated".to_string()),
                value: Some(Some("bicycle".to_string())),
                tag_regexp: None,
                value_regexp: None,
            })],
        ) {
            factor = 1.0;
        } else {
            factor = 0.0;
        }
    } else if match_tags(
        way.tags(),
        &vec![FilterExpr::Filter(Filter {
            tag: Some("cycleway".to_string()),
            value: Some(Some("misc".to_string())),
            tag_regexp: None,
            value_regexp: None,
        })],
    ) {
        // if match_tags(
        //     way,
        //     &vec![Filter {
        //         tag: Some("maxspeed".to_string()),
        //         value_regexp: Some(nice_speed_limit.to_string()),
        //         tag_regexp: None,
        //         value: None,
        //     }],
        // ) {
        //     factor = 0.8;
        // } else {
        factor = 0.7;
        // }
}
