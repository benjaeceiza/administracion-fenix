import { addDoc, collection, doc, getFirestore } from "firebase/firestore"
import { useState } from "react"


const AgregarNota = () => {

    const [nombre, setNombre] = useState("")
    const [nota, setNota] = useState("")


    const guardarNota = () => {

        const nuevaNota = {
            nombre:nombre,
            nota:nota,
            fecha: new Date()
        }
      
        const db = getFirestore()
        const docRef = collection(db,"notas");
        addDoc(docRef,nuevaNota)
    }

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="formulario-nota">
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