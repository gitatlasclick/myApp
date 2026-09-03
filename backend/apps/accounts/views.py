from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User, UserProgress, UserBadge
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    ChangePasswordSerializer, UserProgressSerializer, UserBadgeSerializer
)


# ==========================================
# AUTH VIEWS
# ==========================================

class RegisterView(APIView):
    """ثبت‌نام کاربر جدید"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user, context={'request': request}).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """ورود کاربر"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            user = authenticate(username=username, password=password)
            if not user:
                return Response({
                    'error': 'نام کاربری یا رمز عبور اشتباه است.'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user, context={'request': request}).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """خروج کاربر"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({'message': 'خروج با موفقیت انجام شد.'})
        except Exception:
            return Response({'message': 'خروج با موفقیت انجام شد.'}, status=status.HTTP_200_OK)


class RefreshTokenView(APIView):
    """دریافت توکن جدید"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            token = RefreshToken(refresh_token)
            return Response({
                'access': str(token.access_token),
            })
        except Exception:
            return Response({'error': 'Invalid refresh token.'}, status=status.HTTP_401_UNAUTHORIZED)


# ==========================================
# PROFILE VIEWS
# ==========================================

class ProfileView(APIView):
    """مدیریت پروفایل کاربر"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """دریافت اطلاعات پروفایل"""
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)
    
    def put(self, request):
        """بروزرسانی کامل پروفایل"""
        serializer = UserSerializer(request.user, data=request.data, context={'request': request}, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        """بروزرسانی جزئی پروفایل"""
        serializer = UserSerializer(request.user, data=request.data, context={'request': request}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """تغییر رمز عبور"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({
                    'old_password': 'رمز عبور فعلی اشتباه است.'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'message': 'رمز عبور با موفقیت تغییر کرد.'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ==========================================
# PROGRESS VIEWS
# ==========================================

class ProgressView(APIView):
    """مدیریت پیشرفت کاربر"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """دریافت تمام پیشرفت‌ها"""
        progress = UserProgress.objects.filter(user=request.user)
        serializer = UserProgressSerializer(progress, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """افزودن یا بروزرسانی پیشرفت"""
        data = request.data.copy()
        data['user'] = request.user.id
        
        # بررسی وجود پیشرفت
        progress, created = UserProgress.objects.get_or_create(
            user=request.user,
            course_id=data.get('course_id'),
            lesson_id=data.get('lesson_id'),
            defaults={
                'lesson_title': data.get('lesson_title', ''),
                'completed': data.get('completed', False),
                'score': data.get('score', 0),
                'attempts': data.get('attempts', 0),
            }
        )
        
        if not created:
            # بروزرسانی
            progress.completed = data.get('completed', progress.completed)
            progress.score = data.get('score', progress.score)
            progress.attempts = data.get('attempts', progress.attempts) + 1
            progress.lesson_title = data.get('lesson_title', progress.lesson_title)
            if progress.completed and not progress.completed_at:
                progress.completed_at = timezone.now()
            progress.save()
        
        serializer = UserProgressSerializer(progress)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class ProgressDetailView(APIView):
    """جزئیات پیشرفت یک درس"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, course_id, lesson_id):
        try:
            progress = UserProgress.objects.get(user=request.user, course_id=course_id, lesson_id=lesson_id)
            serializer = UserProgressSerializer(progress)
            return Response(serializer.data)
        except UserProgress.DoesNotExist:
            return Response({
                'completed': False,
                'score': 0,
                'attempts': 0
            }, status=status.HTTP_200_OK)


class ProgressStatsView(APIView):
    """آمار پیشرفت کاربر"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        progress = UserProgress.objects.filter(user=request.user)
        
        total_lessons = progress.count()
        completed_lessons = progress.filter(completed=True).count()
        
        # پیشرفت هر دوره
        courses = {}
        for p in progress:
            if p.course_id not in courses:
                courses[p.course_id] = {'total': 0, 'completed': 0}
            courses[p.course_id]['total'] += 1
            if p.completed:
                courses[p.course_id]['completed'] += 1
        
        return Response({
            'total_lessons': total_lessons,
            'completed_lessons': completed_lessons,
            'completion_rate': round((completed_lessons / total_lessons * 100) if total_lessons > 0 else 0, 1),
            'courses': courses
        })


# ==========================================
# BADGE VIEWS
# ==========================================

class BadgeView(APIView):
    """مدیریت نشان‌های کاربر"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        badges = UserBadge.objects.filter(user=request.user)
        serializer = UserBadgeSerializer(badges, many=True)
        return Response(serializer.data)


# ==========================================
# IMPORT TIMEZONE
# ==========================================
from django.utils import timezone