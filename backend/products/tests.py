from django.test import TestCase
from .models import Category, Product


class CategoryModelTest(TestCase):
    def setUp(self):
        Category.objects.create(
            name='Flores',
            slug='flores',
            description='Ramos y arreglos florales'
        )

    def test_category_creation(self):
        category = Category.objects.get(slug='flores')
        self.assertEqual(category.name, 'Flores')


class ProductModelTest(TestCase):
    def setUp(self):
        category = Category.objects.create(
            name='Flores',
            slug='flores'
        )
        Product.objects.create(
            name='Ramo de Rosas',
            slug='ramo-de-rosas',
            category=category,
            price=150.00,
            stock=10
        )

    def test_product_creation(self):
        product = Product.objects.get(slug='ramo-de-rosas')
        self.assertEqual(product.name, 'Ramo de Rosas')
        self.assertEqual(product.price, 150.00)
