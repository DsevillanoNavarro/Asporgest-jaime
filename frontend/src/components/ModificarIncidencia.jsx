import React, { useEffect, useState } from 'react';

function ModificarIncidencia({ incidenciaId, token, onActualizada }) {
  const [incidencia, setIncidencia] = useState(null);
  const [estado, setEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (incidenciaId) {
      fetch(`http://localhost:8000/api/incidencias/${incidenciaId}/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setIncidencia(data);
          setEstado(data.estado);
          setObservaciones(data.observaciones || '');
        })
        .catch(() => setError('Error al cargar la incidencia'));
    }
  }, [incidenciaId, token]);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    const response = await fetch(`http://localhost:8000/api/incidencias/${incidenciaId}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ estado, observaciones })
    });

    if (response.ok) {
      setMensaje('Incidencia actualizada correctamente.');
      if (onActualizada) onActualizada();
    } else {
      setError('Error al guardar los cambios');
    }
  };

  if (!incidencia) return <p className="text-muted">Cargando incidencia...</p>;

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h5 className="card-title">Modificar Incidencia</h5>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleGuardar}>
          <div className="mb-3">
            <label className="form-label">Estado</label>
            <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)} required>
              <option value="nueva">Nueva</option>
              <option value="en_curso">En curso</option>
              <option value="cerrada">Cerrada</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Observaciones</label>
            <textarea
              className="form-control"
              rows="4"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
}

export default ModificarIncidencia;
