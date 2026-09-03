from django.contrib import admin
from .models import Room, RoomMember, RoomMessage, RoomReport, RoomBlock, RoomMute

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'status', 'current_members', 'max_members', 'created_at')
    list_filter = ('level', 'status')
    search_fields = ('name', 'description')

@admin.register(RoomMember)
class RoomMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'room', 'role', 'status', 'xp', 'is_studying')
    list_filter = ('role', 'status')
    search_fields = ('user__username', 'room__name')

@admin.register(RoomMessage)
class RoomMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'room', 'content_preview', 'message_type', 'created_at')
    list_filter = ('message_type',)
    search_fields = ('user__username', 'content')

    def content_preview(self, obj):
        return obj.content[:50]
    content_preview.short_description = 'متن پیام'