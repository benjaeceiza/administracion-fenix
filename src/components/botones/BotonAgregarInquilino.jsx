
import { Link } from "react-router-dom"

import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';


const BotonAgregarInqulino = () => {

    return (
        <>
            <Link to={"/agregar/inquilino"}><div className="contenedor-boton-agregar my-5">
                <PersonAddRoundedIcon sx={{ fontSize: 25 }} className="text-white"></PersonAddRoundedIcon>
            </div></Link>
        </>

    )

}


export default BotonAgregarInqulino