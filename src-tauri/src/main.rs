// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod commands;
mod k0sctl;
mod paths;

#[cfg(windows)]
use std::os::windows::process::CommandExt;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

fn main() {
    tauri::Builder::default()
        .setup(setup)
        .invoke_handler(tauri::generate_handler![commands::clusters::get_clusters])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let app_data_path = app.handle().path_resolver().app_data_dir().unwrap();
    paths::APP_DATA_PATH.set(app_data_path.clone())?;
    let ext;
    #[cfg(windows)]
    {
        ext = ".exe";
    }
    #[cfg(not(windows))]
    {
        ext = "";
    }
    paths::K0SCTL_BINARY_PATH.set(app_data_path.join(format!("bin/k0sctl{}", ext)))?;
    paths::SQLITE_PATH.set(app_data_path.join("k0s.db"))?;

    println!("APP_DATA_PATH: {:?}", paths::APP_DATA_PATH.get().unwrap());
    println!(
        "K0SCTL_BINARY_PATH: {:?}",
        paths::K0SCTL_BINARY_PATH.get().unwrap()
    );
    println!("SQLITE_PATH: {:?}", paths::SQLITE_PATH.get().unwrap());

    // TODO: Remove and only run this after the app is ready (check for updates or some actions like login)
    // TODO: Alongside with other checks
    k0sctl::download_k0sctl_binary()?;

    Ok(())
}
