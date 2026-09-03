/**
 * فایل JavaScript احراز هویت - سایت آموزش کرهای
 * شامل: نمایش/مخفی رمز، اعتبارسنجی، پیام‌ها
 */

// ============================================
// ۱. نمایش/مخفی کردن رمز عبور
// ============================================
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    const button = input.parentElement.querySelector('.toggle-password');
    if (button) {
        const icon = button.querySelector('i');
        if (icon) {
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        }
    }
}

// اتصال به دکمه‌های toggle در تمام صفحات
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.closest('.input-wrapper').querySelector('input');
            if (input) {
                const isPassword = input.type === 'password';
                input.type = isPassword ? 'text' : 'password';
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
                }
            }
        });
    });
});

// ============================================
// ۲. اعتبارسنجی سمت کلاینت برای ثبت‌نام
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;
    
    signupForm.addEventListener('submit', function(e) {
        const password1 = document.getElementById('password1');
        const password2 = document.getElementById('password2');
        
        if (password1 && password2 && password1.value !== password2.value) {
            e.preventDefault();
            alert('⚠️ رمز عبور و تکرار آن مطابقت ندارند!');
            password2.focus();
            password2.style.borderColor = '#EF4444';
            return false;
        }
        
        if (password1 && password1.value.length < 6) {
            e.preventDefault();
            alert('⚠️ رمز عبور باید حداقل ۶ کاراکتر باشد!');
            password1.focus();
            password1.style.borderColor = '#EF4444';
            return false;
        }
    });
});

// ============================================
// ۳. حذف خودکار پیام‌های موفقیت
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert-success');
    alerts.forEach((alert, index) => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000 + (index * 300));
    });
});

// ============================================
// ۴. جلوگیری از ارسال مجدد فرم
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const btn = this.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال پردازش...';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                }, 3000);
            }
        });
    });
});

console.log('✅ auth.js بارگذاری شد!');