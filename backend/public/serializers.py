from rest_framework import serializers
from products.models import Product, ProductBundle
from orders.models import Order, OrderItem, OrderStatusHistory
from crm.models import Customer


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField(required=False, allow_null=True)
    bundle_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, default=1)
    
    def validate(self, data):
        if not data.get('product_id') and not data.get('bundle_id'):
            raise serializers.ValidationError('Debe proporcionar product_id o bundle_id')
        return data


class PublicOrderCreateSerializer(serializers.Serializer):
    # Datos del comprador
    buyer_name = serializers.CharField(max_length=255)
    buyer_email = serializers.EmailField(required=False, allow_blank=True)
    buyer_phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    
    # Datos del destinatario
    recipient_name = serializers.CharField(max_length=255)
    recipient_phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    delivery_address = serializers.CharField()
    delivery_date = serializers.DateField()
    delivery_time = serializers.CharField(max_length=50, required=False, allow_blank=True)
    
    # Regalo
    gift_message = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    # Método de pago
    payment_method_id = serializers.IntegerField()
    
    # Items
    items = OrderItemInputSerializer(many=True)
    
    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError('El pedido debe tener al menos un item')
        return items
    
    def create(self, validated_data):
        from orders.models import OrderStatus, PaymentMethod
        
        # Obtener customer o crear uno
        customer_data = {
            'first_name': validated_data['buyer_name'].split()[0],
            'last_name': ' '.join(validated_data['buyer_name'].split()[1:]) if len(validated_data['buyer_name'].split()) > 1 else '',
            'email': validated_data.get('buyer_email', ''),
            'phone': validated_data.get('buyer_phone', ''),
        }
        customer, _ = Customer.objects.get_or_create(
            email=validated_data.get('buyer_email', ''),
            defaults=customer_data
        )
        
        # Obtener estado inicial y método de pago
        initial_status = OrderStatus.objects.get(is_initial=True)
        payment_method = PaymentMethod.objects.get(id=validated_data['payment_method_id'])
        
        # Validar stock
        subtotal = 0
        items_to_create = []
        
        for item_data in validated_data['items']:
            if item_data.get('product_id'):
                product = Product.objects.get(id=item_data['product_id'])
                quantity = item_data['quantity']
                
                if product.stock < quantity:
                    raise serializers.ValidationError(
                        f'Stock insuficiente de "{product.name}". Disponible: {product.stock}'
                    )
                
                price = product.price
                total = price * quantity
                subtotal += total
                
                items_to_create.append({
                    'product': product,
                    'name': product.name,
                    'price': price,
                    'quantity': quantity,
                    'total': total,
                })
            
            elif item_data.get('bundle_id'):
                bundle = ProductBundle.objects.get(id=item_data['bundle_id'])
                quantity = item_data['quantity']
                
                # Validar stock de items en el combo
                for bundle_item in bundle.items.all():
                    if bundle_item.product.stock < (bundle_item.quantity * quantity):
                        raise serializers.ValidationError(
                            f'Stock insuficiente de "{bundle_item.product.name}" en el combo "{bundle.name}"'
                        )
                
                price = bundle.price
                total = price * quantity
                subtotal += total
                
                items_to_create.append({
                    'bundle': bundle,
                    'name': bundle.name,
                    'price': price,
                    'quantity': quantity,
                    'total': total,
                })
        
        # Crear pedido
        shipping_cost = 0  # Podría ser dinámico según dirección
        total = subtotal + shipping_cost
        
        order = Order.objects.create(
            customer=customer,
            status=initial_status,
            payment_method=payment_method,
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            total=total,
            delivery_address=validated_data['delivery_address'],
            delivery_date=validated_data['delivery_date'],
            delivery_time=validated_data.get('delivery_time', ''),
            recipient_name=validated_data['recipient_name'],
            recipient_phone=validated_data.get('recipient_phone', ''),
            gift_message=validated_data.get('gift_message', ''),
            notes=validated_data.get('notes', ''),
        )
        
        # Crear items del pedido
        for item_data in items_to_create:
            OrderItem.objects.create(
                order=order,
                product=item_data.get('product'),
                bundle=item_data.get('bundle'),
                name_snapshot=item_data['name'],
                unit_price=item_data['price'],
                quantity=item_data['quantity'],
                total=item_data['total'],
            )
        
        # Crear historial inicial
        OrderStatusHistory.objects.create(
            order=order,
            status=initial_status,
            notes='Pedido creado automáticamente desde tienda pública'
        )
        
        return order


class OrderItemDisplaySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('name_snapshot', 'unit_price', 'quantity', 'total')


class OrderStatusHistoryDisplaySerializer(serializers.ModelSerializer):
    status_name = serializers.CharField(source='status.name', read_only=True)
    
    class Meta:
        model = OrderStatusHistory
        fields = ('status_name', 'notes', 'created_at')


class PublicOrderSerializer(serializers.ModelSerializer):
    items = OrderItemDisplaySerializer(many=True, read_only=True)
    status_name = serializers.CharField(source='status.name', read_only=True)
    history = OrderStatusHistoryDisplaySerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = (
            'short_id', 'status_name', 'recipient_name', 'delivery_date',
            'gift_message', 'prepared_image', 'items', 'history', 'total'
        )
        read_only_fields = ('short_id', 'status_name', 'items', 'history')
