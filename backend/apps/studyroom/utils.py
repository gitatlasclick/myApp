# backend/apps/studyroom/utils.py

from django.utils import timezone
from datetime import timedelta
from .models import RoomMember, Room


def add_xp_to_member(user, room_id, xp_amount, source='lesson'):
    """
    افزودن XP به عضو و بروزرسانی Room
    """
    try:
        member = RoomMember.objects.get(user=user, room_id=room_id)
    except RoomMember.DoesNotExist:
        return None

    # افزودن XP به عضو
    member.xp += xp_amount
    member.weekly_xp += xp_amount
    member.save()

    # افزودن XP به Room
    room = member.room
    room.total_xp += xp_amount
    room.weekly_xp_current += xp_amount
    room.save()

    # بروزرسانی تاریخ آخرین مطالعه
    if source == 'lesson':
        today = timezone.now().date()
        if member.last_study_date:
            if (today - member.last_study_date).days == 1:
                member.study_streak += 1
            elif (today - member.last_study_date).days > 1:
                member.study_streak = 1
        else:
            member.study_streak = 1
        member.last_study_date = today
        member.save()

    return member


def get_room_stats(room_id):
    """
    دریافت آمار کامل Room
    """
    room = Room.objects.get(id=room_id)
    members = room.members.all()
    
    return {
        'total_xp': room.total_xp,
        'weekly_xp': room.weekly_xp_current,
        'weekly_goal': room.weekly_xp_goal,
        'weekly_progress': room.weekly_progress_percent,
        'member_count': members.count(),
        'studying_count': members.filter(is_studying=True).count(),
        'top_members': members.order_by('-xp')[:10],
    }


def check_weekly_challenge(room_id):
    """
    بررسی تکمیل چالش هفتگی
    """
    room = Room.objects.get(id=room_id)
    
    if room.weekly_xp_current >= room.weekly_xp_goal:
        room.weekly_challenge_completed = True
        room.save()
        return True
    return False


def award_badge(member, badge_id, badge_name, badge_icon):
    """
    اعطای نشان به عضو
    """
    badges = member.badges or []
    
    # بررسی تکراری نبودن
    if not any(b.get('badge_id') == badge_id for b in badges):
        badges.append({
            'badge_id': badge_id,
            'badge_name': badge_name,
            'badge_icon': badge_icon,
            'earned_at': timezone.now().isoformat()
        })
        member.badges = badges
        member.save()
        return True
    return False