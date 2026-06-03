from django.contrib import admin
from .models import Category, Product, ProductBundle, ProductBundleItem


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'stock', 'is_active', 'is_public', 'is_featured')
    list_filter = ('category', 'is_active', 'is_public', 'is_featured', 'created_at')
    search_fields = ('name', 'slug', 'description')
    prepopulated_fields = {'slug': ('name',)}
    fieldsets = (
        ('Información', {'fields': ('name', 'slug', 'description', 'image')}),
        ('Categoría', {'fields': ('category',)}),
        ('Precio y Stock', {'fields': ('price', 'stock')}),
        ('Metadatos', {'fields': ('occasion', 'recipient_type', 'tags')}),
        ('Estado', {'fields': ('is_active', 'is_public', 'is_featured')}),
    )


@admin.register(ProductBundle)
class ProductBundleAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_active', 'is_public')
    list_filter = ('is_active', 'is_public', 'created_at')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(ProductBundleItem)
class ProductBundleItemAdmin(admin.ModelAdmin):
    list_display = ('bundle', 'product', 'quantity')
    list_filter = ('bundle',)
    search_fields = ('bundle__name', 'product__name')
