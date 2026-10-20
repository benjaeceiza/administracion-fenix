import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiPlus, FiChevronDown } from "react-icons/fi";
import { getRecibos } from "../../services/recibos.service";
import { toDateObject } from "../../utils/formatters";
import Cargando from "../common/Cargando";
import ListaRecibos from "./ListaRecibos";
import FiltroRecibos from "./FiltroRecibos";

const RecibosPage = () => {
  const [todosLosRecibos, setTodosLosRecibos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [limite, setLimite] = useState(15);

  const [filtros, setFiltros] = useState({
    tipo: "",
    nombre: "",
    mes: "",
  });

  useEffect(() => {
    let activo = true;
    setCargando(true);
    getRecibos()
      .then((data) => {
        if (activo) setTodosLosRecibos(data);
      })
      .catch((err) => console.error("Error obteniendo recibos:", err))
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const nombresDisponibles = useMemo(() => {
    const base = filtros.tipo
      ? todosLosRecibos.filter((r) => r.tipo === filtros.tipo)
      : todosLosRecibos;
    const setNombres = new Set(base.map((r) => r.nombre).filter(Boolean));
    return Array.from(setNombres).sort((a, b) => a.localeCompare(b, "es"));
  }, [todosLosRecibos, filtros.tipo]);

  const recibosFiltrados = useMemo(() => {
    return todosLosRecibos.filter((r) => {
      if (filtros.tipo && r.tipo !== filtros.tipo) return false;
      if (filtros.nombre && r.nombre !== filtros.nombre) return false;
      if (filtros.mes !== "") {
        const fechaObj = toDateObject(r.fecha);
        if (!fechaObj || fechaObj.getMonth() !== Number(filtros.mes)) {
          return false;
        }
      }
      return true;
    });
  }, [todosLosRecibos, filtros]);

  const handleChangeFiltro = (campo, valor) => {
    setLimite(15);
    setFiltros((prev) => {
      const nuevo = { ...prev, [campo]: valor };
      if (campo === "tipo") {
        nuevo.nombre = "";
      }
      return nuevo;
    });
  };

  const handleLimpiarFiltros = () => {
    setLimite(15);
    setFiltros({ tipo: "", nombre: "", mes: "" });
  };

  const handleDeleted = (idEliminado) => {
    setTodosLosRecibos((prev) => prev.filter((r) => r.id !== idEliminado));
  };

  if (cargando) return <Cargando />;

  return (
    <main className="container page-container">
      <div className="page-header">
        <div>
          <div className="page-title-group">
            <h1 className="page-title">Comprobantes y Recibos</h1>
            <span className="badge-count">{recibosFiltrados.length}</span>
          </div>
          <p className="page-subtitle">
            Consulte el listado general, ingrese a cada comprobante para ver su detalle o descárguelo en PDF.
          </p>
        </div>

        <Link to="/recibos" className="btn-fenix btn-fenix-primary">
          <FiPlus size={18} />
          <span>Emitir Recibo</span>
        </Link>
      </div>

      <FiltroRecibos
        filtros={filtros}
        onChangeFiltro={handleChangeFiltro}
        onLimpiarFiltros={handleLimpiarFiltros}
        nombresDisponibles={nombresDisponibles}
      />

      {recibosFiltrados.length === 0 ? (
        <div className="empty-state-card">
          <FiFileText size={40} className="empty-state-icon" />
          <h3>No se encontraron comprobantes</h3>
          <p>No hay recibos que coincidan con los filtros seleccionados.</p>
        </div>
      ) : (
        <>
          <ListaRecibos
            recibos={recibosFiltrados}
            onDeleted={handleDeleted}
            limite={limite}
          />
          {limite < recibosFiltrados.length && (
            <div className="text-center mt-4">
              <button
                type="button"
                className="btn-fenix btn-fenix-outline"
                onClick={() => setLimite((prev) => prev + 10)}
              >
                <FiChevronDown size={18} />
                <span>
                  Ver más ({recibosFiltrados.length - limite} restantes)
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default RecibosPage;
