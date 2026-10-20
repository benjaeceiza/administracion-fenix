import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave, FiUserPlus } from "react-icons/fi";
import {
  createPropietario,
  getPropietarioById,
  updatePropietario,
} from "../../services/propietarios.service";
import { capitalize, getRandomAvatar } from "../../utils/formatters";
import { notifySuccess, notifyError } from "../../utils/notify";
import Cargando from "../common/Cargando";

const INITIAL_FORM = {
  nombre: "",
  apellido: "",
  genero: "Hombre",
  telefono: "",
  email: "",
  cuit: "",
  cbu: "",
};

const FormularioPropietario = () => {
  const { id } = useParams();
  const esEdicion = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!esEdicion) return;
    let activo = true;
    setCargando(true);

    getPropietarioById(id)
      .then((data) => {
        if (!activo || !data) return;
        setForm({
          nombre: data.nombre || "",
          apellido: data.apellido || "",
          genero: data.genero || "Hombre",
          telefono: data.telefono || "",
          email: data.email || "",
          cuit: data.cuit || "",
          cbu: data.cbu || "",
        });
      })
      .catch((err) => console.error("Error cargando propietario:", err))
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [id, esEdicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: false }));
    }
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.nombre.trim()) nuevosErrores.nombre = "Ingrese un nombre";
    if (!form.apellido.trim()) nuevosErrores.apellido = "Ingrese un apellido";
    if (!String(form.telefono).trim()) nuevosErrores.telefono = "Ingrese un teléfono";
    if (!form.email.trim()) nuevosErrores.email = "Ingrese un correo electrónico";
    if (!String(form.cuit).trim()) nuevosErrores.cuit = "Ingrese DNI, CUIT o CUIL";
    if (!form.cbu.trim()) nuevosErrores.cbu = "Ingrese un CBU o Alias";

    setErrores(nuevosErrores);
    const primerError = Object.values(nuevosErrores)[0];
    if (primerError) {
      notifyError(primerError);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar() || guardando) return;

    setGuardando(true);
    try {
      const payload = {
        nombre: capitalize(form.nombre),
        apellido: capitalize(form.apellido),
        telefono: String(form.telefono).trim(),
        email: form.email.trim(),
        cuit: String(form.cuit).trim(),
        cbu: form.cbu.trim(),
        genero: form.genero || "Hombre",
      };

      if (esEdicion) {
        await updatePropietario(id, payload);
        notifySuccess("Propietario actualizado correctamente");
        setTimeout(() => navigate(`/propietario/${id}`), 1000);
      } else {
        payload.imagen = getRandomAvatar(payload.genero);
        const nuevoId = await createPropietario(payload);
        notifySuccess("Propietario creado correctamente");
        setTimeout(() => navigate(`/propietario/${nuevoId}`), 1000);
      }
    } catch (error) {
      console.error("Error guardando propietario:", error);
      notifyError("Ocurrió un error al guardar el propietario");
      setGuardando(false);
    }
  };

  if (cargando) return <Cargando />;

  return (
    <main className="container page-container">
      <div className="form-page-wrapper">
        <div className="detail-top-bar">
          <Link
            to={esEdicion ? `/propietario/${id}` : "/propietarios"}
            className="btn-back-link"
          >
            <FiArrowLeft size={18} />
            <span>{esEdicion ? "Volver al Propietario" : "Volver a Propietarios"}</span>
          </Link>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <h1 className="form-card-title">
              {esEdicion ? "Editar Propietario" : "Registrar Nuevo Propietario"}
            </h1>
            <p className="form-card-subtitle">
              Complete los datos personales, fiscales y bancarios del titular.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="prop-nombre">
                  Nombre *
                </label>
                <input
                  id="prop-nombre"
                  name="nombre"
                  type="text"
                  className={`form-control-fenix ${errores.nombre ? "input-error" : ""}`}
                  placeholder="Ej. Juan"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="prop-apellido">
                  Apellido *
                </label>
                <input
                  id="prop-apellido"
                  name="apellido"
                  type="text"
                  className={`form-control-fenix ${errores.apellido ? "input-error" : ""}`}
                  placeholder="Ej. Pérez"
                  value={form.apellido}
                  onChange={handleChange}
                />
              </div>

              {!esEdicion && (
                <div className="col-md-6">
                  <label className="form-label-fenix" htmlFor="prop-genero">
                    Género (para avatar inicial)
                  </label>
                  <select
                    id="prop-genero"
                    name="genero"
                    className="form-select-fenix"
                    value={form.genero}
                    onChange={handleChange}
                  >
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                  </select>
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="prop-telefono">
                  Teléfono *
                </label>
                <input
                  id="prop-telefono"
                  name="telefono"
                  type="tel"
                  className={`form-control-fenix tabular-nums ${
                    errores.telefono ? "input-error" : ""
                  }`}
                  placeholder="Ej. 2657123456"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="prop-email">
                  Correo Electrónico *
                </label>
                <input
                  id="prop-email"
                  name="email"
                  type="email"
                  className={`form-control-fenix ${errores.email ? "input-error" : ""}`}
                  placeholder="correo@ejemplo.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="prop-cuit">
                  DNI / CUIT / CUIL *
                </label>
                <input
                  id="prop-cuit"
                  name="cuit"
                  type="text"
                  className={`form-control-fenix tabular-nums ${
                    errores.cuit ? "input-error" : ""
                  }`}
                  placeholder="Sin puntos ni guiones"
                  value={form.cuit}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label-fenix" htmlFor="prop-cbu">
                  Alias o CBU *
                </label>
                <input
                  id="prop-cbu"
                  name="cbu"
                  type="text"
                  className={`form-control-fenix tabular-nums ${
                    errores.cbu ? "input-error" : ""
                  }`}
                  placeholder="Alias bancario o número de CBU de 22 dígitos"
                  value={form.cbu}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <Link
                to={esEdicion ? `/propietario/${id}` : "/propietarios"}
                className="btn-fenix btn-fenix-secondary"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={guardando}
                className="btn-fenix btn-fenix-primary"
              >
                {esEdicion ? <FiSave size={18} /> : <FiUserPlus size={18} />}
                <span>
                  {guardando
                    ? "Guardando..."
                    : esEdicion
                    ? "Guardar Cambios"
                    : "Registrar Propietario"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default FormularioPropietario;
