

import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import { Link } from "react-router-dom";


const DatosInquilinos = ({ datos }) => {

    let vigencia;
    let vencimiento

    const options = { maximumFractionDigits: 2 }
    const montoFormateado = Intl.NumberFormat("es-ES", options).format(datos.monto);

    vigencia = new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(datos.vigencia.fecha.seconds * 1000);
    vencimiento = new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(datos.vencimiento.fecha.seconds * 1000);


    return (
        <>

            <div className="contenedor-datos">
                <div className="text-end">
                   
                    <Link to={"/editar/inquilino/" + datos.id}><ModeEditOutlineIcon className="mouse" ></ModeEditOutlineIcon></Link>
                </div>
                <div className="row">
                    <div className="datos-inquilino">
                        <div className="datos-1">
                            <label className="label-datos">Teléfono:</label>
                            <p className="parrafo-datos">{datos.telefono}</p>
                            <label className="label-datos">Email:</label>
                            <p className="parrafo-datos">{datos.email}</p>
                            <label className="label-datos">DNI:</label>
                            <p className="parrafo-datos">{datos.dni}</p>
                            <label className="label-datos">Ajuste:</label>
                            <p className="parrafo-datos">{datos.aumento}</p>
                            <label className="label-datos">Proximo Ajuste:</label>
                            <p className="parrafo-datos">{datos.mesAumento}/{datos.añoAumento}</p>
                        </div>
                        <div className="datos-1">
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


        </>

    )

}

export default DatosInquilinos;