use crate::data::{
    errors::DataError,
    k0s::{CreateHost, Host, UpdateHost},
};
#[derive(serde::Serialize)]
pub struct HostList(Vec<Host>);

impl From<Vec<Host>> for HostList {
    fn from(hosts: Vec<Host>) -> Self {
        Self(hosts)
    }
}

#[tauri::command]
pub async fn get_hosts() -> Result<HostList, DataError> {
    match crate::data::k0s::get_hosts().await {
        Ok(hosts) => Ok(HostList(hosts)),
        Err(e) => {
            eprintln!("Error getting hosts: {:?}", e);
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn add_host(host: CreateHost) -> Result<(), DataError> {
    match crate::data::k0s::add_host(host).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error adding hosts: {:?}", e);
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn delete_host(id: i32) -> Result<(), DataError> {
    match crate::data::k0s::delete_host(id).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error deleting host: {:?}", e);
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn update_host(host: UpdateHost) -> Result<(), DataError> {
    match crate::data::k0s::update_host(host).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error updating host: {:?}", e);
            Err(e)
        }
    }
}
