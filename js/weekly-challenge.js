// ==========================================
// WEEKLY CHALLENGE - ATLAS KOREAN
// ==========================================

class WeeklyChallenge {
    constructor(roomId) {
        this.roomId = roomId;
        this.data = null;
        this.init();
    }

    async init() {
        await this.loadData();
        this.render();
        this.setupEvents();
        console.log('🏆 Weekly Challenge Ready!');
    }

    async loadData() {
        // داده‌های آزمایشی (بعداً با API واقعی جایگزین می‌شود)
        this.data = {
            goal: 10000,
            current: 7840,
            completed: false,
            progress: 78,
            days_left: 3,
            top_contributors: [
                { username: 'Mina', contribution: 2450 },
                { username: 'Jisoo', contribution: 2100 },
                { username: 'Sara', contribution: 1800 },
                { username: 'Hana', contribution: 1490 },
            ],
            badge: '🏆',
            badge_name: 'Champion',
            participants: 24
        };
    }

    render() {
        const container = document.getElementById('roomChallenge');
        if (!container) return;

        const progress = this.data.progress;
        const isCompleted = this.data.completed || progress >= 100;

        container.innerHTML = `
            <div class="challenge-container">
                <div class="challenge-header">
                    <div>
                        <h3>🏆 چالش هفتگی</h3>
                        <span class="challenge-sub">${this.data.days_left} روز باقی‌مانده</span>
                    </div>
                    <div class="challenge-stats">
                        <span>🎯 ${this.data.goal.toLocaleString()} XP</span>
                        <span>👥 ${this.data.participants} شرکت‌کننده</span>
                    </div>
                </div>

                ${isCompleted ? `
                    <div class="challenge-completed">
                        <div class="completed-icon">🎉</div>
                        <h4>چالش تکمیل شد!</h4>
                        <p>همه اعضا نشان <strong>${this.data.badge_name}</strong> را دریافت کردند!</p>
                        <div class="badge-display">${this.data.badge}</div>
                    </div>
                ` : `
                    <div class="challenge-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${Math.min(progress, 100)}%;"></div>
                        </div>
                        <div class="progress-info">
                            <span>${this.data.current.toLocaleString()} XP</span>
                            <span>${Math.min(progress, 100)}%</span>
                        </div>
                    </div>
                `}

                <div class="challenge-contributors">
                    <h4>🌟 برترین مشارکت‌کنندگان</h4>
                    ${this.data.top_contributors.map((u, i) => `
                        <div class="contributor-item">
                            <span class="rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</span>
                            <span class="name">${u.username}</span>
                            <span class="xp">${u.contribution.toLocaleString()} XP</span>
                            <div class="contrib-bar">
                                <div class="contrib-fill" style="width:${(u.contribution / this.data.goal) * 100}%;"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                ${!isCompleted ? `
                    <div class="challenge-action">
                        <button class="btn-challenge" id="contributeBtn">
                            <i class="fas fa-plus"></i> مشارکت در چالش
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    setupEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'contributeBtn' || e.target.closest('#contributeBtn')) {
                this.contribute();
            }
        });
    }

    contribute() {
        const amount = prompt('چقدر XP می‌خواهید به چالش اضافه کنید؟', '100');
        if (!amount) return;

        const xp = parseInt(amount);
        if (isNaN(xp) || xp <= 0) {
            alert('لطفاً یک عدد معتبر وارد کنید');
            return;
        }

        // اضافه کردن به چالش
        this.data.current += xp;
        this.data.progress = Math.min(100, Math.round((this.data.current / this.data.goal) * 100));

        if (this.data.current >= this.data.goal) {
            this.data.completed = true;
            this.data.progress = 100;
            alert('🎉 چالش تکمیل شد! همه اعضا نشان گرفتند!');
        }

        this.render();
        this.showToast(`✅ ${xp} XP به چالش اضافه شد!`, 'success');
    }

    showToast(message, type = 'success') {
        const existing = document.querySelector('.challenge-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `challenge-toast ${type}`;
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

const challengeToastStyles = document.createElement('style');
challengeToastStyles.textContent = `
    .challenge-toast {
        position: fixed;
        bottom: 180px;
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
    .challenge-toast.show {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
    }
    .challenge-toast.success {
        background: #22C55E;
        color: white;
    }
    .challenge-toast.error {
        background: #EF4444;
        color: white;
    }
`;
document.head.appendChild(challengeToastStyles);

// ==========================================
// INIT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const roomId = new URLSearchParams(window.location.search).get('id') || 1;
    if (document.getElementById('roomChallenge')) {
        window.challenge = new WeeklyChallenge(roomId);
    }
});