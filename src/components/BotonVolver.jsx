import { Link } from "react-router-dom"


const BotonVolver = (volver) =>{

    return(
      
        <Link to={volver}><button>Volver</button></Link>
    )
}

export default BotonVolver