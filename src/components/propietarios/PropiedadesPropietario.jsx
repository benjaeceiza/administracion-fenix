import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiTrash2, FiHome } from "react-icons/fi";
import {
  getPropiedadesByPropietario,
  deletePropiedad,
} from "../../services/propiedades.service";
import { notifySuccess, notifyError } from "../../utils/notify";
import Cargando from "../common/Cargando";
import ModalConfirmar from "../common/ModalConfirmar";

const PropiedadesPropietario = ({ idPropietario }) => {
  const [propiedades, setPropiedades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [propiedadAEliminar, setPropiedadAEliminar] = useState(null);

  useEffect(() => {
    let activo = true;
    setCargando(true);
    getPropiedadesByPropietario(idPropietario)
      .then((data) => {
        if (activo) setPropiedades(data);
      })
      .catch((err) => console.error("Error cargando propiedades:", err))
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [idPropietario]);

  const confirmarEliminarPropiedad = async () => {
    if (!propiedadAEliminar) return;
    try {
      await deletePropiedad(propiedadAEliminar.id);
      setPropiedades((prev) =>
        prev.filter((p) => p.id !== propiedadAEliminar.id)
      );
      notifySuccess("Propiedad eliminada correctamente");
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
      notifyError("No se pudo eliminar la propiedad");
    } finally {
      setPropiedadAEliminar(null);
    }
  };

  if (cargando) return <Cargando inline texto="Cargando propiedades..." />;

  return (
    <div className="detail-card h-100">
      {propiedadAEliminar && (
        <ModalConfirmar
          onClose={() => setPropiedadAEliminar(null)}
          onConfirm={confirmarEliminarPropiedad}
          titulo="¿Eliminar propiedad?"
          mensaje={`Se eliminará el inmueble ubicado en "${propiedadAEliminar.direccion}".`}
        />
      )}

      <div className="detail-card-header">
        <div className="d-flex align-items-center gap-2">
          <FiHome size={18} className="text-emerald" />
          <h3 className="detail-card-title">Propiedades ({propiedades.length})</h3>
        </div>
        <Link
          to={`/agregar/propiedad/${idPropietario}`}
          className="btn-fenix btn-fenix-primary btn-sm-fenix"
        >
          <FiPlus size={16} />
          <span>Agregar Propiedad</span>
        </Link>
      </div>

      {propiedades.length === 0 ? (
        <div className="empty-inline">
          <FiHome size={28} className="text-muted mb-2" />
          <p className="mb-0 text-muted">Sin propiedades registradas para este propietario.</p>
        </div>
      ) : (
        <div
          tabIndex={0}
          role="region"
          aria-label="Propiedades del propietario"
          className="table-wrapper"
        >
          <table className="table-fenix tabla-responsive-mobile">
            <thead>
              <tr>
                <th scope="col">Dirección</th>
                <th scope="col">N° Finca</th>
                <th scope="col">N° NIS</th>
                <th scope="col">N° Cta Gas</th>
                <th scope="col">N° O.S</th>
                <th scope="col" className="text-end">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {propiedades.map((e) => (
                <tr key={e.id}>
                  <th scope="row" data-label="Dirección" className="fw-semibold">
                    {e.direccion}
                  </th>
                  <td data-label="N° Finca" className="tabular-nums">
                    {e.finca || "-"}
                  </td>
                  <td data-label="N° NIS" className="tabular-nums">
                    {e.nix || "-"}
                  </td>
                  <td data-label="N° Cta Gas" className="tabular-nums">
                    {e.gas || "-"}
                  </td>
                  <td data-label="N° O.S" className="tabular-nums">
                    {e.os || "-"}
                  </td>
                  <td data-label="Acción" className="text-end">
                    <button
                      type="button"
                      onClick={() => setPropiedadAEliminar(e)}
                      className="action-icon-btn action-delete"
                      title="Eliminar propiedad"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PropiedadesPropietario;
