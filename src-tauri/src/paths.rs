use std::path::PathBuf;
use tokio::sync::OnceCell;

pub static APP_DATA_PATH: OnceCell<PathBuf> = OnceCell::const_new();
pub static K0SCTL_BINARY_PATH: OnceCell<PathBuf> = OnceCell::const_new();
pub static SQLITE_PATH: OnceCell<PathBuf> = OnceCell::const_new();
