#[derive(Debug)]
pub enum APIError {
    DatabaseError { message: String },
}

impl std::fmt::Display for APIError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match *self {
            APIError::DatabaseError { ref message } => write!(f, "Database error: {message}"),
        }
    }
}

impl std::error::Error for APIError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        None
    }
}
