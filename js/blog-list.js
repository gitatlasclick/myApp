// ==========================================
// BLOG LIST - 아틀라스 한글
// ==========================================

class BlogList {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.activeCategory = 'all';
        this.searchQuery = '';
        this.currentPage = 1;
        this.postsPerPage = 6;
        this.init();
    }

    init() {
        this.loadPosts();
        this.applyFilters();
        this.render();
        this.setupEventListeners();
        console.log('📝 Blog List Ready!');
    }

    loadPosts() {
        this.posts = [
            {
                id: 1, title: 'یادگیری کره‌ای با K-Drama: ۱۰ عبارت پرکاربرد',
                excerpt: 'با دیدن دراماهای کره‌ای، این ۱۰ عبارت رو یاد بگیر و مثل یه بومی صحبت کن. از Goblin تا Crash Landing on You.',
                category: 'kdrama', categoryLabel: 'K-Drama', categoryClass: 'kdrama',
                image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600',
                date: '۱۵ فروردین ۱۴۰۴', readTime: '۸ دقیقه', views: 2340,
                tags: ['دراما', 'اصطلاحات', 'مکالمه'], featured: true
            },
            {
                id: 2, title: 'اسلنگ‌های کره‌ای که تو کلاس یاد نمی‌گیری!',
                excerpt: '۲۰ اسلنگ ضروری کره‌ای که توی خیابون‌های سئول و هونگدائه به کار میاد. 대박! 헐!',
                category: 'slang', categoryLabel: 'اسلنگ', categoryClass: 'slang',
                image: 'https://images.unsplash.com/photo-1534274731938-5ab9b4b1b0e6?w=600',
                date: '۲۰ فروردین ۱۴۰۴', readTime: '۱۲ دقیقه', views: 5670,
                tags: ['اسلنگ', 'محاوره', 'سئول'], featured: false
            },
            {
                id: 3, title: 'آموزش کره‌ای با K-Pop: متن آهنگ BTS رو ترجمه کن',
                excerpt: 'با آهنگ‌های محبوب BTS، BLACKPINK و EXO کره‌ای رو سریع‌تر یاد بگیر.',
                category: 'kpop', categoryLabel: 'K-Pop', categoryClass: 'kpop',
                image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600',
                date: '۲۵ فروردین ۱۴۰۴', readTime: '۱۰ دقیقه', views: 8920,
                tags: ['K-Pop', 'BTS', 'متن آهنگ'], featured: true
            },
            {
                id: 4, title: 'تاریخچه هانگول: الفبایی که یک شاه اختراع کرد',
                excerpt: 'داستان شگفت‌انگیز پادشاه سجونگ و اختراع الفبای کره‌ای در سال ۱۴۴۳.',
                category: 'history', categoryLabel: 'تاریخچه', categoryClass: 'history',
                image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=600',
                date: '۱ اردیبهشت ۱۴۰۴', readTime: '۷ دقیقه', views: 3450,
                tags: ['تاریخ', 'هانگول', 'سجونگ'], featured: false
            },
            {
                id: 5, title: 'فرهنگ غذاهای خیابانی کره: از 떡볶이 تا 김밥',
                excerpt: 'با معروف‌ترین غذاهای خیابانی کره آشنا شو و اسمشون رو به کرهای یاد بگیر.',
                category: 'culture', categoryLabel: 'فرهنگ', categoryClass: 'culture',
                image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600',
                date: '۵ اردیبهشت ۱۴۰۴', readTime: '۹ دقیقه', views: 1230,
                tags: ['فرهنگ', 'غذا', 'کره'], featured: false
            },
            {
                id: 6, title: '۵ اشتباه رایج فارسی‌زبان‌ها توی یادگیری کره‌ای',
                excerpt: 'این اشتباهات رو نکن تا کره‌ای رو سریع‌تر و راحت‌تر یاد بگیری.',
                category: 'learning', categoryLabel: 'یادگیری', categoryClass: 'learning',
                image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
                date: '۱۰ اردیبهشت ۱۴۰۴', readTime: '۶ دقیقه', views: 7800,
                tags: ['یادگیری', 'نکات', 'مبتدی'], featured: false
            },
            {
                id: 7, title: 'معرفی ۱۰ دراما کرهای برای یادگیری زبان',
                excerpt: 'بهترین دراماهای کرهای که دیالوگ‌های ساده و کاربردی دارن برای زبان‌آموزها.',
                category: 'kdrama', categoryLabel: 'K-Drama', categoryClass: 'kdrama',
                image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600',
                date: '۱۵ اردیبهشت ۱۴۰۴', readTime: '۱۱ دقیقه', views: 4560,
                tags: ['دراما', 'لیست', 'پیشنهادی'], featured: false
            },
            {
                id: 8, title: 'راهنمای کامل مصاحبه GKS به زبان کره‌ای',
                excerpt: 'نمونه سوالات مصاحبه سفارت کره + پاسخ‌های آماده به کره‌ای.',
                category: 'learning', categoryLabel: 'یادگیری', categoryClass: 'learning',
                image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
                date: '۲۰ اردیبهشت ۱۴۰۴', readTime: '۱۵ دقیقه', views: 12000,
                tags: ['GKS', 'مصاحبه', 'راهنما'], featured: true
            },
            {
                id: 9, title: 'K-Pop و یادگیری زبان: تحقیق علمی چی میگه؟',
                excerpt: 'تحقیقات جدید نشون میده گوش دادن به K-Pop چقدر روی یادگیری کره‌ای تأثیر داره.',
                category: 'kpop', categoryLabel: 'K-Pop', categoryClass: 'kpop',
                image: 'https://images.unsplash.com/photo-1619229665845-e78d7b9e4b6b?w=600',
                date: '۲۵ اردیبهشت ۱۴۰۴', readTime: '۸ دقیقه', views: 3400,
                tags: ['K-Pop', 'تحقیق', 'علمی'], featured: false
            }
        ];
    }

    applyFilters() {
        let filtered = [...this.posts];

        // Category filter
        if (this.activeCategory !== 'all') {
            filtered = filtered.filter(p => p.category === this.activeCategory);
        }

        // Search filter
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(query) ||
                p.excerpt.toLowerCase().includes(query) ||
                p.tags.some(t => t.includes(query))
            );
        }

        this.filteredPosts = filtered;
        this.currentPage = 1;
    }

    getPaginatedPosts() {
        const start = (this.currentPage - 1) * this.postsPerPage;
        return this.filteredPosts.slice(start, start + this.postsPerPage);
    }

    getTotalPages() {
        return Math.ceil(this.filteredPosts.length / this.postsPerPage);
    }

    // ========== RENDER ==========
    render() {
        this.renderToolbar();
        this.renderGrid();
        this.renderPagination();
    }

    renderToolbar() {
        const toolbar = document.getElementById('blogToolbar');
        if (!toolbar) return;

        const categories = [
            { id: 'all', label: 'همه', icon: 'fa-th-large' },
            { id: 'kdrama', label: 'K-Drama', icon: 'fa-film' },
            { id: 'kpop', label: 'K-Pop', icon: 'fa-music' },
            { id: 'slang', label: 'اسلنگ', icon: 'fa-fire' },
            { id: 'history', label: 'تاریخچه', icon: 'fa-landmark' },
            { id: 'culture', label: 'فرهنگ', icon: 'fa-globe-asia' },
            { id: 'learning', label: 'یادگیری', icon: 'fa-graduation-cap' }
        ];

        toolbar.innerHTML = `
            <div class="blog-toolbar">
                <div class="container">
                    <div class="blog-search-wrap">
                        <input type="text" id="blogSearchInput" placeholder="جستجو در مقالات..." value="${this.searchQuery}">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="blog-categories">
                        ${categories.map(c => `
                            <button class="blog-cat-btn ${this.activeCategory === c.id ? 'active' : ''}"
                                    data-category="${c.id}">
                                <i class="fas ${c.icon}"></i> ${c.label}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderGrid() {
        const grid = document.getElementById('blogGrid');
        if (!grid) return;

        const posts = this.getPaginatedPosts();

        if (posts.length === 0) {
            grid.innerHTML = `
                <div class="blog-no-results" style="grid-column:1/-1;">
                    <i class="fas fa-search"></i>
                    <h3>مقاله‌ای یافت نشد</h3>
                    <p>با کلمات دیگه جستجو کن یا فیلترها رو تغییر بده</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = posts.map(post => `
            <article class="blog-card ${post.featured ? 'featured' : ''}" 
                     onclick="window.location.href='blog-post.html?id=${post.id}'">
                <div class="blog-card-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <span class="blog-card-badge ${post.featured ? 'featured-badge' : post.categoryClass}">
                        ${post.featured ? '⭐ ویژه' : post.categoryLabel}
                    </span>
                </div>
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span><i class="far fa-calendar-alt"></i> ${post.date}</span>
                        <span><i class="far fa-clock"></i> ${post.readTime}</span>
                        <span><i class="far fa-eye"></i> ${post.views.toLocaleString('fa-IR')}</span>
                    </div>
                    <h3 class="blog-card-title">${post.title}</h3>
                    <p class="blog-card-excerpt">${post.excerpt}</p>
                    <div class="blog-card-tags">
                        ${post.tags.map(t => `<span class="blog-tag">#${t}</span>`).join('')}
                    </div>
                    <span class="blog-card-read">
                        ادامه مطلب
                        <i class="fas fa-arrow-left"></i>
                    </span>
                </div>
            </article>
        `).join('');
    }

    renderPagination() {
        const pagination = document.getElementById('blogPagination');
        if (!pagination) return;

        const totalPages = this.getTotalPages();
        if (totalPages <= 1) { pagination.innerHTML = ''; return; }

        let html = '';
        html += `<button class="page-btn" ${this.currentPage === 1 ? 'disabled' : ''} data-page="${this.currentPage - 1}"><i class="fas fa-chevron-right"></i></button>`;
        
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="page-btn ${this.currentPage === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        
        html += `<button class="page-btn" ${this.currentPage === totalPages ? 'disabled' : ''} data-page="${this.currentPage + 1}"><i class="fas fa-chevron-left"></i></button>`;
        pagination.innerHTML = html;
    }

    // ========== EVENTS ==========
    setupEventListeners() {
        // Search
        document.addEventListener('input', (e) => {
            if (e.target.id === 'blogSearchInput') {
                this.searchQuery = e.target.value;
                this.applyFilters();
                this.render();
            }
        });

        // Category buttons
        document.addEventListener('click', (e) => {
            const catBtn = e.target.closest('.blog-cat-btn');
            if (catBtn) {
                this.activeCategory = catBtn.getAttribute('data-category');
                this.applyFilters();
                this.render();
            }
        });

        // Pagination
        document.addEventListener('click', (e) => {
            const pageBtn = e.target.closest('.page-btn');
            if (pageBtn && !pageBtn.disabled) {
                const page = parseInt(pageBtn.getAttribute('data-page'));
                if (page >= 1 && page <= this.getTotalPages()) {
                    this.currentPage = page;
                    this.render();
                    window.scrollTo({ top: 400, behavior: 'smooth' });
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.blogList = new BlogList();
});