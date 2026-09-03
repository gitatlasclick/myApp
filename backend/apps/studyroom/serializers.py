# backend/apps/studyroom/serializers.py

from rest_framework import serializers
from .models import Room, RoomMember, RoomMessage, RoomReport, RoomBlock, RoomMute
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar']


class RoomMemberSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only=True)
    user_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = RoomMember
        fields = ['id', 'user', 'user_id', 'role', 'status', 'xp', 'weekly_xp', 
                  'study_time_today', 'study_streak', 'is_studying', 'joined_at']


class RoomSerializer(serializers.ModelSerializer):
    members = RoomMemberSerializer(many=True, read_only=True)
    member_count = serializers.SerializerMethodField()
    leader = serializers.SerializerMethodField()
    moderator = serializers.SerializerMethodField()
    mentor = serializers.SerializerMethodField()
    
    class Meta:
        model = Room
        fields = ['id', 'name', 'description', 'level', 'status', 'max_members', 
                  'current_members', 'member_count', 'daily_mission', 'mission_progress',
                  'total_xp', 'weekly_xp_goal', 'weekly_xp_current', 'weekly_progress_percent',
                  'members', 'leader', 'moderator', 'mentor', 'created_at']
    
    def get_member_count(self, obj):
        return obj.members.count()
    
    def get_leader(self, obj):
        leader = obj.members.filter(role='leader').first()
        if leader:
            return RoomMemberSerializer(leader).data
        return None
    
    def get_moderator(self, obj):
        mod = obj.members.filter(role='moderator').first()
        if mod:
            return RoomMemberSerializer(mod).data
        return None
    
    def get_mentor(self, obj):
        mentor = obj.members.filter(role='mentor').first()
        if mentor:
            return RoomMemberSerializer(mentor).data
        return None


class RoomMessageSerializer(serializers.ModelSerializer):
    user = UserSimpleSerializer(read_only=True)
    is_own = serializers.SerializerMethodField()
    
    class Meta:
        model = RoomMessage
        fields = ['id', 'room', 'user', 'message_type', 'content', 
                  'is_pinned', 'is_deleted', 'is_own', 'created_at']
        read_only_fields = ['room', 'user', 'created_at']
    
    def get_is_own(self, obj):
        request = self.context.get('request')
        if request and request.user:
            return obj.user.id == request.user.id
        return False