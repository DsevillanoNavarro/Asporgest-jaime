import React, { useState } from 'react';

function CrearIncidencia() {
  const [formData, setFormData] = useState({
    centro: 'CENTRAL',
    fecha: '',
    urgencia: false,
    prioridad: 'Media',
    relativa: '1',
    descripcion: '',
    telefono_contacto: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const response = await fetch('http://localhost:8000/api/incidencias/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setMensaje('✅ Incidencia creada con éxito.');
      setFormData({
        centro: 'CENTRAL',
        fecha: '',
        urgencia: false,
        prioridad: 'Media',
        relativa: '1',
        descripcion: '',
        telefono_contacto: '',
      });
    } else {
      setMensaje('❌ Error al crear la incidencia.');
    }

    setEnviando(false);
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <div className="container mt-4">
      <h2>Crear nueva incidencia</h2>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Centro:</label>
          <select name="centro" value={formData.centro} onChange={handleChange} className="form-select">
            <option value="CENTRAL">CENTRAL</option>
            <option value="CPM I">CPM I</option>
            <option value="CPM II">CPM II</option>
            {/* Agrega todos los centros necesarios */}
          </select>
        </div>
        <div className="mb-2">
          <label>Fecha:</label>
          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-2">
          <label>Urgente:</label>
          <input type="checkbox" name="urgencia" checked={formData.urgencia} onChange={handleChange} />
        </div>
        <div className="mb-2">
          <label>Prioridad:</label>
          <select name="prioridad" value={formData.prioridad} onChange={handleChange} className="form-select">
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
        <div className="mb-2">
          <label>Relativa a:</label>
          <select name="relativa" value={formData.relativa} onChange={handleChange} className="form-select">
            <option value="1">Teléfono corporativo</option>
            <option value="2">Ordenador</option>
            <option value="3">Internet</option>
            <option value="4">GSuite</option>
            <option value="5">Impresora</option>
            <option value="6">Plataforma</option>
            <option value="7">Dispositivo personal</option>
            <option value="8">Control de accesos</option>
          </select>
        </div>
        <div className="mb-2">
          <label>Descripción:</label>
          <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-2">
          <label>Teléfono de contacto:</label>
          <input type="text" name="telefono_contacto" value={formData.telefono_contacto} onChange={handleChange} className="form-control" required />
        </div>
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

export default CrearIncidencia;
