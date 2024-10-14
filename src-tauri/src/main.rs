// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod k0sctl;
mod paths;

#[cfg(windows)]
use std::os::windows::process::CommandExt;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

#[tauri::command]
fn greet(name: &str) -> String {
    format!(
        "Hello, {}! You've been greeted from Rust! Your target: {:?}",
        name, "none"
    )
}

#[tauri::command]
fn check_k0sctl(name: &str) -> Result<String, String> {
    let output = match std::process::Command::new("bin/k0sctl").arg(name).output() {
        Ok(output) => output,
        Err(e) => return Err(e.to_string()),
    };

    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    Ok(String::from_utf8_lossy(&output.stdout).to_string())
}

fn main() {
    tauri::Builder::default()
        .setup(setup)
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![check_k0sctl])
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
