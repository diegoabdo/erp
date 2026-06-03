from rest_framework import serializers
from .models import InventoryMovement


class InventoryMovementSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True)
    
    class Meta:
        model = InventoryMovement
        fields = ('id', 'product', 'product_name', 'movement_type', 'quantity', 'reason', 'order', 'created_at', 'created_by', 'created_by_email')
        read_only_fields = ('created_at',)
