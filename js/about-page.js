// ==========================================
// ABOUT PAGE - 아틀라스 한글
// ==========================================

class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.renderContent();
        console.log('💜 About Page Ready!');
    }

    renderContent() {
        const container = document.getElementById('aboutContent');
        if (!container) return;

        container.innerHTML = `
            ${this.renderStory()}
            ${this.renderTimeline()}
            ${this.renderQuote()}
            ${this.renderValues()}
            ${this.renderCTA()}
        `;
    }

    renderStory() {
        return `
            <section class="about-section">
                <div class="section-container">
                    <span class="section-badge"><i class="fas fa-book-open"></i> داستان من</span>
                    <h2 class="section-title">چطور <span class="highlight">아틀라스 한글</span> متولد شد؟</h2>
                    <div class="section-text">
                        <p>
                            من <strong>ادریس</strong> هستم، اما همه منو با اسم <strong>اطلس</strong> می‌شناسن. 
                            متولد <strong>۱۳۸۷</strong> توی ایران، اما اصالتاً <strong>اهل افغانستان</strong> هستم.
                            الان یه <strong>Full-Stack Developer</strong> هستم با یه رؤیای بزرگ: 
                            <strong>پل ارتباطی بین فارسی‌زبانان و کره جنوبی</strong>.
                        </p>
                        <p style="margin-top:1rem;">
                            ماجرای من با زبان کره‌ای از <strong>K-Drama</strong>ها شروع شد. 
                            هر بار که یه سریال می‌دیدم، دلم می‌خواست حداقل بتونم <strong>نوشته‌های روی تابلوها و منوها</strong> رو بخونم. 
                            برای همین <strong>۶ ماه قبل از شروع رسمی</strong>، الفبای هانگول رو یاد گرفتم.
                        </p>
                        <p style="margin-top:1rem;">
                            <strong>فروردین ۱۴۰۴</strong> رسماً با کتاب‌های <strong>ایهوا (Ewha)</strong> شروع کردم. 
                            <strong>خودم مربی خودم شدم.</strong> 
                            نه کلاسی، نه استادی - فقط عشق، انگیزه، و کلی اشتیاق. 
                            همین <strong>خودآموزی</strong> بزرگترین نقطه قوت منه - 
                            چون دقیقاً می‌دونم یه زبان‌آموز کجا گیر می‌کنه، کجا ناامید میشه، 
                            و چطور می‌تونه از سد این موانع عبور کنه.
                        </p>
                    </div>
                </div>
            </section>
        `;
    }

    renderTimeline() {
        return `
            <section class="about-section" style="background:var(--bg-secondary);">
                <div class="section-container">
                    <span class="section-badge"><i class="fas fa-calendar-alt"></i> مسیر من</span>
                    <h2 class="section-title">سفر <span class="highlight">یادگیری</span> کره‌ای</h2>
                    <div class="timeline" style="margin-top:2rem;">
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">مهر ۱۴۰۳</div>
                            <div class="timeline-title">جرقه اولیه - یادگیری هانگول</div>
                            <div class="timeline-desc">با دیدن K-Drama، شروع به یادگیری الفبای کره‌ای کردم. فقط می‌خواستم تابلوها رو بخونم!</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">فروردین ۱۴۰۴</div>
                            <div class="timeline-title">شروع رسمی با کتاب‌های Ewha</div>
                            <div class="timeline-desc">کتاب‌های ایهوا رو تهیه کردم و به صورت خودآموز شروع کردم. روزی ۴-۵ ساعت مطالعه.</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">الان</div>
                            <div class="timeline-title">سطح TOPIK 4</div>
                            <div class="timeline-desc">بعد از ماه‌ها تلاش، الان در سطح TOPIK 4 هستم و این سایت رو برای کمک به بقیه ساختم.</div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-date">۲۰۲۷</div>
                            <div class="timeline-title">هدف: GKS Scholarship</div>
                            <div class="timeline-desc">برای بورسیه GKS اقدام می‌کنم - رشته امنیت سایبری در دانشگاه‌های آجو (Ajou) و دگو (Daegu).</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderQuote() {
        return `
            <section class="about-section">
                <div class="section-container">
                    <div class="quote-card">
                        <div class="quote-icon"><i class="fas fa-quote-right"></i></div>
                        <p class="quote-text">
                            "من این سایت رو نساختم که فقط کره‌ای یاد بدم. 
                            ساختمش که <strong>پلی باشم</strong> بین فرهنگ فارسی‌زبانان و کره جنوبی. 
                            این <strong>افتخار</strong> و <strong>آرزوی منه</strong> - 
                            کسی که این مسیر رو خودش رفته و داره میره."
                        </p>
                        <p class="quote-author">— ادریس (اطلس)، بنیانگذار 아틀라스 한글</p>
                    </div>
                </div>
            </section>
        `;
    }

    renderValues() {
        return `
            <section class="about-section" style="background:var(--bg-secondary);">
                <div class="section-container">
                    <span class="section-badge"><i class="fas fa-heart"></i> ارزش‌های ما</span>
                    <h2 class="section-title">چرا <span class="highlight">아틀라스 한글</span> متفاوته؟</h2>
                    <div class="values-grid" style="margin-top:2rem;">
                        <div class="value-card">
                            <div class="value-icon passion"><i class="fas fa-fire"></i></div>
                            <h3 class="value-title">خودآموزی واقعی</h3>
                            <p class="value-desc">من خودم این مسیر رو به تنهایی رفتم. می‌دونم کجا سخته، کجا گیج‌کننده‌ست، و چطور باید ازش عبور کرد.</p>
                        </div>
                        <div class="value-card">
                            <div class="value-icon bridge"><i class="fas fa-globe-asia"></i></div>
                            <h3 class="value-title">پل فرهنگی</h3>
                            <p class="value-desc">هدف من فقط آموزش زبان نیست - می‌خوام فارسی‌زبانان رو به فرهنگ، موسیقی، و فرصت‌های کره جنوبی وصل کنم.</p>
                        </div>
                        <div class="value-card">
                            <div class="value-icon growth"><i class="fas fa-chart-line"></i></div>
                            <h3 class="value-title">مسیر مشخص</h3>
                            <p class="value-desc">با ۷ مسیر آموزشی، از هانگول تا TOPIK، دقیقاً می‌دونی هر روز چی باید بخونی و چقدر پیشرفت کردی.</p>
                        </div>
                        <div class="value-card">
                            <div class="value-icon community"><i class="fas fa-users"></i></div>
                            <h3 class="value-title">جامعه یادگیری</h3>
                            <p class="value-desc">تنها نیستی! اینجا یه جامعه‌ست از آدمایی که مثل تو عاشق کره‌ای هستن و می‌خوان با هم رشد کنن.</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    renderCTA() {
        return `
            <section class="about-section">
                <div class="section-container">
                    <div class="about-cta">
                        <h2><i class="fas fa-rocket"></i> حاضری سفرت رو شروع کنی؟</h2>
                        <p>از هانگول شروع کن، مسیر خودت رو انتخاب کن، و با اطلس کره‌ای رو یاد بگیر!</p>
                        <a href="../index.html#roadmap" class="about-cta-btn">
                            <i class="fas fa-play"></i>
                            شروع یادگیری
                            <i class="fas fa-arrow-left"></i>
                        </a>
                    </div>
                </div>
            </section>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.aboutPage = new AboutPage();
});