// ==========================================
// HERO SECTION - CHERRY BLOSSOM DREAM
// با پالت رنگی گلوبال و انیمیشن‌های لوکس
// ==========================================

class HeroSection {
    constructor() {
        this.heroElement = document.getElementById('hero');
        this.init();
    }

    init() {
        this.render();
        this.initCounters();
        this.initTypewriter();
        this.setupCardClickHandlers();
        this.initParallax();
        console.log('🌟 Hero Ready!');
    }

    render() {
        this.heroElement.innerHTML = `
            <!-- Video/Image Background -->
            <div class="hero-background">
                <video autoplay muted loop playsinline id="heroVideo">
                    <source src="/img/korea-bg.mp4" type="video/mp4">
                    <img src="/img/korea-bg.jpg" alt="کره جنوبی">
                </video>
                <div class="hero-overlay"></div>
            </div>

            <!-- Cherry Blossom Canvas -->
            <canvas id="cherryCanvas"></canvas>

            <!-- Floating Korean Characters -->
            <div class="floating-chars">
                <span class="float-char">🌸</span>
                <span class="float-char">한</span>
                <span class="float-char">글</span>
                <span class="float-char">사</span>
                <span class="float-char">랑</span>
                <span class="float-char">🌸</span>
            </div>

            <!-- Main Content -->
            <div class="hero-content">
                
                <!-- Left Column -->
                <div class="hero-text-col">
                    
                    <div class="hero-badge">
                        <span class="hero-badge-dot"></span>
                        <i class="fas fa-graduation-cap"></i>
                        یادگیری تعاملی کره‌ای با AI
                        <i class="fas fa-robot" style="font-size:0.8rem;"></i>
                    </div>

                    <h1 class="hero-title">
                        <!-- متن کرهای با جهت LTR -->
                        <span class="korean-phrase" id="dynamicKorean" style="direction: ltr; display: block; text-align: right;">
                            🌸 한국어를 배우자!
                        </span>
                        <span class="fa-phrase" id="dynamicPersian">
                            کره‌ای رو 
                            <span class="highlight" id="dynamicHighlight">رویایی</span> 
                            یاد بگیر
                            <span class="heart-beat">❤️</span>
                        </span>
                    </h1>

                    <p class="hero-desc">
                        <span class="highlight">아틀라스 한글</span> پلتفرم جامع آموزش زبان کره‌ای.
                        از <span class="highlight">هانگول</span> شروع کن، 
                        <span class="highlight">گرامر</span> و <span class="highlight">مکالمه</span> رو قورت بده،
                        و برای <span class="highlight">TOPIK</span> آماده شو.
                        <br><br>
                        <span style="color: var(--text-muted); font-size: 0.9rem;">
                            🌸 با شکوفه‌های گیلاسی، هر روز یک قدم به کرهای نزدیک‌تر شو
                        </span>
                    </p>

                    <div class="hero-stats">
                        <div class="hero-stat">
                            <span class="hero-stat-number counter" data-target="8">0</span>
                            <span class="hero-stat-label"><i class="fas fa-road"></i> مسیر</span>
                        </div>
                        <div class="hero-stat">
                            <span class="hero-stat-number counter" data-target="235">0</span>
                            <span class="hero-stat-label"><i class="fas fa-book"></i> درس</span>
                        </div>
                        <div class="hero-stat">
                            <span class="hero-stat-number counter" data-target="1500">0</span>
                            <span class="hero-stat-label"><i class="fas fa-question-circle"></i> کوییز</span>
                        </div>
                        <div class="hero-stat">
                            <span class="hero-stat-number counter" data-target="99">0</span>
                            <span class="hero-stat-label"><i class="fas fa-star"></i> ٪ رضایت</span>
                        </div>
                    </div>

                    <div class="hero-cta-group">
                        <a href="#roadmap" class="hero-cta-primary">
                            <i class="fas fa-rocket"></i> شروع یادگیری <i class="fas fa-arrow-left"></i>
                        </a>
                        <a href="/placement-test/" class="hero-cta-secondary">
                            <i class="fas fa-clipboard-list"></i> آزمون تعیین سطح
                        </a>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="hero-visual-col">
                    <div class="hero-card">
                        <div class="hero-card-header">
                            <span class="hero-card-dot"></span>
                            <span class="hero-card-dot"></span>
                            <span class="hero-card-dot"></span>
                            <span class="hero-card-title">✨ امروز یاد می‌گیری...</span>
                        </div>

                        <div class="hero-card-lesson" data-lesson="hangul">
                            <div class="hero-card-lesson-icon">
                                <i class="fas fa-font"></i>
                            </div>
                            <div class="hero-card-lesson-info">
                                <h4>🌸 حروف صدادار ساده</h4>
                                <span>📖 درس ۱ از هانگول</span>
                            </div>
                        </div>

                        <div class="hero-card-lesson" data-lesson="speaking">
                            <div class="hero-card-lesson-icon gold">
                                <i class="fas fa-comments"></i>
                            </div>
                            <div class="hero-card-lesson-info">
                                <h4>💬 معرفی خود به کره‌ای</h4>
                                <span>درس ۱ از مکالمه</span>
                            </div>
                        </div>

                        <div class="hero-card-lesson" data-lesson="topik">
                            <div class="hero-card-lesson-icon blue">
                                <i class="fas fa-trophy"></i>
                            </div>
                            <div class="hero-card-lesson-info">
                                <h4>🎯 نمونه سوالات TOPIK I</h4>
                                <span>شبیه‌ساز آزمون</span>
                            </div>
                        </div>

                        <div class="hero-card-progress">
                            <div class="hero-card-progress-bar">
                                <div class="hero-card-progress-fill" style="width:0%;" id="heroProgressFill"></div>
                            </div>
                            <div class="hero-card-progress-text">
                                <span id="heroProgressText">0% تکمیل شده</span>
                                <span style="float:left;" id="heroProgressNext">🔥 ادامه بده!</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Wave -->
            <div class="hero-wave">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
                </svg>
            </div>

            <a href="#roadmap" class="scroll-indicator">
                <span>اسکرول کن</span>
                <i class="fas fa-chevron-down"></i>
            </a>
        `;

        setTimeout(() => {
            const fill = document.getElementById('heroProgressFill');
            if (fill) fill.style.width = '32%';
            document.getElementById('heroProgressText').textContent = '۳۲٪ تکمیل شده';
            document.getElementById('heroProgressNext').innerHTML = '🎯 هانگول رو تموم کن!';
        }, 500);

        setTimeout(() => {
            if (typeof CherryBlossom !== 'undefined' && document.getElementById('cherryCanvas')) {
                window.cherryBlossom = new CherryBlossom();
            }
        }, 500);
    }

    // ==========================================
    // TYPEWRITER EFFECT - نسخه لوکس
    // ==========================================

    initTypewriter() {
        const koreanEl = document.getElementById('dynamicKorean');
        const persianEl = document.getElementById('dynamicPersian');
        const highlightEl = document.getElementById('dynamicHighlight');

        // ===== 1. متن کرهای با تایپ =====
        if (koreanEl) {
            const phrases = [
                '🌸 한국어를 배우자!',
                '🌸 함께 공부해요!',
                '🌸 열심히 하자!',
                '🌸 대한민국 화이팅!'
            ];
            let phraseIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let speed = 120;

            function typeKorean() {
                const currentPhrase = phrases[phraseIndex];
                
                if (!isDeleting) {
                    koreanEl.textContent = currentPhrase.slice(0, charIndex + 1);
                    // اضافه کردن کرسر
                    if (charIndex < currentPhrase.length) {
                        koreanEl.innerHTML += '<span class="typewriter-cursor"></span>';
                    }
                    charIndex++;
                    
                    if (charIndex === currentPhrase.length) {
                        isDeleting = true;
                        speed = 2000;
                    } else {
                        speed = 100 + Math.random() * 60;
                    }
                } else {
                    koreanEl.textContent = currentPhrase.slice(0, charIndex);
                    if (charIndex > 0) {
                        koreanEl.innerHTML += '<span class="typewriter-cursor"></span>';
                    }
                    charIndex--;
                    
                    if (charIndex === 0) {
                        isDeleting = false;
                        phraseIndex = (phraseIndex + 1) % phrases.length;
                        speed = 500;
                    } else {
                        speed = 50 + Math.random() * 40;
                    }
                }

                setTimeout(typeKorean, speed);
            }

            setTimeout(typeKorean, 500);
        }

        // ===== 2. متن فارسی با تایپ =====
        if (persianEl) {
            const phrases = [
                'کره‌ای رو رویایی یاد بگیر ❤️',
                'کره‌ای رو آسان یاد بگیر 🎯',
                'کره‌ای رو لذت‌بخش یاد بگیر 🌸',
                'کره‌ای رو شیرین یاد بگیر 🍯',
                'کره‌ای رو جذاب یاد بگیر ✨'
            ];
            let phraseIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let speed = 100;

            function typePersian() {
                const currentPhrase = phrases[phraseIndex];
                
                if (!isDeleting) {
                    persianEl.innerHTML = currentPhrase.slice(0, charIndex + 1) + '<span class="cursor-blink"></span>';
                    charIndex++;
                    
                    if (charIndex === currentPhrase.length) {
                        isDeleting = true;
                        speed = 2500;
                    } else {
                        speed = 80 + Math.random() * 50;
                    }
                } else {
                    persianEl.innerHTML = currentPhrase.slice(0, charIndex) + '<span class="cursor-blink"></span>';
                    charIndex--;
                    
                    if (charIndex === 0) {
                        isDeleting = false;
                        phraseIndex = (phraseIndex + 1) % phrases.length;
                        speed = 400;
                    } else {
                        speed = 40 + Math.random() * 30;
                    }
                }

                setTimeout(typePersian, speed);
            }

            setTimeout(typePersian, 1200);
        }

        // ===== 3. تغییر کلمه هایلایت =====
        if (highlightEl) {
            const highlights = ['رویایی', 'آسان', 'لذت‌بخش', 'شیرین', 'جذاب'];
            let index = 0;
            
            setInterval(() => {
                index = (index + 1) % highlights.length;
                highlightEl.style.opacity = '0';
                highlightEl.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    highlightEl.textContent = highlights[index];
                    highlightEl.style.opacity = '1';
                    highlightEl.style.transform = 'scale(1)';
                }, 300);
            }, 3000);
        }
    }

    // ==========================================
    // PARALLAX
    // ==========================================

    initParallax() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const video = document.querySelector('.hero-background video');
            const overlay = document.querySelector('.hero-overlay');
            
            if (video && scrolled < window.innerHeight) {
                video.style.transform = `translateY(${scrolled * 0.3}px) scale(1.02)`;
            }
            if (overlay) {
                overlay.style.opacity = 1 - (scrolled / (window.innerHeight * 0.5));
            }
        }, { passive: true });
    }

    // ==========================================
    // CARD CLICK HANDLERS
    // ==========================================

    setupCardClickHandlers() {
        document.querySelectorAll('.hero-card-lesson').forEach(card => {
            card.addEventListener('click', () => {
                const lesson = card.dataset.lesson;
                const paths = {
                    hangul: '/hangul/',
                    speaking: '/speaking/',
                    topik: '/topik/'
                };
                if (paths[lesson]) window.location.href = paths[lesson];
            });
        });
    }

    // ==========================================
    // COUNTERS
    // ==========================================

    initCounters() {
        const counters = document.querySelectorAll('.counter');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    this.animateCounter(entry.target, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        counters.forEach(c => observer.observe(c));
    }

    animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            element.textContent = Math.floor(easeOut * target);
            if (progress < 1) requestAnimationFrame(update);
            else element.textContent = target;
        };
        requestAnimationFrame(update);
    }
}

// ==========================================
// CHERRY BLOSSOM CLASS
// ==========================================

class CherryBlossom {
    constructor() {
        this.canvas = document.getElementById('cherryCanvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.petals = [];
        this.petalCount = 85;
        this.wind = 0;
        this.init();
    }

    init() {
        this.resize();
        this.createPetals();
        this.animate();
        this.setupEvents();
        console.log('🌸 Cherry Blossom started!');
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width || window.innerWidth;
        this.canvas.height = rect.height || window.innerHeight;
    }

    createPetals() {
        for (let i = 0; i < this.petalCount; i++) {
            this.petals.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                size: 8 + Math.random() * 16,
                speed: 0.4 + Math.random() * 1.0,
                rotation: Math.random() * 360,
                rotationSpeed: 0.4 + Math.random() * 1.2,
                sway: Math.random() * 25,
                swaySpeed: 0.3 + Math.random() * 0.7,
                opacity: 0.6 + Math.random() * 0.4,
                color: this.getColor(),
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    getColor() {
        const colors = [
            'rgba(255, 182, 193, ',
            'rgba(255, 192, 203, ',
            'rgba(255, 205, 210, ',
            'rgba(255, 218, 220, ',
            'rgba(255, 228, 225, ',
            'rgba(255, 240, 235, ',
            'rgba(255, 200, 200, '
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    drawPetal(petal) {
        const ctx = this.ctx;
        const x = petal.x;
        const y = petal.y;
        const size = petal.size;
        const rotation = petal.rotation;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation * Math.PI / 180);
        ctx.globalAlpha = petal.opacity;

        // شکل شکوفه گیلاس
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(size * 0.6, -size * 0.7, size * 0.9, -size * 0.2, 0, size * 0.25);
        ctx.bezierCurveTo(-size * 0.9, -size * 0.2, -size * 0.6, -size * 0.7, 0, 0);
        ctx.closePath();

        // رنگ شکوفه با گرادیان
        const gradient = ctx.createRadialGradient(-2, -4, 0, 0, 0, size);
        gradient.addColorStop(0, petal.color + '1)');
        gradient.addColorStop(0.5, petal.color + '0.9)');
        gradient.addColorStop(1, petal.color + '0.5)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // خطوط ظریف روی گلبرگ
        ctx.globalAlpha = petal.opacity * 0.2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 0.5;
        for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 2, -size * 0.1);
            ctx.lineTo(i * 4, size * 0.15);
            ctx.stroke();
        }

        ctx.restore();
    }

    updatePetal(petal) {
        petal.y += petal.speed;

        const swayAmount = Math.sin(petal.y * 0.02 + petal.phase + this.wind) * 0.3;
        petal.x += swayAmount;
        petal.x += Math.sin(petal.y * 0.01 + petal.swaySpeed + petal.phase) * 0.4;

        petal.rotation += petal.rotationSpeed * 0.4;

        if (petal.y > this.canvas.height + 50) {
            petal.y = -50;
            petal.x = Math.random() * this.canvas.width;
            petal.size = 8 + Math.random() * 16;
            petal.speed = 0.4 + Math.random() * 1.0;
            petal.opacity = 0.6 + Math.random() * 0.4;
            petal.phase = Math.random() * Math.PI * 2;
        }

        if (petal.x > this.canvas.width + 20) petal.x = -20;
        if (petal.x < -20) petal.x = this.canvas.width + 20;
    }

    animate() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.wind += 0.004;
        this.petals.sort((a, b) => a.size - b.size);

        for (const petal of this.petals) {
            this.updatePetal(petal);
            this.drawPetal(petal);
        }

        requestAnimationFrame(() => this.animate());
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.resize();
        });
    }
}

// ==========================================
// INIT - راه‌اندازی اصلی
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('hero')) {
        window.heroSection = new HeroSection();
    }
});