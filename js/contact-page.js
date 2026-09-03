// ==========================================
// CONTACT PAGE - 아틀라스 한글
// ==========================================

class ContactPage {
    constructor() {
        this.init();
    }

    init() {
        this.renderInfoCards();
        this.renderForm();
        this.renderFAQ();
        this.setupFormSubmit();
        this.setupFAQ();
        console.log('📧 Contact Page Ready!');
    }

    renderInfoCards() {
        const container = document.getElementById('contactInfoCards');
        if (!container) return;

        const contacts = [
            {
                icon: 'fa-envelope', iconClass: 'email',
                label: 'ایمیل', value: 'atlas@hangul.com',
                link: 'mailto:atlas@hangul.com'
            },
            {
                icon: 'fa-paper-plane', iconClass: 'telegram',
                label: 'تلگرام', value: '@atlas_hangul',
                link: 'https://t.me/atlas_hangul'
            },
            {
                icon: 'fa-instagram', iconClass: 'instagram',
                label: 'اینستاگرام', value: '@atlas.hangul',
                link: 'https://instagram.com/atlas.hangul'
            },
            {
                icon: 'fa-youtube', iconClass: 'youtube',
                label: 'یوتیوب', value: 'Atlas Hangul',
                link: '#'
            },
            {
                icon: 'fa-github', iconClass: 'github',
                label: 'گیت‌هاب', value: 'github.com/atlas-hangul',
                link: '#'
            }
        ];

        container.innerHTML = contacts.map(c => `
            <a href="${c.link}" class="contact-info-card" target="_blank" rel="noopener">
                <div class="contact-info-icon ${c.iconClass}">
                    <i class="fab ${c.icon === 'fa-envelope' ? 'fas' : 'fab'} ${c.icon}"></i>
                </div>
                <div class="contact-info-text">
                    <div class="contact-info-label">${c.label}</div>
                    <div class="contact-info-value">${c.value}</div>
                </div>
                <i class="fas fa-arrow-left contact-info-arrow"></i>
            </a>
        `).join('');
    }

    renderForm() {
        const container = document.getElementById('contactFormContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="contact-form-card">
                <h3 class="contact-form-title"><i class="fas fa-paper-plane" style="color:#4A90D9;"></i> پیام بفرست</h3>
                <p class="contact-form-subtitle">سوال، پیشنهاد یا انتقاد داری؟ برام بنویس!</p>
                
                <form id="contactForm">
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-user"></i> نام</label>
                        <input type="text" class="form-input" placeholder="اسمت رو بنویس..." required>
                    </div>
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-envelope"></i> ایمیل</label>
                        <input type="email" class="form-input" placeholder="email@example.com" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-tag"></i> موضوع</label>
                        <input type="text" class="form-input" placeholder="موضوع پیامت چیه؟" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label"><i class="fas fa-comment"></i> پیام</label>
                        <textarea class="form-textarea" placeholder="پیامت رو اینجا بنویس..." required></textarea>
                    </div>
                    <button type="submit" class="form-submit-btn" id="submitBtn">
                        <i class="fas fa-paper-plane"></i>
                        ارسال پیام
                    </button>
                </form>
            </div>
        `;
    }

    renderFAQ() {
        const container = document.getElementById('contactFAQ');
        if (!container) return;

        const faqs = [
            {
                q: 'آیا آموزش‌ها رایگانه؟',
                a: 'بله! تمام مسیرهای آموزشی، درس‌ها و کوییزهای 아틀라스 한글 کاملاً رایگان هستن. چون هدف من ساختن یه پل ارتباطیه، نه یه کسب‌وکار.'
            },
            {
                q: 'چقدر طول می‌کشه به TOPIK 4 برسم؟',
                a: 'با روزی ۲-۳ ساعت مطالعه متمرکز، حدود ۱۲-۱۸ ماه می‌تونی از صفر به TOPIK 4 برسی. من خودم این مسیر رو رفتم و می‌دونم شدنیه!'
            },
            {
                q: 'برای GKS چطور آماده بشم؟',
                a: 'بخش GKS توی سایت رو ببین! اونجا راهنمای کامل، تایم‌لاین، مدارک و حتی تجربیات من رو نوشتم. از TOPIK 3 به بالا شانس قبولی خیلی بیشتره.'
            },
            {
                q: 'آیا کلاس خصوصی هم داری؟',
                a: 'الان نه! تمام تمرکزم روی توسعه این سایت و محتوای رایگانه. اما اگه سوالی داری، می‌تونی از فرم بالا برام پیام بفرستی.'
            }
        ];

        container.innerHTML = `
            <h2 class="faq-title"><i class="fas fa-question-circle" style="color:#4A90D9;"></i> سوالات متداول</h2>
            ${faqs.map((faq, i) => `
                <div class="faq-item ${i === 0 ? 'open' : ''}">
                    <button class="faq-question" onclick="window.contactPage.toggleFAQ(this)">
                        <span>${faq.q}</span>
                        <i class="fas fa-chevron-down faq-chevron"></i>
                    </button>
                    <div class="faq-answer">
                        <p>${faq.a}</p>
                    </div>
                </div>
            `).join('')}
        `;
    }

    setupFormSubmit() {
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'contactForm') {
                e.preventDefault();
                const btn = document.getElementById('submitBtn');
                const originalHTML = btn.innerHTML;

                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
                btn.disabled = true;

                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> پیام ارسال شد!';
                    btn.classList.add('submitted');
                    this.showToast('پیامت با موفقیت ارسال شد! به زودی جواب می‌دم.', 'success');
                    e.target.reset();

                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.classList.remove('submitted');
                        btn.disabled = false;
                    }, 3000);
                }, 1500);
            }
        });
    }

    setupFAQ() {
        // Already handled by onclick
    }

    toggleFAQ(btn) {
        const item = btn.closest('.faq-item');
        item?.classList.toggle('open');
    }

    showToast(message, type = 'success') {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.className = `toast ${type} show`;

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.contactPage = new ContactPage();
});