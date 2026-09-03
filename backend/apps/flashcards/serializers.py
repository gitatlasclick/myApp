from rest_framework import serializers
from .models import Deck, Card


class CardSerializer(serializers.ModelSerializer):
    status_label = serializers.SerializerMethodField()
    is_due = serializers.SerializerMethodField()
    deck_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Card
        fields = [
            'id', 'deck', 'deck_name', 'front', 'back', 'hint',
            'ease_factor', 'interval', 'repetitions', 'status', 'status_label',
            'last_reviewed', 'next_review', 'is_due',
            'correct_count', 'wrong_count', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'ease_factor', 'interval', 'repetitions', 'status',
            'last_reviewed', 'next_review', 'correct_count', 'wrong_count',
            'created_at', 'updated_at'
        ]
    
    def get_status_label(self, obj):
        return dict(Card.STATUS_CHOICES).get(obj.status, obj.status)
    
    def get_is_due(self, obj):
        return obj.is_due()
    
    def get_deck_name(self, obj):
        return obj.deck.name


class DeckSerializer(serializers.ModelSerializer):
    card_count = serializers.SerializerMethodField()
    due_count = serializers.SerializerMethodField()
    cards = CardSerializer(many=True, read_only=True)
    
    class Meta:
        model = Deck
        fields = [
            'id', 'name', 'description', 'icon', 'color',
            'is_default', 'is_active', 'card_count', 'due_count',
            'cards', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_card_count(self, obj):
        return obj.card_count
    
    def get_due_count(self, obj):
        return obj.due_count


class CreateDeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = ['name', 'description', 'icon', 'color']


class CreateCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['front', 'back', 'hint', 'deck']


class ReviewSerializer(serializers.Serializer):
    card_id = serializers.IntegerField()
    quality = serializers.IntegerField(min_value=0, max_value=3)