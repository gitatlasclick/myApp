from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """مدل کاربر سفارشی"""
    
    # فیلدهای اضافی
    phone = models.CharField(_('شماره تلفن'), max_length=15, blank=True, null=True)
    avatar = models.ImageField(_('تصویر پروفایل'), upload_to='avatars/', blank=True, null=True)
    
    # سطح زبان
    LEVEL_CHOICES = (
        ('beginner', 'مبتدی'),
        ('elementary', 'ابتدایی'),
        ('intermediate', 'متوسط'),
        ('advanced', 'پیشرفته'),
        ('expert', 'حرفه‌ای'),
    )
    level = models.CharField(_('سطح'), max_length=20, choices=LEVEL_CHOICES, default='beginner')
    
    # آمار
    study_streak = models.IntegerField(_('روزهای پیاپی'), default=0)
    total_study_time = models.IntegerField(_('کل زمان مطالعه (دقیقه)'), default=0)
    last_study_date = models.DateField(_('آخرین مطالعه'), blank=True, null=True)
    
    # تاریخ ثبت‌نام
    created_at = models.DateTimeField(_('تاریخ ثبت‌نام'), auto_now_add=True)
    updated_at = models.DateTimeField(_('آخرین بروزرسانی'), auto_now=True)
    
    # فیلدهای اضافی برای کاربری
    bio = models.TextField(_('بیوگرافی'), blank=True, max_length=500)
    instagram = models.URLField(_('اینستاگرام'), blank=True, null=True)
    telegram = models.URLField(_('تلگرام'), blank=True, null=True)
    
    class Meta:
        db_table = 'users'
        verbose_name = _('کاربر')
        verbose_name_plural = _('کاربران')
        ordering = ['-date_joined']

    def __str__(self):
        return self.username
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username
    
    @property
    def avatar_url(self):
        if self.avatar:
            return self.avatar.url
        return None


class UserProgress(models.Model):
    """مدل پیشرفت کاربر در دوره‌ها"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    
    # شناسه دوره و درس
    course_id = models.CharField(max_length=50)  # e.g., 'hangul', 'grammar', 'topik1'
    lesson_id = models.CharField(max_length=50)  # e.g., 'u1l', 'lesson1', 'l1-01'
    lesson_title = models.CharField(max_length=200, blank=True)
    
    # وضعیت
    completed = models.BooleanField(default=False)
    score = models.IntegerField(default=0)
    attempts = models.IntegerField(default=0)
    
    # تاریخ
    completed_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_progress'
        unique_together = ['user', 'course_id', 'lesson_id']
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.course_id}/{self.lesson_id}"


class UserBadge(models.Model):
    """مدل نشان‌های کاربر"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='badges')
    badge_id = models.CharField(max_length=50)
    badge_name = models.CharField(max_length=100)
    badge_icon = models.CharField(max_length=50)  # Font Awesome class
    badge_color = models.CharField(max_length=20, default='#7C3AED')
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_badges'
        unique_together = ['user', 'badge_id']
    
    def __str__(self):
        return f"{self.user.username} - {self.badge_name}"