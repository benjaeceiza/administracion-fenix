import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiHash,
  FiMail,
  FiMapPin,
  FiPhone,
  FiRefreshCw,
  FiTrash2,
  FiTrendingUp,
  FiUser,
} from "react-icons/fi";
import {
  getInquilinoById,
  updateInquilino,
  deleteInquilino,
} from "../../services/inquilinos.service";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { notifySuccess, notifyError } from "../../utils/notify";
import Cargando from "../common/Cargando";
import ModalConfirmar from "../common/ModalConfirmar";
import ModalAvatar from "../common/ModalAvatar";
import ProfileHeroCard from "../common/ProfileHeroCard";
import InfoCard from "../common/InfoCard";
import BannerVencimientoContrato from "./BannerVencimientoContrato";
import UltimosRecibosInquilino from "./UltimosRecibosInquilino";

const InquilinoDetailPage = () => {
  const { idInquilino } = useParams();
  const navigate = useNavigate();

  const [inquilino, setInquilino] = useState(null);
  const [cargador, setCargador] = useState(true);
  const [cambiarAvatar, setCambiarAvatar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [actualizandoEstado, setActualizandoEstado] = useState(false);

  useEffect(() => {
    let activo = true;
    setCargador(true);

    getInquilinoById(idInquilino)
      .then((data) => {
        if (activo) setInquilino(data);
      })
      .catch((error) => console.error("Error obteniendo inquilino:", error))
      .finally(() => {
        if (activo) setCargador(false);
      });

    return () => {
      activo = false;
    };
  }, [idInquilino]);

  const confirmarBorrado = async () => {
    if (!inquilino) return;
    try {
      await deleteInquilino(idInquilino);
      notifySuccess("Inquilino eliminado con éxito");
      setModalEliminar(false);
      setTimeout(() => {
        navigate(inquilino.idprop ? `/propietario/${inquilino.idprop}` : "/alquileres");
      }, 1200);
    } catch (error) {
      console.error("Error al eliminar inquilino:", error);
      notifyError("Error al eliminar el inquilino");
    }
  };

  const alternarEstadoAlquiler = async () => {
    if (!inquilino || actualizandoEstado) return;
    setActualizandoEstado(true);
    const nuevoEstado = !inquilino.alquiler;
    try {
      await updateInquilino(inquilino.id, { alquiler: nuevoEstado });
      setInquilino((prev) => ({ ...prev, alquiler: nuevoEstado }));
      notifySuccess(
        nuevoEstado
          ? "Estado actualizado a: Al Día"
          : "Estado actualizado a: Pago Pendiente"
      );
    } catch (error) {
      console.error("Error actualizando estado:", error);
      notifyError("No se pudo actualizar el estado de pago");
    } finally {
      setActualizandoEstado(false);
    }
  };

  if (cargador) return <Cargando />;

  if (!inquilino) {
    return (
      <main className="container page-container text-center">
        <div className="empty-state-card">
          <h3>Inquilino no encontrado</h3>
          <p>El registro solicitado no existe o fue eliminado.</p>
          <Link to="/alquileres" className="btn-fenix btn-fenix-primary mt-3">
            <FiArrowLeft size={16} /> Volver a Alquileres
          </Link>
        </div>
      </main>
    );
  }

  const camposInquilino = [
    { label: "Teléfono", value: inquilino.telefono, icon: FiPhone },
    { label: "Correo Electrónico", value: inquilino.email, icon: FiMail },
    { label: "DNI / CUIT", value: inquilino.dni, icon: FiHash },
    { label: "Dirección del Inmueble", value: inquilino.direccion, icon: FiMapPin },
    { label: "Inicio de Vigencia", value: formatDate(inquilino.vigencia), icon: FiCalendar },
    { label: "Vencimiento", value: formatDate(inquilino.vencimiento), icon: FiCalendar },
    { label: "Frecuencia de Ajuste", value: inquilino.aumento, icon: FiTrendingUp },
    {
      label: "Próximo Ajuste",
      value:
        inquilino.mesAumento && inquilino.añoAumento
          ? `${inquilino.mesAumento}/${inquilino.añoAumento}`
          : "-",
      icon: FiTrendingUp,
    },
    {
      label: "Monto de Alquiler Actual",
      value: formatCurrency(inquilino.monto),
      icon: FiDollarSign,
      highlight: true,
    },
  ];

  return (
    <>
      <BannerVencimientoContrato inquilino={inquilino} />

      <main className="container page-container">
        {modalEliminar && (
          <ModalConfirmar
            onClose={() => setModalEliminar(false)}
            onConfirm={confirmarBorrado}
            titulo={`¿Eliminar a ${inquilino.apellido} ${inquilino.nombre}?`}
            mensaje="Esta acción eliminará al inquilino de forma permanente."
          />
        )}

        <ModalAvatar
          tipo="inquilinos"
          abierto={cambiarAvatar}
          onClose={() => setCambiarAvatar(false)}
          persona={inquilino}
          onAvatarUpdated={(nuevaImagen) =>
            setInquilino((prev) => ({ ...prev, imagen: nuevaImagen }))
          }
        />

        <div className="detail-top-bar">
          <Link to="/alquileres" className="btn-back-link">
            <FiArrowLeft size={18} />
            <span>Volver a Alquileres</span>
          </Link>

          <div className="d-flex flex-wrap gap-2">
            {inquilino.idprop && (
              <Link
                to={`/propietario/${inquilino.idprop}`}
                className="btn-fenix btn-fenix-outline btn-sm-fenix"
              >
                <FiUser size={15} />
                <span>Ver Propietario</span>
              </Link>
            )}
            <Link
              to={`/recibos/inquilino/${inquilino.id}`}
              className="btn-fenix btn-fenix-secondary btn-sm-fenix"
            >
              <FiFileText size={15} />
              <span>Emitir Recibo</span>
            </Link>
            <button
              type="button"
              onClick={() => setModalEliminar(true)}
              className="btn-fenix btn-fenix-danger-outline btn-sm-fenix"
            >
              <FiTrash2 size={15} />
              <span>Eliminar</span>
            </button>
          </div>
        </div>

        <div className="row g-4 mb-4 align-items-stretch">
          <div className="col-lg-4">
            <ProfileHeroCard
              imagen={inquilino.imagen}
              nombreCompleto={`${inquilino.apellido} ${inquilino.nombre}`}
              rolTexto="Inquilino / Locatario"
              rolVariante="inquilino"
              subtitulo={inquilino.direccion || "Sin dirección"}
              onEditAvatar={() => setCambiarAvatar(true)}
            />
          </div>

          <div className="col-lg-8">
            <InfoCard
              titulo="Datos del Contrato e Inquilino"
              editUrl={`/editar/inquilino/${inquilino.id}`}
              items={camposInquilino}
              columns={3}
            />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-5">
            <div className="detail-card h-100 d-flex flex-column justify-content-between">
              <div className="detail-card-header">
                <h3 className="detail-card-title">Estado de Alquiler del Mes</h3>
              </div>

              <div
                className={`payment-status-banner ${
                  inquilino.alquiler ? "is-paid" : "is-pending"
                }`}
              >
                <div className="payment-status-icon">
                  {inquilino.alquiler ? (
                    <FiCheckCircle size={32} />
                  ) : (
                    <FiClock size={32} />
                  )}
                </div>
                <div>
                  <h4 className="payment-status-title">
                    {inquilino.alquiler ? "Alquiler al Día" : "Pago Pendiente"}
                  </h4>
                  <p className="payment-status-desc">
                    {inquilino.alquiler
                      ? "El inquilino registra el pago del período actual al día."
                      : "Aún no se ha registrado el cobro de alquiler del período actual."}
                  </p>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  onClick={alternarEstadoAlquiler}
                  disabled={actualizandoEstado}
                  className="btn-fenix btn-fenix-outline btn-sm-fenix"
                >
                  <FiRefreshCw size={14} />
                  <span>
                    Marcar como {inquilino.alquiler ? "Pendiente" : "Al Día"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <UltimosRecibosInquilino
              idInquilino={inquilino.id}
              nombre={inquilino.nombre}
              apellido={inquilino.apellido}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default InquilinoDetailPage;
