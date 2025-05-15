import CrearUsuario from './CrearUsuario';
import ListadoUsuarios from './ListadoUsuarios';

function Administracion() {
  return (
    <div className="container mt-4">
      <h2 className="text-primary">Panel de Administración</h2>
      <CrearUsuario />
      <ListadoUsuarios />
    </div>
  );
}

export default Administracion;
