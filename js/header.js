// ==========================================
// HEADER - SIDEBAR PREMIUM EDITION
// کاملاً خودکار - فقط با لینک کردن JS
// ==========================================

(function() {
    'use strict';

    console.log('🚀 Sidebar Header initializing...');

    // ==========================================
    // ایجاد المان‌های هدر در DOM
    // ==========================================

    function createHeaderElements() {
        if (document.getElementById('sidebar')) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.id = 'sidebarToggle';
        toggleBtn.setAttribute('aria-label', 'باز کردن منو');
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.prepend(toggleBtn);

        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        sidebar.id = 'sidebar';
        document.body.prepend(sidebar);

        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.id = 'sidebarOverlay';
        document.body.appendChild(overlay);

        const mobileNav = document.createElement('div');
        mobileNav.id = 'mobileNav';
        document.body.appendChild(mobileNav);
    }

    createHeaderElements();

    // ==========================================
    // ابزارهای کمکی
    // ==========================================

    function getBasePath() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html' || !path.includes('/pages/')) return '';
        const segments = path.split('/').filter(s => s.length > 0);
        const pageIndex = segments.indexOf('pages');
        if (pageIndex === -1) return '';
        const depth = segments.length - pageIndex - 1;
        return '../'.repeat(Math.min(depth, 10));
    }

    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('hangul')) return 'hangul';
        if (path.includes('grammar')) return 'grammar';
        if (path.includes('collocation')) return 'collocation';
        if (path.includes('speaking')) return 'speaking';
        if (path.includes('vocabulary')) return 'vocabulary';
        if (path.includes('topik1')) return 'topik1';
        if (path.includes('topik2')) return 'topik2';
        if (path.includes('flashcards')) return 'flashcards';
        if (path.includes('placement-test')) return 'placement-test';
        if (path.includes('gks-guide')) return 'gks';
        if (path.includes('blog-list')) return 'blog';
        if (path.includes('about')) return 'about';
        if (path.includes('contact')) return 'contact';
        if (path.includes('auth/profile')) return 'profile';
        if (path.includes('auth/login')) return 'login';
        if (path.includes('auth/signup')) return 'signup';
        if (path.includes('my-courses')) return 'my-courses';
        return 'home';
    }

    function isAuthenticated() {
        return !!localStorage.getItem('access_token');
    }

    function getUserData() {
        try {
            return JSON.parse(localStorage.getItem('user_data'));
        } catch {
            return null;
        }
    }

    function getInitials(firstName, lastName, username) {
        if (firstName && lastName) return firstName.charAt(0) + lastName.charAt(0);
        if (firstName) return firstName.charAt(0);
        if (username) return username.charAt(0).toUpperCase();
        return 'U';
    }

    function getAvatarUrl(user) {
        return user?.avatar_url || null;
    }

    function logoutUser() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        window.location.reload();
    }

    const basePath = getBasePath();
    const currentPage = getCurrentPage();
    const isActive = (page) => currentPage === page ? 'active' : '';
    const isActivePath = (path) => window.location.pathname.includes(path) ? 'active' : '';
    const user = getUserData();
    const loggedIn = isAuthenticated();

    // ==========================================
    // رندر سایدبار
    // ==========================================

    const sidebar = document.getElementById('sidebar');

    if (sidebar) {
        sidebar.innerHTML = `
            <!-- ===== لوگو ===== -->
            <a href="${basePath}index.html" class="sidebar-brand">
                <img src="${basePath}img/favicon.png" alt="아틀라스 한글" class="brand-icon">
                <div>
                    <span class="brand-text">
                        아틀라스 <span class="highlight">한글</span>
                    </span>
                    <span class="brand-sub">آموزش زبان کرهای</span>
                </div>
            </a>

            <!-- ===== منوی اصلی ===== -->
            <nav class="sidebar-nav">
                <ul>
                    <li>
                        <a href="${basePath}index.html" class="sidebar-link ${isActive('home')}">
                            <i class="fas fa-home"></i>
                            <span class="link-label">خانه</span>
                        </a>
                    </li>

                    <li>
                        <button class="sidebar-link" id="coursesToggle">
                            <i class="fas fa-book"></i>
                            <span class="link-label">دوره‌ها</span>
                            <i class="fas fa-chevron-down link-arrow"></i>
                        </button>
                        <div class="sidebar-dropdown" id="coursesDropdown">
                            <a href="${basePath}pages/topik-course/index.html" class="sidebar-link ${isActivePath('topik-course')}">
                                <i class="fas fa-trophy" style="color:#F59E0B;"></i>
                                <span class="link-label">TOPIK 1-6</span>
                                <span class="link-badge">محبوب</span>
                            </a>
                            <a href="${basePath}pages/topik-course/level1/index.html" class="sidebar-link ${isActivePath('topik-course/level1')}">
                                <i class="fas fa-star" style="color:#7C3AED;"></i>
                                <span class="link-label">TOPIK I (مبتدی)</span>
                            </a>
                            <a href="${basePath}pages/topik-course/level2/index.html" class="sidebar-link ${isActivePath('topik-course/level2')}">
                                <i class="fas fa-star" style="color:#06B6D4;"></i>
                                <span class="link-label">TOPIK II (متوسط)</span>
                            </a>
                            <a href="${basePath}pages/grammar/index.html" class="sidebar-link ${isActivePath('grammar')}">
                                <i class="fas fa-code" style="color:#F59E0B;"></i>
                                <span class="link-label">مسیر گرامر</span>
                            </a>
                            <a href="${basePath}pages/hangul/index.html" class="sidebar-link ${isActivePath('hangul')}">
                                <i class="fas fa-font" style="color:#22C55E;"></i>
                                <span class="link-label">مسیر هانگول</span>
                                <span class="link-badge start">شروع</span>
                            </a>
                            <a href="${basePath}pages/vocabulary/index.html" class="sidebar-link ${isActivePath('vocabulary')}">
                                <i class="fas fa-book-open" style="color:#7C3AED;"></i>
                                <span class="link-label">مسیر واژگان</span>
                            </a>
                            <a href="${basePath}pages/speaking/index.html" class="sidebar-link ${isActivePath('speaking')}">
                                <i class="fas fa-comments" style="color:#06B6D4;"></i>
                                <span class="link-label">مسیر مکالمه</span>
                            </a>
                            <a href="${basePath}pages/podcast/index.html" class="sidebar-link ${isActivePath('podcast')}">
                                <i class="fas fa-podcast" style="color:#F59E0B;"></i>
                                <span class="link-label">مسیر پادکست</span>
                            </a>
                        </div>
                    </li>

                    <li>
                        <a href="${basePath}pages/placement-test/index.html" class="sidebar-link ${isActive('placement-test')}">
                            <i class="fas fa-graduation-cap"></i>
                            <span class="link-label">تعیین سطح</span>
                        </a>
                    </li>

                    <li>
                        <a href="${basePath}pages/flashcards/index.html" class="sidebar-link ${isActive('flashcards')}">
                            <i class="fas fa-layer-group"></i>
                            <span class="link-label">لایتنر</span>
                        </a>
                    </li>

                    <li>
                        <button class="sidebar-link" id="moreToggle">
                            <i class="fas fa-ellipsis-h"></i>
                            <span class="link-label">بیشتر</span>
                            <i class="fas fa-chevron-down link-arrow"></i>
                        </button>
                        <div class="sidebar-dropdown" id="moreDropdown">
                            <a href="${basePath}pages/gks-guide.html" class="sidebar-link ${isActive('gks')}">
                                <i class="fas fa-flag-checkered" style="color:#F59E0B;"></i>
                                <span class="link-label">راهنمای GKS</span>
                            </a>
                            <a href="${basePath}pages/blog-list.html" class="sidebar-link ${isActive('blog')}">
                                <i class="fas fa-blog" style="color:#7C3AED;"></i>
                                <span class="link-label">وبلاگ</span>
                            </a>
                            <a href="${basePath}pages/about.html" class="sidebar-link ${isActive('about')}">
                                <i class="fas fa-info-circle" style="color:#06B6D4;"></i>
                                <span class="link-label">درباره ما</span>
                            </a>
                            <a href="${basePath}pages/contact.html" class="sidebar-link ${isActive('contact')}">
                                <i class="fas fa-envelope" style="color:#22C55E;"></i>
                                <span class="link-label">تماس</span>
                            </a>
                        </div>
                    </li>
                </ul>
            </nav>

            <!-- ===== بخش پایین ===== -->
            <div class="sidebar-footer">
                <div class="sidebar-divider"></div>

                ${loggedIn ? `
                    <div class="sidebar-user" id="sidebarUser">
                        <div class="sidebar-user-avatar">
                            ${getAvatarUrl(user) ? `
                                <img src="${getAvatarUrl(user)}" alt="پروفایل">
                            ` : `
                                <span class="initials">${getInitials(user?.first_name, user?.last_name, user?.username)}</span>
                            `}
                        </div>
                        <div class="sidebar-user-info">
                            <div class="sidebar-user-name">${user?.first_name || user?.username || 'کاربر'}</div>
                            <div class="sidebar-user-username">@${user?.username || ''}</div>
                        </div>
                        <span class="sidebar-user-logout" id="sidebarLogoutBtn" title="خروج">
                            <i class="fas fa-sign-out-alt"></i>
                        </span>
                    </div>
                    <a href="${basePath}pages/auth/profile.html" class="sidebar-link" style="margin:0.2rem 0.8rem;">
                        <i class="fas fa-user"></i>
                        <span class="link-label">پروفایل</span>
                    </a>
                ` : `
                    <div class="sidebar-auth">
                        <a href="${basePath}pages/auth/login.html" class="btn-login">
                            <i class="fas fa-sign-in-alt"></i> ورود
                        </a>
                        <a href="${basePath}pages/auth/signup.html" class="btn-signup">
                            <i class="fas fa-user-plus"></i> ثبت‌نام
                        </a>
                    </div>
                `}

                <div style="margin-top:0.6rem;padding:0 0.8rem;">
                    <button class="sidebar-theme-toggle" id="sidebarThemeToggle">
                        <i class="fas fa-moon" id="themeIcon"></i>
                        تغییر تم
                    </button>
                </div>

                <div class="sidebar-footer-text">
                    © 2026 아틀라스 한글
                </div>
            </div>
        `;
    }

    // ==========================================
    // رندر نویگیشن موبایل
    // ==========================================

    const mobileNav = document.getElementById('mobileNav');

    if (mobileNav) {
        mobileNav.innerHTML = `
            <div class="mobile-nav-container">
                <a href="${basePath}index.html" class="nav-item ${isActive('home')}" data-tab="home">
                    <div class="nav-icon-wrapper">
                        <i class="fas fa-home"></i>
                        <span class="nav-tooltip"></span>
                    </div>
                    <span class="nav-label">خانه</span>
                </a>

                <a href="${basePath}pages/my-courses/index.html" class="nav-item ${isActive('my-courses')}" data-tab="courses">
                    <div class="nav-icon-wrapper">
                        <i class="fas fa-book-open"></i>
                        <span class="nav-badge">${loggedIn ? '3' : ''}</span>
                        <span class="nav-tooltip"></span>
                    </div>
                    <span class="nav-label">دوره‌های من</span>
                </a>

                <div class="nav-center-btn">
                    <button class="center-action" id="centerAction" aria-label="اقدام سریع">
                        <i class="fas fa-plus"></i>
                        <span class="center-ring"></span>
                        <span class="center-ring-delay"></span>
                    </button>
                    <span class="center-label">شروع سریع</span>
                </div>

                <a href="${basePath}pages/flashcards/index.html" class="nav-item ${isActive('flashcards')}" data-tab="flashcards">
                    <div class="nav-icon-wrapper">
                        <i class="fas fa-layer-group"></i>
                        <span class="nav-tooltip"></span>
                    </div>
                    <span class="nav-label">لایتنر</span>
                </a>

                <a href="${basePath}pages/auth/profile.html" class="nav-item ${isActive('profile')}" data-tab="profile">
                    <div class="nav-icon-wrapper">
                        <i class="fas fa-user"></i>
                        <span class="nav-tooltip"></span>
                    </div>
                    <span class="nav-label">پروفایل</span>
                </a>
            </div>

            <div class="center-menu" id="centerMenu">
                <div class="center-menu-overlay" id="centerOverlay"></div>
                <div class="center-menu-content">
                    <button class="center-menu-item" data-action="continue">
                        <i class="fas fa-play-circle"></i>
                        <span>ادامه یادگیری</span>
                    </button>
                    <button class="center-menu-item" data-action="quiz">
                        <i class="fas fa-question-circle"></i>
                        <span>آزمون سریع</span>
                    </button>
                    <button class="center-menu-item" data-action="search">
                        <i class="fas fa-search"></i>
                        <span>جستجوی دوره</span>
                    </button>
                    <button class="center-menu-item" data-action="share">
                        <i class="fas fa-share-alt"></i>
                        <span>اشتراک‌گذاری</span>
                    </button>
                </div>
            </div>
        `;
    }

    console.log('✅ Sidebar & Mobile Nav rendered!');

    // ==========================================
    // ==========================================
    // ★★★ رویدادها ★★★
    // ==========================================
    // ==========================================

    // ===== 1. تغییر تم =====
    const themeToggle = document.getElementById('sidebarThemeToggle');
    const themeIcon = document.getElementById('themeIcon');

    function toggleTheme() {
        document.body.classList.toggle('night');
        const isNight = document.body.classList.contains('night');
        if (themeIcon) themeIcon.className = isNight ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('theme', isNight ? 'night' : 'light');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // ===== 2. دراپ‌داون دوره‌ها =====
    const coursesToggle = document.getElementById('coursesToggle');
    const coursesDropdown = document.getElementById('coursesDropdown');

    if (coursesToggle && coursesDropdown) {
        coursesToggle.addEventListener('click', function(e) {
            e.preventDefault();
            coursesDropdown.classList.toggle('open');
        });
    }

    // ===== 3. دراپ‌داون بیشتر =====
    const moreToggle = document.getElementById('moreToggle');
    const moreDropdown = document.getElementById('moreDropdown');

    if (moreToggle && moreDropdown) {
        moreToggle.addEventListener('click', function(e) {
            e.preventDefault();
            moreDropdown.classList.toggle('open');
        });
    }

    // ===== 4. خروج از حساب =====
    const logoutBtn = document.getElementById('sidebarLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (confirm('آیا مطمئن هستید که می‌خواهید خارج شوید؟')) {
                logoutUser();
            }
        });
    }

    // ==========================================
    // ★★★ اصلاح شده: باز/بسته کردن سایدبار ★★★
    // ==========================================

    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarEl = document.getElementById('sidebar');

    function openSidebar() {
        sidebarEl?.classList.add('open');
        sidebarOverlay?.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // ★★★ مخفی کردن دکمه همبرگر ★★★
        if (sidebarToggle) {
            sidebarToggle.style.display = 'none';
        }
    }

    function closeSidebar() {
        sidebarEl?.classList.remove('open');
        sidebarOverlay?.classList.remove('show');
        document.body.style.overflow = '';
        
        // ★★★ نمایش دکمه همبرگر ★★★
        if (sidebarToggle) {
            sidebarToggle.style.display = 'flex';
        }
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', openSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // ===== بستن با Escape =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeSidebar();
    });

    // ===== 5. دکمه مرکزی نویگیشن موبایل =====
    const centerBtn = document.getElementById('centerAction');
    const centerMenu = document.getElementById('centerMenu');
    const centerOverlay = document.getElementById('centerOverlay');

    if (centerBtn) {
        centerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.classList.toggle('active');
            centerMenu?.classList.toggle('open');
            document.body.style.overflow = centerMenu?.classList.contains('open') ? 'hidden' : '';
        });
    }

    if (centerOverlay) {
        centerOverlay.addEventListener('click', function() {
            centerBtn?.classList.remove('active');
            centerMenu?.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // ===== 6. آیتم‌های منوی مرکزی =====
    document.querySelectorAll('.center-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const action = this.dataset.action;
            const actions = {
                continue: () => {
                    const lastLesson = localStorage.getItem('last_lesson') || 'pages/topik-course/level1/lessons/l1-01.html';
                    window.location.href = basePath + lastLesson;
                },
                quiz: () => {
                    window.location.href = basePath + 'pages/placement-test/index.html';
                },
                search: () => {
                    window.location.href = basePath + 'pages/search.html';
                },
                share: () => {
                    if (navigator.share) {
                        navigator.share({
                            title: '아틀라스 한글 - آموزش زبان کرهای',
                            text: 'با 아틀라스 한글 کرهای رو آسان یاد بگیر! 🇰🇷',
                            url: window.location.href
                        }).catch(() => {});
                    } else {
                        navigator.clipboard.writeText(window.location.href).then(() => {
                            showToast('لینک کپی شد! 📋');
                        });
                    }
                }
            };
            if (actions[action]) actions[action]();
            centerBtn?.classList.remove('active');
            centerMenu?.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ===== 7. توست =====
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'mobile-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // ===== 8. تم از localStorage =====
    if (localStorage.getItem('theme') === 'night') {
        document.body.classList.add('night');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
    }

    // ===== 9. فعال‌سازی لینک‌ها =====
    document.querySelectorAll('.sidebar-link').forEach(link => {
        if (link.href === window.location.href || link.href === window.location.href + '/') {
            link.classList.add('active');
        }
    });

    console.log('✅ All events initialized!');
})();