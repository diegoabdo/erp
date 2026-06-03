from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet, ProductBundleViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'', ProductViewSet, basename='product')
router.register(r'bundles', ProductBundleViewSet, basename='bundle')

urlpatterns = [
    path('', include(router.urls)),
]
