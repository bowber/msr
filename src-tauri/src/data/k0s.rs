#[cfg(unix)]
use std::os::unix::fs::PermissionsExt;

use serde;
use serde::{Deserialize, Serialize};

use super::hosts::HostRole;
const K0SCTL_VERSION: &str = "v0.19.0";

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct K0SMetadata {
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct K0SSSH {
    pub address: String,
    pub user: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct K0SHost {
    pub role: HostRole,
    pub ssh: K0SSSH,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct K0SInitSpec {
    pub hosts: Vec<K0SHost>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct K0SInitParams {
    pub api_version: String,
    pub kind: String,
    pub metadata: K0SMetadata,
    pub spec: K0SInitSpec,
}

impl Default for K0SInitParams {
    fn default() -> Self {
        K0SInitParams {
            api_version: "k0s.k0sproject.io/v1beta1".to_string(),
            kind: "Cluster".to_string(),
            metadata: K0SMetadata {
                name: "k0s-cluster".to_string(),
            },
            spec: K0SInitSpec { hosts: vec![] },
        }
    }
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

pub async fn apply_cluster(params: &K0SInitParams) -> Result<(), Box<dyn std::error::Error>> {
    let yaml = serde_yaml::to_string(params)?;
    println!("init_cluster YAML: {}", &yaml);
    Ok(())
}
