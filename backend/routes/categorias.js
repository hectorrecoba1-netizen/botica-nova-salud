const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const [categorias] = await db.query('SELECT * FROM categorias ORDER BY nombre');
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener categorías', error: error.message });
    }
});

module.exports = router;
