# Giftora

🎁 **Giftora** es una plataforma web de comercio electrónico y gestión administrativa para negocios locales que venden regalos personalizados, flores, pasteles, globos, plantas, chocolates, desayunos sorpresa y combos especiales.

El sistema combina una **tienda online pública** con un **panel administrativo tipo ERP** para gestionar productos, inventario, clientes, pedidos, estados, reportes y seguimiento de entregas.

---

## ⚡ Inicio Rápido

### 1. Clonar y preparar
```bash
cd erp
cp .env.example .env  # Ya existe en el repo
```

### 2. Levantar con Docker
```bash
docker compose up --build
```

### 3. Cargar datos iniciales (en otra terminal)
```bash
docker compose exec backend python manage.py seed_regalalocal
```

### 4. Acceder
- **Tienda pública**: http://localhost:5173
- **Admin Django**: http://localhost:8000/admin
- **API**: http://localhost:8000/api

### 5. Usuarios de prueba
| Email | Contraseña |
|-------|-----------|
| admin@regalalocal.test | admin123 |
| manager@regalalocal.test | manager123 |
| visitor@regalalocal.test | visitor123 |

**📖 Ver [QUICK_START.md](./QUICK_START.md) para más instrucciones detalladas.**

---

## Descripción del proyecto

Giftora busca resolver un problema común: muchas personas quieren enviar un regalo especial, pero no saben qué elegir, dónde comprarlo o cómo darle seguimiento.

La plataforma permite que un cliente:

- Explore productos disponibles.
- Filtre por categoría, ocasión o presupuesto.
- Reciba recomendaciones de regalos.
- Agregue productos al carrito.
- Realice un pedido **sin necesidad de cuenta**.
- Agregue datos del destinatario.
- Escriba un mensaje personalizado.
- Consulte el estado del pedido usando un **código corto**.

Del lado administrativo, permite que el negocio:

- Gestione productos.
- Gestione categorías.
- Gestione combos.
- Controle inventario.
- Administre pedidos.
- Cambie estados de entrega.
- Suba una foto del regalo preparado.
- Consulte clientes.
- Genere reportes PDF y Excel.
- Visualice métricas en un dashboard.

---

## Objetivo general (PLAN)

El sistema debe permitir:

1. A clientes públicos:
   - Ver catálogo de productos.
   - Filtrar por categoría, ocasión, precio y búsqueda.
   - Ver detalle de producto.
   - Agregar productos al carrito.
   - Crear pedidos sin necesidad de cuenta.
   - Ingresar datos del destinatario.
   - Escribir mensaje personalizado.
   - Consultar el estado del pedido con un código corto.
   - Recibir recomendación de regalos según ocasión y presupuesto.

2. A administradores:
   - Iniciar sesión.
   - Gestionar productos.
   - Gestionar categorías.
   - Gestionar inventario.
   - Gestionar clientes.
   - Gestionar pedidos.
   - Cambiar estados del pedido.
   - Subir foto del regalo preparado.
   - Generar reportes PDF/Excel.
   - Ver dashboard con métricas.

3. A managers:
   - Gestionar productos, inventario y pedidos.
   - No gestionar usuarios ni configuraciones críticas.

4. A visitantes autenticados:
   - Acceso limitado de solo lectura o panel básico.

---

# 1. Stack tecnológico

Mantener el stack existente del repo:

## Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Simple JWT
- CORS Headers
- Pillow para imágenes
- Docker

## Frontend

- React
- Vite
- React Router
- Bootstrap
- Axios
- React Icons
- AG Grid o tablas HTML para listados
- jsPDF
- jsPDF AutoTable
- XLSX

## Infraestructura local

- Docker
- Docker Compose
- Servicio `backend`
- Servicio `frontend`
- Servicio `db`
- Volumen persistente para PostgreSQL
- Volumen para media files si aplica

---

# 2. Nombre del proyecto

Nombre comercial sugerido:

## Giftora

Descripción:

Giftora es una plataforma web para venta de regalos personalizados, flores, pasteles, globos, plantas y combos especiales. Incluye tienda pública, recomendador de regalos, seguimiento de pedidos, gestión de inventario, clientes, productos, reportes y administración de estados.

---

# 3. Valor agregado del sistema

El sistema no debe ser una tienda online genérica. Debe incluir valor agregado:

## 3.1 Recomendador de regalos

Crear un flujo donde el cliente seleccione:

- Ocasión:
  - Cumpleaños
  - Aniversario
  - Graduación
  - Agradecimiento
  - Disculpa
  - Día de la madre
  - San Valentín
  - Corporativo

- Presupuesto:
  - Bajo
  - Medio
  - Alto

- Tipo de destinatario:
  - Pareja
  - Mamá
  - Papá
  - Amigo
  - Amiga
  - Compañero
  - Docente
  - Cliente

- Preferencia:
  - Flores
  - Dulce
  - Elegante
  - Divertido
  - Personalizado
  - Sorpresa

El sistema debe devolver productos o combos recomendados usando reglas simples.

Ejemplo:

Si ocasión = "Aniversario" y preferencia = "Flores", recomendar productos con tags `aniversario`, `flores`, `romantico`.

## 3.2 Combos personalizados

Permitir crear combos de productos.

Ejemplo:

- Pastel + flores
- Globos + chocolates
- Desayuno sorpresa + tarjeta
- Taza personalizada + chocolates
- Ramo + peluche

## 3.3 Foto antes de entregar

El admin puede subir una imagen del pedido preparado.

El cliente puede verla desde la pantalla de seguimiento.

## 3.4 Seguimiento de pedido

El cliente ingresa su código de pedido y ve:

- Código corto
- Estado actual
- Fecha estimada
- Productos
- Mensaje personalizado
- Foto del regalo preparado si existe

## 3.5 Reportes

El admin puede generar:

- Ventas por fecha
- Productos más vendidos
- Inventario bajo
- Clientes frecuentes
- Pedidos por estado
- Exportar PDF
- Exportar Excel

---

# 4. Arquitectura esperada

## Backend

Mantener patrón del repo:

backend/
├── users/
├── products/
├── orders/
├── inventory/
├── crm/
├── public/
├── reports/
└── backend/

Cada módulo debe respetar estructura:

module/
├── models/
├── serializers/
├── services/
├── repositories/
├── apis/
├── urls.py
└── exceptions.py

## Frontend

Mantener estructura modular:

frontend/src/
├── core/
│   ├── api/
│   ├── auth/
│   ├── components/
│   ├── layouts/
│   └── registry/
├── modules/
│   ├── Auth/
│   ├── users/
│   ├── products/
│   ├── orders/
│   ├── inventory/
│   ├── crm/
│   ├── publicStore/
│   ├── cart/
│   ├── reports/
│   └── dashboard/
└── App.jsx

---

# 5. Módulos backend a implementar o completar

## 5.1 Products

Debe manejar:

- Categorías
- Productos
- Imágenes
- Precio
- Stock
- Tags
- Ocasiones
- Estado público/no público
- Productos destacados

### Modelos sugeridos

```python
class Category(models.Model):
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='children'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)

    is_active = models.BooleanField(default=True)
    is_public = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    occasion = models.CharField(max_length=100, blank=True, null=True)
    recipient_type = models.CharField(max_length=100, blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
class ProductBundle(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='bundles/', blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    is_public = models.BooleanField(default=True)
    products = models.ManyToManyField(Product, through='ProductBundleItem')
    tags = models.JSONField(default=list, blank=True)
    occasion = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
class ProductBundleItem(models.Model):
    bundle = models.ForeignKey(ProductBundle, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
5.2 CRM

Debe manejar clientes públicos.

Modelo sugerido:

class Customer(models.Model):
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=30, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
5.3 Orders

Debe manejar:

Pedido
Detalle de pedido
Estados
Métodos de pago
Datos del destinatario
Mensaje personalizado
Imagen del pedido preparado
Código corto para seguimiento
Historial de estados
Estados sugeridos

Crear seed inicial:

Pendiente
Confirmado
Preparando
Listo
En camino
Entregado
Cancelado
Modelo sugerido
class Order(models.Model):
    short_id = models.CharField(max_length=20, unique=True)
    customer = models.ForeignKey('crm.Customer', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.ForeignKey('orders.OrderStatus', on_delete=models.PROTECT)
    payment_method = models.ForeignKey('orders.PaymentMethod', on_delete=models.SET_NULL, null=True, blank=True)

    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    delivery_address = models.TextField()
    delivery_date = models.DateField(blank=True, null=True)
    delivery_time = models.CharField(max_length=50, blank=True, null=True)

    recipient_name = models.CharField(max_length=255)
    recipient_phone = models.CharField(max_length=30, blank=True, null=True)

    gift_message = models.TextField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    prepared_image = models.ImageField(upload_to='orders/prepared/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.SET_NULL, null=True, blank=True)
    bundle = models.ForeignKey('products.ProductBundle', on_delete=models.SET_NULL, null=True, blank=True)
    name_snapshot = models.CharField(max_length=255)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    total = models.DecimalField(max_digits=10, decimal_places=2)
class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='history')
    status = models.ForeignKey('orders.OrderStatus', on_delete=models.PROTECT)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
5.4 Inventory

Debe manejar:

Stock por producto
Movimientos de entrada
Movimientos de salida
Descuento automático cuando el pedido se confirma
Alertas de inventario bajo

Modelo sugerido:

class InventoryMovement(models.Model):
    MOVEMENT_TYPES = (
        ('IN', 'Entrada'),
        ('OUT', 'Salida'),
        ('ADJUSTMENT', 'Ajuste'),
    )

    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    quantity = models.IntegerField()
    reason = models.CharField(max_length=255)
    order = models.ForeignKey('orders.Order', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

Regla:

Cuando un pedido cambie a Confirmado, descontar inventario.

Si el pedido tiene un combo, descontar el inventario de cada producto interno del combo.

5.5 Public Store

Crear app o completar app public.

Endpoints públicos:

GET    /api/public/categories/
GET    /api/public/products/
GET    /api/public/products/{slug}/
GET    /api/public/featured/
POST   /api/public/recommendations/
POST   /api/public/orders/
GET    /api/public/orders/track/{short_id}/

Estos endpoints no deben requerir login.

5.6 Reports

Crear módulo reports.

Endpoints:

GET /api/reports/sales-summary/
GET /api/reports/top-products/
GET /api/reports/low-stock/
GET /api/reports/orders-by-status/
GET /api/reports/customers-summary/

El backend devuelve JSON.

El frontend genera PDF y Excel con jspdf, jspdf-autotable y xlsx.

6. Frontend a implementar
6.1 Rutas públicas

Crear módulo publicStore.

Rutas:

/
 /productos
 /productos/:slug
 /categorias/:slug
 /recomendador
 /carrito
 /checkout
 /seguimiento
 /seguimiento/:shortId

Páginas:

HomePage.jsx
ProductListPage.jsx
ProductDetailPage.jsx
RecommendationPage.jsx
CartPage.jsx
CheckoutPage.jsx
TrackingPage.jsx

Componentes:

ProductCard.jsx
CategoryCard.jsx
HeroSection.jsx
FeaturedProducts.jsx
RecommendationForm.jsx
CartSummary.jsx
OrderTimeline.jsx
PreparedImagePreview.jsx

Servicios:

publicStoreService.js
cartService.js
6.2 Rutas administrativas

Crear o completar módulos:

/dashboard/admin/products
/dashboard/admin/categories
/dashboard/admin/bundles
/dashboard/admin/orders
/dashboard/admin/inventory
/dashboard/admin/customers
/dashboard/admin/reports
/dashboard/admin/settings

Páginas:

ProductListPage.jsx
ProductFormPage.jsx
CategoryListPage.jsx
BundleListPage.jsx
OrderListPage.jsx
OrderDetailPage.jsx
InventoryPage.jsx
CustomerListPage.jsx
ReportsPage.jsx
DashboardPage.jsx
7. Carrito

Implementar carrito en frontend usando localStorage.

Estructura del carrito:

{
  items: [
    {
      type: "product",
      id: 1,
      name: "Ramo de rosas",
      price: 150,
      quantity: 1,
      image: "..."
    }
  ],
  subtotal: 150
}

Debe permitir:

Agregar producto
Eliminar producto
Cambiar cantidad
Vaciar carrito
Calcular subtotal
Enviar pedido al backend
8. Flujo de compra
Cliente entra a la tienda.
Busca producto.
Agrega al carrito.
Va a checkout.
Ingresa:
Nombre del comprador
Teléfono
Email
Nombre del destinatario
Teléfono del destinatario
Dirección de entrega
Fecha de entrega
Mensaje personalizado
Método de pago
El sistema crea un pedido con estado Pendiente.
Se genera short_id.
Se muestra pantalla de confirmación.
Cliente puede consultar /seguimiento/{short_id}.
9. Flujo administrativo del pedido
Admin ve pedido nuevo en estado Pendiente.
Admin cambia a Confirmado.
El sistema descuenta inventario.
Admin cambia a Preparando.
Admin sube foto del pedido preparado.
Admin cambia a Listo.
Admin cambia a En camino.
Admin cambia a Entregado.
10. Reglas importantes
Seguridad
Endpoints administrativos requieren JWT.
Endpoints públicos no requieren JWT.
Validar permisos por rol.
Solo ADMIN gestiona usuarios.
ADMIN y MANAGER gestionan pedidos, productos e inventario.
Validaciones

Producto:

Nombre requerido.
Precio mayor a 0.
Stock mayor o igual a 0.
Slug único.

Pedido:

Debe tener al menos un item.
Dirección requerida.
Destinatario requerido.
Total calculado en backend, no confiar en frontend.
No permitir confirmar pedido si no hay stock suficiente.

Inventario:

No permitir stock negativo.
Registrar movimiento por cada entrada/salida.
Imágenes
Productos: media/products/
Categorías: media/categories/
Pedidos preparados: media/orders/prepared/
11. Docker

El proyecto debe poder levantarse con:

docker compose up --build

Servicios:

services:
  db:
    image: postgres:17
    container_name: regalalocal_db

  backend:
    build: ./backend
    container_name: regalalocal_backend
    command: python manage.py runserver 0.0.0.0:8000

  frontend:
    build: ./frontend
    container_name: regalalocal_frontend
    command: npm run dev -- --host 0.0.0.0

Puertos:

frontend: http://localhost:5173
backend: http://localhost:8000/api
postgres: localhost:5432

Variables:

POSTGRES_DB=regalalocal_db
POSTGRES_USER=regalalocal_user
POSTGRES_PASSWORD=regalalocal_password
POSTGRES_HOST=db
POSTGRES_PORT=5432
VITE_API_URL=http://localhost:8000/api
12. Seeds iniciales

Crear comandos o scripts para cargar:

Roles
ADMIN
MANAGER
VISITOR
Usuario admin
email: admin@regalalocal.test
password: admin123
role: ADMIN
Estados de pedido
Pendiente
Confirmado
Preparando
Listo
En camino
Entregado
Cancelado
Métodos de pago
Efectivo contra entrega
Transferencia bancaria
Tarjeta
Pago pendiente
Categorías
Flores
Pasteles
Chocolates
Globos
Plantas
Desayunos sorpresa
Regalos personalizados
Combos
Productos demo

Crear al menos 12 productos con imagen opcional, precio, stock, ocasión y tags.

13. Orden de implementación recomendado para CODEX
Fase 1 — Preparación
Revisar estructura actual del repo.
Confirmar que Docker levanta correctamente.
Ajustar .env.example.
Verificar conexión entre frontend y backend.
Verificar JWT.
Fase 2 — Backend base
Completar modelos de productos.
Completar modelos de categorías.
Completar modelos de combos.
Crear serializers.
Crear services.
Crear repositories.
Crear ViewSets.
Registrar URLs.
Crear migraciones.
Crear seeds.
Fase 3 — Tienda pública
Crear endpoints públicos.
Crear listado de productos.
Crear detalle de producto.
Crear recomendador.
Crear creación pública de pedidos.
Crear tracking por short_id.
Fase 4 — Pedidos e inventario
Crear lógica de carrito en frontend.
Crear checkout.
Crear pedido.
Crear cambio de estados.
Crear descuento automático de inventario.
Crear historial de estados.
Crear subida de imagen preparada.
Fase 5 — Panel administrativo
Crear dashboard.
CRUD de productos.
CRUD de categorías.
CRUD de combos.
Gestión de pedidos.
Gestión de inventario.
Gestión de clientes.
Fase 6 — Reportes
Crear endpoints de reportes.
Crear vista de reportes.
Exportar PDF.
Exportar Excel.
Fase 7 — Pulido final
Mejorar diseño UI.
Agregar loaders.
Agregar mensajes de error.
Agregar validaciones visuales.
Probar flujo completo.
Documentar instalación.
Documentar usuarios de prueba.
Documentar endpoints principales.
14. Criterios de aceptación

El proyecto se considera completo cuando:

Docker levanta frontend, backend y base de datos.
Se puede iniciar sesión como admin.
Se pueden crear productos.
Se pueden crear categorías.
Se pueden crear combos.
Se puede ver tienda pública.
Se puede agregar productos al carrito.
Se puede crear un pedido público.
El pedido genera código corto.
El cliente puede consultar el pedido.
El admin puede cambiar estados.
El inventario se descuenta al confirmar.
El admin puede subir foto preparada.
El dashboard muestra métricas.
Se pueden exportar reportes PDF/Excel.
El README explica instalación, uso y arquitectura.
15. Instrucción general para CODEX

Implementar el proyecto completo respetando la arquitectura existente del repo. No eliminar módulos existentes si pueden reutilizarse. Extender los módulos actuales de products, orders, inventory, crm, users y crear los módulos faltantes publicStore en frontend y reports en backend/frontend.

Priorizar que el flujo completo funcione antes que detalles visuales avanzados.

Flujo mínimo obligatorio:

Producto → Carrito → Checkout → Pedido → Admin confirma → Inventario descuenta → Cliente consulta seguimiento.


---

# README LISTO PARA PEGAR

```md
# Giftora

Giftora es una plataforma web de comercio electrónico y gestión administrativa para negocios locales que venden regalos personalizados, flores, pasteles, globos, plantas, chocolates, desayunos sorpresa y combos especiales.

El sistema combina una tienda online pública con un panel administrativo tipo ERP para gestionar productos, inventario, clientes, pedidos, estados, reportes y seguimiento de entregas.

---

## Descripción del proyecto

Giftora busca resolver un problema común: muchas personas quieren enviar un regalo especial, pero no saben qué elegir, dónde comprarlo o cómo darle seguimiento.

La plataforma permite que un cliente:

- Explore productos disponibles.
- Filtre por categoría, ocasión o presupuesto.
- Reciba recomendaciones de regalos.
- Agregue productos al carrito.
- Realice un pedido.
- Agregue datos del destinatario.
- Escriba un mensaje personalizado.
- Consulte el estado del pedido usando un código corto.

Del lado administrativo, permite que el negocio:

- Gestione productos.
- Gestione categorías.
- Gestione combos.
- Controle inventario.
- Administre pedidos.
- Cambie estados de entrega.
- Suba una foto del regalo preparado.
- Consulte clientes.
- Genere reportes PDF y Excel.
- Visualice métricas en un dashboard.

---

## Valor agregado

El proyecto no es una tienda online genérica. Incluye funcionalidades diferenciadoras:

### 1. Recomendador de regalos

El cliente puede seleccionar:

- Ocasión.
- Presupuesto.
- Tipo de destinatario.
- Preferencia de regalo.

Con esa información, el sistema recomienda productos o combos adecuados.

Ejemplo:

> Si el cliente selecciona "Aniversario", "Pareja" y "Flores", el sistema puede recomendar ramos, chocolates o combos románticos.

---

### 2. Combos personalizados

El administrador puede crear combos como:

- Flores + chocolates.
- Pastel + globos.
- Desayuno sorpresa + tarjeta.
- Taza personalizada + dulces.
- Ramo + peluche.

---

### 3. Foto antes de entregar

El administrador puede subir una foto del regalo preparado.

El cliente puede verla desde la página de seguimiento del pedido.

---

### 4. Seguimiento de pedido

Cada pedido genera un código corto.

Con ese código, el cliente puede consultar el estado del pedido sin necesidad de iniciar sesión.

Estados sugeridos:

```txt
Pendiente → Confirmado → Preparando → Listo → En camino → Entregado
5. Gestión ERP

El panel administrativo permite gestionar:

Productos.
Categorías.
Combos.
Inventario.
Pedidos.
Clientes.
Reportes.
Usuarios y roles.
Stack tecnológico
Backend
Python
Django
Django REST Framework
PostgreSQL
Simple JWT
Django CORS Headers
Pillow
Docker
Frontend
React
Vite
React Router
Bootstrap
Axios
React Icons
jsPDF
jsPDF AutoTable
XLSX
Infraestructura local
Docker
Docker Compose
PostgreSQL
Estructura general del proyecto
Giftora-ERP/
├── backend/
│   ├── backend/
│   ├── users/
│   ├── products/
│   ├── orders/
│   ├── inventory/
│   ├── crm/
│   ├── public/
│   ├── reports/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── core/
│   │   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── layouts/
│   │   │   └── registry/
│   │   │
│   │   ├── modules/
│   │   │   ├── Auth/
│   │   │   ├── users/
│   │   │   ├── products/
│   │   │   ├── orders/
│   │   │   ├── inventory/
│   │   │   ├── crm/
│   │   │   ├── publicStore/
│   │   │   ├── cart/
│   │   │   ├── reports/
│   │   │   └── dashboard/
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
├── .env.example
└── README.md
Instalación con Docker
Requisitos

Tener instalado:

Docker
Docker Compose
Variables de entorno

Crear un archivo .env en la raíz del proyecto.

Ejemplo:

POSTGRES_DB=regalalocal_db
POSTGRES_USER=regalalocal_user
POSTGRES_PASSWORD=regalalocal_password
POSTGRES_HOST=db
POSTGRES_PORT=5432

DJANGO_SECRET_KEY=dev-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend

VITE_API_URL=http://localhost:8000/api
Docker Compose sugerido

Archivo docker-compose.yml:

services:
  db:
    image: postgres:17
    container_name: regalalocal_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-regalalocal_db}
      POSTGRES_USER: ${POSTGRES_USER:-regalalocal_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-regalalocal_password}
    ports:
      - "5432:5432"
    volumes:
      - regalalocal_postgres_data:/var/lib/postgresql/data

  backend:
    build:
      context: ./backend
    container_name: regalalocal_backend
    restart: unless-stopped
    command: >
      sh -c "python manage.py migrate &&
             python manage.py runserver 0.0.0.0:8000"
    volumes:
      - ./backend:/app
      - regalalocal_media:/app/media
    ports:
      - "8000:8000"
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-regalalocal_db}
      POSTGRES_USER: ${POSTGRES_USER:-regalalocal_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-regalalocal_password}
      POSTGRES_HOST: db
      POSTGRES_PORT: 5432
      DJANGO_SECRET_KEY: ${DJANGO_SECRET_KEY:-dev-secret-key}
      DJANGO_DEBUG: ${DJANGO_DEBUG:-True}
      DJANGO_ALLOWED_HOSTS: ${DJANGO_ALLOWED_HOSTS:-localhost,127.0.0.1,backend}
    depends_on:
      - db

  frontend:
    build:
      context: ./frontend
    container_name: regalalocal_frontend
    restart: unless-stopped
    command: npm run dev -- --host 0.0.0.0
    volumes:
      - ./frontend:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: ${VITE_API_URL:-http://localhost:8000/api}
    depends_on:
      - backend

volumes:
  regalalocal_postgres_data:
  regalalocal_media:
Dockerfile del backend

Archivo backend/Dockerfile:

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /app/

EXPOSE 8000
Dockerfile del frontend

Archivo frontend/Dockerfile:

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173
Levantar el proyecto

Desde la raíz del proyecto:

docker compose up --build

Servicios disponibles:

Frontend: http://localhost:5173
Backend API: http://localhost:8000/api
PostgreSQL: localhost:5432
Detener servicios
docker compose down
Detener y borrar volúmenes

Esto elimina la base de datos local:

docker compose down -v
Comandos útiles
Ver logs
docker compose logs -f
Ver logs del backend
docker compose logs -f backend
Ver logs del frontend
docker compose logs -f frontend
Entrar al contenedor backend
docker compose exec backend bash
Entrar al contenedor frontend
docker compose exec frontend sh
Crear migraciones
docker compose exec backend python manage.py makemigrations
Aplicar migraciones
docker compose exec backend python manage.py migrate
Crear superusuario
docker compose exec backend python manage.py createsuperuser
Cargar datos iniciales
docker compose exec backend python manage.py seed_regalalocal
Usuarios iniciales sugeridos
Admin:
email: admin@regalalocal.test
password: admin123

Manager:
email: manager@regalalocal.test
password: manager123

Visitor:
email: visitor@regalalocal.test
password: visitor123
Roles del sistema
ADMIN

Puede:

Gestionar usuarios.
Gestionar productos.
Gestionar categorías.
Gestionar combos.
Gestionar pedidos.
Gestionar inventario.
Ver clientes.
Ver reportes.
Cambiar configuraciones.
MANAGER

Puede:

Gestionar productos.
Gestionar categorías.
Gestionar combos.
Gestionar pedidos.
Gestionar inventario.
Ver clientes.
Ver reportes.

No puede gestionar usuarios.

VISITOR

Puede:

Ver dashboard limitado.
Consultar información básica.
Módulos principales
1. Tienda pública

Rutas:

/
 /productos
 /productos/:slug
 /categorias/:slug
 /recomendador
 /carrito
 /checkout
 /seguimiento
 /seguimiento/:shortId

Funcionalidades:

Home pública.
Catálogo de productos.
Filtros.
Detalle de producto.
Carrito.
Checkout.
Recomendador.
Seguimiento de pedido.
2. Productos

Permite administrar:

Nombre.
Slug.
Descripción.
Imagen.
Categoría.
Precio.
Stock.
Ocasión.
Tipo de destinatario.
Tags.
Estado activo.
Estado público.
Producto destacado.

Endpoints sugeridos:

GET    /api/products/
POST   /api/products/
GET    /api/products/{id}/
PUT    /api/products/{id}/
PATCH  /api/products/{id}/
DELETE /api/products/{id}/
3. Categorías

Permite administrar categorías de productos.

Ejemplos:

Flores.
Pasteles.
Chocolates.
Globos.
Plantas.
Desayunos sorpresa.
Regalos personalizados.
Combos.

Endpoints sugeridos:

GET    /api/products/categories/
POST   /api/products/categories/
GET    /api/products/categories/{id}/
PUT    /api/products/categories/{id}/
DELETE /api/products/categories/{id}/
4. Combos

Permite crear paquetes de productos.

Ejemplo:

Combo Romántico:
- 1 ramo de rosas
- 1 caja de chocolates
- 1 tarjeta personalizada

Endpoints sugeridos:

GET    /api/products/bundles/
POST   /api/products/bundles/
GET    /api/products/bundles/{id}/
PUT    /api/products/bundles/{id}/
DELETE /api/products/bundles/{id}/
5. Pedidos

Permite gestionar pedidos de clientes.

Estados sugeridos:

Pendiente
Confirmado
Preparando
Listo
En camino
Entregado
Cancelado

Endpoints sugeridos:

GET    /api/orders/
POST   /api/orders/
GET    /api/orders/{id}/
PATCH  /api/orders/{id}/
POST   /api/orders/{id}/change-status/
POST   /api/orders/{id}/upload-prepared-image/
6. Seguimiento público

Permite que el cliente consulte su pedido con código corto.

Endpoint sugerido:

GET /api/public/orders/track/{short_id}/

Debe devolver:

{
  "short_id": "RL-2026-0001",
  "status": "Preparando",
  "recipient_name": "María López",
  "delivery_date": "2026-06-10",
  "gift_message": "Feliz cumpleaños",
  "prepared_image": "http://localhost:8000/media/orders/prepared/image.jpg",
  "items": [
    {
      "name": "Ramo de rosas",
      "quantity": 1,
      "total": 150.00
    }
  ],
  "history": [
    {
      "status": "Pendiente",
      "created_at": "2026-06-02 10:00"
    },
    {
      "status": "Confirmado",
      "created_at": "2026-06-02 10:15"
    }
  ]
}
7. Inventario

Funcionalidades:

Ver stock actual.
Registrar entradas.
Registrar salidas.
Ajustar stock.
Ver movimientos.
Ver productos con bajo inventario.

Endpoints sugeridos:

GET  /api/inventory/
POST /api/inventory/movements/
GET  /api/inventory/movements/
GET  /api/inventory/low-stock/

Regla principal:

Cuando un pedido cambia a Confirmado, el sistema descuenta automáticamente el inventario.

8. Clientes

El sistema guarda clientes desde pedidos públicos.

Endpoints sugeridos:

GET    /api/crm/customers/
POST   /api/crm/customers/
GET    /api/crm/customers/{id}/
PUT    /api/crm/customers/{id}/
DELETE /api/crm/customers/{id}/
9. Recomendador de regalos

Endpoint sugerido:

POST /api/public/recommendations/

Body:

{
  "occasion": "cumpleanos",
  "budget": "medio",
  "recipient_type": "mama",
  "preference": "flores"
}

Respuesta:

{
  "results": [
    {
      "id": 1,
      "type": "product",
      "name": "Ramo primavera",
      "price": 180.00,
      "image": "http://localhost:8000/media/products/ramo.jpg",
      "reason": "Ideal para cumpleaños y personas que prefieren flores"
    }
  ]
}

Regla inicial:

Buscar productos activos y públicos.
Coincidir por ocasión.
Coincidir por tags.
Coincidir por presupuesto.
Ordenar por coincidencias y productos destacados.
10. Reportes

Endpoints sugeridos:

GET /api/reports/sales-summary/
GET /api/reports/top-products/
GET /api/reports/low-stock/
GET /api/reports/orders-by-status/
GET /api/reports/customers-summary/

Reportes del frontend:

Exportar PDF.
Exportar Excel.
Mostrar tablas.
Mostrar tarjetas resumen.
Flujo completo del sistema
Cliente entra a la tienda
        ↓
Explora productos o usa recomendador
        ↓
Agrega productos al carrito
        ↓
Completa checkout
        ↓
Se crea pedido en estado Pendiente
        ↓
Admin revisa pedido
        ↓
Admin cambia estado a Confirmado
        ↓
Sistema descuenta inventario
        ↓
Admin cambia a Preparando
        ↓
Admin sube foto del regalo preparado
        ↓
Admin cambia a Listo
        ↓
Admin cambia a En camino
        ↓
Admin cambia a Entregado
        ↓
Cliente consulta seguimiento con código corto
Flujo de checkout

Campos requeridos:

Datos del comprador
Nombre.
Teléfono.
Email opcional.
Datos del destinatario
Nombre.
Teléfono.
Dirección de entrega.
Fecha de entrega.
Hora aproximada opcional.
Regalo
Mensaje personalizado.
Notas adicionales.
Pago
Método de pago.
Reglas de negocio
Productos
No se puede publicar un producto sin precio.
No se puede vender un producto inactivo.
No se puede vender un producto sin stock.
El precio debe ser mayor a cero.
Pedidos
No se puede crear un pedido vacío.
El total debe calcularse en backend.
El frontend no debe enviar el total como fuente confiable.
El pedido debe generar short_id.
El pedido inicia en estado Pendiente.
Inventario
El stock no puede quedar negativo.
Al confirmar pedido, se descuenta stock.
Cada descuento genera movimiento de inventario.
Si se cancela un pedido confirmado, se puede restaurar stock.
Seguimiento
El cliente solo puede ver información básica del pedido.
No debe ver datos internos administrativos.
Instrucciones para desarrollo con CODEX

Implementar el proyecto respetando la arquitectura existente.

Prioridades:

No romper login actual.
No eliminar módulos existentes.
Extender products, orders, inventory y crm.
Crear endpoints públicos separados.
Mantener endpoints administrativos protegidos por JWT.
Mantener frontend modular.
Usar servicios frontend con Axios.
Usar localStorage para carrito.
Usar Docker para desarrollo local.
Documentar comandos y usuarios demo.
Orden recomendado de implementación
Fase 1: Docker y base
Revisar docker-compose.yml.
Crear .env.example.
Verificar backend en puerto 8000.
Verificar frontend en puerto 5173.
Verificar conexión PostgreSQL.
Ejecutar migraciones.
Fase 2: Productos y categorías
Completar modelos.
Crear serializers.
Crear services.
Crear repositories.
Crear ViewSets.
Registrar rutas.
Crear pantallas admin.
Fase 3: Tienda pública
Home.
Catálogo.
Detalle de producto.
Filtros.
Productos destacados.
Fase 4: Carrito y checkout
Carrito en localStorage.
Página de carrito.
Página de checkout.
Creación de pedido público.
Fase 5: Pedidos e inventario
Gestión de pedidos.
Cambio de estados.
Historial de estados.
Descuento automático de inventario.
Subida de foto preparada.
Fase 6: Recomendador
Formulario público.
Endpoint de recomendación.
Resultados ordenados por coincidencia.
Fase 7: Reportes
Endpoints de reportes.
Vista administrativa.
Exportar PDF.
Exportar Excel.
Fase 8: Pulido final
Diseño visual.
Validaciones.
Mensajes de error.
Loaders.
Datos demo.
Pruebas de flujo completo.
Criterios de aceptación

El proyecto está completo cuando:

Se levanta con Docker.
Se puede iniciar sesión como admin.
Se puede crear producto.
Se puede crear categoría.
Se puede crear combo.
El cliente puede ver catálogo público.
El cliente puede usar recomendador.
El cliente puede agregar productos al carrito.
El cliente puede hacer checkout.
El sistema genera pedido con código corto.
El cliente puede consultar seguimiento.
El admin puede cambiar estados.
El inventario se descuenta al confirmar pedido.
El admin puede subir foto preparada.
Se pueden ver reportes.
Se puede exportar PDF y Excel.

---

## Prompt corto para pegarle directamente a CODEX

```txt
Quiero convertir este repo Django REST Framework + React/Vite + PostgreSQL en una tienda online con gestionador ERP llamada Giftora.

Objetivo:
Implementar una tienda pública de regalos personalizados con carrito, checkout, recomendador de regalos, seguimiento de pedidos por código corto y un panel administrativo para gestionar productos, categorías, combos, pedidos, inventario, clientes y reportes.

Respeta la arquitectura existente del repo. No elimines módulos existentes. Extiende products, orders, inventory, crm y users. Crea los módulos faltantes necesarios.

Stack:
- Backend: Django, Django REST Framework, PostgreSQL, JWT.
- Frontend: React, Vite, React Router, Bootstrap, Axios.
- Docker: backend, frontend y db deben levantarse con docker compose up --build.

Funcionalidades obligatorias:
1. Catálogo público.
2. Detalle de producto.
3. Carrito con localStorage.
4. Checkout público.
5. Creación de pedido.
6. Código corto de pedido.
7. Seguimiento público por código.
8. CRUD admin de productos.
9. CRUD admin de categorías.
10. CRUD admin de combos.
11. Gestión de pedidos.
12. Cambio de estados.
13. Historial de estados.
14. Descuento automático de inventario al confirmar pedido.
15. Subida de foto del pedido preparado.
16. Recomendador de regalos por ocasión, presupuesto, destinatario y preferencia.
17. Reportes de ventas, productos más vendidos, bajo stock y pedidos por estado.
18. Exportación PDF/Excel en frontend.
19. Seeds iniciales para roles, usuario admin, estados, métodos de pago, categorías y productos demo.

Estados de pedido:
Pendiente, Confirmado, Preparando, Listo, En camino, Entregado, Cancelado.

Usuarios demo:
admin@regalalocal.test / admin123
manager@regalalocal.test / manager123
visitor@regalalocal.test / visitor123

Flujo mínimo que debe funcionar:
Producto → Carrito → Checkout → Pedido → Admin confirma → Inventario descuenta → Admin sube foto → Cliente consulta seguimiento.

También crea o actualiza README.md con instalación por Docker, comandos útiles, estructura, endpoints principales, usuarios demo y explicación del sistema.