import { FiSearch, FiX, FiCalendar } from "react-icons/fi";
import { MESES } from "../../utils/formatters";

const FiltroNotas = ({
  mesFiltro,
  setMesFiltro,
  busqueda,
  setBusqueda,
}) => {
  return (
    <div className="toolbar-card toolbar-split mb-4">
      <div className="search-wrapper">
        <FiSearch className="search-icon" size={18} />
        <input
          type="text"
          className="search-input-modern"
          placeholder="Buscar por título o contenido de la nota..."
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

      <div className="d-flex align-items-center gap-2 filtro-mes-wrapper">
        <FiCalendar size={18} className="text-muted flex-shrink-0" />
        <select
          className="form-select-fenix"
          aria-label="Filtrar notas por mes"
          value={mesFiltro}
          onChange={(e) => setMesFiltro(e.target.value)}
        >
          <option value="all">Todos los meses</option>
          {MESES.map((m) => (
            <option key={m.valor} value={String(m.valor)}>
              {m.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltroNotas;