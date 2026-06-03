from django.contrib import admin
from .models import InventoryMovement


@admin.register(InventoryMovement)
class InventoryMovementAdmin(admin.ModelAdmin):
    list_display = ('product', 'movement_type', 'quantity', 'reason', 'created_at')
    list_filter = ('movement_type', 'created_at')
    search_fields = ('product__name', 'reason')
    readonly_fields = ('created_at',)
