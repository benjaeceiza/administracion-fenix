
import imagenPendiente from "../assets/cerrar.png"

const Pendiente = ({inquilino}) => {
    return (
        <>
            <div key={inquilino.id} className="col my-5">
                <div className="alquiler-no-al-dia text-center">
                    <p>Pago Pendiente</p>
                    <img src={imagenPendiente} alt="" />
                </div>
            </div>
        </>
    )
}

export default Pendiente;