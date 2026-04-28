import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Botica Nova Salud</h2>
      </div>
      <ul className="navbar-menu">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/productos">Productos</Link></li>
        <li><Link to="/ventas">Ventas</Link></li>
        <li><Link to="/nueva-venta">Nueva Venta</Link></li>
      </ul>
      <div className="navbar-user">
        <span>{user.nombre}</span>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </nav>
  );
}

export default Navbar;
