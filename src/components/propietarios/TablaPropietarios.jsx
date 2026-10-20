import { Link, useNavigate } from "react-router-dom";
import { FiEdit2, FiTrash2, FiFileText, FiPhone, FiMail } from "react-icons/fi";
import { DEFAULT_AVATAR } from "../../utils/formatters";

const TablaPropietarios = ({ propietarios, onDelete }) => {
  const navigate = useNavigate();

  const handleDeleteClick = (e, propietario) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(propietario);
  };

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Directorio de propietarios"
      className="table-wrapper"
    >
      <table className="table-fenix tabla-responsive-mobile">
        <thead>
          <tr>
            <th scope="col">Propietario</th>
            <th scope="col">Contacto</th>
            <th scope="col">DNI / CUIT</th>
            <th scope="col">Alias / CBU</th>
            <th scope="col" className="text-end">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {propietarios.map((p) => (
            <tr
              key={p.id}
              onClick={() => navigate(`/propietario/${p.id}`)}
              className="fila-clicable"
            >
              <th scope="row" data-label="Propietario">
                <div className="user-cell">
                  <img
                    src={p.imagen || DEFAULT_AVATAR}
                    alt={`${p.apellido} ${p.nombre}`}
                    className="avatar-chico"
                  />
                  <div className="user-cell-info">
                    <span className="user-cell-name">
                      {p.apellido} {p.nombre}
                    </span>
                    <span className="user-cell-role">Propietario</span>
                  </div>
                </div>
              </th>

              <td data-label="Contacto">
                <div className="contact-cell">
                  {p.telefono && (
                    <span className="contact-item tabular-nums">
                      <FiPhone size={13} /> {p.telefono}
                    </span>
                  )}
                  {p.email && (
                    <span className="contact-item text-muted">
                      <FiMail size={13} /> {p.email}
                    </span>
                  )}
                  {!p.telefono && !p.email && "-"}
                </div>
              </td>

              <td data-label="DNI / CUIT" className="tabular-nums">
                {p.cuit || "-"}
              </td>

              <td data-label="Alias / CBU" className="tabular-nums text-truncate-cell">
                {p.cbu || "-"}
              </td>

              <td data-label="Acciones">
                <div className="actions-cell">
                  <Link
                    to={`/recibos/propietario/${p.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="action-icon-btn action-receipt"
                    title="Generar comprobante"
                  >
                    <FiFileText size={17} />
                  </Link>
                  <Link
                    to={`/editar/${p.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="action-icon-btn action-edit"
                    title="Editar propietario"
                  >
                    <FiEdit2 size={17} />
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(e, p)}
                    className="action-icon-btn action-delete"
                    title="Eliminar propietario"
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

export default TablaPropietarios;
