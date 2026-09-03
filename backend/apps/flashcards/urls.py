from django.urls import path
from . import views

app_name = 'flashcards'

urlpatterns = [
    # Decks
    path('decks/', views.DeckListView.as_view(), name='deck-list'),
    path('decks/<int:deck_id>/', views.DeckDetailView.as_view(), name='deck-detail'),
    
    # Cards
    path('decks/<int:deck_id>/cards/', views.CardListView.as_view(), name='card-list'),
    path('cards/<int:card_id>/', views.CardDetailView.as_view(), name='card-detail'),
    
    # Study
    path('review/', views.ReviewView.as_view(), name='review'),
    path('due/', views.DueCardsView.as_view(), name='due-cards'),
    
    # Stats
    path('stats/', views.StatsView.as_view(), name='stats'),
]