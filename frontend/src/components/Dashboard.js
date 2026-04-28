import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { productosAPI, ventasAPI, alertasAPI } from '../services/api';
import './Dashboard.css';

function Dashboard({ onLogout }) {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalVentas: 0,
    alertasStock: 0
  });
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [productosRes, ventasRes, alertasRes] = await Promise.all([
        productosAPI.getAll(),
        ventasAPI.getAll(),
        alertasAPI.getAll()
      ]);

      setStats({
        totalProductos: productosRes.data.length,
        totalVentas: ventasRes.data.length,
        alertasStock: alertasRes.data.length
      });

      setAlertas(alertasRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  return (
    <div className="dashboard">
      <Navbar onLogout={onLogout} />
      <div className="dashboard-content">
        <h1>Panel de Control</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Productos</h3>
            <p className="stat-number">{stats.totalProductos}</p>
          </div>
          <div className="stat-card">
            <h3>Total Ventas</h3>
            <p className="stat-number">{stats.totalVentas}</p>
          </div>
          <div className="stat-card alert">
            <h3>Alertas de Stock</h3>
            <p className="stat-number">{stats.alertasStock}</p>
          </div>
        </div>

        <div className="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div className="actions-grid">
            <Link to="/nueva-venta" className="action-btn">Nueva Venta</Link>
            <Link to="/productos" className="action-btn">Ver Productos</Link>
            <Link to="/ventas" className="action-btn">Ver Ventas</Link>
          </div>
        </div>

        {alertas.length > 0 && (
          <div className="alertas-section">
            <h2>Alertas Recientes</h2>
            <ul className="alertas-list">
              {alertas.map(alerta => (
                <li key={alerta.id}>
                  <strong>{alerta.producto_nombre}</strong>: {alerta.mensaje}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
