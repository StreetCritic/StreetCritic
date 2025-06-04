use crate::{internal_error, middleware::auth::User, ConnectionPool};
use axum::{extract::State, http::StatusCode, Extension};
use ts_rs::TS;

mod db;

#[derive(TS)]
#[ts(export)]
#[derive(serde::Serialize, serde::Deserialize)]
pub struct Account {
    id: u32,
    username: Option<String>,
    name: Option<String>,
}

/// Updates the user's account.
///
/// Currently only gets updates from user's claim.
pub async fn update_account(
    Extension(user): Extension<User>,
    State(pool): State<ConnectionPool>,
) -> Result<(), (StatusCode, String)> {
    db::update_account(pool, &user)
        .await
        .map_err(internal_error)?;
    Ok(())
}
