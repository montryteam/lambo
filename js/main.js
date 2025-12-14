// Elements
const chatArea = document.getElementById('chatArea');
const inputEl = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const settingsBtn = document.getElementById('settingsBtn');
const overlay = document.getElementById('settingsOverlay');

// Load settings
let selectedModels = JSON.parse(localStorage.getItem('selectedModels') || '["chatgpt"]');
let multiAIMode = JSON.parse(localStorage.getItem('multiAIMode') || 'false');
let smartSummarization = JSON.parse(localStorage.getItem('smartSummarization') || 'false');

// Send message
sendBtn.addEventListener('click', sendMessage);
inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const message = inputEl.value.trim();
    if (!message) return;

    // Show user message
    appendMessage('user', message);

    // Save to history
    saveMessage('user', message);

    inputEl.value = '';
    
    // Determine which models to query
    let modelsToQuery = selectedModels;
    if (!multiAIMode) modelsToQuery = [selectedModels[0]]; // Only first model if multiAI off

    // Show typing indicator
    const typingEl = appendTypingIndicator();

    // Collect responses
    const responses = [];
    for (let modelKey of modelsToQuery) {
        const model = getModel(modelKey);
        const apiKey = getAPIKey(modelKey);
        if (!apiKey) {
            removeTypingIndicator(typingEl);
            appendMessage('ai', `No API key provided for ${model.name}. ${model.instructions}`);
            continue;
        }

        try {
            const aiResponse = await fetchAIResponse(modelKey, apiKey, message);
            responses.push({model: model.name, text: aiResponse});
        } catch (err) {
            responses.push({model: model.name, text: `Error: ${err.message}`});
        }
    }

    // Remove typing indicator
    removeTypingIndicator(typingEl);

    // Process responses
    if (responses.length === 1 || !multiAIMode) {
        appendMessage('ai', responses[0].text, responses[0].model);
    } else {
        let finalText = '';
        if (smartSummarization) {
            // Simple concatenation for demo; replace with actual summarization API if desired
            finalText = responses.map(r => `${r.model}: ${r.text}`).join('\n\n');
        } else {
            // Best response = first for now
            finalText = `${responses[0].text}\n\nAnswer compiled from: ${responses.map(r => r.model).join(', ')}`;
        }
        appendMessage('ai', finalText, 'Multi-AI');
    }

    // Save AI responses to history
    responses.forEach(r => saveMessage('ai', r.text, r.model));
}

// Fetch AI response (simplified; adapt per AI model API)
async function fetchAIResponse(modelKey, apiKey, prompt) {
    const model = getModel(modelKey);

    if (modelKey === 'chatgpt') {
        const res = await fetch(model.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{role: 'user', content: prompt}]
            })
        });
        const data = await res.json();
        return data.choices[0].message.content;
    } else if (modelKey === 'gemini') {
        const endpoint = `${model.endpoint}?key=${apiKey}`;
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents:[{parts:[{text: prompt}]}]
            })
        });
        const data = await res.json();
        return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No reply';
    } else {
        // Placeholder for other AIs
        return `[Simulated response for ${model.name}] ${prompt}`;
    }
}

// UI helper functions from ui.js
// appendMessage(type, text, model?)
// appendTypingIndicator()
// removeTypingIndicator(el)
// saveMessage(type, text, model?)
