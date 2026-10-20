import { useState } from "react";
import { FiTrash2, FiCalendar } from "react-icons/fi";
import { deleteNota } from "../../services/notas.service";
import { formatDate } from "../../utils/formatters";
import { notifySuccess, notifyError } from "../../utils/notify";
import ModalConfirmar from "../common/ModalConfirmar";

const ListaNotas = ({ notas, onDeleted, limite }) => {
  const [notaAEliminar, setNotaAEliminar] = useState(null);

  const confirmarEliminacion = async () => {
    if (!notaAEliminar) return;
    try {
      await deleteNota(notaAEliminar.id);
      notifySuccess("Nota eliminada correctamente");
      if (onDeleted) onDeleted(notaAEliminar.id);
    } catch (error) {
      console.error("Error eliminando nota:", error);
      notifyError("No se pudo eliminar la nota");
    } finally {
      setNotaAEliminar(null);
    }
  };

  return (
    <>
      {notaAEliminar && (
        <ModalConfirmar
          onClose={() => setNotaAEliminar(null)}
          onConfirm={confirmarEliminacion}
          titulo="¿Eliminar nota?"
          mensaje={`Se eliminará la nota "${notaAEliminar.nombre}".`}
        />
      )}

      <div className="notes-grid">
        {notas.slice(0, limite).map((nota) => (
          <article key={nota.id} className="note-card">
            <div className="note-card-header">
              <h4 className="note-card-title">{nota.nombre}</h4>
            </div>

            <div className="note-card-body">
              <p className="note-card-text">{nota.nota}</p>
            </div>

            <div className="note-card-footer">
              <span className="receipt-date tabular-nums">
                <FiCalendar size={14} />
                {formatDate(nota.fecha)}
              </span>

              <button
                type="button"
                onClick={() => setNotaAEliminar(nota)}
                className="action-icon-btn action-delete"
                title="Eliminar nota"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default ListaNotas;
