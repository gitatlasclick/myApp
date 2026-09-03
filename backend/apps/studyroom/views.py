# backend/apps/studyroom/views.py

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Sum
from .models import Room, RoomMember, RoomMessage
from .serializers import RoomSerializer, RoomMemberSerializer, RoomMessageSerializer


class RoomViewSet(viewsets.ModelViewSet):
    """API برای اتاق‌های مطالعه"""
    
    queryset = Room.objects.filter(status='active')
    serializer_class = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        """عضویت در اتاق"""
        room = self.get_object()
        
        if room.is_full:
            return Response({'error': 'اتاق پر است'}, status=status.HTTP_400_BAD_REQUEST)
        
        member, created = RoomMember.objects.get_or_create(
            user=request.user,
            room=room,
            defaults={'role': 'member'}
        )
        
        if created:
            room.current_members += 1
            room.save()
            return Response(RoomMemberSerializer(member).data)
        return Response({'message': 'قبلاً عضو هستید'})
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        """خروج از اتاق"""
        room = self.get_object()
        member = RoomMember.objects.filter(user=request.user, room=room).first()
        
        if not member:
            return Response({'error': 'عضو نیستید'}, status=status.HTTP_400_BAD_REQUEST)
        
        member.delete()
        room.current_members -= 1
        room.save()
        return Response({'message': 'خروج با موفقیت انجام شد'})
    
    @action(detail=True, methods=['post'])
    def start_studying(self, request, pk=None):
        """شروع مطالعه"""
        room = self.get_object()
        member = RoomMember.objects.filter(user=request.user, room=room).first()
        
        if not member:
            return Response({'error': 'عضو نیستید'}, status=status.HTTP_400_BAD_REQUEST)
        
        member.start_studying()
        return Response({'message': 'مطالعه شروع شد', 'status': member.status})
    
    @action(detail=True, methods=['post'])
    def stop_studying(self, request, pk=None):
        """پایان مطالعه"""
        room = self.get_object()
        member = RoomMember.objects.filter(user=request.user, room=room).first()
        
        if not member:
            return Response({'error': 'عضو نیستید'}, status=status.HTTP_400_BAD_REQUEST)
        
        member.stop_studying()
        return Response({'message': 'مطالعه پایان یافت', 'study_time': member.study_time_today})
    
    @action(detail=True, methods=['get'])
    def ranking(self, request, pk=None):
        """لیست رتبه‌بندی اعضا"""
        room = self.get_object()
        members = room.members.all().order_by('-xp')[:10]
        return Response(RoomMemberSerializer(members, many=True).data)
    
    @action(detail=True, methods=['get'])
    def studying_now(self, request, pk=None):
        """لیست اعضای در حال مطالعه"""
        room = self.get_object()
        studying = room.members.filter(is_studying=True)
        return Response(RoomMemberSerializer(studying, many=True).data)
    @action(detail=True, methods=['post'])
    def add_xp(self, request, pk=None):
        """
        افزودن XP به کاربر از طریق درس
        """
        room = self.get_object()
        xp_amount = request.data.get('xp', 0)
        source = request.data.get('source', 'lesson')
        
        if xp_amount <= 0:
            return Response({'error': 'XP باید بیشتر از ۰ باشد'}, status=400)
        
        member = add_xp_to_member(
            user=request.user,
            room_id=room.id,
            xp_amount=xp_amount,
            source=source
        )
        
        if not member:
            return Response({'error': 'کاربر عضو این اتاق نیست'}, status=400)
        
        # بررسی چالش
        challenge_completed = check_weekly_challenge(room.id)
        
        return Response({
            'message': f'{xp_amount} XP اضافه شد',
            'total_xp': member.xp,
            'weekly_xp': member.weekly_xp,
            'room_weekly_progress': room.weekly_progress_percent,
            'challenge_completed': challenge_completed
        })
    
    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """
        دریافت آمار کامل Room
        """
        room = self.get_object()
        stats = get_room_stats(room.id)
        
        # سریالایز کردن top_members
        top_members_data = []
        for member in stats['top_members']:
            top_members_data.append({
                'username': member.user.username,
                'xp': member.xp,
                'role': member.role,
                'is_studying': member.is_studying
            })
        
        return Response({
            'total_xp': stats['total_xp'],
            'weekly_xp': stats['weekly_xp'],
            'weekly_goal': stats['weekly_goal'],
            'weekly_progress': stats['weekly_progress'],
            'member_count': stats['member_count'],
            'studying_count': stats['studying_count'],
            'top_members': top_members_data
        })


class RoomMessageViewSet(viewsets.ModelViewSet):
    """API برای پیام‌های چت"""
    
    serializer_class = RoomMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        room_id = self.request.query_params.get('room')
        if room_id:
            return RoomMessage.objects.filter(room_id=room_id, is_deleted=False)
        return RoomMessage.objects.filter(is_deleted=False)
    
    def perform_create(self, serializer):
        room_id = self.request.data.get('room')
        room = Room.objects.get(id=room_id)
        serializer.save(user=self.request.user, room=room)