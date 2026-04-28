# Sistema de Gestión de Inventario y Ventas - Botica Nova Salud

Sistema web fullstack para la gestión integral de inventario, ventas y atención al cliente de una botica.

## Tecnologías Utilizadas

### Backend
- Node.js
- Express.js
- MySQL (via XAMPP)
- JSON Web Tokens (JWT)
- Axios
- CORS

### Frontend
- React.js
- React Router DOM
- Axios
- SweetAlert2
- Recharts (gráficos)
- CSS3

### Base de Datos
- MySQL 8.0
- MySQL Workbench

## Características Principales

✅ **Gestión de Inventario**
- Registro y actualización de productos
- Control de stock en tiempo real
- Alertas automáticas de stock bajo
- Categorización de productos
- Códigos de producto de 6 dígitos

✅ **Sistema de Ventas**
- Carrito de compras intuitivo
- Registro de ventas con detalle
- Múltiples métodos de pago (efectivo, tarjeta, transferencia)
- Historial completo de ventas
- Actualización automática de inventario

✅ **Panel de Control**
- Dashboard con estadísticas en tiempo real
- Visualización de alertas de stock
- Accesos rápidos a funciones principales

✅ **Seguridad**
- Autenticación con JWT
- Roles de usuario (admin, vendedor)
- Rutas protegidas

## Requisitos Previos

- Node.js (v18 o superior)
- XAMPP (con MySQL activo)
- MySQL Workbench
- Git

## Instalación

### 1. Descargar el proyecto

Clona el repositorio desde GitHub:
```bash
git clone https://github.com/TU_USUARIO/botica-nova-salud.git
cd botica-nova-salud
```

O descarga el ZIP directamente desde GitHub.

### 2. Configurar la Base de Datos

1. Iniciar XAMPP y activar el servicio MySQL
2. Abrir MySQL Workbench
3. Conectarse a localhost:3306
4. Ejecutar el script `database/schema.sql`

### 3. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` con las siguientes variables:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=nova_salud
JWT_SECRET=tu_clave_secreta_super_segura_2024
```

### 4. Configurar el Frontend

```bash
cd ../frontend
npm install
```

## Ejecución

### Iniciar el Backend

```bash
cd backend
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### Iniciar el Frontend

En otra terminal:

```bash
cd frontend
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

## Credenciales de Prueba

**Administrador:**
- Email: `admin@novasalud.com`
- Contraseña: `admin123`

**Vendedor:**
- Email: `vendedor@novasalud.com`
- Contraseña: `admin123`

## Funcionalidades por Módulo

### Módulo de Productos
- Listar todos los productos
- Crear nuevo producto
- Editar producto existente
- Eliminar producto (soft delete)
- Filtrar productos con stock bajo

### Módulo de Ventas
- Crear nueva venta
- Buscar productos por nombre o código
- Agregar productos al carrito
- Ajustar cantidades
- Seleccionar método de pago
- Ver historial de ventas
- Ver detalle de cada venta

### Módulo de Alertas
- Notificaciones automáticas de stock bajo
- Visualización en dashboard
- Marcar alertas como leídas

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión

### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener producto por ID
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto
- `GET /api/productos/alertas/stock-bajo` - Productos con stock bajo

### Ventas
- `GET /api/ventas` - Obtener todas las ventas
- `GET /api/ventas/:id` - Obtener detalle de venta
- `POST /api/ventas` - Registrar nueva venta

### Categorías
- `GET /api/categorias` - Obtener todas las categorías

### Alertas
- `GET /api/alertas` - Obtener alertas no leídas
- `PUT /api/alertas/:id/leer` - Marcar alerta como leída

## Base de Datos

### Tablas Principales

- **usuarios**: Almacena usuarios del sistema (admin, vendedor)
- **categorias**: Categorías de productos (Analgésicos, Antibióticos, etc.)
- **productos**: Inventario de productos
- **ventas**: Registro de ventas realizadas
- **detalle_ventas**: Detalle de productos por venta
- **alertas_stock**: Alertas de reposición automáticas

## Autor

Hector210

## Licencia

Este proyecto fue desarrollado como trabajo final del curso de Fullstack Developer.
