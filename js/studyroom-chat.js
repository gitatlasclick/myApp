// ==========================================
// STUDY ROOM CHAT - WebSocket
// ==========================================

class StudyRoomChat {
    constructor(roomId) {
        this.roomId = roomId;
        this.socket = null;
        this.isConnected = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.connect();
        this.setupUI();
        console.log('💬 Chat WebSocket initialized');
    }

    connect() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.host}/ws/studyroom/${this.roomId}/`;
        
        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            this.isConnected = true;
            console.log('✅ WebSocket connected');
            this.addSystemMessage('🟢 به چت متصل شدید');
        };

        this.socket.onclose = () => {
            this.isConnected = false;
            console.log('❌ WebSocket disconnected');
            this.addSystemMessage('🔴 ارتباط با چت قطع شد. در حال reconnect...');
            // تلاش برای reconnect بعد از 3 ثانیه
            setTimeout(() => this.connect(), 3000);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.addSystemMessage('⚠️ خطا در ارتباط با چت');
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
        };
    }

    handleMessage(data) {
        if (data.type === 'message') {
            this.addMessage(data.username, data.content, data.is_own || false, false);
        } else if (data.type === 'system') {
            this.addSystemMessage(data.content);
        } else if (data.type === 'error') {
            this.showToast(data.message, 'error');
        } else if (data.type === 'report_success') {
            this.showToast(data.message, 'success');
        } else if (data.type === 'block_success') {
            this.showToast(data.message, 'success');
        }
    }

    sendMessage(content) {
        if (!this.isConnected) {
            this.showToast('❌ اتصال به چت برقرار نیست', 'error');
            return;
        }

        const data = {
            type: 'message',
            content: content
        };
        this.socket.send(JSON.stringify(data));
    }

    sendReport(reportedUsername, reason, description = '') {
        if (!this.isConnected) {
            this.showToast('❌ اتصال به چت برقرار نیست', 'error');
            return;
        }

        const data = {
            type: 'report',
            reported_username: reportedUsername,
            reason: reason,
            description: description
        };
        this.socket.send(JSON.stringify(data));
    }

    sendBlock(blockedUsername) {
        if (!this.isConnected) {
            this.showToast('❌ اتصال به چت برقرار نیست', 'error');
            return;
        }

        const data = {
            type: 'block',
            blocked_username: blockedUsername
        };
        this.socket.send(JSON.stringify(data));
    }

    sendMute(mutedUsername, duration = 60, reason = '') {
        if (!this.isConnected) {
            this.showToast('❌ اتصال به چت برقرار نیست', 'error');
            return;
        }

        const data = {
            type: 'mute',
            muted_username: mutedUsername,
            duration: duration,
            reason: reason
        };
        this.socket.send(JSON.stringify(data));
    }

    // ==========================================
    // UI FUNCTIONS
    // ==========================================

    setupUI() {
        // دکمه ارسال
        const sendBtn = document.getElementById('chatSendBtn');
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendFromInput());
        }

        // Enter key
        const input = document.getElementById('chatInput');
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.sendFromInput();
                }
            });
        }

        // Report/Block/Mute buttons (در نسخه کامل)
        this.setupActionButtons();
    }

    setupActionButtons() {
        // Action buttons برای هر پیام
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-chat-action]');
            if (!target) return;

            const action = target.dataset.chatAction;
            const username = target.dataset.username;

            if (action === 'report') {
                this.showReportModal(username);
            } else if (action === 'block') {
                this.showBlockConfirm(username);
            } else if (action === 'mute') {
                this.showMuteModal(username);
            }
        });
    }

    sendFromInput() {
        const input = document.getElementById('chatInput');
        if (!input) return;

        const content = input.value.trim();
        if (!content) return;

        this.sendMessage(content);
        input.value = '';
    }

    addMessage(username, content, isOwn = false, isSystem = false) {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${isOwn ? 'own' : ''} ${isSystem ? 'system' : ''}`;
        msgDiv.dataset.username = username;

        const avatar = isSystem ? '📢' : username.charAt(0).toUpperCase();

        msgDiv.innerHTML = `
            <div class="avatar">${avatar}</div>
            <div class="content">
                <div class="sender">
                    ${isSystem ? 'سیستم' : username}
                    <span class="time">همین الان</span>
                    ${!isSystem && !isOwn ? `
                        <span class="message-actions">
                            <button class="action-btn" data-chat-action="report" data-username="${username}" title="گزارش">🚩</button>
                            <button class="action-btn" data-chat-action="block" data-username="${username}" title="بلاک">🚫</button>
                            <button class="action-btn" data-chat-action="mute" data-username="${username}" title="میوت">🔇</button>
                        </span>
                    ` : ''}
                </div>
                <div class="text">${content}</div>
            </div>
        `;

        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    addSystemMessage(content) {
        this.addMessage('سیستم', content, false, true);
    }

    // ==========================================
    // MODALS
    // ==========================================

    showReportModal(username) {
        const reason = prompt(`دلیل گزارش کاربر ${username} را انتخاب کنید:\n(spam, harassment, inappropriate, other)`);
        if (!reason) return;

        const description = prompt('توضیحات بیشتر (اختیاری):') || '';
        this.sendReport(username, reason, description);
        this.showToast(`گزارش ${username} ثبت شد ✅`, 'success');
    }

    showBlockConfirm(username) {
        if (confirm(`آیا مطمئن هستید که می‌خواهید ${username} را بلاک کنید؟`)) {
            this.sendBlock(username);
        }
    }

    showMuteModal(username) {
        const duration = prompt(`مدت میوت ${username} به دقیقه (پیش‌فرض ۶۰):`) || 60;
        const reason = prompt('دلیل میوت:') || '';
        this.sendMute(username, parseInt(duration), reason);
        this.showToast(`${username} به مدت ${duration} دقیقه میوت شد 🔇`, 'success');
    }

    // ==========================================
    // TOAST
    // ==========================================

    showToast(message, type = 'success') {
        const existing = document.querySelector('.chat-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `chat-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ==========================================
// TOAST STYLES
// ==========================================

const chatToastStyles = document.createElement('style');
chatToastStyles.textContent = `
    .chat-toast {
        position: fixed;
        bottom: 200px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        padding: 10px 20px;
        border-radius: 12px;
        background: var(--text);
        color: var(--bg);
        font-family: 'Vazirmatn', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        z-index: 99999;
        white-space: nowrap;
    }
    .chat-toast.show {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
    }
    .chat-toast.success {
        background: #22C55E;
        color: white;
    }
    .chat-toast.error {
        background: #EF4444;
        color: white;
    }
    body.night .chat-toast:not(.success):not(.error) {
        background: #1a1a2e;
        color: white;
    }
    .message-actions {
        display: inline-flex;
        gap: 0.2rem;
        margin-right: 0.5rem;
        opacity: 0.4;
        transition: opacity 0.3s;
    }
    .chat-message:hover .message-actions {
        opacity: 1;
    }
    .message-actions .action-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 0.7rem;
        padding: 0 2px;
        transition: transform 0.2s;
        border-radius: 4px;
    }
    .message-actions .action-btn:hover {
        transform: scale(1.2);
        background: var(--accent-light);
    }
`;
document.head.appendChild(chatToastStyles);

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const roomId = new URLSearchParams(window.location.search).get('id') || 1;
    if (document.getElementById('roomChat')) {
        window.chat = new StudyRoomChat(roomId);
    }
});