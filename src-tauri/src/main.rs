#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

#[tauri::command]
fn open_external_url(url: &str) {
    if let Err(e) = webbrowser::open(url) {
        println!("Failed to open URL: {}", e);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_shell_plugin::init())
        .invoke_handler(tauri::generate_handler![greet, get_app_version, open_external_url])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}