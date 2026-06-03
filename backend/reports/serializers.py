from rest_framework import serializers


class SalesSummarySerializer(serializers.Serializer):
    date = serializers.DateField()
    total_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    order_count = serializers.IntegerField()


class TopProductSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    quantity_sold = serializers.IntegerField()
    revenue = serializers.DecimalField(max_digits=10, decimal_places=2)


class LowStockSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    product_name = serializers.CharField()
    current_stock = serializers.IntegerField()
    low_stock_threshold = serializers.IntegerField()


class OrdersByStatusSerializer(serializers.Serializer):
    status = serializers.CharField()
    order_count = serializers.IntegerField()


class CustomersSummarySerializer(serializers.Serializer):
    total_customers = serializers.IntegerField()
    repeat_customers = serializers.IntegerField()
    new_customers_this_month = serializers.IntegerField()
