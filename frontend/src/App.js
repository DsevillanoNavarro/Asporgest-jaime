import React, { useState } from 'react';
import Login from './components/Login';
import CrearIncidencia from './components/CrearIncidencia';
import ListadoIncidencias from './components/ListadoIncidencias';
import Navbar from './components/Navbar';
import Administracion from './components/Administracion';


function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [esAdmin, setEsAdmin] = useState(false);
  const [vista, setVista] = useState('crear');
  const [mensajeLogout, setMensajeLogout] = useState('');

  const handleLogout = () => {
    setAutenticado(false);
    setMensajeLogout('Sesión cerrada correctamente.');
    setTimeout(() => setMensajeLogout(''), 3000);
  };

  const handleLoginSuccess = () => {
  fetch('http://localhost:8000/api/whoami/', {
    credentials: 'include',
  })
    .then(res => res.json())
    .then(data => {
      setEsAdmin(data.is_superuser);
      setAutenticado(true);
    });
};

  return (
    <div className="container mt-4">
      {mensajeLogout && (
        <div className="alert alert-info text-center">{mensajeLogout}</div>
      )}

      {autenticado ? (
        <>
          <Navbar onLogout={handleLogout} esAdmin={esAdmin} setVista={setVista} />
          {vista === 'crear' && <CrearIncidencia />}
          {vista === 'mis' && <ListadoIncidencias />}
          {vista === 'admin' && esAdmin && <Administracion />}
        </>
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
