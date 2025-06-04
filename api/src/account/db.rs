use crate::error::APIError;
use crate::{middleware::auth::User, ConnectionPool};

/// Inserts or updates account data.
pub async fn update_account(pool: ConnectionPool, user: &User) -> Result<(), APIError> {
    let conn = pool.get().await.map_err(|e| APIError::DatabaseError {
        message: e.to_string(),
    })?;
    conn
        .execute(
            "
INSERT INTO account (id, username, name)
VALUES ($1, $2, $3)
ON CONFLICT (id) DO UPDATE
SET username = EXCLUDED.username,
    name = EXCLUDED.name
",
            &[&user.id, &user.username, &user.name],
        )
        .await
        .map_err(|e| APIError::DatabaseError {
            message: e.to_string(),
        })?;
    Ok(())
}
