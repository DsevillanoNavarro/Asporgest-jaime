import React, { useEffect, useState } from 'react';
import ModificarIncidencia from './ModificarIncidencia';

function ListadoIncidencias() {
  const [incidencias, setIncidencias] = useState([]);
  const [error, setError] = useState('');

  const cargarIncidencias = () => {
    fetch('http://localhost:8000/api/incidencias/', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('No autorizado');
        return res.json();
      })
      .then(data => setIncidencias(data))
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    cargarIncidencias();
  }, []);

  const separarPorEstado = (estado) =>
    incidencias
      .filter((inc) => inc.estado === estado)
      .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

  const renderGrupo = (titulo, estadoClave) => {
    const grupo = separarPorEstado(estadoClave);
    return (
      <div className="mt-4">
        <h3 className="text-primary">{titulo}</h3>
        {grupo.length === 0 ? (
          <p className="text-muted">No hay incidencias {titulo.toLowerCase()}.</p>
        ) : (
          grupo.map((inc) => (
            <div className="card my-2" key={inc.id}>
              <div className="card-body">
                <strong>{inc.descripcion}</strong> — Prioridad: {inc.prioridad}
                <br />
                Centro: {inc.centro} — Teléfono: {inc.telefono_contacto}
                <br />
                Estado: <strong>{inc.estado}</strong>
                <br />
                Observaciones: {inc.observaciones || '—'}
                <br />
                Fecha: {new Date(inc.fecha_creacion).toLocaleString()}

                {/* Aquí se inserta el formulario de modificación */}
                <ModificarIncidencia
                  incidencia={inc}
                  onActualizada={cargarIncidencias}
                />
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="container mt-4">
      <h2>Gestionar Incidencias</h2>
      {error && <p className="text-danger">Error: {error}</p>}

      {renderGrupo('Nuevas', 'nueva')}
      {renderGrupo('En curso', 'en_curso')}
      {renderGrupo('Cerradas', 'cerrada')}
    </div>
  );
}

export default ListadoIncidencias;
