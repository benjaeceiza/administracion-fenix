import { deleteDoc, doc, getFirestore } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import borrarImagen from "../assets/quitar-usuario.png"
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';


const BotonEliminarInquilino = ({ idprop }) => {
    const navigate = useNavigate();
    const { idInquilino } = useParams();
    const notify = () => toast.success("Inquilino Eliminado con exito!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",

    });



    const MySwal = withReactContent(Swal)

    const alerta = () => {

        Swal.fire({
            title: "Estás seguro?",
            text: "Se borrará definitivamente",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Eliminar"
        }).then((result) => {
            if (result.isConfirmed) {


                eliminarInquilino();
            }
        });
    }


    const eliminarInquilino = () => {
        const db = getFirestore();
        const docRef = doc(db, "inquilinos", idInquilino)

        deleteDoc(docRef).then(

            notify()

        )

        setTimeout(() => {
            navigate("/propietario/" + idprop)
        }, 1500)

    }

    return (

        <>
            <ToastContainer />
            <div onClick={() => alerta()} className="contenedor-boton-eliminar">
                
                <PersonRemoveIcon sx={{ fontSize: 25 }} className="text-white"></PersonRemoveIcon>
            </div>
        </>
    )
}

export default BotonEliminarInquilino;