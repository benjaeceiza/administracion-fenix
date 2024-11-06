import { Link } from "react-router-dom";
import imagenEditar from "../assets/boton-editar.png"

const DatosMob = ({ datos, id }) => {

    return (
        <>
            <div className="accordion accordion-flush datos-mob" id="accordionFlushExample">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-success text-white" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                            Presione para ver los datos
                        </button>
                    </h2>
                    <div id="flush-collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body borde">
                            <div className=" text-end ">
                                <Link to={"/editar/" + id}><img className="text-end mouse" height={24} src={imagenEditar} alt="editar" /></Link>
                            </div>
                            <div className="row">
                                <div className="col col-datos text-start">
                                    <label className="label-datos">Telefono:</label>
                                    <p className="parrafo-datos">{datos.telefono}</p>
                                    <label className="label-datos">Email:</label>
                                    <p className="parrafo-datos">{datos.email}</p>
                                    <label className="label-datos">Dni/Cuit/Cuil:</label>
                                    <p className="parrafo-datos">{datos.cuit}</p>
                                    <label className="label-datos">Alias/Cbu:</label>
                                    <p className="parrafo-datos">{datos.cbu}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )

}

export default DatosMob;