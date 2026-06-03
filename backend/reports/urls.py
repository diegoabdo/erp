from django.urls import path
from . import views

urlpatterns = [
    path('sales-summary/', views.sales_summary, name='sales_summary'),
    path('top-products/', views.top_products, name='top_products'),
    path('low-stock/', views.low_stock, name='low_stock'),
    path('orders-by-status/', views.orders_by_status, name='orders_by_status'),
    path('customers-summary/', views.customers_summary, name='customers_summary'),
]
