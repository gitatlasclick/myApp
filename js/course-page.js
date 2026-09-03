// ==========================================
// COURSE PAGE - 아틀라스 한글
// ==========================================

class CoursePage {
    constructor() {
        this.courseId = 'hangul';
        this.totalLessons = 10;
        this.progress = {};
        this.currentLesson = 1;
        this.lessons = [];
        this.init();
    }

    init() {
        this.loadProgress();
        this.loadLessons();
        this.renderSidebar();
        this.renderLesson(1);
        this.updateHeroProgress();
        console.log('📚 Course Page Ready!');
    }

    loadProgress() {
        const saved = localStorage.getItem('atlas_progress');
        if (saved) {
            try { 
                const data = JSON.parse(saved);
                this.progress = data[this.courseId] || { completed: 0, total: this.totalLessons, lessons: {} };
            } catch(e) {
                this.progress = { completed: 0, total: this.totalLessons, lessons: {} };
            }
        } else {
            this.progress = { completed: 0, total: this.totalLessons, lessons: {} };
        }
    }

    saveProgress(lessonId, completed) {
        this.progress.lessons = this.progress.lessons || {};
        this.progress.lessons[lessonId] = completed;
        this.progress.completed = Object.values(this.progress.lessons).filter(Boolean).length;
        
        const allProgress = JSON.parse(localStorage.getItem('atlas_progress') || '{}');
        allProgress[this.courseId] = this.progress;
        localStorage.setItem('atlas_progress', JSON.stringify(allProgress));
        
        this.renderSidebar();
        this.updateHeroProgress();
    }

    isCompleted(lessonId) {
        return this.progress.lessons?.[lessonId] || false;
    }

    updateHeroProgress() {
        const percent = Math.round((this.progress.completed / this.totalLessons) * 100);
        const circumference = 2 * Math.PI * 52;
        const offset = circumference - (percent / 100) * circumference;
        
        const fill = document.getElementById('heroProgressFill');
        const percentEl = document.getElementById('heroPercent');
        
        if (fill) fill.style.strokeDashoffset = offset;
        if (percentEl) percentEl.textContent = `${percent}٪`;
    }

    loadLessons() {
        this.lessons = [
            {
                id: 1,
                title: 'حروف صدادار ساده',
                koreanTitle: '단모음',
                duration: '۱۵ دقیقه',
                content: `
                    <p>حروف صدادار پایه‌ای کره‌ای <strong>۶ تا</strong> هستن. این حروف پایه‌ای‌ترین بخش هانگول هستن و یادگیریشون خیلی آسونه!</p>
                    
                    <h3><i class="fas fa-font"></i> حروف این درس</h3>
                    <div class="korean-chars-grid">
                        <div class="korean-char-item"><span class="char">ㅏ</span><span class="romaji">a</span></div>
                        <div class="korean-char-item"><span class="char">ㅓ</span><span class="romaji">eo</span></div>
                        <div class="korean-char-item"><span class="char">ㅗ</span><span class="romaji">o</span></div>
                        <div class="korean-char-item"><span class="char">ㅜ</span><span class="romaji">u</span></div>
                        <div class="korean-char-item"><span class="char">ㅡ</span><span class="romaji">eu</span></div>
                        <div class="korean-char-item"><span class="char">ㅣ</span><span class="romaji">i</span></div>
                    </div>

                    <div class="tip-box">
                        <i class="fas fa-lightbulb"></i>
                        <p><strong>نکته:</strong> ㅏ مثل "آ" در فارسی، ㅓ مثل "اُ" و ㅗ مثل "اُو" تلفظ میشه. شکل حروف از آسمون، زمین و انسان الهام گرفته شده!</p>
                    </div>

                    <h3><i class="fas fa-lightbulb"></i> کلمات نمونه</h3>
                    <div class="example-box">
                        <div class="example-row"><span class="example-korean">아이</span><span class="example-meaning">کودک (a-i)</span></div>
                        <div class="example-row"><span class="example-korean">오이</span><span class="example-meaning">خیار (o-i)</span></div>
                        <div class="example-row"><span class="example-korean">우유</span><span class="example-meaning">شیر (u-yu)</span></div>
                    </div>
                `
            },
            {
                id: 2,
                title: 'حروف بی‌صدا پایه',
                koreanTitle: '자음',
                duration: '۲۰ دقیقه',
                content: `
                    <p>حروف بی‌صدای کره‌ای <strong>۱۴ تا</strong> هستن. توی این درس ۶ تای اول رو یاد می‌گیری.</p>
                    
                    <h3><i class="fas fa-font"></i> حروف این درس</h3>
                    <div class="korean-chars-grid">
                        <div class="korean-char-item"><span class="char">ㄱ</span><span class="romaji">g/k</span></div>
                        <div class="korean-char-item"><span class="char">ㄴ</span><span class="romaji">n</span></div>
                        <div class="korean-char-item"><span class="char">ㄷ</span><span class="romaji">d/t</span></div>
                        <div class="korean-char-item"><span class="char">ㄹ</span><span class="romaji">r/l</span></div>
                        <div class="korean-char-item"><span class="char">ㅁ</span><span class="romaji">m</span></div>
                        <div class="korean-char-item"><span class="char">ㅂ</span><span class="romaji">b/p</span></div>
                    </div>

                    <div class="tip-box">
                        <i class="fas fa-lightbulb"></i>
                        <p><strong>نکته:</strong> شکل حروف بی‌صدا از حالت زبان و لب‌ها موقع تلفظ الهام گرفته شده. مثلاً ㄱ شبیه زبون وقتی به کام می‌چسبه!</p>
                    </div>
                `
            },
            {
                id: 3,
                title: 'ترکیب حروف صدادار و بی‌صدا',
                koreanTitle: '음절 만들기',
                duration: '۲۰ دقیقه',
                content: `<p>حالا که حروف صدادار و بی‌صدا رو بلدی، یاد می‌گیریم چطور اینا رو با هم ترکیب کنیم و سیلاب بسازیم.</p>`
            },
            {
                id: 4,
                title: 'حروف صدادار ترکیبی',
                koreanTitle: '이중모음',
                duration: '۲۰ دقیقه',
                content: `<p>حروف صدادار ترکیبی از ترکیب حروف ساده ساخته میشن. مثلاً ㅑ از ㅣ + ㅏ ساخته شده.</p>`
            },
            {
                id: 5,
                title: 'حروف بی‌صدای دوتایی',
                koreanTitle: '쌍자음',
                duration: '۲۰ دقیقه',
                content: `<p>حروف بی‌صدای دوتایی مثل ㄲ، ㄸ، ㅃ، ㅆ، ㅉ با فشار بیشتر تلفظ میشن.</p>`
            },
            {
                id: 6,
                title: 'حروف پایانی (Batchim)',
                koreanTitle: '받침',
                duration: '۲۵ دقیقه',
                content: `<p>توی کره‌ای، هر سیلاب می‌تونه یه حرف پایانی هم داشته باشه. به این حرف Batchim میگن.</p>`
            },
            {
                id: 7,
                title: 'قوانین تلفظ',
                koreanTitle: '발음 규칙',
                duration: '۲۰ دقیقه',
                content: `<p>بعضی حروف وقتی کنار هم قرار می‌گیرن، تلفظشون تغییر می‌کنه. این قوانین رو یاد بگیر.</p>`
            },
            {
                id: 8,
                title: 'خواندن کلمات ساده',
                koreanTitle: '단어 읽기',
                duration: '۲۰ دقیقه',
                content: `<p>با ترکیب همه چیزایی که یاد گرفتی، حالا می‌تونی کلمات ساده کره‌ای رو بخونی!</p>`
            },
            {
                id: 9,
                title: 'خواندن جملات',
                koreanTitle: '문장 읽기',
                duration: '۲۰ دقیقه',
                content: `<p>از کلمات ساده میریم سراغ جمله‌های کوتاه و کاربردی.</p>`
            },
            {
                id: 10,
                title: 'تست نهایی هانگول',
                koreanTitle: '한글 테스트',
                duration: '۳۰ دقیقه',
                content: `<p>وقتشه ببینیم چقدر هانگول یاد گرفتی! یه آزمون جامع از همه درس‌ها.</p>`
            }
        ];
    }

    renderSidebar() {
        const sidebar = document.getElementById('courseSidebar');
        if (!sidebar) return;

        sidebar.innerHTML = `
            <h3><i class="fas fa-list"></i> درس‌های این دوره</h3>
            <div class="lesson-list">
                ${this.lessons.map(lesson => {
                    const completed = this.isCompleted(lesson.id);
                    return `
                        <a href="#lesson${lesson.id}" 
                           class="lesson-item ${this.currentLesson === lesson.id ? 'active' : ''} ${completed ? 'completed' : ''}"
                           onclick="window.coursePage.goToLesson(${lesson.id})">
                            <span class="lesson-num">${completed ? '<i class="fas fa-check"></i>' : lesson.id}</span>
                            <div class="lesson-info">
                                <span class="lesson-title">${lesson.title}</span>
                                <span class="lesson-duration">${lesson.duration}</span>
                            </div>
                            <span class="lesson-status-icon">
                                ${completed ? '<i class="fas fa-check-circle"></i>' : '<i class="far fa-circle"></i>'}
                            </span>
                        </a>
                    `;
                }).join('')}
            </div>

            <div class="course-resources">
                <h4><i class="fas fa-download"></i> منابع دانلودی</h4>
                <a href="#" class="resource-link"><i class="fas fa-file-pdf"></i> PDF تمرین هانگول</a>
                <a href="#" class="resource-link"><i class="fas fa-clone"></i> فلش کارت حروف</a>
                <a href="#" class="resource-link"><i class="fas fa-headphones"></i> فایل صوتی تلفظ</a>
            </div>
        `;
    }

    renderLesson(lessonId) {
        this.currentLesson = lessonId;
        const main = document.getElementById('courseMain');
        const lesson = this.lessons.find(l => l.id === lessonId);
        if (!main || !lesson) return;

        const completed = this.isCompleted(lessonId);
        const isLast = lessonId === this.totalLessons;

        main.innerHTML = `
            <div class="lesson-content-card" id="lesson${lessonId}">
                <h2>
                    درس ${lessonId}: ${lesson.title}
                    <span class="lesson-badge">${lesson.koreanTitle}</span>
                </h2>
                <p style="color:var(--text-muted);font-size:0.85rem;">
                    <i class="far fa-clock"></i> ${lesson.duration}
                </p>
                
                <div style="margin-top:1.5rem;">
                    ${lesson.content}
                </div>

                ${!completed ? `
                    <div style="margin-top:2rem;text-align:center;">
                        <button class="btn-primary" onclick="window.coursePage.completeLesson(${lessonId})">
                            <i class="fas fa-check"></i>
                            این درس رو تموم کردم
                        </button>
                    </div>
                ` : `
                    <div style="margin-top:2rem;text-align:center;padding:1rem;background:#E8F5E9;border-radius:14px;color:#22C55E;font-weight:700;">
                        <i class="fas fa-check-circle"></i> این درس تکمیل شده
                    </div>
                `}
            </div>

            <!-- Navigation -->
            <div class="lesson-navigation">
                ${lessonId > 1 ? `
                    <a href="#lesson${lessonId - 1}" class="nav-lesson-btn nav-lesson-prev" onclick="window.coursePage.goToLesson(${lessonId - 1})">
                        <i class="fas fa-arrow-right"></i>
                        درس قبلی
                    </a>
                ` : '<div></div>'}
                
                ${!isLast ? `
                    <a href="#lesson${lessonId + 1}" class="nav-lesson-btn nav-lesson-next" onclick="window.coursePage.goToLesson(${lessonId + 1})">
                        درس بعدی
                        <i class="fas fa-arrow-left"></i>
                    </a>
                ` : ''}
            </div>
        `;

        // Update sidebar active state
        this.renderSidebar();
        
        // Scroll to lesson
        document.getElementById(`lesson${lessonId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    goToLesson(lessonId) {
        this.renderLesson(lessonId);
    }

    completeLesson(lessonId) {
        this.saveProgress(lessonId, true);
        this.renderLesson(lessonId);
        console.log(`✅ درس ${lessonId} تکمیل شد`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.coursePage = new CoursePage();
});