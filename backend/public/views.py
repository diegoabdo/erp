from rest_framework import status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction
from products.models import Product, ProductBundle, Category
from products.serializers import ProductSerializer, ProductBundleSerializer, CategorySerializer
from orders.models import Order, PaymentMethod
from .serializers import PublicOrderCreateSerializer, PublicOrderSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def public_categories(request):
    categories = Category.objects.filter(is_active=True)
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_products(request):
    products = Product.objects.filter(is_active=True, is_public=True)
    
    # Filtros
    category = request.query_params.get('category')
    occasion = request.query_params.get('occasion')
    featured = request.query_params.get('featured')
    min_price = request.query_params.get('min_price')
    max_price = request.query_params.get('max_price')
    search = request.query_params.get('search')
    
    if category:
        products = products.filter(category__slug=category)
    if occasion:
        products = products.filter(occasion__icontains=occasion)
    if featured:
        products = products.filter(is_featured=True)
    if min_price:
        try:
            products = products.filter(price__gte=float(min_price))
        except ValueError:
            pass
    if max_price:
        try:
            products = products.filter(price__lte=float(max_price))
        except ValueError:
            pass
    if search:
        products = products.filter(name__icontains=search) | products.filter(description__icontains=search)
    
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_product_detail(request, slug):
    try:
        product = Product.objects.get(slug=slug, is_active=True, is_public=True)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Producto no encontrado'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def public_featured(request):
    products = Product.objects.filter(is_active=True, is_public=True, is_featured=True)[:10]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([AllowAny])
def public_recommendations(request):
    """Recomendador de regalos basado en ocasión, presupuesto, tipo de destinatario y preferencia"""
    occasion = request.data.get('occasion', '').lower()
    budget = request.data.get('budget', '').lower()
    recipient_type = request.data.get('recipient_type', '').lower()
    preference = request.data.get('preference', '').lower()
    
    # Mapeo de presupuestos a rangos de precio
    budget_ranges = {
        'bajo': (0, 100),
        'medio': (100, 300),
        'alto': (300, 10000),
    }
    
    price_range = budget_ranges.get(budget, (0, 10000))
    
    # Buscar productos que coincidan
    products = Product.objects.filter(
        is_active=True,
        is_public=True,
        price__gte=price_range[0],
        price__lte=price_range[1]
    )
    
    # Scoring para ordenar resultados
    scored_products = []
    
    for product in products:
        score = 0
        reason = []
        
        # Coincidencia de ocasión
        if occasion and product.occasion and occasion in product.occasion.lower():
            score += 3
            reason.append('Ocasión coincide')
        
        # Coincidencia de tipo de destinatario
        if recipient_type and product.recipient_type and recipient_type in product.recipient_type.lower():
            score += 2
            reason.append('Tipo de destinatario coincide')
        
        # Coincidencia de preferencia (tags)
        if preference:
            product_tags_lower = [tag.lower() for tag in product.tags]
            if any(preference in tag for tag in product_tags_lower):
                score += 2
                reason.append('Preferencia coincide')
        
        # Productos destacados reciben bonus
        if product.is_featured:
            score += 1
            reason.append('Producto destacado')
        
        scored_products.append({
            'product': product,
            'score': score,
            'reason': ', '.join(reason) if reason else 'Coincidencia por presupuesto',
        })
    
    # Ordenar por score descendente
    scored_products = sorted(scored_products, key=lambda x: x['score'], reverse=True)
    
    # Devolver top 10
    results = []
    for item in scored_products[:10]:
        product_data = ProductSerializer(item['product']).data
        product_data['recommendation_reason'] = item['reason']
        results.append(product_data)
    
    return Response({'results': results, 'count': len(results)})


@api_view(['GET'])
@permission_classes([AllowAny])
def public_track_order(request, short_id):
    """Seguimiento de pedido por código corto"""
    try:
        order = Order.objects.get(short_id=short_id)
        serializer = PublicOrderSerializer(order)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'error': 'Pedido no encontrado'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([AllowAny])
def payment_methods(request):
    """Obtener métodos de pago disponibles"""
    methods = PaymentMethod.objects.filter(is_active=True)
    return Response([{'id': m.id, 'name': m.name} for m in methods])


@api_view(['POST'])
@permission_classes([AllowAny])
@transaction.atomic
def public_create_order(request):
    """
    Crear pedido sin autenticación (tienda pública)
    
    Body esperado:
    {
        "buyer_name": "Juan Pérez",
        "buyer_email": "juan@email.com",
        "buyer_phone": "1234567890",
        "recipient_name": "María García",
        "recipient_phone": "0987654321",
        "delivery_address": "Calle principal 123",
        "delivery_date": "2026-06-05",
        "delivery_time": "10:00 - 14:00",
        "gift_message": "Feliz cumpleaños",
        "notes": "Ninguna",
        "payment_method_id": 1,
        "items": [
            {
                "product_id": 1,
                "quantity": 1
            }
        ]
    }
    """
    serializer = PublicOrderCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            order = serializer.save()
            response_serializer = PublicOrderSerializer(order)
            return Response(
                {
                    'success': True,
                    'message': f'Pedido creado exitosamente con código: {order.short_id}',
                    'order': response_serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'success': False, 'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
