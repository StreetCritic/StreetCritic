use axum::{
    extract::{Extension, Request},
    http::{HeaderMap, StatusCode},
    middleware::Next,
    response::Response,
};
use tracing::trace;

use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};

use crate::config::TokenConfig;

#[derive(Debug, Clone)]
pub struct User {
    pub id: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
    // name: String,
}

/// Authorization middleware. Checks for a valid JSON Web Token.
pub async fn auth(
    Extension(config): Extension<TokenConfig>,
    headers: HeaderMap,
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    match get_token(&headers) {
        Some(token) => match get_user_from_token(token, &config) {
            Some(user) => {
                request.extensions_mut().insert(user);
                Ok(next.run(request).await)
            }
            _ => Err(StatusCode::UNAUTHORIZED),
        },
        _ => Err(StatusCode::UNAUTHORIZED),
    }
}

/// Retrieve the authorization token from the headers.
fn get_token(headers: &HeaderMap) -> Option<&str> {
    headers
        .get(http::header::AUTHORIZATION)
        .and_then(|v| v.to_str().ok())
        .and_then(|v| {
            if v.starts_with("Bearer ") {
                Some(&v[7..])
            } else {
                trace! {"Token does not start with \"Bearer\""}
                None
            }
        })
}

/// Check if the given token is valid and return User if so.
fn get_user_from_token(token: &str, config: &TokenConfig) -> Option<User> {
    let mut validation = Validation::new(Algorithm::RS256);
    validation.set_audience(&[config.audience.as_str()]);
    validation.set_issuer(&[config.issuer.as_str()]);
    let key = &DecodingKey::from_rsa_pem(&config.sign_public_key.as_ref()).unwrap();
    match decode::<Claims>(&token, &key, &validation) {
        Ok(token) => Some(User {
            id: token.claims.sub,
        }),
        Err(e) => {
            trace! {"Token could not be decoded: {:?}", e}
            None
        }
    }
}
