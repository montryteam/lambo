/* ===============================
   Lambo AI – Local Storage Layer
   =============================== */

const STORAGE_KEYS = {
  SETTINGS: "lambo_settings",
  HISTORY: "lambo_chat_history",
  API_KEYS: "lambo_api_keys"
};

/* ---------- Default Settings ---------- */
const DEFAULT_SETTINGS = {
  themeColor: "blue",               // future-ready (Material dynamic)
  activeModels: ["gemini"],          // gemini | gpt | claude
  multiModelMode: false,             // use all models together
  responseStyle: "fun",              // fun | simple | best
  showTypingAnimation: true,
};

/* ---------- Settings ---------- */
export function getSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS));
    return { ...DEFAULT_SETTINGS, ...saved };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(
    STORAGE_KEYS.SETTINGS,
    JSON.stringify({ ...getSettings(), ...settings })
  );
}

export function resetSettings() {
  localStorage.setItem(
    STORAGE_KEYS.SETTINGS,
    JSON.stringify(DEFAULT_SETTINGS)
  );
}

/* ---------- API Keys ---------- */
export function getApiKeys() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.API_KEYS)) || {};
  } catch {
    return {};
  }
}

export function saveApiKey(model, key) {
  const keys = getApiKeys();
  keys[model] = key;
  localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(keys));
}

export function clearApiKeys() {
  localStorage.removeItem(STORAGE_KEYS.API_KEYS);
}

/* ---------- Chat History ---------- */
export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY)) || [];
  } catch {
    return [];
  }
}

export function addMessage(role, content) {
  const history = getHistory();
  history.push({
    role,               // "user" | "lambo"
    content,
    time: Date.now()
  });
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

/* ---------- Utilities ---------- */
export function hasApiKeyFor(model) {
  const keys = getApiKeys();
  return Boolean(keys[model]);
}

export function isFirstRun() {
  return !localStorage.getItem(STORAGE_KEYS.SETTINGS);
}
