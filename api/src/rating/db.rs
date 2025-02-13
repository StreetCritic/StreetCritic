use super::CreateRating;
use crate::db::commit_transaction;
use crate::error::APIError;
use crate::ConnectionPool;

/// Creates the given way and returns its new id.
pub async fn create_rating(
    pool: ConnectionPool,
    payload: CreateRating,
    user_id: &str,
) -> Result<i32, APIError> {
    let mut conn = pool.get().await.map_err(|e| APIError::DatabaseError {
        message: e.to_string(),
    })?;
    let mut transaction = conn
        .transaction()
        .await
        .map_err(|e| APIError::DatabaseError {
            message: e.to_string(),
        })?;

    let way_id = match payload.way_id {
        Some(id) => id,
        None => {
            // TODO return parameter error
            crate::way::db::create_way_on_transaction(
                &mut transaction,
                &payload
                    .segments
                    .expect("Segments needed when way_id is missing"),
                None,
                &user_id,
            )
            .await?
        }
    };

    let row = transaction
        .query_one("INSERT INTO way_rating (user_id, way_id, datetime, general_rating, safety_rating, comfort_rating, beauty_rating, comment) VALUES($1, $2, NOW(), $3, $4, $5, $6, $7) RETURNING id",
                   &[&user_id, &way_id, &(payload.general_rating as i32), &(payload.safety_rating as i32), &(payload.comfort_rating as i32), &(payload.beauty_rating as i32), &payload.comment])
        .await
        .map_err(|e| APIError::DatabaseError { message: e.to_string()})
        ?;
    let way_rating_id: i32 = row.get("id");
    {
        let statement = transaction
            .prepare("INSERT INTO way_rating_tag (way_rating_id, name) VALUES($1, $2)")
            .await
            .map_err(|e| APIError::DatabaseError {
                message: e.to_string(),
            })?;

        for tag in &payload.tags {
            transaction
                .execute(&statement, &[&way_rating_id, &tag])
                .await
                .map_err(|e| APIError::DatabaseError {
                    message: e.to_string(),
                })?;
        }
    }
    commit_transaction(transaction).await?;
    Ok(way_rating_id)
}
