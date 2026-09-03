// ==========================================
// STUDY ROOM - ATLAS KOREAN
// نسخه کامل - قدم‌های ۱ تا ۳
// ==========================================

class StudyRoom {
    constructor() {
        this.roomId = this.getRoomId();
        this.isMember = false;
        this.isStudying = false;
        this.studySeconds = 0;
        this.timerInterval = null;
        this.messages = [];
        this.members = [];
        this.roomData = null;
        this.init();
    }

    getRoomId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id') || 1;
    }

    init() {
        this.loadRoomData();
        this.setupEvents();
        console.log('📚 Study Room Ready!');
    }

    // ==========================================
    // LOAD DATA
    // ==========================================

    async loadRoomData() {
        try {
            // داده‌های آزمایشی (بعداً با API واقعی جایگزین می‌شود)
            this.roomData = this.getMockData();
            this.renderRoom(this.roomData);
            if (this.isStudying) {
                this.startTimer();
            }
        } catch (error) {
            console.error('Error loading room:', error);
        }
    }

    getMockData() {
        return {
            id: 1,
            name: 'Korean Beginners 🇰🇷',
            level: 'A1–A2',
            status: 'active',
            current_members: 24,
            max_members: 50,
            members: [
                { id: 1, username: 'Mina', role: 'leader', xp: 420, is_studying: true, study_time: 42, avatar: null },
                { id: 2, username: 'Jisoo', role: 'moderator', xp: 380, is_studying: true, study_time: 31, avatar: null },
                { id: 3, username: 'Sara', role: 'mentor', xp: 350, is_studying: false, study_time: 0, avatar: null },
                { id: 4, username: 'Hana', role: 'member', xp: 290, is_studying: true, study_time: 24, avatar: null },
                { id: 5, username: 'John', role: 'member', xp: 210, is_studying: false, study_time: 0, avatar: null },
                { id: 6, username: 'Emily', role: 'member', xp: 180, is_studying: true, study_time: 15, avatar: null },
                { id: 7, username: 'David', role: 'member', xp: 150, is_studying: false, study_time: 0, avatar: null },
                { id: 8, username: 'You', role: 'member', xp: 290, is_studying: this.isStudying, study_time: this.studySeconds, avatar: null },
            ],
            daily_mission: {
                title: '🎯 Today\'s Mission',
                tasks: [
                    { id: 1, title: 'واژگان', desc: 'Learn 20 Korean words', progress: 70, icon: '📚' },
                    { id: 2, title: 'لیسنینگ', desc: 'Complete 1 listening lesson', progress: 50, icon: '🎧' },
                    { id: 3, title: 'گرامر', desc: 'Practice 5 sentences', progress: 80, icon: '✍️' },
                ]
            },
            weekly_challenge: {
                goal: 10000,
                current: 7840,
                completed: false
            },
            studying_now: [
                { username: 'Sara', time: 42, rank: 1 },
                { username: 'Mina', time: 31, rank: 2 },
                { username: 'Jisoo', time: 24, rank: 3 },
                { username: 'Emily', time: 15, rank: 4 },
            ],
            ranking: [
                { rank: 1, username: 'Mina', xp: 420, status: 'studying', role: 'leader' },
                { rank: 2, username: 'Jisoo', xp: 380, status: 'studying', role: 'moderator' },
                { rank: 3, username: 'Sara', xp: 350, status: 'offline', role: 'mentor' },
                { rank: 4, username: 'Hana', xp: 290, status: 'studying', role: 'member' },
                { rank: 5, username: 'You', xp: 290, status: this.isStudying ? 'studying' : 'offline', role: 'member' },
                { rank: 6, username: 'John', xp: 210, status: 'offline', role: 'member' },
                { rank: 7, username: 'Emily', xp: 180, status: 'studying', role: 'member' },
                { rank: 8, username: 'David', xp: 150, status: 'idle', role: 'member' },
            ],
            my_rank: { rank: 4, username: 'You', xp: 290, status: this.isStudying ? 'studying' : 'offline' },
            messages: [
                { id: 1, username: 'Mina', content: '화이팅! 🔥', time: '12:30', is_own: false, is_system: false },
                { id: 2, username: 'Sara', content: 'Let\'s reach 10k!', time: '12:28', is_own: false, is_system: false },
                { id: 3, username: 'Jisoo', content: '저는 문법 공부해요!', time: '12:25', is_own: false, is_system: false },
                { id: 4, username: 'System', content: 'Mina joined the room 🎉', time: '12:20', is_own: false, is_system: true },
            ]
        };
    }

    // ==========================================
    // RENDER ROOM
    // ==========================================

    renderRoom(data) {
        this.renderHeader(data);
        this.renderRoles(data);
        this.renderGrid(data);
        this.renderChallenge(data);
        this.renderRanking(data);
        this.renderMyRank(data);
        this.renderChat(data);
    }

    // ==========================================
    // RENDER HEADER
    // ==========================================

    renderHeader(data) {
        const header = document.getElementById('roomHeader');
        if (!header) return;

        const statusEmoji = data.status === 'active' ? '🟢' : data.status === 'full' ? '🔴' : '⚪';
        const totalXp = data.members.reduce((sum, m) => sum + m.xp, 0);

        header.innerHTML = `
            <div class="room-header-info">
                <h1>${data.name}</h1>
                <div class="room-meta">
                    <span>📊 ${data.level}</span>
                    <span>👥 ${data.current_members}/${data.max_members} ${statusEmoji}</span>
                    <span>🏆 ${totalXp.toLocaleString()} XP کل</span>
                </div>
            </div>
            <div class="room-header-actions">
                ${this.isMember ? `
                    <button class="btn btn-study ${this.isStudying ? 'studying' : ''}" id="studyToggleBtn">
                        ${this.isStudying ? '⏹️ توقف مطالعه' : '🟢 I\'m Studying'}
                    </button>
                    <button class="btn btn-leave" id="leaveRoomBtn">🚪 خروج</button>
                ` : `
                    <button class="btn btn-join" id="joinRoomBtn">➕ عضویت</button>
                `}
            </div>
            ${this.isMember ? `
                <div class="study-timer" style="margin-top:0.8rem;">
                    <span class="timer-status">
                        <span class="dot ${this.isStudying ? 'active' : 'inactive'}"></span>
                        ${this.isStudying ? '🟢 در حال مطالعه' : '⚪ غیرفعال'}
                    </span>
                    <span class="timer-display" id="timerDisplay">${this.formatTime(this.studySeconds)}</span>
                    <span class="timer-label">⏱️ زمان مطالعه امروز</span>
                </div>
            ` : ''}
        `;
    }

    // ==========================================
    // RENDER ROLES
    // ==========================================

    renderRoles(data) {
        const container = document.getElementById('roomRoles');
        if (!container) return;

        const roleEmojis = { leader: '👑', moderator: '🛡️', mentor: '📚', member: '👤' };
        const roleNames = { leader: 'Leader', moderator: 'Moderator', mentor: 'Mentor', member: 'Member' };

        const leaders = data.members.filter(m => m.role === 'leader' || m.role === 'moderator' || m.role === 'mentor');
        
        if (leaders.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = leaders.map(m => `
            <div class="role-badge">
                <div class="avatar">${m.username.charAt(0).toUpperCase()}</div>
                <span class="role-icon">${roleEmojis[m.role] || '👤'}</span>
                <span>${m.username}</span>
                <span style="font-weight:400;color:var(--text-muted);font-size:0.65rem;">${roleNames[m.role] || 'Member'}</span>
            </div>
        `).join('');
    }

    // ==========================================
    // RENDER GRID (Mission + Studying)
    // ==========================================

    renderGrid(data) {
        this.renderMission(data);
        this.renderStudying(data);
    }

    renderMission(data) {
        const container = document.getElementById('roomMission');
        if (!container) return;

        const today = new Date().toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' });

        container.innerHTML = `
            <div class="mission-header">
                <h3>🎯 ${data.daily_mission.title}</h3>
                <span class="mission-date">📅 ${today}</span>
            </div>
            ${data.daily_mission.tasks.map(task => `
                <div class="mission-item">
                    <span class="icon">${task.icon}</span>
                    <div class="info">
                        <div class="title">${task.title}</div>
                        <div class="desc">${task.desc}</div>
                    </div>
                    <div class="progress">
                        <div class="bar">
                            <div class="fill" style="width:${task.progress}%;"></div>
                        </div>
                        <div class="label">${task.progress}%</div>
                    </div>
                </div>
            `).join('')}
        `;
    }

    renderStudying(data) {
        const container = document.getElementById('roomStudying');
        if (!container) return;

        const studying = data.studying_now || [];

        container.innerHTML = `
            <div class="studying-header">
                <h3>🟢 در حال مطالعه</h3>
                <span class="count">${studying.length} نفر</span>
            </div>
            ${studying.length > 0 ? studying.map((u, i) => `
                <div class="studying-user">
                    <span class="rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}`}</span>
                    <div class="avatar">${u.username.charAt(0).toUpperCase()}</div>
                    <span class="name">${u.username}</span>
                    <span class="time">🔥 ${u.time} دقیقه</span>
                    <span class="status-dot"></span>
                </div>
            `).join('') : `
                <div class="studying-empty">😴 کسی در حال مطالعه نیست</div>
            `}
        `;
    }

    // ==========================================
    // RENDER CHALLENGE
    // ==========================================

    renderChallenge(data) {
        const container = document.getElementById('roomChallenge');
        if (!container) return;

        const progress = Math.min(100, Math.round((data.weekly_challenge.current / data.weekly_challenge.goal) * 100));
        const isCompleted = data.weekly_challenge.completed || progress >= 100;

        container.innerHTML = `
            <div class="challenge-header">
                <h3>🏆 چالش هفتگی</h3>
                <span class="goal">🎯 ${data.weekly_challenge.goal.toLocaleString()} XP</span>
            </div>
            ${isCompleted ? `
                <div class="challenge-completed">
                    🎉 چالش تکمیل شد! همه اعضا نشان گرفتند!
                </div>
            ` : `
                <div class="challenge-progress">
                    <div class="bar">
                        <div class="fill" style="width:${progress}%;"></div>
                    </div>
                    <div class="info">
                        <span>${data.weekly_challenge.current.toLocaleString()} XP</span>
                        <span>${progress}%</span>
                    </div>
                </div>
            `}
        `;
    }

    // ==========================================
    // RENDER RANKING
    // ==========================================

    renderRanking(data) {
        const missionEl = document.getElementById('roomMission');
        if (!missionEl) return;

        const existingRanking = document.querySelector('.ranking-section');
        if (existingRanking) existingRanking.remove();

        const ranking = data.ranking || [];
        if (ranking.length === 0) return;

        const rankingHTML = `
            <div class="ranking-section">
                <div class="ranking-header">
                    <h3>🏆 رتبه‌بندی اعضا</h3>
                    <span class="update-time">⏱️ بروزرسانی لحظه‌ای</span>
                </div>
                <table class="ranking-table">
                    <thead>
                        <tr>
                            <th>رتبه</th>
                            <th>کاربر</th>
                            <th>XP</th>
                            <th>وضعیت</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ranking.map((u, i) => `
                            <tr>
                                <td class="rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : ''}">
                                    ${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                                </td>
                                <td>
                                    <div class="user-cell">
                                        <div class="avatar">${u.username.charAt(0).toUpperCase()}</div>
                                        <span class="username">${u.username}</span>
                                        ${u.role === 'leader' ? '👑' : u.role === 'moderator' ? '🛡️' : u.role === 'mentor' ? '📚' : ''}
                                    </div>
                                </td>
                                <td class="xp-cell">${u.xp.toLocaleString()}</td>
                                <td class="status-cell">
                                    <span class="dot ${u.status}"></span>
                                    ${u.status === 'studying' ? 'در حال مطالعه' : u.status === 'idle' ? 'غیرفعال' : 'آفلاین'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        missionEl.insertAdjacentHTML('afterend', rankingHTML);
    }

    // ==========================================
    // RENDER MY RANK
    // ==========================================

    renderMyRank(data) {
        const myRank = data.my_rank;
        if (!myRank) return;

        const rankingSection = document.querySelector('.ranking-section');
        if (!rankingSection) return;

        const existingMyRank = document.querySelector('.my-rank-card');
        if (existingMyRank) existingMyRank.remove();

        const rankEmoji = myRank.rank === 1 ? '🥇' : myRank.rank === 2 ? '🥈' : myRank.rank === 3 ? '🥉' : `#${myRank.rank}`;

        const myRankHTML = `
            <div class="my-rank-card">
                <div class="rank-badge">${rankEmoji}</div>
                <div class="info">
                    <div class="name">${myRank.username}</div>
                    <div class="xp">XP امروز: <strong>${myRank.xp.toLocaleString()}</strong></div>
                </div>
                <div style="font-size:0.8rem;color:var(--text-muted);">
                    ${myRank.status === 'studying' ? '🟢 در حال مطالعه' : '⚪ آفلاین'}
                </div>
            </div>
        `;

        rankingSection.insertAdjacentHTML('afterend', myRankHTML);
    }

    // ==========================================
    // RENDER CHAT
    // ==========================================

    // ==========================================
// اصلاح renderChat در studyroom.js
// ==========================================

renderChat(data) {
    const container = document.getElementById('roomChat');
    if (!container) return;

    const messages = data.messages || [];

    container.innerHTML = `
        <div class="chat-header">
            <h3>💬 چت اتاق</h3>
            <span style="font-size:0.7rem;color:var(--text-muted);">
                ${this.isConnected ? '🟢 آنلاین' : '🔴 آفلاین'}
            </span>
        </div>
        <div class="chat-messages" id="chatMessages">
            ${messages.map(msg => `
                <div class="chat-message ${msg.is_own ? 'own' : ''} ${msg.is_system ? 'system' : ''}">
                    <div class="avatar">${msg.is_system ? '📢' : msg.username.charAt(0).toUpperCase()}</div>
                    <div class="content">
                        <div class="sender">
                            ${msg.is_system ? 'سیستم' : msg.username}
                            <span class="time">${msg.time || 'همین الان'}</span>
                            ${!msg.is_system && !msg.is_own ? `
                                <span class="message-actions">
                                    <button class="action-btn" data-chat-action="report" data-username="${msg.username}" title="گزارش">🚩</button>
                                    <button class="action-btn" data-chat-action="block" data-username="${msg.username}" title="بلاک">🚫</button>
                                    <button class="action-btn" data-chat-action="mute" data-username="${msg.username}" title="میوت">🔇</button>
                                </span>
                            ` : ''}
                        </div>
                        <div class="text">${msg.content}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="پیام خود را بنویسید...">
            <button id="chatSendBtn">ارسال</button>
        </div>
    `;
}
    // ==========================================
    // STUDY TIMER
    // ==========================================

    formatTime(seconds) {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) {
            return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        }
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        const savedTime = localStorage.getItem(`study_time_room_${this.roomId}`);
        if (savedTime) {
            this.studySeconds = parseInt(savedTime) || 0;
        }

        this.timerInterval = setInterval(() => {
            this.studySeconds++;
            localStorage.setItem(`study_time_room_${this.roomId}`, this.studySeconds);
            
            const display = document.getElementById('timerDisplay');
            if (display) {
                display.textContent = this.formatTime(this.studySeconds);
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    // ==========================================
    // TOGGLE STUDY
    // ==========================================

    toggleStudy() {
        this.isStudying = !this.isStudying;
        
        if (this.isStudying) {
            this.startTimer();
            this.showToast('🟢 مطالعه شروع شد!', 'success');
            this.addSystemMessage(`${this.getUsername()} شروع به مطالعه کرد 🔥`);
        } else {
            this.stopTimer();
            const timeStr = this.formatTime(this.studySeconds);
            this.showToast(`⏹️ مطالعه پایان یافت! زمان: ${timeStr}`, 'info');
            this.addSystemMessage(`${this.getUsername()} مطالعه را پایان داد (${timeStr})`);
            // ارسال XP به سرور در نسخه واقعی
        }
        
        // بروزرسانی داده‌ها
        this.roomData = this.getMockData();
        this.renderRoom(this.roomData);
    }

    getUsername() {
        return 'You';
    }

    // ==========================================
    // CHAT FUNCTIONS
    // ==========================================

    addSystemMessage(content) {
        const container = document.getElementById('chatMessages');
        if (!container) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message system';
        msgDiv.innerHTML = `
            <div class="avatar">📢</div>
            <div class="content">
                <div class="sender">
                    سیستم
                    <span class="time">همین الان</span>
                </div>
                <div class="text">${content}</div>
            </div>
        `;
        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }

    sendChat() {
        const input = document.getElementById('chatInput');
        if (!input || !input.value.trim()) return;
        
        const message = input.value.trim();
        input.value = '';
        
        const container = document.getElementById('chatMessages');
        if (container) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'chat-message own';
            msgDiv.innerHTML = `
                <div class="avatar">${this.getUsername().charAt(0).toUpperCase()}</div>
                <div class="content">
                    <div class="sender">
                        ${this.getUsername()}
                        <span class="time">همین الان</span>
                    </div>
                    <div class="text">${message}</div>
                </div>
            `;
            container.appendChild(msgDiv);
            container.scrollTop = container.scrollHeight;
        }
        
        // در نسخه واقعی: ارسال به API
        // this.sendMessageToAPI(message);
    }

    // ==========================================
    // TOAST
    // ==========================================

    showToast(message, type = 'success') {
        const existing = document.querySelector('.study-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `study-toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ==========================================
    // EVENTS
    // ==========================================

    setupEvents() {
        // Join Room
        document.addEventListener('click', (e) => {
            if (e.target.id === 'joinRoomBtn' || e.target.closest('#joinRoomBtn')) {
                this.joinRoom();
            }
        });

        // Leave Room
        document.addEventListener('click', (e) => {
            if (e.target.id === 'leaveRoomBtn' || e.target.closest('#leaveRoomBtn')) {
                this.leaveRoom();
            }
        });

        // Study Toggle
        document.addEventListener('click', (e) => {
            if (e.target.id === 'studyToggleBtn' || e.target.closest('#studyToggleBtn')) {
                this.toggleStudy();
            }
        });

        // Send Chat
        document.addEventListener('click', (e) => {
            if (e.target.id === 'chatSendBtn' || e.target.closest('#chatSendBtn')) {
                this.sendChat();
            }
        });

        // Enter key for chat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && document.getElementById('chatInput') === document.activeElement) {
                this.sendChat();
            }
        });
    }

    // ==========================================
    // JOIN / LEAVE
    // ==========================================

    async joinRoom() {
        this.showToast('🔜 در حال عضویت...', 'info');
        this.isMember = true;
        this.addSystemMessage(`${this.getUsername()} به اتاق پیوست 🎉`);
        this.roomData = this.getMockData();
        this.renderRoom(this.roomData);
    }

    async leaveRoom() {
        if (!confirm('آیا مطمئن هستید که می‌خواهید از اتاق خارج شوید؟')) return;
        
        this.stopTimer();
        localStorage.removeItem(`study_time_room_${this.roomId}`);
        this.showToast('🚪 در حال خروج...', 'info');
        
        this.isMember = false;
        this.isStudying = false;
        this.studySeconds = 0;
        
        this.addSystemMessage(`${this.getUsername()} از اتاق خارج شد 👋`);
        this.roomData = this.getMockData();
        this.renderRoom(this.roomData);
    }
}

// ==========================================
// TOAST STYLES (اضافه شدن به DOM)
// ==========================================

const toastStyles = document.createElement('style');
toastStyles.textContent = `
    .study-toast {
        position: fixed;
        bottom: 120px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        padding: 12px 24px;
        border-radius: 14px;
        background: var(--text);
        color: var(--bg);
        font-family: 'Vazirmatn', sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        z-index: 99999;
        white-space: nowrap;
    }
    .study-toast.show {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
    }
    .study-toast.success {
        background: #22C55E;
        color: white;
    }
    .study-toast.error {
        background: #EF4444;
        color: white;
    }
    .study-toast.info {
        background: #3B82F6;
        color: white;
    }
    body.night .study-toast:not(.success):not(.error):not(.info) {
        background: #1a1a2e;
        color: white;
    }
`;
document.head.appendChild(toastStyles);

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.studyroom-container')) {
        window.studyRoom = new StudyRoom();
    }
});

// ==========================================
// FLASHCARDS - اتصال به Study Room
// ==========================================

async function completeCardWithXP(cardId, roomId = null) {
    try {
        // اگر Room مشخص نیست، از localStorage دریافت کن
        if (!roomId) {
            roomId = localStorage.getItem('active_room_id');
        }
        
        if (!roomId) {
            console.log('⚠️ No active room found, skipping XP');
            return;
        }

        // مقدار XP بر اساس نوع کارت
        const xpAmount = 10;  // می‌تواند پویا باشد

        const response = await fetch(`/api/studyroom/rooms/${roomId}/add_xp/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify({
                xp: xpAmount,
                source: 'flashcard'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ XP added:', data);
            
            // نمایش پیام موفقیت
            if (data.challenge_completed) {
                showToast('🎉 چالش هفتگی تکمیل شد! همه اعضا نشان گرفتند!', 'success');
            } else {
                showToast(`✨ +${xpAmount} XP به اتاق مطالعه اضافه شد!`, 'success');
            }
        }
    } catch (error) {
        console.error('Error adding XP:', error);
    }
}

// اصلاح تابع completeLesson در flashcards.js
function completeLesson(lessonId, lessonTitle) {
    // ... کد قبلی ...
    
    // افزودن XP به Room
    const roomId = localStorage.getItem('active_room_id');
    if (roomId) {
        completeCardWithXP(lessonId, roomId);
    }
}