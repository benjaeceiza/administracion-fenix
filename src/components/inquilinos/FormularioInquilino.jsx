import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { FiArrowLeft, FiSave, FiUserPlus } from "react-icons/fi";
import { getPropietarios } from "../../services/propietarios.service";
import {
  createInquilino,
  getInquilinoById,
  updateInquilino,
} from "../../services/inquilinos.service";
import {
  TIPOS_AJUSTE,
  MESES,
  capitalize,
  getRandomAvatar,
  toDateObject,
  calcularProximoAjuste,
  parseMonto,
} from "../../utils/formatters";
import { notifySuccess, notifyError } from "../../utils/notify";
import Cargando from "../common/Cargando";

registerLocale("es", es);

const currentYear = new Date().getFullYear();
const AÑOS_AJUSTE = Array.from({ length: 6 }, (_, i) => currentYear - 1 + i);

const FormularioInquilino = () => {
  const { idInquilino } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const esEdicion = location.pathname.startsWith("/editar/inquilino/");
  const idPropietarioPreseleccionado = !esEdicion && idInquilino ? idInquilino : "";

  const [propietarios, setPropietarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});

  const [form, setForm] = useState({
    idprop: idPropietarioPreseleccionado,
    nombre: "",
    apellido: "",
    genero: "Hombre",
    telefono: "",
    email: "",
    dni: "",
    direccion: "",
    aumento: "",
    monto: "",
    vigencia: new Date(),
    vencimiento: new Date(),
    mesAumento: new Date().getMonth() + 1,
    añoAumento: currentYear,
  });

  useEffect(() => {
    let activo = true;
    setCargando(true);

    const cargarDatos = async () => {
      try {
        const promesas = [getPropietarios()];
        if (esEdicion && idInquilino) {
          promesas.push(getInquilinoById(idInquilino));
        }

        const [listaPropietarios, datosInquilino] = await Promise.all(promesas);
        if (!activo) return;

        setPropietarios(listaPropietarios);

        if (esEdicion && datosInquilino) {
          const montoInicial = parseMonto(datosInquilino.monto);
          setForm({
            idprop: datosInquilino.idprop || "",
            nombre: datosInquilino.nombre || "",
            apellido: datosInquilino.apellido || "",
            genero: datosInquilino.genero || "Hombre",
            telefono: datosInquilino.telefono || "",
            email: datosInquilino.email || "",
            dni: datosInquilino.dni || "",
            direccion: datosInquilino.direccion || "",
            aumento: datosInquilino.aumento || "",
            monto: !isNaN(montoInicial) ? montoInicial : "",
            vigencia: toDateObject(datosInquilino.vigencia) || new Date(),
            vencimiento: toDateObject(datosInquilino.vencimiento) || new Date(),
            mesAumento: datosInquilino.mesAumento || new Date().getMonth() + 1,
            añoAumento: datosInquilino.añoAumento || currentYear,
          });
        }
      } catch (err) {
        console.error("Error cargando datos del formulario de inquilino:", err);
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarDatos();
    return () => {
      activo = false;
    };
  }, [esEdicion, idInquilino]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const actualizado = { ...prev, [name]: value };
      if (name === "aumento" && !esEdicion && value) {
        const { mesAumento, añoAumento } = calcularProximoAjuste(
          prev.vigencia,
          value
        );
        actualizado.mesAumento = mesAumento;
        actualizado.añoAumento = añoAumento;
      }
      return actualizado;
    });

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleVigenciaChange = (date) => {
    if (!date) return;
    setForm((prev) => {
      const actualizado = { ...prev, vigencia: date };
      if (!esEdicion && prev.aumento) {
        const { mesAumento, añoAumento } = calcularProximoAjuste(date, prev.aumento);
        actualizado.mesAumento = mesAumento;
        actualizado.añoAumento = añoAumento;
      }
      return actualizado;
    });
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!esEdicion && !idPropietarioPreseleccionado && !form.idprop) {
      nuevosErrores.idprop = "Seleccione un locador / propietario";
    }
    if (!form.nombre.trim()) nuevosErrores.nombre = "Ingrese un nombre";
    if (!form.apellido.trim()) nuevosErrores.apellido = "Ingrese un apellido";
    if (!String(form.telefono).trim()) nuevosErrores.telefono = "Ingrese un teléfono";
    if (!form.email.trim()) nuevosErrores.email = "Ingrese un correo electrónico";
    if (!String(form.dni).trim()) nuevosErrores.dni = "Ingrese un DNI";
    if (!form.direccion.trim()) nuevosErrores.direccion = "Ingrese la dirección del inmueble";
    if (!form.aumento) nuevosErrores.aumento = "Seleccione el tipo de ajuste";
    const montoNum = parseMonto(form.monto);
    if (form.monto === "" || isNaN(montoNum) || montoNum <= 0) {
      nuevosErrores.monto = "Ingrese un monto válido";
    }

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
        dni: String(form.dni).trim(),
        direccion: form.direccion.trim(),
        aumento: form.aumento,
        monto: parseMonto(form.monto),
        vigencia: { fecha: form.vigencia },
        vencimiento: { fecha: form.vencimiento },
        mesAumento: Number(form.mesAumento),
        añoAumento: Number(form.añoAumento),
      };

      if (esEdicion) {
        if (form.idprop) payload.idprop = form.idprop;
        await updateInquilino(idInquilino, payload);
        notifySuccess("Inquilino actualizado correctamente");
        setTimeout(() => navigate(`/inquilino/${idInquilino}`), 1000);
      } else {
        const propietarioFinal = idPropietarioPreseleccionado || form.idprop;
        payload.idprop = propietarioFinal;
        payload.alquiler = false;
        payload.genero = form.genero || "Hombre";
        payload.imagen = getRandomAvatar(payload.genero);

        await createInquilino(payload);
        notifySuccess("Inquilino registrado correctamente");
        setTimeout(() => {
          navigate(
            propietarioFinal ? `/propietario/${propietarioFinal}` : "/alquileres"
          );
        }, 1000);
      }
    } catch (error) {
      console.error("Error guardando inquilino:", error);
      notifyError("No se pudo guardar el inquilino");
      setGuardando(false);
    }
  };

  if (cargando) return <Cargando />;

  const rutaVolver = esEdicion
    ? `/inquilino/${idInquilino}`
    : idPropietarioPreseleccionado
    ? `/propietario/${idPropietarioPreseleccionado}`
    : "/alquileres";

  return (
    <main className="container page-container">
      <div className="form-page-wrapper">
        <div className="detail-top-bar">
          <Link to={rutaVolver} className="btn-back-link">
            <FiArrowLeft size={18} />
            <span>Volver</span>
          </Link>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <h1 className="form-card-title">
              {esEdicion ? "Editar Inquilino y Contrato" : "Registrar Nuevo Inquilino"}
            </h1>
            <p className="form-card-subtitle">
              Complete los datos personales del locatario y las condiciones del contrato de alquiler.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              {!idPropietarioPreseleccionado && (
                <div className="col-12">
                  <label className="form-label-fenix" htmlFor="inq-idprop">
                    Locador / Propietario *
                  </label>
                  <select
                    id="inq-idprop"
                    name="idprop"
                    className={`form-select-fenix ${errores.idprop ? "input-error" : ""}`}
                    value={form.idprop}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione el propietario del inmueble</option>
                    {propietarios.map((prop) => (
                      <option key={prop.id} value={prop.id}>
                        {prop.apellido} {prop.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="inq-nombre">
                  Nombre *
                </label>
                <input
                  id="inq-nombre"
                  name="nombre"
                  type="text"
                  className={`form-control-fenix ${errores.nombre ? "input-error" : ""}`}
                  placeholder="Nombre del inquilino"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="inq-apellido">
                  Apellido *
                </label>
                <input
                  id="inq-apellido"
                  name="apellido"
                  type="text"
                  className={`form-control-fenix ${errores.apellido ? "input-error" : ""}`}
                  placeholder="Apellido del inquilino"
                  value={form.apellido}
                  onChange={handleChange}
                />
              </div>

              {!esEdicion && (
                <div className="col-md-4">
                  <label className="form-label-fenix" htmlFor="inq-genero">
                    Género
                  </label>
                  <select
                    id="inq-genero"
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

              <div className="col-md-4">
                <label className="form-label-fenix" htmlFor="inq-dni">
                  DNI / CUIT *
                </label>
                <input
                  id="inq-dni"
                  name="dni"
                  type="text"
                  className={`form-control-fenix tabular-nums ${
                    errores.dni ? "input-error" : ""
                  }`}
                  placeholder="Número de documento"
                  value={form.dni}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label-fenix" htmlFor="inq-telefono">
                  Teléfono *
                </label>
                <input
                  id="inq-telefono"
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

              <div className={esEdicion ? "col-md-4" : "col-md-6"}>
                <label className="form-label-fenix" htmlFor="inq-email">
                  Correo Electrónico *
                </label>
                <input
                  id="inq-email"
                  name="email"
                  type="email"
                  className={`form-control-fenix ${errores.email ? "input-error" : ""}`}
                  placeholder="correo@ejemplo.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className={esEdicion ? "col-12" : "col-md-6"}>
                <label className="form-label-fenix" htmlFor="inq-direccion">
                  Dirección del Inmueble *
                </label>
                <input
                  id="inq-direccion"
                  name="direccion"
                  type="text"
                  className={`form-control-fenix ${
                    errores.direccion ? "input-error" : ""
                  }`}
                  placeholder="Calle y número de la propiedad alquilada"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="inq-monto">
                  Monto Mensual ($) *
                </label>
                <input
                  id="inq-monto"
                  name="monto"
                  type="number"
                  className={`form-control-fenix tabular-nums ${
                    errores.monto ? "input-error" : ""
                  }`}
                  placeholder="Ej. 250000"
                  value={form.monto}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="inq-aumento">
                  Frecuencia de Ajuste *
                </label>
                <select
                  id="inq-aumento"
                  name="aumento"
                  className={`form-select-fenix ${errores.aumento ? "input-error" : ""}`}
                  value={form.aumento}
                  onChange={handleChange}
                >
                  <option value="">Seleccione tipo de ajuste</option>
                  {TIPOS_AJUSTE.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix">Mes de Próximo Ajuste</label>
                <select
                  name="mesAumento"
                  className="form-select-fenix"
                  value={form.mesAumento}
                  onChange={handleChange}
                >
                  {MESES.map((m) => (
                    <option key={m.valor} value={m.valor + 1}>
                      {m.valor + 1} - {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix">Año de Próximo Ajuste</label>
                <select
                  name="añoAumento"
                  className="form-select-fenix tabular-nums"
                  value={form.añoAumento}
                  onChange={handleChange}
                >
                  {!AÑOS_AJUSTE.includes(Number(form.añoAumento)) && form.añoAumento && (
                    <option value={form.añoAumento}>{form.añoAumento}</option>
                  )}
                  {AÑOS_AJUSTE.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix d-block">
                  Fecha de Inicio (Vigencia)
                </label>
                <DatePicker
                  className="form-control-fenix w-100 tabular-nums"
                  selected={form.vigencia}
                  onChange={handleVigenciaChange}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix d-block">
                  Fecha de Vencimiento
                </label>
                <DatePicker
                  className="form-control-fenix w-100 tabular-nums"
                  selected={form.vencimiento}
                  onChange={(date) =>
                    date && setForm((prev) => ({ ...prev, vencimiento: date }))
                  }
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </div>

            <div className="form-actions">
              <Link to={rutaVolver} className="btn-fenix btn-fenix-secondary">
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
                    : "Registrar Inquilino"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default FormularioInquilino;
