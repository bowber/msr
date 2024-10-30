use super::errors::DataError;
use super::k0s::create_hosts_table;
use sqlx;
use sqlx::migrate::MigrateDatabase;
use sqlx::sqlite::SqlitePool;
use tokio::sync::OnceCell;

pub static DB_CONNECTION: OnceCell<SqlitePool> = OnceCell::const_new();

pub async fn get_db_connection() -> Result<&'static SqlitePool, DataError> {
    DB_CONNECTION
        .get_or_try_init(|| async {
            let path = crate::paths::SQLITE_PATH
                .get()
                .ok_or(DataError::PathError)?
                .to_str()
                .ok_or(DataError::PathError)?;
            if !sqlx::Sqlite::database_exists(path)
                .await
                .map_err(|_| DataError::InitDatabaseError)?
            {
                sqlx::Sqlite::create_database(path)
                    .await
                    .map_err(|_| DataError::InitDatabaseError)?;
            }

            SqlitePool::connect(path)
                .await
                .map_err(|_| DataError::PoolConnectionError)
        })
        .await
}

pub async fn try_init_db() -> Result<(), DataError> {
    create_hosts_table().await?;
    Ok(())
}
