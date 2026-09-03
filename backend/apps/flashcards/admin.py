from django.contrib import admin
from .models import Deck, Card


@admin.register(Deck)
class DeckAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'card_count', 'is_default', 'created_at')
    list_filter = ('is_default', 'is_active')
    search_fields = ('name', 'user__username')


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    list_display = ('front', 'back', 'deck', 'status', 'is_due', 'next_review')
    list_filter = ('status', 'deck')
    search_fields = ('front', 'back', 'user__username')