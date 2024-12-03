use serde::{Deserialize, Serialize};
use tokio::time::{timeout, Duration};

#[derive(Serialize, Deserialize, Debug)]
pub struct SshConfig {
    pub host: String,
}
#[tauri::command]
pub async fn ping_ssh(config: SshConfig) -> Result<String, String> {
    println!("Pinging host: {:#?}", &config);
    let output = match timeout(
        Duration::from_secs(3),
        tokio::process::Command::new("ssh")
            .arg(&config.host)
            .arg("echo")
            .arg("pong")
            .kill_on_drop(true)
            .output(),
    )
    .await
    {
        Ok(Ok(output)) => output,
        Ok(Err(e)) => return Err(format!("Failed to execute process: {}", e)),
        Err(_) => return Err("Process timed out".to_string()),
    };

    match std::str::from_utf8(&output.stdout) {
        Ok(s) => {
            if s.trim() == "pong" {
                println!("Ping successful for host: {}", &config.host);
                println!("Output: {}", s);
                Ok("Connected".to_string())
            } else {
                println!("Ping failed for host: {}", &config.host);
                println!("Output: {}", s);
                println!(
                    "Error: {}",
                    std::str::from_utf8(&output.stderr).unwrap_or("Unknown error")
                );
                Err("Failed to ping".to_string())
            }
        }
        Err(e) => Err(e.to_string()),
    }
}
