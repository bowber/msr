use crate::data::errors::DataError;

#[tauri::command]
pub async fn setup() -> Result<(), DataError> {
    crate::data::setup::try_init_db().await?;
    crate::data::k0s::download_k0sctl_binary().map_err(|_| DataError::K0sctlDownloadError)?;
    Ok(())
}
