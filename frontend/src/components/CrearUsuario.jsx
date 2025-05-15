import React, { useState } from 'react';

function CrearUsuario() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8000/api/crear_usuario/', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMensaje('✅ Usuario creado correctamente');
          setUsername('');
          setPassword('');
        } else {
          setMensaje('❌ ' + (data.error || 'Error al crear usuario'));
        }

        setTimeout(() => setMensaje(''), 4000);
      });
  };

  return (
    <div className="mt-4">
      <h5>Crear nuevo usuario</h5>
      {mensaje && <div className="alert alert-info">{mensaje}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Nombre de usuario:</label>
          <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="mb-2">
          <label>Contraseña:</label>
          <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Crear</button>
      </form>
    </div>
  );
}

export default CrearUsuario;
