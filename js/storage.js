// LocalStorage keys
const STORAGE_KEYS = {
    apiKeys: "LAMBO_API_KEYS",           // Object {chatgpt: key, gemini: key, ...}
    chatHistory: "LAMBO_CHAT_HISTORY",   // Array of messages {type, text, model, timestamp}
    multiAIMode: "LAMBO_MULTI_AI",
    smartSummarization: "LAMBO_SMART_SUM"
};

// ---------- API Key Functions ----------
function saveAPIKey(modelKey, apiKey) {
    const keys = JSON.parse(localStorage.getItem(STORAGE_KEYS.apiKeys) || "{}");
    keys[modelKey] = apiKey;
    localStorage.setItem(STORAGE_KEYS.apiKeys, JSON.stringify(keys));
}

function getAPIKey(modelKey) {
    const keys = JSON.parse(localStorage.getItem(STORAGE_KEYS.apiKeys) || "{}");
    return keys[modelKey] || "";
}

function removeAPIKey(modelKey) {
    const keys = JSON.parse(localStorage.getItem(STORAGE_KEYS.apiKeys) || "{}");
    delete keys[modelKey];
    localStorage.setItem(STORAGE_KEYS.apiKeys, JSON.stringify(keys));
}

// ---------- Chat History Functions ----------
function saveMessage(type, text, model="User") {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.chatHistory) || "[]");
    history.push({
        type,        // 'user' or 'ai'
        text,
        model,
        timestamp: Date.now()
    });
    // Keep max 200 messages
    if (history.length > 200) history.splice(0, history.length - 200);
    localStorage.setItem(STORAGE_KEYS.chatHistory, JSON.stringify(history));
}

function loadHistory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.chatHistory) || "[]");
}

function clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.chatHistory);
}

// ---------- Multi-AI & Smart Summarization ----------
function setMultiAIMode(enabled) {
    localStorage.setItem(STORAGE_KEYS.multiAIMode, JSON.stringify(enabled));
}

function getMultiAIMode() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.multiAIMode) || "false");
}

function setSmartSummarization(enabled) {
    localStorage.setItem(STORAGE_KEYS.smartSummarization, JSON.stringify(enabled));
}

function getSmartSummarization() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.smartSummarization) || "false");
}

// ---------- Export functions if using modules ----------
// export {
//     saveAPIKey, getAPIKey, removeAPIKey,
//     saveMessage, loadHistory, clearHistory,
//     setMultiAIMode, getMultiAIMode,
//     setSmartSummarization, getSmartSummarization
// };
