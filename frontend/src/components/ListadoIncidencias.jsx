import React, { useEffect, useState } from 'react';

function ListadoIncidencias({ usuario }) {
  const [incidencias, setIncidencias] = useState([]);
  const [error, setError] = useState('');

  const getToken = () => {
    const match = document.cookie.match(/(^| )access=([^;]+)/);
    return match ? match[2] : '';
  };

  useEffect(() => {
    const token = getToken();

    fetch('http://localhost:8000/api/incidencias/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Error de autenticación');
        return res.json();
      })
      .then(data => setIncidencias(data))
      .catch(() => setError('No se pudieron cargar las incidencias.'));
  }, []);

  const relativaTexto = (codigo) => {
    const opciones = {
      '1': 'Línea y/o dispositivo telefónico corporativo',
      '2': 'Ordenador',
      '3': 'Internet',
      '4': 'Cuenta Corporativa GSuite',
      '5': 'Impresora',
      '6': 'Plataforma gestion.grupoanide.es',
      '7': 'Dispositivos personales autorizados',
      '8': 'Control de accesos',
      '9': 'Otro',
    };
    return opciones[codigo] || codigo;
  };

  const estadoTexto = (valor) => {
    switch (valor) {
      case 'nueva': return 'Nueva';
      case 'en_curso': return 'En curso';
      case 'cerrada': return 'Cerrada';
      default: return valor;
    }
  };

  const renderGrupo = (titulo, estadoClave) => {
    const grupo = incidencias
      .filter((i) => i.estado === estadoClave)
      .sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));

    return (
      <div className="mt-4">
        <h3 className="text-primary">{titulo}</h3>
        {grupo.length === 0 ? (
          <p className="text-muted">No hay incidencias {titulo.toLowerCase()}.</p>
        ) : (
          grupo.map((inc) => (
            <div className="card my-3" key={inc.id}>
              <div className="card-body">
                <h5 className="card-title">{inc.descripcion}</h5>
                <p className="card-text">
                  <strong>Centro:</strong> {inc.centro}<br />
                  <strong>Fecha:</strong> {new Date(inc.fecha_creacion).toLocaleString()}<br />
                  <strong>Teléfono:</strong> {inc.telefono_contacto}<br />
                  <strong>Urgencia:</strong> {inc.urgencia ? 'Sí' : 'No'}<br />
                  <strong>Prioridad:</strong> {inc.prioridad}<br />
                  <strong>Relativa a:</strong> {relativaTexto(inc.relativa)}<br />
                  <strong>Estado:</strong> {estadoTexto(inc.estado)}<br />
                  {inc.observaciones && (
                    <>
                      <strong>Observaciones:</strong><br />
                      <em>{inc.observaciones}</em>
                    </>
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <h2>Listado de Incidencias</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {usuario.is_superuser ? (
        <>
          {renderGrupo('Nuevas', 'nueva')}
          {renderGrupo('En curso', 'en_curso')}
          {renderGrupo('Cerradas', 'cerrada')}
        </>
      ) : (
        renderGrupo('Tus incidencias', 'nueva')  // o todas si prefieres
      )}
    </div>
  );
}

export default ListadoIncidencias;
