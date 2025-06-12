use crate::{
    account::{db::SQL_ALIASED_FIELDS, Account, AccountData},
    internal_error,
    middleware::auth::User,
    routing::Includes,
    time::DateTimeString,
    way::Segment,
    ConnectionPool,
};
use axum::{
    extract::{Query, State},
    http::StatusCode,
    Extension, Json,
};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

mod db;

#[derive(TS)]
#[ts(export)]
#[derive(Serialize, Deserialize)]
pub struct Rating {
    id: i32,
    way_id: i32,
    user: AccountData,
    datetime: DateTimeString,
    general_rating: u8,
    safety_rating: u8,
    comfort_rating: u8,
    beauty_rating: u8,
    tags: Vec<String>,
    comment: String,
}

/// Response object for the rating create endpoint.
#[derive(Serialize)]
pub struct CreateRatingResponse {
    id: i32,
}

/// Create a rating for an existing or a to be created way.
pub async fn create_rating(
    Extension(user): Extension<User>,
    State(pool): State<ConnectionPool>,
    Json(payload): Json<CreateRating>,
) -> Result<Json<CreateRatingResponse>, (StatusCode, String)> {
    let id = db::create_rating(pool, payload, &user.id)
        .await
        .map_err(internal_error)?;
    Ok(Json(CreateRatingResponse { id }))
}

#[derive(Deserialize)]
pub struct CreateRating {
    general_rating: u8,
    safety_rating: u8,
    comfort_rating: u8,
    beauty_rating: u8,
    way_id: Option<i32>,
    segments: Option<Vec<Segment>>,
    comment: String,
    tags: Vec<String>,
}

#[derive(Deserialize)]
pub struct GetRatingsParams {
    way_id: i32,
    include: Includes,
}

/// Retrieves ratings
pub async fn get_ratings(
    Query(params): Query<GetRatingsParams>,
    State(pool): State<ConnectionPool>,
) -> Result<Json<Vec<Rating>>, (StatusCode, String)> {
    params.include.expect_only(&["user"])?;

    let conn = pool.get().await.map_err(internal_error)?;

    let rows = conn
        .query(
            format!(
                r"
            SELECT *, {SQL_ALIASED_FIELDS}
            FROM way_rating
            LEFT JOIN account
            ON user_id=account.id
            WHERE way_id=$1
"
            )
            .as_str(),
            &[&params.way_id],
        )
        .await
        .map_err(internal_error)?;

    let mut ratings = Vec::new();
    let tag_query = conn
        .prepare(
            r"
            SELECT name
            FROM way_rating_tag
            WHERE way_rating_id=$1
",
        )
        .await
        .unwrap();
    for row in &rows {
        let id = row.get::<_, i32>("id").try_into().unwrap();

        let tag_rows = conn
            .query(&tag_query, &[&id])
            .await
            .map_err(internal_error)?;

        let mut tags: Vec<String> = Vec::new();
        for tag_row in tag_rows {
            tags.push(tag_row.get("name"))
        }

        let user = if params.include.contains("user") {
            AccountData::Details(Account {
                id: row.get("user_id"),
                username: row.get("account_username"),
                name: row.get("account_name"),
            })
        } else {
            AccountData::ID(row.get("user_id"))
        };

        ratings.push(Rating {
            id,
            // user_id: row.get("user_id"),
            user,
            way_id: 0,
            general_rating: row.get::<_, i32>("general_rating").try_into().unwrap(),
            safety_rating: row.get::<_, i32>("safety_rating").try_into().unwrap(),
            beauty_rating: row.get::<_, i32>("beauty_rating").try_into().unwrap(),
            comfort_rating: row.get::<_, i32>("comfort_rating").try_into().unwrap(),
            datetime: row.get::<_, time::PrimitiveDateTime>("datetime").into(),
            comment: row.get("comment"),
            tags,
        });
    }
    Ok(Json(ratings))
}
