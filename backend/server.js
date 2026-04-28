const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/ventas', require('./routes/ventas'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/alertas', require('./routes/alertas'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'API Botica Nova Salud funcionando' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
