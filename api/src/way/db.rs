use tokio_postgres::Transaction;

use super::Segment;
use crate::db::commit_transaction;
use crate::error::APIError;
use crate::ConnectionPool;

/// Create the given way using the transaction.
pub async fn create_way_on_transaction(
    transaction: &mut Transaction<'_>,
    segments: &Vec<Segment>,
    title: Option<String>,
    user_id: &str,
) -> Result<i32, APIError> {
    let row = transaction
        .query_one(
            "INSERT INTO way (user_id, datetime, title) VALUES($1, NOW(), $2) RETURNING id",
            &[&user_id.to_string(), &title],
        )
        .await
        .map_err(|e| APIError::DatabaseError {
            message: e.to_string(),
        })?;
    let way_id: i32 = row.get("id");
    {
        let statement = transaction
            .prepare(
                "INSERT INTO way_segment (way_id, segment_id, start, stop) VALUES($1, $2 , $3, $4)",
            )
            .await
            .map_err(|e| APIError::DatabaseError {
                message: e.to_string(),
            })?;

        for segment in segments {
            transaction
                .execute(
                    &statement,
                    &[&way_id, &segment.id, &segment.start, &segment.stop],
                )
                .await
                .map_err(|e| APIError::DatabaseError {
                    message: e.to_string(),
                })?;
        }
    }
    Ok(way_id)
}

/// Creates the given way and returns its new id.
pub async fn create_way(
    pool: ConnectionPool,
    segments: &Vec<Segment>,
    title: Option<String>,
    user_id: &str,
) -> Result<i32, APIError> {
    let mut conn = pool.get().await.map_err(|e| APIError::DatabaseError {
        message: format!("Failed to get connection: {}", e),
    })?;
    let mut transaction = conn
        .transaction()
        .await
        .map_err(|e| APIError::DatabaseError {
            message: format!("Could not create transaction: {}", e),
        })?;
    let id = create_way_on_transaction(&mut transaction, segments, title, user_id).await?;
    commit_transaction(transaction).await?;
    Ok(id)
}
