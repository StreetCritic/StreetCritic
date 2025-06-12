use crate::{internal_error, middleware::auth::User, ConnectionPool};
use axum::{extract::State, http::StatusCode, Extension};
use ts_rs::TS;

pub mod db;

#[derive(TS)]
#[ts(export)]
#[derive(serde::Serialize, serde::Deserialize)]
pub struct Account {
    pub id: String,
    pub username: Option<String>,
    pub name: Option<String>,
}

/// Different types of account data.
#[derive(TS)]
#[ts(export)]
#[derive(serde::Serialize, serde::Deserialize)]
#[serde(untagged)]
pub enum AccountData {
    /// Only the ID of the account.
    ID(String),
    /// Full account details.
    Details(Account),
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
