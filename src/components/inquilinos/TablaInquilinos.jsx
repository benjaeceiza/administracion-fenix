import { Link, useNavigate } from "react-router-dom";
import {
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiMapPin,
} from "react-icons/fi";
import {
  formatDate,
  formatCurrency,
  DEFAULT_AVATAR,
} from "../../utils/formatters";

const TablaInquilinos = ({ inquilinos, onDelete }) => {
  const navigate = useNavigate();

  const handleClickEliminar = (e, inquilino) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(inquilino);
  };

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Listado de inquilinos y alquileres"
      className="table-wrapper"
    >
      <table className="table-fenix tabla-responsive-mobile">
        <thead>
          <tr>
            <th scope="col">Inquilino</th>
            <th scope="col">Inmueble</th>
            <th scope="col">Vigencia</th>
            <th scope="col">Vencimiento</th>
            <th scope="col">Monto</th>
            <th scope="col">Ajuste</th>
            <th scope="col">Estado</th>
            <th scope="col" className="text-end">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {inquilinos.map((i) => (
            <tr
              key={i.id}
              onClick={() => navigate(`/inquilino/${i.id}`)}
              className="fila-clicable"
            >
              <th scope="row" data-label="Inquilino">
                <div className="user-cell">
                  <img
                    src={i.imagen || DEFAULT_AVATAR}
                    alt={`${i.apellido} ${i.nombre}`}
                    className="avatar-chico"
                  />
                  <div className="user-cell-info">
                    <span className="user-cell-name">
                      {i.apellido} {i.nombre}
                    </span>
                    <span className="user-cell-role tabular-nums">
                      DNI: {i.dni || "-"}
                    </span>
                  </div>
                </div>
              </th>

              <td data-label="Inmueble">
                <span className="d-inline-flex align-items-center gap-1 text-secondary">
                  <FiMapPin size={13} />
                  {i.direccion || "-"}
                </span>
              </td>

              <td data-label="Vigencia" className="tabular-nums text-nowrap">
                {formatDate(i.vigencia)}
              </td>

              <td data-label="Vencimiento" className="tabular-nums text-nowrap">
                {formatDate(i.vencimiento)}
              </td>

              <td data-label="Monto" className="tabular-nums precio-monto text-emerald text-nowrap">
                {formatCurrency(i.monto)}
              </td>

              <td data-label="Ajuste">
                <div className="d-flex flex-column">
                  <span className="fw-medium">{i.aumento || "-"}</span>
                  {i.mesAumento && i.añoAumento && (
                    <small className="text-muted tabular-nums">
                      Próx: {i.mesAumento}/{i.añoAumento}
                    </small>
                  )}
                </div>
              </td>

              <td data-label="Estado">
                {i.alquiler ? (
                  <span className="status-badge status-paid">
                    <FiCheckCircle size={13} /> Al Día
                  </span>
                ) : (
                  <span className="status-badge status-pending">
                    <FiClock size={13} /> Pendiente
                  </span>
                )}
              </td>

              <td data-label="Acciones">
                <div className="actions-cell">
                  <Link
                    to={`/recibos/inquilino/${i.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="action-icon-btn action-receipt"
                    title="Generar recibo"
                  >
                    <FiFileText size={17} />
                  </Link>
                  <Link
                    to={`/editar/inquilino/${i.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="action-icon-btn action-edit"
                    title="Editar inquilino"
                  >
                    <FiEdit2 size={17} />
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => handleClickEliminar(e, i)}
                    className="action-icon-btn action-delete"
                    title="Eliminar inquilino"
                  >
                    <FiTrash2 size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaInquilinos;
