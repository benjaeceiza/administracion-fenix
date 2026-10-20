import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiDownload,
  FiFileText,
  FiMapPin,
  FiTrash2,
  FiUser,
  FiExternalLink,
} from "react-icons/fi";
import { getReciboById, deleteRecibo } from "../../services/recibos.service";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { generarReciboPdf } from "../../utils/pdfGenerator";
import { notifySuccess, notifyError } from "../../utils/notify";
import Cargando from "../common/Cargando";
import ModalConfirmar from "../common/ModalConfirmar";

const ReciboDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recibo, setRecibo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [modalEliminar, setModalEliminar] = useState(false);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    getReciboById(id)
      .then((data) => {
        if (activo) setRecibo(data);
      })
      .catch((err) => console.error("Error obteniendo detalle del recibo:", err))
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [id]);

  const handleConfirmarEliminar = async () => {
    try {
      await deleteRecibo(id);
      notifySuccess("Comprobante eliminado correctamente");
      setModalEliminar(false);
      setTimeout(() => navigate("/recibos/verrecibos"), 600);
    } catch (error) {
      console.error("Error eliminando recibo:", error);
      notifyError("No se pudo eliminar el comprobante");
    }
  };

  if (cargando) return <Cargando />;

  if (!recibo) {
    return (
      <main className="container page-container">
        <div className="empty-state-card">
          <FiFileText size={40} className="empty-state-icon" />
          <h3>Comprobante no encontrado</h3>
          <p>El recibo solicitado no existe o fue eliminado.</p>
          <Link
            to="/recibos/verrecibos"
            className="btn-fenix btn-fenix-primary mt-3"
          >
            Volver a Recibos
          </Link>
        </div>
      </main>
    );
  }

  const esInquilino = recibo.tipo === "inquilinos";
  const rutaPerfil = recibo.idPersona
    ? esInquilino
      ? `/inquilino/${recibo.idPersona}`
      : `/propietario/${recibo.idPersona}`
    : null;

  const extrasIncluidos = [
    recibo.expensas ? "Expensas" : null,
    recibo.impuestos ? "Impuestos" : null,
    recibo.municipalidad ? "Municipalidad" : null,
  ].filter(Boolean);

  return (
    <main className="container page-container">
      {modalEliminar && (
        <ModalConfirmar
          onClose={() => setModalEliminar(false)}
          onConfirm={handleConfirmarEliminar}
          titulo="¿Eliminar este comprobante?"
          mensaje={`Se eliminará de forma permanente el comprobante de ${
            recibo.nombre
          } por ${formatCurrency(recibo.monto)}.`}
        />
      )}

      <div className="form-page-wrapper">
        <div className="detail-top-bar">
          <Link to="/recibos/verrecibos" className="btn-back-link">
            <FiArrowLeft size={18} />
            <span>Volver a Recibos</span>
          </Link>

          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => generarReciboPdf(recibo)}
              className="btn-fenix btn-fenix-primary"
            >
              <FiDownload size={16} />
              <span>Descargar PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setModalEliminar(true)}
              className="btn-fenix btn-fenix-danger-outline"
            >
              <FiTrash2 size={16} />
              <span>Eliminar</span>
            </button>
          </div>
        </div>

        <article className="receipt-detail-card">
          <header
            className={`receipt-detail-header ${
              esInquilino ? "header-inquilino" : "header-propietario"
            }`}
          >
            <div>
              <span className="receipt-badge">
                {esInquilino
                  ? "Recibo de Cobro • Inquilino"
                  : "Comprobante de Entrega • Propietario"}
              </span>
              <h1 className="receipt-detail-title">{recibo.nombre}</h1>
              <div className="d-flex align-items-center gap-2 text-muted small mt-1">
                <FiMapPin size={14} />
                <span>Villa Mercedes, San Luis</span>
              </div>
            </div>

            <div className="receipt-detail-meta">
              <div className="receipt-detail-number tabular-nums">
                {recibo.reciboNumero
                  ? `#${String(recibo.reciboNumero).padStart(4, "0")}`
                  : "S/N"}
              </div>
              <div className="receipt-date tabular-nums mt-1">
                <FiCalendar size={14} />
                <span>{formatDate(recibo.fecha)}</span>
              </div>
            </div>
          </header>

          <div className="receipt-detail-body">
            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <div className="info-item">
                  <span className="info-label">Destinatario</span>
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <span className="info-value d-flex align-items-center gap-2">
                      <FiUser size={15} className="text-muted" />
                      {recibo.nombre}
                    </span>
                    {rutaPerfil && (
                      <Link
                        to={rutaPerfil}
                        className="btn-link-inline"
                        title="Ver ficha completa"
                      >
                        <span>Ver perfil</span>
                        <FiExternalLink size={13} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="info-item">
                  <span className="info-label">Concepto Principal</span>
                  <span className="info-value">{recibo.concepto || "-"}</span>
                </div>
              </div>

              <div className="col-12">
                <div className="info-item">
                  <span className="info-label">
                    Detalle / Descripción Completa
                  </span>
                  <p className="receipt-detail-description m-0">
                    {recibo.descripcion ||
                      recibo.concepto ||
                      "Sin descripción adicional registrada."}
                  </p>
                </div>
              </div>

              {extrasIncluidos.length > 0 && (
                <div className="col-12">
                  <div className="info-item">
                    <span className="info-label">Conceptos Incluidos</span>
                    <div className="d-flex flex-wrap gap-2 mt-1">
                      {extrasIncluidos.map((item) => (
                        <span key={item} className="status-badge status-paid">
                          <FiCheckCircle size={13} />
                          <span>Incluye {item}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="receipt-detail-total-box">
              <div>
                <span className="receipt-detail-total-label">
                  {esInquilino ? "Total Abonado" : "Total Entregado"}
                </span>
                <p className="text-muted small m-0">
                  Importe registrado en el comprobante
                </p>
              </div>
              <span className="receipt-detail-total-amount tabular-nums">
                {formatCurrency(recibo.monto)}
              </span>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
};

export default ReciboDetailPage;
