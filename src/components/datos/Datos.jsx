
import { Link } from "react-router-dom"
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

const Datos = ({ datos, id }) => {


    return (
        <>
            
            <div className="container contenedor-datos">
                <div className=" text-end ">
                    <Link to={"/editar/" + id}><ModeEditOutlineIcon className="text-end mouse"></ModeEditOutlineIcon></Link>
                </div>
                <div className="row">
                    <div className="col col-datos ">
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
        </>

    )

}

export default Datos;