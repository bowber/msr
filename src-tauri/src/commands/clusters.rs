#[tauri::command]
pub async fn get_clusters() -> Result<String, String> {
    Ok("ok".to_string())
}
