// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod k0sctl;
#[cfg(windows)]
use std::os::windows::process::CommandExt;
const CREATE_NO_WINDOW: u32 = 0x08000000;
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
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![check_k0sctl])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
