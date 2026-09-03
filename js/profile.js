// frontend/public/js/profile.js

/**
 * پروفایل کاربر - مدیریت و نمایش
 */

let currentUser = null;
let editMode = false;

// ==========================================
// بارگذاری پروفایل
// ==========================================

function loadProfileData() {
    try {
        const saved = localStorage.getItem('atlas_user');
        if (saved) {
            currentUser = JSON.parse(saved);
            updateProfileUI(currentUser);
            loadConnections();
        } else {
            // اگر لاگین نکرده، به صفحه اصلی برو
            window.location.href = '/';
        }
    } catch (e) {
        console.error('Error loading profile:', e);
    }
}

// ==========================================
// به‌روزرسانی UI
// ==========================================

function updateProfileUI(user) {
    const levelLabels = {
        'A1': 'مبتدی',
        'A2': 'مبتدی تکمیلی',
        'B1': 'متوسط',
        'B2': 'متوسط پیشرفته',
        'C1': 'پیشرفته',
        'C2': 'مسلط'
    };
    
    // اطلاعات پایه
    document.getElementById('profileUsername').textContent = user.username || 'کاربر';
    document.getElementById('profileLevel').textContent = user.level || 'A1';
    document.getElementById('profileLevelLabel').textContent = levelLabels[user.level] || 'مبتدی';
    document.getElementById('profileProgress').textContent = (user.level_progress || 0) + '%';
    document.getElementById('profileBio').textContent = user.bio || 'این کاربر هنوز توضیحی اضافه نکرده است.';
    
    // موقعیت
    const location = [];
    if (user.city) location.push(user.city);
    if (user.country) location.push(user.country);
    document.getElementById('profileLocation').textContent = location.length > 0 ? location.join('، ') : '—';
    
    // تاریخ عضویت
    document.getElementById('profileJoined').textContent = user.joined_date ? 
        new Date(user.joined_date).toLocaleDateString('fa-IR') : '—';
    
    // ساعت مطالعه
    document.getElementById('profileStudyHours').textContent = user.study_hours || 0;
    
    // هدف
    const goalLabels = {
        'TOPIK': 'آزمون TOPIK',
        'TRAVEL': 'سفر به کره',
        'WORK': 'کار در کره',
        'STUDY': 'تحصیل در کره',
        'PERSONAL': 'علاقه شخصی',
        'CULTURE': 'آشنایی با فرهنگ'
    };
    document.getElementById('profileGoal').textContent = goalLabels[user.goal] || '—';
    
    // آواتار
    if (user.avatar) {
        document.getElementById('profileAvatar').src = user.avatar;
    }
    
    // آمار
    document.getElementById('statConnections').textContent = user.total_connections || 0;
    document.getElementById('statMinutes').textContent = Math.round((user.total_minutes || 0) / 60);
    document.getElementById('statFollowers').textContent = user.follower_count || 0;
    document.getElementById('statProgress').textContent = (user.level_progress || 0) + '%';
    
    // رنگ هدر بر اساس سطح
    const headerColors = {
        'A1': 'linear-gradient(135deg, #EF4444, #DC2626)',
        'A2': 'linear-gradient(135deg, #F59E0B, #D97706)',
        'B1': 'linear-gradient(135deg, #22C55E, #16A34A)',
        'B2': 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
        'C1': 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
        'C2': 'linear-gradient(135deg, #EC4899, #BE185D)'
    };
    document.getElementById('profileHeader').style.background = headerColors[user.level] || 'linear-gradient(135deg, #7C3AED, #6D28D9)';
}

// ==========================================
// ویرایش پروفایل
// ==========================================

function toggleEditMode() {
    editMode = !editMode;
    const view = document.getElementById('profileView');
    const edit = document.getElementById('profileEdit');
    
    if (editMode) {
        view.style.display = 'none';
        edit.style.display = 'block';
        fillEditForm();
        // اسکرول به فرم
        edit.scrollIntoView({ behavior: 'smooth' });
    } else {
        view.style.display = 'block';
        edit.style.display = 'none';
    }
}

function fillEditForm() {
    const user = currentUser;
    if (!user) return;
    
    document.getElementById('editUsername').value = user.username || '';
    document.getElementById('editEmail').value = user.email || '';
    document.getElementById('editFirstName').value = user.first_name || '';
    document.getElementById('editLastName').value = user.last_name || '';
    document.getElementById('editAge').value = user.age || '';
    document.getElementById('editGender').value = user.gender || '';
    document.getElementById('editCountry').value = user.country || '';
    document.getElementById('editCity').value = user.city || '';
    document.getElementById('editBio').value = user.bio || '';
    document.getElementById('editLevel').value = user.level || 'A1';
    document.getElementById('editGoal').value = user.goal || '';
    document.getElementById('editStudyHours').value = user.study_hours || 5;
    
    document.getElementById('bioCount').textContent = (user.bio || '').length;
    
    // رویداد شمارش کاراکترها
    document.getElementById('editBio').addEventListener('input', function() {
        document.getElementById('bioCount').textContent = this.value.length;
    });
}

// ==========================================
// ذخیره پروفایل
// ==========================================

function saveProfile(e) {
    e.preventDefault();
    
    const formData = {
        first_name: document.getElementById('editFirstName').value.trim(),
        last_name: document.getElementById('editLastName').value.trim(),
        age: parseInt(document.getElementById('editAge').value) || null,
        gender: document.getElementById('editGender').value,
        country: document.getElementById('editCountry').value.trim(),
        city: document.getElementById('editCity').value.trim(),
        bio: document.getElementById('editBio').value.trim(),
        level: document.getElementById('editLevel').value,
        goal: document.getElementById('editGoal').value,
        study_hours: parseInt(document.getElementById('editStudyHours').value) || 5
    };
    
    const submitBtn = document.querySelector('.btn-save');
    const errorDiv = document.getElementById('editError');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ذخیره...';
    errorDiv.style.display = 'none';
    
    fetch('/api/users/profile/', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            throw new Error(data.error);
        }
        
        // به‌روزرسانی localStorage
        const user = JSON.parse(localStorage.getItem('atlas_user') || '{}');
        Object.assign(user, data);
        localStorage.setItem('atlas_user', JSON.stringify(user));
        currentUser = user;
        
        updateProfileUI(user);
        toggleEditMode();
        showToast('✅ پروفایل با موفقیت به‌روزرسانی شد!', 'success');
    })
    .catch(err => {
        errorDiv.textContent = '❌ ' + (err.message || 'خطا در ذخیره پروفایل');
        errorDiv.style.display = 'block';
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-save"></i> ذخیره تغییرات';
    });
}

// ==========================================
// آپلود آواتار
// ==========================================

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('❌ لطفاً یک فایل تصویری انتخاب کنید.', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showToast('❌ حجم فایل نباید بیشتر از ۵ مگابایت باشد.', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    fetch('/api/users/profile/', {
        method: 'PATCH',
        credentials: 'include',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) throw new Error(data.error);
        
        const user = JSON.parse(localStorage.getItem('atlas_user') || '{}');
        user.avatar = data.avatar;
        localStorage.setItem('atlas_user', JSON.stringify(user));
        currentUser = user;
        
        document.getElementById('profileAvatar').src = data.avatar + '?t=' + Date.now();
        showToast('✅ آواتار با موفقیت به‌روزرسانی شد!', 'success');
    })
    .catch(err => {
        showToast('❌ ' + (err.message || 'خطا در آپلود آواتار'), 'error');
    })
    .finally(() => {
        e.target.value = '';
    });
}

// ==========================================
// بارگذاری تاریخچه تماس‌ها
// ==========================================

function loadConnections() {
    fetch('/api/users/connections/', {
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('connectionsList');
        if (!container) return;
        
        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="no-connections">
                    <i class="fas fa-comments"></i>
                    <p>هنوز هیچ مکالمه‌ای نداشته‌اید.</p>
                    <button onclick="window.location.href='/chat'" class="btn-start-chat">شروع مکالمه</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = data.map(conn => {
            const otherUser = conn.user1?.id === currentUser?.id ? conn.user2 : conn.user1;
            return `
                <div class="connection-item">
                    <img src="${otherUser?.avatar || '/public/img/default-avatar.png'}" alt="آواتار" class="conn-avatar">
                    <div class="conn-info">
                        <div class="conn-name">${otherUser?.username || 'نامشخص'}</div>
                        <div class="conn-detail">
                            <span class="conn-level">${otherUser?.level || 'A1'}</span>
                            <span class="conn-date">${formatDate(conn.started_at)}</span>
                        </div>
                    </div>
                    <div class="conn-duration">${formatDuration(conn.duration_seconds)}</div>
                </div>
            `;
        }).join('');
    })
    .catch(() => {
        // خطا را نادیده بگیر
    });
}

// ==========================================
// توابع کمکی
// ==========================================

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = (now - d) / (1000 * 60 * 60 * 24);
    if (diff < 1) return 'امروز';
    if (diff < 2) return 'دیروز';
    if (diff < 7) return `${Math.floor(diff)} روز پیش`;
    return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
}

function formatDuration(seconds) {
    if (!seconds) return '۰ ثانیه';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) return `${m} دقیقه ${s} ثانیه`;
    return `${s} ثانیه`;
}

function showToast(message, type) {
    const existing = document.querySelector('.custom-toast');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    
    const colors = {
        success: 'linear-gradient(135deg, #22C55E, #16A34A)',
        error: 'linear-gradient(135deg, #EF4444, #DC2626)',
        warning: 'linear-gradient(135deg, #F59E0B, #D97706)',
        info: 'linear-gradient(135deg, #7C3AED, #6D28D9)'
    };
    toast.style.background = colors[type] || colors.info;
    toast.style.cssText += `
        position: fixed;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        padding: 0.8rem 1.5rem;
        border-radius: 12px;
        color: #fff;
        font-family: 'Vazirmatn', sans-serif;
        font-weight: 500;
        font-size: 0.9rem;
        z-index: 9999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        animation: slideUp 0.4s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ==========================================
// راه‌اندازی
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
});