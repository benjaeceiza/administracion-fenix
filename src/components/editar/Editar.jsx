import { useEffect, useState } from "react"
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cargando from "../load/Cargando";




const Editar = () => {

    const [propietario, setPropietario] = useState([]);
    const [cargador, setCargador] = useState(true);
    const { id } = useParams()
    const navigate = useNavigate();
    let nombre = "";
    let apellido = "";
    let telefono = "";
    let email = "";
    let cbu = "";
    let cuit = "";



    const notifySucces = () => toast.success("Propietario Editado!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",

    })



    useEffect(() => {

        const db = getFirestore();
        const docRef = doc(db, "propietarios", id);

        getDoc(docRef).then(snapShot => {
            if (snapShot.exists()) {

                setPropietario({ id: snapShot.id, ...snapShot.data() });
                setCargador(false)


            } else {
                console.error("error")
            }

        })

    }, [])




    const control = () => {


        if (nombre == "") {

            nombre = propietario.nombre
        }

        if (apellido == "") {

            apellido = propietario.apellido
        }


        if (telefono == "") {
            telefono = propietario.telefono
        }
        if (email == "") {
            email = propietario.email
        }
        if (cuit == "") {
            cuit = propietario.cuit
        }
        if (cbu == "") {
            cbu = propietario.cbu

        }

        crear()





    }



    const crear = () => {

        const prop = {
            nombre: nombre.at(0).toUpperCase() + nombre.slice(1).toLowerCase(),
            apellido: apellido.at(0).toUpperCase() + apellido.slice(1).toLowerCase(),
            telefono: telefono,
            email: email,
            cuit: cuit,
            cbu: cbu
        }



        const db = getFirestore();
        const docRef = doc(db, "propietarios", id)
        updateDoc(docRef, prop).then(
            notifySucces()
        )
        setTimeout(() => {
            navigate("/propietario/" + propietario.id)
        }, 1500)


    }




    return (
        <>
            <ToastContainer />
            {cargador ? <Cargando /> : <div className="container formulario my-5">
                <div className="row">
                    <div className="col">
                        <form className="">
                            <div className="mb-3">
                                <label className="label-datos">Nombre:</label>
                                <input type="text" className="form-control input-editar input-nombre-nota" placeholder={propietario.nombre} aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { nombre = (e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Apellido:</label>
                                <input type="text" className="form-control input-nombre-nota" placeholder={propietario.apellido} aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { apellido = (e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Teléfono:</label>
                                <input type="number" className="form-control input-nombre-nota" placeholder={propietario.telefono} aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { telefono = (e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Email:</label>
                                <input type="email" className="form-control input-nombre-nota" placeholder={propietario.email} aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { email = (e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Dni/Cuit/Cuil:</label>
                                <input type="number" className="form-control input-nombre-nota" placeholder={propietario.cuit} aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { cuit = (e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Alias/Cbu:</label>
                                <input type="text" className="form-control input-nombre-nota" placeholder={propietario.cbu} aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { cbu = (e.target.value) }} />
                            </div>
                        </form>
                        <div className="text-center">
                            <button onClick={() => control()} className="boton-nota">Finalizar</button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Editar