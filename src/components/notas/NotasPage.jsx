import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiClipboard, FiPlus, FiChevronDown } from "react-icons/fi";
import { getNotas } from "../../services/notas.service";
import { toDateObject } from "../../utils/formatters";
import Cargando from "../common/Cargando";
import FiltroNotas from "./FiltroNotas";
import ListaNotas from "./ListaNotas";

const NotasPage = () => {
  const [todasLasNotas, setTodasLasNotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [limite, setLimite] = useState(8);
  const [mesFiltro, setMesFiltro] = useState("all");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    let activo = true;
    setCargando(true);
    getNotas()
      .then((data) => {
        if (activo) setTodasLasNotas(data);
      })
      .catch((err) => console.error("Error cargando notas:", err))
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  const notasFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    return todasLasNotas.filter((n) => {
      if (mesFiltro !== "all") {
        const fechaObj = toDateObject(n.fecha);
        if (!fechaObj || fechaObj.getMonth() !== Number(mesFiltro)) {
          return false;
        }
      }
      if (termino) {
        const coincideTitulo = n.nombre?.toLowerCase().includes(termino);
        const coincideCuerpo = n.nota?.toLowerCase().includes(termino);
        if (!coincideTitulo && !coincideCuerpo) return false;
      }
      return true;
    });
  }, [todasLasNotas, mesFiltro, busqueda]);

  const handleDeleted = (idEliminado) => {
    setTodasLasNotas((prev) => prev.filter((n) => n.id !== idEliminado));
  };

  if (cargando) return <Cargando />;

  return (
    <main className="container page-container">
      <div className="page-header">
        <div>
          <div className="page-title-group">
            <h1 className="page-title">Notas y Recordatorios</h1>
            <span className="badge-count">{notasFiltradas.length}</span>
          </div>
          <p className="page-subtitle">
            Gestione anotaciones internas, recordatorios administrativos y novedades.
          </p>
        </div>

        <Link to="/notas/agregarNota" className="btn-fenix btn-fenix-primary">
          <FiPlus size={18} />
          <span>Nueva Nota</span>
        </Link>
      </div>

      <FiltroNotas
        mesFiltro={mesFiltro}
        setMesFiltro={(val) => {
          setMesFiltro(val);
          setLimite(8);
        }}
        busqueda={busqueda}
        setBusqueda={(val) => {
          setBusqueda(val);
          setLimite(8);
        }}
      />

      {notasFiltradas.length === 0 ? (
        <div className="empty-state-card">
          <FiClipboard size={40} className="empty-state-icon" />
          <h3>No se encontraron notas</h3>
          <p>
            {mesFiltro !== "all" || busqueda
              ? "No hay notas que coincidan con el filtro aplicado."
              : "Aún no se han registrado notas en el sistema."}
          </p>
        </div>
      ) : (
        <>
          <ListaNotas
            notas={notasFiltradas}
            onDeleted={handleDeleted}
            limite={limite}
          />
          {limite < notasFiltradas.length && (
            <div className="text-center mt-4">
              <button
                type="button"
                className="btn-fenix btn-fenix-outline"
                onClick={() => setLimite((prev) => prev + 4)}
              >
                <FiChevronDown size={18} />
                <span>Ver más ({notasFiltradas.length - limite} restantes)</span>
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default NotasPage;
