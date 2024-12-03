use crate::data::{
    clusters::{Cluster, CreateCluster, UpdateCluster},
    errors::DataError,
    k0s::{K0SInitParams, K0SInitSpec, K0SMetadata},
};
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

#[tauri::command]
pub async fn add_cluster(host: CreateCluster) -> Result<(), DataError> {
    match crate::data::clusters::add_cluster(host).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error adding cluster: {:?}", e);
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn apply_cluster(host_ids: Vec<i64>, cluster_id: i64) -> Result<(), String> {
    let clusters = match crate::data::clusters::get_clusters_by_ids(vec![cluster_id]).await {
        Ok(clusters) => clusters,
        Err(e) => {
            eprintln!("Error getting cluster: {:?}", e);
            return Err(DataError::ReadError.to_string());
        }
    };
    let hosts = match crate::data::hosts::get_hosts_by_ids(&host_ids).await {
        Ok(hosts) => hosts,
        Err(e) => {
            eprintln!("Error getting hosts: {:?}", e);
            return Err(DataError::ReadError.to_string());
        }
    };
    let params = K0SInitParams {
        metadata: K0SMetadata {
            name: format!("k0s-cluster-{}", clusters[0].id),
        },
        spec: K0SInitSpec {
            hosts: hosts
                .iter()
                .map(|host| crate::data::k0s::K0SHost {
                    role: crate::data::hosts::HostRole::Worker,
                    ssh: crate::data::k0s::K0SSSH {
                        address: host.address.clone(),
                        user: Some(host.ssh_user.clone()),
                    },
                })
                .collect(),
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
pub async fn delete_cluster(id: i64) -> Result<(), DataError> {
    match crate::data::clusters::delete_cluster(id).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error deleting host: {:?}", e);
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn update_cluster(host: UpdateCluster) -> Result<(), DataError> {
    match crate::data::clusters::update_cluster(host).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error updating host: {:?}", e);
            Err(e)
        }
    }
}
