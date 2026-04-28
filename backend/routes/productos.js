const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const [productos] = await db.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id 
            WHERE p.activo = TRUE
            ORDER BY p.nombre
        `);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
});

// Productos con stock bajo (ANTES de /:id)
router.get('/alertas/stock-bajo', async (req, res) => {
    try {
        const [productos] = await db.query(`
            SELECT p.*, c.nombre as categoria_nombre 
            FROM productos p 
            LEFT JOIN categorias c ON p.categoria_id = c.id 
            WHERE p.stock <= p.stock_minimo AND p.activo = TRUE
            ORDER BY p.stock ASC
        `);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener alertas', error: error.message });
    }
});

// Productos más vendidos (ANTES de /:id)
router.get('/mas-vendidos', async (req, res) => {
    try {
        const [productos] = await db.query(`
            SELECT 
                p.id,
                p.nombre,
                p.precio,
                c.nombre as categoria_nombre,
                COALESCE(SUM(dv.cantidad), 0) as total_vendido
            FROM productos p
            LEFT JOIN categorias c ON p.categoria_id = c.id
            LEFT JOIN detalle_ventas dv ON p.id = dv.producto_id
            WHERE p.activo = TRUE
            GROUP BY p.id, p.nombre, p.precio, c.nombre
            ORDER BY total_vendido DESC
            LIMIT 5
        `);
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos más vendidos', error: error.message });
    }
});

// Obtener producto por ID
router.get('/:id', async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM productos WHERE id = ?', [req.params.id]);
        if (productos.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(productos[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener producto', error: error.message });
    }
});

// Crear producto
router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, categoria_id, precio, stock, stock_minimo, codigo_barras, fecha_vencimiento } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO productos (nombre, descripcion, categoria_id, precio, stock, stock_minimo, codigo_barras, fecha_vencimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, categoria_id, precio, stock, stock_minimo, codigo_barras, fecha_vencimiento]
        );
        
        res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
});

// Actualizar producto
router.put('/:id', async (req, res) => {
    try {
        const { nombre, descripcion, categoria_id, precio, stock, stock_minimo, codigo_barras, fecha_vencimiento } = req.body;
        
        await db.query(
            'UPDATE productos SET nombre = ?, descripcion = ?, categoria_id = ?, precio = ?, stock = ?, stock_minimo = ?, codigo_barras = ?, fecha_vencimiento = ? WHERE id = ?',
            [nombre, descripcion, categoria_id, precio, stock, stock_minimo, codigo_barras, fecha_vencimiento, req.params.id]
        );
        
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
});

// Eliminar producto (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        await db.query('UPDATE productos SET activo = FALSE WHERE id = ?', [req.params.id]);
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
});

module.exports = router;
