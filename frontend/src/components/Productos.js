import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { productosAPI, categoriasAPI } from '../services/api';
import './Productos.css';

function Productos({ onLogout }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria_id: '',
    precio: '',
    stock: '',
    stock_minimo: '',
    codigo_barras: '',
    fecha_vencimiento: ''
  });

  useEffect(() => {
    loadProductos();
    loadCategorias();
  }, []);

  const loadProductos = async () => {
    try {
      const response = await productosAPI.getAll();
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const loadCategorias = async () => {
    try {
      const response = await categoriasAPI.getAll();
      setCategorias(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productosAPI.update(editingProduct.id, formData);
      } else {
        await productosAPI.create(formData);
      }
      setShowModal(false);
      resetForm();
      loadProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  const handleEdit = (producto) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      categoria_id: producto.categoria_id,
      precio: producto.precio,
      stock: producto.stock,
      stock_minimo: producto.stock_minimo,
      codigo_barras: producto.codigo_barras || '',
      fecha_vencimiento: producto.fecha_vencimiento || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await productosAPI.delete(id);
        loadProductos();
      } catch (error) {
        console.error('Error al eliminar producto:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      categoria_id: '',
      precio: '',
      stock: '',
      stock_minimo: '',
      codigo_barras: '',
      fecha_vencimiento: ''
    });
    setEditingProduct(null);
  };

  return (
    <div className="productos">
      <Navbar onLogout={onLogout} />
      <div className="productos-content">
        <div className="productos-header">
          <h1>Gestión de Productos</h1>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Nuevo Producto
          </button>
        </div>

        <table className="productos-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Stock Mínimo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(producto => (
              <tr key={producto.id} className={producto.stock <= producto.stock_minimo ? 'low-stock' : ''}>
                <td>{producto.codigo_barras}</td>
                <td>{producto.nombre}</td>
                <td>{producto.categoria_nombre}</td>
                <td>S/ {producto.precio}</td>
                <td>{producto.stock}</td>
                <td>{producto.stock_minimo}</td>
                <td>
                  <button onClick={() => handleEdit(producto)} className="btn-edit">Editar</button>
                  <button onClick={() => handleDelete(producto.id)} className="btn-delete">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <form onSubmit={handleSubmit}>
                <label>Nombre:</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                />
                <label>Descripción:</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                />
                <label>Categoría:</label>
                <select
                  value={formData.categoria_id}
                  onChange={(e) => setFormData({...formData, categoria_id: e.target.value})}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                  ))}
                </select>
                <label>Precio (S/):</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({...formData, precio: e.target.value})}
                  required
                />
                <label>Stock:</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  required
                />
                <label>Stock Mínimo:</label>
                <input
                  type="number"
                  value={formData.stock_minimo}
                  onChange={(e) => setFormData({...formData, stock_minimo: e.target.value})}
                  required
                />
                <label>Código (6 dígitos):</label>
                <input
                  type="text"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  value={formData.codigo_barras}
                  onChange={(e) => setFormData({...formData, codigo_barras: e.target.value})}
                />
                <label>Fecha de Vencimiento:</label>
                <input
                  type="date"
                  value={formData.fecha_vencimiento}
                  onChange={(e) => setFormData({...formData, fecha_vencimiento: e.target.value})}
                />
                <div className="modal-actions">
                  <button type="submit" className="btn-primary">Guardar</button>
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-secondary">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Productos;
