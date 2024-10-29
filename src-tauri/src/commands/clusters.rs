use crate::data::{errors::DataError, k0s::Host};
use tauri::async_runtime::Mutex;

#[tauri::command]
pub async fn get_hosts() -> Result<Vec<Host>, DataError> {
    Ok(crate::data::k0s::get_hosts().await?)
}
