

import { Link } from "react-router-dom"


const Propietarios = ({ propietario }) => {
    return (
        <>
            {propietario.map(propietario => (
                <Link style={{textDecoration:"none"}} to={"/propietario/" + propietario.id} key={propietario.id}><div  className="col-3 my-5 ancho opacidad">
                    <img src={propietario.imagen} alt="" />
                    <div className="nombre fondo-nombre">
                        <p className="my-3 nombre"> {propietario.apellido} {propietario.nombre}</p>
                    </div>
                </div></Link>

            ))}

        </>
    )
}

export default Propietarios;