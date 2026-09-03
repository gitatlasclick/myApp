// ==========================================
// SPEAKING COURSE - 아틀라스 한글 (ACADEMIC)
// ==========================================

class SpeakingCourse {
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
        console.log('💬 Speaking Course Ready!');
    }

    loadProgress() {
        const saved = localStorage.getItem('atlas_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.progress = data['speaking'] || { lessons: {} };
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
                id: 's1', level: 'beginner', korean: '초급 회화', title: 'مکالمه مقدماتی',
                desc: 'موقعیت‌های روزمره: سلام، خرید، رستوران',
                icon: 'fa-seedling', iconClass: 's-icon-beginner',
                lessons: [
                    {
                        id: 's1l1', scenario: 'معارفه', title: 'سلام و احوالپرسی',
                        desc: 'یادگیری عبارت‌های پایه برای شروع مکالمه',
                        dialog: [
                            { speaker: 'A', ko: '안녕하세요!', fa: 'سلام!' },
                            { speaker: 'B', ko: '안녕하세요! 처음 뵙겠습니다.', fa: 'سلام! اولین‌باره می‌بینمتون.' },
                            { speaker: 'A', ko: '저는 [이름]입니다. 반갑습니다.', fa: 'من [اسم] هستم. خوشبختم.' }
                        ]
                    },
                    {
                        id: 's1l2', scenario: 'معارفه', title: 'معرفی خود و شغل',
                        desc: 'گفتن اسم، شغل و ملیت به کره‌ای',
                        dialog: [
                            { speaker: 'A', ko: '저는 학생입니다.', fa: 'من دانشجو هستم.' },
                            { speaker: 'B', ko: '저는 회사원입니다. 한국에서 왔어요.', fa: 'من کارمندم. اهل کره هستم.' }
                        ]
                    },
                    {
                        id: 's1l3', scenario: 'خرید', title: 'خرید از فروشگاه',
                        desc: 'پرسیدن قیمت و خرید وسایل',
                        dialog: [
                            { speaker: 'A', ko: '이거 얼마예요?', fa: 'این چنده؟' },
                            { speaker: 'B', ko: '오천 원이에요.', fa: '۵۰۰۰ وُنه.' },
                            { speaker: 'A', ko: '너무 비싸요! 깎아 주세요.', fa: 'خیلی گرونه! تخفیف بدید.' }
                        ]
                    },
                    {
                        id: 's1l4', scenario: 'رستوران', title: 'سفارش غذا',
                        desc: 'منو خوندن و غذا سفارش دادن',
                        dialog: [
                            { speaker: 'A', ko: '메뉴 주세요.', fa: 'لطفاً منو رو بدید.' },
                            { speaker: 'B', ko: '여기 있습니다. 뭘 드시겠어요?', fa: 'بفرمایید. چی میل دارید؟' },
                            { speaker: 'A', ko: '김치찌개 하나 주세요.', fa: 'یه کیمچی-جیگه لطفاً.' }
                        ]
                    },
                    {
                        id: 's1l5', scenario: 'جهت‌یابی', title: 'پرسیدن آدرس',
                        desc: 'پیدا کردن مسیر در خیابون',
                        dialog: [
                            { speaker: 'A', ko: '실례합니다. 지하철역이 어디예요?', fa: 'ببخشید. ایستگاه مترو کجاست؟' },
                            { speaker: 'B', ko: '저기 오른쪽에 있어요.', fa: 'اونجا سمت راسته.' }
                        ]
                    }
                ]
            },
            {
                id: 's2', level: 'intermediate', korean: '중급 회화', title: 'مکالمه متوسط',
                desc: 'موقعیت‌های اجتماعی: تلفن، قرار ملاقات، نظر دادن',
                icon: 'fa-fire', iconClass: 's-icon-intermediate',
                lessons: [
                    {
                        id: 's2l1', scenario: 'تلفن', title: 'مکالمه تلفنی',
                        desc: 'تماس گرفتن و وقت گرفتن',
                        dialog: [
                            { speaker: 'A', ko: '여보세요? 거기 병원이죠?', fa: 'الو؟ اونجا بیمارستانه؟' },
                            { speaker: 'B', ko: '네, 맞습니다. 무엇을 도와드릴까요?', fa: 'بله، درسته. چطور می‌تونم کمکتون کنم؟' },
                            { speaker: 'A', ko: '진료 예약을 하고 싶어요.', fa: 'می‌خوام وقت ویزیت بگیرم.' }
                        ]
                    },
                    {
                        id: 's2l2', scenario: 'قرار', title: 'دعوت و قرار گذاشتن',
                        desc: 'دوستاتو دعوت کن و برنامه بریز',
                        dialog: [
                            { speaker: 'A', ko: '주말에 시간 있어요?', fa: 'آخر هفته وقت داری؟' },
                            { speaker: 'B', ko: '네, 토요일에 괜찮아요.', fa: 'آره، شنبه خوبه.' },
                            { speaker: 'A', ko: '그럼 영화 보러 갈래요?', fa: 'پس بریم سینما؟' }
                        ]
                    },
                    {
                        id: 's2l3', scenario: 'نظر', title: 'بیان نظر و احساسات',
                        desc: 'گفتن اینکه چی دوست داری و چی نه',
                        dialog: [
                            { speaker: 'A', ko: '이 영화 어땠어요?', fa: 'این فیلم چطور بود؟' },
                            { speaker: 'B', ko: '정말 재미있었어요!', fa: 'واقعاً جالب بود!' }
                        ]
                    },
                    {
                        id: 's2l4', scenario: 'سفر', title: 'رزرو هتل و بلیط',
                        desc: 'مسافرت رفتن و رزرو کردن',
                        dialog: [
                            { speaker: 'A', ko: '방을 예약하고 싶어요.', fa: 'می‌خوام یه اتاق رزرو کنم.' },
                            { speaker: 'B', ko: '며칠 동안 계실 거예요?', fa: 'چند روز تشریف دارید؟' }
                        ]
                    }
                ]
            },
            {
                id: 's3', level: 'advanced', korean: '고급 회화', title: 'مکالمه پیشرفته',
                desc: 'بحث و گفتگو: مصاحبه، ارائه، مناظره',
                icon: 'fa-crown', iconClass: 's-icon-advanced',
                lessons: [
                    {
                        id: 's3l1', scenario: 'مصاحبه', title: 'مصاحبه کاری و GKS',
                        desc: 'پاسخ به سوالات مصاحبه به کره‌ای',
                        dialog: [
                            { speaker: 'A', ko: '자기소개를 해 주세요.', fa: 'لطفاً خودتون رو معرفی کنید.' },
                            { speaker: 'B', ko: '안녕하세요. 저는 [이름]입니다. [전공]을 공부했습니다.', fa: 'سلام. من [اسم] هستم. [رشته] خوندم.' },
                            { speaker: 'A', ko: '왜 한국에서 공부하고 싶어요?', fa: 'چرا می‌خواید توی کره درس بخونید؟' }
                        ]
                    },
                    {
                        id: 's3l2', scenario: 'ارائه', title: 'ارائه دانشگاهی',
                        desc: 'یه موضوع رو به صورت رسمی ارائه بده',
                        dialog: [
                            { speaker: 'A', ko: '오늘은 [주제]에 대해 발표하겠습니다.', fa: 'امروز درباره [موضوع] ارائه می‌دم.' },
                            { speaker: 'A', ko: '질문 있으시면 언제든지 해 주세요.', fa: 'اگه سوالی دارید، هر وقت بپرسید.' }
                        ]
                    },
                    {
                        id: 's3l3', scenario: 'مناظره', title: 'بحث و تبادل نظر',
                        desc: 'موافقت و مخالفت کردن به صورت مودبانه',
                        dialog: [
                            { speaker: 'A', ko: '저는 이 의견에 동의합니다.', fa: 'من با این نظر موافقم.' },
                            { speaker: 'B', ko: '그렇지만 다른 생각도 있어요.', fa: 'اما نظر دیگه‌ای هم هست.' }
                        ]
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
                            stroke="#5B8C5A"
                            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
                </svg>
                <span class="percent-text" style="color:#5B8C5A;">${percent}%</span>
            </div>
            <p class="progress-info-text">${done}/${total} درس تکمیل شده</p>
            <div class="progress-mini-bar"><div class="progress-mini-fill" style="width:${percent}%;background:#5B8C5A;"></div></div>
        `;
    }

    renderTabs() {
        const container = document.getElementById('courseTabs');
        if (!container) return;
        const tabs = [
            { id: 'all', label: 'همه سطوح', icon: 'fa-th-large' },
            { id: 's1', label: 'مقدماتی', icon: 'fa-seedling' },
            { id: 's2', label: 'متوسط', icon: 'fa-fire' },
            { id: 's3', label: 'پیشرفته', icon: 'fa-crown' }
        ];
        container.innerHTML = tabs.map(t => `
            <button class="course-tab ${this.activeTab === t.id ? 'active' : ''}"
                    onclick="window.speakingCourse.switchTab('${t.id}')">
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
        const container = document.getElementById('speakingContent');
        if (!container) return;
        const levels = this.activeTab === 'all' ? this.levelsData : this.levelsData.filter(l => l.id === this.activeTab);
        container.innerHTML = levels.map(level => this.renderLevel(level)).join('');
    }

    renderLevel(level) {
        const { done, total, percent } = this.getLevelProgress(level.lessons);
        return `
            <div class="level-section">
                <div class="level-header">
                    <div class="level-icon ${level.iconClass}"><i class="fas ${level.icon}"></i></div>
                    <div class="level-info">
                        <span class="level-badge ${level.level}">${level.level === 'beginner' ? 'مقدماتی' : level.level === 'intermediate' ? 'متوسط' : 'پیشرفته'}</span>
                        <span class="level-korean">${level.korean}</span>
                        <div class="level-title">${level.title}</div>
                        <div class="level-desc">${level.desc}</div>
                    </div>
                </div>
                <div class="lessons-grid-speaking">
                    ${level.lessons.map(lesson => this.renderLessonCard(lesson)).join('')}
                </div>
            </div>
        `;
    }

    renderLessonCard(lesson) {
        const completed = this.isLessonDone(lesson.id);
        return `
            <div class="speaking-card ${completed ? 'completed' : ''}">
                <div class="speaking-card-top">
                    <div class="speaking-card-scenario"><i class="fas fa-map-marker-alt"></i> ${lesson.scenario}</div>
                    <div class="speaking-card-title">${lesson.title}</div>
                    <div class="speaking-card-subtitle">${lesson.desc}</div>
                </div>
                ${lesson.dialog ? `
                    <div class="speaking-dialog-preview">
                        ${lesson.dialog.map(d => `
                            <div class="dialog-line">
                                <span class="dialog-speaker">${d.speaker}:</span>
                                <div class="dialog-text">
                                    <div class="dialog-ko">${d.ko}</div>
                                    <div class="dialog-fa">${d.fa}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="speaking-card-footer">
                    <span class="speaking-card-status ${completed ? 'completed' : 'pending'}">
                        ${completed ? '<i class="fas fa-check-circle"></i> تکمیل شده' : '<i class="far fa-circle"></i> در انتظار'}
                    </span>
                    <button class="speaking-card-btn ${completed ? 'continue' : 'start'}"
                            onclick="window.speakingCourse.openLesson('${lesson.id}')">
                        ${completed ? '<i class="fas fa-eye"></i> مرور' : '<i class="fas fa-play"></i> شروع درس'}
                    </button>
                </div>
            </div>
        `;
    }

    // ========== ACTIONS ==========
    openLesson(lessonId) {
        this.progress.lessons[lessonId] = true;
        this.saveProgress();
        this.renderAll();
        console.log(`💬 Opening speaking lesson: ${lessonId}`);
    }

    saveProgress() {
        const all = JSON.parse(localStorage.getItem('atlas_progress') || '{}');
        all['speaking'] = this.progress;
        localStorage.setItem('atlas_progress', JSON.stringify(all));
    }

    renderAll() {
        this.renderHeroProgress();
        this.renderAllLevels();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.speakingCourse = new SpeakingCourse();
});