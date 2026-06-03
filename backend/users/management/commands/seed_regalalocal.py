from django.core.management.base import BaseCommand
from users.models import User
from orders.models import OrderStatus, PaymentMethod
from products.models import Category, Product, ProductBundle, ProductBundleItem


class Command(BaseCommand):
    help = 'Carga datos iniciales para RegalaLocal'

    def handle(self, *args, **options):
        self.stdout.write('Creando datos iniciales...')

        self.seed_users()
        self.seed_order_statuses()
        self.seed_payment_methods()
        categories = self.seed_categories()
        products = self.seed_products(categories)
        self.seed_bundles(products)

        self.stdout.write(self.style.SUCCESS('\n✓ Datos iniciales cargados exitosamente'))

    def seed_users(self):
        users_data = [
            {
                'email': 'admin@regalalocal.test',
                'first_name': 'Admin',
                'last_name': 'User',
                'password': 'admin123',
                'role': 'admin',
                'is_staff': True,
                'is_superuser': True,
            },
            {
                'email': 'manager@regalalocal.test',
                'first_name': 'Manager',
                'last_name': 'User',
                'password': 'manager123',
                'role': 'manager',
                'is_staff': True,
            },
            {
                'email': 'visitor@regalalocal.test',
                'first_name': 'Visitor',
                'last_name': 'User',
                'password': 'visitor123',
                'role': 'visitor',
            },
        ]

        for user_data in users_data:
            password = user_data.pop('password')
            if not User.objects.filter(email=user_data['email']).exists():
                user = User.objects.create_user(**user_data, password=password)
                self.stdout.write(self.style.SUCCESS(f'✓ Usuario creado: {user.email}'))
            else:
                self.stdout.write(f'- Usuario ya existe: {user_data["email"]}')

    def seed_order_statuses(self):
        statuses_data = [
            {'name': 'Pendiente', 'slug': 'pendiente', 'is_initial': True},
            {'name': 'Confirmado', 'slug': 'confirmado'},
            {'name': 'Preparando', 'slug': 'preparando'},
            {'name': 'Listo', 'slug': 'listo'},
            {'name': 'En camino', 'slug': 'en-camino'},
            {'name': 'Entregado', 'slug': 'entregado'},
            {'name': 'Cancelado', 'slug': 'cancelado'},
        ]

        for status_data in statuses_data:
            if not OrderStatus.objects.filter(slug=status_data['slug']).exists():
                OrderStatus.objects.create(**status_data)
                self.stdout.write(self.style.SUCCESS(f'✓ Estado creado: {status_data["name"]}'))
            else:
                self.stdout.write(f'- Estado ya existe: {status_data["name"]}')

    def seed_payment_methods(self):
        payment_methods_data = [
            {'name': 'Efectivo contra entrega', 'slug': 'efectivo'},
            {'name': 'Transferencia bancaria', 'slug': 'transferencia'},
            {'name': 'Tarjeta de crédito', 'slug': 'tarjeta'},
            {'name': 'Pago pendiente', 'slug': 'pendiente'},
        ]

        for method_data in payment_methods_data:
            if not PaymentMethod.objects.filter(slug=method_data['slug']).exists():
                PaymentMethod.objects.create(**method_data)
                self.stdout.write(self.style.SUCCESS(f'✓ Método de pago creado: {method_data["name"]}'))
            else:
                self.stdout.write(f'- Método de pago ya existe: {method_data["name"]}')

    def seed_categories(self):
        categories_data = [
            {'name': 'Flores', 'slug': 'flores', 'description': 'Ramos y arreglos florales'},
            {'name': 'Pasteles', 'slug': 'pasteles', 'description': 'Pasteles personalizados'},
            {'name': 'Chocolates', 'slug': 'chocolates', 'description': 'Cajas de chocolates'},
            {'name': 'Globos', 'slug': 'globos', 'description': 'Globos decorativos'},
            {'name': 'Plantas', 'slug': 'plantas', 'description': 'Plantas decorativas'},
            {'name': 'Desayunos sorpresa', 'slug': 'desayunos', 'description': 'Cestas de desayuno'},
            {'name': 'Regalos personalizados', 'slug': 'personalizados', 'description': 'Regalos hechos a medida'},
            {'name': 'Combos', 'slug': 'combos', 'description': 'Combos especiales'},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data,
            )
            categories[cat_data['slug']] = category
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Categoría creada: {cat_data["name"]}'))
            else:
                self.stdout.write(f'- Categoría ya existe: {cat_data["name"]}')

        return categories

    def seed_products(self, categories):
        products_data = [
            {
                'name': 'Ramo Rosas Eternas',
                'slug': 'ramo-rosas-eternas',
                'category': categories['flores'],
                'description': 'Ramo de rosas rojas con envoltura elegante, ideal para aniversarios y celebraciones románticas.',
                'price': 249.00,
                'stock': 12,
                'is_featured': True,
                'occasion': 'aniversario',
                'recipient_type': 'pareja',
                'tags': ['flores', 'romantico', 'elegante'],
            },
            {
                'name': 'Caja Deluxe de Chocolates',
                'slug': 'caja-deluxe-chocolates',
                'category': categories['chocolates'],
                'description': 'Selección de chocolates artesanales en caja premium para regalar en cualquier ocasión.',
                'price': 145.00,
                'stock': 18,
                'is_featured': True,
                'occasion': 'agradecimiento',
                'recipient_type': 'amigo',
                'tags': ['dulce', 'premium', 'detalle'],
            },
            {
                'name': 'Desayuno Sorpresa Clásico',
                'slug': 'desayuno-sorpresa-clasico',
                'category': categories['desayunos'],
                'description': 'Canasta con jugo, fruta, sándwich, postre y tarjeta para sorprender desde temprano.',
                'price': 310.00,
                'stock': 9,
                'is_featured': True,
                'occasion': 'cumpleanos',
                'recipient_type': 'mama',
                'tags': ['desayuno', 'sorpresa', 'especial'],
            },
            {
                'name': 'Pastel Personalizado Vainilla',
                'slug': 'pastel-personalizado-vainilla',
                'category': categories['pasteles'],
                'description': 'Pastel de vainilla decorado con mensaje personalizado para cumpleaños y celebraciones familiares.',
                'price': 285.00,
                'stock': 7,
                'occasion': 'cumpleanos',
                'recipient_type': 'familia',
                'tags': ['pastel', 'cumpleanos', 'personalizado'],
            },
            {
                'name': 'Bouquet de Globos Fiesta',
                'slug': 'bouquet-globos-fiesta',
                'category': categories['globos'],
                'description': 'Arreglo de globos metalizados y de colores para complementar cualquier celebración.',
                'price': 95.00,
                'stock': 20,
                'occasion': 'cumpleanos',
                'recipient_type': 'amigo',
                'tags': ['globos', 'fiesta', 'divertido'],
            },
            {
                'name': 'Orquídea Blanca Decorativa',
                'slug': 'orquidea-blanca-decorativa',
                'category': categories['plantas'],
                'description': 'Orquídea en maceta decorativa, una opción sobria y delicada para oficinas y hogares.',
                'price': 190.00,
                'stock': 10,
                'occasion': 'agradecimiento',
                'recipient_type': 'cliente',
                'tags': ['planta', 'elegante', 'decorativo'],
            },
            {
                'name': 'Taza Personalizada con Nombre',
                'slug': 'taza-personalizada-con-nombre',
                'category': categories['personalizados'],
                'description': 'Taza de cerámica con diseño personalizado y nombre del destinatario.',
                'price': 85.00,
                'stock': 25,
                'occasion': 'graduacion',
                'recipient_type': 'amigo',
                'tags': ['personalizado', 'recuerdo', 'detalle'],
            },
            {
                'name': 'Ramo Girasoles Brillantes',
                'slug': 'ramo-girasoles-brillantes',
                'category': categories['flores'],
                'description': 'Ramo de girasoles frescos para llenar de energía cumpleaños, agradecimientos o celebraciones.',
                'price': 210.00,
                'stock': 11,
                'occasion': 'cumpleanos',
                'recipient_type': 'amigo',
                'tags': ['flores', 'alegre', 'girasoles'],
            },
            {
                'name': 'Mini Brownies Gourmet',
                'slug': 'mini-brownies-gourmet',
                'category': categories['chocolates'],
                'description': 'Caja de mini brownies con topping especial para regalos pequeños pero memorables.',
                'price': 78.00,
                'stock': 16,
                'occasion': 'agradecimiento',
                'recipient_type': 'cliente',
                'tags': ['dulce', 'brownies', 'detalle'],
            },
            {
                'name': 'Caja Spa Relax',
                'slug': 'caja-spa-relax',
                'category': categories['personalizados'],
                'description': 'Caja con vela aromática, jabón artesanal y crema corporal para un regalo de autocuidado.',
                'price': 265.00,
                'stock': 8,
                'is_featured': True,
                'occasion': 'madre',
                'recipient_type': 'mama',
                'tags': ['spa', 'relax', 'elegante'],
            },
            {
                'name': 'Pastel ChocoFresa',
                'slug': 'pastel-chocofresa',
                'category': categories['pasteles'],
                'description': 'Pastel de chocolate y fresa decorado para cumpleaños, aniversarios o celebraciones especiales.',
                'price': 320.00,
                'stock': 6,
                'occasion': 'aniversario',
                'recipient_type': 'pareja',
                'tags': ['pastel', 'chocolate', 'fresa'],
            },
            {
                'name': 'Canasta Premium de Snacks',
                'slug': 'canasta-premium-snacks',
                'category': categories['desayunos'],
                'description': 'Canasta con snacks, galletas, bebidas y detalles para compartir en oficina o en casa.',
                'price': 275.00,
                'stock': 13,
                'occasion': 'corporativo',
                'recipient_type': 'cliente',
                'tags': ['snacks', 'corporativo', 'canasta'],
            },
        ]

        products = {}
        for product_data in products_data:
            product, created = Product.objects.update_or_create(
                slug=product_data['slug'],
                defaults=product_data,
            )
            products[product.slug] = product
            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Producto creado: {product.name}'))
            else:
                self.stdout.write(f'- Producto actualizado: {product.name}')

        return products

    def seed_bundles(self, products):
        bundles_data = [
            {
                'name': 'Combo Romance Clásico',
                'slug': 'combo-romance-clasico',
                'description': 'Rosas y chocolates para aniversarios o declaraciones especiales.',
                'price': 359.00,
                'occasion': 'aniversario',
                'tags': ['combo', 'romantico', 'flores'],
                'items': [
                    ('ramo-rosas-eternas', 1),
                    ('caja-deluxe-chocolates', 1),
                ],
            },
            {
                'name': 'Combo Cumple Feliz',
                'slug': 'combo-cumple-feliz',
                'description': 'Pastel, globos y brownies para celebrar a lo grande.',
                'price': 445.00,
                'occasion': 'cumpleanos',
                'tags': ['combo', 'cumpleanos', 'fiesta'],
                'items': [
                    ('pastel-personalizado-vainilla', 1),
                    ('bouquet-globos-fiesta', 1),
                    ('mini-brownies-gourmet', 1),
                ],
            },
            {
                'name': 'Combo Dulce Mañana',
                'slug': 'combo-dulce-manana',
                'description': 'Desayuno sorpresa con taza personalizada para un detalle completo.',
                'price': 365.00,
                'occasion': 'cumpleanos',
                'tags': ['combo', 'desayuno', 'personalizado'],
                'items': [
                    ('desayuno-sorpresa-clasico', 1),
                    ('taza-personalizada-con-nombre', 1),
                ],
            },
        ]

        for bundle_data in bundles_data:
            items = bundle_data.pop('items')
            bundle, created = ProductBundle.objects.update_or_create(
                slug=bundle_data['slug'],
                defaults=bundle_data,
            )

            ProductBundleItem.objects.filter(bundle=bundle).delete()
            for product_slug, quantity in items:
                ProductBundleItem.objects.create(
                    bundle=bundle,
                    product=products[product_slug],
                    quantity=quantity,
                )

            if created:
                self.stdout.write(self.style.SUCCESS(f'✓ Combo creado: {bundle.name}'))
            else:
                self.stdout.write(f'- Combo actualizado: {bundle.name}')
