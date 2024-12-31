import { Link } from "react-router-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const BotonAgregarInqui = (id) => {

    return (
        <>
            <div className="text-end ">
                <Link to={"/agregar/inquilino/" + id.idPropietario}><AddCircleOutlineIcon className="text-black m-2 mouse"></AddCircleOutlineIcon></Link>
            </div>
        </>

    )

}

export default BotonAgregarInqui;