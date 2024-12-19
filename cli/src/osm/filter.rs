use regex::Regex;

#[derive(Clone)]
/// A tag/value filter.
pub struct Filter {
    /// Tag by value.
    pub tag: Option<String>,
    /// Tag by regexp.
    pub tag_regexp: Option<String>,
    /// Value by value. If Some(None), the tag must not exist.
    pub value: Option<Option<String>>,
    /// Value by regexp.
    pub value_regexp: Option<String>,
}

#[derive(Clone)]
/// A combination of filters.
pub struct FilterCombination {
    /// All these filters must match.
    pub and: Vec<Vec<FilterExpr>>,
}

#[derive(Clone)]
pub enum FilterExpr {
    Filter(Filter),
    FilterCombination(FilterCombination),
    Not(Filter),
}

pub trait Tag {
    fn k(&self) -> &String;
    fn v(&self) -> &String;
}

impl Tag for osm_io::osm::model::tag::Tag {
    fn k(&self) -> &String {
        self.k()
    }
    fn v(&self) -> &String {
        self.v()
    }
}

/// Check if any of the given tags match any of the given filters.
pub fn match_tags<T>(tags: &Vec<T>, filters: &Vec<FilterExpr>) -> bool
where
    T: Tag,
{
    'filterLoop: for filter_expr in filters {
        match filter_expr {
            FilterExpr::FilterCombination(combination) => {
                for filters in &combination.and {
                    if !match_tags(tags, filters) {
                        continue 'filterLoop;
                    }
                }
                return true;
            }
            FilterExpr::Not(filter) => {
                if match_tags(tags, &vec![FilterExpr::Filter(filter.clone())]) {
                    continue 'filterLoop;
                }
                return true;
            }
            FilterExpr::Filter(filter) => {
                let tag_must_not_exist = filter.value.as_ref().is_some_and(|v| v.is_none());
                for tag in tags {
                    if filter.tag_regexp.is_some() {
                        let re = Regex::new(filter.tag_regexp.as_ref().unwrap().as_str()).unwrap();
                        if !re.is_match(tag.k()) {
                            continue;
                        }
                    } else if *tag.k() != *filter.tag.as_ref().unwrap() {
                        continue;
                    } else if tag_must_not_exist {
                        continue 'filterLoop;
                    }
                    if filter.value_regexp.is_some() {
                        let re =
                            Regex::new(filter.value_regexp.as_ref().unwrap().as_str()).unwrap();
                        if !re.is_match(tag.v()) {
                            continue;
                        }
                        return true;
                    } else if filter.value.is_some() {
                        if *tag.v() != *filter.value.as_ref().unwrap().as_ref().unwrap() {
                            continue;
                        }
                        return true;
                    } else {
                        return true;
                    }
                }
                if tag_must_not_exist {
                    return true;
                }
            }
        }
    }
    false
}

#[cfg(test)]
mod tests {
    use super::*;

    struct TestTag {
        k: String,
        v: String,
    }

    fn make_tag(k: &str, v: &str) -> TestTag {
        TestTag {
            k: k.into(),
            v: v.into(),
        }
    }

    impl Tag for TestTag {
        fn k(&self) -> &String {
            &self.k
        }
        fn v(&self) -> &String {
            &self.v
        }
    }

    #[test]
    fn test_match_single_tag() {
        let way = vec![make_tag("cycleway:left", "lane")];
        let filters = vec![FilterExpr::Filter(Filter {
            tag: Some("cycleway:left".to_string()),
            tag_regexp: None,
            value: None,
            value_regexp: None,
        })];

        assert!(match_tags(&way, &filters));
    }

    #[test]
    fn test_match_tag_with_value() {
        let way = vec![make_tag("cycleway:left", "lane")];
        let filters = vec![FilterExpr::Filter(Filter {
            tag: Some("cycleway:left".to_string()),
            tag_regexp: None,
            value: Some(Some("lane".to_string())),
            value_regexp: None,
        })];

        assert!(match_tags(&way, &filters));
    }

    #[test]
    fn test_match_tag_with_null_value() {
        let way = vec![make_tag("cycleway:left", "lane")];
        let filters = vec![FilterExpr::Filter(Filter {
            tag: Some("cycleway:left".to_string()),
            tag_regexp: None,
            value: Some(None),
            value_regexp: None,
        })];

        assert!(!match_tags(&way, &filters));
    }

    #[test]
    fn test_tag_must_not_exist() {
        let way = vec![make_tag("cycleway:left", "lane")];
        let filters = vec![FilterExpr::Filter(Filter {
            tag: Some("notag".to_string()),
            tag_regexp: None,
            value: Some(None),
            value_regexp: None,
        })];

        assert!(match_tags(&way, &filters));
    }

    #[test]
    fn test_combination_with_and_logic() {
        let way = vec![make_tag("cycleway:left", "lane")];
        let filters = vec![FilterExpr::FilterCombination(FilterCombination {
            and: vec![
                vec![FilterExpr::Filter(Filter {
                    tag: Some("cycleway:left".to_string()),
                    tag_regexp: None,
                    value: Some(Some("lane".to_string())),
                    value_regexp: None,
                })],
                vec![FilterExpr::Filter(Filter {
                    tag: Some("notag".to_string()),
                    tag_regexp: None,
                    value: Some(None),
                    value_regexp: None,
                })],
            ],
        })];

        assert!(match_tags(&way, &filters));
    }

    #[test]
    fn test_combination_no_match() {
        let way = vec![make_tag("cycleway:left", "lane")];
        let filters = vec![FilterExpr::FilterCombination(FilterCombination {
            and: vec![
                vec![FilterExpr::Filter(Filter {
                    tag: Some("notag".to_string()),
                    tag_regexp: None,
                    value: Some(Some("foo".to_string())),
                    value_regexp: None,
                })],
                vec![FilterExpr::Filter(Filter {
                    tag: Some("notag".to_string()),
                    tag_regexp: None,
                    value: Some(None),
                    value_regexp: None,
                })],
            ],
        })];

        assert!(!match_tags(&way, &filters));
    }

    #[test]
    fn test_and_combination_with_value_and_null_value() {
        let way = vec![make_tag("cycleway:left", "lane")];
        let filters = vec![FilterExpr::FilterCombination(FilterCombination {
            and: vec![
                vec![FilterExpr::Filter(Filter {
                    tag: Some("cycleway:left".to_string()),
                    tag_regexp: None,
                    value: Some(Some("lane".to_string())),
                    value_regexp: None,
                })],
                vec![FilterExpr::Filter(Filter {
                    tag: Some("notag".to_string()),
                    tag_regexp: None,
                    value: Some(None),
                    value_regexp: None,
                })],
            ],
        })];

        assert!(match_tags(&way, &filters));
    }
}
