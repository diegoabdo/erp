from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.public_categories, name='public_categories'),
    path('products/', views.public_products, name='public_products'),
    path('products/<slug:slug>/', views.public_product_detail, name='public_product_detail'),
    path('featured/', views.public_featured, name='public_featured'),
    path('recommendations/', views.public_recommendations, name='public_recommendations'),
    path('payment-methods/', views.payment_methods, name='payment_methods'),
    path('orders/', views.public_create_order, name='public_create_order'),
    path('orders/track/<str:short_id>/', views.public_track_order, name='public_track_order'),
]
