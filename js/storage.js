// Define available AI models
const AI_MODELS = {
  chatgpt: {
    name: "ChatGPT",
    endpoint: "https://api.openai.com/v1/chat/completions",
    instructions: "Get your OpenAI API key at https://platform.openai.com/account/api-keys"
  },
  gemini: {
    name: "Gemini",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
    instructions: "Get your Gemini API key at https://aistudio.google.com/app/apikey"
  },
  claude: {
    name: "Claude",
    endpoint: "https://api.anthropic.com/v1/complete",
    instructions: "Get your Claude API key at https://console.anthropic.com/"
  },
  bard: {
    name: "Bard",
    endpoint: "https://bard.google.com/api", // hypothetical placeholder
    instructions: "Get your Bard API key at https://bard.google.com/"
  }
};

// Function to list available AI models
function getAvailableModels() {
  return Object.keys(AI_MODELS).map(key => AI_MODELS[key]);
}

// Function to get model info by key
function getModel(key) {
  return AI_MODELS[key] || null;
}

// Export functions if using modules
// export { AI_MODELS, getAvailableModels, getModel };
