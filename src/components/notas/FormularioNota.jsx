import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClipboard, FiSave } from "react-icons/fi";
import { createNota } from "../../services/notas.service";
import { notifySuccess, notifyError } from "../../utils/notify";

const FormularioNota = () => {
  const [nombre, setNombre] = useState("");
  const [nota, setNota] = useState("");
  const [guardando, setGuardando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      notifyError("Ingrese un título para la nota");
      return;
    }
    if (!nota.trim()) {
      notifyError("El contenido de la nota no puede estar vacío");
      return;
    }
    if (guardando) return;

    setGuardando(true);
    try {
      await createNota({ nombre, nota });
      notifySuccess("Nota guardada correctamente");
      setTimeout(() => navigate("/notas"), 1000);
    } catch (error) {
      console.error("Error guardando nota:", error);
      notifyError("No se pudo guardar la nota");
      setGuardando(false);
    }
  };

  return (
    <main className="container page-container">
      <div className="form-page-wrapper">
        <div className="detail-top-bar">
          <Link to="/notas" className="btn-back-link">
            <FiArrowLeft size={18} />
            <span>Volver a Notas</span>
          </Link>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <div className="d-flex align-items-center gap-2 mb-1">
              <FiClipboard size={22} className="text-emerald" />
              <h1 className="form-card-title m-0">Nueva Nota</h1>
            </div>
            <p className="form-card-subtitle">
              Registre un recordatorio o nota administrativa.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label-fenix" htmlFor="nota-titulo">
                Título / Asunto *
              </label>
              <input
                id="nota-titulo"
                className="form-control-fenix"
                type="text"
                placeholder="Ej. Llamar a gasista por revisión en Belgrano 486"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label-fenix" htmlFor="nota-cuerpo">
                Descripción / Contenido *
              </label>
              <textarea
                id="nota-cuerpo"
                className="form-control-fenix textarea-fenix"
                rows={6}
                placeholder="Escriba aquí el detalle de la nota..."
                value={nota}
                onChange={(e) => setNota(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <Link to="/notas" className="btn-fenix btn-fenix-secondary">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={guardando}
                className="btn-fenix btn-fenix-primary"
              >
                <FiSave size={18} />
                <span>{guardando ? "Guardando..." : "Guardar Nota"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default FormularioNota;
