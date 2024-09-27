// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn calculated_greet(name: &str) -> String {
    let mut sum = 0;
    let start_time = std::time::Instant::now();
    for i in 0i64..100_000_000_000 {
        sum = i;
    }
    format!(
        "Hello, {}! You've been greeted from Rust! {} times!!! Time taken: {}ms",
        name,
        sum,
        start_time.elapsed().as_millis()
    )
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![calculated_greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
