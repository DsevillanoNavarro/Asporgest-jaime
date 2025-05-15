import React from 'react';

function Navbar({ onLogout, esAdmin, setVista }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
      <span className="navbar-brand fw-bold">ASPROGEST</span>

      <div className="ms-auto d-flex align-items-center gap-3">
        <button onClick={() => setVista('crear')} className="btn btn-outline-light btn-sm">Crear incidencia</button>
        <button onClick={() => setVista('mis')} className="btn btn-outline-light btn-sm">Mis incidencias</button>
        {esAdmin && (
          <button onClick={() => setVista('admin')} className="btn btn-outline-light btn-sm">Administración</button>
        )}
        <button onClick={onLogout} className="btn btn-light btn-sm">Cerrar sesión</button>
      </div>
    </nav>
  );
}

export default Navbar;
