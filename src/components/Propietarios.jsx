

import { Link } from "react-router-dom"
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';


const Propietarios = ({ propietario }) => {
    return (
        <>
            {propietario.map(propietario => (
                <div key={propietario.id} className="col-3 my-5 ancho opacidad">
                    <div className="contenedor-icono-listado">
                        <Link to={"/recibos/propietario/"+propietario.id}> <ReceiptLongIcon className="mouse"></ReceiptLongIcon></Link>
                    </div>
                    <Link style={{ textDecoration: "none" }} to={"/propietario/" + propietario.id} ><img src={propietario.imagen} alt="" />
                        <div className="nombre fondo-nombre">
                            <p className="my-3 nombre"> {propietario.apellido} {propietario.nombre}</p>
                        </div></Link>
                </div>

            ))}

        </>
    )
}

export default Propietarios;