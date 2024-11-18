use serde::Serialize;

#[derive(Debug, Serialize)]
pub enum DataError {
    PathError,
    PoolConnectionError,
    InitDatabaseError,
    ReadError,
    K0sctlDownloadError,
    InitTableError,
    // AlterTableError,
    InsertError,
    DeleteError,
    UpdateError,
}
