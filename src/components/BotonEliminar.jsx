

import { getFirestore, doc, deleteDoc } from "firebase/firestore"
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
<link rel="stylesheet" href="@sweetalert2/theme-bulma/bulma.css"></link>

import PersonRemoveIcon from '@mui/icons-material/PersonRemove';




const notify = () => toast.success("Propietario Eliminado con exito!", {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "colored",

});




const BotonEliminar = ({ propietario, inquilinos }) => {
  
    const navigate = useNavigate()
    const MySwal = withReactContent(Swal);
  

    const alerta = () => {

        Swal.fire({
            title: "Estás seguro?",
            text: "Se borrará definitivamente, incluyendo inquilinos",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "#d33",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Eliminar",


        }).then((result) => {
            if (result.isConfirmed) {

                eliminarPropietario();
            }
        });
    }


    const eliminarPropietario = () => {


        const db = getFirestore();
        const docRef = doc(db, "propietarios", propietario)

        deleteDoc(docRef).then(

            notify()
        )

        inquilinos.map(e => {

            const docRef2 = doc(db, "inquilinos", e.id)
            deleteDoc(docRef2)
          
        })

     setTimeout(() =>{
        navigate("/propietarios")
     },2000)
    } 

   

    return (
        <>
            <ToastContainer />
            <div onClick={() => alerta()} className="contenedor-boton-eliminar">
                <PersonRemoveIcon  sx={{ fontSize: 25 }}className="text-white"></PersonRemoveIcon>
            </div>
        </>
    )
}

export default BotonEliminar