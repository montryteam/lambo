// ---------- Append a message to chat ----------
function appendMessage(type, text, model = "User") {
    const msgEl = document.createElement('div');
    msgEl.classList.add('message', type);
    
    // Show model name for AI messages
    if (type === 'ai') {
        const modelEl = document.createElement('div');
        modelEl.textContent = model;
        modelEl.style.fontSize = '11px';
        modelEl.style.fontWeight = '600';
        modelEl.style.marginBottom = '4px';
        msgEl.appendChild(modelEl);
    }

    const textEl = document.createElement('div');
    textEl.textContent = text;
    msgEl.appendChild(textEl);

    // Add message controls
    const controls = document.createElement('div');
    controls.classList.add('message-controls');
    
    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = '✖';
    delBtn.title = 'Delete message';
    delBtn.onclick = () => msgEl.remove();
    
    // Resend button for user messages
    const resendBtn = document.createElement('button');
    resendBtn.textContent = '↻';
    resendBtn.title = 'Resend message';
    resendBtn.onclick = () => {
        inputEl.value = text;
        inputEl.focus();
    };

    controls.appendChild(delBtn);
    if (type === 'user') controls.appendChild(resendBtn);
    msgEl.appendChild(controls);

    chatArea.appendChild(msgEl);
    chatArea.scrollTop = chatArea.scrollHeight; // Auto scroll
    return msgEl;
}

// ---------- Typing Indicator ----------
function appendTypingIndicator() {
    const el = document.createElement('div');
    el.classList.add('message', 'ai');
    el.innerHTML = `<div class="typingCursor"></div>`;
    chatArea.appendChild(el);
    chatArea.scrollTop = chatArea.scrollHeight;
    return el;
}

function removeTypingIndicator(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

// ---------- Render chat history ----------
function renderChatHistory() {
    const history = loadHistory();
    chatArea.innerHTML = '';
    history.forEach(msg => {
        appendMessage(msg.type, msg.text, msg.model);
    });
}

// ---------- Clear chat UI ----------
function clearChatUI() {
    chatArea.innerHTML = '';
}

// ---------- Export functions if using modules ----------
// export { appendMessage, appendTypingIndicator, removeTypingIndicator, renderChatHistory, clearChatUI };
