import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiUserPlus, FiKey, FiX } from "react-icons/fi";
import {
  subscribeInquilinos,
  deleteInquilino,
} from "../../services/inquilinos.service";
import { notifySuccess, notifyError } from "../../utils/notify";
import Cargando from "../common/Cargando";
import ModalConfirmar from "../common/ModalConfirmar";
import AlertasVencimiento from "./AlertasVencimiento";
import TablaInquilinos from "./TablaInquilinos";

const InquilinosPage = () => {
  const [inquilinos, setInquilinos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [cargando, setCargando] = useState(true);
  const [inquilinoAEliminar, setInquilinoAEliminar] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeInquilinos(
      (data) => {
        setInquilinos(data);
        setCargando(false);
      },
      () => setCargando(false)
    );
    return () => unsubscribe();
  }, []);

  const inquilinosFiltrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return inquilinos.filter((i) => {
      const coincideTexto =
        !termino ||
        i.nombre?.toLowerCase().includes(termino) ||
        i.apellido?.toLowerCase().includes(termino) ||
        i.direccion?.toLowerCase().includes(termino) ||
        String(i.dni || "").toLowerCase().includes(termino);

      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "aldia" && i.alquiler) ||
        (filtroEstado === "pendiente" && !i.alquiler);

      return coincideTexto && coincideEstado;
    });
  }, [busqueda, filtroEstado, inquilinos]);

  const confirmarEliminacion = async () => {
    if (!inquilinoAEliminar) return;
    try {
      await deleteInquilino(inquilinoAEliminar.id);
      notifySuccess("Inquilino eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar inquilino:", error);
      notifyError("No se pudo eliminar el inquilino");
    } finally {
      setInquilinoAEliminar(null);
    }
  };

  if (cargando) return <Cargando />;

  return (
    <>
      {inquilinoAEliminar && (
        <ModalConfirmar
          onClose={() => setInquilinoAEliminar(null)}
          onConfirm={confirmarEliminacion}
          titulo={`¿Eliminar a ${inquilinoAEliminar.apellido} ${inquilinoAEliminar.nombre}?`}
          mensaje="Esta acción eliminará al inquilino del padrón de alquileres de forma permanente."
        />
      )}

      <AlertasVencimiento inquilinos={inquilinos} />

      <main className="container page-container">
        <div className="page-header">
          <div>
            <div className="page-title-group">
              <h1 className="page-title">Inquilinos y Alquileres</h1>
              <span className="badge-count">{inquilinosFiltrados.length}</span>
            </div>
            <p className="page-subtitle">
              Control de contratos vigentes, vencimientos, ajustes periódicos y estado de cobros.
            </p>
          </div>

          <Link to="/agregar/inquilino" className="btn-fenix btn-fenix-primary">
            <FiUserPlus size={18} />
            <span>Nuevo Inquilino</span>
          </Link>
        </div>

        <div className="toolbar-card toolbar-split">
          <div className="search-wrapper">
            <FiSearch className="search-icon" size={18} />
            <input
              type="text"
              className="search-input-modern"
              placeholder="Buscar por nombre, apellido, dirección o DNI..."
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

          <div className="filter-pills" role="group" aria-label="Filtrar por estado de pago">
            <button
              type="button"
              className={`filter-pill ${filtroEstado === "todos" ? "active" : ""}`}
              onClick={() => setFiltroEstado("todos")}
            >
              Todos ({inquilinos.length})
            </button>
            <button
              type="button"
              className={`filter-pill pill-success ${filtroEstado === "aldia" ? "active" : ""}`}
              onClick={() => setFiltroEstado("aldia")}
            >
              Al Día ({inquilinos.filter((i) => i.alquiler).length})
            </button>
            <button
              type="button"
              className={`filter-pill pill-danger ${filtroEstado === "pendiente" ? "active" : ""}`}
              onClick={() => setFiltroEstado("pendiente")}
            >
              Pendientes ({inquilinos.filter((i) => !i.alquiler).length})
            </button>
          </div>
        </div>

        {inquilinosFiltrados.length > 0 ? (
          <TablaInquilinos
            inquilinos={inquilinosFiltrados}
            onDelete={(inq) => setInquilinoAEliminar(inq)}
          />
        ) : (
          <div className="empty-state-card">
            <FiKey size={40} className="empty-state-icon" />
            <h3>No se encontraron inquilinos</h3>
            <p>
              {busqueda || filtroEstado !== "todos"
                ? "Intente ajustar los filtros o el término de búsqueda."
                : "Aún no hay inquilinos registrados."}
            </p>
          </div>
        )}
      </main>
    </>
  );
};

export default InquilinosPage;
