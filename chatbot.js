/**
 * Maya — LeadintelAI Sales Chatbot Widget (Glass-UI Edition)
 * Powered by UI/UX Pro Max Design Intelligence.
 * Drop <script src="chatbot.js"></script> on any page to enable.
 */
(function () {
    // Auto-detect backend environment
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const BACKEND_URL = isLocal ? "http://localhost:8080" : "https://leadintel-production.up.railway.app";
    const WA_NUMBER = "917903820302";
    let chatHistory = [];
    let isOpen = false;
    let isTyping = false;

    // ─── INJECT GLASS-UI STYLES ────────────────────────────────────────────────
    const styles = `
        /* Maya LiquidGlassKit Optical Floating Launcher */
        #aria-bubble {
            position: fixed;
            bottom: 28px;
            right: 28px;
            width: 58px;
            height: 58px;
            border-radius: 9999px;
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.22) 0%,
                rgba(255, 255, 255, 0.05) 40%,
                rgba(30, 58, 138, 0.32) 70%,
                rgba(10, 15, 28, 0.58) 100%
            );
            backdrop-filter: blur(28px) saturate(220%) brightness(1.08) contrast(108%);
            -webkit-backdrop-filter: blur(28px) saturate(220%) brightness(1.08) contrast(108%);
            border: 1px solid rgba(255, 255, 255, 0.28);
            box-shadow:
                inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.8),
                inset 0 3px 8px 0 rgba(255, 255, 255, 0.25),
                inset 0 -2px 3px 0 rgba(0, 0, 0, 0.5),
                inset 0 -1px 1px 0 rgba(255, 255, 255, 0.2),
                0 18px 42px -8px rgba(0, 0, 0, 0.75),
                0 6px 16px -4px rgba(0, 0, 0, 0.5);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
            overflow: hidden;
            isolation: isolate;
        }

        #aria-bubble::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -20%;
            width: 140%;
            height: 120%;
            background: radial-gradient(
                ellipse at 35% 15%,
                rgba(255, 255, 255, 0.35) 0%,
                transparent 60%
            );
            transform: rotate(-12deg);
            pointer-events: none;
        }

        #aria-bubble:hover {
            transform: translateY(-3px) scale(1.06);
            border-color: rgba(255, 255, 255, 0.42);
            box-shadow:
                inset 0 1.5px 1.5px 0 #ffffff,
                inset 0 3px 9px 0 rgba(255, 255, 255, 0.32),
                inset 0 -2px 3px 0 rgba(0, 0, 0, 0.55),
                0 24px 52px -8px rgba(0, 0, 0, 0.85),
                0 8px 22px rgba(30, 58, 138, 0.45);
        }

        #aria-bubble svg {
            width: 26px;
            height: 26px;
            color: #93c5fd;
            transition: transform 0.25s ease;
            position: relative;
            z-index: 2;
        }

        #aria-bubble:hover svg {
            transform: scale(1.08);
            color: #ffffff;
        }

        #aria-bubble .aria-ping-dot {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 10px;
            height: 10px;
            background: #065f46; border: 1px solid #047857;
            border-radius: 50%;
            border: 2px solid #0a0b10;
            box-shadow: none;
            z-index: 3;
        }

        /* Modal Container · LiquidGlassKit Optical Enclosure */
        #aria-window {
            position: fixed;
            bottom: 96px;
            right: 28px;
            width: 375px;
            max-width: calc(100vw - 32px);
            height: 540px;
            max-height: calc(100vh - 120px);
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.15) 0%,
                rgba(255, 255, 255, 0.03) 35%,
                rgba(12, 16, 26, 0.72) 100%
            ), rgba(10, 14, 24, 0.55);
            backdrop-filter: blur(32px) saturate(220%) brightness(1.08) contrast(108%);
            -webkit-backdrop-filter: blur(32px) saturate(220%) brightness(1.08) contrast(108%);
            border: 1px solid rgba(255, 255, 255, 0.24);
            box-shadow:
                inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.75),
                inset 0 2.5px 7px 0 rgba(255, 255, 255, 0.2),
                inset 0 -2px 3px 0 rgba(0, 0, 0, 0.45),
                inset 0 -1px 1px 0 rgba(255, 255, 255, 0.16),
                0 32px 84px -16px rgba(0, 0, 0, 0.88),
                0 12px 28px -4px rgba(0, 0, 0, 0.6);
            border-radius: 22px;
            z-index: 99998;
            display: flex;
            flex-direction: column;
            font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, Menlo, Monaco, monospace;
            overflow: hidden;
            transform: translateY(16px) scale(0.96);
            opacity: 0;
            isolation: isolate;
            pointer-events: none;
            transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        #aria-window.aria-open {
            transform: translateY(0) scale(1);
            opacity: 1;
            pointer-events: all;
        }

        /* Ambient Header */
        #aria-header {
            background: rgba(18, 23, 38, 0.65);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.12);
            padding: 14px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        .aria-header-brand {
            display: flex;
            align-items: center;
            gap: 11px;
            text-decoration: none;
        }

        .aria-avatar {
            width: 36px;
            height: 36px;
            border-radius: 9px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.14);
            box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.22);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            overflow: hidden;
        }

        .aria-avatar img {
            width: 22px;
            height: 22px;
            object-fit: contain;
            display: block;
        }

        .aria-header-info strong {
            display: block;
            color: #ffffff;
            font-size: 0.88rem;
            font-weight: 700;
            letter-spacing: -0.01em;
            line-height: 1.2;
            font-family: inherit;
        }

        .aria-header-status {
            font-size: 0.70rem;
            color: #34d399;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-weight: 600;
            margin-top: 2px;
            font-family: inherit;
        }

        .aria-header-status::before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #065f46; border: 1px solid #047857;
            border-radius: 50%;
            box-shadow: none;
        }

        .aria-header-actions {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .aria-wa-btn {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: rgba(6, 95, 70, 0.16);
            border: 1px solid rgba(4, 120, 87, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #34d399;
            text-decoration: none;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .aria-wa-btn:hover {
            background: rgba(6, 95, 70, 0.25);
            border-color: #047857;
            color: #34d399;
            transform: scale(1.04);
        }

        .aria-close-btn {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #94a3b8;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .aria-close-btn:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.22);
            color: #ffffff;
            transform: scale(1.04);
        }

        /* Message Stream Area */
        #aria-messages {
            flex: 1;
            overflow-y: auto;
            padding: 18px 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            scroll-behavior: smooth;
        }

        #aria-messages::-webkit-scrollbar {
            width: 4px;
        }

        #aria-messages::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 4px;
        }

        .aria-msg {
            max-width: 86%;
            padding: 10px 14px;
            border-radius: 14px;
            font-size: 0.81rem;
            line-height: 1.55;
            word-wrap: break-word;
            font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, Menlo, Monaco, monospace;
            letter-spacing: -0.015em;
            animation: ariaMsgFade 0.28s cubic-bezier(0.16, 1, 0.3, 1) both;
            -webkit-font-smoothing: antialiased;
        }

        @keyframes ariaMsgFade {
            from { opacity: 0; transform: translateY(8px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .aria-msg.aria-bot {
            background: rgba(18, 22, 34, 0.72);
            border: 1px solid rgba(255, 255, 255, 0.10);
            box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.14);
            color: #e2e8f0;
            border-radius: 14px 14px 14px 4px;
            align-self: flex-start;
        }

        .aria-msg.aria-user {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
            border: 1px solid rgba(255, 255, 255, 0.22);
            box-shadow: 0 4px 16px rgba(29, 78, 216, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.25);
            color: #ffffff;
            border-radius: 14px 14px 4px 14px;
            align-self: flex-end;
        }

        .aria-msg a {
            color: #93c5fd;
            text-decoration: underline;
            font-weight: 600;
        }

        /* Typing Dots */
        .aria-typing {
            align-self: flex-start;
            background: rgba(18, 22, 34, 0.72);
            border: 1px solid rgba(255, 255, 255, 0.10);
            box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.14);
            border-radius: 14px 14px 14px 4px;
            padding: 10px 14px;
            display: flex;
            gap: 5px;
            align-items: center;
        }

        .aria-typing span {
            width: 6px;
            height: 6px;
            background: #94a3b8;
            border-radius: 50%;
            animation: ariaDotBounce 1.2s ease infinite;
        }

        .aria-typing span:nth-child(2) { animation-delay: 0.18s; }
        .aria-typing span:nth-child(3) { animation-delay: 0.36s; }

        @keyframes ariaDotBounce {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
            40% { transform: translateY(-5px); opacity: 1; background: #3b82f6; }
        }

        /* Quick Action Chips */
        #aria-quick-actions {
            display: flex;
            gap: 6px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding: 0 16px 10px;
            scrollbar-width: none;
        }

        #aria-quick-actions::-webkit-scrollbar {
            display: none;
        }

        .aria-quick-btn {
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.12) 0%,
                rgba(255, 255, 255, 0.03) 100%
            ), rgba(12, 16, 28, 0.45);
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow:
                inset 0 1px 1px 0 rgba(255, 255, 255, 0.5),
                inset 0 -1px 2px 0 rgba(0, 0, 0, 0.35),
                0 4px 12px rgba(0, 0, 0, 0.35);
            color: #93c5fd;
            font-size: 0.70rem;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 9999px;
            cursor: pointer;
            transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
            font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, Menlo, monospace;
            white-space: nowrap;
            flex-shrink: 0;
            letter-spacing: -0.01em;
            backdrop-filter: blur(16px) saturate(200%);
            -webkit-backdrop-filter: blur(16px) saturate(200%);
        }

        .aria-quick-btn:hover {
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.2) 0%,
                rgba(30, 58, 138, 0.4) 100%
            );
            border-color: rgba(255, 255, 255, 0.35);
            color: #ffffff;
            box-shadow:
                inset 0 1px 1px 0 rgba(255, 255, 255, 0.7),
                0 6px 18px rgba(30, 58, 138, 0.4);
            transform: translateY(-1px);
        }

        /* Input Controls */
        #aria-input-area {
            padding: 10px 14px 14px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(14, 18, 28, 0.55);
            display: flex;
            gap: 8px;
            align-items: flex-end;
        }

        #aria-input {
            flex: 1;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.12);
            box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 9px 13px;
            color: #ffffff;
            font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, Menlo, monospace;
            font-size: 0.80rem;
            letter-spacing: -0.01em;
            resize: none;
            outline: none;
            max-height: 90px;
            min-height: 38px;
            overflow-y: auto;
            line-height: 1.45;
            transition: border-color 0.2s, background 0.2s;
            -webkit-font-smoothing: antialiased;
        }

        #aria-input::placeholder {
            color: rgba(255, 255, 255, 0.38);
        }

        #aria-input:focus {
            border-color: rgba(59, 130, 246, 0.55);
            background: rgba(255, 255, 255, 0.06);
        }

        #aria-send {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
            border: 1px solid rgba(255, 255, 255, 0.22);
            box-shadow: 0 4px 14px rgba(29, 78, 216, 0.38), inset 0 1px 1px rgba(255, 255, 255, 0.25);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s, box-shadow 0.2s;
        }

        #aria-send:hover:not(:disabled) {
            transform: translateY(-1px) scale(1.04);
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            box-shadow: 0 6px 18px rgba(37, 99, 235, 0.45);
        }

        #aria-send:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            transform: none;
        }

        #aria-send svg {
            width: 15px;
            height: 15px;
            color: #ffffff;
        }

        /* Mobile Rules */
        @media (max-width: 480px) {
            #aria-window {
                width: calc(100vw - 24px);
                right: 12px;
                bottom: 84px;
                height: 480px;
                border-radius: 16px;
            }
            #aria-bubble {
                bottom: 20px;
                right: 20px;
                width: 52px;
                height: 52px;
            }
        }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // ─── INJECT HTML ───────────────────────────────────────────────────────────
    const bubbleHTML = `
        <div id="aria-bubble" onclick="window.__ariaToggle()" title="Chat with Maya AI" aria-label="Open sales chat with Maya AI">
            <div class="aria-ping-dot" id="aria-dot"></div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
                <circle cx="12" cy="10" r="1" fill="currentColor"></circle>
                <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
            </svg>
        </div>

        <div id="aria-window" role="dialog" aria-modal="true" aria-label="Maya AI Revenue Assistant">
            <!-- Header -->
            <div id="aria-header">
                <div class="aria-header-brand">
                    <div class="aria-avatar">
                        <img src="leadintelai-logo.svg" alt="LeadintelAI" style="width:20px; height:20px; object-fit:contain; display:block;">
                    </div>
                    <div class="aria-header-info">
                        <strong>Maya AI</strong>
                        <div class="aria-header-status">Online · Autonomous SDR</div>
                    </div>
                </div>

                <div class="aria-header-actions">
                    <a href="https://wa.me/${WA_NUMBER}?text=Hi%20Maya,%20I%20am%20exploring%20LeadintelAI%20and%20would%20like%20more%20details." target="_blank" class="aria-wa-btn" title="Continue on WhatsApp" aria-label="Continue on WhatsApp">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                    </a>
                    <button class="aria-close-btn" onclick="window.__ariaToggle()" title="Close chat" aria-label="Close chat">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Messages Stream -->
            <div id="aria-messages" aria-live="polite"></div>

            <!-- Intent Quick Action Pills -->
            <div id="aria-quick-actions">
                <button class="aria-quick-btn" onclick="window.__ariaSendQuick('Can you explain your B2B DataCloud and sample lead accuracy?')">⚡ Test B2B Leads</button>
                <button class="aria-quick-btn" onclick="window.__ariaSendQuick('What are the official WhatsApp Business API features and pricing?')">💬 WhatsApp API</button>
                <button class="aria-quick-btn" onclick="window.__ariaSendQuick('How does MailEngine ensure cold emails never land in spam?')">✉️ Cold Email Setup</button>
                <button class="aria-quick-btn" onclick="window.__ariaSendQuick('What plans do you recommend for scaling our outbound revenue?')">📊 Pricing Plans</button>
            </div>

            <!-- Input Controls -->
            <div id="aria-input-area">
                <textarea id="aria-input" placeholder="Ask Maya anything about outbound..." rows="1" aria-label="Message Maya"></textarea>
                <button id="aria-send" onclick="window.__ariaSend()" aria-label="Send message">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 2L11 13"></path>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = bubbleHTML;
    document.body.appendChild(container);

    // ─── RUNTIME FUNCTIONS ─────────────────────────────────────────────────────
    const messagesEl = document.getElementById('aria-messages');
    const inputEl = document.getElementById('aria-input');
    const sendBtn = document.getElementById('aria-send');
    const dot = document.getElementById('aria-dot');

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    function formatBotMessage(content) {
        // Safe escape then transform markdown links to glass hyperlinks
        let safe = escapeHTML(content);
        safe = safe.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        return safe.replace(/\n/g, '<br>');
    }

    function addMessage(role, content) {
        const el = document.createElement('div');
        el.className = `aria-msg aria-${role === 'user' ? 'user' : 'bot'}`;
        if (role === 'bot') {
            el.innerHTML = formatBotMessage(content);
        } else {
            el.textContent = content;
        }
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

    let welcomeTimer = null;
    let focusTimer = null;

    async function sendMessage(text) {
        if (!text || !text.trim() || isTyping) return;
        isTyping = true;
        sendBtn.disabled = true;
        if (dot) dot.style.display = 'none';

        addMessage('user', text);
        chatHistory.push({ role: 'user', content: text });
        inputEl.value = '';
        inputEl.style.height = 'auto';

        showTyping();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        try {
            const res = await fetch(`${BACKEND_URL}/public/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, history: chatHistory.slice(0, -1) }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) throw new Error("HTTP error " + res.status);

            const data = await res.json();
            removeTyping();
            const reply = data.reply || "Thanks for reaching out! Let me know what questions you have about LeadintelAI.";
            addMessage('bot', reply);
            chatHistory.push({ role: 'assistant', content: reply });
        } catch (e) {
            clearTimeout(timeoutId);
            removeTyping();
            console.error("Maya Connection Error:", e);
            // Intelligent fallback with contextual help
            const fallbackReply = "I am currently running in offline demo mode. You can explore our verified leads on [DataCloud](data.html), view [Pricing Plans](pricing.html), or connect directly with our founder on WhatsApp: [Chat on WhatsApp](https://wa.me/" + WA_NUMBER + ").";
            addMessage('bot', fallbackReply);
        } finally {
            isTyping = false;
            sendBtn.disabled = false;
            inputEl.focus();
        }
    }

    window.__ariaToggle = function () {
        isOpen = !isOpen;
        document.getElementById('aria-window').classList.toggle('aria-open', isOpen);
        if (isOpen) {
            if (dot) dot.style.display = 'none';
            if (chatHistory.length === 0) {
                if (welcomeTimer) clearTimeout(welcomeTimer);
                welcomeTimer = setTimeout(() => {
                    if (isOpen && chatHistory.length === 0) {
                        const welcome = "Hello! I am Maya, LeadintelAI's autonomous outbound intelligence agent. How can I help accelerate your pipeline today?";
                        addMessage('bot', welcome);
                        chatHistory.push({ role: 'assistant', content: welcome });
                    }
                }, 300);
            }
            if (focusTimer) clearTimeout(focusTimer);
            focusTimer = setTimeout(() => {
                if (isOpen) inputEl.focus();
            }, 350);
        } else {
            if (welcomeTimer) clearTimeout(welcomeTimer);
            if (focusTimer) clearTimeout(focusTimer);
        }
    };

    if (window.location.search.includes('open_chat=1')) {
        setTimeout(() => { if (!isOpen) window.__ariaToggle(); }, 350);
    }

    // Cross-tab synchronization
    window.addEventListener('storage', (e) => {
        if (e.key === 'access_token' || e.key === 'leadintel_user') {
            console.log('[Maya] Auth state synchronized across tabs');
        }
    });

    if (window.location.hash === '#chat') {
        setTimeout(() => {
            if (!isOpen) window.__ariaToggle();
        }, 100);
    }

    window.__ariaSend = function () {
        sendMessage(inputEl.value);
    };

    window.__ariaSendQuick = function (text) {
        sendMessage(text);
    };

    // Keyboard handlers
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputEl.value);
        }
    });

    // Auto-grow textarea
    inputEl.addEventListener('input', () => {
        inputEl.style.height = 'auto';
        inputEl.style.height = Math.min(inputEl.scrollHeight, 90) + 'px';
    });

    // Show unread indicator after 4s
    setTimeout(() => {
        if (!isOpen && dot) dot.style.display = 'block';
    }, 4000);
})();

// ─── LIQUID HEADER SCROLL CONTROLLER (Hide on scroll down, Reappear on scroll up) ───
(function initLiquidHeaderScroll() {
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;
    const threshold = 30;

    function handleScroll() {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;
        const header = document.querySelector('.liquid-header');
        if (!header) {
            ticking = false;
            return;
        }

        // Always show near page top
        if (currentScrollY <= threshold) {
            header.classList.remove('header-hidden');
        } else if (currentScrollY > lastScrollY && (currentScrollY - lastScrollY > 4)) {
            // Scrolling down -> smoothly fade out and hide header
            header.classList.add('header-hidden');
        } else if (currentScrollY < lastScrollY && (lastScrollY - currentScrollY > 4)) {
            // Scrolling up -> smoothly fade in and reveal header
            header.classList.remove('header-hidden');
        }

        lastScrollY = Math.max(0, currentScrollY);
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });
})();
