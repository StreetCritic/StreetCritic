use crate::{internal_error, middleware::auth::User, routing::Includes, ConnectionPool};
use axum::{extract::{Path, Query, State}, http::StatusCode, Extension, Json};
use serde::Deserialize;
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

/// Retrieves account data.
pub async fn get_account(
    Path(username): Path<String>,
    State(pool): State<ConnectionPool>,
) -> Result<Json<Account>, (StatusCode, String)> {
    let conn = pool.get().await.map_err(internal_error)?;
    let row = conn
        .query_one(
            format!(
                r"
            SELECT *
            FROM account
            WHERE username=$1
            ")
            .as_str(),
            &[&username],
        )
        .await
        .map_err(internal_error)?;

    let account = Account {
        id: row.get("id"),
        username: row.get("username"),
        name: row.get("name"),
    };
    Ok(Json(account))
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
