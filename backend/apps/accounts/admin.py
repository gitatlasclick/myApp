from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserProgress, UserBadge


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'full_name', 'level', 'study_streak', 'date_joined')
    list_filter = ('level', 'is_active', 'is_staff')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    
    fieldsets = UserAdmin.fieldsets + (
        ('اطلاعات اضافی', {
            'fields': ('phone', 'avatar', 'level', 'bio', 'instagram', 'telegram')
        }),
        ('آمار', {
            'fields': ('study_streak', 'total_study_time', 'last_study_date')
        }),
    )


@admin.register(UserProgress)
class UserProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'course_id', 'lesson_id', 'completed', 'score', 'updated_at')
    list_filter = ('course_id', 'completed')
    search_fields = ('user__username', 'lesson_title')


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge_name', 'badge_id', 'earned_at')
    list_filter = ('badge_id',)
    search_fields = ('user__username', 'badge_name')