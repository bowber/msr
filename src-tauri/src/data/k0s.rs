#[cfg(unix)]
use std::{os::unix::fs::PermissionsExt, result};

use serde::{Deserialize, Serialize};

use super::{errors::DataError, setup::get_db_connection};

const K0SCTL_VERSION: &str = "v0.19.0";

#[derive(Serialize, Deserialize, Debug, Clone, sqlx::Type)]
pub enum HostRole {
    Controller,
    Worker,
}

#[derive(Serialize, Deserialize, Debug, Clone, sqlx::FromRow)]
pub struct Host {
    pub id: i32,
    pub name: String,
    pub address: String,
    pub ssh_user: String,
    pub ssh_key_path: Option<String>,
    pub ssh_password: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, sqlx::FromRow)]
pub struct CreateHost {
    pub name: String,
    pub address: String,
    pub ssh_user: String,
    pub ssh_key_path: Option<String>,
    pub ssh_password: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, sqlx::FromRow)]
pub struct UpdateHost {
    pub id: i32,
    pub name: String,
    pub address: Option<String>,
    pub ssh_user: Option<String>,
    pub ssh_key_path: Option<String>,
    pub ssh_password: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct K0SInitParams {
    pub cluster_name: String,
    pub hosts: Vec<Host>,
}

#[derive(Debug)]
pub enum StatusTypes {
    Running,
    Stopped,
    Error,
}

// trait Status {
//     async fn status(&self) -> Result<(), StatusTypes>;
// }

// impl Status for Host {
//     async fn status(&self) -> Result<(), StatusTypes> {
//         // SSH into the host and check the status of the host
//     }
// }

pub async fn init_k0s_cluster(opt: K0SInitParams) -> Result<(), String> {
    Ok(())
}

pub fn download_k0sctl_binary() -> Result<(), Box<dyn std::error::Error>> {
    let os = std::env::consts::OS;
    let arch = std::env::consts::ARCH;
    let mapped_os = match os {
        "windows" => "win",
        "linux" => "linux",
        "macos" => "darwin",
        _ => panic!("Unsupported OS: {}", os),
    };
    let mapped_arch = match arch {
        "x86_64" => "amd64",
        "aarch64" => "arm64",
        "arm" => "arm",
        _ => panic!("Unsupported arch: {}", arch),
    };
    println!("OS: {}, Arch: {}", os, arch);
    println!("K0SCTL_VERSION: {}", K0SCTL_VERSION);
    let ext = match os {
        "windows" => ".exe",
        _ => "",
    };
    let download_link = format!(
        "https://github.com/k0sproject/k0sctl/releases/download/{}/k0sctl-{}-{}{}",
        K0SCTL_VERSION, mapped_os, mapped_arch, ext
    );
    println!("Download link: {}", download_link);
    let filepath = crate::paths::K0SCTL_BINARY_PATH
        .get()
        .unwrap()
        .to_str()
        .unwrap();
    if std::path::Path::new(&filepath).exists() {
        println!("k0sctl binary already exists, skipping download");
        return Ok(());
    }
    let output = std::process::Command::new("curl")
        .arg("-L")
        .arg("--create-dirs")
        .arg("-o")
        .arg(&filepath)
        .arg(download_link)
        .output()
        .expect("Failed to download k0sctl binary");
    if !output.status.success() {
        panic!(
            "Failed to download k0sctl binary: {}",
            String::from_utf8_lossy(&output.stderr)
        );
    }
    #[cfg(unix)]
    std::fs::set_permissions(filepath, std::fs::Permissions::from_mode(0o755))?;
    Ok(())
}

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
            ssh_password TEXT
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
    Ok(())
}

pub async fn get_hosts() -> Result<Vec<Host>, DataError> {
    let pool = get_db_connection().await?;
    let hosts = sqlx::query_as::<_, Host>(
        r#"
        SELECT 
            id, address, name, ssh_user, ssh_key_path, ssh_password, role
        FROM hosts
        "#,
    )
    .fetch_all(pool)
    .await
    .map_err(|_| DataError::ReadError)?;
    Ok(hosts)
}

pub async fn add_host(host: CreateHost) -> Result<(), DataError> {
    let pool = get_db_connection().await?;
    println!("Adding host: {:?}", host);
    let result = sqlx::query(
        r#"
        INSERT INTO hosts (name, address, ssh_user, ssh_key_path, ssh_password)
        VALUES ($1, $2, $3, $4, $5)
        "#,
    )
    .bind(&host.name)
    .bind(&host.address)
    .bind(&host.ssh_user)
    .bind(&host.ssh_key_path)
    .bind(&host.ssh_password)
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
    let result = sqlx::query(
        r#"
        UPDATE hosts
        SET address = $1, ssh_user = $2, ssh_key_path = $3, name: $4, ssh_password = $5
        WHERE id = $6
        "#,
    )
    .bind(&host.address)
    .bind(&host.ssh_user)
    .bind(&host.ssh_key_path)
    .bind(&host.name)
    .bind(&host.ssh_password)
    .bind(&host.id)
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
