use http::StatusCode;

use crate::internal_error;

#[derive(Debug)]
pub enum APIError {
    DatabaseError { message: String },
    IncludesError { unexpected: String },
    /// The request is invalid; reported to the client as `400 Bad Request`.
    BadRequest { message: String },
}

impl std::fmt::Display for APIError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match *self {
            APIError::DatabaseError { ref message } => write!(f, "Database error: {message}"),
            APIError::IncludesError { ref unexpected } => {
                write!(f, "Unexpected includes parameter: {unexpected}")
            }
            APIError::BadRequest { ref message } => write!(f, "Bad request: {message}"),
        }
    }
}

impl std::error::Error for APIError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        None
    }
}

impl From<APIError> for (StatusCode, String) {
    fn from(error: APIError) -> Self {
        match error {
            APIError::BadRequest { message } => {
                tracing::warn!("Bad request: {message}");
                (StatusCode::BAD_REQUEST, message)
            }
            error => internal_error(error),
        }
    }
}
