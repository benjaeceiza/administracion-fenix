import { FiRefreshCw } from "react-icons/fi";
import { MESES } from "../../utils/formatters";

const FiltroRecibos = ({
  filtros,
  onChangeFiltro,
  onLimpiarFiltros,
  nombresDisponibles = [],
}) => {
  const hayFiltrosActivos =
    filtros.tipo !== "" || filtros.nombre !== "" || filtros.mes !== "";

  return (
    <div className="toolbar-card mb-4">
      <div className="row g-3 align-items-end">
        <div className="col-sm-6 col-md-4">
          <label className="form-label-fenix" htmlFor="filtro-recibo-tipo">
            Filtrar por Tipo
          </label>
          <select
            id="filtro-recibo-tipo"
            className="form-select-fenix"
            value={filtros.tipo}
            onChange={(e) => onChangeFiltro("tipo", e.target.value)}
          >
            <option value="">Todos los tipos</option>
            <option value="inquilinos">Inquilinos (Cobros)</option>
            <option value="propietarios">Propietarios (Entregas)</option>
          </select>
        </div>

        <div className="col-sm-6 col-md-4">
          <label className="form-label-fenix" htmlFor="filtro-recibo-nombre">
            Filtrar por Persona
          </label>
          <select
            id="filtro-recibo-nombre"
            className="form-select-fenix"
            value={filtros.nombre}
            onChange={(e) => onChangeFiltro("nombre", e.target.value)}
          >
            <option value="">Todas las personas</option>
            {nombresDisponibles.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-sm-6 col-md-3">
          <label className="form-label-fenix" htmlFor="filtro-recibo-mes">
            Filtrar por Mes
          </label>
          <select
            id="filtro-recibo-mes"
            className="form-select-fenix"
            value={filtros.mes}
            onChange={(e) => onChangeFiltro("mes", e.target.value)}
          >
            <option value="">Todos los meses</option>
            {MESES.map((m) => (
              <option key={m.valor} value={String(m.valor)}>
                {m.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-sm-6 col-md-1 d-flex justify-content-end">
          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={onLimpiarFiltros}
              className="btn-fenix btn-fenix-outline w-100 justify-content-center"
              title="Restablecer filtros"
            >
              <FiRefreshCw size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FiltroRecibos;