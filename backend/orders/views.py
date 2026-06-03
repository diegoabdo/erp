from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db import transaction
from .models import Order, OrderStatus, PaymentMethod, OrderStatusHistory
from .serializers import OrderSerializer, OrderCreateSerializer, OrderStatusSerializer, PaymentMethodSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filterset_fields = ['status']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    @action(detail=True, methods=['patch'])
    @transaction.atomic
    def change_status(self, request, pk=None):
        """Cambiar estado del pedido"""
        order = self.get_object()
        new_status_id = request.data.get('status_id')
        notes = request.data.get('notes', '')
        
        if not new_status_id:
            return Response(
                {'error': 'Se requiere status_id'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            new_status = OrderStatus.objects.get(id=new_status_id)
        except OrderStatus.DoesNotExist:
            return Response(
                {'error': 'Estado no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Validar que no sea el mismo estado
        if order.status.id == new_status.id:
            return Response(
                {'error': 'El pedido ya tiene este estado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Si cambia a Confirmado, descontar inventario
        if new_status.slug == 'confirmado' and order.status.slug != 'confirmado':
            from inventory.models import InventoryMovement
            from products.models import Product, ProductBundle
            
            for item in order.items.all():
                if item.product:
                    product = item.product
                    product.stock -= item.quantity
                    product.save()
                    
                    InventoryMovement.objects.create(
                        product=product,
                        movement_type='OUT',
                        quantity=item.quantity,
                        reason=f'Descuento por pedido {order.short_id}',
                        order=order,
                        created_by=request.user
                    )
                
                elif item.bundle:
                    for bundle_item in item.bundle.items.all():
                        product = bundle_item.product
                        qty = bundle_item.quantity * item.quantity
                        product.stock -= qty
                        product.save()
                        
                        InventoryMovement.objects.create(
                            product=product,
                            movement_type='OUT',
                            quantity=qty,
                            reason=f'Descuento por combo en pedido {order.short_id}',
                            order=order,
                            created_by=request.user
                        )
        
        # Cambiar estado
        order.status = new_status
        order.save()
        
        # Crear historial
        OrderStatusHistory.objects.create(
            order=order,
            status=new_status,
            notes=notes,
            created_by=request.user
        )
        
        serializer = OrderSerializer(order)
        return Response({
            'message': f'Pedido actualizado a {new_status.name}',
            'order': serializer.data
        })
    
    @action(detail=True, methods=['patch'])
    def upload_prepared_image(self, request, pk=None):
        """Subir imagen del pedido preparado"""
        order = self.get_object()
        
        if 'image' not in request.FILES:
            return Response(
                {'error': 'No se proporcionó imagen'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.prepared_image = request.FILES['image']
        order.save()
        
        serializer = OrderSerializer(order)
        return Response({
            'message': 'Imagen subida exitosamente',
            'order': serializer.data
        })


class OrderStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = OrderStatus.objects.all()
    serializer_class = OrderStatusSerializer
    permission_classes = [IsAuthenticated]


class PaymentMethodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PaymentMethod.objects.filter(is_active=True)
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]
