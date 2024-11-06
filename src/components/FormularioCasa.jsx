import { addDoc, collection, getFirestore } from "firebase/firestore";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const FormularioCasa = () => {

    const { idPropietario } = useParams();
    const [direccion, setDireccion] = useState();
    const [finca, setFinca] = useState();
    const [niz, setNiz] = useState();
    const [gas, setGas] = useState();

    const navigate = useNavigate();

    const control = () => {

        if (direccion == "") {
            alert("ingrese una direccion")
        }

        crearPropiedad();
    }

    const notifySucces = () => toast.success("Propiedad Agregada", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",

    })

    const crearPropiedad = () => {

        const propiedad = {
            direccion: direccion,
            finca: finca,
            nix: niz,
            gas: gas,
            idprop: idPropietario
        }

        const db = getFirestore();
        const orderCollection = collection(db, "propiedades");
        addDoc(orderCollection, propiedad).then(notifySucces())

        setTimeout(() => {

            navigate("/propietario/" + idPropietario)
        }, 1500)

    }

    return (

        <>
            <ToastContainer />
            <div className="container  ">
                <h1 className="text-center my-5">Agregar Propiedad</h1>
                <form action="" className="container formulario">
                    <div className="input-group mb-3">
                        <input type="text" className={"form-control"} placeholder="Dirección" aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { setDireccion(e.target.value) }} />
                    </div>
                    <div className="input-group mb-3">
                        <input type="number" className={"form-control"} placeholder="Número Finca" aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { setFinca(e.target.value) }} />
                    </div>
                    <div className="input-group mb-3">
                        <input type="number" className={"form-control"} placeholder="Número Niz" aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { setNiz(e.target.value) }} />
                    </div>
                    <div className="input-group mb-3">
                        <input type="number" className={"form-control"} placeholder="Número Cuenta Gas" aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { setGas(e.target.value) }} />
                    </div>
                </form>
                <div className="text-center">

                    <button className="btn btn-primary" onClick={control}>Agregar</button>
                </div>
            </div>
        </>
    )
}

export default FormularioCasa;