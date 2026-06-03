from django.test import TestCase
from .models import User


class UserModelTest(TestCase):
    def setUp(self):
        User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

    def test_user_creation(self):
        user = User.objects.get(email='test@example.com')
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.role, 'visitor')
