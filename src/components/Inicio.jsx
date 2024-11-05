import logo from "../assets/logo.jpg"
import ReseteoAlquileres from "./ReseteoAlquileres"

const Inicio = () => {
   
    return (
        <>
      
            <div className="container">
                <div className="row my-5">
                    <div className="col text-center my-5">
                        <img className="logo-inicio" src={logo} alt="" />
                        <h1>Administración Fenix Propiedades</h1>

                    </div>
                </div>
            </div>

        </>
    )
}

export default Inicio