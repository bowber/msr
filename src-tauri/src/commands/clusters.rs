use crate::data::{
    errors::DataError,
    clusters::{CreateCluster, Cluster, UpdateCluster},
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
pub async fn delete_cluster(id: i32) -> Result<(), DataError> {
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
