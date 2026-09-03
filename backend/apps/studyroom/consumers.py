# backend/apps/studyroom/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Room, RoomMessage, RoomMember, RoomBlock, RoomMute

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'studyroom_{self.room_id}'
        
        # بررسی احراز هویت
        if not self.scope['user'].is_authenticated:
            await self.close()
            return
        
        # بررسی عضویت
        is_member = await self.is_room_member(self.scope['user'], self.room_id)
        if not is_member:
            await self.close()
            return
        
        # پیوستن به گروه
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # اطلاع به دیگران
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_join',
                'username': self.scope['user'].username
            }
        )
    
    async def disconnect(self, close_code):
        # اطلاع به دیگران
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_leave',
                    'username': self.scope['user'].username
                }
            )
            
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type', 'message')
        
        if message_type == 'message':
            content = data.get('content', '').strip()
            if not content:
                return
            
            # بررسی Mute
            is_muted = await self.is_user_muted(self.scope['user'], self.room_id)
            if is_muted:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'شما در این اتاق میوت شده‌اید'
                }))
                return
            
            # ذخیره پیام
            message = await self.save_message(
                self.scope['user'],
                self.room_id,
                content
            )
            
            # ارسال به همه
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message_id': message.id,
                    'username': self.scope['user'].username,
                    'content': content,
                    'is_system': False
                }
            )
        
        elif message_type == 'report':
            reported_username = data.get('reported_username')
            reason = data.get('reason')
            description = data.get('description', '')
            
            if reported_username and reason:
                await self.create_report(
                    self.scope['user'],
                    reported_username,
                    self.room_id,
                    reason,
                    description
                )
                await self.send(text_data=json.dumps({
                    'type': 'report_success',
                    'message': 'گزارش با موفقیت ثبت شد'
                }))
        
        elif message_type == 'block':
            blocked_username = data.get('blocked_username')
            if blocked_username:
                await self.create_block(
                    self.scope['user'],
                    blocked_username,
                    self.room_id
                )
                await self.send(text_data=json.dumps({
                    'type': 'block_success',
                    'message': f'کاربر {blocked_username} بلاک شد'
                }))
        
        elif message_type == 'mute':
            # فقط Moderator و Leader می‌توانند Mute کنند
            is_moderator = await self.is_moderator(self.scope['user'], self.room_id)
            if not is_moderator:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'شما مجوز این کار را ندارید'
                }))
                return
            
            muted_username = data.get('muted_username')
            duration_minutes = data.get('duration', 60)
            reason = data.get('reason', '')
            
            if muted_username:
                await self.create_mute(
                    self.scope['user'],
                    muted_username,
                    self.room_id,
                    duration_minutes,
                    reason
                )
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'system_message',
                        'content': f'کاربر {muted_username} به مدت {duration_minutes} دقیقه میوت شد'
                    }
                )
    
    async def chat_message(self, event):
        # ارسال پیام به کاربر
        await self.send(text_data=json.dumps({
            'type': 'message',
            'message_id': event['message_id'],
            'username': event['username'],
            'content': event['content'],
            'is_system': False,
            'is_own': self.scope['user'].username == event['username']
        }))
    
    async def user_join(self, event):
        await self.send(text_data=json.dumps({
            'type': 'system',
            'content': f'{event["username"]} به اتاق پیوست 🎉',
            'is_system': True
        }))
    
    async def user_leave(self, event):
        await self.send(text_data=json.dumps({
            'type': 'system',
            'content': f'{event["username"]} از اتاق خارج شد 👋',
            'is_system': True
        }))
    
    async def system_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'system',
            'content': event['content'],
            'is_system': True
        }))
    
    # ==========================================
    # DATABASE OPERATIONS
    # ==========================================
    
    @database_sync_to_async
    def is_room_member(self, user, room_id):
        return RoomMember.objects.filter(user=user, room_id=room_id).exists()
    
    @database_sync_to_async
    def is_moderator(self, user, room_id):
        return RoomMember.objects.filter(
            user=user,
            room_id=room_id,
            role__in=['leader', 'moderator']
        ).exists()
    
    @database_sync_to_async
    def is_user_muted(self, user, room_id):
        from django.utils import timezone
        return RoomMute.objects.filter(
            muted_user=user,
            room_id=room_id,
            expires_at__gt=timezone.now()
        ).exists()
    
    @database_sync_to_async
    def save_message(self, user, room_id, content):
        room = Room.objects.get(id=room_id)
        return RoomMessage.objects.create(
            room=room,
            user=user,
            content=content,
            message_type='text'
        )
    
    @database_sync_to_async
    def create_report(self, reporter, reported_username, room_id, reason, description):
        reported_user = User.objects.get(username=reported_username)
        room = Room.objects.get(id=room_id)
        return RoomReport.objects.create(
            reporter=reporter,
            reported_user=reported_user,
            room=room,
            reason=reason,
            description=description
        )
    
    @database_sync_to_async
    def create_block(self, user, blocked_username, room_id):
        blocked_user = User.objects.get(username=blocked_username)
        room = Room.objects.get(id=room_id)
        return RoomBlock.objects.get_or_create(
            user=user,
            blocked_user=blocked_user,
            room=room
        )
    
    @database_sync_to_async
    def create_mute(self, moderator, muted_username, room_id, duration_minutes, reason):
        from django.utils import timezone
        from datetime import timedelta
        
        muted_user = User.objects.get(username=muted_username)
        room = Room.objects.get(id=room_id)
        
        expires_at = timezone.now() + timedelta(minutes=duration_minutes)
        
        mute, created = RoomMute.objects.get_or_create(
            muted_user=muted_user,
            room=room,
            defaults={
                'moderator': moderator,
                'reason': reason,
                'expires_at': expires_at
            }
        )
        if not created:
            mute.expires_at = expires_at
            mute.reason = reason
            mute.moderator = moderator
            mute.save()
        return mute