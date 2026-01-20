import { deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import ModalEliminar from '../modal/ModalEliminar';
import { useState } from 'react';

const BotonEliminarInquilino = ({ idprop }) => {
    
    const navigate = useNavigate();
    const { idInquilino } = useParams();
    const [modalEliminar, setModalEliminar] = useState(false);

    // Configuración de la alerta
    const notify = () => toast.success("Inquilino Eliminado con éxito!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    // Esta es la función que se ejecutará cuando des "Aceptar" en el modal
    const confirmarBorrado = async () => {
        const db = getFirestore();
        const docRef = doc(db, "inquilinos", idInquilino);

        try {
            await deleteDoc(docRef);
            notify();
            
            // Cerramos el modal
            setModalEliminar(false);

            // Redirigimos después de 1.5 seg
            setTimeout(() => {
                navigate("/propietario/" + idprop);
            }, 1500);

        } catch (error) {
            console.error("Error al eliminar:", error);
            toast.error("Error al eliminar el inquilino");
        }
    };

    return (
        <>
            {modalEliminar && (
                <ModalEliminar 
                    setModalEliminar={setModalEliminar} 
                    accionConfirmar={confirmarBorrado} 
                />
            )}
            
            <div onClick={() => setModalEliminar(true)} className="contenedor-boton-eliminar mouse">
                <PersonRemoveIcon sx={{ fontSize: 25 }} className="text-white" />
            </div>
        </>
    );
}

export default BotonEliminarInquilino;