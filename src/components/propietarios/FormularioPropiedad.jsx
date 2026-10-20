import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiHome, FiPlus } from "react-icons/fi";
import { createPropiedad } from "../../services/propiedades.service";
import { notifySuccess, notifyError } from "../../utils/notify";

const FormularioPropiedad = () => {
  const { idPropietario } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    direccion: "",
    finca: "",
    niz: "",
    gas: "",
    os: "",
  });
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.direccion.trim()) {
      notifyError("Por favor ingrese la dirección de la propiedad");
      return;
    }
    if (guardando) return;

    setGuardando(true);
    try {
      await createPropiedad({
        direccion: form.direccion.trim(),
        finca: form.finca.trim() || "-",
        nix: form.niz.trim() || "-",
        gas: form.gas.trim() || "-",
        os: form.os.trim() || "-",
        idprop: idPropietario,
      });
      notifySuccess("Propiedad agregada correctamente");
      setTimeout(() => navigate(`/propietario/${idPropietario}`), 1000);
    } catch (error) {
      console.error("Error creando propiedad:", error);
      notifyError("No se pudo guardar la propiedad");
      setGuardando(false);
    }
  };

  return (
    <main className="container page-container">
      <div className="form-page-wrapper">
        <div className="detail-top-bar">
          <Link to={`/propietario/${idPropietario}`} className="btn-back-link">
            <FiArrowLeft size={18} />
            <span>Volver al Propietario</span>
          </Link>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <div className="d-flex align-items-center gap-2 mb-1">
              <FiHome size={22} className="text-emerald" />
              <h1 className="form-card-title m-0">Agregar Propiedad</h1>
            </div>
            <p className="form-card-subtitle">
              Registre los datos catastrales y números de cuenta de servicios del inmueble.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label-fenix" htmlFor="casa-direccion">
                  Dirección del Inmueble *
                </label>
                <input
                  id="casa-direccion"
                  name="direccion"
                  type="text"
                  className="form-control-fenix"
                  placeholder="Ej. Av. Mitre 1250"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="casa-finca">
                  N° de Finca / Padrón
                </label>
                <input
                  id="casa-finca"
                  name="finca"
                  type="text"
                  className="form-control-fenix tabular-nums"
                  placeholder="Opcional"
                  value={form.finca}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="casa-niz">
                  N° de NIS (Energía Eléctrica)
                </label>
                <input
                  id="casa-niz"
                  name="niz"
                  type="text"
                  className="form-control-fenix tabular-nums"
                  placeholder="Opcional"
                  value={form.niz}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="casa-gas">
                  N° de Cuenta de Gas
                </label>
                <input
                  id="casa-gas"
                  name="gas"
                  type="text"
                  className="form-control-fenix tabular-nums"
                  placeholder="Opcional"
                  value={form.gas}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="casa-os">
                  N° de Obras Sanitarias (O.S.)
                </label>
                <input
                  id="casa-os"
                  name="os"
                  type="text"
                  className="form-control-fenix tabular-nums"
                  placeholder="Opcional"
                  value={form.os}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <Link
                to={`/propietario/${idPropietario}`}
                className="btn-fenix btn-fenix-secondary"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={guardando}
                className="btn-fenix btn-fenix-primary"
              >
                <FiPlus size={18} />
                <span>{guardando ? "Agregando..." : "Guardar Propiedad"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default FormularioPropiedad;
