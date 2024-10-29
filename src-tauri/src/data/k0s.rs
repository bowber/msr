use std::os::unix::fs::PermissionsExt;

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
    pub address: String,
    pub ssh_user: String,
    pub ssh_key_path: String,
    pub role: HostRole,
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
    std::fs::set_permissions(filepath, std::fs::Permissions::from_mode(0o755))?;
    Ok(())
}

pub async fn get_hosts() -> Result<Vec<Host>, DataError> {
    let pool = get_db_connection().await?;
    let hosts = sqlx::query_as::<_, Host>(
        r#"
        SELECT id FROM hosts
        "#,
    )
    .fetch_all(pool)
    .await
    .map_err(|_| DataError::ReadError)?;
    Ok(hosts)
}
