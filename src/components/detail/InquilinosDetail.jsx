
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import FotoNombreInqui from "../FotoNombreInqui";
import DatosInquilinos from "../datos/DatosInquilinos";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import Cargando from "../load/Cargando";
import BotonEliminarInquilino from "../botones/BotonEliminarInquilino";
import Aldia from "../Aldia";
import Pendiente from "../Pendiente";
import CambiarAvatar from "../CambiarAvatar";
import DatosInquilinosMob from "../datos/DatosInquilinosMob";
import AvisoVencimientoDetail from "../vencimiento/AvisoVencimientoDetail";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';




const InquilinosDetail = () => {

    const { idInquilino } = useParams();
    const [inquilino, setInquilino] = useState([]);
    const [cargador, setCargador] = useState(true);
    const [cambiarAvatar,setCambiarAvatar] = useState(false);
    const [reload,setReload] = useState(false);




    useEffect(() => {

        const db = getFirestore();
        const docRef = doc(db, "inquilinos", idInquilino);

        getDoc(docRef).then(snapShot => {
            if (snapShot.exists()) {

                setInquilino({ id: snapShot.id, ...snapShot.data() });
                setCargador(false)

            } else {
                console.error("error")
            }

        })

   

    }, [idInquilino])


    if (reload){
        window.location.reload(true)
    }



    return (
        <>
            {cargador ? <Cargando /> :
                <div className="contenedor-propietarios-detail">
                    <AvisoVencimientoDetail inquilino={inquilino} />
                    <CambiarAvatar tipo={"inquilinos"} cambiarAvatar={cambiarAvatar} setCambiarAvatar={setCambiarAvatar} propietario={inquilino} setReload={setReload}/>
                    <BotonEliminarInquilino idprop={inquilino.idprop} />
                    <div className="contenedor-datos-fotonombre alinear">
                        <div className="col my-5">
                            <div className="contenedor-boton-avatar">
                                 <ModeEditOutlineIcon className="cambiar-avatar my-3 mouse" onClick={() => setCambiarAvatar(true)}></ModeEditOutlineIcon>
                            </div>
                            <FotoNombreInqui inquilino={inquilino} />
                        </div>
                        <div className="col my-5">
                            <DatosInquilinos datos={inquilino} />
                            <DatosInquilinosMob datos={inquilino}/>
                        </div>
                    </div>
                    <div className="contenedor-propiedades-inquilinos">
                        {inquilino.alquiler ? <Aldia inquilino={inquilino} /> : <Pendiente inquilino={inquilino} />}
                        <div className="col my-5">
                            <div className="pagos">
                                <h3 className="text-center my-4">Recibos De inqulino</h3>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )

}

export default InquilinosDetail
