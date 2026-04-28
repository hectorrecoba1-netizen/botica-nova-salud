import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { productosAPI, ventasAPI } from '../services/api';
import './NuevaVenta.css';

function NuevaVenta({ onLogout }) {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      const response = await productosAPI.getAll();
      setProductos(response.data.filter(p => p.stock > 0));
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const agregarAlCarrito = (producto) => {
    const existe = carrito.find(item => item.producto_id === producto.id);
    
    if (existe) {
      if (existe.cantidad < producto.stock) {
        setCarrito(carrito.map(item =>
          item.producto_id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        ));
      } else {
        alert('No hay suficiente stock');
      }
    } else {
      setCarrito([...carrito, {
        producto_id: producto.id,
        nombre: producto.nombre,
        precio_unitario: producto.precio,
        cantidad: 1,
        stock_disponible: producto.stock
      }]);
    }
  };

  const actualizarCantidad = (producto_id, nuevaCantidad) => {
    const producto = carrito.find(item => item.producto_id === producto_id);
    
    if (nuevaCantidad <= 0) {
      setCarrito(carrito.filter(item => item.producto_id !== producto_id));
    } else if (nuevaCantidad <= producto.stock_disponible) {
      setCarrito(carrito.map(item =>
        item.producto_id === producto_id
          ? { ...item, cantidad: nuevaCantidad }
          : item
      ));
    } else {
      alert('No hay suficiente stock');
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio_unitario * item.cantidad), 0);
  };

  const procesarVenta = async () => {
    if (carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      await ventasAPI.create({
        usuario_id: user.id,
        productos: carrito,
        metodo_pago: metodoPago
      });

      alert('Venta registrada exitosamente');
      setCarrito([]);
      navigate('/ventas');
    } catch (error) {
      console.error('Error al procesar venta:', error);
      alert('Error al procesar la venta');
    }
  };

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_barras?.includes(busqueda)
  );

  return (
    <div className="nueva-venta">
      <Navbar onLogout={onLogout} />
      <div className="nueva-venta-content">
        <h1>Nueva Venta</h1>

        <div className="venta-grid">
          <div className="productos-section">
            <h2>Productos Disponibles</h2>
            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
            <div className="productos-list">
              {productosFiltrados.map(producto => (
                <div key={producto.id} className="producto-card">
                  <h3>{producto.nombre}</h3>
                  <p>Precio: S/ {producto.precio}</p>
                  <p>Stock: {producto.stock}</p>
                  <button onClick={() => agregarAlCarrito(producto)} className="btn-add">
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="carrito-section">
            <h2>Carrito de Compra</h2>
            {carrito.length === 0 ? (
              <p>El carrito está vacío</p>
            ) : (
              <>
                <table className="carrito-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map(item => (
                      <tr key={item.producto_id}>
                        <td>{item.nombre}</td>
                        <td>S/ {item.precio_unitario}</td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            max={item.stock_disponible}
                            value={item.cantidad}
                            onChange={(e) => actualizarCantidad(item.producto_id, parseInt(e.target.value))}
                            className="cantidad-input"
                          />
                        </td>
                        <td>S/ {(item.precio_unitario * item.cantidad).toFixed(2)}</td>
                        <td>
                          <button onClick={() => actualizarCantidad(item.producto_id, 0)} className="btn-remove">
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="venta-total">
                  <h3>Total: S/ {calcularTotal().toFixed(2)}</h3>
                </div>

                <div className="metodo-pago">
                  <label>Método de Pago:</label>
                  <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                  </select>
                </div>

                <button onClick={procesarVenta} className="btn-procesar">
                  Procesar Venta
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NuevaVenta;
