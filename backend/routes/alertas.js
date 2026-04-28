const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener alertas no leídas
router.get('/', async (req, res) => {
    try {
        const [alertas] = await db.query(`
            SELECT a.*, p.nombre as producto_nombre 
            FROM alertas_stock a 
            JOIN productos p ON a.producto_id = p.id 
            WHERE a.leida = FALSE 
            ORDER BY a.fecha_alerta DESC
        `);
        res.json(alertas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener alertas', error: error.message });
    }
});

// Marcar alerta como leída
router.put('/:id/leer', async (req, res) => {
    try {
        await db.query('UPDATE alertas_stock SET leida = TRUE WHERE id = ?', [req.params.id]);
        res.json({ message: 'Alerta marcada como leída' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar alerta', error: error.message });
    }
});

module.exports = router;
