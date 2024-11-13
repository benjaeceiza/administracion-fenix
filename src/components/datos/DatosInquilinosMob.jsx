
import imagenEditar from "../../assets/boton-editar.png"
import { Link } from "react-router-dom";

const DatosInquilinosMob = ({datos}) => {

    let vigencia;
    let vencimiento

    const options = { maximumFractionDigits: 2 }
    const montoFormateado = Intl.NumberFormat("es-ES", options).format(datos.monto);

    vigencia = new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(datos.vigencia.fecha.seconds * 1000);
    vencimiento = new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(datos.vencimiento.fecha.seconds * 1000)
    return (
        <>
            <div className="accordion accordion-flush datos-mob" id="accordionFlushExample">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-success text-white" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            Presione para ver los datos
                        </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body borde">
                            <div className="text-end">
                                <Link to={"/editar/inquilino/" + datos.id}><img className="mouse" height={24} src={imagenEditar} alt="" /></Link>
                            </div>
                            <div className="row">
                                <div className="datos-inquilino">
                                    <div className="datos-1 text-start">
                                        <label className="label-datos">Teléfono:</label>
                                        <p className="parrafo-datos">{datos.telefono}</p>
                                        <label className="label-datos">Email:</label>
                                        <p className="parrafo-datos">{datos.email}</p>
                                        <label className="label-datos">DNI:</label>
                                        <p className="parrafo-datos">{datos.dni}</p>
                                        <label className="label-datos">Aumento:</label>
                                        <p className="parrafo-datos">{datos.aumento}</p>
                                    </div>
                                    <div className="datos-1 text-start">
                                        <label className="label-datos">Vigencia:</label>
                                        <p className="parrafo-datos">{vigencia}</p>
                                        <label className="label-datos">Vencimiento:</label>
                                        <p className="parrafo-datos">{vencimiento}</p>
                                        <label className="label-datos">Dirección:</label>
                                        <p className="parrafo-datos">{datos.direccion}</p>
                                        <label className="label-datos">Monto:</label>
                                        <p className="parrafo-datos">${montoFormateado}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DatosInquilinosMob