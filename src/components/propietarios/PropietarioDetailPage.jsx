import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCreditCard,
  FiFileText,
  FiHash,
  FiMail,
  FiPhone,
  FiTrash2,
} from "react-icons/fi";
import {
  getPropietarioById,
  deletePropietario,
} from "../../services/propietarios.service";
import { getInquilinosByPropietario } from "../../services/inquilinos.service";
import { notifySuccess, notifyError } from "../../utils/notify";
import Cargando from "../common/Cargando";
import ModalConfirmar from "../common/ModalConfirmar";
import ModalAvatar from "../common/ModalAvatar";
import ProfileHeroCard from "../common/ProfileHeroCard";
import InfoCard from "../common/InfoCard";
import PropiedadesPropietario from "./PropiedadesPropietario";
import InquilinosPropietario from "./InquilinosPropietario";

const PropietarioDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [propietario, setPropietario] = useState(null);
  const [inquilinosAgrupados, setInquilinosAgrupados] = useState([]);
  const [cargador, setCargador] = useState(true);
  const [cambiarAvatar, setCambiarAvatar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  useEffect(() => {
    let activo = true;
    setCargador(true);

    Promise.all([getPropietarioById(id), getInquilinosByPropietario(id)])
      .then(([propData, inqData]) => {
        if (!activo) return;
        setPropietario(propData);
        setInquilinosAgrupados(inqData);
      })
      .catch((err) => console.error("Error obteniendo detalle de propietario:", err))
      .finally(() => {
        if (activo) setCargador(false);
      });

    return () => {
      activo = false;
    };
  }, [id]);

  const confirmarEliminacion = async () => {
    try {
      await deletePropietario(id);
      notifySuccess("Propietario eliminado con éxito");
      setModalEliminar(false);
      setTimeout(() => navigate("/propietarios"), 1200);
    } catch (error) {
      console.error("Error al eliminar propietario:", error);
      notifyError("Error al eliminar propietario");
    }
  };

  if (cargador) return <Cargando />;

  if (!propietario) {
    return (
      <main className="container page-container text-center">
        <div className="empty-state-card">
          <h3>Propietario no encontrado</h3>
          <p>El registro solicitado no existe o fue eliminado.</p>
          <Link to="/propietarios" className="btn-fenix btn-fenix-primary mt-3">
            <FiArrowLeft size={16} /> Volver a Propietarios
          </Link>
        </div>
      </main>
    );
  }

  const camposPropietario = [
    { label: "Teléfono", value: propietario.telefono, icon: FiPhone },
    { label: "Correo Electrónico", value: propietario.email, icon: FiMail },
    { label: "DNI / CUIT / CUIL", value: propietario.cuit, icon: FiHash },
    { label: "Alias / CBU", value: propietario.cbu, icon: FiCreditCard },
  ];

  return (
    <main className="container page-container">
      {modalEliminar && (
        <ModalConfirmar
          onClose={() => setModalEliminar(false)}
          onConfirm={confirmarEliminacion}
          titulo={`¿Eliminar a ${propietario.apellido} ${propietario.nombre}?`}
          mensaje="Esta acción eliminará al propietario, sus propiedades y todos sus inquilinos asociados."
        />
      )}

      <ModalAvatar
        tipo="propietarios"
        abierto={cambiarAvatar}
        onClose={() => setCambiarAvatar(false)}
        persona={propietario}
        onAvatarUpdated={(nuevaImagen) =>
          setPropietario((prev) => ({ ...prev, imagen: nuevaImagen }))
        }
      />

      <div className="detail-top-bar">
        <Link to="/propietarios" className="btn-back-link">
          <FiArrowLeft size={18} />
          <span>Volver a Propietarios</span>
        </Link>

        <div className="d-flex flex-wrap gap-2">
          <Link
            to={`/recibos/propietario/${id}`}
            className="btn-fenix btn-fenix-secondary btn-sm-fenix"
          >
            <FiFileText size={16} />
            <span>Generar Comprobante</span>
          </Link>
          <button
            type="button"
            onClick={() => setModalEliminar(true)}
            className="btn-fenix btn-fenix-danger-outline btn-sm-fenix"
          >
            <FiTrash2 size={16} />
            <span>Eliminar Propietario</span>
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4 align-items-stretch">
        <div className="col-lg-4">
          <ProfileHeroCard
            imagen={propietario.imagen}
            nombreCompleto={`${propietario.apellido} ${propietario.nombre}`}
            rolTexto="Propietario / Locador"
            rolVariante="propietario"
            subtitulo={`${inquilinosAgrupados.length} inquilino(s) vinculado(s)`}
            onEditAvatar={() => setCambiarAvatar(true)}
          />
        </div>

        <div className="col-lg-8">
          <InfoCard
            titulo="Información de Contacto y Cobro"
            editUrl={`/editar/${id}`}
            items={camposPropietario}
            columns={2}
          />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <PropiedadesPropietario idPropietario={id} />
        </div>
        <div className="col-lg-5">
          <InquilinosPropietario
            idPropietario={id}
            inquilinosIniciales={inquilinosAgrupados}
          />
        </div>
      </div>
    </main>
  );
};

export default PropietarioDetailPage;
