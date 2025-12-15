/* ======================================
   Lambo AI – AI Models & Smart Fusion
   ====================================== */

import { getApiKeys, getSettings } from "./storage.js";

/* ---------- Model Definitions ---------- */
export const AI_MODELS = {
  gemini: {
    id: "gemini",
    name: "Gemini",
    emoji: "🧠",
    endpoint: (key) =>
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${key}`,
    buildRequest: (prompt) => ({
      contents: [{ parts: [{ text: prompt }] }]
    }),
    parseResponse: (data) =>
      data?.candidates?.[0]?.content?.parts?.[0]?.text || ""
  },

  gpt: {
    id: "gpt",
    name: "ChatGPT",
    emoji: "✨",
    endpoint: () => `https://api.openai.com/v1/chat/completions`,
    headers: (key) => ({
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    }),
    buildRequest: (prompt) => ({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Lambo, a playful smart AI cat 🐱" },
        { role: "user", content: prompt }
      ]
    }),
    parseResponse: (data) =>
      data?.choices?.[0]?.message?.content || ""
  },

  claude: {
    id: "claude",
    name: "Claude",
    emoji: "🪄",
    endpoint: () => `https://api.anthropic.com/v1/messages`,
    headers: (key) => ({
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01"
    }),
    buildRequest: (prompt) => ({
      model: "claude-3-haiku-20240307",
      max_tokens: 500,
      messages: [
        { role: "user", content: prompt }
      ]
    }),
    parseResponse: (data) =>
      data?.content?.[0]?.text || ""
  }
};

/* ---------- Call Single Model ---------- */
export async function callModel(modelId, prompt) {
  const keys = getApiKeys();
  const model = AI_MODELS[modelId];
  const apiKey = keys[modelId];

  if (!model || !apiKey) {
    return `⚠️ ${model?.name || modelId} API key is missing.`;
  }

  try {
    const res = await fetch(
      typeof model.endpoint === "function"
        ? model.endpoint(apiKey)
        : model.endpoint,
      {
        method: "POST",
        headers: model.headers
          ? model.headers(apiKey)
          : { "Content-Type": "application/json" },
        body: JSON.stringify(model.buildRequest(prompt))
      }
    );

    const data = await res.json();
    const text = model.parseResponse(data);

    return text || `⚠️ ${model.name} returned no response.`;
  } catch (err) {
    return `❌ ${model.name} error: ${err.message}`;
  }
}

/* ---------- Multi-Model Mode ---------- */
export async function callMultipleModels(prompt) {
  const settings = getSettings();
  const active = settings.activeModels;

  const results = [];

  for (const modelId of active) {
    const response = await callModel(modelId, prompt);
    results.push({
      model: modelId,
      response
    });
  }

  return results;
}

/* ---------- Smart Fusion (Lambo Brain) ---------- */
export async function fuseResponses(prompt) {
  const settings = getSettings();

  if (!settings.multiModelMode) {
    return callModel(settings.activeModels[0], prompt);
  }

  const results = await callMultipleModels(prompt);

  const fusionPrompt = `
You are Lambo 🐱 — a playful, smart AI cat.
Below are answers from different AI models.
Your task:
- Merge the best ideas
- Remove repetition
- Keep it friendly and simple
- Add light humor (Gen Z style 😎)

User question:
"${prompt}"

AI answers:
${results.map(r => `(${r.model}) ${r.response}`).join("\n\n")}

Final answer:
`;

  // Always use Gemini for fusion if available
  const keys = getApiKeys();
  if (keys.gemini) {
    return callModel("gemini", fusionPrompt);
  }

  // Fallback: return the longest response
  return results.sort((a, b) => b.response.length - a.response.length)[0].response;
}
