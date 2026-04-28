import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { productosAPI, ventasAPI, alertasAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

function Dashboard({ onLogout }) {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalVentas: 0,
    alertasStock: 0,
    ventasHoy: 0
  });
  const [alertas, setAlertas] = useState([]);
  const [ventasSemanales, setVentasSemanales] = useState([]);
  const [productosVendidos, setProductosVendidos] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [productosRes, ventasRes, alertasRes, masVendidosRes] = await Promise.all([
        productosAPI.getAll(),
        ventasAPI.getAll(),
        alertasAPI.getAll(),
        productosAPI.getMasVendidos()
      ]);

      // Calcular ventas de hoy
      const hoy = new Date().toDateString();
      const ventasHoy = ventasRes.data.filter(v => 
        new Date(v.fecha_venta).toDateString() === hoy
      ).length;

      setStats({
        totalProductos: productosRes.data.length,
        totalVentas: ventasRes.data.length,
        alertasStock: alertasRes.data.length,
        ventasHoy
      });

      setAlertas(alertasRes.data.slice(0, 5));

      // Procesar ventas de los últimos 7 días
      const ultimos7Dias = [];
      for (let i = 6; i >= 0; i--) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - i);
        const fechaStr = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
        const ventasDia = ventasRes.data.filter(v => {
          const ventaFecha = new Date(v.fecha_venta);
          return ventaFecha.toDateString() === fecha.toDateString();
        });
        ultimos7Dias.push({
          fecha: fechaStr,
          ventas: ventasDia.length,
          total: ventasDia.reduce((sum, v) => sum + parseFloat(v.total), 0)
        });
      }
      setVentasSemanales(ultimos7Dias);

      // Productos más vendidos desde la base de datos
      setProductosVendidos(masVendidosRes.data);

    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1>¡Bienvenido!</h1>
            <p>Aquí tienes un resumen general de tu botica.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">📦</div>
            <div className="stat-info">
              <p className="stat-label">Total Productos</p>
              <h3 className="stat-value">{stats.totalProductos}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">🛒</div>
            <div className="stat-info">
              <p className="stat-label">Ventas (Hoy)</p>
              <h3 className="stat-value">{stats.ventasHoy}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">⚠️</div>
            <div className="stat-info">
              <p className="stat-label">Alertas de Stock</p>
              <h3 className="stat-value">{stats.alertasStock}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">📅</div>
            <div className="stat-info">
              <p className="stat-label">Fecha Actual</p>
              <h3 className="stat-value-small">{new Date().toLocaleDateString('es-ES')}</h3>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="chart-card">
            <h2>Ventas de los últimos 7 días</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ventasSemanales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas" fill="#667eea" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="products-card">
            <h2>Productos más vendidos</h2>
            <div className="products-list">
              {productosVendidos.length > 0 ? (
                productosVendidos.map((producto, index) => (
                  <div key={producto.id} className="product-item">
                    <div className="product-rank">{index + 1}</div>
                    <div className="product-info">
                      <p className="product-name">{producto.nombre}</p>
                      <p className="product-category">{producto.categoria_nombre}</p>
                    </div>
                    <div className="product-sales">{producto.total_vendido} uds</div>
                  </div>
                ))
              ) : (
                <p style={{textAlign: 'center', color: '#7f8c8d', padding: '20px'}}>
                  No hay ventas registradas aún
                </p>
              )}
            </div>
          </div>
        </div>

        {alertas.length > 0 && (
          <div className="alertas-card">
            <h2>Alertas Recientes</h2>
            <div className="alertas-list">
              {alertas.map(alerta => (
                <div key={alerta.id} className="alerta-item">
                  <span className="alerta-icon">⚠️</span>
                  <div className="alerta-content">
                    <strong>{alerta.producto_nombre}</strong>
                    <p>{alerta.mensaje}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
