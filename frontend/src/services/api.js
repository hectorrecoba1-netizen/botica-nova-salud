import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials)
};

export const productosAPI = {
    getAll: () => api.get('/productos'),
    getById: (id) => api.get(`/productos/${id}`),
    create: (data) => api.post('/productos', data),
    update: (id, data) => api.put(`/productos/${id}`, data),
    delete: (id) => api.delete(`/productos/${id}`),
    getStockBajo: () => api.get('/productos/alertas/stock-bajo')
};

export const ventasAPI = {
    getAll: () => api.get('/ventas'),
    getById: (id) => api.get(`/ventas/${id}`),
    create: (data) => api.post('/ventas', data)
};

export const categoriasAPI = {
    getAll: () => api.get('/categorias')
};

export const alertasAPI = {
    getAll: () => api.get('/alertas'),
    marcarLeida: (id) => api.put(`/alertas/${id}/leer`)
};

export default api;
