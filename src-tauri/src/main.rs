// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!(
        "Hello, {}! You've been greeted from Rust! Your target: {:?}",
        name,
        get_k0sctl_download_link()
    )
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

fn get_k0sctl_download_link() -> Result<String, std::env::VarError> {
    let os = std::env::consts::OS;
    let arch = std::env::consts::ARCH;
    let mapped_os = match os {
        "windows" => "win",
        "macos" => "darwin",
        _ => panic!("Unsupported OS: {}", os),
    };
    let mapped_arch = match arch {
        "x86_64" => "amd64",
        "aarch64" => "arm64",
        "arm" => "arm",
        _ => panic!("Unsupported arch: {}", arch),
    };
    println!("OS: {}, Arch: {}", os, arch);
    let ext = if os == "windows" { ".exe" } else { "" };

    let k0sctl_version = std::env::var("K0SCTL_VERSION")?;
    println!("K0SCTL_VERSION: {}", k0sctl_version);
    let download_link = format!(
        "https://github.com/k0sproject/k0sctl/releases/download/{}/k0sctl-{}-{}{}",
        k0sctl_version, mapped_os, mapped_arch, ext
    );
    Ok(download_link)
}

fn main() {
    println!("Hello from Rust! {:?}", get_k0sctl_download_link());
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![calculated_greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
