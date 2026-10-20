import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiAlertTriangle,
  FiCalendar,
  FiTrendingUp,
  FiChevronDown,
  FiChevronUp,
  FiArrowRight,
} from "react-icons/fi";
import { toDateObject, formatDate } from "../../utils/formatters";

const AlertasVencimiento = ({ inquilinos = [] }) => {
  const [abierto, setAbierto] = useState(false);

  const { porVencer, porAumentar } = useMemo(() => {
    const hoy = new Date();
    const añoActual = hoy.getFullYear();
    const mesActual = hoy.getMonth() + 1;
    let mesProximo = mesActual + 1;
    if (mesProximo > 12) mesProximo -= 12;

    const listaVencer = [];
    const listaAumento = [];

    inquilinos.forEach((inquilino) => {
      const fechaVenc = toDateObject(inquilino.vencimiento);
      if (fechaVenc) {
        const añoAVencer = fechaVenc.getFullYear();
        const mesAVencer = fechaVenc.getMonth() + 1;
        if (añoActual === añoAVencer && mesActual >= mesAVencer) {
          listaVencer.push({
            id: inquilino.id,
            nombre: `${inquilino.apellido} ${inquilino.nombre}`,
            detalle: formatDate(fechaVenc),
          });
        }
      }

      if (Number(inquilino.mesAumento) === mesProximo) {
        listaAumento.push({
          id: inquilino.id,
          nombre: `${inquilino.apellido} ${inquilino.nombre}`,
          detalle: `${inquilino.aumento || "Ajuste"} (${inquilino.mesAumento}/${inquilino.añoAumento || añoActual})`,
        });
      }
    });

    return { porVencer: listaVencer, porAumentar: listaAumento };
  }, [inquilinos]);

  const totalAlertas = porVencer.length + porAumentar.length;
  if (totalAlertas === 0) return null;

  return (
    <div className="alert-banner-wrapper">
      <div className="container">
        <button
          type="button"
          className="alert-banner-toggle"
          onClick={() => setAbierto(!abierto)}
          aria-expanded={abierto}
        >
          <div className="d-flex align-items-center gap-2">
            <FiAlertTriangle size={20} />
            <span>
              Atención: <strong>{porVencer.length}</strong> vencimiento(s) y{" "}
              <strong>{porAumentar.length}</strong> ajuste(s) próximo(s)
            </span>
          </div>
          <span className="d-flex align-items-center gap-1 small fw-semibold">
            {abierto ? "Ocultar detalles" : "Ver detalles"}
            {abierto ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
          </span>
        </button>

        {abierto && (
          <div className="alert-banner-content">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="alert-box">
                  <h4 className="alert-box-title">
                    <FiCalendar size={16} /> Contratos por Vencer / Vencidos ({porVencer.length})
                  </h4>
                  {porVencer.length === 0 ? (
                    <p className="text-muted small mb-0">Sin contratos próximos a vencer.</p>
                  ) : (
                    <ul className="alert-list">
                      {porVencer.map((item) => (
                        <li key={item.id}>
                          <Link to={`/inquilino/${item.id}`} className="alert-link">
                            <span>{item.nombre}</span>
                            <span className="alert-link-meta">
                              {item.detalle} <FiArrowRight size={14} />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="alert-box">
                  <h4 className="alert-box-title">
                    <FiTrendingUp size={16} /> Próximos Ajustes ({porAumentar.length})
                  </h4>
                  {porAumentar.length === 0 ? (
                    <p className="text-muted small mb-0">Sin ajustes programados para el próximo mes.</p>
                  ) : (
                    <ul className="alert-list">
                      {porAumentar.map((item) => (
                        <li key={item.id}>
                          <Link to={`/inquilino/${item.id}`} className="alert-link">
                            <span>{item.nombre}</span>
                            <span className="alert-link-meta">
                              {item.detalle} <FiArrowRight size={14} />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertasVencimiento;
