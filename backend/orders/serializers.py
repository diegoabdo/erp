from rest_framework import serializers
from .models import Order, OrderItem, OrderStatus, PaymentMethod, OrderStatusHistory



class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderStatus
        fields = ('id', 'name', 'slug')


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ('id', 'name', 'slug')


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'bundle', 'name_snapshot', 'unit_price', 'quantity', 'total')


class OrderStatusHistorySerializer(serializers.ModelSerializer):
    status_name = serializers.CharField(source='status.name', read_only=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = OrderStatusHistory
        fields = ('id', 'status', 'status_name', 'notes', 'created_at', 'created_by', 'created_by_email')
        read_only_fields = ('created_at',)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    status_name = serializers.CharField(source='status.name', read_only=True)
    customer_name = serializers.CharField(source='customer.first_name', read_only=True)
    history = OrderStatusHistorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ('id', 'short_id', 'customer', 'customer_name', 'status', 'status_name', 'payment_method',
                  'subtotal', 'shipping_cost', 'total', 'delivery_address', 'delivery_date',
                  'delivery_time', 'recipient_name', 'recipient_phone', 'gift_message',
                  'notes', 'prepared_image', 'items', 'history', 'created_at', 'updated_at')
        read_only_fields = ('short_id', 'created_at', 'updated_at')


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, write_only=True)
    
    class Meta:
        model = Order
        fields = ('recipient_name', 'recipient_phone', 'delivery_address', 'delivery_date',
                  'delivery_time', 'gift_message', 'notes', 'payment_method', 'items')
