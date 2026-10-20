import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUserPlus, FiUsers, FiCheckCircle, FiClock } from "react-icons/fi";
import { getInquilinosByPropietario } from "../../services/inquilinos.service";
import { formatCurrency, DEFAULT_AVATAR } from "../../utils/formatters";
import Cargando from "../common/Cargando";

const InquilinosPropietario = ({ idPropietario, inquilinosIniciales = null }) => {
  const [inquilinos, setInquilinos] = useState(inquilinosIniciales || []);
  const [cargando, setCargando] = useState(inquilinosIniciales === null);

  useEffect(() => {
    if (inquilinosIniciales !== null) {
      setInquilinos(inquilinosIniciales);
      setCargando(false);
      return;
    }

    let activo = true;
    setCargando(true);
    getInquilinosByPropietario(idPropietario)
      .then((data) => {
        if (activo) setInquilinos(data);
      })
      .catch((err) => console.error("Error obteniendo inquilinos:", err))
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [idPropietario, inquilinosIniciales]);

  if (cargando) return <Cargando inline texto="Cargando inquilinos..." />;

  return (
    <div className="detail-card h-100">
      <div className="detail-card-header">
        <div className="d-flex align-items-center gap-2">
          <FiUsers size={18} className="text-emerald" />
          <h3 className="detail-card-title">
            Inquilinos Asociados ({inquilinos.length})
          </h3>
        </div>
        <Link
          to={`/agregar/inquilino/${idPropietario}`}
          className="btn-fenix btn-fenix-primary btn-sm-fenix"
        >
          <FiUserPlus size={16} />
          <span>Agregar Inquilino</span>
        </Link>
      </div>

      {inquilinos.length === 0 ? (
        <div className="empty-inline">
          <FiUsers size={28} className="text-muted mb-2" />
          <p className="mb-0 text-muted">Sin inquilinos vinculados a este propietario.</p>
        </div>
      ) : (
        <div className="tenant-mini-grid">
          {inquilinos.map((e) => (
            <Link
              to={`/inquilino/${e.id}`}
              key={e.id}
              className="tenant-mini-card"
            >
              <img
                src={e.imagen || DEFAULT_AVATAR}
                alt={`${e.apellido} ${e.nombre}`}
                className="tenant-mini-avatar"
              />
              <div className="tenant-mini-info">
                <span className="tenant-mini-name">
                  {e.apellido} {e.nombre}
                </span>
                <span className="tenant-mini-address">
                  {e.direccion || "Sin dirección"}
                </span>
                <div className="d-flex align-items-center justify-content-between mt-1">
                  <span className="small fw-bold text-emerald tabular-nums">
                    {formatCurrency(e.monto)}
                  </span>
                  {e.alquiler ? (
                    <span className="mini-status paid" title="Al día">
                      <FiCheckCircle size={12} /> Al día
                    </span>
                  ) : (
                    <span className="mini-status pending" title="Pendiente">
                      <FiClock size={12} /> Pendiente
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquilinosPropietario;
