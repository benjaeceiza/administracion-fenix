import { collection, deleteDoc, doc, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import tacho from "../assets/eliminar.png"
import CargandoInquilinos from "./load/CargandoInquilinos";
import ModalEliminar from "./modal/ModalEliminar";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { ToastContainer, toast } from 'react-toastify';


const Propiedades = ({ idPropietario }) => {

    let propiedades;
    const [filtroPropiedades, setFiltroPropiedades] = useState([]);
    const { id } = useParams()
    const [cargador, setCargador] = useState(true);
    const [modalEliminar, setModalEliminar] = useState(false)
    const [propiedadSeleccionada, setPropiedadSeleccionada] = useState("")
    const [eliminar, setEliminar] = useState(false)
    const [recargar, setRecargar] = useState(false)


    const notifySucces = () => toast.success("Propiedad Eliminada", {
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
        const itemCollection = collection(db, "propiedades");


        getDocs(itemCollection).then(Snapshot => {

            if (Snapshot.size >= 0) {

                propiedades = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                setFiltroPropiedades(propiedades.filter(e => e.idprop == id));
                setCargador(false)

            } else {
                console.error("error")
            }


        })



    }, [])

    useEffect(() => {

        if (recargar) {

            const db = getFirestore();
            const itemCollection = collection(db, "propiedades");


            getDocs(itemCollection).then(Snapshot => {

                if (Snapshot.size >= 0) {

                    propiedades = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                    setFiltroPropiedades(propiedades.filter(e => e.idprop == id));
                    setCargador(false)

                } else {
                    console.error("error")
                }


            })
            setRecargar(false)
        }




    }, [recargar])

    useEffect(() => {

        if (eliminar) {
            const db = getFirestore();
            const docRef = doc(db, "propiedades", propiedadSeleccionada);

            deleteDoc(docRef).then(
                notifySucces(),
                setEliminar(false),
                setRecargar(true)
            )
        }

    }, [eliminar])


    const controlEliminarPropiedad = (id) => {
        setModalEliminar(true)
        setPropiedadSeleccionada(id)
    }






    if (filtroPropiedades.length == 0) {

        return (
            <>
                {cargador ? <CargandoInquilinos /> : <div className="contenedor-propiedades text-center">
                    <div className="text-end">
                        <Link to={"/agregar/propiedad/" + idPropietario}><AddCircleOutlineIcon className="text-black m-2 mouse"></AddCircleOutlineIcon></Link>
                    </div>
                    <h5 className="mb-5"> SIN PROPIEDADES CARGADAS</h5>
                </div>}
            </>
        )
    } else {

        return (
            <>
                {modalEliminar
                    ?
                    <ModalEliminar setModalEliminar={setModalEliminar} setEliminar={setEliminar} />
                    :
                    ""
                }
                {cargador ? <CargandoInquilinos /> :
                    <div className="contenedor-propiedades text-center ">
                        <div className="text-end">
                            <Link to={"/agregar/propiedad/" + idPropietario}><AddCircleOutlineIcon className="text-black m-2 mouse"></AddCircleOutlineIcon></Link>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Dirrección</th>
                                    <th scope="col">N° Finca</th>
                                    <th scope="col">N° Nis</th>
                                    <th scope="col">N° Cta Gas</th>
                                </tr>
                            </thead>
                            <tbody>

                                {filtroPropiedades.map(e => (
                                    <tr key={e.id}>
                                        <td>{e.direccion}</td>
                                        <td>{e.finca}</td>
                                        <td>{e.nix}</td>
                                        <td>{e.gas}</td>
                                        <td onClick={() => controlEliminarPropiedad(e.id)}><img height={20} src={tacho} alt="Eliminar" className="mouse" /></td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>}
            </>
        )
    }




}

export default Propiedades