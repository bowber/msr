use std::os::unix::fs::PermissionsExt;

use serde::{Deserialize, Serialize};

const K0SCTL_VERSION: &str = "v0.19.0";

#[derive(Serialize, Deserialize)]
pub enum HostRole {
    Controller,
    Worker,
}

#[derive(Serialize, Deserialize)]
pub struct Host {
    pub address: String,
    pub user: String,
    pub ssh_key_path: String,
    pub role: HostRole,
}

#[derive(Serialize, Deserialize)]
pub struct K0SInitParams {
    pub cluster_name: String,
    pub hosts: Vec<Host>,
}

pub fn init_k0s_cluster(opt: K0SInitParams) -> Result<(), String> {
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
