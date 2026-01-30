import { createApp } from "vue";
import App from "./App.vue";
import "./styles/global.css";
import "./styles/preview-themes.css";

// Tauri 环境检测
declare global {
  interface Window {
    __TAURI__: Record<string, unknown>;
  }
}

const isTauri = window.__TAURI__ !== undefined;

if (isTauri) {
  console.log("Running in Tauri environment");
}

createApp(App).mount("#app");
