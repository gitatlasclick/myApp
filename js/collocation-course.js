// ==========================================
// COLLOCATION COURSE - 아틀라스 한글 (ACADEMIC)
// ==========================================

class CollocationCourse {
    constructor() {
        this.progress = {};
        this.activeTab = 'all';
        this.levelsData = [];
        this.init();
    }

    init() {
        this.loadProgress();
        this.loadLevelsData();
        this.renderHeroProgress();
        this.renderTabs();
        this.renderAllLevels();
        console.log('🔗 Collocation Academic Ready!');
    }

    loadProgress() {
        const saved = localStorage.getItem('atlas_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.progress = data['collocation'] || { lessons: {} };
            } catch(e) {
                this.progress = { lessons: {} };
            }
        }
        if (!this.progress.lessons) this.progress.lessons = {};
    }

    isLessonDone(id) { return this.progress.lessons?.[id] || false; }

    getLevelProgress(lessons) {
        const total = lessons.length;
        const done = lessons.filter(l => this.isLessonDone(l.id)).length;
        return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
    }

    getTotalProgress() {
        let total = 0, done = 0;
        this.levelsData.forEach(level => {
            level.lessons.forEach(l => {
                total++;
                if (this.isLessonDone(l.id)) done++;
            });
        });
        return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
    }

    // ========== DATA ==========
    loadLevelsData() {
        this.levelsData = [
            {
                id: 'level1',
                level: 'beginner',
                korean: '초급',
                title: 'سطح مقدماتی',
                desc: 'کالوکیشن‌های پایه و پرکاربرد روزمره',
                icon: 'fa-seedling',
                iconClass: 'l-icon-beginner',
                lessons: [
                    {
                        id: 'c1', category: 'زندگی روزمره', pair: '밥을 먹다', romaji: 'bab-eul meokda', meaning: 'غذا خوردن',
                        desc: 'یکی از پرکاربردترین ترکیبات کره‌ای. 밥 (غذا/برنج) + 을 (نشانگر مفعول) + 먹다 (خوردن)'
                    },
                    {
                        id: 'c2', category: 'زندگی روزمره', pair: '잠을 자다', romaji: 'jam-eul jada', meaning: 'خوابیدن',
                        desc: '잠 (خواب) + 을 + 자다 (خوابیدن). ترکیب استاندارد برای "خوابیدن"'
                    },
                    {
                        id: 'c3', category: 'زندگی روزمره', pair: '친구를 만나다', romaji: 'chingu-reul mannada', meaning: 'ملاقات دوست',
                        desc: '친구 (دوست) + 를 + 만나다 (ملاقات کردن). برای قرار با دوست'
                    },
                    {
                        id: 'c4', category: 'احساسات', pair: '기분이 좋다', romaji: 'gibun-i jota', meaning: 'حال خوب داشتن',
                        desc: '기분 (حال/احساس) + 이 (نشانگر فاعل) + 좋다 (خوب بودن)'
                    },
                    {
                        id: 'c5', category: 'احساسات', pair: '화가 나다', romaji: 'hwa-ga nada', meaning: 'عصبانی شدن',
                        desc: '화 (عصبانیت) + 가 + 나다 (اتفاق افتادن). "عصبانیتم در اومد"'
                    },
                    {
                        id: 'c6', category: 'کار', pair: '일을 하다', romaji: 'il-eul hada', meaning: 'کار کردن',
                        desc: '일 (کار) + 을 + 하다 (انجام دادن). ترکیب پایه برای "کار کردن"'
                    }
                ]
            },
            {
                id: 'level2',
                level: 'intermediate',
                korean: '중급',
                title: 'سطح متوسط',
                desc: 'کالوکیشن‌های حرفه‌ای و موقعیت‌های خاص',
                icon: 'fa-fire',
                iconClass: 'l-icon-intermediate',
                lessons: [
                    {
                        id: 'c7', category: 'کار', pair: '약속을 잡다', romaji: 'yaksok-eul japda', meaning: 'قرار گذاشتن',
                        desc: '약속 (قرار ملاقات) + 을 + 잡다 (گرفتن). "یه وقت بگیریم"'
                    },
                    {
                        id: 'c8', category: 'کار', pair: '결정을 내리다', romaji: 'gyeoljeong-eul naerida', meaning: 'تصمیم گرفتن',
                        desc: '결정 (تصمیم) + 을 + 내리다 (صادر کردن). برای تصمیم‌های مهم'
                    },
                    {
                        id: 'c9', category: 'خرید', pair: '돈을 내다', romaji: 'don-eul naeda', meaning: 'پرداخت کردن',
                        desc: '돈 (پول) + 을 + 내다 (بیرون آوردن/پرداخت). "من حساب می‌کنم"'
                    },
                    {
                        id: 'c10', category: 'خرید', pair: '카드를 긁다', romaji: 'kadeu-reul geukda', meaning: 'کارت کشیدن',
                        desc: '카드 (کارت) + 를 + 긁다 (خراشیدن/کشیدن). اصطلاح رایج خرید'
                    },
                    {
                        id: 'c11', category: 'زندگی', pair: '스트레스를 받다', romaji: 'seuteureseu-reul batda', meaning: 'استرس گرفتن',
                        desc: '스트레스 (استرس) + 를 + 받다 (دریافت کردن). "استرس دارم"'
                    },
                    {
                        id: 'c12', category: 'زندگی', pair: '경험을 쌓다', romaji: 'gyeongheom-eul ssata', meaning: 'تجربه اندوختن',
                        desc: '경험 (تجربه) + 을 + 쌓다 (انباشتن). "تجربه کسب کن"'
                    }
                ]
            },
            {
                id: 'level3',
                level: 'advanced',
                korean: '고급',
                title: 'سطح پیشرفته',
                desc: 'کالوکیشن‌های آکادمیک و رسمی',
                icon: 'fa-crown',
                iconClass: 'l-icon-advanced',
                lessons: [
                    {
                        id: 'c13', category: 'عشق', pair: '사랑에 빠지다', romaji: 'sarang-e ppajida', meaning: 'عاشق شدن',
                        desc: '사랑 (عشق) + 에 + 빠지다 (افتادن). "افتادن توی عشق"'
                    },
                    {
                        id: 'c14', category: 'عشق', pair: '고백을 하다', romaji: 'gobaek-eul hada', meaning: 'اعتراف کردن',
                        desc: '고백 (اعتراف) + 을 + 하다. مخصوص اعتراف عاشقانه'
                    },
                    {
                        id: 'c15', category: 'رسمی', pair: '영향을 미치다', romaji: 'yeonghyang-eul michida', meaning: 'تأثیر گذاشتن',
                        desc: '영향 (تأثیر) + 을 + 미치다 (رساندن). برای متون رسمی'
                    },
                    {
                        id: 'c16', category: 'رسمی', pair: '노력을 기울이다', romaji: 'noryeok-eul giurida', meaning: 'تلاش کردن',
                        desc: '노력 (تلاش) + 을 + 기울이다 (متمایل کردن). "تلاش خود را متمرکز کردن"'
                    },
                    {
                        id: 'c17', category: 'رسمی', pair: '결론을 내리다', romaji: 'gyeollon-eul naerida', meaning: 'نتیجه‌گیری کردن',
                        desc: '결론 (نتیجه‌گیری) + 을 + 내리다. برای نتیجه‌گیری رسمی'
                    },
                    {
                        id: 'c18', category: 'TOPIK', pair: '문제를 해결하다', romaji: 'munje-reul haegyeolhada', meaning: 'حل مسئله',
                        desc: '문제 (مشکل/مسئله) + 를 + 해결하다 (حل کردن). پرکاربرد در TOPIK'
                    }
                ]
            }
        ];
    }

    // ========== RENDER ==========
    renderHeroProgress() {
        const container = document.getElementById('heroProgress');
        if (!container) return;
        const { done, total, percent } = this.getTotalProgress();
        const circ = 2 * Math.PI * 55;
        const offset = circ - (percent / 100) * circ;

        container.innerHTML = `
            <div class="progress-circle">
                <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle class="bg" cx="70" cy="70" r="55"/>
                    <circle class="fill" cx="70" cy="70" r="55"
                            stroke="#4A90D9"
                            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
                </svg>
                <span class="percent-text" style="color:#4A90D9;">${percent}%</span>
            </div>
            <p class="progress-info-text">${done}/${total} درس تکمیل شده</p>
            <div class="progress-mini-bar"><div class="progress-mini-fill" style="width:${percent}%;background:#4A90D9;"></div></div>
        `;
    }

    renderTabs() {
        const container = document.getElementById('courseTabs');
        if (!container) return;
        const tabs = [
            { id: 'all', label: 'همه سطوح', icon: 'fa-th-large' },
            { id: 'level1', label: 'مقدماتی', icon: 'fa-seedling' },
            { id: 'level2', label: 'متوسط', icon: 'fa-fire' },
            { id: 'level3', label: 'پیشرفته', icon: 'fa-crown' }
        ];
        container.innerHTML = tabs.map(t => `
            <button class="course-tab ${this.activeTab === t.id ? 'active' : ''}"
                    onclick="window.collocationCourse.switchTab('${t.id}')">
                <i class="fas ${t.icon}"></i> ${t.label}
            </button>
        `).join('');
    }

    switchTab(tabId) {
        this.activeTab = tabId;
        this.renderTabs();
        this.renderAllLevels();
    }

    renderAllLevels() {
        const container = document.getElementById('collocationContent');
        if (!container) return;

        const levels = this.activeTab === 'all' 
            ? this.levelsData 
            : this.levelsData.filter(l => l.id === this.activeTab);

        container.innerHTML = levels.map(level => this.renderLevel(level)).join('');
    }

    renderLevel(level) {
        const { done, total, percent } = this.getLevelProgress(level.lessons);
        return `
            <div class="level-section">
                <!-- Level Header -->
                <div class="level-header">
                    <div class="level-icon ${level.iconClass}">
                        <i class="fas ${level.icon}"></i>
                    </div>
                    <div class="level-info">
                        <span class="level-badge ${level.level}">${level.level === 'beginner' ? 'مقدماتی' : level.level === 'intermediate' ? 'متوسط' : 'پیشرفته'}</span>
                        <span class="level-korean">${level.korean}</span>
                        <div class="level-title">${level.title}</div>
                        <div class="level-desc">${level.desc}</div>
                    </div>
                    <div class="level-progress-mini">
                        <span>${done}/${total}</span>
                        <div style="width:80px;height:6px;background:var(--border);border-radius:10px;overflow:hidden;">
                            <div style="width:${percent}%;height:100%;background:#4A90D9;border-radius:10px;"></div>
                        </div>
                    </div>
                </div>

                <!-- Lessons Grid -->
                <div class="lessons-grid-collocation">
                    ${level.lessons.map(lesson => this.renderLessonCard(lesson)).join('')}
                </div>
            </div>
        `;
    }

    renderLessonCard(lesson) {
        const completed = this.isLessonDone(lesson.id);
        return `
            <div class="lesson-card-collocation ${completed ? 'completed' : ''}">
                <div class="lesson-card-top">
                    <div class="lesson-card-category">
                        <i class="fas fa-tag"></i> ${lesson.category}
                    </div>
                    <div class="lesson-card-title">${lesson.meaning}</div>
                    <div class="lesson-card-subtitle">${lesson.desc.substring(0, 80)}...</div>
                </div>
                
                <div class="lesson-card-body">
                    <div class="lesson-card-pair">
                        <span class="lesson-card-korean">${lesson.pair}</span>
                        <span class="lesson-card-romaji">[${lesson.romaji}]</span>
                    </div>
                </div>

                <div class="lesson-card-footer">
                    <span class="lesson-card-status ${completed ? 'completed' : 'pending'}">
                        ${completed ? '<i class="fas fa-check-circle"></i> تکمیل شده' : '<i class="far fa-circle"></i> در انتظار'}
                    </span>
                    <button class="lesson-card-btn ${completed ? 'continue' : 'start'}"
                            onclick="window.collocationCourse.openLesson('${lesson.id}')">
                        ${completed ? '<i class="fas fa-eye"></i> مرور' : '<i class="fas fa-play"></i> شروع درس'}
                    </button>
                </div>
            </div>
        `;
    }

    // ========== ACTIONS ==========
    openLesson(lessonId) {
        // Mark as completed
        this.progress.lessons[lessonId] = true;
        this.saveProgress();
        this.renderAll();
        
        // In future: navigate to lesson page
        // window.location.href = `lesson.html?id=${lessonId}`;
        console.log(`📖 Opening lesson: ${lessonId}`);
    }

    saveProgress() {
        const all = JSON.parse(localStorage.getItem('atlas_progress') || '{}');
        all['collocation'] = this.progress;
        localStorage.setItem('atlas_progress', JSON.stringify(all));
    }

    renderAll() {
        this.renderHeroProgress();
        this.renderAllLevels();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.collocationCourse = new CollocationCourse();
});