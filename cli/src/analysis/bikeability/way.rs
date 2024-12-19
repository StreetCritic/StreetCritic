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

    // Check for bicycle road and motor vehicle restrictions
    if match_tags(
        way.tags(),
        &vec![FilterExpr::Filter(Filter {
            tag: Some("bicycle".to_string()),
            value: Some(Some("road".to_string())),
            tag_regexp: None,
            value_regexp: None,
        })],
    ) {
        if match_tags(
            way.tags(),
            &vec![FilterExpr::Filter(Filter {
                tag: Some("motor_vehicle".to_string()),
                value: Some(Some("no".to_string())),
                tag_regexp: None,
                value_regexp: None,
            })],
        ) {
            factor = 1.0;
        } else {
            factor = 0.75;
        }
    } else if !match_tags(
        way.tags(),
        &vec![
            FilterExpr::Filter(Filter {
                tag: Some("access".to_string()),
                value: Some(Some("yes".to_string())),
                tag_regexp: None,
                value_regexp: None,
            }),
            FilterExpr::Filter(Filter {
                tag: Some("access".to_string()),
                value: Some(None),
                tag_regexp: None,
                value_regexp: None,
            }),
        ],
    ) {
        factor = 0.0;
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
    } else if match_tags(
        way.tags(),
        &vec![FilterExpr::Filter(Filter {
            tag: Some("path".to_string()),
            value: None,
            tag_regexp: None,
            value_regexp: None,
        })],
    ) {
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
    } else if match_tags(
        way.tags(),
        &vec![
            // FilterExpr::Filter(Filter {
            //     tag: Some("maxspeed".to_string()),
            //     value_regexp: Some(nice_speed_limit.to_string()),
            //     tag_regexp: None,
            //     value: None,
            // },
            FilterExpr::Filter(Filter {
                tag: Some("highway".to_string()),
                value: Some(Some("residential".to_string())),
                tag_regexp: None,
                value_regexp: None,
            }),
            FilterExpr::Filter(Filter {
                tag: Some("highway".to_string()),
                value: Some(Some("living_street".to_string())),
                tag_regexp: None,
                value_regexp: None,
            }),
        ],
    ) {
        factor = 0.5;
    } else if match_tags(
        way.tags(),
        &vec![FilterExpr::FilterCombination(FilterCombination {
            and: vec![vec![
                FilterExpr::Filter(Filter {
                    tag: Some("highway".to_string()),
                    value_regexp: Some("^.*$".to_string()),
                    tag_regexp: None,
                    value: None,
                }),
                FilterExpr::Not(Filter {
                    tag: Some("highway".to_string()),
                    value_regexp: None,
                    tag_regexp: None,
                    value: Some(Some("path".to_string())),
                }),
            ]],
        })],
    ) {
        factor = 0.1;
    } else {
        factor = 0.0;
    }
    factor
}
