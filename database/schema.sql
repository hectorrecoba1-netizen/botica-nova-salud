-- Base de datos para Botica Nova Salud
CREATE DATABASE IF NOT EXISTS nova_salud;
USE nova_salud;

-- Tabla de usuarios (empleados/administradores)
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'vendedor') DEFAULT 'vendedor',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de categorías de productos
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

-- Tabla de productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    categoria_id INT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    stock_minimo INT DEFAULT 10,
    codigo_barras VARCHAR(50) UNIQUE,
    fecha_vencimiento DATE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabla de ventas
CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    metodo_pago ENUM('efectivo', 'tarjeta', 'transferencia') DEFAULT 'efectivo',
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de detalle de ventas
CREATE TABLE detalle_ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES ventas(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de alertas de stock
CREATE TABLE alertas_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    mensaje VARCHAR(255),
    leida BOOLEAN DEFAULT FALSE,
    fecha_alerta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Insertar datos de ejemplo
INSERT INTO categorias (nombre, descripcion) VALUES
('Analgésicos', 'Medicamentos para aliviar el dolor'),
('Antibióticos', 'Medicamentos para infecciones bacterianas'),
('Vitaminas', 'Suplementos vitamínicos'),
('Cuidado Personal', 'Productos de higiene y cuidado');

INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin', 'admin@novasalud.com', '$2a$10$XQZ9Z9Z9Z9Z9Z9Z9Z9Z9Z9', 'admin'),
('Vendedor 1', 'vendedor@novasalud.com', '$2a$10$XQZ9Z9Z9Z9Z9Z9Z9Z9Z9Z9', 'vendedor');

INSERT INTO productos (nombre, descripcion, categoria_id, precio, stock, stock_minimo, codigo_barras) VALUES
('Paracetamol 500mg', 'Analgésico y antipirético', 1, 5.50, 100, 20, '7501234567890'),
('Ibuprofeno 400mg', 'Antiinflamatorio', 1, 8.00, 50, 15, '7501234567891'),
('Amoxicilina 500mg', 'Antibiótico de amplio espectro', 2, 15.00, 30, 10, '7501234567892'),
('Vitamina C 1000mg', 'Suplemento vitamínico', 3, 12.00, 80, 20, '7501234567893');
