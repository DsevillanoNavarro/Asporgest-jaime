import React from 'react';

function Navbar({ onLogout, esAdmin, setVista }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container-fluid">
        <span className="navbar-brand" style={{ cursor: 'pointer' }} onClick={() => setVista('crear')}>
          ASPROGEST
        </span>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">

            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={() => setVista('crear')}>
                Crear incidencia
              </button>
            </li>

            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={() => setVista('mis')}>
                Mis incidencias
              </button>
            </li>

            {esAdmin && (
              <li className="nav-item">
                <button className="btn btn-link nav-link" onClick={() => setVista('admin')}>
                  Administración
                </button>
              </li>
            )}
          </ul>

          <button className="btn btn-outline-light" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
