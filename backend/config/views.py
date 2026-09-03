# ==========================================
# GENERAL VIEWS - ATLAS KOREAN
# ==========================================

from django.shortcuts import render
from django.views.generic import TemplateView
from django.http import HttpResponse
import os
from django.conf import settings


class HomePageView(TemplateView):
    """صفحه اصلی - index.html"""
    template_name = 'index.html'



class FlashcardsIndexView(TemplateView):
    template_name = 'pages/flashcards/index.html'

class FlashcardsStudyView(TemplateView):
    template_name = 'pages/flashcards/study.html'

class FlashcardsDeckView(TemplateView):
    template_name = 'pages/flashcards/deck.html'


class HangulView(TemplateView):
    """صفحه دوره هانگول"""
    template_name = 'pages/hangul/index.html'


class GrammarView(TemplateView):
    """صفحه دوره گرامر"""
    template_name = 'pages/grammar/index.html'


class TopikView(TemplateView):
    """صفحه دوره TOPIK"""
    template_name = 'pages/topik-course/index.html'


class GKSView(TemplateView):
    """صفحه راهنمای GKS"""
    template_name = 'pages/gks-guide.html'


class BlogView(TemplateView):
    """صفحه وبلاگ"""
    template_name = 'pages/blog-list.html'


class AboutView(TemplateView):
    """صفحه درباره ما"""
    template_name = 'pages/about.html'


class ContactView(TemplateView):
    """صفحه تماس با ما"""
    template_name = 'pages/contact.html'


class ProfileView(TemplateView):
    """صفحه پروفایل کاربر"""
    template_name = 'pages/auth/profile.html'


class LoginView(TemplateView):
    """صفحه ورود"""
    template_name = 'pages/auth/login.html'


class SignupView(TemplateView):
    """صفحه ثبت‌نام"""
    template_name = 'pages/auth/signup.html'


class SpeakingView(TemplateView):
    """صفحه دوره مکالمه"""
    template_name = 'pages/speaking.html'


class VocabularyView(TemplateView):
    """صفحه دوره واژگان"""
    template_name = 'pages/vocabulary/index.html'


class CollocationView(TemplateView):
    """صفحه دوره کالوکیشن"""
    template_name = 'pages/collocation.html'


class PlacementTestView(TemplateView):
    """صفحه آزمون تعیین سطح"""
    template_name = 'pages/placement-test/index.html'


# ==========================================
# ✅ این View مخصوص سرو فایل‌های استاتیک نیست
# ✅ فقط برای رندر HTML استفاده می‌شود
# ==========================================