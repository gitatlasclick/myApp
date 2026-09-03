// ==========================================
// CONTACT SECTION - 아틀라스 한글
// ==========================================

class ContactSection {
    constructor() {
        this.contactElement = document.getElementById('contact');
        this.init();
    }

    init() {
        this.render();
        this.setupForm();
        console.log('📧 Contact Ready');
    }

    render() {
        if (!this.contactElement) return;

        this.contactElement.innerHTML = `
            <div class="container">
                
                <!-- Section Header -->
                <div class="section-header" data-aos="fade-up">
                    <div class="section-badge">
                        <i class="fas fa-paper-plane"></i>
                        در ارتباط باشیم
                    </div>
                    <h2 class="section-title">
                        با <span class="highlight">اطلس</span> تماس بگیر
                    </h2>
                    <p class="section-desc">
                        سوال، پیشنهاد یا انتقاد داری؟ برام بنویس!
                    </p>
                </div>

                <!-- Contact Layout -->
                <div class="contact-layout" data-aos="fade-up" data-aos-delay="100">
                    
                    <!-- Info Side -->
                    <div class="contact-info-side">
                        <a href="mailto:atlas@hangul.com" class="contact-info-card">
                            <div class="contact-info-icon-circle email"><i class="fas fa-envelope"></i></div>
                            <div class="contact-info-text">
                                <div class="contact-info-label">ایمیل</div>
                                <div class="contact-info-value">atlas@hangul.com</div>
                            </div>
                            <i class="fas fa-chevron-left contact-info-arrow"></i>
                        </a>

                        <a href="https://t.me/atlas_hangul" target="_blank" class="contact-info-card">
                            <div class="contact-info-icon-circle telegram"><i class="fab fa-telegram-plane"></i></div>
                            <div class="contact-info-text">
                                <div class="contact-info-label">تلگرام</div>
                                <div class="contact-info-value">@atlas_hangul</div>
                            </div>
                            <i class="fas fa-chevron-left contact-info-arrow"></i>
                        </a>

                        <a href="https://instagram.com/atlas.hangul" target="_blank" class="contact-info-card">
                            <div class="contact-info-icon-circle instagram"><i class="fab fa-instagram"></i></div>
                            <div class="contact-info-text">
                                <div class="contact-info-label">اینستاگرام</div>
                                <div class="contact-info-value">@atlas.hangul</div>
                            </div>
                            <i class="fas fa-chevron-left contact-info-arrow"></i>
                        </a>

                        <div class="contact-info-card">
                            <div class="contact-info-icon-circle location"><i class="fas fa-map-marker-alt"></i></div>
                            <div class="contact-info-text">
                                <div class="contact-info-label">موقعیت</div>
                                <div class="contact-info-value">افغانستان 🇦🇫 | رؤیای کره 🇰🇷</div>
                            </div>
                        </div>

                        <div class="contact-social-mini">
                            <a href="#" class="contact-social-mini-link insta"><i class="fab fa-instagram"></i></a>
                            <a href="#" class="contact-social-mini-link teleg"><i class="fab fa-telegram-plane"></i></a>
                            <a href="#" class="contact-social-mini-link yt"><i class="fab fa-youtube"></i></a>
                        </div>
                    </div>

                    <!-- Form Side -->
                    <div class="contact-form-wrapper">
                        <h3 class="contact-form-title">
                            <i class="fas fa-comment-dots"></i>
                            پیام بفرست
                        </h3>
                        <p class="contact-form-subtitle">معمولاً زیر ۲۴ ساعت جواب می‌دم!</p>

                        <form id="mainContactForm">
                            <div class="form-group">
                                <label class="form-label">نام <span class="required">*</span></label>
                                <input type="text" class="form-input" placeholder="اسمت رو بنویس..." required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">ایمیل <span class="required">*</span></label>
                                <input type="email" class="form-input" placeholder="email@example.com" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">موضوع</label>
                                <input type="text" class="form-input" placeholder="موضوع پیامت چیه؟">
                            </div>
                            <div class="form-group">
                                <label class="form-label">پیام <span class="required">*</span></label>
                                <textarea class="form-textarea" placeholder="پیامت رو اینجا بنویس..." required></textarea>
                            </div>
                            <button type="submit" class="form-submit-btn">
                                <i class="fas fa-paper-plane"></i>
                                ارسال پیام
                            </button>
                        </form>

                        <div class="form-response" id="formResponse"></div>
                    </div>

                </div>
            </div>
        `;
    }

    setupForm() {
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'mainContactForm') {
                e.preventDefault();
                
                const btn = e.target.querySelector('button');
                const origHTML = btn.innerHTML;
                const response = document.getElementById('formResponse');
                
                // Simulate sending
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
                btn.disabled = true;

                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> ارسال شد!';
                    btn.classList.add('submitted');
                    
                    response.className = 'form-response success show';
                    response.innerHTML = '<i class="fas fa-check-circle"></i> پیامت با موفقیت ارسال شد! به زودی جواب می‌دم.';
                    
                    e.target.reset();
                    
                    setTimeout(() => {
                        btn.innerHTML = origHTML;
                        btn.classList.remove('submitted');
                        btn.disabled = false;
                        response.classList.remove('show');
                    }, 4000);
                }, 1500);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ContactSection();
});