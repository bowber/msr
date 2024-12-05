use crate::data::{
    errors::DataError,
    hosts::{CreateHost, GetHostOptions, Host, HostRole, UpdateHost},
};
#[derive(serde::Serialize, Debug)]
pub struct HostList(Vec<Host>);

impl From<Vec<Host>> for HostList {
    fn from(hosts: Vec<Host>) -> Self {
        Self(hosts)
    }
}

#[tauri::command]
pub async fn get_hosts(options: GetHostOptions) -> Result<HostList, DataError> {
    println!("get_hosts: {:?}", options);
    match crate::data::hosts::get_hosts(options).await {
        Ok(hosts) => Ok(HostList(hosts)),
        Err(e) => {
            eprintln!("Error getting hosts: {:?}", e);
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn add_host(host: CreateHost) -> Result<(), DataError> {
    match crate::data::hosts::add_host(&host).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error adding hosts: {:?}", e);
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn delete_host(id: i64) -> Result<(), DataError> {
    match crate::data::hosts::delete_host(id).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error deleting host: {:?}", e);
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn update_host(host: UpdateHost) -> Result<(), DataError> {
    match crate::data::hosts::update_host(&host).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error updating host: {:?}", e);
            Err(e)
        }
    }
}

#[tauri::command]
pub async fn get_host_roles() -> Result<Vec<HostRole>, ()> {
    Ok(vec![
        HostRole::Controller,
        HostRole::Worker,
        HostRole::Single,
        HostRole::ControllerAndWorker,
    ])
}
