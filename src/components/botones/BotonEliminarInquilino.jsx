import { deleteDoc, doc, getFirestore } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ModalEliminar from '../modal/ModalEliminar';
import { useEffect, useState } from 'react';


const BotonEliminarInquilino = ({ idprop }) => {
    const navigate = useNavigate();
    const { idInquilino } = useParams();
    const [modalEliminar, setModalEliminar] = useState(false)
    const [eliminar, setEliminar] = useState(false)


    const notify = () => toast.success("Inquilino Eliminado con exito!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",

    });


    useEffect(() => {

        if (eliminar) {
            const db = getFirestore();
            const docRef = doc(db, "inquilinos", idInquilino)

            deleteDoc(docRef).then(

                notify()

            )

            setTimeout(() => {
                navigate("/propietario/" + idprop)
            }, 1500)

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

export default BotonEliminarInquilino;