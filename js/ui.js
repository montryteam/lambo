/* =======================================
   Lambo AI – UI Rendering & Animations
   ======================================= */

import { getHistory, addMessage } from "./storage.js";
import { fuseResponses, callModel } from "./aiModels.js";

/* ---------- DOM Elements ---------- */
const chatContainer = document.getElementById("chatContainer");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");

/* ---------- Render Messages ---------- */
export function renderMessage(role, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", role);

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.innerHTML = text;

  msgDiv.appendChild(bubble);
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/* ---------- Typing Indicator ---------- */
export function showTyping() {
  typingIndicator.style.display = "flex";
}

export function hideTyping() {
  typingIndicator.style.display = "none";
}

/* ---------- Load History ---------- */
export function loadChatHistory() {
  const history = getHistory();
  history.forEach(item => renderMessage(item.role, item.content));
}

/* ---------- Send User Message ---------- */
export async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  // Render user message
  renderMessage("user", text);
  addMessage("user", text);
  userInput.value = "";

  // Show Lambo typing
  showTyping();

  // Determine if multi-model or single
  try {
    const lamboText = await fuseResponses(text);
    hideTyping();

    // Render Lambo message
    renderMessage("lambo", lamboText);
    addMessage("lambo", lamboText);
  } catch (err) {
    hideTyping();
    renderMessage("lambo", `❌ Error: ${err.message}`);
    addMessage("lambo", `❌ Error: ${err.message}`);
  }
}

/* ---------- Event Listeners ---------- */
sendBtn.addEventListener("click", sendMessage);

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

/* ---------- Initialization ---------- */
export function initChat() {
  loadChatHistory();
  hideTyping();
}
