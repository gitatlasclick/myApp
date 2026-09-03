from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

# ==========================================
# ✅ ویوهای صفحات
# ==========================================

class HomePageView(TemplateView):
    template_name = 'index.html'

class FlashcardsIndexView(TemplateView):
    template_name = 'pages/flashcards/index.html'

class FlashcardsStudyView(TemplateView):
    template_name = 'pages/flashcards/study.html'

class FlashcardsDeckView(TemplateView):
    template_name = 'pages/flashcards/deck.html'

class HangulView(TemplateView):
    template_name = 'pages/hangul/index.html'

class GrammarView(TemplateView):
    template_name = 'pages/grammar/index.html'

class TopikView(TemplateView):
    template_name = 'pages/topik-course/index.html'

class GKSView(TemplateView):
    template_name = 'pages/gks-guide.html'

class BlogView(TemplateView):
    template_name = 'pages/blog-list.html'

class AboutView(TemplateView):
    template_name = 'pages/about.html'

class ContactView(TemplateView):
    template_name = 'pages/contact.html'

class ProfileView(TemplateView):
    template_name = 'pages/auth/profile.html'

class LoginView(TemplateView):
    template_name = 'pages/auth/login.html'

class SignupView(TemplateView):
    template_name = 'pages/auth/signup.html'

class SpeakingView(TemplateView):
    template_name = 'pages/speaking.html'

class VocabularyView(TemplateView):
    template_name = 'pages/vocabulary/index.html'

class CollocationView(TemplateView):
    template_name = 'pages/collocation.html'

class PlacementTestView(TemplateView):
    template_name = 'pages/placement-test/index.html'


# ==========================================
# ✅ URL Patterns
# ==========================================

urlpatterns = [
    path('admin/', admin.site.urls),

    # API
    path('api/auth/', include('apps.accounts.urls')),
    path('api/flashcards/', include('apps.flashcards.urls')),

    # Home
    path('', HomePageView.as_view(), name='home'),

    # Flashcards
    path('flashcards/', FlashcardsIndexView.as_view(), name='flashcards'),
    path('flashcards/study/', FlashcardsStudyView.as_view(), name='flashcards-study'),
    path('flashcards/deck/', FlashcardsDeckView.as_view(), name='flashcards-deck'),

    # Courses
    path('hangul/', HangulView.as_view(), name='hangul'),
    path('grammar/', GrammarView.as_view(), name='grammar'),
    path('topik/', TopikView.as_view(), name='topik'),
    path('speaking/', SpeakingView.as_view(), name='speaking'),
    path('vocabulary/', VocabularyView.as_view(), name='vocabulary'),
    path('collocation/', CollocationView.as_view(), name='collocation'),
    path('placement-test/', PlacementTestView.as_view(), name='placement-test'),

    # GKS
    path('gks/', GKSView.as_view(), name='gks'),

    # Blog
    path('blog/', BlogView.as_view(), name='blog'),

    # Static Pages
    path('about/', AboutView.as_view(), name='about'),
    path('contact/', ContactView.as_view(), name='contact'),

    # Auth
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/signup/', SignupView.as_view(), name='signup'),
    path('auth/profile/', ProfileView.as_view(), name='profile'),
]

# ==========================================
# ✅ سرویس فایل‌های استاتیک
# ==========================================
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)