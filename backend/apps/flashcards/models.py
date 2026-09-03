from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Deck(models.Model):
    """مدل دک (مجموعه کارت‌ها)"""
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='decks')
    name = models.CharField(max_length=100, verbose_name='نام دک')
    description = models.TextField(blank=True, verbose_name='توضیحات')
    icon = models.CharField(max_length=50, default='fa-layer-group', verbose_name='آیکون')
    color = models.CharField(max_length=20, default='#7C3AED', verbose_name='رنگ')
    
    is_default = models.BooleanField(default=False, verbose_name='پیش‌فرض')
    is_active = models.BooleanField(default=True, verbose_name='فعال')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'flashcard_decks'
        ordering = ['-created_at']
        verbose_name = 'دک'
        verbose_name_plural = 'دک‌ها'
    
    def __str__(self):
        return f"{self.name} ({self.user.username})"
    
    @property
    def card_count(self):
        return self.cards.count()
    
    @property
    def due_count(self):
        now = timezone.now().date()
        return self.cards.filter(
            models.Q(status='new') | 
            models.Q(next_review__lte=now)
        ).count()


class Card(models.Model):
    """مدل کارت فلش‌کارت"""
    
    STATUS_CHOICES = (
        ('new', 'تازه'),
        ('learning', 'در حال یادگیری'),
        ('mastered', 'مسلط'),
        ('expert', 'حرفه‌ای'),
    )
    
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE, related_name='cards')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='flashcards')
    
    # محتوای کارت
    front = models.CharField(max_length=500, verbose_name='سمت اول (کرهای)')
    back = models.CharField(max_length=500, verbose_name='سمت دوم (فارسی)')
    hint = models.CharField(max_length=200, blank=True, verbose_name='راهنما')
    
    # الگوریتم SM-2
    ease_factor = models.FloatField(default=2.5, verbose_name='ضریب آسانی')
    interval = models.IntegerField(default=0, verbose_name='فاصله (روز)')
    repetitions = models.IntegerField(default=0, verbose_name='تعداد تکرار')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new', verbose_name='وضعیت')
    
    # تاریخ‌ها
    last_reviewed = models.DateTimeField(null=True, blank=True, verbose_name='آخرین مرور')
    next_review = models.DateField(null=True, blank=True, verbose_name='مرور بعدی')
    
    # آمار
    correct_count = models.IntegerField(default=0, verbose_name='تعداد صحیح')
    wrong_count = models.IntegerField(default=0, verbose_name='تعداد اشتباه')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'flashcard_cards'
        ordering = ['next_review', '-created_at']
        verbose_name = 'کارت'
        verbose_name_plural = 'کارت‌ها'
    
    def __str__(self):
        return f"{self.front} → {self.back}"
    
    def is_due(self):
        """آیا کارت قابل مرور است؟"""
        if self.status == 'new':
            return True
        if not self.next_review:
            return True
        return self.next_review <= timezone.now().date()
    
    def review(self, quality):
        """
        مرور کارت با الگوریتم SM-2
        quality: 0=دوباره, 1=سخت, 2=خوب, 3=آسان
        """
        q = max(0, min(3, quality))
        
        if q == 0:
            # دوباره: ریست می‌شود
            self.repetitions = 0
            self.interval = 0
            self.status = 'new'
            self.wrong_count += 1
        else:
            # محاسبه فاکتور آسانی
            if self.repetitions == 0:
                self.ease_factor = 2.5
            else:
                self.ease_factor = max(1.3, self.ease_factor + (0.1 - (4 - q) * 0.05))
            
            # محاسبه فاصله
            if self.repetitions == 0:
                self.interval = 1
            elif self.repetitions == 1:
                self.interval = 3
            else:
                self.interval = round(self.interval * self.ease_factor)
            
            self.repetitions += 1
            self.correct_count += 1
            
            # تعیین وضعیت
            if self.repetitions >= 5 and self.ease_factor >= 2.5:
                self.status = 'expert'
            elif self.repetitions >= 3:
                self.status = 'mastered'
            else:
                self.status = 'learning'
        
        self.last_reviewed = timezone.now()
        self.next_review = timezone.now().date() + timezone.timedelta(days=self.interval)
        self.save()
        
        return self.status