# backend/apps/studyroom/models.py

from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Room(models.Model):
    """مدل اتاق مطالعه"""
    
    LEVEL_CHOICES = (
        ('A1', 'A1 - مبتدی کامل'),
        ('A2', 'A2 - مبتدی'),
        ('B1', 'B1 - متوسط'),
        ('B2', 'B2 - متوسط بالا'),
        ('C1', 'C1 - پیشرفته'),
        ('C2', 'C2 - حرفه‌ای'),
    )
    
    STATUS_CHOICES = (
        ('active', '🟢 فعال'),
        ('full', '🔴 پر'),
        ('inactive', '⚪ غیرفعال'),
    )
    
    name = models.CharField(max_length=100, verbose_name='نام اتاق')
    description = models.TextField(blank=True, verbose_name='توضیحات')
    level = models.CharField(max_length=2, choices=LEVEL_CHOICES, default='A1', verbose_name='سطح')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active', verbose_name='وضعیت')
    
    max_members = models.PositiveIntegerField(default=50, verbose_name='حداکثر اعضا')
    current_members = models.PositiveIntegerField(default=0, verbose_name='اعضای فعلی')
    
    # Mission روزانه
    daily_mission = models.TextField(blank=True, verbose_name='ماموریت روزانه')
    mission_progress = models.JSONField(default=dict, blank=True, verbose_name='پیشرفت ماموریت')
    
    # آمار
    total_xp = models.PositiveIntegerField(default=0, verbose_name='کل XP')
    weekly_xp_goal = models.PositiveIntegerField(default=10000, verbose_name='هدف هفتگی XP')
    weekly_xp_current = models.PositiveIntegerField(default=0, verbose_name='XP فعلی هفته')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    weekly_challenge_start = models.DateField(null=True, blank=True)
    weekly_challenge_end = models.DateField(null=True, blank=True)
    weekly_challenge_completed = models.BooleanField(default=False)
    weekly_challenge_badge = models.CharField(max_length=100, blank=True, default='🏆')
    
    class Meta:
        db_table = 'study_rooms'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.level})"
    
    @property
    def is_full(self):
        return self.current_members >= self.max_members
    
    @property
    def weekly_progress_percent(self):
        if self.weekly_xp_goal == 0:
            return 0
        return min(100, int((self.weekly_xp_current / self.weekly_xp_goal) * 100))


class RoomMember(models.Model):
    """مدل اعضای اتاق"""
    
    ROLE_CHOICES = (
        ('leader', '👑 Leader'),
        ('moderator', '🛡️ Moderator'),
        ('mentor', '📚 Mentor'),
        ('member', '👤 Member'),
    )
    
    STATUS_CHOICES = (
        ('offline', '⚪ آفلاین'),
        ('studying', '🟢 در حال مطالعه'),
        ('idle', '🟡 غیرفعال'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='room_memberships')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='members')
    
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member', verbose_name='نقش')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='offline', verbose_name='وضعیت')
    
    # XP و رتبه
    xp = models.PositiveIntegerField(default=0, verbose_name='XP')
    weekly_xp = models.PositiveIntegerField(default=0, verbose_name='XP هفته')
    
    # آمار مطالعه
    study_time_today = models.PositiveIntegerField(default=0, verbose_name='زمان مطالعه امروز (دقیقه)')
    study_streak = models.PositiveIntegerField(default=0, verbose_name='روزهای پیاپی')
    last_study_date = models.DateField(null=True, blank=True, verbose_name='آخرین مطالعه')
    
    # وضعیت مطالعه
    is_studying = models.BooleanField(default=False, verbose_name='در حال مطالعه')
    study_start_time = models.DateTimeField(null=True, blank=True, verbose_name='زمان شروع مطالعه')
    
    joined_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    weekly_challenge_contribution = models.PositiveIntegerField(default=0)
    badges = models.JSONField(default=list, blank=True)
    
    class Meta:
        db_table = 'room_members'
        unique_together = ['user', 'room']
        ordering = ['-xp']
    
    def __str__(self):
        return f"{self.user.username} - {self.room.name} ({self.role})"
    
    def start_studying(self):
        """شروع مطالعه"""
        self.is_studying = True
        self.status = 'studying'
        self.study_start_time = timezone.now()
        self.save()
    
    def stop_studying(self):
        """پایان مطالعه"""
        self.is_studying = False
        if self.study_start_time:
            delta = timezone.now() - self.study_start_time
            minutes = int(delta.total_seconds() / 60)
            self.study_time_today += minutes
            self.study_start_time = None
            self.status = 'offline'
            self.save()
    
    def add_xp(self, amount):
        """افزودن XP"""
        self.xp += amount
        self.weekly_xp += amount
        # افزودن به XP کلی Room
        self.room.total_xp += amount
        self.room.weekly_xp_current += amount
        self.room.save()
        self.save()


class RoomMessage(models.Model):
    """مدل پیام‌های چت"""
    
    MESSAGE_TYPES = (
        ('text', 'متن'),
        ('system', 'سیستم'),
        ('announcement', 'اعلان'),
    )
    
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='room_messages')
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='text')
    content = models.TextField(verbose_name='متن پیام')
    
    is_pinned = models.BooleanField(default=False, verbose_name='پین شده')
    is_deleted = models.BooleanField(default=False, verbose_name='حذف شده')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'room_messages'
        ordering = ['created_at']
    
    def __str__(self):
        return f"{self.user.username}: {self.content[:30]}"


class RoomReport(models.Model):
    """مدل گزارش‌ها"""
    
    REASON_CHOICES = (
        ('spam', 'اسپم'),
        ('harassment', 'آزار'),
        ('inappropriate', 'محتوای نامناسب'),
        ('other', 'سایر'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'در انتظار'),
        ('resolved', 'رسیدگی شده'),
        ('dismissed', 'رد شده'),
    )
    
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_made')
    reported_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_received')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='reports')
    message = models.ForeignKey(RoomMessage, on_delete=models.CASCADE, null=True, blank=True, related_name='reports')
    
    reason = models.CharField(max_length=20, choices=REASON_CHOICES)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'room_reports'
    
    def __str__(self):
        return f"{self.reporter.username} → {self.reported_user.username} ({self.reason})"


class RoomBlock(models.Model):
    """مدل بلاک‌ها"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocks_made')
    blocked_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blocks_received')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='blocks')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'room_blocks'
        unique_together = ['user', 'blocked_user', 'room']
    
    def __str__(self):
        return f"{self.user.username} blocked {self.blocked_user.username}"


class RoomMute(models.Model):
    """مدل میوت‌ها"""
    
    moderator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mutes_made')
    muted_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mutes_received')
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='mutes')
    
    reason = models.CharField(max_length=200, blank=True)
    expires_at = models.DateTimeField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'room_mutes'
        unique_together = ['muted_user', 'room']
    
    def is_active(self):
        return timezone.now() < self.expires_at