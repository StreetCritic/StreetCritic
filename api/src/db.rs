use crate::error::APIError;
use tokio_postgres::Transaction;

/// Commits the given transaction.
pub async fn commit_transaction(transaction: Transaction<'_>) -> Result<(), APIError> {
    transaction
        .commit()
        .await
        .map_err(|e| APIError::DatabaseError {
            message: format!("Could not commit transaction: {}", e),
        })?;
    Ok(())
}
