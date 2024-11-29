use serde::{Deserialize, Serialize};
use serde_with::{serde_as, skip_serializing_none, TimestampSeconds};

use super::{errors::DataError, setup::get_db_connection};

#[skip_serializing_none]
#[serde_as]
#[derive(Serialize, Deserialize, Debug, Clone, sqlx::FromRow)]
pub struct Cluster {
    pub id: i32,
    pub name: String,
    pub lb_address: String,
    #[serde_as(as = "TimestampSeconds<i64>")]
    pub created_at: sqlx::types::time::PrimitiveDateTime,
    #[serde_as(as = "TimestampSeconds<i64>")]
    pub updated_at: sqlx::types::time::PrimitiveDateTime,
}

#[derive(Serialize, Deserialize, Debug, Clone, sqlx::FromRow)]
pub struct CreateCluster {
    pub name: String,
    pub lb_address: String,
}

#[derive(Serialize, Deserialize, Debug, Clone, sqlx::FromRow)]
pub struct UpdateCluster {
    pub id: i32,
    pub name: String,
    pub lb_address: Option<String>,
}

pub async fn create_clusters_table() -> Result<(), DataError> {
    let pool = get_db_connection().await?;
    let result = sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS clusters (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            lb_address TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        "#,
    )
    .execute(pool)
    .await;

    match result {
        Ok(_) => Ok(()),
        Err(e) => {
            eprintln!("Error creating clusters table: {:?}", e);
            Err(DataError::InitTableError)?
        }
    }?;
    Ok(())
}

pub async fn get_clusters() -> Result<Vec<Cluster>, DataError> {
    let pool = get_db_connection().await?;
    let clusters = sqlx::query_as::<_, Cluster>(
        r#"
        SELECT 
            id, lb_address, name, created_at, updated_at
        FROM clusters
        "#,
    )
    .fetch_all(pool)
    .await;

    match clusters {
        Ok(clusters) => Ok(clusters),
        Err(e) => {
            eprintln!("Error getting clusters: {:?}", e);
            return Err(DataError::ReadError);
        }
    }
}

pub async fn add_cluster(cluster: CreateCluster) -> Result<(), DataError> {
    let pool = get_db_connection().await?;
    println!("Adding cluster: {:?}", cluster);
    let result = sqlx::query(
        r#"
        INSERT INTO clusters 
        (name, lb_address, )
        VALUES ($1, $2)
        "#,
    )
    .bind(&cluster.name)
    .bind(&cluster.lb_address)
    .execute(pool)
    .await;
    match result {
        Ok(_) => Ok(()),
        Err(e) => {
            eprintln!("Error adding cluster: {:?}", e);
            Err(DataError::InsertError)
        }
    }?;

    Ok(())
}

pub async fn delete_cluster(id: i32) -> Result<(), DataError> {
    let pool = get_db_connection().await?;
    let result = sqlx::query(
        r#"
        DELETE FROM clusters WHERE id = $1
        "#,
    )
    .bind(id)
    .execute(pool)
    .await;

    match result {
        Ok(_) => Ok(()),
        Err(e) => {
            eprintln!("Error deleting cluster: {:?}", e);
            Err(DataError::DeleteError)
        }
    }?;
    Ok(())
}

pub async fn update_cluster(cluster: UpdateCluster) -> Result<(), DataError> {
    let pool = get_db_connection().await?;
    println!("Updating cluster: {:?}", cluster);
    let result = sqlx::query(
        r#"
        UPDATE clusters
        SET lb_address = $1, 
            name = $2, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        "#,
    )
    .bind(&cluster.lb_address)
    .bind(&cluster.name)
    .bind(&cluster.id)
    .execute(pool)
    .await;

    match result {
        Ok(_) => Ok(()),
        Err(e) => {
            eprintln!("Error updating cluster: {:?}", e);
            Err(DataError::UpdateError)
        }
    }?;
    Ok(())
}
