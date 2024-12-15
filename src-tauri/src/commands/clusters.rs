use std::env::args;

use crate::data::{
    clusters::{Cluster, CreateCluster, UpdateCluster},
    errors::DataError,
    hosts::{update_hosts_cluster, GetHostOptions},
    k0s::{K0SInitK0S, K0SInitParams, K0SInitSpec, K0SMetadata},
};

use tauri_plugin_shell::ShellExt;

#[derive(serde::Serialize, Debug)]
pub struct HostList(Vec<Cluster>);

impl From<Vec<Cluster>> for HostList {
    fn from(cluster: Vec<Cluster>) -> Self {
        Self(cluster)
    }
}

#[tauri::command]
pub async fn get_clusters() -> Result<HostList, DataError> {
    match crate::data::clusters::get_clusters().await {
        Ok(cluster) => Ok(HostList(cluster)),
        Err(e) => {
            eprintln!("Error getting cluster: {:?}", e);
            Err(e)
        }
    }
}

// #[tauri::command]
// pub async fn get_cluster_config(id: i64) -> Result<String, String> {
//     const cluster

#[tauri::command]
pub async fn add_cluster(cluster: CreateCluster, host_ids: Vec<i64>) -> Result<(), String> {
    let insert_result = crate::data::clusters::add_cluster(cluster)
        .await
        .expect("Error adding cluster");
    update_hosts_cluster(&host_ids, insert_result.last_insert_rowid())
        .await
        .expect("Error updating hosts");

    apply_cluster(insert_result.last_insert_rowid(), &host_ids).await
}

#[tauri::command]
pub async fn get_cluster_config(cluster_id: i64) -> Result<String, String> {
    let hosts = match crate::data::hosts::get_hosts(GetHostOptions {
        cluster_id: Some(cluster_id),
        ..Default::default()
    })
    .await
    {
        Ok(hosts) => hosts,
        Err(e) => {
            eprintln!("Error getting hosts: {:?}", e);
            return Err(DataError::ReadError.to_string());
        }
    };
    println!("Getting cluster config: {:?} | {:?}", cluster_id, hosts);
    let params = K0SInitParams {
        metadata: K0SMetadata {
            name: format!("k0s-cluster-{}", cluster_id),
        },
        spec: K0SInitSpec {
            hosts: hosts.into_iter().map(|host| host.into()).collect(),
            k0s: K0SInitK0S::default(),
        },
        ..K0SInitParams::default()
    };
    match crate::data::k0s::get_cluster_config(&params).await {
        Ok(config) => Ok(config),
        Err(e) => {
            eprintln!("Error getting cluster config: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn install_cilium(app: tauri::AppHandle) -> Result<(), String> {
    let sidecar_command = app
        .shell()
        .sidecar("cilium")
        .expect("Cannot create cilium sidecar")
        .arg("install")
        .arg("--set kubeProxyReplacement=true")
        .arg("--set gatewayAPI.enabled=true");
    let out = sidecar_command
        .output()
        .await
        .expect("Failed to run cilium install");
    if !out.status.success() {
        return Err(format!(
            "Failed to install Cilium: {}",
            String::from_utf8_lossy(&out.stderr)
        )
        .into());
    }
    Ok(())
}

#[tauri::command]
pub async fn enable_hubble(app: tauri::AppHandle) -> Result<(), String> {
    let sidecar_command = app
        .shell()
        .sidecar("cilium")
        .expect("Cannot create cilium sidecar")
        .args(&["hubble", "install"]);
    let out = sidecar_command
        .output()
        .await
        .expect("Failed to run cilium hubble install");
    if !out.status.success() {
        return Err(format!(
            "Failed to install Hubble: {}",
            String::from_utf8_lossy(&out.stderr)
        )
        .into());
    }
    Ok(())
}

pub async fn apply_cluster(cluster_id: i64, host_ids: &Vec<i64>) -> Result<(), String> {
    let hosts = match crate::data::hosts::get_hosts_by_ids(&host_ids).await {
        Ok(hosts) => hosts,
        Err(e) => {
            eprintln!("Error getting hosts: {:?}", e);
            return Err(DataError::ReadError.to_string());
        }
    };
    println!("Applying cluster: {:?} | {:?}", cluster_id, hosts);
    let params = K0SInitParams {
        metadata: K0SMetadata {
            name: format!("k0s-cluster-{}", cluster_id),
        },
        spec: K0SInitSpec {
            hosts: hosts
                .iter()
                .map(|host| crate::data::k0s::K0SHost {
                    role: host
                        .role
                        .clone()
                        .unwrap_or(crate::data::hosts::HostRole::Worker),
                    ssh: crate::data::k0s::K0SSSH {
                        address: host.address.clone(),
                        user: Some(host.ssh_user.clone()),
                    },
                    reset: Some(false),
                })
                .collect(),
            k0s: K0SInitK0S::default(),
        },
        ..K0SInitParams::default()
    };
    match crate::data::k0s::apply_cluster(&params).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error initializing cluster: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn delete_cluster(id: i64) -> Result<(), String> {
    let hosts = match crate::data::hosts::get_hosts(GetHostOptions {
        cluster_id: Some(id),
        ..Default::default()
    })
    .await
    {
        Ok(hosts) => hosts,
        Err(e) => {
            eprintln!("Error getting hosts: {:?}", e);
            return Err(DataError::ReadError.to_string());
        }
    };

    println!("Reseting cluster: {:?} | {:?}", id, hosts);
    let params = K0SInitParams {
        metadata: K0SMetadata {
            name: format!("k0s-cluster-{}", id),
        },
        spec: K0SInitSpec {
            hosts: hosts
                .iter()
                .map(|host| crate::data::k0s::K0SHost {
                    role: host
                        .role
                        .clone()
                        .unwrap_or(crate::data::hosts::HostRole::Worker),
                    ssh: crate::data::k0s::K0SSSH {
                        address: host.address.clone(),
                        user: Some(host.ssh_user.clone()),
                    },
                    reset: Some(false),
                })
                .collect(),
            k0s: K0SInitK0S::default(),
        },
        ..K0SInitParams::default()
    };
    match crate::data::k0s::reset_cluster(&params).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error reseting cluster: {:?}", e);
            Err(e.to_string())
        }
    }?;

    match crate::data::clusters::delete_cluster(id).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error deleting cluster: {:?}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn update_cluster(cluster: UpdateCluster, host_ids: Vec<i64>) -> Result<(), String> {
    crate::data::clusters::update_cluster(&cluster)
        .await
        .expect("Error updating cluster");

    update_hosts_cluster(&host_ids, cluster.id)
        .await
        .expect("Error updating hosts");
    apply_cluster(cluster.id, &host_ids).await
}
