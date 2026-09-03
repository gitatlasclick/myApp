# backend/apps/studyroom/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.flashcards.models import Card  # فرض بر اینکه مدل کارت وجود دارد
from .utils import add_xp_to_member, check_weekly_challenge, award_badge
from .models import Room, RoomMember


@receiver(post_save, sender=Card)
def card_completed_signal(sender, instance, created, **kwargs):
    """
    وقتی یک کارت کامل می‌شود، XP به Room اضافه شود
    """
    if not created and instance.completed:
        # فرض بر اینکه کاربر در یک Room عضو است
        # در نسخه واقعی باید Room کاربر را پیدا کنید
        room_id = 1  # موقت
        
        # مقدار XP بر اساس نوع کارت
        xp_amount = 10
        
        member = add_xp_to_member(
            user=instance.user,
            room_id=room_id,
            xp_amount=xp_amount,
            source='lesson'
        )
        
        if member:
            # بررسی چالش هفتگی
            if check_weekly_challenge(room_id):
                # اعطای نشان به همه اعضا
                room = Room.objects.get(id=room_id)
                for m in room.members.all():
                    award_badge(
                        member=m,
                        badge_id='weekly_champion',
                        badge_name='قهرمان هفته',
                        badge_icon='🏆'
                    )