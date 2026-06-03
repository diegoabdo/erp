# Arquitectura de Giftora — Smart gifting, from order to delivery.

## Visión General

```
┌─────────────────────────────────────────────────────────────────┐
│                     Giftora                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────┐              ┌──────────────────────────┐   │
│  │   TIENDA PÚBLICA │              │  PANEL ADMINISTRATIVO    │   │
│  ├──────────────────┤              ├──────────────────────────┤   │
│  │ • Catálogo       │              │ • Dashboard              │   │
│  │ • Recomendador   │              │ • CRUD Productos         │   │
│  │ • Carrito        │              │ • Gestión Inventario     │   │
│  │ • Checkout       │              │ • Gestión Pedidos        │   │
│  │ • Seguimiento    │              │ • Gestión Clientes       │   │
│  │   (sin login)    │              │ • Reportes               │   │
│  └────────┬─────────┘              └────────┬─────────────────┘   │
│           │                                  │                      │
│           └──────────────┬───────────────────┘                      │
│                          │                                          │
│                    ┌─────▼──────────┐                              │
│                    │  BACKEND API   │                              │
│                    │  (Django REST) │                              │
│                    └─────┬──────────┘                              │
│                          │                                          │
│        ┌─────────────────┼─────────────────┐                       │
│        │                 │                 │                       │
│    ┌───▼───┐         ┌──▼──┐          ┌──▼──┐                    │
│    │Orders │         │ CRM │          │Prods│ ...                │
│    └───────┘         └─────┘          └─────┘                    │
│        │                 │                 │                       │
│        └─────────────────┼─────────────────┘                       │
│                          │                                          │
│                    ┌─────▼──────────┐                              │
│                    │  PostgreSQL    │                              │
│                    │   Database     │                              │
│                    └────────────────┘                              │
│                                                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stack Tecnológico

### Backend
- **Python 3.12** + **Django 4.2**
- **Django REST Framework** - APIs RESTful
- **Simple JWT** - Autenticación
- **PostgreSQL 17** - Base de datos
- **Pillow** - Procesamiento de imágenes
- **Docker** - Containerización

### Frontend
- **React 18** - UI
- **Vite** - Build tool / Dev server
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Bootstrap 5** - Estilos
- **jsPDF + AutoTable** - Generación PDF
- **XLSX** - Exportación Excel

### Infraestructura
- **Docker Compose** - Orquestación local
- **Volúmenes** - Persistencia de datos

---

## Estructura de Apps Django

### `users/`
- **Propósito**: Gestión de usuarios y autenticación
- **Modelos**: `User` (modelo personalizado con roles)
- **Endpoints**:
  - `POST /api/users/token/` - Obtener token JWT
  - `POST /api/users/token/refresh/` - Refrescar token
  - `GET /api/users/users/` - Listar usuarios (admin)
  - `GET /api/users/users/me/` - Datos del usuario actual

### `products/`
- **Propósito**: Gestión de productos, categorías y combos
- **Modelos**: 
  - `Category` - Categorías jerárquicas
  - `Product` - Productos
  - `ProductBundle` - Combos/paquetes
  - `ProductBundleItem` - Items dentro de combos
- **Endpoints**: CRUD completo para cada modelo

### `orders/`
- **Propósito**: Gestión de pedidos
- **Modelos**:
  - `Order` - Pedidos
  - `OrderItem` - Items en pedidos
  - `OrderStatus` - Estados disponibles
  - `OrderStatusHistory` - Historial de cambios
  - `PaymentMethod` - Métodos de pago
- **Características**: Generación automática de código corto (`short_id`)

### `inventory/`
- **Propósito**: Control de stock y movimientos
- **Modelos**: `InventoryMovement` - Registro de entradas/salidas
- **Características**: Descuento automático al confirmar pedido

### `crm/`
- **Propósito**: Gestión de clientes
- **Modelos**: `Customer` - Información de clientes públicos
- **Endpoints**: CRUD de clientes

### `public/`
- **Propósito**: Endpoints públicos sin autenticación
- **Endpoints**:
  - Categorías públicas
  - Productos públicos
  - Detalle de producto
  - Productos destacados
  - Recomendador
  - Seguimiento de pedido (por código corto)
  - Crear pedido público

### `reports/`
- **Propósito**: Generación de reportes
- **Endpoints**:
  - Resumen de ventas
  - Productos más vendidos
  - Bajo stock
  - Pedidos por estado
  - Resumen de clientes

---

## Estructura de Frontend

```
src/
├── core/
│   ├── api/
│   │   └── apiClient.js        # Cliente axios configurado
│   ├── components/
│   │   └── Navigation.jsx       # Navbar principal
│   ├── layouts/
│   │   └── MainLayout.jsx
│   └── auth/
│       └── authService.js
│
├── modules/
│   ├── publicStore/             # Tienda pública
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductListPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── RecommendationPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   └── TrackingPage.jsx
│   │   ├── components/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── CategoryCard.jsx
│   │   │   ├── CartSummary.jsx
│   │   │   └── OrderTimeline.jsx
│   │   └── services/
│   │       ├── publicStoreService.js
│   │       └── cartService.js
│   │
│   ├── admin/                   # Panel administrativo
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   │
│   ├── products/                # Gestión de productos
│   ├── orders/                  # Gestión de pedidos
│   ├── inventory/               # Gestión de inventario
│   ├── crm/                     # Gestión de clientes
│   ├── reports/                 # Reportes
│   └── Auth/                    # Autenticación
│
├── App.jsx
└── main.jsx
```

---

## Flujo de Datos

### Flujo de Compra (Público)

```
Cliente
  │
  ├─→ Ver catálogo
  │    └─→ GET /api/public/products/
  │
  ├─→ Usar recomendador
  │    └─→ POST /api/public/recommendations/
  │
  ├─→ Agregar al carrito (localStorage)
  │    └─→ [Almacenado localmente]
  │
  ├─→ Checkout
  │    ├─→ Ingresar datos
  │    └─→ POST /api/public/orders/ (crea Order)
  │
  └─→ Seguimiento
       └─→ GET /api/public/orders/track/{short_id}/
```

### Flujo Administrativo

```
Admin
  │
  ├─→ Autenticación
  │    └─→ POST /api/users/token/
  │
  ├─→ Ver pedidos
  │    └─→ GET /api/orders/
  │
  ├─→ Cambiar estado
  │    └─→ PATCH /api/orders/{id}/
  │         └─→ Crea OrderStatusHistory
  │
  ├─→ Si estado = Confirmado
  │    └─→ Descuenta inventario automáticamente
  │
  ├─→ Subir foto
  │    └─→ PATCH /api/orders/{id}/ (prepared_image)
  │
  └─→ Ver reportes
       └─→ GET /api/reports/{tipo}/
```

---

## Seguridad

### Autenticación
- JWT (Simple JWT)
- Tokens con expiración (24h por defecto)
- Refresh tokens

### Permisos
- `IsAuthenticatedOrReadOnly` - Endpoints públicos leen sin auth
- `IsAuthenticated` - Requiere login
- `IsAdminUser` - Solo admin/manager

### Validaciones
- Productos: nombre, precio > 0, slug único
- Pedidos: al menos 1 item, dirección, destinatario
- Inventario: no negativos, movimientos registrados

---

## Estados de Pedido

```
Pendiente
   ↓ (Admin confirma)
Confirmado (↓ descuenta inventario automáticamente)
   ↓
Preparando
   ↓ (Admin sube foto)
Listo
   ↓
En camino
   ↓
Entregado

Cancelado (desde cualquier estado previo)
```

---

## Variables de Entorno

```env
# PostgreSQL
POSTGRES_DB=regalalocal_db
POSTGRES_USER=regalalocal_user
POSTGRES_PASSWORD=regalalocal_password
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Django
DJANGO_SECRET_KEY=dev-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend

# Frontend
VITE_API_URL=http://localhost:8000/api
```

---

## Datos Iniciales (Seed)

El comando `seed_regalalocal` crea automáticamente:

- **Usuarios**: admin, manager, visitor
- **Estados**: Pendiente, Confirmado, Preparando, Listo, En camino, Entregado, Cancelado
- **Métodos de pago**: 4 opciones
- **Categorías**: 8 categorías base

---

## Próximos Pasos de Desarrollo

### Fase 2: APIs Públicas (50%)
- [ ] Completar recomendador con lógica avanzada
- [ ] Crear pedido público completo
- [ ] Validaciones exhaustivas

### Fase 3: Carrito (0%)
- [ ] localStorage implementation
- [ ] Sincronización con backend
- [ ] Persistencia entre sesiones

### Fase 4: Pedidos e Inventario (20%)
- [ ] Cambio de estados
- [ ] Descuento automático
- [ ] Subida de imagen preparada
- [ ] Historial

### Fase 5: Recomendador (30%)
- [ ] UI del recomendador
- [ ] Lógica de recomendación mejorada
- [ ] Caché de recomendaciones

### Fase 6: Admin Dashboard (20%)
- [ ] CRUD completo
- [ ] Listados y filtros
- [ ] Formularios de edición

### Fase 7: Reportes (10%)
- [ ] Tablas de datos
- [ ] Exportación PDF
- [ ] Exportación Excel
- [ ] Gráficos básicos

### Fase 8: Pulido (0%)
- [ ] UI/UX mejorado
- [ ] Validaciones visuales
- [ ] Mensajes de error
- [ ] Loaders
- [ ] Testing

---

## Contribución

El proyecto está estructurado para facilitar la extensión:

1. Cada app es independiente
2. Los serializers validan datos
3. Los viewsets manejan lógica común
4. Los servicios encapsulan lógica específica

Para agregar una nueva funcionalidad:

1. Crear modelo en `models.py`
2. Crear serializer en `serializers.py`
3. Crear viewset en `views.py`
4. Registrar en `urls.py`
5. Agregar admin si aplica en `admin.py`

---

**Última actualización**: Junio 2, 2026
