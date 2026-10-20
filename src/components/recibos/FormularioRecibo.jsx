import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import { FiArrowLeft, FiCheck, FiFileText, FiList } from "react-icons/fi";
import {
  getPropietarios,
  getPropietarioById,
} from "../../services/propietarios.service";
import {
  getInquilinos,
  getInquilinoById,
} from "../../services/inquilinos.service";
import { createRecibo } from "../../services/recibos.service";
import { parseMonto } from "../../utils/formatters";
import { notifySuccess, notifyError } from "../../utils/notify";
import Cargando from "../common/Cargando";

registerLocale("es", es);

const FormularioRecibo = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const esInquilinoFijo = location.pathname.startsWith("/recibos/inquilino/");
  const esPropietarioFijo = location.pathname.startsWith("/recibos/propietario/");
  const tipoInicial = esInquilinoFijo
    ? "inquilinos"
    : esPropietarioFijo
    ? "propietarios"
    : "";

  const [cargando, setCargando] = useState(Boolean(id));
  const [enviando, setEnviando] = useState(false);

  const [tipo, setTipo] = useState(tipoInicial);
  const [personas, setPersonas] = useState([]);
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);

  const [tipoConcepto, setTipoConcepto] = useState("");
  const [conceptoPersonalizado, setConceptoPersonalizado] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState(new Date());

  const [expensas, setExpensas] = useState(false);
  const [impuesto, setImpuesto] = useState(false);
  const [municipalidad, setMunicipalidad] = useState(false);

  useEffect(() => {
    if (!id) return;
    let activo = true;
    setCargando(true);

    const fetchPersona = esInquilinoFijo
      ? getInquilinoById(id)
      : getPropietarioById(id);

    fetchPersona
      .then((data) => {
        if (!activo || !data) return;
        setPersonaSeleccionada(data);
        if (esInquilinoFijo && data.monto) {
          const montoLimpio = parseMonto(data.monto);
          setMonto(!isNaN(montoLimpio) ? montoLimpio : data.monto);
        }
      })
      .catch((err) => console.error("Error cargando persona para recibo:", err))
      .finally(() => {
        if (activo) setCargando(false);
      });

    return () => {
      activo = false;
    };
  }, [id, esInquilinoFijo]);

  useEffect(() => {
    if (id || !tipo) {
      if (!id) setPersonas([]);
      return;
    }
    let activo = true;
    const fetchLista =
      tipo === "inquilinos" ? getInquilinos() : getPropietarios();

    fetchLista
      .then((lista) => {
        if (activo) setPersonas(lista);
      })
      .catch((err) => console.error("Error cargando lista de personas:", err));

    return () => {
      activo = false;
    };
  }, [tipo, id]);

  const handleSelectPersona = (e) => {
    const personaId = e.target.value;
    const encontrada = personas.find((p) => p.id === personaId) || null;
    setPersonaSeleccionada(encontrada);
    if (encontrada?.monto && tipo === "inquilinos") {
      const montoLimpio = parseMonto(encontrada.monto);
      setMonto(!isNaN(montoLimpio) ? montoLimpio : encontrada.monto);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tipo) {
      notifyError("Seleccione el tipo de destinatario");
      return;
    }
    if (!personaSeleccionada) {
      notifyError("Seleccione una persona");
      return;
    }
    const conceptoFinal =
      tipoConcepto === "Otro" ? conceptoPersonalizado.trim() : tipoConcepto;
    if (!conceptoFinal) {
      notifyError("Indique el concepto del comprobante");
      return;
    }
    const montoNum = parseMonto(monto);
    if (monto === "" || isNaN(montoNum) || montoNum <= 0) {
      notifyError("Ingrese un monto válido mayor a 0");
      return;
    }
    if (enviando) return;

    setEnviando(true);
    try {
      const nombreCompleto = `${personaSeleccionada.apellido} ${personaSeleccionada.nombre}`;
      const reciboPayload = {
        nombre: nombreCompleto,
        tipo,
        idPersona: personaSeleccionada.id,
        idprop:
          tipo === "inquilinos"
            ? personaSeleccionada.idprop || 0
            : personaSeleccionada.id,
        concepto: conceptoFinal,
        monto: montoNum,
        fecha: { fecha },
      };

      if (tipoConcepto === "Alquiler") {
        reciboPayload.impuestos = impuesto;
        reciboPayload.expensas = expensas;
        reciboPayload.municipalidad = municipalidad;
        reciboPayload.descripcion = descripcion.trim();
      }

      await createRecibo(reciboPayload);
      notifySuccess("Comprobante registrado exitosamente");

      setTipoConcepto("");
      setConceptoPersonalizado("");
      setDescripcion("");
      setExpensas(false);
      setImpuesto(false);
      setMunicipalidad(false);

      setTimeout(() => {
        navigate("/recibos/verrecibos");
      }, 1000);
    } catch (error) {
      console.error("Error al crear recibo:", error);
      notifyError("No se pudo generar el recibo");
      setEnviando(false);
    }
  };

  if (cargando) return <Cargando />;

  const rutaVolver = esInquilinoFijo
    ? `/inquilino/${id}`
    : esPropietarioFijo
    ? `/propietario/${id}`
    : "/recibos/verrecibos";

  return (
    <main className="container page-container">
      <div className="form-page-wrapper">
        <div className="detail-top-bar">
          <Link to={rutaVolver} className="btn-back-link">
            <FiArrowLeft size={18} />
            <span>Volver</span>
          </Link>

          <Link
            to="/recibos/verrecibos"
            className="btn-fenix btn-fenix-outline btn-sm-fenix"
          >
            <FiList size={16} />
            <span>Historial de Recibos</span>
          </Link>
        </div>

        <div className="form-card">
          <div className="form-card-header">
            <div className="d-flex align-items-center gap-2 mb-1">
              <FiFileText size={22} className="text-emerald" />
              <h1 className="form-card-title m-0">Emitir Comprobante / Recibo</h1>
            </div>
            <p className="form-card-subtitle">
              Genere recibos de cobro para inquilinos o comprobantes de liquidación para propietarios.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="recibo-tipo">
                  Tipo de Destinatario *
                </label>
                <select
                  id="recibo-tipo"
                  className="form-select-fenix"
                  value={tipo}
                  disabled={Boolean(id)}
                  onChange={(e) => {
                    setTipo(e.target.value);
                    setPersonaSeleccionada(null);
                  }}
                >
                  {!id && <option value="">Seleccione tipo</option>}
                  <option value="inquilinos">Inquilino (Cobro)</option>
                  <option value="propietarios">Propietario (Entrega / Liquidación)</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="recibo-persona">
                  Nombre Completo *
                </label>
                {id && personaSeleccionada ? (
                  <input
                    id="recibo-persona"
                    type="text"
                    className="form-control-fenix"
                    value={`${personaSeleccionada.apellido} ${personaSeleccionada.nombre}`}
                    disabled
                  />
                ) : (
                  <select
                    id="recibo-persona"
                    className="form-select-fenix"
                    value={personaSeleccionada?.id || ""}
                    disabled={!tipo}
                    onChange={handleSelectPersona}
                  >
                    <option value="">
                      {tipo ? "Seleccione una persona" : "Primero elija el tipo"}
                    </option>
                    {personas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.apellido} {p.nombre}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix" htmlFor="recibo-concepto">
                  En Concepto de *
                </label>
                <select
                  id="recibo-concepto"
                  className="form-select-fenix"
                  value={tipoConcepto}
                  onChange={(e) => setTipoConcepto(e.target.value)}
                >
                  <option value="">Seleccione el concepto</option>
                  <option value="Alquiler">Alquiler</option>
                  <option value="Otro">Otro concepto...</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label-fenix d-block">
                  Fecha del Comprobante *
                </label>
                <DatePicker
                  className="form-control-fenix w-100 tabular-nums"
                  selected={fecha}
                  onChange={(d) => d && setFecha(d)}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                />
              </div>

              {tipoConcepto === "Otro" && (
                <div className="col-12">
                  <label className="form-label-fenix" htmlFor="recibo-otro">
                    Especifique el Concepto *
                  </label>
                  <input
                    id="recibo-otro"
                    type="text"
                    className="form-control-fenix"
                    placeholder="Ej. Expensas extraordinarias, Reparaciones, Depósito..."
                    value={conceptoPersonalizado}
                    onChange={(e) => setConceptoPersonalizado(e.target.value)}
                  />
                </div>
              )}

              {tipoConcepto === "Alquiler" && (
                <div className="col-12">
                  <div className="alquiler-extras-box">
                    <div className="mb-3">
                      <label className="form-label-fenix" htmlFor="recibo-desc">
                        Descripción detallada para el PDF (opcional)
                      </label>
                      <input
                        id="recibo-desc"
                        type="text"
                        className="form-control-fenix"
                        placeholder="Ej. Alquiler mes de Octubre + servicios"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                      />
                    </div>

                    <div className="checks-row">
                      <label className="check-pill">
                        <input
                          type="checkbox"
                          checked={expensas}
                          onChange={(e) => setExpensas(e.target.checked)}
                        />
                        <span>Incluye Expensas</span>
                      </label>

                      <label className="check-pill">
                        <input
                          type="checkbox"
                          checked={impuesto}
                          onChange={(e) => setImpuesto(e.target.checked)}
                        />
                        <span>Incluye Impuestos</span>
                      </label>

                      <label className="check-pill">
                        <input
                          type="checkbox"
                          checked={municipalidad}
                          onChange={(e) => setMunicipalidad(e.target.checked)}
                        />
                        <span>Incluye Municipalidad</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="col-12">
                <label className="form-label-fenix" htmlFor="recibo-monto">
                  Importe Total ($) *
                </label>
                <input
                  id="recibo-monto"
                  type="number"
                  className="form-control-fenix tabular-nums"
                  placeholder="Monto en pesos"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                />
              </div>
            </div>

            <div className="form-actions">
              <Link to={rutaVolver} className="btn-fenix btn-fenix-secondary">
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={enviando}
                className="btn-fenix btn-fenix-primary"
              >
                <FiCheck size={18} />
                <span>{enviando ? "Procesando..." : "Emitir Recibo"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default FormularioRecibo;
