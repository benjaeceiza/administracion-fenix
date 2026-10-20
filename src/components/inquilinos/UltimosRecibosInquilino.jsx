import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiDownload, FiPlus, FiEye } from "react-icons/fi";
import { getRecibosAlquilerByNombre } from "../../services/recibos.service";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { generarReciboPdf } from "../../utils/pdfGenerator";

const UltimosRecibosInquilino = ({ idInquilino, nombre, apellido }) => {
  const [recibos, setRecibos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    const nombreCompleto = `${apellido || ""} ${nombre || ""}`.trim();
    if (!nombreCompleto) {
      setCargando(false);
      return;
    }

    setCargando(true);
    getRecibosAlquilerByNombre(nombreCompleto, 3)
      .then((data) => {
        if (activo) setRecibos(data);
      })
      .catch((err) => console.error("Error obteniendo recibos de inquilino:", err))
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [nombre, apellido]);

  return (
    <div className="detail-card h-100">
      <div className="detail-card-header">
        <div className="d-flex align-items-center gap-2">
          <FiFileText size={18} className="text-emerald" />
          <h3 className="detail-card-title">Últimos Recibos de Alquiler</h3>
        </div>
        {idInquilino && (
          <Link
            to={`/recibos/inquilino/${idInquilino}`}
            className="btn-fenix btn-fenix-primary btn-sm-fenix"
          >
            <FiPlus size={15} />
            <span>Nuevo Recibo</span>
          </Link>
        )}
      </div>

      {cargando ? (
        <p className="text-muted small my-3">Consultando últimos recibos...</p>
      ) : recibos.length === 0 ? (
        <div className="empty-inline">
          <FiFileText size={28} className="text-muted mb-2" />
          <p className="mb-0 text-muted">No se registran recibos de alquiler aún.</p>
        </div>
      ) : (
        <div className="recent-receipts-list">
          {recibos.map((r) => (
            <div key={r.id} className="recent-receipt-item">
              <div>
                <Link
                  to={`/recibos/detalle/${r.id}`}
                  className="recent-receipt-concept text-decoration-none"
                >
                  {r.concepto} {r.reciboNumero ? `#${r.reciboNumero}` : ""}
                </Link>
                <span className="recent-receipt-date tabular-nums">
                  {formatDate(r.fecha)}
                </span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="recent-receipt-amount tabular-nums me-1">
                  {formatCurrency(r.monto)}
                </span>
                <Link
                  to={`/recibos/detalle/${r.id}`}
                  className="action-icon-btn"
                  title="Ver detalle del recibo"
                >
                  <FiEye size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => generarReciboPdf(r)}
                  className="action-icon-btn action-receipt"
                  title="Descargar comprobante PDF"
                >
                  <FiDownload size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UltimosRecibosInquilino;
