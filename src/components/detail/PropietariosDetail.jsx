import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Datos from "../datos/Datos";
import FotoNombreProp from "../FotoNombreProp"
import Inquilinos from "../Inquilinos"
import BotonEliminar from "../botones/BotonEliminar";
import { collection, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import Cargando from "../load/Cargando"
import Propiedades from "../Propiedades";
import BotonAgregarInqui from "../botones/BotonAgregarInqui";
import CambiarAvatar from "../CambiarAvatar";
import DatosMob from "../datos/DatosMob";
import PropiedadesMob from "../PropiedadesMob";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';




const PropietariosDetail = () => {

    const { id } = useParams();
    const [propietario, setPropietarios] = useState([]);
    const [cargador, setCargador] = useState(true);
    let inquilinos;
    const [inquilinosAgrupado, setInquilinosAgrupado] = useState([])
    const [cambiarAvatar,setCambiarAvatar] = useState(false)
    const [reload,setReload] = useState(false)




    useEffect(() => {

        const db = getFirestore();
        const docRef = doc(db, "propietarios", id);
        const docRef2 = collection(db, "inquilinos")

        getDoc(docRef).then(snapShot => {
            if (snapShot.exists()) {

                setPropietarios({ id: snapShot.id, ...snapShot.data() });
                setCargador(false)

            } else {
                console.error("error")
            }

        })


        getDocs(docRef2).then(Snapshot => {

            if (Snapshot.size > 0) {

                inquilinos = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                setInquilinosAgrupado(inquilinos.filter(e => e.idprop == id));
                setCargador(false)
            } else {
                console.error("error")
            }
        })



    }, [id])

    if (reload){
        window.location.reload(true)
    }



    return (
        <>
            {cargador ? <Cargando /> :
                <div className=" contenedor-propietario-detail">
                        
                    <CambiarAvatar tipo={"propietarios"} cambiarAvatar={cambiarAvatar} setCambiarAvatar={setCambiarAvatar} propietario={propietario} setReload={setReload}/>
                    <BotonEliminar propietario={id} inquilinos={inquilinosAgrupado} />
                    <div className="contenedor-datos-fotonombre">
                        <div className="col my-5">
                            <div className="contenedor-boton-avatar">
                                <ModeEditOutlineIcon className="cambiar-avatar my-3" onClick={() => setCambiarAvatar(true)}></ModeEditOutlineIcon>
                            </div>
                            <FotoNombreProp propietario={propietario}/>
                        </div>
                        <div className="col my-5">
                            <Datos datos={propietario} id={id} />
                            <DatosMob datos={propietario} id={id}/>
                        </div>
                    </div>
                    <div className="contenedor-propiedades-inquilinos">
                        <div className="col my-5">
                            <Propiedades idPropietario={id}/>
                            <PropiedadesMob idPropietario={id}/>
                        </div>
                        <div className="col my-5">
                            <BotonAgregarInqui idPropietario={id} />
                            <Inquilinos idPropietario={id} />
                        </div>
                    </div>

                </div>}

        </>
    )
}

export default PropietariosDetail