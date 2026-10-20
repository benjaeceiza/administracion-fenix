import { FiAlertTriangle, FiX } from "react-icons/fi";

const ModalConfirmar = ({
  onClose,
  onConfirm,
  titulo = "¿Confirmar eliminación?",
  mensaje = "Esta acción es permanente y no se podrá deshacer.",
  textoConfirmar = "Eliminar",
}) => {
  return (
    <div
      className="contenedor-modal-eliminar"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-confirmar-titulo"
      onClick={onClose}
    >
      <div className="modal-eliminar" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="btn-cerrar-modal"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <FiX size={20} />
        </button>

        <div className="contenedor-contenido-modal-eliminar">
          <div className="icono-alerta-modal">
            <FiAlertTriangle size={28} />
          </div>
          <h3 id="modal-confirmar-titulo" className="titulo-modal-eliminar">
            {titulo}
          </h3>
          <p className="subtitulo-modal-eliminar">{mensaje}</p>

          <div className="contenedor-botones-modal-eliminar">
            <button
              type="button"
              className="btn-fenix btn-fenix-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn-fenix btn-fenix-danger"
              onClick={onConfirm}
            >
              {textoConfirmar}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmar;
