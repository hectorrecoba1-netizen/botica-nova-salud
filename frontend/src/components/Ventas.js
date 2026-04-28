import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { ventasAPI } from '../services/api';
import './Ventas.css';

function Ventas({ onLogout }) {
  const [ventas, setVentas] = useState([]);
  const [selectedVenta, setSelectedVenta] = useState(null);

  useEffect(() => {
    loadVentas();
  }, []);

  const loadVentas = async () => {
    try {
      const response = await ventasAPI.getAll();
      setVentas(response.data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
    }
  };

  const viewDetails = async (id) => {
    try {
      const response = await ventasAPI.getById(id);
      setSelectedVenta(response.data);
    } catch (error) {
      console.error('Error al cargar detalle:', error);
    }
  };

  return (
    <div className="ventas">
      <Navbar onLogout={onLogout} />
      <div className="ventas-content">
        <h1>Historial de Ventas</h1>

        <table className="ventas-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Vendedor</th>
              <th>Total</th>
              <th>Método de Pago</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(venta => (
              <tr key={venta.id}>
                <td>{venta.id}</td>
                <td>{new Date(venta.fecha_venta).toLocaleString()}</td>
                <td>{venta.vendedor}</td>
                <td>S/ {venta.total}</td>
                <td>{venta.metodo_pago}</td>
                <td>
                  <button onClick={() => viewDetails(venta.id)} className="btn-view">Ver Detalle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedVenta && (
          <div className="modal">
            <div className="modal-content">
              <h2>Detalle de Venta #{selectedVenta.venta.id}</h2>
              <p><strong>Fecha:</strong> {new Date(selectedVenta.venta.fecha_venta).toLocaleString()}</p>
              <p><strong>Total:</strong> S/ {selectedVenta.venta.total}</p>
              
              <h3>Productos</h3>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVenta.detalles.map(detalle => (
                    <tr key={detalle.id}>
                      <td>{detalle.producto_nombre}</td>
                      <td>{detalle.cantidad}</td>
                      <td>S/ {detalle.precio_unitario}</td>
                      <td>S/ {detalle.subtotal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <button onClick={() => setSelectedVenta(null)} className="btn-secondary">Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Ventas;
