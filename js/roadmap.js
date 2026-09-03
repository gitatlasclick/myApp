// ==========================================
// ROADMAP - ATLAS KOREAN · نسخه کامل با تصاویر
// ==========================================

class RoadmapSection {
    constructor() {
        this.roadmapElement = document.getElementById('roadmap');
        this.paths = [];
        this.progress = {};
        this.basePath = this.getBasePath();
        this.init();
    }

    getBasePath() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html' || !path.includes('/pages/')) {
            return '';
        }
        if (path.includes('/pages/')) {
            return '../';
        }
        return '';
    }

    init() {
        this.loadPaths();
        this.loadProgress();
        this.render();
        this.setupIntersectionObserver();
        console.log('🗺️ Roadmap Ready | BasePath:', this.basePath);
    }

    loadPaths() {
        const b = this.basePath;
        
        this.paths = [
            // ==========================================
            // مسیر ۱: هانگول
            // ==========================================
            {
                id: 'hangul',
                cssClass: 'hangul',
                koreanTitle: '한글',
                faTitle: 'هانگول',
                icon: 'fa-font',
                iconBg: 'bg-pink-100 dark:bg-pink-900/30',
                iconColor: '#FF6B8A',
                gradient: 'from-pink-500 to-rose-400',
                color: '#FF6B8A',
                lessons: 12,
                desc: 'الفبای کره‌ای - ۴ یونیت',
                link: b + 'pages/hangul/index.html',
                isReady: true,
                type: 'main',
                badge: 'شروع',
                badgeColor: 'emerald'
            },
            
            // ==========================================
            // مسیر ۲: گرامر
            // ==========================================
            {
                id: 'grammar',
                cssClass: 'grammar',
                koreanTitle: '문법',
                faTitle: 'گرامر',
                icon: 'fa-book',
                iconBg: 'bg-purple-100 dark:bg-purple-900/30',
                iconColor: '#8B5CF6',
                gradient: 'from-purple-500 to-violet-400',
                color: '#8B5CF6',
                lessons: 205,
                desc: 'مبتدی ۱۱۲ + متوسط ۹۳ درس',
                link: b + 'pages/grammar/index.html',
                isReady: true,
                type: 'main',
                badge: 'پربازدید',
                badgeColor: 'purple'
            },
            
            // ==========================================
            // مسیر ۳: کالوکیشن
            // ==========================================
            {
                id: 'collocation',
                cssClass: 'collocation',
                koreanTitle: '연어',
                faTitle: 'کالوکیشن',
                icon: 'fa-link',
                iconBg: 'bg-blue-100 dark:bg-blue-900/30',
                iconColor: '#4A90D9',
                gradient: 'from-blue-500 to-sky-400',
                color: '#4A90D9',
                lessons: 18,
                desc: 'ترکیبات طبیعی کلمات',
                link: b + 'pages/collocation.html',
                isReady: true,
                type: 'main',
                badge: 'تخصصی',
                badgeColor: 'blue'
            },
            
            // ==========================================
            // مسیر ۴: مکالمه
            // ==========================================
            {
                id: 'speaking',
                cssClass: 'speaking',
                koreanTitle: '말하기',
                faTitle: 'مکالمه',
                icon: 'fa-comments',
                iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
                iconColor: '#5B8C5A',
                gradient: 'from-emerald-500 to-teal-400',
                color: '#5B8C5A',
                lessons: 15,
                desc: 'مهارت صحبت کردن - ۳ سطح',
                link: b + 'pages/speaking.html',
                isReady: true,
                type: 'main',
                badge: 'محبوب',
                badgeColor: 'emerald'
            },
            
            // ==========================================
            // مسیر ۵: واژگان
            // ==========================================
            {
                id: 'vocabulary',
                cssClass: 'vocabulary',
                koreanTitle: '어휘',
                faTitle: 'واژگان',
                icon: 'fa-book-open',
                iconBg: 'bg-amber-100 dark:bg-amber-900/30',
                iconColor: '#C4956A',
                gradient: 'from-amber-500 to-orange-400',
                color: '#C4956A',
                lessons: 6,
                desc: 'TOPIK 1-6 · ۱۰۰۰۰+ کلمه',
                link: b + 'pages/vocabulary/index.html',
                isReady: true,
                type: 'main',
                badge: 'جامع',
                badgeColor: 'amber'
            },
            
            // ==========================================
            // مسیر ۶: TOPIK 1-6 (دوره ویژه)
            // ==========================================
            {
                id: 'topik-course',
                cssClass: 'topik-course featured',
                koreanTitle: 'TOPIK 1-6',
                faTitle: 'دوره جامع TOPIK',
                icon: 'fa-graduation-cap',
                iconBg: 'bg-amber-100 dark:bg-amber-900/30',
                iconColor: '#F59E0B',
                gradient: 'from-amber-500 to-yellow-400',
                color: '#F59E0B',
                lessons: 60,
                desc: 'آموزش کامل سطوح ۱ تا ۶',
                link: b + 'pages/topik-course/index.html',
                isReady: true,
                type: 'featured',
                isFeatured: true,
                badge: 'ویژه ⭐',
                badgeColor: 'gold'
            },

            // ==========================================
            // ★★★ بخش جدید: سریال (K-Drama) ★★★
            // ==========================================
            {
                id: 'kdrama',
                cssClass: 'kdrama',
                koreanTitle: '한국 드라마',
                faTitle: 'سریال کرهای',
                icon: 'fa-film',
                iconBg: 'bg-red-100 dark:bg-red-900/30',
                iconColor: '#EF4444',
                gradient: 'from-red-500 to-rose-400',
                color: '#EF4444',
                lessons: 10,
                desc: 'یادگیری با سریال‌های محبوب',
                link: b + 'pages/kdrama/index.html',
                isReady: true,
                type: 'entertainment',
                badge: 'جذاب',
                badgeColor: 'red',
                image: 'https://picsum.photos/seed/kdrama/400/200'
            },
            
            // ==========================================
            // ★★★ بخش جدید: بی‌تی‌اس (BTS) ★★★
            // ==========================================
            {
                id: 'bts',
                cssClass: 'bts',
                koreanTitle: '방탄소년단',
                faTitle: 'بی‌تی‌اس (BTS)',
                icon: 'fa-music',
                iconBg: 'bg-purple-100 dark:bg-purple-900/30',
                iconColor: '#8B5CF6',
                gradient: 'from-purple-500 to-indigo-400',
                color: '#7C3AED',
                lessons: 10,
                desc: 'یادگیری با آهنگ‌های BTS',
                link: b + 'pages/bts/index.html',
                isReady: true,
                type: 'entertainment',
                badge: 'محبوب ❤️',
                badgeColor: 'purple',
                image: 'https://picsum.photos/seed/bts/400/200'
            },
            
            // ==========================================
            // ★★★ بخش جدید: موزیک کرهای (K-Pop) ★★★
            // ==========================================
            {
                id: 'kpop',
                cssClass: 'kpop',
                koreanTitle: 'K-Pop',
                faTitle: 'موزیک کرهای',
                icon: 'fa-headphones',
                iconBg: 'bg-pink-100 dark:bg-pink-900/30',
                iconColor: '#EC4899',
                gradient: 'from-pink-500 to-rose-400',
                color: '#EC4899',
                lessons: 10,
                desc: 'یادگیری با آهنگ‌های محبوب',
                link: b + 'pages/kpop/index.html',
                isReady: true,
                type: 'entertainment',
                badge: 'شاد 🎵',
                badgeColor: 'pink',
                image: 'https://picsum.photos/seed/kpop/400/200'
            },
            
            // ==========================================
            // ★★★ بخش جدید: پادکست ★★★
            // ==========================================
            {
                id: 'podcast',
                cssClass: 'podcast',
                koreanTitle: '팟캐스트',
                faTitle: 'پادکست',
                icon: 'fa-podcast',
                iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
                iconColor: '#6366F1',
                gradient: 'from-indigo-500 to-blue-400',
                color: '#6366F1',
                lessons: 10,
                desc: 'تقویت لیسنینگ با پادکست',
                link: b + 'pages/podcast/index.html',
                isReady: true,
                type: 'entertainment',
                badge: 'جدید 🎧',
                badgeColor: 'indigo',
                image: 'https://picsum.photos/seed/podcast/400/200'
            },
            
            // ==========================================
            // مسیر ۷: آمادگی TOPIK I
            // ==========================================
            {
                id: 'topik1',
                cssClass: 'topik1',
                koreanTitle: 'TOPIK I',
                faTitle: 'آمادگی TOPIK 1-2',
                icon: 'fa-award',
                iconBg: 'bg-cyan-100 dark:bg-cyan-900/30',
                iconColor: '#00D2FF',
                gradient: 'from-cyan-500 to-blue-400',
                color: '#00D2FF',
                lessons: 15,
                desc: 'آمادگی سطح مقدماتی',
                link: b + 'pages/topik1.html',
                isReady: false,
                comingSoon: true,
                type: 'prep',
                badge: 'به‌زودی',
                badgeColor: 'gray'
            },
            
            // ==========================================
            // مسیر ۸: آمادگی TOPIK II
            // ==========================================
            {
                id: 'topik2',
                cssClass: 'topik2',
                koreanTitle: 'TOPIK II',
                faTitle: 'آمادگی TOPIK 3-6',
                icon: 'fa-trophy',
                iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
                iconColor: '#D4A853',
                gradient: 'from-yellow-500 to-amber-400',
                color: '#D4A853',
                lessons: 20,
                desc: 'آمادگی سطح پیشرفته',
                link: b + 'pages/topik2.html',
                isReady: false,
                comingSoon: true,
                type: 'prep',
                badge: 'به‌زودی',
                badgeColor: 'gray'
            }
        ];
    }

    loadProgress() {
        const saved = localStorage.getItem('atlas_progress');
        if (saved) {
            try { 
                this.progress = JSON.parse(saved); 
            } catch(e) { 
                this.progress = {}; 
            }
        }
        
        this.paths.forEach(path => {
            if (!this.progress[path.id]) {
                this.progress[path.id] = { completed: 0, total: path.lessons || 1 };
            }
        });
    }

    getPercent(id) {
        const p = this.progress[id];
        if (!p || p.total === 0) return 0;
        return Math.round((p.completed / p.total) * 100) || 0;
    }

    getCompleted(id) {
        return this.progress[id]?.completed || 0;
    }

    render() {
        if (!this.roadmapElement) return;

        const mainPaths = this.paths.filter(p => p.type === 'main');
        const featuredPaths = this.paths.filter(p => p.type === 'featured');
        const entertainmentPaths = this.paths.filter(p => p.type === 'entertainment');
        const prepPaths = this.paths.filter(p => p.type === 'prep');

        this.roadmapElement.innerHTML = `
            <div class="roadmap-container">
                
                <!-- ===== Header ===== -->
                <div class="roadmap-header">
                    <div class="header-badge">
                        <i class="fas fa-map-signs"></i>
                        مسیر یادگیری
                    </div>
                    <h2 class="header-title">
                        <span class="title-gradient">نقشه راه</span> 
                        یادگیری کرهای
                    </h2>
                    <p class="header-subtitle">
                        از پایه شروع کن، با TOPIK حرفه‌ای شو یا با سرگرمی یاد بگیر!
                    </p>
                </div>

                <!-- ===== بخش: مسیرهای اصلی ===== -->
                <div class="section-label">
                    <span class="section-line"></span>
                    <span class="section-text">📚 مسیرهای آموزشی</span>
                    <span class="section-line"></span>
                </div>

                <div class="roadmap-grid">
                    ${mainPaths.map((path, index) => this.renderCard(path, index)).join('')}
                </div>

                <!-- ===== بخش: دوره ویژه ===== -->
                ${featuredPaths.length > 0 ? `
                    <div class="section-label featured-label">
                        <span class="section-line gold"></span>
                        <span class="section-text featured-text">
                            <i class="fas fa-star" style="color:#F59E0B;"></i>
                            دوره جامع TOPIK
                            <i class="fas fa-star" style="color:#F59E0B;"></i>
                        </span>
                        <span class="section-line gold"></span>
                    </div>
                    <div class="roadmap-grid featured-grid">
                        ${featuredPaths.map((path, index) => this.renderFeaturedCard(path, index)).join('')}
                    </div>
                ` : ''}

                <!-- ===== ★★★ بخش سرگرمی و فرهنگ ★★★ ===== -->
                <div class="section-label entertainment-label">
                    <span class="section-line entertainment-line"></span>
                    <span class="section-text entertainment-text">
                        <i class="fas fa-heart" style="color:#EF4444;"></i>
                        با سرگرمی کرهای یاد بگیر!
                        <i class="fas fa-heart" style="color:#EF4444;"></i>
                    </span>
                    <span class="section-line entertainment-line"></span>
                </div>

                <div class="roadmap-grid entertainment-grid">
                    ${entertainmentPaths.map((path, index) => this.renderEntertainmentCard(path, index)).join('')}
                </div>

                <!-- ===== بخش: به زودی ===== -->
                ${prepPaths.length > 0 ? `
                    <div class="section-label">
                        <span class="section-line"></span>
                        <span class="section-text" style="opacity:0.6;">
                            <i class="fas fa-hourglass-half"></i>
                            در دست توسعه
                        </span>
                        <span class="section-line"></span>
                    </div>
                    <div class="roadmap-grid">
                        ${prepPaths.map((path, index) => this.renderCard(path, index + 10)).join('')}
                    </div>
                ` : ''}

            </div>
        `;
    }

    // ==========================================
    // رندر کارت معمولی
    // ==========================================
    renderCard(path, index) {
        const percent = this.getPercent(path.id);
        const completed = this.getCompleted(path.id);
        const total = path.lessons;
        const delay = index * 80;

        if (!path.isReady) {
            return `
                <div class="path-card coming-soon" style="animation-delay: ${delay}ms">
                    <div class="card-glow" style="background: ${path.color}33;"></div>
                    <div class="card-inner">
                        <div class="card-top">
                            <div class="card-icon ${path.iconBg}" style="opacity:0.4;">
                                <i class="fas ${path.icon}" style="color:${path.color};"></i>
                            </div>
                            <div class="card-info">
                                <div class="card-title-kr">${path.koreanTitle}</div>
                                <div class="card-title-fa">${path.faTitle}</div>
                                <div class="card-desc">${path.desc} · ${total} درس</div>
                            </div>
                        </div>
                        <div class="card-progress">
                            <div class="progress-bar" style="opacity:0.3;">
                                <div class="progress-fill" style="width:0%;background:${path.color};"></div>
                            </div>
                            <div class="card-actions">
                                <span class="badge-coming">${path.badge || 'به‌زودی'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        const btnClass = completed > 0 ? 'btn-continue' : 'btn-start';
        const btnText = completed > 0 ? 'ادامه مسیر' : 'شروع کن';
        const btnIcon = completed > 0 ? 'fa-arrow-right' : 'fa-rocket';

        return `
            <div class="path-card" style="animation-delay: ${delay}ms">
                <div class="card-glow" style="background: ${path.color}22;"></div>
                
                ${path.badge ? `
                    <span class="card-badge badge-${path.badgeColor}">
                        ${path.badge}
                    </span>
                ` : ''}

                <div class="card-inner">
                    <div class="card-top">
                        <a href="${path.link}" class="card-icon ${path.iconBg}">
                            <i class="fas ${path.icon}" style="color:${path.iconColor};"></i>
                        </a>
                        <div class="card-info">
                            <a href="${path.link}" class="card-title-link">
                                <div class="card-title-kr">${path.koreanTitle}</div>
                                <div class="card-title-fa">${path.faTitle}</div>
                            </a>
                            <div class="card-desc">${path.desc} · ${total} درس</div>
                        </div>
                    </div>

                    <div class="card-progress">
                        <div class="progress-info">
                            <span class="progress-count">
                                <i class="fas fa-check-circle" style="color:${completed > 0 ? '#22C55E' : 'var(--text-muted)'};"></i>
                                ${completed}/${total} تکمیل
                            </span>
                            <span class="progress-percent" style="color:${path.color};">${percent}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width:${percent}%;background:${path.color};"></div>
                        </div>
                        <a href="${path.link}" class="card-btn ${btnClass}">
                            <i class="fas ${btnIcon}"></i>
                            ${btnText}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    // ==========================================
    // ★★★ رندر کارت سرگرمی (با عکس واقعی) ★★★
    // ==========================================
    renderEntertainmentCard(path, index) {
        const delay = index * 80 + 100;
        const total = path.lessons || 1;
        const completed = this.getCompleted(path.id);
        const percent = this.getPercent(path.id);

        // تصاویر واقعی برای هر بخش
        const imageUrl = path.image || 'https://picsum.photos/seed/default/400/200';

        // ایموجی‌ها به عنوان fallback
        const emojis = {
            kdrama: '🎬',
            bts: '💜',
            kpop: '🎵',
            podcast: '🎧'
        };
        const fallbackEmoji = emojis[path.id] || '🎯';

        return `
            <div class="entertainment-card ${path.cssClass}" style="animation-delay: ${delay}ms">
                <div class="ent-card-glow" style="background: ${path.color}22;"></div>
                
                ${path.badge ? `
                    <span class="ent-badge badge-${path.badgeColor}">
                        ${path.badge}
                    </span>
                ` : ''}

                <!-- ===== تصویر کارت ===== -->
                <div class="ent-card-image">
                    <img 
                        src="${imageUrl}" 
                        alt="${path.faTitle}" 
                        class="ent-card-img"
                        loading="lazy"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    />
                    <div class="ent-image-fallback" style="display:none;">
                        <span class="ent-image-emoji">${fallbackEmoji}</span>
                    </div>
                    <div class="ent-image-overlay">
                        <div class="ent-image-label">${path.koreanTitle}</div>
                    </div>
                </div>

                <div class="ent-card-body">
                    <div class="ent-card-top">
                        <div class="ent-icon-wrap ${path.iconBg}">
                            <i class="fas ${path.icon}" style="color:${path.iconColor};"></i>
                        </div>
                        <div class="ent-info">
                            <div class="ent-title-kr">${path.koreanTitle}</div>
                            <div class="ent-title-fa">${path.faTitle}</div>
                        </div>
                    </div>
                    
                    <p class="ent-desc">${path.desc}</p>

                    <div class="ent-progress">
                        <div class="ent-progress-bar">
                            <div class="ent-progress-fill" style="width:${percent}%;background:${path.color};"></div>
                        </div>
                        <div class="ent-progress-info">
                            <span class="ent-progress-text">
                                <i class="fas fa-check-circle" style="color:${completed > 0 ? '#22C55E' : 'var(--text-muted)'};"></i>
                                ${completed}/${total} تکمیل
                            </span>
                            <span class="ent-progress-percent" style="color:${path.color};">${percent}%</span>
                        </div>
                    </div>

                    <a href="${path.link}" class="ent-btn" style="background:${path.color};">
                        <i class="fas fa-play-circle"></i>
                        شروع یادگیری با ${path.faTitle}
                        <i class="fas fa-arrow-left"></i>
                    </a>
                </div>
            </div>
        `;
    }

    // ==========================================
    // رندر کارت ویژه TOPIK
    // ==========================================
    renderFeaturedCard(path, index) {
        const percent = this.getPercent(path.id);
        const completed = this.getCompleted(path.id);
        const total = path.lessons;
        const delay = index * 80 + 200;

        return `
            <div class="path-card featured-card" style="animation-delay: ${delay}ms">
                <div class="featured-glow"></div>
                
                <span class="featured-badge">
                    <i class="fas fa-crown"></i>
                    دوره اصلی
                </span>

                <div class="featured-top">
                    <div class="featured-icon-wrap">
                        <i class="fas ${path.icon}"></i>
                    </div>
                    <div class="featured-titles">
                        <div class="featured-title-kr">${path.koreanTitle}</div>
                        <div class="featured-title-fa">${path.faTitle}</div>
                    </div>
                </div>

                <div class="featured-body">
                    <div class="featured-meta">
                        <span class="featured-desc">
                            <i class="fas fa-book-open"></i>
                            ${path.desc} · <strong>${total}</strong> درس
                        </span>
                        <span class="featured-level">
                            <i class="fas fa-layer-group"></i>
                            سطوح ۱ تا ۶
                        </span>
                    </div>

                    <div class="featured-progress">
                        <div class="featured-progress-info">
                            <span>
                                <i class="fas fa-check-circle" style="color:${completed > 0 ? '#22C55E' : 'var(--text-muted)'};"></i>
                                ${completed}/${total} درس تکمیل شده
                            </span>
                            <span class="featured-percent">${percent}%</span>
                        </div>
                        <div class="featured-progress-bar">
                            <div class="featured-progress-fill" style="width:${percent}%;"></div>
                        </div>
                    </div>

                    <a href="${path.link}" class="featured-btn">
                        <span>${completed > 0 ? 'ادامه مسیر TOPIK' : 'شروع دوره TOPIK'}</span>
                        <i class="fas fa-arrow-left"></i>
                    </a>
                </div>
            </div>
        `;
    }

    // ==========================================
    // انیمیشن ورود
    // ==========================================
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 80);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        document.querySelectorAll('.path-card, .featured-card, .entertainment-card').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.06}s`;
            observer.observe(el);
        });

        const style = document.createElement('style');
        style.textContent = `
            .path-card.visible,
            .featured-card.visible,
            .entertainment-card.visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }

    updateProgress(pathId, completedCount) {
        if (this.progress[pathId]) {
            this.progress[pathId].completed = completedCount;
            const all = JSON.parse(localStorage.getItem('atlas_progress') || '{}');
            all[pathId] = this.progress[pathId];
            localStorage.setItem('atlas_progress', JSON.stringify(all));
            this.render();
            this.setupIntersectionObserver();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.roadmapSection = new RoadmapSection();
});