import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiDownload,
  FiTrash2,
  FiCalendar,
  FiFileText,
  FiEye,
} from "react-icons/fi";
import { deleteRecibo } from "../../services/recibos.service";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { generarReciboPdf } from "../../utils/pdfGenerator";
import { notifySuccess, notifyError } from "../../utils/notify";
import ModalConfirmar from "../common/ModalConfirmar";

const ListaRecibos = ({ recibos, onDeleted, limite }) => {
  const [reciboAEliminar, setReciboAEliminar] = useState(null);
  const navigate = useNavigate();

  const confirmarEliminacion = async () => {
    if (!reciboAEliminar) return;
    try {
      await deleteRecibo(reciboAEliminar.id);
      notifySuccess("Recibo eliminado correctamente");
      if (onDeleted) onDeleted(reciboAEliminar.id);
    } catch (error) {
      console.error("Error al eliminar recibo:", error);
      notifyError("No se pudo eliminar el recibo");
    } finally {
      setReciboAEliminar(null);
    }
  };

  return (
    <>
      {reciboAEliminar && (
        <ModalConfirmar
          onClose={() => setReciboAEliminar(null)}
          onConfirm={confirmarEliminacion}
          titulo="¿Eliminar este comprobante?"
          mensaje={`Se eliminará el comprobante de ${
            reciboAEliminar.nombre
          } por ${formatCurrency(reciboAEliminar.monto)}.`}
        />
      )}

      <div
        tabIndex={0}
        role="region"
        aria-label="Listado de comprobantes y recibos"
        className="table-wrapper"
      >
        <table className="table-fenix tabla-responsive-mobile">
          <thead>
            <tr>
              <th scope="col">Destinatario / Comprobante</th>
              <th scope="col">Tipo</th>
              <th scope="col">Concepto</th>
              <th scope="col">Fecha</th>
              <th scope="col">Importe</th>
              <th scope="col" className="text-end">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {recibos.slice(0, limite).map((e) => {
              const esInquilino = e.tipo === "inquilinos";
              return (
                <tr
                  key={e.id}
                  onClick={() => navigate(`/recibos/detalle/${e.id}`)}
                  className="fila-clicable"
                >
                  <th scope="row" data-label="Destinatario">
                    <div className="user-cell">
                      <div
                        className={`receipt-row-icon ${
                          esInquilino ? "icon-inquilino" : "icon-propietario"
                        }`}
                      >
                        <FiFileText size={18} />
                      </div>
                      <div className="user-cell-info">
                        <span className="user-cell-name">{e.nombre}</span>
                        <span className="user-cell-role tabular-nums">
                          {e.reciboNumero
                            ? `Comprobante #${String(e.reciboNumero).padStart(
                                4,
                                "0"
                              )}`
                            : "Comprobante S/N"}
                        </span>
                      </div>
                    </div>
                  </th>

                  <td data-label="Tipo">
                    <span
                      className={`receipt-type-pill ${
                        esInquilino ? "pill-inquilino" : "pill-propietario"
                      }`}
                    >
                      {esInquilino
                        ? "Cobro • Inquilino"
                        : "Entrega • Propietario"}
                    </span>
                  </td>

                  <td data-label="Concepto">
                    <span className="receipt-row-concept">
                      {e.concepto || "Alquiler"}
                    </span>
                  </td>

                  <td data-label="Fecha" className="tabular-nums text-nowrap">
                    <span className="d-inline-flex align-items-center gap-1 text-muted">
                      <FiCalendar size={14} />
                      {formatDate(e.fecha)}
                    </span>
                  </td>

                  <td
                    data-label="Importe"
                    className="tabular-nums precio-monto text-emerald text-nowrap"
                  >
                    {formatCurrency(e.monto)}
                  </td>

                  <td
                    data-label="Acciones"
                    onClick={(ev) => ev.stopPropagation()}
                  >
                    <div className="actions-cell">
                      <Link
                        to={`/recibos/detalle/${e.id}`}
                        className="action-icon-btn"
                        title="Ver detalle del comprobante"
                      >
                        <FiEye size={17} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => generarReciboPdf(e)}
                        className="action-icon-btn action-receipt"
                        title="Descargar PDF"
                      >
                        <FiDownload size={17} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setReciboAEliminar(e)}
                        className="action-icon-btn action-delete"
                        title="Eliminar comprobante"
                      >
                        <FiTrash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ListaRecibos;
