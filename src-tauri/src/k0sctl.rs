use serde::{Deserialize, Serialize};

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
