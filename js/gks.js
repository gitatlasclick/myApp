// ==========================================
// GKS SECTION - ATLAS KOREAN
// ==========================================

class GKSSection {
    constructor() {
        this.gksElement = document.getElementById('gks');
        const target = new Date();
        target.setDate(target.getDate() + 20);
        this.countdownTarget = target.getTime();
        this.init();
    }

    init() {
        this.render();
        this.startCountdown();
        this.setupObserver();
        console.log('🛂 GKS Ready!');
    }

    render() {
        if (!this.gksElement) return;

        this.gksElement.innerHTML = `
            <div class="gks-container">
                <!-- HEADER -->
                <div class="gks-header">
                    <div class="gks-header-badge">
                        <i class="fas fa-passport"></i> Global Korea Scholarship
                    </div>
                    <h2 class="gks-title">بورسیه <span class="highlight">GKS 2027</span></h2>
                    <p class="gks-subtitle">فرصت طلایی تحصیل رایگان در کره جنوبی</p>
                </div>

                <!-- COUNTDOWN -->
                <div class="gks-countdown">
                    <div class="countdown-item">
                        <span class="countdown-number" id="countdownDays">--</span>
                        <span class="countdown-label">روز</span>
                    </div>
                    <span class="countdown-separator">:</span>
                    <div class="countdown-item">
                        <span class="countdown-number" id="countdownHours">--</span>
                        <span class="countdown-label">ساعت</span>
                    </div>
                    <span class="countdown-separator">:</span>
                    <div class="countdown-item">
                        <span class="countdown-number" id="countdownMinutes">--</span>
                        <span class="countdown-label">دقیقه</span>
                    </div>
                    <span class="countdown-separator">:</span>
                    <div class="countdown-item">
                        <span class="countdown-number" id="countdownSeconds">--</span>
                        <span class="countdown-label">ثانیه</span>
                    </div>
                </div>
                <p class="countdown-hint">⏳ تا شروع ثبت‌نام GKS</p>

                <!-- STATS -->
                <div class="gks-stats">
                    <div class="gks-stat"><div class="gks-stat-number">۲,۰۰۰+</div><div class="gks-stat-label">بورسیه سالانه</div></div>
                    <div class="gks-stat"><div class="gks-stat-number">۱۵۵+</div><div class="gks-stat-label">کشور</div></div>
                    <div class="gks-stat"><div class="gks-stat-number">۱۰۰٪</div><div class="gks-stat-label">پوشش شهریه</div></div>
                    <div class="gks-stat"><div class="gks-stat-number">~۹۰۰₩</div><div class="gks-stat-label">کمک هزینه ماهانه</div></div>
                </div>

                <!-- CARDS -->
                <div class="gks-grid">

                    <!-- 1: درباره GKS -->
                    <div class="gks-card">
                        <div class="gks-card-image">
                            <img src="https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600&h=180&fit=crop&crop=center" alt="کره جنوبی" class="gks-card-img">
                            <div class="gks-image-overlay"><span class="gks-image-label">🇰🇷 کره جنوبی</span></div>
                        </div>
                        <div class="gks-card-body">
                            <div class="gks-card-icon" style="background:rgba(124,58,237,0.12);color:#7C3AED;"><i class="fas fa-info-circle"></i></div>
                            <h3 class="gks-card-title">درباره GKS</h3>
                            <p class="gks-card-desc">بورسیه دولتی کره جنوبی توسط NIIED. از ۱۹۶۷ میزبان دانشجویان بین‌المللی در مقاطع کارشناسی، ارشد، دکتری و تحقیقاتی.</p>
                            <div class="gks-tags"><span class="gks-tag">NIIED</span><span class="gks-tag">از ۱۹۶۷</span></div>
                        </div>
                    </div>

                    <!-- 2: پوشش مالی -->
                    <div class="gks-card">
                        <div class="gks-card-image">
                            <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=180&fit=crop&crop=center" alt="پول" class="gks-card-img">
                            <div class="gks-image-overlay"><span class="gks-image-label">💰 پوشش کامل</span></div>
                        </div>
                        <div class="gks-card-body">
                            <div class="gks-card-icon" style="background:rgba(245,158,11,0.12);color:#F59E0B;"><i class="fas fa-wallet"></i></div>
                            <h3 class="gks-card-title">پوشش مالی کامل</h3>
                            <p class="gks-card-desc">شهریه کامل + کمک هزینه ~۹۰۰,۰۰۰ وون + بلیط رفت‌وبرگشت + بیمه درمانی + هزینه استقرار + یک سال آموزش زبان.</p>
                            <div class="gks-tags"><span class="gks-tag gold">شهریه رایگان</span><span class="gks-tag gold">کمک هزینه</span></div>
                        </div>
                    </div>

                    <!-- 3: دو مسیر اپلای -->
                    <div class="gks-card">
                        <div class="gks-card-image">
                            <img src="https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=600&h=180&fit=crop&crop=center" alt="مسیر" class="gks-card-img">
                            <div class="gks-image-overlay"><span class="gks-image-label">🛤️ دو مسیر</span></div>
                        </div>
                        <div class="gks-card-body">
                            <div class="gks-card-icon" style="background:rgba(6,182,212,0.12);color:#06B6D4;"><i class="fas fa-route"></i></div>
                            <h3 class="gks-card-title">دو مسیر اپلای</h3>
                            <p class="gks-card-desc"><strong>مسیر سفارت:</strong> از طریق سفارت کره (۳ دانشگاه) .<br><strong>مسیر دانشگاه:</strong> مستقیم به یک دانشگاه کره‌ای.</p>
                            <div class="gks-tags"><span class="gks-tag cyan">سفارت</span><span class="gks-tag cyan">دانشگاه</span></div>
                        </div>
                    </div>

                    <!-- 4: شرایط -->
                    <div class="gks-card">
                        <div class="gks-card-image">
                            <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=180&fit=crop&crop=center" alt="مدارک" class="gks-card-img">
                            <div class="gks-image-overlay"><span class="gks-image-label">📋 شرایط</span></div>
                        </div>
                        <div class="gks-card-body">
                            <div class="gks-card-icon" style="background:rgba(34,197,94,0.12);color:#22C55E;"><i class="fas fa-check-circle"></i></div>
                            <h3 class="gks-card-title">شرایط و مدارک</h3>
                            <p class="gks-card-desc">معدل حداقل ۸۰٪ یا ۲۰٪ برتر کلاس. نیازی به مدرک زبان برای شروع نیست (دوره زبان اجباری است).</p>
                            <div class="gks-tags"><span class="gks-tag green">معدل ۸۰٪</span><span class="gks-tag green">بدون زبان</span></div>
                        </div>
                    </div>

                    <!-- 5: تایم‌لاین -->
                    <div class="gks-card">
                        <div class="gks-card-image">
                            <img src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=600&h=180&fit=crop&crop=center" alt="تقویم" class="gks-card-img">
                            <div class="gks-image-overlay"><span class="gks-image-label">📅 تایم‌لاین</span></div>
                        </div>
                        <div class="gks-card-body">
                            <div class="gks-card-icon" style="background:rgba(239,68,68,0.12);color:#EF4444;"><i class="fas fa-calendar-alt"></i></div>
                            <h3 class="gks-card-title">تایم‌لاین ۲۰۲۷</h3>
                            <div class="gks-timeline">
                                <div><span class="dot" style="background:#EF4444;"></span> <strong>سپتامبر ۲۰۲۶</strong> - ثبت‌نام مسیر سفارت</div>
                                <div><span class="dot" style="background:#F59E0B;"></span> <strong>فوریه ۲۰۲۷</strong> - ثبت‌نام مسیر دانشگاه</div>
                                <div><span class="dot" style="background:#22C55E;"></span> <strong>ژوئن ۲۰۲۷</strong> - اعلام نتایج</div>
                                <div><span class="dot" style="background:#7C3AED;"></span> <strong>سپتامبر ۲۰۲۷</strong> - ورود به کره</div>
                            </div>
                        </div>
                    </div>

                    <!-- 6: نکات -->
                    <div class="gks-card">
                        <div class="gks-card-image">
                            <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=180&fit=crop&crop=center" alt="نکات" class="gks-card-img">
                            <div class="gks-image-overlay"><span class="gks-image-label">💡 نکات طلایی</span></div>
                        </div>
                        <div class="gks-card-body">
                            <div class="gks-card-icon" style="background:rgba(236,72,153,0.12);color:#EC4899;"><i class="fas fa-lightbulb"></i></div>
                            <h3 class="gks-card-title">نکات طلایی</h3>
                            <ul class="gks-tips">
                                <li>🎯 <strong>TOPIK 5-6</strong> = معافیت از دوره زبان</li>
                                <li>⚠️ <strong>TOPIK 3</strong> حداقل برای ورود به دانشگاه</li>
                                <li>📊 نرخ قبولی: <strong>۵-۱۳٪</strong> بسته به کشور</li>
                                <li>🗣️ مصاحبه سفارت: ۵ تا ۳۰ دقیقه</li>
                            </ul>
                        </div>
                    </div>

                </div>

                <!-- CTA -->
                <div class="gks-cta">
                    <div class="gks-cta-content">
                        <div class="gks-cta-icon">🎯</div>
                        <h3 class="gks-cta-title">آماده‌ای برای GKS 2027؟</h3>
                        <p class="gks-cta-desc">۲,۰۰۰+ بورسیه به دانشجویان ۱۵۵+ کشور تعلق می‌گیرد.</p>
                        <div class="gks-cta-buttons">
                            <a href="#" class="gks-btn-primary"><i class="fas fa-rocket"></i> شروع آماده‌سازی</a>
                            <a href="#" class="gks-btn-secondary"><i class="fas fa-download"></i> دانلود راهنما</a>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }

    startCountdown() {
        const els = {
            days: document.getElementById('countdownDays'),
            hours: document.getElementById('countdownHours'),
            minutes: document.getElementById('countdownMinutes'),
            seconds: document.getElementById('countdownSeconds')
        };

        if (!els.days) return;

        const update = () => {
            const diff = this.countdownTarget - new Date().getTime();
            if (diff < 0) { Object.values(els).forEach(el => el.textContent = '۰۰'); return; }
            
            els.days.textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
            els.hours.textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
            els.minutes.textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
            els.seconds.textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        };

        update();
        setInterval(update, 1000);
    }

    setupObserver() {
        if (!('IntersectionObserver' in window)) return;
        const observer = new IntersectionObserver(e => {
            e.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.gks-card, .gks-stat').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
            observer.observe(el);
        });

        document.head.insertAdjacentHTML('beforeend', `
            <style>
                .gks-card.visible, .gks-stat.visible {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
            </style>
        `);
    }
}

document.addEventListener('DOMContentLoaded', () => new GKSSection());