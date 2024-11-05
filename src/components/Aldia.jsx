
import imagenAldia from "../assets/verificado.png"

const Aldia = ({inquilino}) => {
    return (
        <>
            <div key={inquilino.id} className="col my-5">
                <div className="alquiler-al-dia text-center">
                    <p>Esta Al Dia</p>
                    <img src={imagenAldia} alt="" />
                </div>
            </div>
        </>
    )
}

export default Aldia;