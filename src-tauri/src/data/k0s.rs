#[cfg(unix)]
use std::os::unix::fs::PermissionsExt;
use tokio::time::Duration;

use serde;
use serde::{Deserialize, Serialize};
use tokio::io::AsyncWriteExt;
use tokio::time::timeout;

use super::hosts::{Host, HostRole};
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
    pub reset: Option<bool>,
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

impl From<Host> for K0SHost {
    fn from(host: Host) -> Self {
        K0SHost {
            role: host.role.unwrap_or(HostRole::Worker),
            ssh: K0SSSH {
                address: host.address,
                user: Some(host.ssh_user),
            },
            reset: None,
        }
    }
}

impl Default for K0SInitParams {
    fn default() -> Self {
        K0SInitParams {
            api_version: "k0sctl.k0sproject.io/v1beta1".to_string(),
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

pub async fn reset_cluster(params: &K0SInitParams) -> Result<(), Box<dyn std::error::Error>> {
    let yaml = serde_yaml::to_string(params)?;
    println!("reset_cluster YAML: \n{}", &yaml);
    let mut child = tokio::process::Command::new(crate::paths::K0SCTL_BINARY_PATH.get().unwrap())
        .arg("reset")
        .arg("--config")
        .arg("--force")
        .arg("-")
        .stdin(std::process::Stdio::piped())
        .spawn()?;
    let mut stdin = child.stdin.take().expect("Failed to open stdin");
    stdin.write(yaml.as_bytes()).await?;
    drop(stdin);
    let output = match timeout(Duration::from_secs(1), child.wait_with_output()).await {
        Ok(Ok(output)) => output,
        Ok(Err(e)) => return Err(e.into()),
        Err(_) => return Err("Process timed out".into()),
    };
    if !output.status.success() {
        return Err(format!(
            "Failed to reset cluster: {}",
            String::from_utf8_lossy(&output.stderr)
        )
        .into());
    }
    Ok(())
}

pub async fn apply_cluster(params: &K0SInitParams) -> Result<(), Box<dyn std::error::Error>> {
    // TODO: Only reset cluster for testing purposes
    // Separate reset and apply cluster on different commands
    // reset_cluster(params).await?;
    let yaml = serde_yaml::to_string(params)?;
    println!("apply_cluster YAML: \n{}", &yaml);
    let mut child = tokio::process::Command::new(crate::paths::K0SCTL_BINARY_PATH.get().unwrap())
        .arg("apply")
        .arg("--config")
        .arg("-")
        .stdin(std::process::Stdio::piped())
        .spawn()?;
    {
        let mut stdin = child.stdin.take().expect("Failed to open stdin");
        stdin.write_all(yaml.as_bytes()).await?;
    }
    let fut = child.wait_with_output();
    let output = match timeout(Duration::from_secs(300), fut).await {
        Ok(Ok(output)) => output,
        Ok(Err(e)) => return Err(e.into()),
        Err(_) => return Err("Process timed out".into()),
    };
    if !output.status.success() {
        return Err(format!(
            "Failed to apply cluster: {}",
            String::from_utf8_lossy(&output.stderr)
        )
        .into());
    }
    Ok(())
}

pub async fn get_cluster_config(
    params: &K0SInitParams,
) -> Result<String, Box<dyn std::error::Error>> {
    let yaml = serde_yaml::to_string(params)?;
    println!("get_cluster_config YAML: \n{}", &yaml);
    let mut child = tokio::process::Command::new(crate::paths::K0SCTL_BINARY_PATH.get().unwrap())
        .arg("kubeconfig")
        .arg("--config")
        .arg("-")
        .stdin(std::process::Stdio::piped())
        .stdout(std::process::Stdio::piped())
        .spawn()?;
    {
        let mut stdin = child.stdin.take().expect("Failed to open stdin");
        stdin.write_all(yaml.as_bytes()).await?;
    }

    let output = match timeout(Duration::from_secs(10), child.wait_with_output()).await {
        Ok(Ok(output)) => output,
        Ok(Err(e)) => return Err(e.into()),
        Err(_) => return Err("Process timed out".into()),
    };
    if !output.status.success() {
        return Err(format!(
            "Failed to get cluster config: {}",
            String::from_utf8_lossy(&output.stderr)
        )
        .into());
    }
    let config = String::from_utf8_lossy(&output.stdout).to_string();
    Ok(config)
}
