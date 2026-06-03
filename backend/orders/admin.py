from django.contrib import admin
from .models import Order, OrderItem, OrderStatus, PaymentMethod, OrderStatusHistory


@admin.register(OrderStatus)
class OrderStatusAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_initial')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('short_id', 'recipient_name', 'status', 'total', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('short_id', 'recipient_name', 'email')
    readonly_fields = ('short_id', 'created_at', 'updated_at')


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'name_snapshot', 'quantity', 'total')


@admin.register(OrderStatusHistory)
class OrderStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ('order', 'status', 'created_at', 'created_by')
    list_filter = ('status', 'created_at')
    readonly_fields = ('created_at',)
