/**
 * Aria — LeadintelAI Sales Chatbot Widget
 * Drop <script src="chatbot.js"></script> on any page to enable.
 */
(function () {
    // Auto-detect backend environment
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const BACKEND_URL = isLocal ? "http://localhost:8080" : "https://leadintel-production.up.railway.app";
    let chatHistory = [];
    let isOpen = false;
    let isTyping = false;

    // ─── INJECT STYLES ─────────────────────────────────────────────────────────
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

        #aria-bubble {
            position: fixed;
            bottom: 28px;
            right: 28px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0984e3, #6c5ce7);
            box-shadow: 0 6px 24px rgba(9,132,227,0.5);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            border: 2px solid rgba(255,255,255,0.2);
        }
        #aria-bubble:hover {
            transform: scale(1.1);
            box-shadow: 0 10px 30px rgba(9,132,227,0.7);
        }
        #aria-bubble svg { width: 28px; height: 28px; color: white; }
        #aria-bubble .unread-dot {
            position: absolute;
            top: 2px; right: 2px;
            width: 14px; height: 14px;
            background: #e17055;
            border-radius: 50%;
            border: 2px solid #0f1923;
            animation: aria-pulse 1.5s ease infinite;
        }
        @keyframes aria-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
        }

        #aria-window {
            position: fixed;
            bottom: 100px;
            right: 28px;
            width: 360px;
            height: 520px;
            background: rgba(15, 25, 35, 0.95);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 20px;
            backdrop-filter: blur(25px);
            -webkit-backdrop-filter: blur(25px);
            box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(9,132,227,0.2);
            z-index: 9998;
            display: flex;
            flex-direction: column;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
            transform: translateY(20px) scale(0.95);
            opacity: 0;
            pointer-events: none;
            transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
        }
        #aria-window::before {
            content: '';
            position: absolute;
            top: -50%; left: -50%; width: 200%; height: 200%;
            background: radial-gradient(circle, rgba(9,132,227,0.05) 0%, transparent 70%);
            animation: aria-glow 10s linear infinite;
            pointer-events: none;
            z-index: -1;
        }
        @keyframes aria-glow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        #aria-window.aria-open {
            transform: translateY(0) scale(1);
            opacity: 1;
            pointer-events: all;
        }

        #aria-header {
            background: linear-gradient(135deg, rgba(9,132,227,0.3), rgba(108,92,231,0.2));
            padding: 16px 18px;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .aria-avatar {
            width: 40px; height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #0984e3, #6c5ce7);
            display: flex; align-items: center; justify-content: center;
            font-weight: 700; color: white; font-size: 1rem;
            flex-shrink: 0;
        }
        .aria-header-info { flex: 1; }
        .aria-header-info strong { display: block; color: white; font-size: 0.95rem; }
        .aria-header-info span {
            font-size: 0.75rem; color: #00b894;
            display: flex; align-items: center; gap: 5px;
        }
        .aria-header-info span::before {
            content: ''; display: inline-block;
            width: 7px; height: 7px;
            background: #00b894; border-radius: 50%;
        }
        #aria-close {
            background: none; border: none;
            color: rgba(255,255,255,0.5); cursor: pointer;
            font-size: 1.4rem; line-height: 1;
            transition: color 0.2s;
        }
        #aria-close:hover { color: white; }

        #aria-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            scroll-behavior: smooth;
        }
        #aria-messages::-webkit-scrollbar { width: 4px; }
        #aria-messages::-webkit-scrollbar-track { background: transparent; }
        #aria-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .aria-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 14px;
            font-size: 0.875rem;
            line-height: 1.55;
            word-wrap: break-word;
            white-space: pre-wrap;
            animation: aria-msg-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
        @keyframes aria-msg-in {
            from { opacity: 0; transform: translateY(15px) scale(0.9); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .aria-msg.aria-bot {
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.08);
            color: rgba(245,246,250,0.9);
            border-radius: 14px 14px 14px 4px;
            align-self: flex-start;
        }
        .aria-msg.aria-user {
            background: linear-gradient(135deg, #0984e3, #6c5ce7);
            color: white;
            border-radius: 14px 14px 4px 14px;
            align-self: flex-end;
        }
        .aria-typing {
            align-self: flex-start;
            background: rgba(255,255,255,0.06);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 14px 14px 14px 4px;
            padding: 12px 16px;
            display: flex; gap: 5px; align-items: center;
        }
        .aria-typing span {
            width: 7px; height: 7px;
            background: rgba(245,246,250,0.5);
            border-radius: 50%;
            animation: aria-bounce 1.2s ease infinite;
        }
        .aria-typing span:nth-child(2) { animation-delay: 0.2s; }
        .aria-typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes aria-bounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
            40% { transform: translateY(-6px); opacity: 1; }
        }

        #aria-input-area {
            padding: 12px 14px;
            border-top: 1px solid rgba(255,255,255,0.08);
            display: flex;
            gap: 10px;
            align-items: flex-end;
        }
        #aria-input {
            flex: 1;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 10px 14px;
            color: white;
            font-family: 'Inter', sans-serif;
            font-size: 0.875rem;
            resize: none;
            outline: none;
            max-height: 100px;
            overflow-y: auto;
            transition: border-color 0.2s;
        }
        #aria-input::placeholder { color: rgba(255,255,255,0.3); }
        #aria-input:focus { border-color: rgba(9,132,227,0.6); }
        #aria-send {
            width: 40px; height: 40px;
            border-radius: 12px;
            background: linear-gradient(135deg, #0984e3, #6c5ce7);
            border: none;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            flex-shrink: 0;
            transition: transform 0.2s, opacity 0.2s;
        }
        #aria-send:hover:not(:disabled) { transform: scale(1.08); }
        #aria-send:disabled { opacity: 0.4; cursor: not-allowed; }
        #aria-send svg { width: 18px; height: 18px; color: white; }

        #aria-quick-actions {
            display: flex; gap: 8px; flex-wrap: wrap;
            padding: 0 14px 10px;
        }
        .aria-quick-btn {
            background: rgba(9,132,227,0.1);
            border: 1px solid rgba(9,132,227,0.3);
            color: #74b9ff;
            font-size: 0.75rem;
            padding: 6px 12px;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
            white-space: nowrap;
        }
        .aria-quick-btn:hover {
            background: rgba(9,132,227,0.25);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(9,132,227,0.2);
            border-color: rgba(9,132,227,0.6);
        }

        @media (max-width: 420px) {
            #aria-window { width: calc(100vw - 20px); right: 10px; bottom: 85px; }
            #aria-bubble { bottom: 18px; right: 18px; }
        }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // ─── INJECT HTML ───────────────────────────────────────────────────────────
    const bubbleHTML = `
        <div id="aria-bubble" onclick="window.__ariaToggle()">
            <div class="unread-dot" id="aria-dot"></div>
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.89a.75.75 0 0 0 .978.978l3.718-.893A9.958 9.958 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-1 14H8a1 1 0 0 1 0-2h3a1 1 0 0 1 0 2zm5-4H8a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2z"/>
            </svg>
        </div>
        <div id="aria-window">
            <div id="aria-header">
                <div class="aria-avatar">A</div>
                <div class="aria-header-info">
                    <strong>Aria</strong>
                    <span>Online — LeadintelAI</span>
                </div>
                <button id="aria-close" onclick="window.__ariaToggle()">✕</button>
            </div>
            <div id="aria-messages"></div>
            <div id="aria-quick-actions">
                <button class="aria-quick-btn" onclick="window.__ariaSendQuick('What products do you offer?')">Our Products</button>
                <button class="aria-quick-btn" onclick="window.__ariaSendQuick('How do I sign up?')">Sign Up Help</button>
                <button class="aria-quick-btn" onclick="window.__ariaSendQuick('What is pricing?')">Pricing</button>
                <button class="aria-quick-btn" onclick="window.__ariaSendQuick('Show me social media links')">Socials</button>
            </div>
            <div id="aria-input-area">
                <textarea id="aria-input" placeholder="Ask me anything..." rows="1"></textarea>
                <button id="aria-send" onclick="window.__ariaSend()">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
    `;
    const container = document.createElement('div');
    container.innerHTML = bubbleHTML;
    document.body.appendChild(container);

    // ─── FUNCTIONS ─────────────────────────────────────────────────────────────
    const messagesEl = document.getElementById('aria-messages');
    const inputEl = document.getElementById('aria-input');
    const sendBtn = document.getElementById('aria-send');
    const dot = document.getElementById('aria-dot');

    function addMessage(role, content) {
        const el = document.createElement('div');
        el.className = `aria-msg aria-${role === 'user' ? 'user' : 'bot'}`;
        el.textContent = content;
        messagesEl.appendChild(el);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return el;
    }

    function showTyping() {
        const el = document.createElement('div');
        el.className = 'aria-typing';
        el.id = 'aria-typing-indicator';
        el.innerHTML = '<span></span><span></span><span></span>';
        messagesEl.appendChild(el);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTyping() {
        const el = document.getElementById('aria-typing-indicator');
        if (el) el.remove();
    }

    async function sendMessage(text) {
        if (!text.trim() || isTyping) return;
        isTyping = true;
        sendBtn.disabled = true;
        dot.style.display = 'none';

        addMessage('user', text);
        chatHistory.push({ role: 'user', content: text });
        inputEl.value = '';
        inputEl.style.height = 'auto';

        showTyping();

        try {
            const res = await fetch(`${BACKEND_URL}/public/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: chatHistory.slice(0, -1) })
            });
            
            if (!res.ok) throw new Error("Server response not OK");
            
            const data = await res.json();
            removeTyping();
            const reply = data.reply || "Sorry, I am having a bit of trouble connecting right now.";
            addMessage('bot', reply);
            chatHistory.push({ role: 'assistant', content: reply });
        } catch (e) {
            removeTyping();
            console.error("Aria Connection Error:", e);
            addMessage('bot', "Server is temporarily unreachable. Please ensure the backend is active at LeadintelAI.");
        }

        isTyping = false;
        sendBtn.disabled = false;
    }

    window.__ariaToggle = function () {
        isOpen = !isOpen;
        document.getElementById('aria-window').classList.toggle('aria-open', isOpen);
        if (isOpen && chatHistory.length === 0) {
            setTimeout(() => {
                const welcome = "Hey! I am Aria from LeadintelAI. What kind of business do you run?";
                addMessage('bot', welcome);
                chatHistory.push({ role: 'assistant', content: welcome });
            }, 400);
        }
    };

    window.__ariaSend = function () {
        sendMessage(inputEl.value);
    };

    window.__ariaSendQuick = function (text) {
        sendMessage(text);
    };

    // Enter to send, Shift+Enter for newline
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputEl.value);
        }
    });

    // Auto-grow textarea
    inputEl.addEventListener('input', () => {
        inputEl.style.height = 'auto';
        inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
    });

    // Show unread dot after 3 seconds if chat hasn't been opened
    setTimeout(() => {
        if (!isOpen) dot.style.display = 'block';
    }, 3000);
})();
