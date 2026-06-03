from django.db import models
import uuid


def generate_short_id():
    return f"RL-{uuid.uuid4().hex[:8].upper()}"


class OrderStatus(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    is_initial = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'Estado de Pedido'
        verbose_name_plural = 'Estados de Pedido'
    
    def __str__(self):
        return self.name


class PaymentMethod(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        verbose_name = 'Método de Pago'
        verbose_name_plural = 'Métodos de Pago'
    
    def __str__(self):
        return self.name


class Order(models.Model):
    short_id = models.CharField(max_length=20, unique=True, default=generate_short_id)
    customer = models.ForeignKey('crm.Customer', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.ForeignKey('orders.OrderStatus', on_delete=models.PROTECT)
    payment_method = models.ForeignKey('orders.PaymentMethod', on_delete=models.SET_NULL, null=True, blank=True)
    
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    delivery_address = models.TextField()
    delivery_date = models.DateField(blank=True, null=True)
    delivery_time = models.CharField(max_length=50, blank=True, null=True)
    
    recipient_name = models.CharField(max_length=255)
    recipient_phone = models.CharField(max_length=30, blank=True, null=True)
    
    gift_message = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    
    prepared_image = models.ImageField(upload_to='orders/prepared/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.short_id} - {self.recipient_name}'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.SET_NULL, null=True, blank=True)
    bundle = models.ForeignKey('products.ProductBundle', on_delete=models.SET_NULL, null=True, blank=True)
    name_snapshot = models.CharField(max_length=255)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        verbose_name = 'Item de Pedido'
        verbose_name_plural = 'Items de Pedido'
    
    def __str__(self):
        return f'{self.name_snapshot} x{self.quantity}'


class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='history')
    status = models.ForeignKey('orders.OrderStatus', on_delete=models.PROTECT)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        verbose_name = 'Historial de Estado'
        verbose_name_plural = 'Historial de Estados'
        ordering = ['-created_at']
    
    def __str__(self):
        return f'{self.order.short_id} - {self.status.name}'
