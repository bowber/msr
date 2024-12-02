use tokio::fs;

use crate::{data::errors::DataError, paths::APP_DATA_PATH};

#[tauri::command]
pub async fn setup() -> Result<(), DataError> {
    let app_data_path = match APP_DATA_PATH.get() {
        Some(path) => path,
        None => {
            eprintln!("Error getting app data path");
            return Err(DataError::PathError);
        }
    };
    match fs::create_dir_all(app_data_path).await {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("Error creating app data directory: {:?}", e);
            Err(DataError::PathError)
        }
    }?;

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
