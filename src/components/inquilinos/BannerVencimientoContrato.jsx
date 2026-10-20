import { useMemo } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { toDateObject, formatDate } from "../../utils/formatters";

const BannerVencimientoContrato = ({ inquilino }) => {
  const avisoVisible = useMemo(() => {
    const fechaVenc = toDateObject(inquilino?.vencimiento);
    if (!fechaVenc) return false;

    const hoy = new Date();
    const añoActual = hoy.getFullYear();
    const mesActual = hoy.getMonth() + 2;
    const añoAVencer = fechaVenc.getFullYear();
    const mesAVencer = fechaVenc.getMonth() + 1;

    return añoActual === añoAVencer && mesActual >= mesAVencer;
  }, [inquilino]);

  if (!avisoVisible) return null;

  return (
    <div className="aviso-vencimiento-detail">
      <div className="container d-flex align-items-center justify-content-center gap-2">
        <FiAlertTriangle size={18} />
        <p className="texto-aviso-detail">
          AVISO DE VENCIMIENTO DE CONTRATO ({formatDate(inquilino?.vencimiento)})
        </p>
      </div>
    </div>
  );
};

export default BannerVencimientoContrato;
