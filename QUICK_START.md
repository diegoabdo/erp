# Giftora — Smart gifting, from order to delivery. - Guía de Instalación y Uso

## ⚡ Inicio Rápido con Docker

### Requisitos

- Docker
- Docker Compose

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   cd erp
   ```

2. **Crear archivo .env** (ya existe, pero puedes personalizarlo)
   ```bash
   cp .env.example .env
   ```

3. **Levantar los servicios**
   ```bash
   docker compose up --build
   ```

   Esto creará y levantará:
   - **Frontend**: http://localhost:5173
   - **Backend**: http://localhost:8000/api
   - **PostgreSQL**: localhost:5432

4. **Cargar datos iniciales** (en otra terminal)
   ```bash
   docker compose exec backend python manage.py seed_regalalocal
   ```

5. **Crear un superusuario adicional** (opcional)
   ```bash
   docker compose exec backend python manage.py createsuperuser
   ```

### Acceso a la aplicación

- **Tienda pública**: http://localhost:5173
- **Admin Django**: http://localhost:8000/admin
- **API Backend**: http://localhost:8000/api

### Usuarios de prueba incluidos

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@regalalocal.test | admin123 | Admin |
| manager@regalalocal.test | manager123 | Manager |
| visitor@regalalocal.test | visitor123 | Visitor |

---

## 📋 Comandos útiles

### Logs
```bash
# Ver logs de todos los servicios
docker compose logs -f

# Ver logs solo del backend
docker compose logs -f backend

# Ver logs solo del frontend
docker compose logs -f frontend
```

### Acceso a los contenedores
```bash
# Entrar al contenedor backend
docker compose exec backend bash

# Entrar al contenedor frontend
docker compose exec frontend sh

# Entrar a la base de datos
docker compose exec db psql -U regalalocal_user -d regalalocal_db
```

### Migraciones
```bash
# Crear migraciones
docker compose exec backend python manage.py makemigrations

# Aplicar migraciones
docker compose exec backend python manage.py migrate

# Ver historial de migraciones
docker compose exec backend python manage.py showmigrations
```

### Detener los servicios
```bash
# Detener sin eliminar volúmenes
docker compose down

# Detener y eliminar volúmenes (borra la BD)
docker compose down -v
```

---

## 🏗️ Estructura del Proyecto

```
Giftora-ERP/
├── backend/
│   ├── backend/           # Configuración principal de Django
│   ├── users/            # Gestión de usuarios
│   ├── products/         # Productos, categorías, combos
│   ├── orders/           # Gestión de pedidos
│   ├── inventory/        # Gestión de inventario
│   ├── crm/              # Gestión de clientes
│   ├── public/           # APIs públicas
│   ├── reports/          # Reportes
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── core/         # Componentes base, API client
│   │   ├── modules/      # Módulos de la aplicación
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── Dockerfile
│
├── docker-compose.yml    # Orquestación de servicios
├── .env.example          # Variables de entorno ejemplo
├── .env                  # Variables de entorno (no commitear)
├── .gitignore
└── README.md
```

---

## 📚 Stack Tecnológico

### Backend
- **Python 3.12** con Django 4.2
- **Django REST Framework** para APIs
- **PostgreSQL** como base de datos
- **JWT** (Simple JWT) para autenticación
- **Pillow** para procesamiento de imágenes
- **Docker** para containerización

### Frontend
- **React 18** con Vite
- **React Router v6** para navegación
- **Axios** para solicitudes HTTP
- **Bootstrap 5** para UI
- **jsPDF** para generación de PDF
- **XLSX** para exportación a Excel

### Infraestructura
- **Docker Compose** para orquestación local
- **PostgreSQL 17** en contenedor

---

## 🔐 Autenticación

### Obtener token JWT

```bash
curl -X POST http://localhost:8000/api/users/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin@regalalocal.test", "password": "admin123"}'
```

### Usar token en solicitudes

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/products/
```

---

## 🛣️ Rutas principales de la API

### Públicas (sin autenticación)
- `GET /api/public/categories/` - Categorías
- `GET /api/public/products/` - Productos
- `GET /api/public/products/{slug}/` - Detalle de producto
- `GET /api/public/featured/` - Productos destacados
- `POST /api/public/recommendations/` - Recomendador
- `GET /api/public/orders/track/{short_id}/` - Seguimiento de pedido
- `POST /api/public/orders/` - Crear pedido

### Administrativas (requieren JWT + rol admin/manager)
- `GET /api/products/` - CRUD de productos
- `GET /api/products/categories/` - CRUD de categorías
- `GET /api/products/bundles/` - CRUD de combos
- `GET /api/orders/` - CRUD de pedidos
- `GET /api/inventory/movements/` - Movimientos de inventario
- `GET /api/crm/customers/` - Gestión de clientes
- `GET /api/reports/sales-summary/` - Reportes

---

## 📊 Estados de Pedido

1. **Pendiente** - Pedido recién creado
2. **Confirmado** - Admin confirma el pedido (descuenta inventario)
3. **Preparando** - El regalo se está preparando
4. **Listo** - El regalo está listo (puede subirse foto)
5. **En camino** - Pedido en camino al destinatario
6. **Entregado** - Entrega completada
7. **Cancelado** - Pedido cancelado

---

## 💾 Seeding de datos

El comando `seed_regalalocal` carga automáticamente:

- **Usuarios**: admin, manager, visitor
- **Estados de pedido**: Todos los 7 estados
- **Métodos de pago**: 4 opciones
- **Categorías**: 8 categorías base

### Ejecutar manualmente

```bash
docker compose exec backend python manage.py seed_regalalocal
```

---

## 🐛 Troubleshooting

### "Conexión rechazada a base de datos"
```bash
# Esperar a que PostgreSQL esté listo
docker compose up db
# En otra terminal
docker compose up backend
```

### "Módulo no encontrado"
```bash
# Reinstalar dependencias
docker compose exec frontend npm install
docker compose exec backend pip install -r requirements.txt
```

### "Migraciones pendientes"
```bash
docker compose exec backend python manage.py migrate
```

### Limpiar todo y empezar de nuevo
```bash
docker compose down -v
docker system prune
docker compose up --build
```

---

## 📝 Variables de entorno

### .env disponibles

```env
# PostgreSQL
POSTGRES_DB=regalalocal_db
POSTGRES_USER=regalalocal_user
POSTGRES_PASSWORD=regalalocal_password
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Django
DJANGO_SECRET_KEY=dev-secret-key-change-in-production
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1,backend

# Frontend
VITE_API_URL=http://localhost:8000/api
```

---

## 🚀 Próximos pasos de desarrollo

1. Implementar endpoints públicos completos
2. Crear módulo de carrito en localStorage
3. Implementar flujo de checkout
4. Crear panel administrativo completo
5. Implementar recomendador de regalos
6. Agregar generación de reportes PDF/Excel
7. Pulir UI/UX
8. Pruebas de flujo completo

---

## 📄 Licencia

Este proyecto está bajo licencia MIT. Ver archivo LICENSE.

---

## 👨‍💻 Desarrollo

### Para modificar el backend

1. Editar archivos en `backend/`
2. El cambio se refleja inmediatamente (volúmenes montados)
3. Crear migraciones si hay cambios en modelos:
   ```bash
   docker compose exec backend python manage.py makemigrations
   docker compose exec backend python manage.py migrate
   ```

### Para modificar el frontend

1. Editar archivos en `frontend/src/`
2. El cambio se refleja inmediatamente (HMR de Vite)

---

## 📞 Soporte

Para reportar problemas o sugerencias, crear un issue en el repositorio.

---

**última actualización**: Junio 2026
