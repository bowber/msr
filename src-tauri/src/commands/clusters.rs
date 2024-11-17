use crate::data::errors::DataError;

#[tauri::command]
pub async fn get_clusters() -> Result<String, DataError> {
    Ok("ok".to_string())
}
