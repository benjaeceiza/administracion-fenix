import { Link } from "react-router-dom"
import agregarImagen from "../assets/agregar-usuario.png"
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';

const BotonAgregar = () => {

  return (
    <>
      <div className="contenedor-boton-agregar">
        <Link to={"/agregar/propietario"}><PersonAddRoundedIcon className="text-white"></PersonAddRoundedIcon></Link>
      </div>
    </>

  )

}


export default BotonAgregar