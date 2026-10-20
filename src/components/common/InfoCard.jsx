import { Link } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";

/**
 * Componente reutilizable para mostrar grillas de atributos clave-valor
 * (usado tanto en PropietarioDetailPage como en InquilinoDetailPage).
 */
const InfoCard = ({ titulo, editUrl, items = [], columns = 2 }) => {
  return (
    <div className="detail-card">
      <div className="detail-card-header">
        <h3 className="detail-card-title">{titulo}</h3>
        {editUrl && (
          <Link
            to={editUrl}
            className="btn-fenix btn-fenix-outline btn-sm-fenix"
          >
            <FiEdit2 size={15} />
            <span>Editar</span>
          </Link>
        )}
      </div>

      <div className={`info-grid ${columns === 3 ? "info-grid-3" : ""}`}>
        {items.map(({ label, value, icon: Icon, highlight }) => (
          <div
            key={label}
            className={`info-field ${highlight ? "info-field-highlight" : ""}`}
          >
            <span className="info-label">
              {Icon && <Icon size={14} />} {label}
            </span>
            <p className="info-value tabular-nums">{value || "-"}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;
