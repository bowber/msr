use serde::{Deserialize, Serialize};
use serde_with::{serde_as, skip_serializing_none, TimestampSeconds};

use super::{errors::DataError, setup::get_db_connection};

#[derive(Serialize, Deserialize, Debug, Clone, sqlx::Type)]
pub enum HostRole {
    #[serde(rename = "controller")]
    Controller,
    #[serde(rename = "worker")]
    Worker,
    #[serde(rename = "single")]
    Single,
    #[serde(rename = "controller+worker")]
    ControllerAndWorker,
}

#[skip_serializing_none]
#[serde_as]
#[derive(Serialize, Deserialize, Debug, Clone, sqlx::FromRow)]
pub struct Host {
    pub id: i64,
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
    pub role: Option<HostRole>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GetHostOptions {
    pub cluster_id: Option<i64>,
    pub host_id: Option<i64>,
}

#[derive(Serialize, Deserialize, Debug, Clone, sqlx::FromRow)]
pub struct CreateHost {
    pub name: String,
    pub address: String,
    pub ssh_user: String,
    pub ssh_key_path: Option<String>,
    pub ssh_password: Option<String>,
    pub cluster_id: Option<i64>,
    pub role: Option<HostRole>,
}

#[derive(Serialize, Deserialize, Debug, Clone, sqlx::FromRow)]
pub struct UpdateHost {
    pub id: i64,
    pub name: String,
    pub address: Option<String>,
    pub ssh_user: Option<String>,
    pub ssh_key_path: Option<String>,
    pub ssh_password: Option<String>,
    pub cluster_id: Option<i64>,
    pub role: Option<HostRole>,
}

pub async fn create_hosts_table() -> Result<(), DataError> {
    let pool = get_db_connection().await?;
    let create_table_query = r#"
        CREATE TABLE IF NOT EXISTS hosts (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            ssh_user TEXT NOT NULL,
            ssh_key_path TEXT,
            ssh_password TEXT,
            cluster_id INTEGER REFERENCES clusters(id) ON DELETE SET NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            role TEXT
        )
    "#;

    let table_existed = sqlx::query(
        r#"
        SELECT name FROM sqlite_master WHERE type='table' AND name='hosts'
        "#,
    )
    .fetch_one(pool)
    .await
    .map(|_r| true)
    .or_else(|_e| Ok(false));
    if table_existed? {
        println!("Table hosts already exists, updating schema...");
        // Rename old table
        sqlx::query(r#"ALTER TABLE hosts RENAME TO hosts_old"#)
            .execute(pool)
            .await
            .map_err(|e| {
                eprintln!("Error renaming old hosts table: {:?}", e);
                DataError::InitTableError
            })?;

        // Create new table
        sqlx::query(create_table_query)
            .execute(pool)
            .await
            .map_err(|e| {
                eprintln!("Error creating new hosts table: {:?}", e);
                DataError::InitTableError
            })?;

        // Copy data from old table to new table
        sqlx::query(r#"
            INSERT INTO hosts (id, name, address, ssh_user, ssh_key_path, ssh_password, cluster_id, created_at, updated_at, role)
            SELECT id, name, address, ssh_user, ssh_key_path, ssh_password, cluster_id, created_at, updated_at, role
            FROM hosts_old
        "#)
        .execute(pool)
        .await
        .map_err(|e| {
            eprintln!("Error copying data to new hosts table: {:?}", e);
            DataError::InitTableError
        })?;

        // Drop old table
        sqlx::query(r#"DROP TABLE hosts_old"#)
            .execute(pool)
            .await
            .map_err(|e| {
                eprintln!("Error dropping old hosts table: {:?}", e);
                DataError::InitTableError
            })?;
    } else {
        println!("Created hosts table");
    }
    Ok(())
}

pub async fn get_hosts(options: GetHostOptions) -> Result<Vec<Host>, DataError> {
    let pool = get_db_connection().await?;
    let hosts = sqlx::query_as::<_, Host>(
        r#"
        SELECT 
            id, address, name, ssh_user, ssh_key_path, ssh_password, cluster_id, created_at, updated_at, role
        FROM hosts
        WHERE
            ($1 IS NULL OR cluster_id = $1)
            AND ($2 IS NULL OR id = $2)
        "#,
    )
    .bind(options.cluster_id)
    .bind(options.host_id)
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

pub async fn get_hosts_by_ids(ids: &Vec<i64>) -> Result<Vec<Host>, DataError> {
    let pool = get_db_connection().await?;
    let condition = format!("WHERE id IN ({:?})", ids)
        .replace("[", "")
        .replace("]", "");
    let query = format!(
        r#"
        SELECT 
            id, address, name, ssh_user, ssh_key_path, ssh_password, cluster_id, created_at, updated_at, role
        FROM hosts
        {condition}
        "#,
        condition = condition
    );
    let hosts = sqlx::query_as::<_, Host>(&query).fetch_all(pool).await;

    match hosts {
        Ok(hosts) => Ok(hosts),
        Err(e) => {
            eprintln!("Error getting hosts: {:?}", e);
            return Err(DataError::ReadError);
        }
    }
}

pub async fn add_host(host: &CreateHost) -> Result<(), DataError> {
    let pool = get_db_connection().await?;
    println!("Adding host: {:?}", host);
    let result = sqlx::query(
        r#"
        INSERT INTO hosts 
        (name, address, ssh_user, ssh_key_path, ssh_password, cluster_id, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        "#,
    )
    .bind(&host.name)
    .bind(&host.address)
    .bind(&host.ssh_user)
    .bind(&host.ssh_key_path)
    .bind(&host.ssh_password)
    .bind(&host.cluster_id)
    .bind(&host.role)
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

pub async fn delete_host(id: i64) -> Result<(), DataError> {
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

pub async fn update_host(host: &UpdateHost) -> Result<(), DataError> {
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
            role = $8,
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
    .bind(&host.role)
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

pub async fn update_hosts_cluster(host_ids: &Vec<i64>, cluster_id: i64) -> Result<(), DataError> {
    let condition = format!("WHERE id IN ({:?})", host_ids)
        .replace("[", "")
        .replace("]", "");
    let query = format!(
        r#"
        UPDATE hosts
        SET cluster_id = $1
        {condition}
        "#,
        condition = condition
    );
    println!(
        "Updating hosts cluster: {:?} {} {}",
        host_ids, cluster_id, query
    );
    let pool = get_db_connection().await?;
    let result = sqlx::query(&query).bind(cluster_id).execute(pool).await;

    match result {
        Ok(r) => {
            println!("Result: {:?}", r);
            Ok(())
        }
        Err(e) => {
            eprintln!("Error updating hosts cluster: {:?}", e);
            Err(DataError::UpdateError)
        }
    }?;
    Ok(())
}
