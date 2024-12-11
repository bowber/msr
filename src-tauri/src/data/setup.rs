use super::clusters::create_clusters_table;
use super::errors::DataError;
use super::hosts::create_hosts_table;
use sqlx::migrate::MigrateDatabase;
use sqlx::sqlite::SqlitePool;
use sqlx::{self, Executor};
use tokio::sync::OnceCell;

pub static DB_CONNECTION: OnceCell<SqlitePool> = OnceCell::const_new();

pub async fn get_db_connection() -> Result<&'static SqlitePool, DataError> {
    let con = DB_CONNECTION
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
        .await;
    match con {
        Ok(con) => {
            con.execute("PRAGMA foreign_keys = ON").await.map_err(|e| {
                eprintln!("Error setting foreign keys: {:?}", e);
                DataError::PoolConnectionError
            })?;
            Ok(con)
        }
        Err(e) => {
            eprintln!("Error getting db connection: {:?}", e);
            Err(DataError::PoolConnectionError)
        }
    }
}

pub async fn try_init_db() -> Result<(), DataError> {
    create_hosts_table().await?;
    create_clusters_table().await?;
    Ok(())
}
