import { FiCamera } from "react-icons/fi";
import { DEFAULT_AVATAR } from "../../utils/formatters";

/**
 * Tarjeta de perfil principal reutilizable para Propietarios e Inquilinos.
 */
const ProfileHeroCard = ({
  imagen,
  nombreCompleto,
  rolTexto,
  rolVariante = "propietario",
  subtitulo,
  onEditAvatar,
}) => {
  return (
    <div className="profile-hero-card h-100">
      <div className="profile-avatar-wrapper">
        <img
          src={imagen || DEFAULT_AVATAR}
          alt={nombreCompleto}
          className="profile-avatar-lg"
        />
        {onEditAvatar && (
          <button
            type="button"
            className="profile-avatar-edit-btn"
            onClick={onEditAvatar}
            title="Cambiar avatar"
          >
            <FiCamera size={16} />
          </button>
        )}
      </div>
      <span
        className={`profile-role-badge ${
          rolVariante === "inquilino" ? "badge-inquilino" : "badge-propietario"
        }`}
      >
        {rolTexto}
      </span>
      <h2 className="profile-name">{nombreCompleto}</h2>
      {subtitulo && <p className="profile-meta">{subtitulo}</p>}
    </div>
  );
};

export default ProfileHeroCard;
