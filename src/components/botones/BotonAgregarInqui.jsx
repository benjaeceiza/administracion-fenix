import { Link } from "react-router-dom";
import logoMas from "../../assets/mas.png"

const BotonAgregarInqui = (id) => {

    return (
        <>
            <div className="contenedor-botones text-end">
                <Link to={"/agregar/inquilino/" + id.idPropietario}>< img height={25} src={logoMas} alt="agregar inquilino" className="my-2 mouse " /></Link>
            </div>
        </>

    )

}

export default BotonAgregarInqui;