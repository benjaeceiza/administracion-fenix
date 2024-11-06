
import { useState } from "react"
import avatarHombres from "../json/avatarHombres.json"
import avatarMujeres from "../json/avatarMujeres.json"
import { doc, getFirestore, updateDoc } from "firebase/firestore"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CambiarAvatar = ({ cambiarAvatar, setCambiarAvatar, propietario, setReload, tipo }) => {
    const [seleccionado, setSeleccionado] = useState("")
   
    const avatarSeleccionado = (seleccion) => {
        setSeleccionado(seleccion)

    }

    const notifySucces = () => toast.success("Avatar Cambiado", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",

    })

    const db = getFirestore();
    const cambio = () => {
        const docRef = doc(db, tipo, propietario.id)

        updateDoc(docRef, { imagen: seleccionado }).then(
            setCambiarAvatar(false), notifySucces()
        )

        setTimeout(() => {
            setReload(true)
        }, 1500)


    }

    if (propietario.genero == "Hombre") {
        return (
            <>
                <ToastContainer />
                {cambiarAvatar ? <div className="contenedor-cambiar-avatar">
                    <div className="contenedor-modal">
                        <div className="contenedor-titulo-boton-cerrar-avatar">
                            <p className="titulo-cambiar-avatar">Elija un avatar</p>
                            <button className="boton-cerrar-avatar" onClick={() => setCambiarAvatar(false)}>x</button>
                        </div>
                        <div className="contenedor-avatars">
                            {avatarHombres.map(avatar => (
                                <img key={avatar} onClick={() => avatarSeleccionado(avatar)} className={seleccionado == avatar ? "seleccionado" : "avatar-a-cambiar"} src={avatar} alt="avatar" />
                            ))}
                        </div>
                        <div className="contenedor-boton-cambiar-avatar">
                            <button onClick={cambio}>Cambiar</button>
                        </div>

                    </div>
                </div> : ""}
            </>
        )

    } else {
        if (propietario.genero == "Mujer") {

            return (
                <>
                    <ToastContainer />
                    {cambiarAvatar ? <div className="contenedor-cambiar-avatar">
                        <div className="contenedor-modal">
                            <div className="contenedor-titulo-boton-cerrar-avatar">
                                <p className="titulo-cambiar-avatar">Elija un avatar</p>
                                <button className="boton-cerrar-avatar" onClick={() => setCambiarAvatar(false)}>x</button>
                            </div>
                            <div className="contenedor-avatars">
                                {avatarMujeres.map(avatar => (
                                    <img key={avatar} onClick={() => avatarSeleccionado(avatar)} className={seleccionado == avatar ? "seleccionado" : "avatar-a-cambiar"} src={avatar} alt="avatar" />
                                ))}
                            </div>
                            <div className="contenedor-boton-cambiar-avatar">
                                <button onClick={cambio}>Cambiar</button>
                            </div>

                        </div>
                    </div> : ""}
                </>
            )
        }
    }

}

export default CambiarAvatar;