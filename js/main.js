/* =======================================
   Lambo AI – Main App Logic
   ======================================= */

import { initChat } from "./ui.js";
import { getSettings, saveSettings, resetSettings } from "./storage.js";

/* ---------- DOM Elements ---------- */
const openSettingsBtn = document.getElementById("openSettings");

/* ---------- Settings Popup ---------- */
function createSettingsPopup() {
  const popup = document.createElement("div");
  popup.id = "settingsPopup";
  popup.style.position = "fixed";
  popup.style.top = "0";
  popup.style.left = "0";
  popup.style.width = "100%";
  popup.style.height = "100%";
  popup.style.background = "rgba(0,0,0,0.75)";
  popup.style.display = "flex";
  popup.style.justifyContent = "center";
  popup.style.alignItems = "center";
  popup.style.zIndex = "999";
  popup.innerHTML = `
    <div style="background: #12182a; padding: 20px; border-radius: 24px; width: 90%; max-width: 360px;">
      <h3 style="margin-bottom: 12px;">Settings ⚙️</h3>
      <div style="margin-bottom:12px;">
        <label>Select Active Models:</label><br/>
        <input type="checkbox" id="modelGemini" /> Gemini 🧠<br/>
        <input type="checkbox" id="modelGPT" /> ChatGPT ✨<br/>
        <input type="checkbox" id="modelClaude" /> Claude 🪄
      </div>
      <div style="margin-bottom:12px;">
        <label>Multi-Model Mode:</label>
        <input type="checkbox" id="multiModel" />
      </div>
      <div style="margin-bottom:12px;">
        <button id="saveSettingsBtn" style="margin-right:10px;">💾 Save</button>
        <button id="resetSettingsBtn">🔄 Reset</button>
      </div>
      <button id="closeSettingsBtn" style="margin-top:10px;">Close ❌</button>
    </div>
  `;
  document.body.appendChild(popup);

  // Load current settings
  const settings = getSettings();
  document.getElementById("modelGemini").checked = settings.activeModels.includes("gemini");
  document.getElementById("modelGPT").checked = settings.activeModels.includes("gpt");
  document.getElementById("modelClaude").checked = settings.activeModels.includes("claude");
  document.getElementById("multiModel").checked = settings.multiModelMode;

  // Event Listeners
  document.getElementById("saveSettingsBtn").addEventListener("click", () => {
    const newSettings = {
      activeModels: [
        document.getElementById("modelGemini").checked ? "gemini" : null,
        document.getElementById("modelGPT").checked ? "gpt" : null,
        document.getElementById("modelClaude").checked ? "claude" : null
      ].filter(Boolean),
      multiModelMode: document.getElementById("multiModel").checked
    };
    saveSettings(newSettings);
    alert("✅ Settings saved!");
    closeSettingsPopup();
  });

  document.getElementById("resetSettingsBtn").addEventListener("click", () => {
    resetSettings();
    alert("🔄 Settings reset to default");
    closeSettingsPopup();
  });

  document.getElementById("closeSettingsBtn").addEventListener("click", closeSettingsPopup);
}

function closeSettingsPopup() {
  const popup = document.getElementById("settingsPopup");
  if (popup) popup.remove();
}

/* ---------- Open Settings ---------- */
openSettingsBtn.addEventListener("click", () => {
  createSettingsPopup();
});

/* ---------- Initialize Chat ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initChat();
});
