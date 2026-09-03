// ==========================================
// BLOG SECTION - ATLAS KOREAN · نسخه لوکس
// ==========================================

class BlogSection {
    constructor() {
        this.blogElement = document.getElementById('blog');
        this.posts = [];
        this.init();
    }

    init() {
        this.loadPosts();
        this.render();
        this.setupModal();
        console.log('📝 Blog Ready!');
    }

    loadPosts() {
        this.posts = [
            {
                id: 1,
                title: 'یادگیری کره‌ای با K-Drama: ۱۰ عبارت پرکاربرد',
                excerpt: 'با دیدن دراماهای کره‌ای، این ۱۰ عبارت رو یاد بگیر و مثل یه بومی صحبت کن.',
                category: 'kdrama',
                categoryLabel: 'K-Drama',
                categoryClass: 'kdrama',
                image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=400&fit=crop&crop=center',
                date: '۱۵ فروردین ۱۴۰۴',
                readTime: '۸ دقیقه',
                tags: ['دراما', 'اصطلاحات', 'مکالمه'],
                emoji: '🎬'
            },
            {
                id: 2,
                title: 'اسلنگ‌های کره‌ای که تو کلاس یاد نمی‌گیری!',
                excerpt: '۲۰ اسلنگ ضروری کره‌ای که توی خیابون‌های سئول به کار میاد.',
                category: 'slang',
                categoryLabel: 'اسلنگ',
                categoryClass: 'slang',
                image: 'https://images.unsplash.com/photo-2534274731938-5ab9b4b1b0e6?w=800&h=400&fit=crop&crop=center',
                date: '۲۰ فروردین ۱۴۰۴',
                readTime: '۱۲ دقیقه',
                tags: ['اسلنگ', 'محاوره', 'سئول'],
                emoji: '💬'
            },
            {
                id: 3,
                title: 'آموزش کره‌ای با K-Pop: متن آهنگ BTS رو ترجمه کن',
                excerpt: 'با آهنگ‌های محبوب K-Pop، کره‌ای رو سریع‌تر یاد بگیر.',
                category: 'kpop',
                categoryLabel: 'K-Pop',
                categoryClass: 'kpop',
                image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=400&fit=crop&crop=center',
                date: '۲۵ فروردین ۱۴۰۴',
                readTime: '۱۰ دقیقه',
                tags: ['K-Pop', 'BTS', 'متن آهنگ'],
                emoji: '🎵'
            },
            {
                id: 4,
                title: 'تاریخچه هانگول: الفبایی که یک شاه اختراع کرد',
                excerpt: 'داستان شگفت‌انگیز پادشاه سجونگ و اختراع الفبای کره‌ای در سال ۱۴۴۳.',
                category: 'history',
                categoryLabel: 'تاریخچه',
                categoryClass: 'history',
                image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800&h=400&fit=crop&crop=center',
                date: '۱ اردیبهشت ۱۴۰۴',
                readTime: '۷ دقیقه',
                tags: ['تاریخ', 'هانگول', 'سجونگ'],
                emoji: '📜'
            },
            {
                id: 5,
                title: 'فرهنگ غذاهای خیابانی کره: از 떡볶ی تا 김밥',
                excerpt: 'با معروف‌ترین غذاهای خیابانی کره آشنا شو و اسمشون رو یاد بگیر.',
                category: 'culture',
                categoryLabel: 'فرهنگ',
                categoryClass: 'culture',
                image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800&h=400&fit=crop&crop=center',
                date: '۵ اردیبهشت ۱۴۰۴',
                readTime: '۹ دقیقه',
                tags: ['فرهنگ', 'غذا', 'کره'],
                emoji: '🍜'
            },
            {
                id: 6,
                title: '۵ اشتباه رایج فارسی‌زبان‌ها توی یادگیری کره‌ای',
                excerpt: 'این اشتباهات رو نکن تا کره‌ای رو سریع‌تر و راحت‌تر یاد بگیری.',
                category: 'learning',
                categoryLabel: 'یادگیری',
                categoryClass: 'learning',
                image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop&crop=center',
                date: '۱۰ اردیبهشت ۱۴۰۴',
                readTime: '۶ دقیقه',
                tags: ['یادگیری', 'نکات', 'مبتدی'],
                emoji: '⚠️'
            }
        ];
    }

    render() {
        if (!this.blogElement) return;

        this.blogElement.innerHTML = `
            <div class="blog-container">
                
                <!-- HEADER -->
                <div class="blog-header">
                    <div class="blog-header-badge">
                        <i class="fas fa-blog"></i>
                        وبلاگ 아틀라스
                    </div>
                    <h2 class="blog-title">
                        <span class="highlight">مقالات</span> آموزشی
                    </h2>
                    <p class="blog-subtitle">
                        یادگیری کره‌ای فقط درس نیست! فرهنگ، موسیقی و تاریخ رو هم بشناس
                    </p>
                </div>

                <!-- GRID -->
                <div class="blog-grid">
                    ${this.posts.map((post, i) => this.renderCard(post, i)).join('')}
                </div>

                <!-- VIEW ALL -->
                <div class="blog-footer">
                    <a href="${this.getBasePath()}pages/blog-list.html" class="blog-view-all">
                        <i class="fas fa-list"></i>
                        مشاهده همه مقالات
                        <span class="blog-count">${this.posts.length}+</span>
                    </a>
                </div>

            </div>

            <!-- MODAL -->
            <div class="blog-modal-overlay" id="blogModalOverlay"></div>
            <div class="blog-modal" id="blogModal">
                <button class="blog-modal-close" id="blogModalClose">
                    <i class="fas fa-times"></i>
                </button>
                <div id="blogModalContent"></div>
            </div>
        `;
    }

    renderCard(post, index) {
        return `
            <article class="blog-card" 
                     onclick="window.blogSection.openPost(${post.id})"
                     style="animation-delay: ${index * 80}ms">
                
                <div class="blog-card-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <div class="blog-card-overlay">
                        <span class="blog-card-emoji">${post.emoji}</span>
                    </div>
                    <span class="blog-category ${post.categoryClass}">${post.categoryLabel}</span>
                </div>

                <div class="blog-card-body">
                    <div class="blog-meta">
                        <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
                        <span class="blog-meta-dot"></span>
                        <span><i class="far fa-clock"></i> ${post.readTime}</span>
                    </div>

                    <h3 class="blog-card-title">${post.title}</h3>
                    <p class="blog-card-excerpt">${post.excerpt}</p>

                    <div class="blog-tags">
                        ${post.tags.map(tag => `<span class="blog-tag">#${tag}</span>`).join('')}
                    </div>

                    <span class="blog-read-more">
                        ادامه مطلب
                        <i class="fas fa-arrow-left"></i>
                    </span>
                </div>
            </article>
        `;
    }

    openPost(id) {
        const post = this.posts.find(p => p.id === id);
        if (!post) return;

        const overlay = document.getElementById('blogModalOverlay');
        const modal = document.getElementById('blogModal');
        const content = document.getElementById('blogModalContent');

        content.innerHTML = `
            <img src="${post.image}" alt="${post.title}" class="blog-modal-img">
            <span class="blog-modal-category ${post.categoryClass}">${post.emoji} ${post.categoryLabel}</span>
            <h2 class="blog-modal-title">${post.title}</h2>
            <div class="blog-modal-meta">
                <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
                <span><i class="far fa-clock"></i> ${post.readTime}</span>
            </div>
            <div class="blog-modal-text">${post.content}</div>
        `;

        overlay.classList.add('active');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('blogModalOverlay')?.classList.remove('active');
        document.getElementById('blogModal')?.classList.remove('active');
        document.body.style.overflow = '';
    }

    setupModal() {
        document.getElementById('blogModalClose')?.addEventListener('click', () => this.closeModal());
        document.getElementById('blogModalOverlay')?.addEventListener('click', () => this.closeModal());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }

    getBasePath() {
        return window.location.pathname.includes('/pages/') ? '../' : '';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.blogSection = new BlogSection();
});