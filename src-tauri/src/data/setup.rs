use sqlx::sqlite::SqlitePool;

pub async fn get_db_connection() -> Result<SqlitePool, String> {
    let Option(path) = crate::paths::SQLITE_PATH.get();
    match SqlitePool::connect(path).await {
        Ok(pool) => Ok(pool),
        Err(e) => Err(e.to_string()),
    }
}
