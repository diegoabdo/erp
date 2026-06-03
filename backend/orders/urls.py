from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, OrderStatusViewSet, PaymentMethodViewSet

router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')
router.register(r'statuses', OrderStatusViewSet, basename='order-status')
router.register(r'payment-methods', PaymentMethodViewSet, basename='payment-method')

urlpatterns = [
    path('', include(router.urls)),
]
