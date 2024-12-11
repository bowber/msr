use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Serialize, Error)]
pub enum DataError {
    #[error("Error getting path")]
    PathError,
    #[error("Error getting database connection")]
    PoolConnectionError,
    #[error("Error initializing database")]
    InitDatabaseError,
    #[error("Error reading data")]
    ReadError,
    #[error("Error downloading k0sctl")]
    K0sctlDownloadError,
    #[error("Error initializing table")]
    InitTableError,
    // #[error("Error altering table")]
    // AlterTableError,
    #[error("Error inserting data")]
    InsertError,
    #[error("Error deleting data")]
    DeleteError,
    #[error("Error updating data")]
    UpdateError,
}

impl From<DataError> for String {
    fn from(e: DataError) -> Self {
        match e {
            DataError::PathError => "Error getting path".to_string(),
            DataError::PoolConnectionError => "Error getting database connection".to_string(),
            DataError::InitDatabaseError => "Error initializing database".to_string(),
            DataError::ReadError => "Error reading data".to_string(),
            DataError::K0sctlDownloadError => "Error downloading k0sctl".to_string(),
            DataError::InitTableError => "Error initializing table".to_string(),
            // DataError::AlterTableError => "Error altering table".to_string(),
            DataError::InsertError => "Error inserting data".to_string(),
            DataError::DeleteError => "Error deleting data".to_string(),
            DataError::UpdateError => "Error updating data".to_string(),
        }
    }
}
