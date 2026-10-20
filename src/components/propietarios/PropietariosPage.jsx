import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUserPlus, FiUsers, FiX } from "react-icons/fi";
import {
  subscribePropietarios,
  deletePropietario,
} from "../../services/propietarios.service";
import { notifySuccess, notifyError } from "../../utils/notify";
import Cargando from "../common/Cargando";
import ModalConfirmar from "../common/ModalConfirmar";
import TablaPropietarios from "./TablaPropietarios";

const PropietariosPage = () => {
  const [propietarios, setPropietarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [propietarioAEliminar, setPropietarioAEliminar] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribePropietarios(
      (data) => {
        setPropietarios(data);
        setCargando(false);
      },
      () => setCargando(false)
    );
    return () => unsubscribe();
  }, []);

  const propietariosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return propietarios;
    return propietarios.filter(
      (p) =>
        p.nombre?.toLowerCase().includes(termino) ||
        p.apellido?.toLowerCase().includes(termino) ||
        String(p.cuit || "").toLowerCase().includes(termino) ||
        p.email?.toLowerCase().includes(termino)
    );
  }, [busqueda, propietarios]);

  const confirmarEliminacion = async () => {
    if (!propietarioAEliminar) return;
    try {
      await deletePropietario(propietarioAEliminar.id);
      notifySuccess("Propietario y registros asociados eliminados");
    } catch (error) {
      console.error("Error eliminando propietario:", error);
      notifyError("No se pudo eliminar el propietario");
    } finally {
      setPropietarioAEliminar(null);
    }
  };

  if (cargando) return <Cargando />;

  return (
    <main className="container page-container">
      {propietarioAEliminar && (
        <ModalConfirmar
          onClose={() => setPropietarioAEliminar(null)}
          onConfirm={confirmarEliminacion}
          titulo={`¿Eliminar a ${propietarioAEliminar.apellido} ${propietarioAEliminar.nombre}?`}
          mensaje="Esta acción no se podrá deshacer y eliminará también sus propiedades e inquilinos asociados."
        />
      )}

      <div className="page-header">
        <div>
          <div className="page-title-group">
            <h1 className="page-title">Propietarios</h1>
            <span className="badge-count">{propietariosFiltrados.length}</span>
          </div>
          <p className="page-subtitle">
            Gestione los titulares de inmuebles, sus propiedades, inquilinos y comprobantes.
          </p>
        </div>

        <Link to="/agregar/propietario" className="btn-fenix btn-fenix-primary">
          <FiUserPlus size={18} />
          <span>Nuevo Propietario</span>
        </Link>
      </div>

      <div className="toolbar-card">
        <div className="search-wrapper">
          <FiSearch className="search-icon" size={18} />
          <input
            type="text"
            className="search-input-modern"
            placeholder="Buscar por nombre, apellido, CUIT/DNI o correo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setBusqueda("")}
              aria-label="Limpiar búsqueda"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      </div>

      {propietariosFiltrados.length > 0 ? (
        <TablaPropietarios
          propietarios={propietariosFiltrados}
          onDelete={(prop) => setPropietarioAEliminar(prop)}
        />
      ) : (
        <div className="empty-state-card">
          <FiUsers size={40} className="empty-state-icon" />
          <h3>No se encontraron propietarios</h3>
          <p>
            {busqueda
              ? `No hay coincidencias para "${busqueda}".`
              : "Aún no se han registrado propietarios en el sistema."}
          </p>
        </div>
      )}
    </main>
  );
};

export default PropietariosPage;
