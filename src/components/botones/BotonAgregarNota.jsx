
import { Link } from "react-router-dom"
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const BotonAgregarNota = () => {

    return (
        <>
            <div className="contenedor-agregar-nota">
                <Link to={"/notas/agregarNota"}><AddRoundedIcon className="text-white" ></AddRoundedIcon></Link>
            </div>
        </>

    )

}


export default BotonAgregarNota