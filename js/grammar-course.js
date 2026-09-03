// ==========================================
// GRAMMAR COURSE - 아틀라스 한글 (COMPLETE)
// ==========================================

class GrammarCourse {
    constructor() {
        this.progress = {};
        this.activeTab = 'all';
        this.courseData = [];
        this.init();
    }

    init() {
        this.loadProgress();
        this.loadCourseData();
        this.renderHeroProgress();
        this.renderTabs();
        this.renderUnits('all');
        console.log('📖 Grammar Course Complete Ready!');
    }

    loadProgress() {
        const saved = localStorage.getItem('atlas_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.progress = data['grammar'] || { lessons: {} };
            } catch(e) {
                this.progress = { lessons: {} };
            }
        }
        if (!this.progress.lessons) this.progress.lessons = {};
    }

    isLessonDone(id) { return this.progress.lessons?.[id] || false; }

    isUnitDone(lessons) {
        return lessons.every(l => this.isLessonDone(l.id));
    }

    getTotalProgress() {
        let total = 0, done = 0;
        this.courseData.forEach(unit => {
            unit.lessons.forEach(l => {
                total++;
                if (this.isLessonDone(l.id)) done++;
            });
        });
        return total > 0 ? Math.round((done / total) * 100) : 0;
    }

    getCompletedCount() {
        return Object.values(this.progress.lessons || {}).filter(Boolean).length;
    }

    // ========== COURSE DATA ==========
    loadCourseData() {
        this.courseData = [
            {
                id: 'g1',
                title: 'ساختار جمله پایه',
                korean: '기본 문장 구조',
                level: 'beginner',
                icon: 'fa-seedling',
                iconClass: 'g-icon-beginner',
                concept: {
                    title: 'SOV: Subject + Object + Verb',
                    formula: '[Subject] + 이/가/은/는 + [Object] + 을/를 + [Verb]',
                    examples: [
                        { ko: '저는 사과를 먹어요', romaji: 'jeo-neun sagwa-reul meogeoyo', fa: 'من سیب می‌خورم' },
                        { ko: '그는 책을 읽어요', romaji: 'geu-neun chaek-eul ilgeoyo', fa: 'او کتاب می‌خواند' },
                        { ko: '우리는 한국어를 공부해요', romaji: 'uri-neun hangugeo-reul gongbuhaeyo', fa: 'ما کره‌ای می‌خوانیم' }
                    ]
                },
                lessons: [
                    { id: 'g1l1', title: '은/는 (Topic Marker)', subtitle: 'نشانگر موضوع - 정보 전달', type: 'lesson' },
                    { id: 'g1l2', title: '이/가 (Subject Marker)', subtitle: 'نشانگر فاعل - 행동의 주체', type: 'lesson' },
                    { id: 'g1l3', title: '을/를 (Object Marker)', subtitle: 'نشانگر مفعول - 행동의 대상', type: 'lesson' },
                    { id: 'g1l4', title: 'تمرین ترکیب نشانگرها', subtitle: 'تمرین جمله‌سازی با سه نشانگر', type: 'practice' },
                    { id: 'g1l5', title: 'کوییز سطح ۱', subtitle: 'تست جامع ساختار جمله', type: 'quiz' }
                ],
                quiz: {
                    q: '"저는 커피를 마셔요" یعنی چی؟',
                    options: ['من قهوه می‌خورم', 'من چای می‌نوشم', 'من قهوه می‌نوشم', 'من آب می‌نوشم'],
                    correct: 2
                }
            },
            {
                id: 'g2',
                title: 'زمان حال و صرف افعال',
                korean: '현재 시제와 동사 활용',
                level: 'beginner',
                icon: 'fa-clock',
                iconClass: 'g-icon-beginner',
                concept: {
                    title: 'Present Tense: 아요/어요/해요',
                    formula: 'Verb Stem + 아요 (vowel ㅏ/ㅗ) / 어요 (other vowels) / 해요 (하다 verbs)',
                    examples: [
                        { ko: '가다 → 가요', romaji: 'gada → gayo', fa: 'رفتن → می‌روم' },
                        { ko: '먹다 → 먹어요', romaji: 'meokda → meogeoyo', fa: 'خوردن → می‌خورم' },
                        { ko: '공부하다 → 공부해요', romaji: 'gongbuhada → gongbuhaeyo', fa: 'درس خواندن → می‌خوانم' }
                    ]
                },
                lessons: [
                    { id: 'g2l1', title: 'قاعده 아요/어요', subtitle: 'صرف افعال در زمان حال', type: 'lesson' },
                    { id: 'g2l2', title: 'افعال 하다 (해요)', subtitle: 'صرف افعال با ریشه 하다', type: 'lesson' },
                    { id: 'g2l3', title: 'افعال بی‌قاعده', subtitle: 'ㅂ, ㄷ, ㅅ بی‌قاعده‌ها', type: 'lesson' },
                    { id: 'g2l4', title: 'تمرین صرف افعال', subtitle: 'تمرین کاربردی', type: 'practice' },
                    { id: 'g2l5', title: 'کوییز سطح ۲', subtitle: 'تست جامع زمان حال', type: 'quiz' }
                ],
                quiz: {
                    q: '먹다 در زمان حال مودبانه چی میشه؟',
                    options: ['먹어', '먹어요', '먹었어요', '먹을 거예요'],
                    correct: 1
                }
            },
            {
                id: 'g3',
                title: 'زمان گذشته و آینده',
                korean: '과거와 미래 시제',
                level: 'intermediate',
                icon: 'fa-history',
                iconClass: 'g-icon-intermediate',
                concept: {
                    title: 'Past: 았어요/었어요 | Future: ㄹ 거예요/을 거예요',
                    formula: 'Past: Verb Stem + 았/었 + 어요 | Future: Verb Stem + ㄹ/을 거예요',
                    examples: [
                        { ko: '먹다 → 먹었어요 → 먹을 거예요', romaji: 'meokda → meogeosseoyo → meogeul geoyeyo', fa: 'خوردن → خوردم → خواهم خورد' },
                        { ko: '가다 → 갔어요 → 갈 거예요', romaji: 'gada → gasseoyo → gal geoyeyo', fa: 'رفتن → رفتم → خواهم رفت' }
                    ]
                },
                lessons: [
                    { id: 'g3l1', title: 'ساختار زمان گذشته', subtitle: '았어요/었어요/했어요', type: 'lesson' },
                    { id: 'g3l2', title: 'ساختار زمان آینده', subtitle: '을 거예요/ㄹ 거예요', type: 'lesson' },
                    { id: 'g3l3', title: 'تفاوت گذشته و آینده', subtitle: 'مقایسه و کاربرد', type: 'practice' },
                    { id: 'g3l4', title: 'کوییز سطح ۳', subtitle: 'تست جامع زمان‌ها', type: 'quiz' }
                ],
                quiz: {
                    q: '"갈 거예요" یعنی چی؟',
                    options: ['رفتم', 'می‌روم', 'خواهم رفت', 'برو'],
                    correct: 2
                }
            },
            {
                id: 'g4',
                title: 'جملات شرطی و سببی',
                korean: '조건과 원인 표현',
                level: 'intermediate',
                icon: 'fa-code-branch',
                iconClass: 'g-icon-intermediate',
                concept: {
                    title: 'Conditional: 면/으면 | Because: 때문에 | So: 아서/어서',
                    formula: 'Condition: Verb + (으)면 | Cause: Noun + 때문에 | Sequence: Verb + 아서/어서',
                    examples: [
                        { ko: '비가 오면 집에 있어요', romaji: 'biga omyeon jibe isseoyo', fa: 'اگه بارون بیاد خونه می‌مونم' },
                        { ko: '일 때문에 바빠요', romaji: 'il ttaemune bappayo', fa: 'به خاطر کار سرم شلوغه' },
                        { ko: '밥을 먹어서 배불러요', romaji: 'babeul meogeoseo baebulleoyo', fa: 'غذا خوردم پس سیرم' }
                    ]
                },
                lessons: [
                    { id: 'g4l1', title: '으면/면 (اگر)', subtitle: 'جملات شرطی', type: 'lesson' },
                    { id: 'g4l2', title: '때문에 (به خاطر)', subtitle: 'بیان علت', type: 'lesson' },
                    { id: 'g4l3', title: '아서/어서 (بنابراین)', subtitle: 'توالی و نتیجه', type: 'lesson' },
                    { id: 'g4l4', title: 'کوییز سطح ۴', subtitle: 'تست جامع شرط و سبب', type: 'quiz' }
                ],
                quiz: {
                    q: '"돈이 없어서 못 사요" یعنی چی؟',
                    options: ['پول دارم می‌خرم', 'چون پول ندارم نمی‌تونم بخرم', 'اگه پول داشته باشم می‌خرم', 'پول قرض می‌دم'],
                    correct: 1
                }
            },
            {
                id: 'g5',
                title: 'گرامر پیشرفته TOPIK',
                korean: '고급 문법 (TOPIK II)',
                level: 'advanced',
                icon: 'fa-crown',
                iconClass: 'g-icon-advanced',
                concept: {
                    title: 'Advanced: 다고 하다 (Reported) | 는 것 (Nominalization) | 더라도 (Even if)',
                    formula: 'Reported: V + 다고 하다 | Nominalization: V + 는 것 | Concessive: V + 더라도',
                    examples: [
                        { ko: '그가 온다고 했어요', romaji: 'geuga ondago haesseoyo', fa: 'گفت که میاد' },
                        { ko: '공부하는 것이 중요해요', romaji: 'gongbuhaneun geosi jungyohaeyo', fa: 'درس خوندن مهمه' },
                        { ko: '바쁘더라도 운동해요', romaji: 'bappeudeorado undonghaeyo', fa: 'حتی اگه سرم شلوغ باشه ورزش می‌کنم' }
                    ]
                },
                lessons: [
                    { id: 'g5l1', title: '다고/라고 하다', subtitle: 'نقل قول غیرمستقیم', type: 'lesson' },
                    { id: 'g5l2', title: '는 것 (اسم‌سازی)', subtitle: 'تبدیل فعل به اسم', type: 'lesson' },
                    { id: 'g5l3', title: '더라도 (حتی اگر)', subtitle: 'جملات concessive', type: 'lesson' },
                    { id: 'g5l4', title: 'آزمون نهایی گرامر', subtitle: 'تست جامع TOPIK II', type: 'quiz' }
                ],
                quiz: {
                    q: '"한국어를 공부하는 것이 재미있어요" یعنی چی؟',
                    options: ['کره‌ای خوندن خسته‌کننده‌ست', 'کره‌ای خوندن جالبه', 'کره‌ای رو دوست ندارم', 'می‌خوام کره‌ای بخونم'],
                    correct: 1
                }
            }
        ];
    }

    // ========== RENDER ==========
    renderHeroProgress() {
        const container = document.getElementById('heroProgress');
        if (!container) return;
        const percent = this.getTotalProgress();
        const done = this.getCompletedCount();
        const circ = 2 * Math.PI * 55;
        const offset = circ - (percent / 100) * circ;

        container.innerHTML = `
            <div class="progress-circle">
                <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle class="bg" cx="70" cy="70" r="55"/>
                    <circle class="fill" cx="70" cy="70" r="55"
                            stroke="#D64B3F"
                            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
                </svg>
                <span class="percent-text">${percent}%</span>
            </div>
            <p class="progress-info-text">${done} درس تکمیل شده</p>
            <div class="progress-mini-bar"><div class="progress-mini-fill" style="width:${percent}%;"></div></div>
        `;
    }

    renderTabs() {
        const container = document.getElementById('courseTabs');
        if (!container) return;
        const tabs = [
            { id: 'all', label: 'همه', icon: 'fa-th-large' },
            { id: 'g1', label: 'ساختار جمله', icon: 'fa-seedling' },
            { id: 'g2', label: 'زمان حال', icon: 'fa-clock' },
            { id: 'g3', label: 'گذشته و آینده', icon: 'fa-history' },
            { id: 'g4', label: 'شرط و سبب', icon: 'fa-code-branch' },
            { id: 'g5', label: 'پیشرفته', icon: 'fa-crown' }
        ];
        container.innerHTML = tabs.map(t => `
            <button class="course-tab ${this.activeTab === t.id ? 'active' : ''}"
                    onclick="window.grammarCourse.switchTab('${t.id}')">
                <i class="fas ${t.icon}"></i> ${t.label}
            </button>
        `).join('');
    }

    switchTab(tabId) {
        this.activeTab = tabId;
        this.renderTabs();
        this.renderUnits(tabId);
    }

    renderUnits(filter) {
        const container = document.getElementById('unitsGrid');
        if (!container) return;
        const units = filter === 'all' ? this.courseData : this.courseData.filter(u => u.id === filter);
        const allOpen = filter !== 'all';

        container.innerHTML = units.map(unit => {
            const unitDone = this.isUnitDone(unit.lessons);
            return `
                <div class="grammar-unit-card ${allOpen ? 'open' : ''}">
                    <div class="grammar-unit-header" onclick="window.grammarCourse.toggleUnit(this)">
                        <div class="grammar-unit-icon ${unit.iconClass}">
                            <i class="fas ${unit.icon}"></i>
                        </div>
                        <div class="grammar-unit-info">
                            <div class="grammar-unit-level">
                                <span class="level-badge ${unit.level}">${unit.level === 'beginner' ? 'مبتدی' : unit.level === 'intermediate' ? 'متوسط' : 'پیشرفته'}</span>
                                <span class="grammar-unit-korean">${unit.korean}</span>
                            </div>
                            <div class="grammar-unit-title">${unit.title}</div>
                            <div class="grammar-unit-count">${unit.lessons.length} درس</div>
                        </div>
                        <div class="grammar-unit-status ${unitDone ? 'completed' : 'incomplete'}">
                            ${unitDone ? '<i class="fas fa-check-circle"></i>' : '<i class="far fa-circle"></i>'}
                        </div>
                        <i class="fas fa-chevron-down grammar-unit-chevron"></i>
                    </div>
                    <div class="grammar-unit-body">
                        ${this.renderConcept(unit.concept)}
                        ${this.renderLessons(unit.lessons)}
                        ${this.renderQuiz(unit)}
                    </div>
                </div>
            `;
        }).join('');
    }

    renderConcept(concept) {
        if (!concept) return '';
        return `
            <div class="grammar-concept-card">
                <div class="grammar-concept-title">
                    <i class="fas fa-lightbulb"></i> ${concept.title}
                </div>
                <div class="grammar-formula-box">${concept.formula}</div>
                <div class="grammar-examples-list">
                    ${concept.examples.map(ex => `
                        <div class="grammar-example-row">
                            <span class="grammar-example-ko">${ex.ko}</span>
                            <span class="grammar-example-fa">${ex.fa}</span>
                            <span class="grammar-example-romaji">${ex.romaji}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderLessons(lessons) {
        return `
            <div class="grammar-lessons-list">
                <h4 style="font-size:0.85rem;font-weight:700;color:var(--text);margin-bottom:0.5rem;">
                    <i class="fas fa-list" style="color:#D64B3F;"></i> درس‌های این سطح
                </h4>
                ${lessons.map(l => {
                    const done = this.isLessonDone(l.id);
                    return `
                        <div class="grammar-lesson-item">
                            <div class="grammar-lesson-icon ${done ? 'done' : 'current'}">
                                <i class="fas ${l.type === 'quiz' ? 'fa-question-circle' : l.type === 'practice' ? 'fa-pencil-alt' : 'fa-book-open'}"></i>
                            </div>
                            <div class="grammar-lesson-info">
                                <span class="grammar-lesson-title">${l.title}</span>
                                <span class="grammar-lesson-subtitle">${l.subtitle}</span>
                            </div>
                            <button class="grammar-lesson-btn ${done ? 'review' : 'start'}"
                                    onclick="window.grammarCourse.completeLesson('${l.id}')">
                                ${done ? '<i class="fas fa-check"></i> مرور' : '<i class="fas fa-play"></i> تکمیل'}
                            </button>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderQuiz(unit) {
        if (!unit.quiz) return '';
        return `
            <div class="grammar-quick-quiz" id="quiz-${unit.id}">
                <h4><i class="fas fa-bolt"></i> کوییز سریع ${unit.title}</h4>
                <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.75rem;">${unit.quiz.q}</p>
                <div class="grammar-quiz-options">
                    ${unit.quiz.options.map((opt, i) => `
                        <button class="grammar-quiz-btn" onclick="window.grammarCourse.checkQuiz('${unit.id}', ${i})">${opt}</button>
                    `).join('')}
                </div>
                <div class="grammar-quiz-feedback" id="fb-${unit.id}"></div>
            </div>
        `;
    }

    // ========== ACTIONS ==========
    toggleUnit(header) {
        header.closest('.grammar-unit-card')?.classList.toggle('open');
    }

    completeLesson(lessonId) {
        this.progress.lessons[lessonId] = !this.progress.lessons[lessonId];
        this.saveProgress();
        this.renderAll();
    }

    checkQuiz(unitId, index) {
        const unit = this.courseData.find(u => u.id === unitId);
        if (!unit?.quiz) return;
        const isCorrect = index === unit.quiz.correct;
        const feedback = document.getElementById(`fb-${unitId}`);
        const buttons = document.querySelectorAll(`#quiz-${unitId} .grammar-quiz-btn`);
        
        buttons.forEach((btn, i) => {
            btn.style.pointerEvents = 'none';
            if (i === unit.quiz.correct) btn.classList.add('correct');
            if (i === index && !isCorrect) btn.classList.add('wrong');
        });

        if (feedback) {
            feedback.classList.add('show', isCorrect ? 'correct' : 'wrong');
            feedback.innerHTML = isCorrect ? 
                '<i class="fas fa-check-circle"></i> آفرین! جواب درسته!' : 
                '<i class="fas fa-times-circle"></i> اشکال نداره! گزینه سبز درسته.';
        }
    }

    saveProgress() {
        const all = JSON.parse(localStorage.getItem('atlas_progress') || '{}');
        all['grammar'] = this.progress;
        localStorage.setItem('atlas_progress', JSON.stringify(all));
    }

    renderAll() {
        this.renderHeroProgress();
        this.renderUnits(this.activeTab);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.grammarCourse = new GrammarCourse();
});