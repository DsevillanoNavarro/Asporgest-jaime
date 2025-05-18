import React, { useEffect, useState } from 'react';

function Home({ usuario, setVista }) {
  const [nuevas, setNuevas] = useState(null);

    useEffect(() => {
    if (usuario.is_superuser) {
        const token = localStorage.getItem('access');
        fetch('http://localhost:8000/api/incidencias/nuevas/', {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then(res => res.json())
        .then(data => setNuevas(data.nuevas))
        .catch(() => setNuevas(0));
    }
    }, [usuario]);


  return (
    <div className="text-center mt-5">
      <h2 className="mb-4 text-primary">Bienvenido a ASPROGEST</h2>
      <p className="lead">Hola, <strong>{usuario.username}</strong>.</p>

      {usuario.is_superuser ? (
        <>
          <p className="mt-3">
            {nuevas === 0
              ? 'No hay incidencias nuevas.'
              : `Tienes ${nuevas} incidencia${nuevas > 1 ? 's' : ''} nueva${nuevas > 1 ? 's' : ''}.`}
          </p>
          <button className="btn btn-primary mt-2" onClick={() => setVista('admin')}>
            Revisar incidencias
          </button>
        </>
      ) : (
        <>
          <p className="mt-3">Puedes revisar tus propias incidencias.</p>
          <button className="btn btn-primary mt-2" onClick={() => setVista('mis')}>
            Ver mis incidencias
          </button>
        </>
      )}
    </div>
  );
}

export default Home;
