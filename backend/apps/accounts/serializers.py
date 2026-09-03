from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, UserProgress, UserBadge


class UserSerializer(serializers.ModelSerializer):
    """سریالایزر کاربر"""
    
    full_name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'avatar', 'avatar_url', 'level', 'bio',
            'study_streak', 'total_study_time', 'last_study_date',
            'instagram', 'telegram', 'password', 'date_joined'
        ]
        read_only_fields = ['id', 'date_joined', 'study_streak', 'total_study_time']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }
    
    def get_full_name(self, obj):
        return obj.full_name
    
    def get_avatar_url(self, obj):
        request = self.context.get('request')
        if obj.avatar and request:
            return request.build_absolute_uri(obj.avatar.url)
        return None
    
    def validate_password(self, value):
        if value:
            try:
                validate_password(value)
            except ValidationError as e:
                raise serializers.ValidationError(e.messages)
        return value
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class RegisterSerializer(serializers.ModelSerializer):
    """سریالایزر ثبت‌نام"""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "رمز عبور با تکرار آن مطابقت ندارد."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """سریالایزر ورود"""
    
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class ChangePasswordSerializer(serializers.Serializer):
    """سریالایزر تغییر رمز عبور"""
    
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password_confirm": "رمز عبور جدید با تکرار آن مطابقت ندارد."})
        return attrs


class UserProgressSerializer(serializers.ModelSerializer):
    """سریالایزر پیشرفت کاربر"""
    
    class Meta:
        model = UserProgress
        fields = ['id', 'course_id', 'lesson_id', 'lesson_title', 'completed', 'score', 'attempts', 'completed_at', 'updated_at']


class UserBadgeSerializer(serializers.ModelSerializer):
    """سریالایزر نشان‌های کاربر"""
    
    class Meta:
        model = UserBadge
        fields = ['id', 'badge_id', 'badge_name', 'badge_icon', 'badge_color', 'earned_at']