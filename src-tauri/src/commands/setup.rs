use crate::data::errors::DataError;

#[tauri::command]
pub async fn setup() -> Result<(), DataError> {
    match crate::data::setup::try_init_db().await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error init_db: {:?}", e);
            Err(e)
        }
    }?;
    match crate::data::k0s::download_k0sctl_binary() {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error downloading k0sctl binary: {:?}", e);
            Err(DataError::K0sctlDownloadError)
        }
    }?;
    Ok(())
}
