import { useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { avataresHombre, avataresMujer } from "../../utils/formatters";
import { updatePropietario } from "../../services/propietarios.service";
import { updateInquilino } from "../../services/inquilinos.service";
import { notifySuccess, notifyError } from "../../utils/notify";

const ModalAvatar = ({
  abierto,
  onClose,
  persona,
  tipo,
  onAvatarUpdated,
}) => {
  const [seleccionado, setSeleccionado] = useState(persona?.imagen || "");
  const [guardando, setGuardando] = useState(false);

  if (!abierto || !persona) return null;

  const avatares =
    persona.genero === "Mujer" ? avataresMujer : avataresHombre;

  const guardarCambio = async () => {
    if (!seleccionado) return;
    setGuardando(true);
    try {
      if (tipo === "propietarios") {
        await updatePropietario(persona.id, { imagen: seleccionado });
      } else {
        await updateInquilino(persona.id, { imagen: seleccionado });
      }
      notifySuccess("Avatar actualizado correctamente");
      if (onAvatarUpdated) onAvatarUpdated(seleccionado);
      onClose();
    } catch (error) {
      console.error("Error actualizando avatar:", error);
      notifyError("No se pudo actualizar el avatar");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div
      className="contenedor-modal-eliminar"
      role="dialog"
      aria-modal="true"
      aria-label="Seleccionar avatar"
      onClick={onClose}
    >
      <div className="modal-avatar-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-avatar-header">
          <h4 className="m-0 fw-bold">Seleccionar Avatar</h4>
          <button
            type="button"
            className="btn-cerrar-modal position-static"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="contenedor-avatars">
          {avatares.map((avatar) => (
            <button
              key={avatar}
              type="button"
              onClick={() => setSeleccionado(avatar)}
              className={`avatar-option-btn ${
                seleccionado === avatar ? "seleccionado" : ""
              }`}
            >
              <img src={avatar} alt="Opción de avatar" />
            </button>
          ))}
        </div>

        <div className="modal-avatar-footer">
          <button
            type="button"
            className="btn-fenix btn-fenix-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="btn-fenix btn-fenix-primary"
            onClick={guardarCambio}
            disabled={guardando || !seleccionado}
          >
            <FiCheck size={16} />
            <span>{guardando ? "Guardando..." : "Guardar cambios"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAvatar;
