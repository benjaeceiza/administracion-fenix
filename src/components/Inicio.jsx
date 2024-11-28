import logo from "../assets/logo.jpg"


const Inicio = () => {
   
    return (
        <>
      
            <div className="container">
                <div className="contenedor-inicio">
                    <div className="inicio">
                        <img className="logo-inicio" src={logo} alt="" />
                        <h1 className="my-5">Administración Fenix Propiedades</h1>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Inicio