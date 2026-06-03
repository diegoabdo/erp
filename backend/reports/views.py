from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from orders.models import Order, OrderItem
from products.models import Product
from crm.models import Customer


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def sales_summary(request):
    """Resumen de ventas por fecha"""
    orders = Order.objects.all()
    
    # Agrupar por fecha
    sales_by_date = orders.values('created_at__date').annotate(
        total_sales=Sum('total'),
        order_count=Count('id')
    ).order_by('-created_at__date')[:30]
    
    return Response({
        'results': list(sales_by_date),
        'total_revenue': sum(item['total_sales'] for item in sales_by_date),
        'total_orders': sum(item['order_count'] for item in sales_by_date),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def top_products(request):
    """Productos más vendidos"""
    top_products = OrderItem.objects.values('product__id', 'product__name').annotate(
        quantity_sold=Sum('quantity'),
        revenue=Sum('total')
    ).order_by('-quantity_sold')[:20]
    
    return Response({'results': list(top_products)})


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def low_stock(request):
    """Productos con bajo inventario"""
    low_stock_products = Product.objects.filter(stock__lt=5).values(
        'id', 'name', 'stock'
    ).order_by('stock')
    
    return Response({
        'results': list(low_stock_products),
        'count': low_stock_products.count(),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def orders_by_status(request):
    """Pedidos agrupados por estado"""
    orders_status = Order.objects.values('status__name').annotate(
        order_count=Count('id')
    ).order_by('-order_count')
    
    return Response({'results': list(orders_status)})


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def customers_summary(request):
    """Resumen de clientes"""
    total_customers = Customer.objects.count()
    
    # Clientes con más de un pedido
    repeat_customers = Customer.objects.annotate(
        order_count=Count('order')
    ).filter(order_count__gt=1).count()
    
    # Clientes nuevos en el último mes
    one_month_ago = timezone.now() - timedelta(days=30)
    new_customers = Customer.objects.filter(created_at__gte=one_month_ago).count()
    
    return Response({
        'total_customers': total_customers,
        'repeat_customers': repeat_customers,
        'new_customers_this_month': new_customers,
    })
