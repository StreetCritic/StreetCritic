use crate::{internal_error, ConnectionPool};
use axum::{
    extract::{Query, State},
    http::StatusCode,
    Json,
};
use serde::Deserialize;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct Rating {
    id: i32,
    way_id: i32,
    user_id: String,
    datetime: time::PrimitiveDateTime,
    general_rating: u8,
    safety_rating: u8,
    comfort_rating: u8,
    beauty_rating: u8,
    tags: Vec<String>,
    comment: String,
}

pub async fn create_rating(
    State(pool): State<ConnectionPool>,
    Json(payload): Json<CreateRating>,
) -> Result<Json<u64>, (StatusCode, String)> {
    let mut conn = pool.get().await.map_err(internal_error)?;

    let transaction = conn.transaction().await.map_err(internal_error)?;

    let row = transaction
        .query_one("INSERT INTO way_rating (user_id, way_id, datetime, general_rating, safety_rating, comfort_rating, beauty_rating, comment) VALUES(1, $1, NOW(), $2, $3, $4, $5, $6) RETURNING id",
                   &[&payload.way_id, &(payload.general_rating as i32), &(payload.safety_rating as i32), &(payload.comfort_rating as i32), &(payload.beauty_rating as i32), &payload.comment])
        .await
        .map_err(internal_error)?;

    let way_rating_id: i32 = row.get("id");

    {
        let statement = transaction
            .prepare("INSERT INTO way_rating_tag (way_rating_id, name) VALUES($1, $2)")
            .await
            .map_err(internal_error)?;

        for tag in &payload.tags {
            transaction
                .execute(&statement, &[&way_rating_id, &tag])
                .await
                .map_err(internal_error)?;
        }
    }

    transaction.commit().await.map_err(internal_error)?;

    // this will be converted into a JSON response
    // with a status code of `201 Created`
    // (StatusCode::CREATED, Json(rating))
    Ok(Json(1337))
}

#[derive(Deserialize)]
pub struct CreateRating {
    general_rating: u8,
    safety_rating: u8,
    comfort_rating: u8,
    beauty_rating: u8,
    way_id: i32,
    comment: String,
    tags: Vec<String>,
}

#[derive(Deserialize)]
pub struct GetRatingsParams {
    way_id: i32,
}

pub async fn get_ratings(
    Query(params): Query<GetRatingsParams>,
    State(pool): State<ConnectionPool>,
) -> Result<Json<Vec<Rating>>, (StatusCode, String)> {
    let conn = pool.get().await.map_err(internal_error)?;

    let rows = conn
        .query(
            r"
            SELECT *
            FROM way_rating
            WHERE way_id=$1
",
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

        ratings.push(Rating {
            id,
            // user_id: row.get("user_id"),
            user_id: "foo".into(),
            way_id: 0,
            general_rating: row.get::<_, i32>("general_rating").try_into().unwrap(),
            safety_rating: row.get::<_, i32>("safety_rating").try_into().unwrap(),
            beauty_rating: row.get::<_, i32>("beauty_rating").try_into().unwrap(),
            comfort_rating: row.get::<_, i32>("comfort_rating").try_into().unwrap(),
            datetime: row.get("datetime"),
            comment: row.get("comment"),
            tags,
        });
    }
    Ok(Json(ratings))
}
