from rest_framework import viewsets, status
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Category, Product, ProductBundle, ProductBundleItem
from .serializers import (
    CategorySerializer, ProductSerializer, ProductBundleSerializer,
    ProductBundleCreateUpdateSerializer, ProductBundleItemSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filterset_fields = ['category', 'is_featured', 'occasion']
    search_fields = ['name', 'description', 'tags']
    ordering_fields = ['created_at', 'price', 'name']
    ordering = ['-created_at']
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        products = self.queryset.filter(is_featured=True)[:10]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)


class ProductBundleViewSet(viewsets.ModelViewSet):
    queryset = ProductBundle.objects.filter(is_active=True)
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    filterset_fields = ['occasion']
    search_fields = ['name', 'description', 'tags']
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProductBundleCreateUpdateSerializer
        return ProductBundleSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [IsAuthenticatedOrReadOnly()]
