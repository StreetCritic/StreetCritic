use crate::error::APIError;

/// Handling for `include` API parameters.
pub struct Includes(Vec<String>);

impl<'de> serde::Deserialize<'de> for Includes {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let s: Option<String> = Option::deserialize(deserializer)?;
        let includes = match s {
            Some(s) => s
                .split(',')
                .map(str::trim)
                .map(str::parse)
                .collect::<Result<Vec<String>, _>>()
                .map_err(serde::de::Error::custom)?,
            None => vec![],
        };
        Ok(Includes(includes))
    }
}

impl Includes {
    /// Asserts that only the given includes are present.
    pub fn expect_only(&self, includes: &[&str]) -> Result<(), APIError> {
        for include in &self.0 {
            if !includes.contains(&include.as_str()) {
                return Err(APIError::IncludesError {
                    unexpected: include.clone(),
                });
            }
        }
        Ok(())
    }

    /// Checks for presence of include.
    pub fn contains(&self, include: &str) -> bool {
        self.0.contains(&include.into())
    }
}
