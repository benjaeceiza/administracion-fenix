import { Link } from "react-router-dom"
import agregarImagen from "../assets/agregar-usuario.png"

const BotonAgregar = () =>{

  return(
   <>
         <Link to ={"/agregar/propietario"}><img className="mouse" height={50} src={agregarImagen} alt="Agregar Propietario"/></Link>
   </>

  )

}


export default BotonAgregar