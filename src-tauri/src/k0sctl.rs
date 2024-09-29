use serde::{Deserialize, Serialize};

#[cfg(target_os = "windows")]
const K0SCTL_BIN_PATH: &str = "bin/k0sctl.exe";
#[cfg(not(target_os = "windows"))]
const K0SCTL_BIN_PATH: &str = "bin/k0sctl";

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
// pub fn init_k0s_cluster(opt: K0SInitParams) -> String {}
