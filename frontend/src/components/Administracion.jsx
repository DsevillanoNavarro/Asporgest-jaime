import React, { useEffect, useState } from 'react';

function Administracion({ token }) {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({ username: '', email: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const cargarUsuarios = () => {
    fetch('http://localhost:8000/api/usuarios/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => setError('Error al cargar usuarios'));
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleInputChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const res = await fetch('http://localhost:8000/api/crear_usuario/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(nuevo)
      });

      if (res.ok) {
        setMensaje('Usuario creado correctamente.');
        setNuevo({ username: '', email: '', password: '' });
        cargarUsuarios();
      } else {
        const data = await res.json();
        setError(data.error || 'Error al crear usuario');
      }
    } catch {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Administración</h2>

      <div className="card mt-4">
        <div className="card-body">
          <h5 className="card-title">Crear nuevo usuario</h5>

          {mensaje && <div className="alert alert-success">{mensaje}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleCrear}>
            <div className="row">
              <div className="col-md-4 mb-2">
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={nuevo.username}
                  onChange={handleInputChange}
                  placeholder="Nombre de usuario"
                  required
                />
              </div>
              <div className="col-md-4 mb-2">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={nuevo.email}
                  onChange={handleInputChange}
                  placeholder="Correo electrónico"
                  required
                />
              </div>
              <div className="col-md-4 mb-2">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={nuevo.password}
                  onChange={handleInputChange}
                  placeholder="Contraseña"
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success mt-2">Crear usuario</button>
          </form>
        </div>
      </div>

      <div className="mt-5">
        <h4>Usuarios registrados</h4>
        <table className="table table-bordered table-striped mt-3">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Admin</th>
              <th>Activo</th>
              <th>Registrado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.email || '-'}</td>
                <td>{u.is_superuser ? 'Sí' : 'No'}</td>
                <td>{u.is_active ? 'Sí' : 'No'}</td>
                <td>{new Date(u.date_joined).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Administracion;
