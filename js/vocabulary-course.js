// ==========================================
// VOCABULARY COURSE - TOPIK 1-6 LEVELS
// ==========================================

class VocabularyCourse {
    constructor() {
        this.progress = {};
        this.activeTab = 'topik1';
        this.topikLevels = [];
        this.init();
    }

    init() {
        this.loadProgress();
        this.loadTopikLevels();
        this.renderHeroProgress();
        this.renderTabs();
        this.renderContent();
        console.log('📚 TOPIK Vocabulary Complete!');
    }

    loadProgress() {
        const saved = localStorage.getItem('atlas_progress');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.progress = data['vocabulary'] || { words: {} };
            } catch(e) {
                this.progress = { words: {} };
            }
        }
        if (!this.progress.words) this.progress.words = {};
    }

    isWordLearned(id) {
        return this.progress.words?.[id] || false;
    }

    getLevelProgress(level) {
        const total = level.words.length;
        const done = level.words.filter(w => this.isWordLearned(w.id)).length;
        return { 
            done, 
            total, 
            percent: total > 0 ? Math.round((done / total) * 100) : 0 
        };
    }

    getOverallProgress() {
        let total = 0, done = 0;
        this.topikLevels.forEach(level => {
            level.words.forEach(w => {
                total++;
                if (this.isWordLearned(w.id)) done++;
            });
        });
        return { 
            done, 
            total, 
            percent: total > 0 ? Math.round((done / total) * 100) : 0 
        };
    }

// ========== TEXT TO SPEECH (Google TTS) ==========
speakWord(word) {
    // Use Google Translate TTS (always works!)
    const audio = new Audio();
    audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=ko&q=${encodeURIComponent(word)}`;
    audio.play().catch(err => {
        console.log('⚠️ Auto-play blocked. Trying alternative...');
        // Fallback: open in new tab
        window.open(`https://translate.google.com/?sl=ko&tl=fa&text=${encodeURIComponent(word)}&op=translate`, '_blank');
    });
}
    // ========== ACTIONS ==========
    toggleWord(wordId) {
        this.progress.words[wordId] = !this.progress.words[wordId];
        this.saveProgress();
        this.renderAll();
    }

    // ========== RENDER ==========
    renderHeroProgress() {
        const container = document.getElementById('heroProgress');
        if (!container) return;
        const { done, total, percent } = this.getOverallProgress();
        const circ = 2 * Math.PI * 55;
        const offset = circ - (percent / 100) * circ;

        container.innerHTML = `
            <div class="progress-circle">
                <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle class="bg" cx="70" cy="70" r="55"/>
                    <circle class="fill" cx="70" cy="70" r="55"
                            stroke="#C4956A"
                            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
                </svg>
                <span class="percent-text" style="color:#C4956A;">${percent}%</span>
            </div>
            <p class="progress-info-text">${done}/${total} کلمه یاد گرفته شده</p>
            <div class="progress-mini-bar"><div class="progress-mini-fill" style="width:${percent}%;"></div></div>
        `;
    }

    renderTabs() {
        const container = document.getElementById('courseTabs');
        if (!container) return;

        container.innerHTML = this.topikLevels.map(level => {
            const { total } = this.getLevelProgress(level);
            return `
                <button class="course-tab ${this.activeTab === level.id ? 'active' : ''}"
                        style="${this.activeTab === level.id ? `color:${level.color};border-bottom-color:${level.color};` : ''}"
                        onclick="window.vocabularyCourse.switchTab('${level.id}')">
                    <i class="fas ${level.icon}"></i> ${level.level}
                    <span style="font-size:0.7rem;opacity:0.7;">(${total})</span>
                </button>
            `;
        }).join('');
    }

    switchTab(tabId) {
        this.activeTab = tabId;
        this.renderTabs();
        this.renderContent();
    }

    renderContent() {
        const container = document.getElementById('vocabularyContent');
        if (!container) return;

        const level = this.topikLevels.find(l => l.id === this.activeTab);
        if (!level) return;

        const { done, total, percent } = this.getLevelProgress(level);

        container.innerHTML = `
            <div class="topik-level-section">
                <div class="topik-level-header">
                    <div class="topik-level-icon" style="background:${level.iconBg};color:${level.color};">
                        <i class="fas ${level.icon}"></i>
                    </div>
                    <div class="topik-level-info">
                        <span class="level-badge" style="background:${level.iconBg};color:${level.color};">${level.level}</span>
                        <span class="topik-level-korean">${level.korean}</span>
                        <div class="topik-level-title">واژگان ${level.level}</div>
                        <div class="topik-level-desc">${total} کلمه</div>
                    </div>
                    <div class="level-progress-wrap">
                        <span>${done}/${total}</span>
                        <div class="level-progress-bar">
                            <div class="level-progress-fill" style="width:${percent}%;background:${level.color};"></div>
                        </div>
                    </div>
                </div>
                <div class="words-grid">
                    ${level.words.map(w => this.renderWordCard(w, level.color)).join('')}
                </div>
            </div>
        `;
    }

    renderWordCard(word, color) {
        const learned = this.isWordLearned(word.id);
        return `
            <div class="word-card ${learned ? 'learned' : ''}">
                <div class="word-number" style="${learned ? 'background:#E8F5E9;color:#22C55E;' : `color:${color};`}">
                    ${learned ? '<i class="fas fa-check"></i>' : word.id.replace('w', '').replace(/^0+/, '')}
                </div>
                <div class="word-info">
                    <span class="word-korean">${word.ko}</span>
                    <span class="word-romaji">[${word.romaji}]</span>
                    <div class="word-meaning">${word.meaning}</div>
                </div>
                <div class="word-actions">
                    <button class="word-btn" title="تلفظ" onclick="event.stopPropagation(); window.vocabularyCourse.speakWord('${word.ko.replace(/'/g, "\\'")}')">
                        <i class="fas fa-volume-up"></i>
                    </button>
                    <button class="word-btn ${learned ? 'learned-btn' : ''}" 
                            onclick="window.vocabularyCourse.toggleWord('${word.id}')"
                            title="${learned ? 'یاد گرفته شده' : 'یاد گرفتم'}">
                        <i class="fas fa-${learned ? 'check' : 'bookmark'}"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // ========== DATA ==========
    loadTopikLevels() {
        this.topikLevels = [
            {
    id: 'topik1', level: 'TOPIK 1', korean: '1급', icon: 'fa-1',
    color: '#22C55E', iconBg: 'rgba(34,197,94,0.1)',
    words: [
        { id: 'w0001', ko: '가게', romaji: 'gage', meaning: 'فروشگاه' },
        { id: 'w0002', ko: '가격', romaji: 'gagyeok', meaning: 'قیمت' },
        { id: 'w0003', ko: '가구', romaji: 'gagu', meaning: 'مبلمان' },
        { id: 'w0004', ko: '가깝다', romaji: 'gakkapda', meaning: 'نزدیک بودن' },
        { id: 'w0005', ko: '가다', romaji: 'gada', meaning: 'رفتن' },
        { id: 'w0006', ko: '가르치다', romaji: 'gareuchida', meaning: 'یاد دادن' },
        { id: 'w0007', ko: '가방', romaji: 'gabang', meaning: 'کیف' },
        { id: 'w0008', ko: '가볍다', romaji: 'gabyeopda', meaning: 'سبک بودن' },
        { id: 'w0009', ko: '가수', romaji: 'gasu', meaning: 'خواننده' },
        { id: 'w0010', ko: '가요', romaji: 'gayo', meaning: 'موسیقی پاپ' },
        { id: 'w0011', ko: '가운데', romaji: 'gaunde', meaning: 'وسط' },
        { id: 'w0012', ko: '가을', romaji: 'ga-eul', meaning: 'پاییز' },
        { id: 'w0013', ko: '가장', romaji: 'gajang', meaning: 'بیشترین' },
        { id: 'w0014', ko: '가족', romaji: 'gajok', meaning: 'خانواده' },
        { id: 'w0015', ko: '가지', romaji: 'gaji', meaning: 'نوع' },
        { id: 'w0016', ko: '가지다', romaji: 'gajida', meaning: 'داشتن' },
        { id: 'w0017', ko: '갈비', romaji: 'galbi', meaning: 'گالبی' },
        { id: 'w0018', ko: '갈비탕', romaji: 'galbitang', meaning: 'سوپ گالبی' },
        { id: 'w0019', ko: '갈아타다', romaji: 'garatada', meaning: 'عوض کردن (وسیله)' },
        { id: 'w0020', ko: '감', romaji: 'gam', meaning: 'خرمالو' },
        { id: 'w0021', ko: '감기', romaji: 'gamgi', meaning: 'سرماخوردگی' },
        { id: 'w0022', ko: '감사', romaji: 'gamsa', meaning: 'تشکر' },
        { id: 'w0023', ko: '값', romaji: 'gap', meaning: 'قیمت' },
        { id: 'w0024', ko: '같다', romaji: 'gatda', meaning: 'مثل هم' },
        { id: 'w0025', ko: '같이', romaji: 'gachi', meaning: 'با هم' },
        { id: 'w0026', ko: '개', romaji: 'gae', meaning: 'سگ' },
        { id: 'w0027', ko: '거기', romaji: 'geogi', meaning: 'آنجا' },
        { id: 'w0028', ko: '거실', romaji: 'geosil', meaning: 'نشیمن' },
        { id: 'w0029', ko: '건강', romaji: 'geon-gang', meaning: 'سلامتی' },
        { id: 'w0030', ko: '건너편', romaji: 'geonneopyeon', meaning: 'روبه‌رو' },
        { id: 'w0031', ko: '건물', romaji: 'geonmul', meaning: 'ساختمان' },
        { id: 'w0032', ko: '걷다', romaji: 'geotda', meaning: 'راه رفتن' },
        { id: 'w0033', ko: '걸다', romaji: 'geolda', meaning: 'آویزان کردن' },
        { id: 'w0034', ko: '걸리다', romaji: 'geollida', meaning: 'گرفتار شدن' },
        { id: 'w0035', ko: '것', romaji: 'geot', meaning: 'چیز' },
        { id: 'w0036', ko: '게임', romaji: 'geim', meaning: 'بازی' },
        { id: 'w0037', ko: '겨울', romaji: 'gyeoul', meaning: 'زمستان' },
        { id: 'w0038', ko: '계속', romaji: 'gyesok', meaning: 'مدام' },
        { id: 'w0039', ko: '계시다', romaji: 'gyesida', meaning: 'بودن (محترمانه)' },
        { id: 'w0040', ko: '계절', romaji: 'gyejeol', meaning: 'فصل' },
        { id: 'w0041', ko: '계획', romaji: 'gyehoek', meaning: 'برنامه' },
        { id: 'w0042', ko: '고기', romaji: 'gogi', meaning: 'گوشت' },
        { id: 'w0043', ko: '고르다', romaji: 'goreuda', meaning: 'انتخاب کردن' },
        { id: 'w0044', ko: '고맙다', romaji: 'gomapda', meaning: 'ممنون بودن' },
        { id: 'w0045', ko: '고양이', romaji: 'goyangi', meaning: 'گربه' },
        { id: 'w0046', ko: '고프다', romaji: 'gopeuda', meaning: 'گرسنه بودن' },
        { id: 'w0047', ko: '고향', romaji: 'gohyang', meaning: 'زادگاه' },
        { id: 'w0048', ko: '곳', romaji: 'got', meaning: 'جا' },
        { id: 'w0049', ko: '공부', romaji: 'gongbu', meaning: 'درس' },
        { id: 'w0050', ko: '공원', romaji: 'gong-won', meaning: 'پارک' },
        { id: 'w0051', ko: '공책', romaji: 'gongchaek', meaning: 'دفتر' },
        { id: 'w0052', ko: '공항', romaji: 'gonghang', meaning: 'فرودگاه' },
        { id: 'w0053', ko: '과일', romaji: 'gwail', meaning: 'میوه' },
        { id: 'w0054', ko: '괜찮다', romaji: 'gwaenchanta', meaning: 'خوب بودن' },
        { id: 'w0055', ko: '교실', romaji: 'gyosil', meaning: 'کلاس' },
        { id: 'w0056', ko: '교통', romaji: 'gyotong', meaning: 'حمل و نقل' },
        { id: 'w0057', ko: '구', romaji: 'gu', meaning: 'نه (عدد)' },
        { id: 'w0058', ko: '구경', romaji: 'gugyeong', meaning: 'تماشا' },
        { id: 'w0059', ko: '구두', romaji: 'gudu', meaning: 'کفش رسمی' },
        { id: 'w0060', ko: '구십', romaji: 'gusip', meaning: 'نود' },
        { id: 'w0061', ko: '구월', romaji: 'guwol', meaning: 'سپتامبر' },
        { id: 'w0062', ko: '국적', romaji: 'gukjeok', meaning: 'ملیت' },
        { id: 'w0063', ko: '권', romaji: 'gwon', meaning: 'جلد (کتاب)' },
        { id: 'w0064', ko: '귀', romaji: 'gwi', meaning: 'گوش' },
        { id: 'w0065', ko: '귤', romaji: 'gyul', meaning: 'نارنگی' },
        { id: 'w0066', ko: '그', romaji: 'geu', meaning: 'آن' },
        { id: 'w0067', ko: '그것', romaji: 'geugeot', meaning: 'آن چیز' },
        { id: 'w0068', ko: '그래', romaji: 'geurae', meaning: 'باشه' },
        { id: 'w0069', ko: '그래서', romaji: 'geuraeseo', meaning: 'برای همین' },
        { id: 'w0070', ko: '그러니까', romaji: 'geureonikka', meaning: 'برای همین' },
        { id: 'w0071', ko: '그러면', romaji: 'geureomyeon', meaning: 'پس' },
        { id: 'w0072', ko: '그런데', romaji: 'geureonde', meaning: 'ولی' },
        { id: 'w0073', ko: '그럼', romaji: 'geureom', meaning: 'پس' },
        { id: 'w0074', ko: '그렇다', romaji: 'geureota', meaning: 'اینطور بودن' },
        { id: 'w0075', ko: '그렇지만', romaji: 'geureochiman', meaning: 'اما' },
        { id: 'w0076', ko: '그릇', romaji: 'geureut', meaning: 'ظرف' },
        { id: 'w0077', ko: '그리고', romaji: 'geurigo', meaning: 'و' },
        { id: 'w0078', ko: '그리다', romaji: 'geurida', meaning: 'نقاشی کردن' },
        { id: 'w0079', ko: '그림', romaji: 'geurim', meaning: 'نقاشی' },
        { id: 'w0080', ko: '그저께', romaji: 'geujeokke', meaning: 'پریروز' },
        { id: 'w0081', ko: '그쪽', romaji: 'geujjok', meaning: 'اون طرف' },
        { id: 'w0082', ko: '극장', romaji: 'geukjang', meaning: 'سینما' },
        { id: 'w0083', ko: '근처', romaji: 'geuncheo', meaning: 'نزدیکی' },
        { id: 'w0084', ko: '글', romaji: 'geul', meaning: 'نوشته' },
        { id: 'w0085', ko: '글쎄요', romaji: 'geulsseyo', meaning: 'نمی‌دونم' },
        { id: 'w0086', ko: '금요일', romaji: 'geumyoil', meaning: 'جمعه' },
        { id: 'w0087', ko: '기간', romaji: 'gigan', meaning: 'مدت' },
        { id: 'w0088', ko: '기다리다', romaji: 'gidarida', meaning: 'منتظر موندن' },
        { id: 'w0089', ko: '기분', romaji: 'gibun', meaning: 'احساس' },
        { id: 'w0090', ko: '기쁘다', romaji: 'gippeuda', meaning: 'خوشحال بودن' },
        { id: 'w0091', ko: '기숙사', romaji: 'gisuksa', meaning: 'خوابگاه' },
        { id: 'w0092', ko: '기차', romaji: 'gicha', meaning: 'قطار' },
        { id: 'w0093', ko: '길', romaji: 'gil', meaning: 'راه' },
        { id: 'w0094', ko: '길다', romaji: 'gilda', meaning: 'بلند بودن' },
        { id: 'w0095', ko: '김밥', romaji: 'gimbap', meaning: 'کیمباپ' },
        { id: 'w0096', ko: '김치', romaji: 'gimchi', meaning: 'کیمچی' },
        { id: 'w0097', ko: '김치찌개', romaji: 'gimchijjigae', meaning: 'خورش کیمچی' },
        { id: 'w0098', ko: '깨끗하다', romaji: 'kkaekkeuthada', meaning: 'تمیز بودن' },
        { id: 'w0099', ko: '꼭', romaji: 'kkok', meaning: 'حتماً' },
        { id: 'w0100', ko: '꽃', romaji: 'kkot', meaning: 'گل' },
        { id: 'w0101', ko: '끄다', romaji: 'kkeuda', meaning: 'خاموش کردن' },
        { id: 'w0102', ko: '끝나다', romaji: 'kkeunnada', meaning: 'تموم شدن' },
        { id: 'w0103', ko: '나', romaji: 'na', meaning: 'من' },
        { id: 'w0104', ko: '나가다', romaji: 'nagada', meaning: 'بیرون رفتن' },
        { id: 'w0105', ko: '나다', romaji: 'nada', meaning: 'دراومدن' },
        { id: 'w0106', ko: '나라', romaji: 'nara', meaning: 'کشور' },
        { id: 'w0107', ko: '나무', romaji: 'namu', meaning: 'درخت' },
        { id: 'w0108', ko: '나쁘다', romaji: 'nappeuda', meaning: 'بد بودن' },
        { id: 'w0109', ko: '나오다', romaji: 'naoda', meaning: 'بیرون اومدن' },
        { id: 'w0110', ko: '나중', romaji: 'najung', meaning: 'بعداً' },
        { id: 'w0111', ko: '날', romaji: 'nal', meaning: 'روز' },
        { id: 'w0112', ko: '날씨', romaji: 'nalssi', meaning: 'آب و هوا' },
        { id: 'w0113', ko: '날짜', romaji: 'naljja', meaning: 'تاریخ' },
        { id: 'w0114', ko: '남대문', romaji: 'namdaemun', meaning: 'نامدهمون' },
        { id: 'w0115', ko: '남동생', romaji: 'namdongsaeng', meaning: 'برادر کوچیکتر' },
        { id: 'w0116', ko: '남산', romaji: 'namsan', meaning: 'نامسان' },
        { id: 'w0117', ko: '남자', romaji: 'namja', meaning: 'مرد' },
        { id: 'w0118', ko: '남편', romaji: 'nampyeon', meaning: 'شوهر' },
        { id: 'w0119', ko: '낮', romaji: 'nat', meaning: 'روز' },
        { id: 'w0120', ko: '낮다', romaji: 'natda', meaning: 'پایین بودن' },
        { id: 'w0121', ko: '내', romaji: 'nae', meaning: 'مال من' },
        { id: 'w0122', ko: '내년', romaji: 'naenyeon', meaning: 'سال بعد' },
        { id: 'w0123', ko: '내리다', romaji: 'naerida', meaning: 'پایین اومدن' },
        { id: 'w0124', ko: '내일', romaji: 'naeil', meaning: 'فردا' },
        { id: 'w0125', ko: '냉면', romaji: 'naengmyeon', meaning: 'نودل سرد' },
        { id: 'w0126', ko: '너', romaji: 'neo', meaning: 'تو' },
        { id: 'w0127', ko: '너무', romaji: 'neomu', meaning: 'خیلی' },
        { id: 'w0128', ko: '넓다', romaji: 'neolda', meaning: 'جادار بودن' },
        { id: 'w0129', ko: '넣다', romaji: 'neota', meaning: 'گذاشتن داخل' },
        { id: 'w0130', ko: '네', romaji: 'ne', meaning: 'بله' },
        { id: 'w0131', ko: '넷', romaji: 'net', meaning: 'چهار' },
        { id: 'w0132', ko: '년', romaji: 'nyeon', meaning: 'سال' },
        { id: 'w0133', ko: '노래', romaji: 'norae', meaning: 'آهنگ' },
        { id: 'w0134', ko: '노래방', romaji: 'noraebang', meaning: 'کارائوکه' },
        { id: 'w0135', ko: '놀다', romaji: 'nolda', meaning: 'بازی کردن' },
        { id: 'w0136', ko: '농구', romaji: 'nonggu', meaning: 'بسکتبال' },
        { id: 'w0137', ko: '높다', romaji: 'nopda', meaning: 'بلند بودن' },
        { id: 'w0138', ko: '누구', romaji: 'nugu', meaning: 'کی' },
        { id: 'w0139', ko: '누나', romaji: 'nuna', meaning: 'خواهر بزرگتر' },
        { id: 'w0140', ko: '눈', romaji: 'nun', meaning: 'چشم' },
        { id: 'w0141', ko: '뉴스', romaji: 'nyuseu', meaning: 'اخبار' },
        { id: 'w0142', ko: '늦다', romaji: 'neutda', meaning: 'دیر بودن' },
        { id: 'w0143', ko: '다', romaji: 'da', meaning: 'همه' },
        { id: 'w0144', ko: '다녀오다', romaji: 'danyeooda', meaning: 'رفت و برگشت' },
        { id: 'w0145', ko: '다니다', romaji: 'danida', meaning: 'رفت و آمد' },
        { id: 'w0146', ko: '다르다', romaji: 'dareuda', meaning: 'فرق داشتن' },
        { id: 'w0147', ko: '다른', romaji: 'dareun', meaning: 'دیگه' },
        { id: 'w0148', ko: '다리', romaji: 'dari', meaning: 'پا' },
        { id: 'w0149', ko: '다섯', romaji: 'daseot', meaning: 'پنج' },
        { id: 'w0150', ko: '다시', romaji: 'dasi', meaning: 'دوباره' },
        { id: 'w0151', ko: '다음', romaji: 'da-eum', meaning: 'بعدی' },
        { id: 'w0152', ko: '단어', romaji: 'daneo', meaning: 'کلمه' },
        { id: 'w0153', ko: '닫다', romaji: 'datda', meaning: 'بستن' },
        { id: 'w0154', ko: '달', romaji: 'dal', meaning: 'ماه' },
        { id: 'w0155', ko: '달다', romaji: 'dalda', meaning: 'شیرین بودن' },
        { id: 'w0156', ko: '담배', romaji: 'dambae', meaning: 'سیگار' },
        { id: 'w0157', ko: '대답', romaji: 'daedap', meaning: 'جواب' },
        { id: 'w0158', ko: '대사관', romaji: 'daesagwan', meaning: 'سفارت' },
        { id: 'w0159', ko: '대학', romaji: 'daehak', meaning: 'دانشگاه' },
        { id: 'w0160', ko: '대학교', romaji: 'daehakgyo', meaning: 'دانشگاه' },
        { id: 'w0161', ko: '대학생', romaji: 'daehaksaeng', meaning: 'دانشجو' },
        { id: 'w0162', ko: '대화', romaji: 'daehwa', meaning: 'گفتگو' },
        { id: 'w0163', ko: '더', romaji: 'deo', meaning: 'بیشتر' },
        { id: 'w0164', ko: '덥다', romaji: 'deopda', meaning: 'گرم بودن' },
        { id: 'w0165', ko: '도서관', romaji: 'doseogwan', meaning: 'کتابخونه' },
        { id: 'w0166', ko: '도와주다', romaji: 'dowajuda', meaning: 'کمک کردن' },
        { id: 'w0167', ko: '도착', romaji: 'dochak', meaning: 'رسیدن' },
        { id: 'w0168', ko: '독일', romaji: 'dogil', meaning: 'آلمان' },
        { id: 'w0169', ko: '돈', romaji: 'don', meaning: 'پول' },
        { id: 'w0170', ko: '돌아가다', romaji: 'doragada', meaning: 'برگشتن' },
        { id: 'w0171', ko: '돌아오다', romaji: 'doraoda', meaning: 'برگشتن (مبدأ)' },
        { id: 'w0172', ko: '돕다', romaji: 'dopda', meaning: 'کمک کردن' },
        { id: 'w0173', ko: '동대문', romaji: 'dongdaemun', meaning: 'دونگدهمون' },
        { id: 'w0174', ko: '동생', romaji: 'dongsaeng', meaning: 'داداش/خواهر کوچیک' },
        { id: 'w0175', ko: '동안', romaji: 'dong-an', meaning: 'در طول' },
        { id: 'w0176', ko: '되다', romaji: 'doeda', meaning: 'شدن' },
        { id: 'w0177', ko: '된장찌개', romaji: 'doenjangjjigae', meaning: 'خورش سویا' },
        { id: 'w0178', ko: '두', romaji: 'du', meaning: 'دو' },
        { id: 'w0179', ko: '둘', romaji: 'dul', meaning: 'دو' },
        { id: 'w0180', ko: '뒤', romaji: 'dwi', meaning: 'پشت' },
        { id: 'w0181', ko: '드라마', romaji: 'deurama', meaning: 'سریال' },
        { id: 'w0182', ko: '드리다', romaji: 'deurida', meaning: 'دادن (محترمانه)' },
        { id: 'w0183', ko: '듣다', romaji: 'deutda', meaning: 'گوش دادن' },
        { id: 'w0184', ko: '들다', romaji: 'deulda', meaning: 'برداشتن' },
        { id: 'w0185', ko: '들어가다', romaji: 'deureogada', meaning: 'وارد شدن' },
        { id: 'w0186', ko: '들어오다', romaji: 'deureooda', meaning: 'وارد شدن (داخل)' },
        { id: 'w0187', ko: '등산', romaji: 'deungsan', meaning: 'کوهنوردی' },
        { id: 'w0188', ko: '따뜻하다', romaji: 'ttatteuthada', meaning: 'گرم و ملایم' },
        { id: 'w0189', ko: '딸', romaji: 'ttal', meaning: 'دختر' },
        { id: 'w0190', ko: '딸기', romaji: 'ttalgi', meaning: 'توت فرنگی' },
        { id: 'w0191', ko: '때', romaji: 'ttae', meaning: 'وقت' },
        { id: 'w0192', ko: '떡볶이', romaji: 'tteokbokki', meaning: 'توکبوکی' },
        { id: 'w0193', ko: '또', romaji: 'tto', meaning: 'دوباره' },
        { id: 'w0194', ko: '라면', romaji: 'ramyeon', meaning: 'رامن' },
        { id: 'w0195', ko: '러시아', romaji: 'reosia', meaning: 'روسیه' },
        { id: 'w0196', ko: '마리', romaji: 'mari', meaning: 'واحد حیوانات' },
        { id: 'w0197', ko: '마시다', romaji: 'masida', meaning: 'نوشیدن' },
        { id: 'w0198', ko: '마음', romaji: 'ma-eum', meaning: 'دل' },
        { id: 'w0199', ko: '마흔', romaji: 'maheun', meaning: 'چهل' },
        { id: 'w0200', ko: '만', romaji: 'man', meaning: 'ده هزار' },
        { id: 'w0201', ko: '만나다', romaji: 'mannada', meaning: 'ملاقات کردن' },
        { id: 'w0202', ko: '만들다', romaji: 'mandeulda', meaning: 'درست کردن' },
        { id: 'w0203', ko: '많다', romaji: 'manta', meaning: 'زیاد بودن' },
        { id: 'w0204', ko: '많이', romaji: 'mani', meaning: 'زیاد' },
        { id: 'w0205', ko: '말', romaji: 'mal', meaning: 'حرف' },
        { id: 'w0206', ko: '말다', romaji: 'malda', meaning: 'نکن' },
        { id: 'w0207', ko: '말레이시아', romaji: 'malleisia', meaning: 'مالزی' },
        { id: 'w0208', ko: '말씀', romaji: 'malsseum', meaning: 'سخن' },
        { id: 'w0209', ko: '맑다', romaji: 'makda', meaning: 'صاف بودن' },
        { id: 'w0210', ko: '맛', romaji: 'mat', meaning: 'مزه' },
        { id: 'w0211', ko: '맛없다', romaji: 'madeopda', meaning: 'بی‌مزه بودن' },
        { id: 'w0212', ko: '맛있다', romaji: 'masitda', meaning: 'خوشمزه بودن' },
        { id: 'w0213', ko: '맞다', romaji: 'matda', meaning: 'درست بودن' },
        { id: 'w0214', ko: '매일', romaji: 'maeil', meaning: 'هر روز' },
        { id: 'w0215', ko: '맵다', romaji: 'maepda', meaning: 'تند بودن' },
        { id: 'w0216', ko: '머리', romaji: 'meori', meaning: 'سر' },
        { id: 'w0217', ko: '먹다', romaji: 'meokda', meaning: 'خوردن' },
        { id: 'w0218', ko: '먼저', romaji: 'meonjeo', meaning: 'اول' },
        { id: 'w0219', ko: '멀다', romaji: 'meolda', meaning: 'دور بودن' },
        { id: 'w0220', ko: '멋있다', romaji: 'meositda', meaning: 'باحال بودن' },
        { id: 'w0221', ko: '메뉴', romaji: 'menyu', meaning: 'منو' },
        { id: 'w0222', ko: '며칠', romaji: 'myeochil', meaning: 'چند روز' },
        { id: 'w0223', ko: '명', romaji: 'myeong', meaning: 'نفر' },
        { id: 'w0224', ko: '몇', romaji: 'myeot', meaning: 'چند تا' },
        { id: 'w0225', ko: '모두', romaji: 'modu', meaning: 'همه' },
        { id: 'w0226', ko: '모레', romaji: 'more', meaning: 'پس فردا' },
        { id: 'w0227', ko: '모르다', romaji: 'moreuda', meaning: 'ندونستن' },
        { id: 'w0228', ko: '모자', romaji: 'moja', meaning: 'کلاه' },
        { id: 'w0229', ko: '목', romaji: 'mok', meaning: 'گردن' },
        { id: 'w0230', ko: '목요일', romaji: 'mogyoil', meaning: 'پنجشنبه' },
        { id: 'w0231', ko: '목욕탕', romaji: 'mogyoktang', meaning: 'حمام عمومی' },
        { id: 'w0232', ko: '몸', romaji: 'mom', meaning: 'بدن' },
        { id: 'w0233', ko: '못', romaji: 'mot', meaning: 'نتونستن' },
        { id: 'w0234', ko: '못하다', romaji: 'mothada', meaning: 'نتونستن انجام دادن' },
        { id: 'w0235', ko: '몽골', romaji: 'monggol', meaning: 'مغولستان' },
        { id: 'w0236', ko: '무겁다', romaji: 'mugeopda', meaning: 'سنگین بودن' },
        { id: 'w0237', ko: '무슨', romaji: 'museun', meaning: 'چه' },
        { id: 'w0238', ko: '무엇', romaji: 'mueot', meaning: 'چی' },
        { id: 'w0239', ko: '문', romaji: 'mun', meaning: 'در' },
        { id: 'w0240', ko: '문화', romaji: 'munhwa', meaning: 'فرهنگ' },
        { id: 'w0241', ko: '묻다', romaji: 'mutda', meaning: 'پرسیدن' },
        { id: 'w0242', ko: '물', romaji: 'mul', meaning: 'آب' },
        { id: 'w0243', ko: '물건', romaji: 'mulgeon', meaning: 'وسیله' },
        { id: 'w0244', ko: '뭐', romaji: 'mwo', meaning: 'چی' },
        { id: 'w0245', ko: '미국', romaji: 'miguk', meaning: 'آمریکا' },
        { id: 'w0246', ko: '미안', romaji: 'mian', meaning: 'متأسف' },
        { id: 'w0247', ko: '미용실', romaji: 'miyongsil', meaning: 'آرایشگاه' },
        { id: 'w0248', ko: '밑', romaji: 'mit', meaning: 'زیر' },
        { id: 'w0249', ko: '바꾸다', romaji: 'bakkuda', meaning: 'عوض کردن' },
        { id: 'w0250', ko: '바나나', romaji: 'banana', meaning: 'موز' },
        { id: 'w0251', ko: '바다', romaji: 'bada', meaning: 'دریا' },
        { id: 'w0252', ko: '바람', romaji: 'baram', meaning: 'باد' },
        { id: 'w0253', ko: '바로', romaji: 'baro', meaning: 'همین الان' },
        { id: 'w0254', ko: '바쁘다', romaji: 'bappeuda', meaning: 'گرفتار بودن' },
        { id: 'w0255', ko: '바지', romaji: 'baji', meaning: 'شلوار' },
        { id: 'w0256', ko: '박물관', romaji: 'bangmulgwan', meaning: 'موزه' },
        { id: 'w0257', ko: '밖', romaji: 'bak', meaning: 'بیرون' },
        { id: 'w0258', ko: '반', romaji: 'ban', meaning: 'نیمه/کلاس' },
        { id: 'w0259', ko: '반갑다', romaji: 'bangapda', meaning: 'خوشحال از دیدار' },
        { id: 'w0260', ko: '받다', romaji: 'batda', meaning: 'دریافت کردن' },
        { id: 'w0261', ko: '발', romaji: 'bal', meaning: 'پا' },
        { id: 'w0262', ko: '밤', romaji: 'bam', meaning: 'شب' },
        { id: 'w0263', ko: '밥', romaji: 'bap', meaning: 'غذا/برنج' },
        { id: 'w0264', ko: '방', romaji: 'bang', meaning: 'اتاق' },
        { id: 'w0265', ko: '방학', romaji: 'banghak', meaning: 'تعطیلات' },
        { id: 'w0266', ko: '배', romaji: 'bae', meaning: 'شکم/کشتی/گلابی' },
        { id: 'w0267', ko: '배우', romaji: 'bae-u', meaning: 'بازیگر' },
        { id: 'w0268', ko: '배우다', romaji: 'bae-uda', meaning: 'یاد گرفتن' },
        { id: 'w0269', ko: '백', romaji: 'baek', meaning: 'صد' },
        { id: 'w0270', ko: '백만', romaji: 'baengman', meaning: 'میلیون' },
        { id: 'w0271', ko: '백화점', romaji: 'baekhwajeom', meaning: 'فروشگاه بزرگ' },
        { id: 'w0272', ko: '버스', romaji: 'beoseu', meaning: 'اتوبوس' },
        { id: 'w0273', ko: '번', romaji: 'beon', meaning: 'دفعه' },
        { id: 'w0274', ko: '번호', romaji: 'beonho', meaning: 'شماره' },
        { id: 'w0275', ko: '베트남', romaji: 'beteunam', meaning: 'ویتنام' },
        { id: 'w0276', ko: '별로', romaji: 'byeollo', meaning: 'زیاد (منفی)' },
        { id: 'w0277', ko: '병', romaji: 'byeong', meaning: 'بیماری/بطری' },
        { id: 'w0278', ko: '병원', romaji: 'byeong-won', meaning: 'بیمارستان' },
        { id: 'w0279', ko: '보내다', romaji: 'bonaeda', meaning: 'فرستادن' },
        { id: 'w0280', ko: '보다', romaji: 'boda', meaning: 'دیدن' },
        { id: 'w0281', ko: '보통', romaji: 'botong', meaning: 'معمولاً' },
        { id: 'w0282', ko: '볼펜', romaji: 'bolpen', meaning: 'خودکار' },
        { id: 'w0283', ko: '봄', romaji: 'bom', meaning: 'بهار' },
        { id: 'w0284', ko: '부르다', romaji: 'bureuda', meaning: 'صدا کردن' },
        { id: 'w0285', ko: '부모님', romaji: 'bumonim', meaning: 'والدین' },
        { id: 'w0286', ko: '부산', romaji: 'busan', meaning: 'بوسان' },
        { id: 'w0287', ko: '부엌', romaji: 'bueok', meaning: 'آشپزخونه' },
        { id: 'w0288', ko: '부탁', romaji: 'butak', meaning: 'درخواست' },
        { id: 'w0289', ko: '분', romaji: 'bun', meaning: 'نفر/دقیقه' },
        { id: 'w0290', ko: '불', romaji: 'bul', meaning: 'آتش' },
        { id: 'w0291', ko: '불고기', romaji: 'bulgogi', meaning: 'بولگوگی' },
        { id: 'w0292', ko: '불다', romaji: 'bulda', meaning: 'وزیدن' },
        { id: 'w0293', ko: '비', romaji: 'bi', meaning: 'بارون' },
        { id: 'w0294', ko: '비빔밥', romaji: 'bibimbap', meaning: 'بیبیمباپ' },
        { id: 'w0295', ko: '비싸다', romaji: 'bissada', meaning: 'گرون بودن' },
        { id: 'w0296', ko: '비행기', romaji: 'bihaenggi', meaning: 'هواپیما' },
        { id: 'w0297', ko: '빌리다', romaji: 'billida', meaning: 'قرض گرفتن' },
        { id: 'w0298', ko: '빠르다', romaji: 'ppareuda', meaning: 'سریع بودن' },
        { id: 'w0299', ko: '빨리', romaji: 'ppalli', meaning: 'زود' },
        { id: 'w0300', ko: '빵', romaji: 'ppang', meaning: 'نان' },
        { id: 'w0301', ko: '사', romaji: 'sa', meaning: 'چهار' },
        { id: 'w0302', ko: '사과', romaji: 'sagwa', meaning: 'سیب' },
        { id: 'w0303', ko: '사귀다', romaji: 'sagwida', meaning: 'دوست شدن' },
        { id: 'w0304', ko: '사다', romaji: 'sada', meaning: 'خریدن' },
        { id: 'w0305', ko: '사람', romaji: 'saram', meaning: 'انسان' },
        { id: 'w0306', ko: '사랑', romaji: 'sarang', meaning: 'عشق' },
        { id: 'w0307', ko: '사무실', romaji: 'samusil', meaning: 'دفتر کار' },
        { id: 'w0308', ko: '사십', romaji: 'sasip', meaning: 'چهل' },
        { id: 'w0309', ko: '사용', romaji: 'sayong', meaning: 'استفاده' },
        { id: 'w0310', ko: '사월', romaji: 'sawol', meaning: 'آوریل' },
        { id: 'w0311', ko: '사이', romaji: 'sai', meaning: 'بین' },
        { id: 'w0312', ko: '사이다', romaji: 'saida', meaning: 'سایدر' },
        { id: 'w0313', ko: '사전', romaji: 'sajeon', meaning: 'دیکشنری' },
        { id: 'w0314', ko: '사진', romaji: 'sajin', meaning: 'عکس' },
        { id: 'w0315', ko: '산', romaji: 'san', meaning: 'کوه' },
        { id: 'w0316', ko: '산책', romaji: 'sanchaek', meaning: 'پیاده‌روی' },
        { id: 'w0317', ko: '살', romaji: 'sal', meaning: 'سال (سن)' },
        { id: 'w0318', ko: '살다', romaji: 'salda', meaning: 'زندگی کردن' },
        { id: 'w0319', ko: '삼', romaji: 'sam', meaning: 'سه' },
        { id: 'w0320', ko: '삼계탕', romaji: 'samgyetang', meaning: 'سوپ مرغ' },
        { id: 'w0321', ko: '삼십', romaji: 'samsip', meaning: 'سی' },
        { id: 'w0322', ko: '삼월', romaji: 'samwol', meaning: 'مارس' },
        { id: 'w0323', ko: '생각', romaji: 'saenggak', meaning: 'فکر' },
        { id: 'w0324', ko: '생신', romaji: 'saengsin', meaning: 'تولد (محترمانه)' },
        { id: 'w0325', ko: '생일', romaji: 'saeng-il', meaning: 'تولد' },
        { id: 'w0326', ko: '생활', romaji: 'saenghwal', meaning: 'زندگی' },
        { id: 'w0327', ko: '샤워', romaji: 'syawo', meaning: 'دوش' },
        { id: 'w0328', ko: '서른', romaji: 'seoreun', meaning: 'سی' },
        { id: 'w0329', ko: '서울', romaji: 'seoul', meaning: 'سئول' },
        { id: 'w0330', ko: '서점', romaji: 'seojeom', meaning: 'کتابفروشی' },
        { id: 'w0331', ko: '선물', romaji: 'seonmul', meaning: 'هدیه' },
        { id: 'w0332', ko: '선생님', romaji: 'seonsaengnim', meaning: 'معلم' },
        { id: 'w0333', ko: '설명', romaji: 'seolmyeong', meaning: 'توضیح' },
        { id: 'w0334', ko: '세', romaji: 'se', meaning: 'سه' },
        { id: 'w0335', ko: '세수', romaji: 'sesu', meaning: 'شستن صورت' },
        { id: 'w0336', ko: '셋', romaji: 'set', meaning: 'سه' },
        { id: 'w0337', ko: '소개', romaji: 'sogae', meaning: 'معرفی' },
        { id: 'w0338', ko: '소금', romaji: 'sogeum', meaning: 'نمک' },
        { id: 'w0339', ko: '손', romaji: 'son', meaning: 'دست' },
        { id: 'w0340', ko: '손님', romaji: 'sonnim', meaning: 'مهمون/مشتری' },
        { id: 'w0341', ko: '쇼핑', romaji: 'syoping', meaning: 'خرید' },
        { id: 'w0342', ko: '수박', romaji: 'subak', meaning: 'هندونه' },
        { id: 'w0343', ko: '수업', romaji: 'sueop', meaning: 'کلاس درس' },
        { id: 'w0344', ko: '수영', romaji: 'suyeong', meaning: 'شنا' },
        { id: 'w0345', ko: '수영장', romaji: 'suyeongjang', meaning: 'استخر' },
        { id: 'w0346', ko: '수요일', romaji: 'suyoil', meaning: 'چهارشنبه' },
        { id: 'w0347', ko: '수첩', romaji: 'sucheop', meaning: 'دفترچه' },
        { id: 'w0348', ko: '숙제', romaji: 'sukje', meaning: 'تکلیف' },
        { id: 'w0349', ko: '술', romaji: 'sul', meaning: 'مشروب' },
        { id: 'w0350', ko: '쉬다', romaji: 'swida', meaning: 'استراحت کردن' },
        { id: 'w0351', ko: '쉽다', romaji: 'swipda', meaning: 'آسون بودن' },
        { id: 'w0352', ko: '슈퍼마켓', romaji: 'syupeomaket', meaning: 'سوپرمارکت' },
        { id: 'w0353', ko: '스물', romaji: 'seumul', meaning: 'بیست' },
        { id: 'w0354', ko: '스키', romaji: 'seuki', meaning: 'اسکی' },
        { id: 'w0355', ko: '슬프다', romaji: 'seulpeuda', meaning: 'غمگین بودن' },
        { id: 'w0356', ko: '시', romaji: 'si', meaning: 'ساعت' },
        { id: 'w0357', ko: '시간', romaji: 'sigan', meaning: 'زمان' },
        { id: 'w0358', ko: '시다', romaji: 'sida', meaning: 'ترش بودن' },
        { id: 'w0359', ko: '시원하다', romaji: 'siwonhada', meaning: 'خنک بودن' },
        { id: 'w0360', ko: '시월', romaji: 'siwol', meaning: 'اکتبر' },
        { id: 'w0361', ko: '시작', romaji: 'sijak', meaning: 'شروع' },
        { id: 'w0362', ko: '시장', romaji: 'sijang', meaning: 'بازار' },
        { id: 'w0363', ko: '시청', romaji: 'sicheong', meaning: 'شهرداری' },
        { id: 'w0364', ko: '시키다', romaji: 'sikida', meaning: 'دستور دادن' },
        { id: 'w0365', ko: '시험', romaji: 'siheom', meaning: 'امتحان' },
        { id: 'w0366', ko: '식당', romaji: 'sikdang', meaning: 'رستوران' },
        { id: 'w0367', ko: '식사', romaji: 'siksa', meaning: 'وعده غذا' },
        { id: 'w0368', ko: '신다', romaji: 'sinda', meaning: 'پوشیدن (کفش)' },
        { id: 'w0369', ko: '신문', romaji: 'sinmun', meaning: 'روزنامه' },
        { id: 'w0370', ko: '신발', romaji: 'sinbal', meaning: 'کفش' },
        { id: 'w0371', ko: '실례', romaji: 'sillye', meaning: 'ببخشید' },
        { id: 'w0372', ko: '싫다', romaji: 'silta', meaning: 'ناخوشایند' },
        { id: 'w0373', ko: '싫어하다', romaji: 'sireohada', meaning: 'دوست نداشتن' },
        { id: 'w0374', ko: '십', romaji: 'sip', meaning: 'ده' },
        { id: 'w0375', ko: '십만', romaji: 'simman', meaning: 'صد هزار' },
        { id: 'w0376', ko: '십이월', romaji: 'sibiwol', meaning: 'دسامبر' },
        { id: 'w0377', ko: '십일월', romaji: 'sibilwol', meaning: 'نوامبر' },
        { id: 'w0378', ko: '싱겁다', romaji: 'singgeopda', meaning: 'بی‌نمک بودن' },
        { id: 'w0379', ko: '싸다', romaji: 'ssada', meaning: 'ارزون بودن' },
        { id: 'w0380', ko: '쓰다', romaji: 'sseuda', meaning: 'نوشتن' },
        { id: 'w0381', ko: '씨', romaji: 'ssi', meaning: 'آقا/خانم' },
        { id: 'w0382', ko: '씻다', romaji: 'ssitda', meaning: 'شستن' },
        { id: 'w0383', ko: '아', romaji: 'a', meaning: 'آه' },
        { id: 'w0384', ko: '아기', romaji: 'agi', meaning: 'بچه' },
        { id: 'w0385', ko: '아내', romaji: 'anae', meaning: 'زن (همسر)' },
        { id: 'w0386', ko: '아니다', romaji: 'anida', meaning: 'نبودن' },
        { id: 'w0387', ko: '아니요', romaji: 'aniyo', meaning: 'نه' },
        { id: 'w0388', ko: '아래', romaji: 'arae', meaning: 'پایین' },
        { id: 'w0389', ko: '아르바이트', romaji: 'areubaiteu', meaning: 'کار پاره‌وقت' },
        { id: 'w0390', ko: '아름답다', romaji: 'areumdapda', meaning: 'زیبا بودن' },
        { id: 'w0391', ko: '아버지', romaji: 'abeoji', meaning: 'پدر' },
        { id: 'w0392', ko: '아이', romaji: 'ai', meaning: 'کودک' },
        { id: 'w0393', ko: '아이스크림', romaji: 'aiseukeurim', meaning: 'بستنی' },
        { id: 'w0394', ko: '아저씨', romaji: 'ajeossi', meaning: 'آقا (دایی)' },
        { id: 'w0395', ko: '아주', romaji: 'aju', meaning: 'خیلی' },
        { id: 'w0396', ko: '아주머니', romaji: 'ajumeoni', meaning: 'خانم (زن دایی)' },
        { id: 'w0397', ko: '아직', romaji: 'ajik', meaning: 'هنوز' },
        { id: 'w0398', ko: '아침', romaji: 'achim', meaning: 'صبح' },
        { id: 'w0399', ko: '아파트', romaji: 'apateu', meaning: 'آپارتمان' },
        { id: 'w0400', ko: '아프다', romaji: 'apeuda', meaning: 'درد داشتن' },
        { id: 'w0401', ko: '아홉', romaji: 'ahop', meaning: 'نه' },
        { id: 'w0402', ko: '아흔', romaji: 'aheun', meaning: 'نود' },
        { id: 'w0403', ko: '안', romaji: 'an', meaning: 'داخل/منفی' },
        { id: 'w0404', ko: '안경', romaji: 'an-gyeong', meaning: 'عینک' },
        { id: 'w0405', ko: '안내', romaji: 'annae', meaning: 'راهنما' },
        { id: 'w0406', ko: '안녕', romaji: 'annyeong', meaning: 'سلام' },
        { id: 'w0407', ko: '안녕히', romaji: 'annyeonghi', meaning: 'به سلامت' },
        { id: 'w0408', ko: '앉다', romaji: 'anda', meaning: 'نشستن' },
        { id: 'w0409', ko: '알다', romaji: 'alda', meaning: 'دونستن' },
        { id: 'w0410', ko: '알리다', romaji: 'allida', meaning: 'خبر دادن' },
        { id: 'w0411', ko: '앞', romaji: 'ap', meaning: 'جلو' },
        { id: 'w0412', ko: '야구', romaji: 'yagu', meaning: 'بیسبال' },
        { id: 'w0413', ko: '약', romaji: 'yak', meaning: 'حدود/دارو' },
        { id: 'w0414', ko: '약국', romaji: 'yakguk', meaning: 'داروخونه' },
        { id: 'w0415', ko: '약속', romaji: 'yaksok', meaning: 'قول/قرار' },
        { id: 'w0416', ko: '어느', romaji: 'eoneu', meaning: 'کدوم' },
        { id: 'w0417', ko: '어디', romaji: 'eodi', meaning: 'کجا' },
        { id: 'w0418', ko: '어떤', romaji: 'eotteon', meaning: 'چه جور' },
        { id: 'w0419', ko: '어떻다', romaji: 'eotteota', meaning: 'چطور بودن' },
        { id: 'w0420', ko: '어렵다', romaji: 'eoryeopda', meaning: 'سخت بودن' },
        { id: 'w0421', ko: '어머니', romaji: 'eomeoni', meaning: 'مادر' },
        { id: 'w0422', ko: '어서', romaji: 'eoseo', meaning: 'بفرمایید' },
        { id: 'w0423', ko: '어제', romaji: 'eoje', meaning: 'دیروز' },
        { id: 'w0424', ko: '억', romaji: 'eok', meaning: 'صد میلیون' },
        { id: 'w0425', ko: '언니', romaji: 'eonni', meaning: 'خواهر بزرگتر' },
        { id: 'w0426', ko: '언제', romaji: 'eonje', meaning: 'کی' },
        { id: 'w0427', ko: '얼굴', romaji: 'eolgul', meaning: 'صورت' },
        { id: 'w0428', ko: '얼마', romaji: 'eolma', meaning: 'چقدر' },
        { id: 'w0429', ko: '얼마나', romaji: 'eolmana', meaning: 'چقدر (تأکید)' },
        { id: 'w0430', ko: '없다', romaji: 'eopda', meaning: 'نداشتن' },
        { id: 'w0431', ko: '에어컨', romaji: 'eeokeon', meaning: 'کولر' },
        { id: 'w0432', ko: '여권', romaji: 'yeogwon', meaning: 'پاسپورت' },
        { id: 'w0433', ko: '여기', romaji: 'yeogi', meaning: 'اینجا' },
        { id: 'w0434', ko: '여덟', romaji: 'yeodeol', meaning: 'هشت' },
        { id: 'w0435', ko: '여동생', romaji: 'yeodongsaeng', meaning: 'خواهر کوچیک' },
        { id: 'w0436', ko: '여든', romaji: 'yeodeun', meaning: 'هشتاد' },
        { id: 'w0437', ko: '여러', romaji: 'yeoreo', meaning: 'چندین' },
        { id: 'w0438', ko: '여러분', romaji: 'yeoreobun', meaning: 'همگی' },
        { id: 'w0439', ko: '여름', romaji: 'yeoreum', meaning: 'تابستون' },
        { id: 'w0440', ko: '여보세요', romaji: 'yeoboseyo', meaning: 'الو' },
        { id: 'w0441', ko: '여섯', romaji: 'yeoseot', meaning: 'شش' },
        { id: 'w0442', ko: '여자', romaji: 'yeoja', meaning: 'زن' },
        { id: 'w0443', ko: '여행', romaji: 'yeohaeng', meaning: 'مسافرت' },
        { id: 'w0444', ko: '여행사', romaji: 'yeohaengsa', meaning: 'آژانس مسافرتی' },
        { id: 'w0445', ko: '역', romaji: 'yeok', meaning: 'ایستگاه' },
        { id: 'w0446', ko: '연극', romaji: 'yeon-geuk', meaning: 'تئاتر' },
        { id: 'w0447', ko: '연습', romaji: 'yeonseup', meaning: 'تمرین' },
        { id: 'w0448', ko: '연필', romaji: 'yeonpil', meaning: 'مداد' },
        { id: 'w0449', ko: '열', romaji: 'yeol', meaning: 'ده' },
        { id: 'w0450', ko: '열다', romaji: 'yeolda', meaning: 'باز کردن' },
        { id: 'w0451', ko: '열쇠', romaji: 'yeolsoe', meaning: 'کلید' },
        { id: 'w0452', ko: '열심히', romaji: 'yeolsimhi', meaning: 'با جدیت' },
        { id: 'w0453', ko: '영', romaji: 'yeong', meaning: 'صفر' },
        { id: 'w0454', ko: '영국', romaji: 'yeongguk', meaning: 'انگلیس' },
        { id: 'w0455', ko: '영어', romaji: 'yeong-eo', meaning: 'انگلیسی' },
        { id: 'w0456', ko: '영화', romaji: 'yeonghwa', meaning: 'فیلم' },
        { id: 'w0457', ko: '영화관', romaji: 'yeonghwagwan', meaning: 'سینما' },
        { id: 'w0458', ko: '영화배우', romaji: 'yeonghwabae-u', meaning: 'بازیگر سینما' },
        { id: 'w0459', ko: '옆', romaji: 'yeop', meaning: 'کنار' },
        { id: 'w0460', ko: '예', romaji: 'ye', meaning: 'بله' },
        { id: 'w0461', ko: '예쁘다', romaji: 'yeppeuda', meaning: 'قشنگ بودن' },
        { id: 'w0462', ko: '오', romaji: 'o', meaning: 'پنج' },
        { id: 'w0463', ko: '오늘', romaji: 'oneul', meaning: 'امروز' },
        { id: 'w0464', ko: '오다', romaji: 'oda', meaning: 'اومدن' },
        { id: 'w0465', ko: '오렌지', romaji: 'orenji', meaning: 'پرتقال' },
        { id: 'w0466', ko: '오른쪽', romaji: 'oreunjjok', meaning: 'سمت راست' },
        { id: 'w0467', ko: '오빠', romaji: 'oppa', meaning: 'برادر بزرگتر' },
        { id: 'w0468', ko: '오십', romaji: 'osip', meaning: 'پنجاه' },
        { id: 'w0469', ko: '오월', romaji: 'owol', meaning: 'می' },
        { id: 'w0470', ko: '오전', romaji: 'ojeon', meaning: 'قبل از ظهر' },
        { id: 'w0471', ko: '오후', romaji: 'ohu', meaning: 'بعد از ظهر' },
        { id: 'w0472', ko: '올라가다', romaji: 'ollagada', meaning: 'بالا رفتن' },
        { id: 'w0473', ko: '올해', romaji: 'olhae', meaning: 'امسال' },
        { id: 'w0474', ko: '옷', romaji: 'ot', meaning: 'لباس' },
        { id: 'w0475', ko: '와', romaji: 'wa', meaning: 'واو' },
        { id: 'w0476', ko: '왜', romaji: 'wae', meaning: 'چرا' },
        { id: 'w0477', ko: '외국', romaji: 'oeguk', meaning: 'خارج' },
        { id: 'w0478', ko: '외국어', romaji: 'oegugeo', meaning: 'زبان خارجی' },
        { id: 'w0479', ko: '외국인', romaji: 'oegugin', meaning: 'خارجی' },
        { id: 'w0480', ko: '왼쪽', romaji: 'oenjjok', meaning: 'سمت چپ' },
        { id: 'w0481', ko: '요리', romaji: 'yori', meaning: 'آشپزی' },
        { id: 'w0482', ko: '요일', romaji: 'yoil', meaning: 'روز هفته' },
        { id: 'w0483', ko: '요즘', romaji: 'yojeum', meaning: 'این روزا' },
        { id: 'w0484', ko: '우리', romaji: 'uri', meaning: 'ما' },
        { id: 'w0485', ko: '우산', romaji: 'usan', meaning: 'چتر' },
        { id: 'w0486', ko: '우유', romaji: 'uyu', meaning: 'شیر' },
        { id: 'w0487', ko: '우체국', romaji: 'ucheguk', meaning: 'اداره پست' },
        { id: 'w0488', ko: '우표', romaji: 'upyo', meaning: 'تمبر' },
        { id: 'w0489', ko: '운동', romaji: 'undong', meaning: 'ورزش' },
        { id: 'w0490', ko: '운동장', romaji: 'undongjang', meaning: 'زمین ورزش' },
        { id: 'w0491', ko: '운동화', romaji: 'undonghwa', meaning: 'کفش ورزشی' },
        { id: 'w0492', ko: '운전', romaji: 'unjeon', meaning: 'رانندگی' },
        { id: 'w0493', ko: '울다', romaji: 'ulda', meaning: 'گریه کردن' },
        { id: 'w0494', ko: '웃다', romaji: 'utda', meaning: 'خندیدن' },
        { id: 'w0495', ko: '원', romaji: 'won', meaning: 'وون (پول)' },
        { id: 'w0496', ko: '월', romaji: 'wol', meaning: 'ماه' },
        { id: 'w0497', ko: '월요일', romaji: 'woryoil', meaning: 'دوشنبه' },
        { id: 'w0498', ko: '위', romaji: 'wi', meaning: 'رو' },
        { id: 'w0499', ko: '유명', romaji: 'yumyeong', meaning: 'معروف' },
        { id: 'w0500', ko: '유월', romaji: 'yuwol', meaning: 'ژوئن' },
        { id: 'w0501', ko: '육', romaji: 'yuk', meaning: 'شش' },
        { id: 'w0502', ko: '육십', romaji: 'yuksip', meaning: 'شصت' },
        { id: 'w0503', ko: '은행', romaji: 'eunhaeng', meaning: 'بانک' },
        { id: 'w0504', ko: '음', romaji: 'eum', meaning: 'اوم' },
        { id: 'w0505', ko: '음료수', romaji: 'eumnyosu', meaning: 'نوشیدنی' },
        { id: 'w0506', ko: '음식', romaji: 'eumsik', meaning: 'غذا' },
        { id: 'w0507', ko: '음악', romaji: 'eumak', meaning: 'موسیقی' },
        { id: 'w0508', ko: '의사', romaji: 'uisa', meaning: 'دکتر' },
        { id: 'w0509', ko: '의자', romaji: 'uija', meaning: 'صندلی' },
        { id: 'w0510', ko: '이', romaji: 'i', meaning: 'این/دو' },
        { id: 'w0511', ko: '이것', romaji: 'igeot', meaning: 'این چیز' },
        { id: 'w0512', ko: '이따가', romaji: 'ittaga', meaning: 'کمی بعد' },
        { id: 'w0513', ko: '이름', romaji: 'ireum', meaning: 'اسم' },
        { id: 'w0514', ko: '이번', romaji: 'ibeon', meaning: 'این دفعه' },
        { id: 'w0515', ko: '이십', romaji: 'isip', meaning: 'بیست' },
        { id: 'w0516', ko: '이야기', romaji: 'iyagi', meaning: 'داستان' },
        { id: 'w0517', ko: '이월', romaji: 'iwol', meaning: 'فوریه' },
        { id: 'w0518', ko: '이유', romaji: 'iyu', meaning: 'دلیل' },
        { id: 'w0519', ko: '이쪽', romaji: 'ijjok', meaning: 'این طرف' },
        { id: 'w0520', ko: '인도네시아', romaji: 'indonesia', meaning: 'اندونزی' },
        { id: 'w0521', ko: '인분', romaji: 'inbun', meaning: 'وعده' },
        { id: 'w0522', ko: '인사', romaji: 'insa', meaning: 'احوالپرسی' },
        { id: 'w0523', ko: '인천', romaji: 'incheon', meaning: 'اینچئون' },
        { id: 'w0524', ko: '인터넷', romaji: 'inteonet', meaning: 'اینترنت' },
        { id: 'w0525', ko: '일', romaji: 'il', meaning: 'کار/یک' },
        { id: 'w0526', ko: '일곱', romaji: 'ilgop', meaning: 'هفت' },
        { id: 'w0527', ko: '일본', romaji: 'ilbon', meaning: 'ژاپن' },
        { id: 'w0528', ko: '일어나다', romaji: 'ireonada', meaning: 'بیدار شدن' },
        { id: 'w0529', ko: '일요일', romaji: 'ilyoil', meaning: 'یکشنبه' },
        { id: 'w0530', ko: '일월', romaji: 'irwol', meaning: 'ژانویه' },
        { id: 'w0531', ko: '일주일', romaji: 'iljuil', meaning: 'یه هفته' },
        { id: 'w0532', ko: '일찍', romaji: 'iljjik', meaning: 'زود' },
        { id: 'w0533', ko: '일흔', romaji: 'ilheun', meaning: 'هفتاد' },
        { id: 'w0534', ko: '읽다', romaji: 'ikda', meaning: 'خوندن' },
        { id: 'w0535', ko: '입', romaji: 'ip', meaning: 'دهن' },
        { id: 'w0536', ko: '입다', romaji: 'ipda', meaning: 'پوشیدن' },
        { id: 'w0537', ko: '있다', romaji: 'itda', meaning: 'بودن/داشتن' },
        { id: 'w0538', ko: '자다', romaji: 'jada', meaning: 'خوابیدن' },
        { id: 'w0539', ko: '자동차', romaji: 'jadongcha', meaning: 'ماشین' },
        { id: 'w0540', ko: '자전거', romaji: 'jajeon-geo', meaning: 'دوچرخه' },
        { id: 'w0541', ko: '자주', romaji: 'jaju', meaning: 'اغلب' },
        { id: 'w0542', ko: '작년', romaji: 'jangnyeon', meaning: 'سال پیش' },
        { id: 'w0543', ko: '작다', romaji: 'jakda', meaning: 'کوچیک بودن' },
        { id: 'w0544', ko: '잔', romaji: 'jan', meaning: 'لیوان' },
        { id: 'w0545', ko: '잘', romaji: 'jal', meaning: 'خوب' },
        { id: 'w0546', ko: '잘못', romaji: 'jalmot', meaning: 'اشتباه' },
        { id: 'w0547', ko: '잘하다', romaji: 'jalhada', meaning: 'خوب انجام دادن' },
        { id: 'w0548', ko: '잠', romaji: 'jam', meaning: 'خواب' },
        { id: 'w0549', ko: '잠깐', romaji: 'jamkkan', meaning: 'یه لحظه' },
        { id: 'w0550', ko: '잠시', romaji: 'jamsi', meaning: 'یه لحظه' },
        { id: 'w0551', ko: '잡수시다', romaji: 'japsusida', meaning: 'میل کردن' },
        { id: 'w0552', ko: '잡채', romaji: 'japchae', meaning: 'جاپچه' },
        { id: 'w0553', ko: '장소', romaji: 'jangso', meaning: 'مکان' },
        { id: 'w0554', ko: '재미없다', romaji: 'jaemieopda', meaning: 'خسته‌کننده' },
        { id: 'w0555', ko: '재미있다', romaji: 'jaemiitda', meaning: 'جذاب بودن' },
        { id: 'w0556', ko: '저', romaji: 'jeo', meaning: 'من (متواضعانه)' },
        { id: 'w0557', ko: '저것', romaji: 'jeogeot', meaning: 'اون چیز' },
        { id: 'w0558', ko: '저기', romaji: 'jeogi', meaning: 'اونجا' },
        { id: 'w0559', ko: '저녁', romaji: 'jeonyeok', meaning: 'غروب' },
        { id: 'w0560', ko: '저쪽', romaji: 'jeojjok', meaning: 'اون طرف' },
        { id: 'w0561', ko: '적다', romaji: 'jeokda', meaning: 'کم بودن' },
        { id: 'w0562', ko: '전', romaji: 'jeon', meaning: 'قبل' },
        { id: 'w0563', ko: '전공', romaji: 'jeongong', meaning: 'رشته تحصیلی' },
        { id: 'w0564', ko: '전화', romaji: 'jeonhwa', meaning: 'تلفن' },
        { id: 'w0565', ko: '전화번호', romaji: 'jeonhwabeonho', meaning: 'شماره تلفن' },
        { id: 'w0566', ko: '점심', romaji: 'jeomsim', meaning: 'ناهار' },
        { id: 'w0567', ko: '정류장', romaji: 'jeongnyujang', meaning: 'ایستگاه' },
        { id: 'w0568', ko: '정말', romaji: 'jeongmal', meaning: 'واقعاً' },
        { id: 'w0569', ko: '제', romaji: 'je', meaning: 'مال من' },
        { id: 'w0570', ko: '제일', romaji: 'jeil', meaning: 'از همه' },
        { id: 'w0571', ko: '제주도', romaji: 'jejudo', meaning: 'ججو' },
        { id: 'w0572', ko: '조금', romaji: 'jogeum', meaning: 'یه کمی' },
        { id: 'w0573', ko: '조용하다', romaji: 'joyonghada', meaning: 'ساکت بودن' },
        { id: 'w0574', ko: '졸업', romaji: 'joreop', meaning: 'فارغ‌التحصیلی' },
        { id: 'w0575', ko: '좀', romaji: 'jom', meaning: 'یه کمی' },
        { id: 'w0576', ko: '종업원', romaji: 'jong-eobwon', meaning: 'کارمند' },
        { id: 'w0577', ko: '좋다', romaji: 'jota', meaning: 'خوب بودن' },
        { id: 'w0578', ko: '좋아하다', romaji: 'joahada', meaning: 'دوست داشتن' },
        { id: 'w0579', ko: '죄송하다', romaji: 'joesonghada', meaning: 'متأسف بودن' },
        { id: 'w0580', ko: '주', romaji: 'ju', meaning: 'هفته' },
        { id: 'w0581', ko: '주다', romaji: 'juda', meaning: 'دادن' },
        { id: 'w0582', ko: '주로', romaji: 'juro', meaning: 'عمدتاً' },
        { id: 'w0583', ko: '주말', romaji: 'jumal', meaning: 'آخر هفته' },
        { id: 'w0584', ko: '주무시다', romaji: 'jumusida', meaning: 'خوابیدن (محترمانه)' },
        { id: 'w0585', ko: '주부', romaji: 'jubu', meaning: 'خونه‌دار' },
        { id: 'w0586', ko: '주소', romaji: 'juso', meaning: 'آدرس' },
        { id: 'w0587', ko: '주스', romaji: 'juseu', meaning: 'آبمیوه' },
        { id: 'w0588', ko: '주인', romaji: 'ju-in', meaning: 'صاحب' },
        { id: 'w0589', ko: '주일', romaji: 'ju-il', meaning: 'هفته' },
        { id: 'w0590', ko: '준비', romaji: 'junbi', meaning: 'آمادگی' },
        { id: 'w0591', ko: '중', romaji: 'jung', meaning: 'وسط' },
        { id: 'w0592', ko: '중국', romaji: 'jungguk', meaning: 'چین' },
        { id: 'w0593', ko: '지갑', romaji: 'jigap', meaning: 'کیف پول' },
        { id: 'w0594', ko: '지금', romaji: 'jigeum', meaning: 'الان' },
        { id: 'w0595', ko: '지나다', romaji: 'jinada', meaning: 'گذشتن' },
        { id: 'w0596', ko: '지난달', romaji: 'jinandal', meaning: 'ماه پیش' },
        { id: 'w0597', ko: '지난주', romaji: 'jinanju', meaning: 'هفته پیش' },
        { id: 'w0598', ko: '지난해', romaji: 'jinanhae', meaning: 'سال پیش' },
        { id: 'w0599', ko: '지내다', romaji: 'jinaeda', meaning: 'زندگی کردن' },
        { id: 'w0600', ko: '지우개', romaji: 'jiugae', meaning: 'پاک‌کن' },
        { id: 'w0601', ko: '지하철', romaji: 'jihacheol', meaning: 'مترو' },
        { id: 'w0602', ko: '지하철역', romaji: 'jihacheollyeok', meaning: 'ایستگاه مترو' },
        { id: 'w0603', ko: '직업', romaji: 'jigeop', meaning: 'شغل' },
        { id: 'w0604', ko: '직원', romaji: 'jigwon', meaning: 'پرسنل' },
        { id: 'w0605', ko: '질문', romaji: 'jilmun', meaning: 'سوال' },
        { id: 'w0606', ko: '집', romaji: 'jip', meaning: 'خونه' },
        { id: 'w0607', ko: '짜다', romaji: 'jjada', meaning: 'شور بودن' },
        { id: 'w0608', ko: '쪽', romaji: 'jjok', meaning: 'طرف' },
        { id: 'w0609', ko: '찍다', romaji: 'jjikda', meaning: 'عکس گرفتن' },
        { id: 'w0610', ko: '참', romaji: 'cham', meaning: 'واقعاً' },
        { id: 'w0611', ko: '참외', romaji: 'chamoe', meaning: 'خربزه کره‌ای' },
        { id: 'w0612', ko: '창문', romaji: 'changmun', meaning: 'پنجره' },
        { id: 'w0613', ko: '찾다', romaji: 'chatda', meaning: 'پیدا کردن' },
        { id: 'w0614', ko: '찾아보다', romaji: 'chajaboda', meaning: 'گشتن دنبال' },
        { id: 'w0615', ko: '책', romaji: 'chaek', meaning: 'کتاب' },
        { id: 'w0616', ko: '책상', romaji: 'chaeksang', meaning: 'میز' },
        { id: 'w0617', ko: '처음', romaji: 'cheoeum', meaning: 'اول' },
        { id: 'w0618', ko: '천', romaji: 'cheon', meaning: 'هزار' },
        { id: 'w0619', ko: '천만', romaji: 'cheonman', meaning: 'ده میلیون' },
        { id: 'w0620', ko: '천천히', romaji: 'cheoncheonhi', meaning: 'آروم' },
        { id: 'w0621', ko: '청소', romaji: 'cheongso', meaning: 'نظافت' },
        { id: 'w0622', ko: '초대', romaji: 'chodae', meaning: 'دعوت' },
        { id: 'w0623', ko: '초콜릿', romaji: 'chokollit', meaning: 'شکلات' },
        { id: 'w0624', ko: '추다', romaji: 'chuda', meaning: 'رقصیدن' },
        { id: 'w0625', ko: '축구', romaji: 'chukgu', meaning: 'فوتبال' },
        { id: 'w0626', ko: '축하', romaji: 'chukha', meaning: 'تبریک' },
        { id: 'w0627', ko: '출발', romaji: 'chulbal', meaning: 'حرکت' },
        { id: 'w0628', ko: '춤', romaji: 'chum', meaning: 'رقص' },
        { id: 'w0629', ko: '춤추다', romaji: 'chumchuda', meaning: 'رقصیدن' },
        { id: 'w0630', ko: '춥다', romaji: 'chupda', meaning: 'سرد بودن' },
        { id: 'w0631', ko: '취미', romaji: 'chwimi', meaning: 'سرگرمی' },
        { id: 'w0632', ko: '층', romaji: 'cheung', meaning: 'طبقه' },
        { id: 'w0633', ko: '치다', romaji: 'chida', meaning: 'زدن' },
        { id: 'w0634', ko: '치마', romaji: 'chima', meaning: 'دامن' },
        { id: 'w0635', ko: '친구', romaji: 'chin-gu', meaning: 'دوست' },
        { id: 'w0636', ko: '친절', romaji: 'chinjeol', meaning: 'مهربونی' },
        { id: 'w0637', ko: '친하다', romaji: 'chinhada', meaning: 'صمیمی بودن' },
        { id: 'w0638', ko: '칠', romaji: 'chil', meaning: 'هفت' },
        { id: 'w0639', ko: '칠십', romaji: 'chilsip', meaning: 'هفتاد' },
        { id: 'w0640', ko: '칠월', romaji: 'chirwol', meaning: 'جولای' },
        { id: 'w0641', ko: '칠판', romaji: 'chilpan', meaning: 'تخته' },
        { id: 'w0642', ko: '침대', romaji: 'chimdae', meaning: 'تخت' },
        { id: 'w0643', ko: '카드', romaji: 'kadeu', meaning: 'کارت' },
        { id: 'w0644', ko: '카메라', romaji: 'kamera', meaning: 'دوربین' },
        { id: 'w0645', ko: '캐나다', romaji: 'kaenada', meaning: 'کانادا' },
        { id: 'w0646', ko: '커피', romaji: 'keopi', meaning: 'قهوه' },
        { id: 'w0647', ko: '커피숍', romaji: 'keopisyop', meaning: 'کافی‌شاپ' },
        { id: 'w0648', ko: '컴퓨터', romaji: 'keompyuteo', meaning: 'کامپیوتر' },
        { id: 'w0649', ko: '컵', romaji: 'keop', meaning: 'فنجون' },
        { id: 'w0650', ko: '케이크', romaji: 'keikeu', meaning: 'کیک' },
        { id: 'w0651', ko: '켜다', romaji: 'kyeoda', meaning: 'روشن کردن' },
        { id: 'w0652', ko: '코', romaji: 'ko', meaning: 'بینی' },
        { id: 'w0653', ko: '콘서트', romaji: 'konseoteu', meaning: 'کنسرت' },
        { id: 'w0654', ko: '콜라', romaji: 'kolla', meaning: 'کولا' },
        { id: 'w0655', ko: '크다', romaji: 'keuda', meaning: 'بزرگ بودن' },
        { id: 'w0656', ko: '키', romaji: 'ki', meaning: 'قد' },
        { id: 'w0657', ko: '타다', romaji: 'tada', meaning: 'سوار شدن' },
        { id: 'w0658', ko: '탁구', romaji: 'takgu', meaning: 'پینگ پونگ' },
        { id: 'w0659', ko: '태국', romaji: 'taeguk', meaning: 'تایلند' },
        { id: 'w0660', ko: '태권도', romaji: 'taekwondo', meaning: 'تکواندو' },
        { id: 'w0661', ko: '택시', romaji: 'taeksi', meaning: 'تاکسی' },
        { id: 'w0662', ko: '터미널', romaji: 'teomineol', meaning: 'ترمینال' },
        { id: 'w0663', ko: '테니스', romaji: 'teniseu', meaning: 'تنیس' },
        { id: 'w0664', ko: '텔레비전', romaji: 'tellebijeon', meaning: 'تلویزیون' },
        { id: 'w0665', ko: '토요일', romaji: 'toyoil', meaning: 'شنبه' },
        { id: 'w0666', ko: '퇴근', romaji: 'toegeun', meaning: 'ترک کار' },
        { id: 'w0667', ko: '특별하다', romaji: 'teukbyeolhada', meaning: 'خاص بودن' },
        { id: 'w0668', ko: '특히', romaji: 'teuki', meaning: 'مخصوصاً' },
        { id: 'w0669', ko: '티셔츠', romaji: 'tisyeocheu', meaning: 'تی‌شرت' },
        { id: 'w0670', ko: '파티', romaji: 'pati', meaning: 'مهمونی' },
        { id: 'w0671', ko: '팔', romaji: 'pal', meaning: 'بازو/هشت' },
        { id: 'w0672', ko: '팔다', romaji: 'palda', meaning: 'فروختن' },
        { id: 'w0673', ko: '팔십', romaji: 'palsip', meaning: 'هشتاد' },
        { id: 'w0674', ko: '팔월', romaji: 'parwol', meaning: 'اوت' },
        { id: 'w0675', ko: '편의점', romaji: 'pyeonuijeom', meaning: 'فروشگاه زنجیره‌ای' },
        { id: 'w0676', ko: '편지', romaji: 'pyeonji', meaning: 'نامه' },
        { id: 'w0677', ko: '포도', romaji: 'podo', meaning: 'انگور' },
        { id: 'w0678', ko: '표', romaji: 'pyo', meaning: 'بلیط' },
        { id: 'w0679', ko: '프랑스', romaji: 'peurangseu', meaning: 'فرانسه' },
        { id: 'w0680', ko: '프로그램', romaji: 'peurogeuraem', meaning: 'برنامه' },
        { id: 'w0681', ko: '피곤', romaji: 'pigon', meaning: 'خستگی' },
        { id: 'w0682', ko: '피아노', romaji: 'piano', meaning: 'پیانو' },
        { id: 'w0683', ko: '피우다', romaji: 'piuda', meaning: 'روشن کردن (سیگار)' },
        { id: 'w0684', ko: '필요', romaji: 'piryo', meaning: 'نیاز' },
        { id: 'w0685', ko: '필통', romaji: 'piltong', meaning: 'جامدادی' },
        { id: 'w0686', ko: '하나', romaji: 'hana', meaning: 'یک' },
        { id: 'w0687', ko: '하다', romaji: 'hada', meaning: 'انجام دادن' },
        { id: 'w0688', ko: '하루', romaji: 'haru', meaning: 'یه روز' },
        { id: 'w0689', ko: '하숙집', romaji: 'hasukjip', meaning: 'خوابگاه خصوصی' },
        { id: 'w0690', ko: '하지만', romaji: 'hajiman', meaning: 'اما' },
        { id: 'w0691', ko: '학교', romaji: 'hakgyo', meaning: 'مدرسه' },
        { id: 'w0692', ko: '학생', romaji: 'haksaeng', meaning: 'دانش‌آموز' },
        { id: 'w0693', ko: '학생증', romaji: 'haksaengjeung', meaning: 'کارت دانشجویی' },
        { id: 'w0694', ko: '한', romaji: 'han', meaning: 'یک' },
        { id: 'w0695', ko: '한가하다', romaji: 'han-gahada', meaning: 'بیکار بودن' },
        { id: 'w0696', ko: '한국', romaji: 'han-guk', meaning: 'کره' },
        { id: 'w0697', ko: '한복', romaji: 'hanbok', meaning: 'هانبوک' },
        { id: 'w0698', ko: '할머니', romaji: 'halmeoni', meaning: 'مادربزرگ' },
        { id: 'w0699', ko: '할아버지', romaji: 'harabeoji', meaning: 'پدربزرگ' },
        { id: 'w0700', ko: '함께', romaji: 'hamkke', meaning: 'با هم' },
        { id: 'w0701', ko: '형', romaji: 'hyeong', meaning: 'برادر بزرگتر' },
        { id: 'w0702', ko: '호', romaji: 'ho', meaning: 'شماره' },
        { id: 'w0703', ko: '호텔', romaji: 'hotel', meaning: 'هتل' },
        { id: 'w0704', ko: '혼자', romaji: 'honja', meaning: 'تنها' },
        { id: 'w0705', ko: '화요일', romaji: 'hwayoil', meaning: 'سه‌شنبه' },
        { id: 'w0706', ko: '화장실', romaji: 'hwajangsil', meaning: 'دستشویی' },
        { id: 'w0707', ko: '회사', romaji: 'hoesa', meaning: 'شرکت' },
        { id: 'w0708', ko: '회사원', romaji: 'hoesawon', meaning: 'کارمند' },
        { id: 'w0709', ko: '회의', romaji: 'hoeui', meaning: 'جلسه' },
        { id: 'w0710', ko: '후', romaji: 'hu', meaning: 'بعد' },
        { id: 'w0711', ko: '휴가', romaji: 'hyuga', meaning: 'مرخصی' },
        { id: 'w0712', ko: '흐리다', romaji: 'heurida', meaning: 'ابری بودن' },
        { id: 'w0713', ko: '힘들다', romaji: 'himdeulda', meaning: 'سخت بودن' }
    ]
},
            {
                id: 'topik2', level: 'TOPIK 2', korean: '2급', icon: 'fa-2',
                color: '#F59E0B', iconBg: 'rgba(245,158,11,0.1)',
                words: [
    { id: 'w0201', ko: '가까이', romaji: 'gakkai', meaning: 'نزدیک' },
    { id: 'w0202', ko: '가끔', romaji: 'gakkeum', meaning: 'گاهی' },
    { id: 'w0203', ko: '가늘다', romaji: 'ganeulda', meaning: 'نازک بودن' },
    { id: 'w0204', ko: '가득', romaji: 'gadeuk', meaning: 'پر / لبریز' },
    { id: 'w0205', ko: '가리키다', romaji: 'garikida', meaning: 'اشاره کردن' },
    { id: 'w0206', ko: '가슴', romaji: 'gaseum', meaning: 'سینه / قلب' },
    { id: 'w0207', ko: '가위', romaji: 'gawi', meaning: 'قیچی' },
    { id: 'w0208', ko: '가져가다', romaji: 'gajyeogada', meaning: 'با خود بردن' },
    { id: 'w0209', ko: '가져오다', romaji: 'gajyeooda', meaning: 'آوردن' },
    { id: 'w0210', ko: '각각', romaji: 'gakgak', meaning: 'هر کدام' },
    { id: 'w0211', ko: '간단하다', romaji: 'gandanhada', meaning: 'ساده بودن' },
    { id: 'w0212', ko: '간단히', romaji: 'gandanhi', meaning: 'به سادگی' },
    { id: 'w0213', ko: '간식', romaji: 'gansik', meaning: 'میان وعده' },
    { id: 'w0214', ko: '간장', romaji: 'ganjang', meaning: 'سس سویا' },
    { id: 'w0215', ko: '간호사', romaji: 'ganhosa', meaning: 'پرستار' },
    { id: 'w0216', ko: '갈색', romaji: 'galsaek', meaning: 'قهوه‌ای' },
    { id: 'w0217', ko: '갈아입다', romaji: 'garaipda', meaning: 'عوض کردن لباس' },
    { id: 'w0218', ko: '감기약', romaji: 'gamgiyak', meaning: 'داروی سرماخوردگی' },
    { id: 'w0219', ko: '감다', romaji: 'gamda', meaning: 'بستن چشم / شستن مو' },
    { id: 'w0220', ko: '감자', romaji: 'gamja', meaning: 'سیب‌زمینی' },
    { id: 'w0221', ko: '갑자기', romaji: 'gapjagi', meaning: 'ناگهان' },
    { id: 'w0222', ko: '강', romaji: 'gang', meaning: 'رودخانه' },
    { id: 'w0223', ko: '강아지', romaji: 'gangaji', meaning: 'توله سگ' },
    { id: 'w0224', ko: '강하다', romaji: 'ganghada', meaning: 'قوی بودن' },
    { id: 'w0225', ko: '갖다', romaji: 'gatda', meaning: 'داشتن' },
    { id: 'w0226', ko: '갚다', romaji: 'gapda', meaning: 'جبران کردن' },
    { id: 'w0227', ko: '개월', romaji: 'gaewol', meaning: 'ماه (واحد شمارش)' },
    { id: 'w0228', ko: '거', romaji: 'geo', meaning: 'چیز (مخفف 것)' },
    { id: 'w0229', ko: '거리', romaji: 'geori', meaning: 'خیابان / فاصله' },
    { id: 'w0230', ko: '거울', romaji: 'geoul', meaning: 'آینه' },
    { id: 'w0231', ko: '거의', romaji: 'geoui', meaning: 'تقریباً' },
    { id: 'w0232', ko: '거절', romaji: 'geojeol', meaning: 'رد کردن' },
    { id: 'w0233', ko: '거짓말', romaji: 'geojinmal', meaning: 'دروغ' },
    { id: 'w0234', ko: '걱정', romaji: 'geokjeong', meaning: 'نگرانی' },
    { id: 'w0235', ko: '건너가다', romaji: 'geonneogada', meaning: 'عبور کردن (رفتن)' },
    { id: 'w0236', ko: '건너다', romaji: 'geonneoda', meaning: 'عبور کردن' },
    { id: 'w0237', ko: '걸어가다', romaji: 'georeogada', meaning: 'پیاده رفتن' },
    { id: 'w0238', ko: '걸어오다', romaji: 'georeooda', meaning: 'پیاده آمدن' },
    { id: 'w0239', ko: '걸음', romaji: 'georeum', meaning: 'قدم / گام' },
    { id: 'w0240', ko: '검사', romaji: 'geomsa', meaning: 'بررسی / معاینه' },
    { id: 'w0241', ko: '검은색', romaji: 'geomeunsaek', meaning: 'رنگ مشکی' },
    { id: 'w0242', ko: '검정', romaji: 'geomjeong', meaning: 'مشکی' },
    { id: 'w0243', ko: '겉', romaji: 'geot', meaning: 'بیرون / ظاهر' },
    { id: 'w0244', ko: '게으르다', romaji: 'geeureuda', meaning: 'تنبل بودن' },
    { id: 'w0245', ko: '결과', romaji: 'gyeolgwa', meaning: 'نتیجه' },
    { id: 'w0246', ko: '결석', romaji: 'gyeolseok', meaning: 'غیبت' },
    { id: 'w0247', ko: '결심', romaji: 'gyeolsim', meaning: 'تصمیم جدی' },
    { id: 'w0248', ko: '결정', romaji: 'gyeoljeong', meaning: 'تصمیم‌گیری' },
    { id: 'w0249', ko: '결혼', romaji: 'gyeolhon', meaning: 'ازدواج' },
    { id: 'w0250', ko: '결혼식', romaji: 'gyeolhonsik', meaning: 'مراسم عروسی' },
    { id: 'w0251', ko: '경기', romaji: 'gyeonggi', meaning: 'مسابقه' },
    { id: 'w0252', ko: '경찰', romaji: 'gyeongchal', meaning: 'پلیس' },
    { id: 'w0253', ko: '경찰서', romaji: 'gyeongchalseo', meaning: 'ایستگاه پلیس' },
    { id: 'w0254', ko: '경치', romaji: 'gyeongchi', meaning: 'منظره' },
    { id: 'w0255', ko: '경험', romaji: 'gyeongheom', meaning: 'تجربه' },
    { id: 'w0256', ko: '계단', romaji: 'gyedan', meaning: 'پله' },
    { id: 'w0257', ko: '계란', romaji: 'gyeran', meaning: 'تخم‌مرغ' },
    { id: 'w0258', ko: '계산', romaji: 'gyesan', meaning: 'محاسبه' },
    { id: 'w0259', ko: '고개', romaji: 'gogae', meaning: 'سر / گردنه' },
    { id: 'w0260', ko: '고등학교', romaji: 'godeunghakgyo', meaning: 'دبیرستان' },
    { id: 'w0261', ko: '고등학생', romaji: 'godeunghaksaeng', meaning: 'دانش‌آموز دبیرستان' },
    { id: 'w0262', ko: '고모', romaji: 'gomo', meaning: 'عمه / خاله' },
    { id: 'w0263', ko: '고민', romaji: 'gomin', meaning: 'نگرانی' },
    { id: 'w0264', ko: '고속버스', romaji: 'gosokbeoseu', meaning: 'اتوبوس سریع' },
    { id: 'w0265', ko: '고장', romaji: 'gojang', meaning: 'خرابی' },
    { id: 'w0266', ko: '고추장', romaji: 'gochujang', meaning: 'خمیر فلفل' },
    { id: 'w0267', ko: '고치다', romaji: 'gochida', meaning: 'تعمیر کردن' },
    { id: 'w0268', ko: '곧', romaji: 'got', meaning: 'به زودی' },
    { id: 'w0269', ko: '공', romaji: 'gong', meaning: 'توپ' },
    { id: 'w0270', ko: '공무원', romaji: 'gongmuwon', meaning: 'کارمند دولت' },
    { id: 'w0271', ko: '공장', romaji: 'gongjang', meaning: 'کارخانه' },
    { id: 'w0272', ko: '공짜', romaji: 'gongjja', meaning: 'رایگان' },
    { id: 'w0273', ko: '공휴일', romaji: 'gonghyuil', meaning: 'تعطیل رسمی' },
    { id: 'w0274', ko: '과거', romaji: 'gwageo', meaning: 'گذشته' },
    { id: 'w0275', ko: '과자', romaji: 'gwaja', meaning: 'بیسکویت / اسنک' },
    { id: 'w0276', ko: '관계', romaji: 'gwangye', meaning: 'رابطه' },
    { id: 'w0277', ko: '관광', romaji: 'gwangwang', meaning: 'گردشگری' },
    { id: 'w0278', ko: '관광객', romaji: 'gwangwanggaek', meaning: 'گردشگر' },
    { id: 'w0279', ko: '관광지', romaji: 'gwangwangji', meaning: 'منطقه گردشگری' },
    { id: 'w0280', ko: '관심', romaji: 'gwansim', meaning: 'توجه / علاقه' },
    { id: 'w0281', ko: '광고', romaji: 'gwanggo', meaning: 'تبلیغات' },
    { id: 'w0282', ko: '광주', romaji: 'gwangju', meaning: 'گوانگجو (شهر)' },
    { id: 'w0283', ko: '교과서', romaji: 'gyogwaseo', meaning: 'کتاب درسی' },
    { id: 'w0284', ko: '교사', romaji: 'gyosa', meaning: 'معلم' },
    { id: 'w0285', ko: '교수', romaji: 'gyosu', meaning: 'استاد دانشگاه' },
    { id: 'w0286', ko: '교육', romaji: 'gyoyuk', meaning: 'آموزش' },
    { id: 'w0287', ko: '교통비', romaji: 'gyotongbi', meaning: 'هزینه حمل و نقل' },
    { id: 'w0288', ko: '교통사고', romaji: 'gyotongsago', meaning: 'تصادف' },
    { id: 'w0289', ko: '교환', romaji: 'gyohwan', meaning: 'تعویض' },
    { id: 'w0290', ko: '교회', romaji: 'gyohoe', meaning: 'کلیسا' },
    { id: 'w0291', ko: '구름', romaji: 'gureum', meaning: 'ابر' },
    { id: 'w0292', ko: '국', romaji: 'guk', meaning: 'سوپ' },
    { id: 'w0293', ko: '국내', romaji: 'gungnae', meaning: 'داخلی' },
    { id: 'w0294', ko: '국수', romaji: 'guksu', meaning: 'نودل' },
    { id: 'w0295', ko: '국제', romaji: 'gukje', meaning: 'بین‌المللی' },
    { id: 'w0296', ko: '군인', romaji: 'gunin', meaning: 'سرباز' },
    { id: 'w0297', ko: '굵다', romaji: 'gukda', meaning: 'ضخیم بودن' },
    { id: 'w0298', ko: '굽다', romaji: 'gupda', meaning: 'کباب کردن' },
    { id: 'w0299', ko: '궁금하다', romaji: 'gunggeumhada', meaning: 'کنجکاو بودن' },
    { id: 'w0300', ko: '귀걸이', romaji: 'gwi-geori', meaning: 'گوشواره' },
    { id: 'w0301', ko: '귀엽다', romaji: 'gwiyeopda', meaning: 'بامزه بودن' },
    { id: 'w0302', ko: '귀찮다', romaji: 'gwichanta', meaning: 'اعصاب‌خردکن بودن' },
    { id: 'w0303', ko: '규칙', romaji: 'gyuchik', meaning: 'قانون / قاعده' },
    { id: 'w0304', ko: '그거', romaji: 'geugeo', meaning: 'اون (چیز)' },
    { id: 'w0305', ko: '그곳', romaji: 'geugot', meaning: 'اونجا' },
    { id: 'w0306', ko: '그날', romaji: 'geunal', meaning: 'اون روز' },
    { id: 'w0307', ko: '그냥', romaji: 'geunyang', meaning: 'همینطوری / فقط' },
    { id: 'w0308', ko: '그대로', romaji: 'geudaero', meaning: 'همونطور که هست' },
    { id: 'w0309', ko: '그동안', romaji: 'geudong-an', meaning: 'در این مدت' },
    { id: 'w0310', ko: '그때', romaji: 'geuttae', meaning: 'اون موقع' },
    { id: 'w0311', ko: '그러나', romaji: 'geureona', meaning: 'اما / ولی' },
    { id: 'w0312', ko: '그러므로', romaji: 'geureomeuro', meaning: 'بنابراین' },
    { id: 'w0313', ko: '그런', romaji: 'geureon', meaning: 'اینطوری / همچین' },
    { id: 'w0314', ko: '그립다', romaji: 'geuripda', meaning: 'دلتنگ بودن' },
    { id: 'w0315', ko: '그만', romaji: 'geuman', meaning: 'بسّه / کافیه' },
    { id: 'w0316', ko: '그만두다', romaji: 'geumanduda', meaning: 'ول کردن / رها کردن' },
    { id: 'w0317', ko: '그분', romaji: 'geubun', meaning: 'ایشون (محترمانه)' },
    { id: 'w0318', ko: '그치다', romaji: 'geuchida', meaning: 'متوقف شدن' },
    { id: 'w0319', ko: '글쎄', romaji: 'geulsse', meaning: 'نمی‌دونم / شاید' },
    { id: 'w0320', ko: '글씨', romaji: 'geulssi', meaning: 'دست‌خط' },
    { id: 'w0321', ko: '글자', romaji: 'geulja', meaning: 'حرف / کاراکتر' },
    { id: 'w0322', ko: '금방', romaji: 'geumbang', meaning: 'همین الان / به زودی' },
    { id: 'w0323', ko: '금지', romaji: 'geumji', meaning: 'ممنوع' },
    { id: 'w0324', ko: '급하다', romaji: 'geuphada', meaning: 'عجله داشتن' },
    { id: 'w0325', ko: '기르다', romaji: 'gireuda', meaning: 'پرورش دادن' },
    { id: 'w0326', ko: '기름', romaji: 'gireum', meaning: 'روغن' },
    { id: 'w0327', ko: '기뻐하다', romaji: 'gippeohada', meaning: 'خوشحالی کردن' },
    { id: 'w0328', ko: '기쁨', romaji: 'gippeum', meaning: 'شادی' },
    { id: 'w0329', ko: '기억', romaji: 'gieok', meaning: 'حافظه / یاد' },
    { id: 'w0330', ko: '기억나다', romaji: 'gieongnada', meaning: 'یاد آمدن' },
    { id: 'w0331', ko: '기온', romaji: 'gion', meaning: 'دمای هوا' },
    { id: 'w0332', ko: '기자', romaji: 'gija', meaning: 'خبرنگار' },
    { id: 'w0333', ko: '기차역', romaji: 'gichayeok', meaning: 'ایستگاه قطار' },
    { id: 'w0334', ko: '기차표', romaji: 'gichapyo', meaning: 'بلیط قطار' },
    { id: 'w0335', ko: '기침', romaji: 'gichim', meaning: 'سرفه' },
    { id: 'w0336', ko: '기타', romaji: 'gita', meaning: 'گیتار / غیره' },
    { id: 'w0337', ko: '기회', romaji: 'gihoe', meaning: 'فرصت' },
    { id: 'w0338', ko: '긴장', romaji: 'ginjang', meaning: 'اضطراب / تنش' },
    { id: 'w0339', ko: '길이', romaji: 'giri', meaning: 'طول' },
    { id: 'w0340', ko: '김', romaji: 'gim', meaning: 'جلبک دریایی' },
    { id: 'w0341', ko: '깊다', romaji: 'gipda', meaning: 'عمیق بودن' },
    { id: 'w0342', ko: '깊이', romaji: 'gipi', meaning: 'عمیقاً' },
    { id: 'w0343', ko: '까만색', romaji: 'kkamansaek', meaning: 'رنگ مشکی پررنگ' },
    { id: 'w0344', ko: '까맣다', romaji: 'kkamata', meaning: 'سیاه پررنگ' },
    { id: 'w0345', ko: '깎다', romaji: 'kkakda', meaning: 'پوست کندن / تراشیدن' },
    { id: 'w0346', ko: '깜짝', romaji: 'kkamjjak', meaning: 'ناگهان / یهو' },
    { id: 'w0347', ko: '깨끗이', romaji: 'kkaekkeusi', meaning: 'تمیز / پاکیزه' },
    { id: 'w0348', ko: '깨다', romaji: 'kkaeda', meaning: 'بیدار شدن' },
    { id: 'w0349', ko: '꺼내다', romaji: 'kkeonaeda', meaning: 'بیرون آوردن' },
    { id: 'w0350', ko: '껌', romaji: 'kkeom', meaning: 'آدامس' },
    { id: 'w0351', ko: '꽃다발', romaji: 'kkotdabal', meaning: 'دسته گل' },
    { id: 'w0352', ko: '꽃병', romaji: 'kkotbyeong', meaning: 'گلدان' },
    { id: 'w0353', ko: '꽃집', romaji: 'kkotjip', meaning: 'گل‌فروشی' },
    { id: 'w0354', ko: '꾸다', romaji: 'kkuda', meaning: 'خواب دیدن' },
    { id: 'w0355', ko: '꿈', romaji: 'kkum', meaning: 'رؤیا / خواب' },
    { id: 'w0356', ko: '끊다', romaji: 'kkeunta', meaning: 'قطع کردن / ترک کردن' },
    { id: 'w0357', ko: '끓다', romaji: 'kkeulta', meaning: 'جوشیدن' },
    { id: 'w0358', ko: '끓이다', romaji: 'kkeurida', meaning: 'جوشاندن' },
    { id: 'w0359', ko: '끝', romaji: 'kkeut', meaning: 'انتها / آخر' },
    { id: 'w0360', ko: '끝내다', romaji: 'kkeunnaeda', meaning: 'تموم کردن' },
    { id: 'w0361', ko: '끼다', romaji: 'kkida', meaning: 'گیر کردن / انداختن' },
    { id: 'w0362', ko: '나누다', romaji: 'nanuda', meaning: 'تقسیم کردن' },
    { id: 'w0363', ko: '나머지', romaji: 'nameoji', meaning: 'باقی‌مانده' },
    { id: 'w0364', ko: '나이', romaji: 'nai', meaning: 'سن' },
    { id: 'w0365', ko: '나타나다', romaji: 'natanada', meaning: 'ظاهر شدن' },
    { id: 'w0366', ko: '나흘', romaji: 'naheul', meaning: 'چهار روز' },
    { id: 'w0367', ko: '낚시', romaji: 'naksi', meaning: 'ماهیگیری' },
    { id: 'w0368', ko: '날다', romaji: 'nalda', meaning: 'پرواز کردن' },
    { id: 'w0369', ko: '날씬하다', romaji: 'nalssinhada', meaning: 'لاغر و خوش‌اندام بودن' },
    { id: 'w0370', ko: '남', romaji: 'nam', meaning: 'دیگران / غریبه' },
    { id: 'w0371', ko: '남기다', romaji: 'namgida', meaning: 'باقی گذاشتن' },
    { id: 'w0372', ko: '남녀', romaji: 'namnyeo', meaning: 'مرد و زن' },
    { id: 'w0373', ko: '남다', romaji: 'namda', meaning: 'باقی موندن' },
    { id: 'w0374', ko: '남성', romaji: 'namseong', meaning: 'مرد' },
    { id: 'w0375', ko: '남쪽', romaji: 'namjjok', meaning: 'جنوب' },
    { id: 'w0376', ko: '남학생', romaji: 'namhaksaeng', meaning: 'دانش‌آموز پسر' },
    { id: 'w0377', ko: '낫다', romaji: 'natda', meaning: 'خوب شدن / بهتر بودن' },
    { id: 'w0378', ko: '낮잠', romaji: 'natjam', meaning: 'چرت روزانه' },
    { id: 'w0379', ko: '내과', romaji: 'naegwa', meaning: 'پزشکی داخلی' },
    { id: 'w0380', ko: '내다', romaji: 'naeda', meaning: 'بیرون دادن / پرداخت کردن' },
    { id: 'w0381', ko: '내려가다', romaji: 'naeryeogada', meaning: 'پایین رفتن' },
    { id: 'w0382', ko: '내려오다', romaji: 'naeryeooda', meaning: 'پایین آمدن' },
    { id: 'w0383', ko: '내용', romaji: 'naeyong', meaning: 'محتوا' },
    { id: 'w0384', ko: '냄비', romaji: 'naembi', meaning: 'قابلمه' },
    { id: 'w0385', ko: '냄새', romaji: 'naemsae', meaning: 'بو' },
    { id: 'w0386', ko: '냉장고', romaji: 'naengjanggo', meaning: 'یخچال' },
    { id: 'w0387', ko: '너희', romaji: 'neohui', meaning: 'شما (دوستانه)' },
    { id: 'w0388', ko: '넘다', romaji: 'neomda', meaning: 'بیشتر شدن / رد شدن' },
    { id: 'w0389', ko: '넘어지다', romaji: 'neomeojida', meaning: 'افتادن' },
    { id: 'w0390', ko: '네', romaji: 'ne', meaning: 'شما (دوستانه)' },
    { id: 'w0391', ko: '넥타이', romaji: 'nektai', meaning: 'کراوات' },
    { id: 'w0392', ko: '넷째', romaji: 'netjjae', meaning: 'چهارمین' },
    { id: 'w0393', ko: '노란색', romaji: 'noransaek', meaning: 'رنگ زرد' },
    { id: 'w0394', ko: '노랗다', romaji: 'norata', meaning: 'زرد بودن' },
    { id: 'w0395', ko: '노력', romaji: 'noryeok', meaning: 'تلاش' },
    { id: 'w0396', ko: '노인', romaji: 'noin', meaning: 'سالمند' },
    { id: 'w0397', ko: '노트', romaji: 'noteu', meaning: 'دفتر یادداشت' },
    { id: 'w0398', ko: '녹색', romaji: 'noksaek', meaning: 'رنگ سبز' },
    { id: 'w0399', ko: '녹차', romaji: 'nokcha', meaning: 'چای سبز' },
    { id: 'w0400', ko: '놀라다', romaji: 'nollada', meaning: 'تعجب کردن' },
]
            },
            {
                id: 'topik3', level: 'TOPIK 3', korean: '3급', icon: 'fa-3',
                color: '#EF4444', iconBg: 'rgba(239,68,68,0.1)',
                words: [
                    { id: 'w0301', ko: '경험', romaji: 'gyeongheom', meaning: 'تجربه' },
                    { id: 'w0302', ko: '발전', romaji: 'baljeon', meaning: 'توسعه' },
                    { id: 'w0303', ko: '비교하다', romaji: 'bigyohada', meaning: 'مقایسه کردن' },
                    { id: 'w0304', ko: '설명하다', romaji: 'seolmyeonghada', meaning: 'توضیح دادن' },
                    { id: 'w0305', ko: '특별하다', romaji: 'teukbyeolhada', meaning: 'خاص بودن' }
                ]
            },
            {
                id: 'topik4', level: 'TOPIK 4', korean: '4급', icon: 'fa-4',
                color: '#7B2EDA', iconBg: 'rgba(123,46,218,0.1)',
                words: [
                    { id: 'w0401', ko: '연구', romaji: 'yeongu', meaning: 'تحقیق' },
                    { id: 'w0402', ko: '정책', romaji: 'jeongchaek', meaning: 'سیاست' },
                    { id: 'w0403', ko: '분석하다', romaji: 'bunseokhada', meaning: 'تحلیل کردن' }
                ]
            },
            {
                id: 'topik5', level: 'TOPIK 5', korean: '5급', icon: 'fa-5',
                color: '#DB2777', iconBg: 'rgba(219,39,119,0.1)',
                words: [
                    { id: 'w0501', ko: '철학', romaji: 'cheolhak', meaning: 'فلسفه' },
                    { id: 'w0502', ko: '심리학', romaji: 'simnihak', meaning: 'روانشناسی' }
                ]
            },
            {
                id: 'topik6', level: 'TOPIK 6', korean: '6급', icon: 'fa-6',
                color: '#D97706', iconBg: 'rgba(217,119,6,0.1)',
                words: [
                    { id: 'w0601', ko: '통찰력', romaji: 'tongchallyeok', meaning: 'بینش' },
                    { id: 'w0602', ko: '맥락', romaji: 'maengnak', meaning: 'بافت/زمینه' }
                ]
            }
        ];
    }

    // ========== RENDER ==========
    renderHeroProgress() {
        const container = document.getElementById('heroProgress');
        if (!container) return;
        const { done, total, percent } = this.getOverallProgress();
        const circ = 2 * Math.PI * 55;
        const offset = circ - (percent / 100) * circ;

        container.innerHTML = `
            <div class="progress-circle">
                <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle class="bg" cx="70" cy="70" r="55"/>
                    <circle class="fill" cx="70" cy="70" r="55"
                            stroke="#C4956A"
                            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"/>
                </svg>
                <span class="percent-text" style="color:#C4956A;">${percent}%</span>
            </div>
            <p class="progress-info-text">${done}/${total} کلمه یاد گرفته شده</p>
            <div class="progress-mini-bar"><div class="progress-mini-fill" style="width:${percent}%;"></div></div>
        `;
    }

    renderTabs() {
        const container = document.getElementById('courseTabs');
        if (!container) return;

        container.innerHTML = this.topikLevels.map(level => {
            const { total } = this.getLevelProgress(level);
            return `
                <button class="course-tab ${this.activeTab === level.id ? 'active' : ''}"
                        style="${this.activeTab === level.id ? `color:${level.color};border-bottom-color:${level.color};` : ''}"
                        onclick="window.vocabularyCourse.switchTab('${level.id}')">
                    <i class="fas ${level.icon}"></i> ${level.level}
                    <span style="font-size:0.7rem;opacity:0.7;">(${total})</span>
                </button>
            `;
        }).join('');
    }

    switchTab(tabId) {
        this.activeTab = tabId;
        this.renderTabs();
        this.renderContent();
    }

    renderContent() {
        const container = document.getElementById('vocabularyContent');
        if (!container) return;

        const level = this.topikLevels.find(l => l.id === this.activeTab);
        if (!level) return;

        const { done, total, percent } = this.getLevelProgress(level);

        container.innerHTML = `
            <div class="topik-level-section">
                <div class="topik-level-header">
                    <div class="topik-level-icon" style="background:${level.iconBg};color:${level.color};">
                        <i class="fas ${level.icon}"></i>
                    </div>
                    <div class="topik-level-info">
                        <span class="level-badge" style="background:${level.iconBg};color:${level.color};">${level.level}</span>
                        <span class="topik-level-korean">${level.korean}</span>
                        <div class="topik-level-title">واژگان ${level.level}</div>
                        <div class="topik-level-desc">${total} کلمه</div>
                    </div>
                    <div class="level-progress-wrap">
                        <span>${done}/${total}</span>
                        <div class="level-progress-bar">
                            <div class="level-progress-fill" style="width:${percent}%;background:${level.color};"></div>
                        </div>
                    </div>
                </div>
                <div class="words-grid">
                    ${level.words.map(w => this.renderWordCard(w, level.color)).join('')}
                </div>
            </div>
        `;
    }

    renderWordCard(word, color) {
        const learned = this.isWordLearned(word.id);
        return `
            <div class="word-card ${learned ? 'learned' : ''}">
                <div class="word-number" style="${learned ? 'background:#E8F5E9;color:#22C55E;' : `color:${color};`}">
                    ${learned ? '<i class="fas fa-check"></i>' : word.id.replace('w', '').replace(/^0+/, '')}
                </div>
                <div class="word-info">
                    <span class="word-korean">${word.ko}</span>
                    <span class="word-romaji">[${word.romaji}]</span>
                    <div class="word-meaning">${word.meaning}</div>
                </div>
                <div class="word-actions">
                    <button class="word-btn" title="تلفظ"><i class="fas fa-volume-up"></i></button>
                    <button class="word-btn ${learned ? 'learned-btn' : ''}" 
                            onclick="window.vocabularyCourse.toggleWord('${word.id}')"
                            title="${learned ? 'یاد گرفته شده' : 'یاد گرفتم'}">
                        <i class="fas fa-${learned ? 'check' : 'bookmark'}"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // ========== ACTIONS ==========
    toggleWord(wordId) {
        this.progress.words[wordId] = !this.progress.words[wordId];
        this.saveProgress();
        this.renderAll();
    }

    saveProgress() {
        const all = JSON.parse(localStorage.getItem('atlas_progress') || '{}');
        all['vocabulary'] = this.progress;
        localStorage.setItem('atlas_progress', JSON.stringify(all));
    }

    renderAll() {
        this.renderHeroProgress();
        this.renderContent();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.vocabularyCourse = new VocabularyCourse();
});