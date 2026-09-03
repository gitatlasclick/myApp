// ==========================================
// TOPIK II COURSE - 아틀라스 한글
// ==========================================

class Topik2Course {
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
        console.log('🏆 TOPIK II Course Ready!');
    }

    loadProgress() {
        const saved = localStorage.getItem('atlas_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.progress = data['topik2'] || { lessons: {} };
            } catch(e) { this.progress = { lessons: {} }; }
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
        this.sections.forEach(s => s.lessons.forEach(l => {
            total++;
            if (this.isLessonDone(l.id)) done++;
        }));
        return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
    }

    // ========== DATA ==========
    loadSections() {
        this.sections = [
            {
                id: 'listening', title: 'شنیداری (듣기)', korean: '듣기 영역',
                subtitle: 'Listening - ۵۰ دقیقه - ۵۰ سوال',
                icon: 'fa-headphones', iconClass: 't2-icon-listening', color: '#D4A853',
                lessons: [
                    { id: 't2l1', title: 'مکالمات طولانی و پیچیده', desc: 'گفتگوهای ۴-۶ جمله‌ای', type: 'lesson', duration: '۲۵ دقیقه', questions: 10 },
                    { id: 't2l2', title: 'سخنرانی و ارائه', desc: 'درک مونولوگ‌های رسمی', type: 'lesson', duration: '۲۵ دقیقه', questions: 8 },
                    { id: 't2l3', title: 'اخبار و گزارش', desc: 'خبرهای کوتاه رادیویی', type: 'lesson', duration: '۲۰ دقیقه', questions: 8 },
                    { id: 't2l4', title: 'تمرین شبیه‌سازی شنیداری', desc: '۲۰ سوال استاندارد', type: 'practice', duration: '۴۰ دقیقه', questions: 20 },
                    { id: 't2l5', title: 'کوییز جامع شنیداری', desc: 'تست کامل Listening', type: 'quiz', duration: '۳۰ دقیقه', questions: 25 }
                ]
            },
            {
                id: 'reading', title: 'خواندن (읽기)', korean: '읽기 영역',
                subtitle: 'Reading - ۷۰ دقیقه - ۵۰ سوال',
                icon: 'fa-book-open', iconClass: 't2-icon-reading', color: '#C4956A',
                lessons: [
                    { id: 't2l6', title: 'متون خبری و اطلاعیه', desc: 'اخبار، آگهی، اطلاعیه رسمی', type: 'lesson', duration: '۲۵ دقیقه', questions: 10 },
                    { id: 't2l7', title: 'مقالات کوتاه تحلیلی', desc: 'متون ۲۰۰-۳۰۰ کلمه‌ای', type: 'lesson', duration: '۳۰ دقیقه', questions: 10 },
                    { id: 't2l8', title: 'ادبیات و شعر', desc: 'متون ادبی ساده', type: 'lesson', duration: '۲۰ دقیقه', questions: 6 },
                    { id: 't2l9', title: 'تمرین شبیه‌سازی خواندن', desc: '۲۰ سوال استاندارد', type: 'practice', duration: '۴۰ دقیقه', questions: 20 },
                    { id: 't2l10', title: 'کوییز جامع خواندن', desc: 'تست کامل Reading', type: 'quiz', duration: '۳۰ دقیقه', questions: 25 }
                ]
            },
            {
                id: 'writing', title: 'نوشتن (쓰기)', korean: '쓰기 영역',
                subtitle: 'Writing - ۵۰ دقیقه - ۴ سوال',
                icon: 'fa-pen', iconClass: 't2-icon-writing', color: '#D64B3F',
                lessons: [
                    { id: 't2l11', title: 'تکمیل جمله (سوال ۱-۲)', desc: 'پر کردن جای خالی', type: 'writing', duration: '۲۰ دقیقه', questions: 2 },
                    { id: 't2l12', title: 'نوشتن پاراگراف (سوال ۳)', desc: 'توضیح ۲۰۰-۳۰۰ کاراکتری', type: 'writing', duration: '۲۵ دقیقه', questions: 1 },
                    { id: 't2l13', title: 'انشای کامل (سوال ۴)', desc: 'مقاله ۶۰۰-۷۰۰ کاراکتری', type: 'writing', duration: '۳۰ دقیقه', questions: 1 },
                    { id: 't2l14', title: 'تمرین نوشتن', desc: 'شبیه‌سازی کامل Writing', type: 'practice', duration: '۵۰ دقیقه', questions: 4 }
                ]
            },
            {
                id: 'vocab', title: 'واژگان پیشرفته (어휘)', korean: '고급 어휘',
                subtitle: 'Vocabulary - Level 3-6',
                icon: 'fa-font', iconClass: 't2-icon-vocab', color: '#4A90D9',
                lessons: [
                    { id: 't2l15', title: 'واژگان سطح ۳-۴', desc: '۳۰۰۰-۴۰۰۰ کلمه', type: 'lesson', duration: '۳۰ دقیقه', questions: 25 },
                    { id: 't2l16', title: 'واژگان سطح ۵-۶', desc: '۶۰۰۰-۸۰۰۰ کلمه', type: 'lesson', duration: '۳۰ دقیقه', questions: 25 },
                    { id: 't2l17', title: 'کوییز جامع واژگان', desc: 'تست Vocabulary پیشرفته', type: 'quiz', duration: '۲۵ دقیقه', questions: 30 }
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
                            stroke="#D4A853"
                            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
                </svg>
                <span class="percent-text" style="color:#D4A853;">${percent}%</span>
            </div>
            <p class="progress-info-text">${done}/${total} درس تکمیل شده</p>
            <div class="progress-mini-bar"><div class="progress-mini-fill" style="width:${percent}%;background:#D4A853;"></div></div>
        `;
    }

    renderTabs() {
        const container = document.getElementById('sectionTabs');
        if (!container) return;
        const tabs = [
            { id: 'all', label: 'همه بخش‌ها', icon: 'fa-th-large' },
            { id: 'listening', label: 'شنیداری', icon: 'fa-headphones' },
            { id: 'reading', label: 'خواندن', icon: 'fa-book-open' },
            { id: 'writing', label: 'نوشتن', icon: 'fa-pen' },
            { id: 'vocab', label: 'واژگان', icon: 'fa-font' }
        ];
        container.innerHTML = tabs.map(t => `
            <button class="section-tab ${this.activeTab === t.id ? 'active' : ''}"
                    onclick="window.topik2Course.switchTab('${t.id}')">
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
        const container = document.getElementById('topik2Content');
        if (!container) return;
        const sections = this.activeTab === 'all' ? this.sections : this.sections.filter(s => s.id === this.activeTab);
        container.innerHTML = this.renderLevelsOverview() + sections.map(s => this.renderSection(s)).join('') + this.renderMockTest();
    }

    renderLevelsOverview() {
        if (this.activeTab !== 'all') return '';
        const levels = [
            { level: 3, title: 'TOPIK Level 3', desc: 'متوسط رو به پایین' },
            { level: 4, title: 'TOPIK Level 4', desc: 'متوسط رو به بالا' },
            { level: 5, title: 'TOPIK Level 5', desc: 'پیشرفته' },
            { level: 6, title: 'TOPIK Level 6', desc: 'تسلط کامل' }
        ];
        return `
            <div class="levels-overview">
                ${levels.map(l => `
                    <div class="level-overview-card">
                        <div class="level-overview-number">${l.level}</div>
                        <div class="level-overview-title">${l.title}</div>
                        <div class="level-overview-desc">${l.desc}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSection(section) {
        const { done, total, percent } = this.getSectionProgress(section.lessons);
        return `
            <div class="exam-section-card">
                <div class="exam-section-header">
                    <div class="exam-section-icon ${section.iconClass}"><i class="fas ${section.icon}"></i></div>
                    <div class="exam-section-info">
                        <span class="exam-section-korean">${section.korean}</span>
                        <div class="exam-section-title">${section.title}</div>
                        <div class="exam-section-subtitle">${section.subtitle} · ${total} درس · ${percent}% تکمیل</div>
                    </div>
                </div>
                <div class="topik-lessons-list">
                    ${section.lessons.map(lesson => this.renderLesson(lesson)).join('')}
                </div>
            </div>
        `;
    }

    renderLesson(lesson) {
        const done = this.isLessonDone(lesson.id);
        const iconClass = lesson.type === 'quiz' ? 'quiz' : lesson.type === 'writing' ? 'writing' : done ? 'done' : 'current';
        return `
            <div class="topik-lesson-item">
                <div class="topik-lesson-icon ${iconClass}">
                    <i class="fas ${lesson.type === 'quiz' ? 'fa-question-circle' : lesson.type === 'writing' ? 'fa-pen' : lesson.type === 'practice' ? 'fa-pencil-alt' : 'fa-play'}"></i>
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
                        onclick="window.topik2Course.completeLesson('${lesson.id}')">
                    ${done ? '<i class="fas fa-check"></i> مرور' : '<i class="fas fa-play"></i> شروع'}
                </button>
            </div>
        `;
    }

    renderMockTest() {
        return `
            <div class="mock-test-banner">
                <h3><i class="fas fa-trophy"></i> آزمون شبیه‌سازی شده TOPIK II</h3>
                <p>یه آزمون کامل ۱۸۰ دقیقه‌ای با ۱۰۴ سوال. خودت رو محک بزن!</p>
                <button class="mock-test-btn" onclick="window.topik2Course.startMockTest()">
                    <i class="fas fa-rocket"></i> شروع آزمون آزمایشی
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
        alert('🚀 آزمون آزمایشی TOPIK II به زودی در دسترس قرار می‌گیره!');
    }

    saveProgress() {
        const all = JSON.parse(localStorage.getItem('atlas_progress') || '{}');
        all['topik2'] = this.progress;
        localStorage.setItem('atlas_progress', JSON.stringify(all));
    }

    renderAll() {
        this.renderHeroProgress();
        this.renderAllSections();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.topik2Course = new Topik2Course();
});