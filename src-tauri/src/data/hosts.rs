use serde::{Deserialize, Serialize};
use serde_with::{serde_as, skip_serializing_none, TimestampSeconds};

use super::{errors::DataError, setup::get_db_connection};

#[derive(Serialize, Deserialize, Debug, Clone, sqlx::Type)]
pub enum HostRole {
    Controller,
    Worker,
}

#[skip_serializing_none]
#[serde_as]
#[derive(Serialize, Deserialize, Debug, Clone, sqlx::FromRow)]
pub struct Host {
    pub id: i32,
    pub name: String,
    pub address: String,
    pub ssh_user: String,
    pub ssh_key_path: Option<String>,
    pub ssh_password: Option<String>,
    pub cluster_id: Option<i64>,
    #[serde_as(as = "TimestampSeconds<i64>")]
    pub created_at: sqlx::types::time::PrimitiveDateTime,
    #[serde_as(as = "TimestampSeconds<i64>")]
    pub updated_at: sqlx::types::time::PrimitiveDateTime,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GetHostOptions {
    pub cluster_id: Option<i64>,
}
#[derive(Serialize, Deserialize, Debug, Clone, sqlx::FromRow)]
pub struct CreateHost {
    pub name: String,
    pub address: String,
    pub ssh_user: String,
    pub ssh_key_path: Option<String>,
    pub ssh_password: Option<String>,
    pub cluster_id: Option<i64>,
}

#[derive(Serialize, Deserialize, Debug, Clone, sqlx::FromRow)]
pub struct UpdateHost {
    pub id: i32,
    pub name: String,
    pub address: Option<String>,
    pub ssh_user: Option<String>,
    pub ssh_key_path: Option<String>,
    pub ssh_password: Option<String>,
    pub cluster_id: Option<i64>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct K0SInitParams {
    pub cluster_name: String,
    pub hosts: Vec<Host>,
}

// #[derive(Debug)]
// pub enum StatusTypes {
//     Running,
//     Stopped,
//     Error,
// }

// trait Status {
//     async fn status(&self) -> Result<(), StatusTypes>;
// }

// impl Status for Host {
//     async fn status(&self) -> Result<(), StatusTypes> {
//         // SSH into the host and check the status of the host
//     }
// }

// pub async fn init_k0s_cluster(opt: K0SInitParams) -> Result<(), String> {
//     Ok(())
// }

pub async fn create_hosts_table() -> Result<(), DataError> {
    let pool = get_db_connection().await?;
    let result = sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS hosts (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            ssh_user TEXT NOT NULL,
            ssh_key_path TEXT,
            ssh_password TEXT,
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
            eprintln!("Error creating hosts table: {:?}", e);
            Err(DataError::InitTableError)?
        }
    }?;

    sqlx::query(
        r#"
        ALTER TABLE hosts
        ADD COLUMN cluster_id INTEGER REFERENCES clusters(id)
        "#,
    )
    .execute(pool)
    .await
    .ok();

    Ok(())
}

pub async fn get_hosts(options: GetHostOptions) -> Result<Vec<Host>, DataError> {
    let pool = get_db_connection().await?;
    let hosts = sqlx::query_as::<_, Host>(
        r#"
        SELECT 
            id, address, name, ssh_user, ssh_key_path, ssh_password, cluster_id, created_at, updated_at
        FROM hosts
        WHERE
            $1 IS NULL OR cluster_id = $1
        "#,
    )
    .bind(options.cluster_id)
    .fetch_all(pool)
    .await;

    match hosts {
        Ok(hosts) => Ok(hosts),
        Err(e) => {
            eprintln!("Error getting hosts: {:?}", e);
            return Err(DataError::ReadError);
        }
    }
}

pub async fn add_host(host: CreateHost) -> Result<(), DataError> {
    let pool = get_db_connection().await?;
    println!("Adding host: {:?}", host);
    let result = sqlx::query(
        r#"
        INSERT INTO hosts 
        (name, address, ssh_user, ssh_key_path, ssh_password, cluster_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        "#,
    )
    .bind(&host.name)
    .bind(&host.address)
    .bind(&host.ssh_user)
    .bind(&host.ssh_key_path)
    .bind(&host.ssh_password)
    .bind(&host.cluster_id)
    .execute(pool)
    .await;
    match result {
        Ok(_) => Ok(()),
        Err(e) => {
            eprintln!("Error adding host: {:?}", e);
            Err(DataError::InsertError)
        }
    }?;

    Ok(())
}

pub async fn delete_host(id: i32) -> Result<(), DataError> {
    let pool = get_db_connection().await?;
    let result = sqlx::query(
        r#"
        DELETE FROM hosts WHERE id = $1
        "#,
    )
    .bind(id)
    .execute(pool)
    .await;

    match result {
        Ok(_) => Ok(()),
        Err(e) => {
            eprintln!("Error deleting host: {:?}", e);
            Err(DataError::DeleteError)
        }
    }?;
    Ok(())
}

pub async fn update_host(host: UpdateHost) -> Result<(), DataError> {
    let pool = get_db_connection().await?;
    println!("Updating host: {:?}", host);
    let result = sqlx::query(
        r#"
        UPDATE hosts
        SET address = $1, 
            ssh_user = $2, 
            ssh_key_path = $3, 
            name = $4, 
            ssh_password = $5,
            cluster_id = $7,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        "#,
    )
    .bind(&host.address)
    .bind(&host.ssh_user)
    .bind(&host.ssh_key_path)
    .bind(&host.name)
    .bind(&host.ssh_password)
    .bind(&host.id)
    .bind(&host.cluster_id)
    .execute(pool)
    .await;

    match result {
        Ok(_) => Ok(()),
        Err(e) => {
            eprintln!("Error updating host: {:?}", e);
            Err(DataError::UpdateError)
        }
    }?;
    Ok(())
}
