use std::env;

use super::errors::DataError;
use super::k0s::Host;
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
    // CREATE TABLE IF NOT EXISTS
    let pool = get_db_connection().await?;
    // pub struct Host {
    //     pub id: i32,
    //     pub name: String,
    //     pub address: String,
    //     pub ssh_user: String,
    //     pub ssh_key_path: String,
    //     pub role: HostRole,
    // }
    let result = sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS hosts (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            ssh_user TEXT NOT NULL,
            ssh_key_path TEXT NOT NULL,
            role INTEGER NOT NULL
        )
        "#,
    )
    .execute(pool)
    .await
    .map_err(|_| DataError::InitDatabaseError)?;
    Ok(())
}
