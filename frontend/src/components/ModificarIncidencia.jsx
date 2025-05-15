import React, { useState } from 'react';

function ModificarIncidencia({ incidencia, onActualizada }) {
  const [estado, setEstado] = useState(incidencia.estado);
  const [observaciones, setObservaciones] = useState(incidencia.observaciones || '');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8000/api/incidencias/${incidencia.id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ estado, observaciones }),
    })
      .then(res => res.json())
      .then(data => {
        setMensaje('Incidencia actualizada.');
        onActualizada(); // recargar incidencias
        setTimeout(() => setMensaje(''), 2000);
      })
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 border-top pt-3">
      <div className="mb-2">
        <label>Estado:</label>
        <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="nueva">Nueva</option>
          <option value="en_curso">En curso</option>
          <option value="cerrada">Cerrada</option>
        </select>
      </div>
      <div className="mb-2">
        <label>Observaciones:</label>
        <textarea className="form-control" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
      </div>
      <button className="btn btn-primary">Guardar cambios</button>
      {mensaje && <span className="ms-3 text-success">{mensaje}</span>}
    </form>
  );
}

export default ModificarIncidencia;
