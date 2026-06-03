from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import InventoryMovement
from .serializers import InventoryMovementSerializer


class InventoryMovementViewSet(viewsets.ModelViewSet):
    queryset = InventoryMovement.objects.all()
    serializer_class = InventoryMovementSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filterset_fields = ['movement_type', 'product']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get products with low stock"""
        from products.models import Product
        low_stock_products = Product.objects.filter(stock__lt=5)
        return Response({
            'count': low_stock_products.count(),
            'products': [
                {'id': p.id, 'name': p.name, 'stock': p.stock}
                for p in low_stock_products
            ]
        })
