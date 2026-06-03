from rest_framework import serializers
from .models import Category, Product, ProductBundle, ProductBundleItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'description', 'image', 'is_active', 'created_at')
        read_only_fields = ('id', 'created_at')


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = ('id', 'name', 'slug', 'description', 'image', 'price', 'stock',
                  'category', 'category_name', 'is_active', 'is_public', 'is_featured',
                  'occasion', 'recipient_type', 'tags', 'created_at')
        read_only_fields = ('id', 'created_at')


class ProductBundleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_price = serializers.DecimalField(source='product.price', read_only=True, max_digits=10, decimal_places=2)
    
    class Meta:
        model = ProductBundleItem
        fields = ('id', 'product', 'product_name', 'product_price', 'quantity')
        read_only_fields = ('id',)


class ProductBundleSerializer(serializers.ModelSerializer):
    items = ProductBundleItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = ProductBundle
        fields = ('id', 'name', 'slug', 'description', 'image', 'price', 'is_active',
                  'is_public', 'occasion', 'tags', 'items', 'created_at')
        read_only_fields = ('id', 'created_at')


class ProductBundleCreateUpdateSerializer(serializers.ModelSerializer):
    items = serializers.PrimaryKeyRelatedField(
        many=True, 
        write_only=True,
        queryset=Product.objects.all(),
        source='items'
    )
    
    class Meta:
        model = ProductBundle
        fields = ('name', 'slug', 'description', 'image', 'price', 'is_active',
                  'is_public', 'occasion', 'tags', 'items')
