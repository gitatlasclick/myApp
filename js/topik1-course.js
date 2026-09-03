// ==========================================
// TOPIK I COURSE - 아틀라스 한글
// ==========================================

class Topik1Course {
    constructor() {
        this.progress = {};
        this.activeTab = 'all';
        this.sections = [];
        this.init();
    }

    init() {
        this.loadProgress();
        this.loadSections();
        this.renderHeroProgress();
        this.renderTabs();
        this.renderAllSections();
        console.log('🎯 TOPIK I Course Ready!');
    }

    loadProgress() {
        const saved = localStorage.getItem('atlas_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.progress = data['topik1'] || { lessons: {} };
            } catch(e) {
                this.progress = { lessons: {} };
            }
        }
        if (!this.progress.lessons) this.progress.lessons = {};
    }

    isLessonDone(id) { return this.progress.lessons?.[id] || false; }

    getSectionProgress(lessons) {
        const total = lessons.length;
        const done = lessons.filter(l => this.isLessonDone(l.id)).length;
        return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
    }

    getTotalProgress() {
        let total = 0, done = 0;
        this.sections.forEach(section => {
            section.lessons.forEach(l => {
                total++;
                if (this.isLessonDone(l.id)) done++;
            });
        });
        return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
    }

    // ========== DATA ==========
    loadSections() {
        this.sections = [
            {
                id: 'listening',
                title: 'بخش شنیداری (듣기)',
                korean: '듣기 영역',
                subtitle: 'Listening Comprehension',
                icon: 'fa-headphones',
                iconClass: 't1-icon-listening',
                color: '#00D2FF',
                lessons: [
                    { id: 't1l1', title: 'گوش دادن به مکالمات ساده', desc: 'مکالمات روزمره ۲-۳ جمله‌ای', type: 'lesson', duration: '۲۰ دقیقه', questions: 8 },
                    { id: 't1l2', title: 'تشخیص موقعیت مکالمه', desc: 'کجا دارن حرف می‌زنن؟ فروشگاه؟ خونه؟', type: 'lesson', duration: '۱۵ دقیقه', questions: 6 },
                    { id: 't1l3', title: 'درک موضوع اصلی', desc: 'موضوع اصلی مکالمه چیه؟', type: 'lesson', duration: '۲۰ دقیقه', questions: 10 },
                    { id: 't1l4', title: 'تمرین شنیداری شماره ۱', desc: '۱۰ سوال شبیه‌سازی شده', type: 'practice', duration: '۳۰ دقیقه', questions: 10 },
                    { id: 't1l5', title: 'کوییز شنیداری', desc: 'تست جامع Listening', type: 'quiz', duration: '۲۰ دقیقه', questions: 15 }
                ]
            },
            {
                id: 'reading',
                title: 'بخش خواندن (읽기)',
                korean: '읽기 영역',
                subtitle: 'Reading Comprehension',
                icon: 'fa-book-open',
                iconClass: 't1-icon-reading',
                color: '#4A90D9',
                lessons: [
                    { id: 't1l6', title: 'خواندن علائم و تابلوها', desc: 'تابلوهای خیابون، فروشگاه، مترو', type: 'lesson', duration: '۱۵ دقیقه', questions: 6 },
                    { id: 't1l7', title: 'درک متن‌های کوتاه', desc: 'پیامک، ایمیل، یادداشت', type: 'lesson', duration: '۲۰ دقیقه', questions: 8 },
                    { id: 't1l8', title: 'پیدا کردن اطلاعات کلیدی', desc: 'اسم، تاریخ، مکان، قیمت', type: 'lesson', duration: '۲۰ دقیقه', questions: 10 },
                    { id: 't1l9', title: 'تمرین خواندن شماره ۱', desc: '۱۰ سوال شبیه‌سازی شده', type: 'practice', duration: '۳۰ دقیقه', questions: 10 },
                    { id: 't1l10', title: 'کوییز خواندن', desc: 'تست جامع Reading', type: 'quiz', duration: '۲۰ دقیقه', questions: 15 }
                ]
            },
            {
                id: 'vocab',
                title: 'واژگان ضروری (어휘)',
                korean: '필수 어휘',
                subtitle: 'Essential Vocabulary',
                icon: 'fa-font',
                iconClass: 't1-icon-vocab',
                color: '#C4956A',
                lessons: [
                    { id: 't1l11', title: 'واژگان سطح ۱ (۸۰۰ کلمه)', desc: 'کلمات پایه مورد نیاز', type: 'lesson', duration: '۳۰ دقیقه', questions: 20 },
                    { id: 't1l12', title: 'واژگان سطح ۲ (۱۵۰۰ کلمه)', desc: 'کلمات پرتکرار TOPIK I', type: 'lesson', duration: '۳۰ دقیقه', questions: 20 },
                    { id: 't1l13', title: 'کوییز واژگان', desc: 'تست جامع Vocabulary', type: 'quiz', duration: '۲۰ دقیقه', questions: 25 }
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
                            stroke="#00D2FF"
                            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
                </svg>
                <span class="percent-text" style="color:#00D2FF;">${percent}%</span>
            </div>
            <p class="progress-info-text">${done}/${total} درس تکمیل شده</p>
            <div class="progress-mini-bar"><div class="progress-mini-fill" style="width:${percent}%;background:#00D2FF;"></div></div>
        `;
    }

    renderTabs() {
        const container = document.getElementById('sectionTabs');
        if (!container) return;
        const tabs = [
            { id: 'all', label: 'همه بخش‌ها', icon: 'fa-th-large' },
            { id: 'listening', label: 'شنیداری', icon: 'fa-headphones' },
            { id: 'reading', label: 'خواندن', icon: 'fa-book-open' },
            { id: 'vocab', label: 'واژگان', icon: 'fa-font' }
        ];
        container.innerHTML = tabs.map(t => `
            <button class="section-tab ${this.activeTab === t.id ? 'active' : ''}"
                    onclick="window.topik1Course.switchTab('${t.id}')">
                <i class="fas ${t.icon}"></i> ${t.label}
            </button>
        `).join('');
    }

    switchTab(tabId) {
        this.activeTab = tabId;
        this.renderTabs();
        this.renderAllSections();
    }

    renderAllSections() {
        const container = document.getElementById('topik1Content');
        if (!container) return;
        const sections = this.activeTab === 'all' ? this.sections : this.sections.filter(s => s.id === this.activeTab);
        container.innerHTML = sections.map(section => this.renderSection(section)).join('') + this.renderMockTest();
    }

    renderSection(section) {
        const { done, total, percent } = this.getSectionProgress(section.lessons);
        return `
            <div class="exam-section-card">
                <div class="exam-section-header">
                    <div class="exam-section-icon ${section.iconClass}">
                        <i class="fas ${section.icon}"></i>
                    </div>
                    <div class="exam-section-info">
                        <span class="exam-section-korean">${section.korean}</span>
                        <div class="exam-section-title">${section.title}</div>
                        <div class="exam-section-subtitle">${section.subtitle} · ${total} درس · ${percent}% تکمیل</div>
                    </div>
                </div>
                <div class="topik-lessons-list">
                    ${section.lessons.map(lesson => this.renderLesson(lesson, section.color)).join('')}
                </div>
            </div>
        `;
    }

    renderLesson(lesson, color) {
        const done = this.isLessonDone(lesson.id);
        return `
            <div class="topik-lesson-item">
                <div class="topik-lesson-icon ${lesson.type === 'quiz' ? 'quiz' : done ? 'done' : 'current'}">
                    <i class="fas ${lesson.type === 'quiz' ? 'fa-question-circle' : lesson.type === 'practice' ? 'fa-pencil-alt' : 'fa-play'}"></i>
                </div>
                <div class="topik-lesson-info">
                    <span class="topik-lesson-title">${lesson.title}</span>
                    <span class="topik-lesson-desc">${lesson.desc}</span>
                </div>
                <div class="topik-lesson-meta">
                    <span><i class="far fa-clock"></i> ${lesson.duration}</span>
                    <span><i class="fas fa-question-circle"></i> ${lesson.questions} سوال</span>
                </div>
                <button class="topik-lesson-btn ${done ? 'review' : 'start'}"
                        onclick="window.topik1Course.completeLesson('${lesson.id}')">
                    ${done ? '<i class="fas fa-check"></i> مرور' : '<i class="fas fa-play"></i> شروع'}
                </button>
            </div>
        `;
    }

    renderMockTest() {
        return `
            <div class="mock-test-banner">
                <h3><i class="fas fa-trophy"></i> آزمون شبیه‌سازی شده TOPIK I</h3>
                <p>یه آزمون کامل ۱۰۰ دقیقه‌ای با ۷۰ سوال. خودت رو محک بزن!</p>
                <button class="mock-test-btn" onclick="window.topik1Course.startMockTest()">
                    <i class="fas fa-rocket"></i>
                    شروع آزمون آزمایشی
                </button>
            </div>
        `;
    }

    // ========== ACTIONS ==========
    completeLesson(lessonId) {
        this.progress.lessons[lessonId] = !this.progress.lessons[lessonId];
        this.saveProgress();
        this.renderAll();
    }

    startMockTest() {
        alert('🚀 آزمون آزمایشی TOPIK I به زودی در دسترس قرار می‌گیره!');
        console.log('Mock test starting...');
    }

    saveProgress() {
        const all = JSON.parse(localStorage.getItem('atlas_progress') || '{}');
        all['topik1'] = this.progress;
        localStorage.setItem('atlas_progress', JSON.stringify(all));
    }

    renderAll() {
        this.renderHeroProgress();
        this.renderAllSections();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.topik1Course = new Topik1Course();
});