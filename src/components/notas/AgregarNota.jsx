import { addDoc, collection, doc, getFirestore } from "firebase/firestore"
import { useRef, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';


const AgregarNota = () => {

    const [nombre, setNombre] = useState("")
    const [nota, setNota] = useState("")
    const formulario = useRef();

    const notifySuccess = () => toast.success("Nota Enviada", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",

    })



    const guardarNota = () => {

        const nuevaNota = {
            nombre: nombre,
            nota: nota,
            fecha: new Date()
        }

        const db = getFirestore()
        const docRef = collection(db, "notas");
        addDoc(docRef, nuevaNota).then(
          
            notifySuccess(),
            formulario.current.reset()
        )
    }



    return (
        <>
            <ToastContainer />
            <div className="container">
                <div className="row my-5">
                    <div ref={formulario} className="formulario-nota my-5">
                        <div className="label-input">
                            <label className="label-datos">Nombre</label>
                            <input className="input-nombre-nota" type="text" placeholder="Nombre" onInput={(e) => { setNombre(e.target.value) }} />
                        </div>
                        <textarea className="campo-texto" name="text" id="" placeholder=" Cuerpo Nota" onInput={(e) => { setNota(e.target.value) }} />
                        <button className="boton-nota" onClick={guardarNota}>Agregar Nota</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AgregarNota