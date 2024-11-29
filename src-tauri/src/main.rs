// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod commands;
mod data;
mod paths;

// #[cfg(windows)]
// use std::os::windows::process::CommandExt;

use tauri::Manager;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(setup)
        .invoke_handler(tauri::generate_handler![
            commands::setup::setup,
            commands::hosts::get_hosts,
            commands::hosts::add_host,
            commands::hosts::delete_host,
            commands::hosts::update_host,
            commands::clusters::get_clusters,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let app_data_path = app.handle().path().app_data_dir().unwrap();
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
    Ok(())
}
