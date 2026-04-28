import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/productos', icon: '📦', label: 'Productos' },
    { path: '/ventas', icon: '🛒', label: 'Ventas' },
    { path: '/nueva-venta', icon: '➕', label: 'Nueva Venta' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-text">
          <h3>Botica Nova Salud</h3>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">{user.nombre?.charAt(0) || 'U'}</div>
          <div className="user-info">
            <p className="user-name">{user.nombre}</p>
            <p className="user-role">{user.rol}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          🚪 Salir
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
