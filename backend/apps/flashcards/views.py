from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils import timezone
from .models import Deck, Card
from .serializers import (
    DeckSerializer, CardSerializer, 
    CreateDeckSerializer, CreateCardSerializer,
    ReviewSerializer
)


class DeckListView(APIView):
    """لیست دک‌ها"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        decks = Deck.objects.filter(user=request.user, is_active=True)
        serializer = DeckSerializer(decks, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = CreateDeckSerializer(data=request.data)
        if serializer.is_valid():
            deck = serializer.save(user=request.user)
            return Response(DeckSerializer(deck).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeckDetailView(APIView):
    """جزئیات یک دک"""
    permission_classes = [IsAuthenticated]
    
    def get_object(self, deck_id, user):
        try:
            return Deck.objects.get(id=deck_id, user=user)
        except Deck.DoesNotExist:
            return None
    
    def get(self, request, deck_id):
        deck = self.get_object(deck_id, request.user)
        if not deck:
            return Response({'error': 'دک یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
        serializer = DeckSerializer(deck)
        return Response(serializer.data)
    
    def put(self, request, deck_id):
        deck = self.get_object(deck_id, request.user)
        if not deck:
            return Response({'error': 'دک یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CreateDeckSerializer(deck, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(DeckSerializer(deck).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, deck_id):
        deck = self.get_object(deck_id, request.user)
        if not deck:
            return Response({'error': 'دک یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
        deck.delete()
        return Response({'message': 'دک حذف شد'}, status=status.HTTP_200_OK)


class CardListView(APIView):
    """لیست کارت‌های یک دک"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, deck_id):
        try:
            deck = Deck.objects.get(id=deck_id, user=request.user)
        except Deck.DoesNotExist:
            return Response({'error': 'دک یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
        
        status_filter = request.query_params.get('status', None)
        cards = deck.cards.all()
        if status_filter and status_filter != 'all':
            cards = cards.filter(status=status_filter)
        
        serializer = CardSerializer(cards, many=True)
        return Response(serializer.data)
    
    def post(self, request, deck_id):
        try:
            deck = Deck.objects.get(id=deck_id, user=request.user)
        except Deck.DoesNotExist:
            return Response({'error': 'دک یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        data['deck'] = deck_id
        data['user'] = request.user.id
        
        serializer = CreateCardSerializer(data=data)
        if serializer.is_valid():
            card = serializer.save(deck=deck, user=request.user)
            return Response(CardSerializer(card).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CardDetailView(APIView):
    """جزئیات یک کارت"""
    permission_classes = [IsAuthenticated]
    
    def get_object(self, card_id, user):
        try:
            return Card.objects.get(id=card_id, user=user)
        except Card.DoesNotExist:
            return None
    
    def get(self, request, card_id):
        card = self.get_object(card_id, request.user)
        if not card:
            return Response({'error': 'کارت یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CardSerializer(card)
        return Response(serializer.data)
    
    def put(self, request, card_id):
        card = self.get_object(card_id, request.user)
        if not card:
            return Response({'error': 'کارت یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = CreateCardSerializer(card, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(CardSerializer(card).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, card_id):
        card = self.get_object(card_id, request.user)
        if not card:
            return Response({'error': 'کارت یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
        card.delete()
        return Response({'message': 'کارت حذف شد'}, status=status.HTTP_200_OK)


class ReviewView(APIView):
    """مرور کارت با الگوریتم SM-2"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = ReviewSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            card = Card.objects.get(
                id=serializer.validated_data['card_id'],
                user=request.user
            )
        except Card.DoesNotExist:
            return Response({'error': 'کارت یافت نشد'}, status=status.HTTP_404_NOT_FOUND)
        
        quality = serializer.validated_data['quality']
        new_status = card.review(quality)
        
        return Response({
            'message': 'مرور با موفقیت ثبت شد',
            'status': new_status,
            'next_review': card.next_review,
            'interval': card.interval,
            'repetitions': card.repetitions
        })


class DueCardsView(APIView):
    """کارت‌های قابل مرور امروز"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        now = timezone.now().date()
        cards = Card.objects.filter(
            user=request.user
        ).filter(
            Q(status='new') | 
            Q(next_review__lte=now)
        ).order_by('next_review', 'created_at')
        
        deck_id = request.query_params.get('deck_id', None)
        if deck_id:
            cards = cards.filter(deck_id=deck_id)
        
        serializer = CardSerializer(cards, many=True)
        return Response(serializer.data)


class StatsView(APIView):
    """آمار کاربر"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        cards = Card.objects.filter(user=request.user)
        decks = Deck.objects.filter(user=request.user)
        now = timezone.now().date()
        
        total = cards.count()
        
        return Response({
            'total': total,
            'new': cards.filter(status='new').count(),
            'learning': cards.filter(status='learning').count(),
            'mastered': cards.filter(status='mastered').count(),
            'expert': cards.filter(status='expert').count(),
            'due_today': cards.filter(Q(status='new') | Q(next_review__lte=now)).count(),
            'decks_count': decks.count(),
            'accuracy': self.get_accuracy(cards)
        })
    
    def get_accuracy(self, cards):
        correct = sum(c.correct_count for c in cards)
        wrong = sum(c.wrong_count for c in cards)
        total = correct + wrong
        return round((correct / total) * 100) if total > 0 else 0