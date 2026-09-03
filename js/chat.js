// frontend/public/js/chat.js

/**
 * مکالمه - پیدا کردن هم‌سطح و تماس صوتی
 */

let currentUser = null;
let isAvailable = false;
let matchInterval = null;

// ============================================================
// بررسی زمان‌بندی
// ============================================================

function checkAvailability() {
    const now = new Date();
    const day = now.getDay(); // 0=Sunday, 6=Saturday
    const hour = now.getHours();
    const minute = now.getMinutes();
    const time = hour + minute / 60;
    
    // روزهای کاری (شنبه تا چهارشنبه = 6,0,1,2,3)
    const weekdays = [6, 0, 1, 2, 3];
    if (!weekdays.includes(day)) {
        isAvailable = false;
        updateChatStatus(false);
        return;
    }
    
    // بازه صبح: 10:00 - 12:00
    // بازه شب: 20:00 - 23:00
    if ((time >= 10 && time < 12) || (time >= 20 && time < 23)) {
        isAvailable = true;
        updateChatStatus(true);
    } else {
        isAvailable = false;
        updateChatStatus(false);
    }
}

function updateChatStatus(available) {
    const statusEl = document.getElementById('chatStatus');
    const findBtn = document.getElementById('findMatchBtn');
    const statusText = document.getElementById('statusText');
    
    if (!statusEl || !findBtn) return;
    
    if (available) {
        statusEl.className = 'chat-status online';
        statusEl.innerHTML = '<i class="fas fa-circle"></i> آنلاین';
        findBtn.disabled = false;
        if (statusText) statusText.textContent = 'هم‌سطح‌ها در دسترس هستند';
    } else {
        statusEl.className = 'chat-status offline';
        statusEl.innerHTML = '<i class="fas fa-circle"></i> آفلاین';
        findBtn.disabled = true;
        if (statusText) statusText.textContent = 'ساعات مکالمه: ۱۰-۱۲ صبح و ۲۰-۲۳ شب';
    }
}

// ============================================================
// پیدا کردن هم‌سطح
// ============================================================

function findMatch() {
    if (!isAvailable) {
        showToast('⏰ ساعات مکالمه: ۱۰-۱۲ صبح و ۲۰-۲۳ شب', 'warning');
        return;
    }
    
    const btn = document.getElementById('findMatchBtn');
    const result = document.getElementById('matchResult');
    const loading = document.getElementById('matchLoading');
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال جستجو...';
    loading.style.display = 'block';
    result.style.display = 'none';
    
    fetch('/api/users/connections/match/', {
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        loading.style.display = 'none';
        
        if (data.message) {
            // هیچ هم‌سطحی پیدا نشد
            result.style.display = 'block';
            result.innerHTML = `
                <div class="no-match">
                    <i class="fas fa-user-slash"></i>
                    <p>${data.message}</p>
                    <small>لطفاً چند دقیقه دیگر دوباره تلاش کنید.</small>
                </div>
            `;
            return;
        }
        
        // هم‌سطح پیدا شد
        result.style.display = 'block';
        result.innerHTML = `
            <div class="match-found">
                <div class="match-avatar">
                    <img src="${data.avatar || '/public/img/default-avatar.png'}" alt="آواتار">
                    <span class="match-level">${data.level || 'A1'}</span>
                </div>
                <div class="match-info">
                    <div class="match-name">${data.username || 'کاربر'}</div>
                    <div class="match-detail">
                        <span>${data.city || ''} ${data.country ? '· ' + data.country : ''}</span>
                        <span>${data.goal ? getGoalLabel(data.goal) : ''}</span>
                    </div>
                </div>
                <button class="btn-call" onclick="startCall(${data.id})">
                    <i class="fas fa-phone"></i> تماس
                </button>
            </div>
        `;
    })
    .catch(err => {
        loading.style.display = 'none';
        result.style.display = 'block';
        result.innerHTML = `
            <div class="no-match">
                <i class="fas fa-exclamation-triangle"></i>
                <p>خطا در جستجو. لطفاً دوباره تلاش کنید.</p>
            </div>
        `;
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-search"></i> پیدا کردن هم‌سطح';
    });
}

function getGoalLabel(goal) {
    const labels = {
        'TOPIK': '🎯 TOPIK',
        'TRAVEL': '✈️ سفر',
        'WORK': '💼 کار',
        'STUDY': '📚 تحصیل',
        'PERSONAL': '❤️ شخصی',
        'CULTURE': '🎭 فرهنگ'
    };
    return labels[goal] || goal;
}

// ============================================================
// شروع تماس
// ============================================================

function startCall(userId) {
    // شروع تماس
    showToast('📞 در حال اتصال به هم‌سطح...', 'info');
    
    fetch('/api/users/connections/start/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        
        showToast('🔔 تماس برقرار شد!', 'success');
        
        // باز کردن پنجره تماس
        openCallWindow(data);
    })
    .catch(err => {
        showToast('❌ ' + (err.message || 'خطا در برقراری تماس'), 'error');
    });
}

function openCallWindow(connection) {
    // ایجاد پنجره تماس
    const callWindow = document.createElement('div');
    callWindow.className = 'call-window';
    callWindow.innerHTML = `
        <div class="call-container">
            <div class="call-header">
                <span class="call-status">🟢 در حال مکالمه</span>
                <button class="call-close" onclick="endCall()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="call-body">
                <div class="call-avatar">
                    <img src="${connection.user2?.avatar || '/public/img/default-avatar.png'}" alt="آواتار">
                </div>
                <div class="call-name">${connection.user2?.username || 'کاربر'}</div>
                <div class="call-level">${connection.user2?.level || 'A1'}</div>
                <div class="call-timer" id="callTimer">۰۰:۰۰</div>
            </div>
            <div class="call-footer">
                <button class="call-btn mute" onclick="toggleMute(this)">
                    <i class="fas fa-microphone"></i>
                </button>
                <button class="call-btn end" onclick="endCall()">
                    <i class="fas fa-phone-slash"></i>
                </button>
                <button class="call-btn speaker" onclick="toggleSpeaker(this)">
                    <i class="fas fa-volume-up"></i>
                </button>
            </div>
            <div class="call-tips">
                <p>💡 سعی کنید فقط کرهای صحبت کنید</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(callWindow);
    
    // شروع تایمر
    startCallTimer();
    
    // ذخیره ID تماس
    window.currentConnection = connection;
}

function startCallTimer() {
    let seconds = 0;
    window.callTimerInterval = setInterval(() => {
        seconds++;
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        const timer = document.getElementById('callTimer');
        if (timer) timer.textContent = `${mins}:${secs}`;
    }, 1000);
}

function endCall() {
    // پایان تماس
    if (window.callTimerInterval) {
        clearInterval(window.callTimerInterval);
        window.callTimerInterval = null;
    }
    
    // بستن پنجره
    const callWindow = document.querySelector('.call-window');
    if (callWindow) {
        callWindow.remove();
    }
    
    // ارسال درخواست پایان تماس
    if (window.currentConnection) {
        fetch(`/api/users/connections/${window.currentConnection.id}/end/`, {
            method: 'POST',
            credentials: 'include'
        }).catch(() => {});
    }
    
    showToast('⏹️ تماس پایان یافت', 'info');
    
    // بارگذاری مجدد تاریخچه
    loadConnections();
}

function toggleMute(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('fa-microphone')) {
        icon.className = 'fas fa-microphone-slash';
        btn.classList.add('muted');
        showToast('🔇 میکروفون قطع شد', 'info');
    } else {
        icon.className = 'fas fa-microphone';
        btn.classList.remove('muted');
        showToast('🎤 میکروفون وصل شد', 'info');
    }
}

function toggleSpeaker(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('fa-volume-up')) {
        icon.className = 'fas fa-volume-mute';
        showToast('🔇 صدا قطع شد', 'info');
    } else {
        icon.className = 'fas fa-volume-up';
        showToast('🔊 صدا وصل شد', 'info');
    }
}

// ============================================================
// بارگذاری کاربران آنلاین
// ============================================================

function loadOnlineUsers() {
    fetch('/api/users/online/', {
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('onlineUsers');
        if (!container) return;
        
        if (!data.users || data.users.length === 0) {
            container.innerHTML = `
                <div class="no-online">
                    <i class="fas fa-user-slash"></i>
                    <p>هیچ کاربر آنلاینی وجود ندارد</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = data.users.map(user => `
            <div class="online-user">
                <img src="${user.avatar || '/public/img/default-avatar.png'}" alt="آواتار" class="online-avatar">
                <div class="online-info">
                    <div class="online-name">${user.username}</div>
                    <div class="online-level">${user.level || 'A1'}</div>
                </div>
                <button class="btn-call-small" onclick="startCall(${user.id})">
                    <i class="fas fa-phone"></i>
                </button>
            </div>
        `).join('');
    })
    .catch(() => {});
}

// ============================================================
// راه‌اندازی
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // بررسی احراز هویت
    const user = JSON.parse(localStorage.getItem('atlas_user') || 'null');
    if (!user) {
        window.location.href = '/';
        return;
    }
    
    currentUser = user;
    
    // بررسی زمان‌بندی
    checkAvailability();
    setInterval(checkAvailability, 60000); // هر دقیقه
    
    // بارگذاری کاربران آنلاین
    loadOnlineUsers();
    setInterval(loadOnlineUsers, 30000); // هر ۳۰ ثانیه
    
    // رویداد دکمه جستجو
    document.getElementById('findMatchBtn')?.addEventListener('click', findMatch);
});

// استایل‌های پنجره تماس
const callStyles = document.createElement('style');
callStyles.textContent = `
.call-window {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 2000;
    animation: slideUp 0.4s ease;
}

.call-container {
    background: var(--bg-card, #fff);
    border-radius: 20px;
    padding: 1.5rem;
    width: 320px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    border: 1px solid var(--border, #e2e8f0);
}

.call-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.call-status {
    font-size: 0.8rem;
    font-weight: 600;
    color: #22C55E;
}

.call-close {
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--text-muted, #94a3b8);
    transition: all 0.3s ease;
}

.call-close:hover {
    color: var(--text, #0f172a);
    transform: rotate(90deg);
}

.call-body {
    text-align: center;
    padding: 0.5rem 0;
}

.call-avatar img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid var(--primary, #7C3AED);
    object-fit: cover;
}

.call-name {
    font-size: 1.2rem;
    font-weight: 700;
    margin-top: 0.3rem;
    color: var(--text, #0f172a);
}

.call-level {
    font-size: 0.85rem;
    color: var(--text-muted, #94a3b8);
}

.call-timer {
    font-size: 2rem;
    font-weight: 700;
    margin-top: 0.3rem;
    color: var(--primary, #7C3AED);
    font-variant-numeric: tabular-nums;
}

.call-footer {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1.2rem;
}

.call-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.call-btn.mute {
    background: var(--bg, #f8fafc);
    color: var(--text-secondary, #475569);
}

.call-btn.mute:hover {
    background: var(--bg-hover, #f1f5f9);
}

.call-btn.mute.muted {
    background: #EF4444;
    color: #fff;
}

.call-btn.end {
    background: #EF4444;
    color: #fff;
}

.call-btn.end:hover {
    transform: scale(1.1);
}

.call-btn.speaker {
    background: var(--bg, #f8fafc);
    color: var(--text-secondary, #475569);
}

.call-btn.speaker:hover {
    background: var(--bg-hover, #f1f5f9);
}

.call-tips {
    margin-top: 1rem;
    padding: 0.5rem;
    background: rgba(124,58,237,0.06);
    border-radius: 8px;
    font-size: 0.75rem;
    color: var(--text-secondary, #475569);
    text-align: center;
}

.dark .call-container {
    background: var(--bg-card, #1e293b);
}

.dark .call-name {
    color: var(--text, #f1f5f9);
}

.dark .call-btn.mute {
    background: var(--bg, #0f172a);
    color: var(--text-secondary, #cbd5e1);
}

@media (max-width: 480px) {
    .call-window {
        bottom: 10px;
        right: 10px;
        left: 10px;
    }
    
    .call-container {
        width: 100%;
        padding: 1rem;
    }
    
    .call-avatar img {
        width: 60px;
        height: 60px;
    }
    
    .call-timer {
        font-size: 1.5rem;
    }
}
`;
document.head.appendChild(callStyles);