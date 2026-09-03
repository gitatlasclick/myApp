// ==========================================
// FOOTER - 아틀라스 한글
// ==========================================

class FooterComponent {
    constructor() {
        this.footer = document.getElementById('footer');
        this.basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        this.init();
    }

    init() {
        this.render();
        this.setupNewsletter();
        console.log('📋 Footer Ready');
    }

    render() {
        if (!this.footer) return;
        const b = this.basePath;

        this.footer.innerHTML = `
            <div class="footer-wave"></div>
            <div class="footer-watermark">한글</div>
            
            <div class="container" style="position:relative;z-index:1;">
                
                <div class="footer-grid">
                    
                    <!-- Brand -->
                    <div class="footer-brand-col">
                        <div class="footer-logo-wrap">
                            <div class="footer-logo-icon">한</div>
                            <div>
                                <span class="footer-logo-text">아틀라스 한글</span>
                                <span class="footer-logo-sub">ATLAS KOREAN</span>
                            </div>
                        </div>
                        <p class="footer-desc">
                            پلتفرم آموزش زبان کره‌ای. از هانگول تا TOPIK، با اطلس یاد بگیر و برای GKS آماده شو.
                        </p>
                        <div class="footer-social-row">
                            <a href="#" class="footer-social-link instagram"><i class="fab fa-instagram"></i></a>
                            <a href="#" class="footer-social-link telegram"><i class="fab fa-telegram-plane"></i></a>
                            <a href="#" class="footer-social-link youtube"><i class="fab fa-youtube"></i></a>
                            <a href="#" class="footer-social-link github"><i class="fab fa-github"></i></a>
                        </div>
                        
                        <div class="footer-newsletter-box">
                            <div class="footer-newsletter-title"><i class="fas fa-paper-plane" style="color:var(--accent);"></i> خبرنامه</div>
                            <div class="footer-newsletter-desc">درس‌های جدید رو زودتر از همه دریافت کن!</div>
                            <form class="footer-newsletter-form" id="footerNewsletter">
                                <input type="email" class="footer-newsletter-input" placeholder="ایمیلت رو بنویس..." required>
                                <button type="submit" class="footer-newsletter-btn">عضویت</button>
                            </form>
                        </div>
                    </div>

                    <!-- Learning Paths -->
                    <div>
                        <h4 class="footer-col-title"><i class="fas fa-road" style="color:var(--accent);"></i> مسیرهای آموزشی</h4>
                        <ul class="footer-links-list">
                            <li><a href="${b}pages/hangul.html" class="footer-link-item"><i class="fas fa-chevron-left"></i> 한글 هانگول</a></li>
                            <li><a href="${b}pages/grammar.html" class="footer-link-item"><i class="fas fa-chevron-left"></i> 문법 گرامر</a></li>
                            <li><a href="${b}pages/collocation.html" class="footer-link-item"><i class="fas fa-chevron-left"></i> 연어 کالوکیشن</a></li>
                            <li><a href="${b}pages/speaking.html" class="footer-link-item"><i class="fas fa-chevron-left"></i> 말하기 مکالمه</a></li>
                            <li><a href="${b}pages/vocabulary.html" class="footer-link-item"><i class="fas fa-chevron-left"></i> 어휘 واژگان</a></li>
                            <li><a href="${b}pages/topik1.html" class="footer-link-item"><i class="fas fa-chevron-left"></i> TOPIK I</a></li>
                            <li><a href="${b}pages/topik2.html" class="footer-link-item"><i class="fas fa-chevron-left"></i> TOPIK II</a></li>
                        </ul>
                    </div>

                    <!-- Resources -->
                    <div>
                        <h4 class="footer-col-title"><i class="fas fa-graduation-cap" style="color:var(--accent);"></i> منابع</h4>
                        <ul class="footer-links-list">
                            <li><a href="${b}pages/flashcards.html" class="footer-link-item"><i class="fas fa-chevron-left"></i> فلش کارت</a></li>
                            <li><a href="${b}pages/blog-list.html" class="footer-link-item"><i class="fas fa-chevron-left"></i> وبلاگ</a></li>
                            <li><a href="${b}index.html#quiz" class="footer-link-item"><i class="fas fa-chevron-left"></i> کوییز</a></li>
                            <li><a href="${b}index.html#gks" class="footer-link-item"><i class="fas fa-chevron-left"></i> راهنمای GKS</a></li>
                        </ul>
                        
                        <h4 class="footer-col-title" style="margin-top:1.5rem;"><i class="fas fa-link" style="color:var(--accent);"></i> صفحات</h4>
                        <ul class="footer-links-list">
                            <li><a href="${b}pages/about.html" class="footer-link-item"><i class="fas fa-chevron-left"></i> درباره ما</a></li>
                            <li><a href="${b}pages/contact.html" class="footer-link-item"><i class="fas fa-chevron-left"></i> تماس با ما</a></li>
                        </ul>
                    </div>

                    <!-- Contact -->
                    <div>
                        <h4 class="footer-col-title"><i class="fas fa-phone" style="color:var(--accent);"></i> ارتباط با ما</h4>
                        <div class="footer-contact-list">
                            <div class="footer-contact-item">
                                <i class="fas fa-envelope"></i>
                                <span>atlas@hangul.com</span>
                            </div>
                            <div class="footer-contact-item">
                                <i class="fab fa-telegram-plane"></i>
                                <span>@atlas_hangul</span>
                            </div>
                            <div class="footer-contact-item">
                                <i class="fab fa-instagram"></i>
                                <span>@atlas.hangul</span>
                            </div>
                            <div class="footer-contact-item" style="margin-top:0.5rem;">
                                <i class="fas fa-map-marker-alt"></i>
                                <span> 🇦🇫 | 🇰🇷</span>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Bottom Bar -->
                <div class="footer-bottom-bar">
                    <div class="footer-bottom-links">
                        <a href="${b}pages/about.html">درباره ما</a>
                        <a href="${b}pages/contact.html">تماس با ما</a>
                        <a href="#">حریم خصوصی</a>
                        <a href="#">قوانین</a>
                    </div>
                    <p class="footer-copyright">
                        © 1405 | ساخته شده با 
                        <span class="footer-heart">❤️</span> 
                        توسط اطلس | 
                        <span style="color:var(--accent);">아틀라스 한글</span>
                    </p>
                </div>

            </div>
        `;
    }

    setupNewsletter() {
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'footerNewsletter') {
                e.preventDefault();
                const btn = e.target.querySelector('button');
                const input = e.target.querySelector('input');
                if (!input.value.trim()) return;
                
                const origHTML = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.style.background = '#22C55E';
                btn.disabled = true;
                
                // Save
                const subs = JSON.parse(localStorage.getItem('atlas_subscribers') || '[]');
                subs.push({ email: input.value, date: new Date().toISOString() });
                localStorage.setItem('atlas_subscribers', JSON.stringify(subs));
                
                setTimeout(() => {
                    btn.innerHTML = origHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                    e.target.reset();
                }, 2500);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.footerComponent = new FooterComponent();
});