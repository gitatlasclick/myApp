from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # ===== AUTH =====
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', views.RefreshTokenView.as_view(), name='refresh'),
    
    # ===== PROFILE =====
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('profile/change-password/', views.ChangePasswordView.as_view(), name='change-password'),
    
    # ===== PROGRESS =====
    path('progress/', views.ProgressView.as_view(), name='progress'),
    path('progress/<str:course_id>/<str:lesson_id>/', views.ProgressDetailView.as_view(), name='progress-detail'),
    path('progress/stats/', views.ProgressStatsView.as_view(), name='progress-stats'),
    
    # ===== BADGE =====
    path('badges/', views.BadgeView.as_view(), name='badges'),
]