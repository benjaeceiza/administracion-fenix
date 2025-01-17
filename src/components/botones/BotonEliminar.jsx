

import { getFirestore, doc, deleteDoc } from "firebase/firestore"
import {  toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ModalEliminar from "../modal/ModalEliminar";
import { useEffect, useState } from "react";




const notify = () => toast.success("Propietario Eliminado con exito!", {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",

});




const BotonEliminar = ({ propietario, inquilinos }) => {

    const navigate = useNavigate()
    const [modalEliminar, setModalEliminar] = useState(false)
    const [eliminar, setEliminar] = useState(false)


    useEffect(() => {
        if (eliminar) {
            const db = getFirestore();
            const docRef = doc(db, "propietarios", propietario)

            deleteDoc(docRef).then(

                notify()
            )

            inquilinos.map(e => {

                const docRef2 = doc(db, "inquilinos", e.id)
                deleteDoc(docRef2)

            })

            setTimeout(() => {
                navigate("/propietarios")
            }, 2000)
            setEliminar(false)
        }
        
    }, [eliminar])

    


    return (
        <>
            {modalEliminar
                ?
                <ModalEliminar setModalEliminar={setModalEliminar} setEliminar={setEliminar} />
                :
                ""
            }
            <div onClick={() => setModalEliminar(true)} className="contenedor-boton-eliminar">
                <PersonRemoveIcon sx={{ fontSize: 25 }} className="text-white"></PersonRemoveIcon>
            </div>
        </>
    )
}

export default BotonEliminar