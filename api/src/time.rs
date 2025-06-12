use time::format_description::well_known::Rfc3339;
use ts_rs::TS;

#[derive(serde::Serialize, serde::Deserialize, TS)]
#[ts(type = "string")]
pub struct DateTimeString(String);

impl Into<DateTimeString> for time::PrimitiveDateTime {
    fn into(self) -> DateTimeString {
        DateTimeString(self.assume_utc().format(&Rfc3339).unwrap())
    }
}
