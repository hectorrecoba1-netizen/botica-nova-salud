const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todas las ventas
router.get('/', async (req, res) => {
    try {
        const [ventas] = await db.query(`
            SELECT v.*, u.nombre as vendedor 
            FROM ventas v 
            JOIN usuarios u ON v.usuario_id = u.id 
            ORDER BY v.fecha_venta DESC
        `);
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener ventas', error: error.message });
    }
});

// Obtener detalle de una venta
router.get('/:id', async (req, res) => {
    try {
        const [venta] = await db.query('SELECT * FROM ventas WHERE id = ?', [req.params.id]);
        
        if (venta.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }
        
        const [detalles] = await db.query(`
            SELECT dv.*, p.nombre as producto_nombre 
            FROM detalle_ventas dv 
            JOIN productos p ON dv.producto_id = p.id 
            WHERE dv.venta_id = ?
        `, [req.params.id]);
        
        res.json({ venta: venta[0], detalles });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener venta', error: error.message });
    }
});

// Crear venta
router.post('/', async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { usuario_id, productos, metodo_pago } = req.body;
        let total = 0;
        
        // Calcular total
        for (const item of productos) {
            total += item.precio_unitario * item.cantidad;
        }
        
        // Insertar venta
        const [ventaResult] = await connection.query(
            'INSERT INTO ventas (usuario_id, total, metodo_pago) VALUES (?, ?, ?)',
            [usuario_id, total, metodo_pago]
        );
        
        const ventaId = ventaResult.insertId;
        
        // Insertar detalles y actualizar stock
        for (const item of productos) {
            const subtotal = item.precio_unitario * item.cantidad;
            
            await connection.query(
                'INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
                [ventaId, item.producto_id, item.cantidad, item.precio_unitario, subtotal]
            );
            
            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE id = ?',
                [item.cantidad, item.producto_id]
            );
            
            // Verificar si necesita alerta de stock
            const [producto] = await connection.query(
                'SELECT stock, stock_minimo FROM productos WHERE id = ?',
                [item.producto_id]
            );
            
            if (producto[0].stock <= producto[0].stock_minimo) {
                await connection.query(
                    'INSERT INTO alertas_stock (producto_id, mensaje) VALUES (?, ?)',
                    [item.producto_id, `Stock bajo: ${producto[0].stock} unidades`]
                );
            }
        }
        
        await connection.commit();
        res.status(201).json({ id: ventaId, message: 'Venta registrada exitosamente' });
        
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Error al registrar venta', error: error.message });
    } finally {
        connection.release();
    }
});

module.exports = router;
