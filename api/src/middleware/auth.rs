use axum::{
    extract::{Extension, Request},
    http::{HeaderMap, StatusCode},
    middleware::Next,
    response::Response,
};

use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use serde::{Deserialize, Serialize};

use crate::config::TokenConfig;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
    name: String,
}

/// Authorization middleware. Checks for a valid JSON Web Token.
pub async fn auth(
    Extension(config): Extension<TokenConfig>,
    headers: HeaderMap,
    request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    match get_token(&headers) {
        Some(token) if token_is_valid(token, &config) => Ok(next.run(request).await),
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
                None
            }
        })
}

/// Check if the given token is valid.
fn token_is_valid(token: &str, config: &TokenConfig) -> bool {
    let mut validation = Validation::new(Algorithm::RS256);
    validation.set_audience(&[config.audience.as_str()]);
    validation.set_issuer(&[config.issuer.as_str()]);
    let key = &DecodingKey::from_rsa_pem(&config.sign_public_key.as_ref()).unwrap();
    match decode::<Claims>(&token, &key, &validation) {
        Ok(_token) => true,
        Err(_e) => false,
    }
}
