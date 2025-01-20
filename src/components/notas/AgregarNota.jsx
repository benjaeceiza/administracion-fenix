import { addDoc, collection, doc, getFirestore } from "firebase/firestore"
import { useRef, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const AgregarNota = () => {

    const [nombre, setNombre] = useState("")
    const [nota, setNota] = useState("")
    const formulario = useRef();

    const navigate = useNavigate();

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
    const notifyError = (mensaje) => toast.error(mensaje, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",

    })
    
    const control = () => {
       
        if(!nombre) {
            notifyError("Ingresa un nombre")
        }else{
            if(!nota){
                notifyError("Nota vacia")
            }else{
                guardarNota()
            }
        }
    }


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
           
            

        )

        setTimeout(() => {
            navigate("/notas")
        },2000)
    }

    

    return (
        <>
            <ToastContainer />
            <div className="container">
                <div className="row my-5">
                    <div ref={formulario} className="formulario-nota my-5">
                        <div className="label-input">
                            <label className="label-datos">Titulo</label>
                            <input className="input-nombre-nota" type="text" placeholder="Titulo" onInput={(e) => { setNombre(e.target.value) }} />
                        </div>
                        <textarea className="campo-texto" name="text" id="" placeholder=" Cuerpo Nota" onInput={(e) => { setNota(e.target.value) }} />
                        <button className="boton-nota" onClick={control}>Agregar Nota</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AgregarNota