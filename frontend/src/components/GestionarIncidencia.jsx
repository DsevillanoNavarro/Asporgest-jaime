import React, { useState } from 'react';

function GestionarIncidencia({ incidencia, token, onActualizada }) {
  const [estado, setEstado] = useState(incidencia.estado);
  const [observaciones, setObservaciones] = useState(incidencia.observaciones || '');
  const [mensaje, setMensaje] = useState('');

  const handleGuardar = async () => {
    const res = await fetch(`http://localhost:8000/api/incidencias/${incidencia.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ estado, observaciones })
    });

    if (res.ok) {
      setMensaje('Incidencia actualizada.');
      onActualizada();
    } else {
      setMensaje('Error al actualizar la incidencia.');
    }
  };

  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title">#{incidencia.id} - {incidencia.descripcion}</h5>
        <div className="mb-2">
          <label>Estado:</label>
          <select className="form-select" value={estado} onChange={e => setEstado(e.target.value)}>
            <option value="nueva">Nueva</option>
            <option value="en_curso">En curso</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>
        <div className="mb-2">
          <label>Observaciones:</label>
          <textarea className="form-control" value={observaciones} onChange={e => setObservaciones(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={handleGuardar}>Guardar cambios</button>
        {mensaje && <p className="mt-2 text-info">{mensaje}</p>}
      </div>
    </div>
  );
}

export default GestionarIncidencia;
