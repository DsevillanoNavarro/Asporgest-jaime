import React, { useState } from 'react';
import Login from './components/Login';
import CrearIncidencia from './components/CrearIncidencia';
import ListadoIncidencias from './components/ListadoIncidencias';
import Administracion from './components/Administracion';
import Navbar from './components/Navbar';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [vista, setVista] = useState('crear');

  const handleLogout = () => {
    document.cookie = 'access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUsuario(null);
  };

  const handleLoginSuccess = (userInfo) => {
    setUsuario(userInfo);
    setVista('crear');
  };

  return (
    <div className="container mt-4">
      {!usuario ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <Navbar
            usuario={usuario}
            setVista={setVista}
            onLogout={handleLogout}
          />

          {vista === 'crear' && <CrearIncidencia />}
          {vista === 'mis' && <ListadoIncidencias />}
          {vista === 'admin' && usuario.is_superuser && <Administracion />}
        </>
      )}
    </div>
  );
}

export default App;
