import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import FotoNombreInqui from "../FotoNombreInqui";
import DatosInquilinos from "../datos/DatosInquilinos";
import Cargando from "../load/Cargando";
import BotonEliminarInquilino from "../botones/BotonEliminarInquilino";
import Aldia from "../Aldia";
import Pendiente from "../Pendiente";
import CambiarAvatar from "../CambiarAvatar";
import DatosInquilinosMob from "../datos/DatosInquilinosMob";
import AvisoVencimientoDetail from "../vencimiento/AvisoVencimientoDetail";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import RecibosInquilinoDetail from "./RecibosInquilinoDetail";

const InquilinosDetail = () => {

    const { idInquilino } = useParams();
    // Inicializamos como null para diferenciar "cargando" de "vacío"
    const [inquilino, setInquilino] = useState(null); 
    const [cargador, setCargador] = useState(true);
    const [cambiarAvatar, setCambiarAvatar] = useState(false);
    
    // Eliminé el reload manual con window.location, React se encarga de actualizar
    const [reload, setReload] = useState(false); 

    useEffect(() => {
        const db = getFirestore();
        const docRef = doc(db, "inquilinos", idInquilino);

        getDoc(docRef).then(snapShot => {
            if (snapShot.exists()) {
                setInquilino({ id: snapShot.id, ...snapShot.data() });
            } else {
                console.error("El inquilino no existe");
            }
            setCargador(false);
        }).catch(error => {
            console.error("Error obteniendo documento:", error);
            setCargador(false);
        });

    }, [idInquilino, reload]); // Agregué reload a las dependencias para que refresque si cambia la foto

    return (
        <>
            {cargador || !inquilino ? <Cargando /> :
                <div className="contenedor-propietarios-detail">
                    
                    <AvisoVencimientoDetail inquilino={inquilino} />
                    
                    <CambiarAvatar 
                        tipo={"inquilinos"} 
                        cambiarAvatar={cambiarAvatar} 
                        setCambiarAvatar={setCambiarAvatar} 
                        propietario={inquilino} 
                        // Al cambiar el avatar, invertimos reload para disparar el useEffect
                        setReload={() => setReload(!reload)} 
                    />

                    {/* El botón se encarga de borrar y navegar */}
                    <BotonEliminarInquilino idprop={inquilino.idprop} />

                    <div className="contenedor-datos-fotonombre alinear">
                        <div className="col my-5">
                            <div className="contenedor-boton-avatar">
                                 <ModeEditOutlineIcon 
                                    className="cambiar-avatar my-3 mouse" 
                                    onClick={() => setCambiarAvatar(true)}
                                />
                            </div>
                            <FotoNombreInqui inquilino={inquilino} />
                        </div>
                        <div className="col my-5">
                            <DatosInquilinos datos={inquilino} />
                            <DatosInquilinosMob datos={inquilino}/>
                        </div>
                    </div>

                    <div className="contenedor-propiedades-inquilinos">
                        {inquilino.alquiler ? 
                            <Aldia inquilino={inquilino} /> : 
                            <Pendiente inquilino={inquilino} />
                        }
                        <RecibosInquilinoDetail nombre={inquilino.nombre} apellido={inquilino.apellido}/>
                    </div>
                </div>
            }
        </>
    )
}

export default InquilinosDetail;