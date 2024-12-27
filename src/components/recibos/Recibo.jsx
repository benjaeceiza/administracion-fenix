import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import ModalEliminar from "../modal/ModalEliminar";


const Recibo = ({ recibos, setRecargar, limite }) => {
    let fecha;
    const [recibosOrdenados, setRecibosOrdenados] = useState([])
    const [modalEliminar, setModalEliminar] = useState(false)
    const [reciboSeleccionado, setReciboSeleccionado] = useState("")
    const [eliminar, setEliminar] = useState(false)


    useEffect(() => {
        let sortedList = [...recibos].sort((a, b) => (a.fecha.fecha.seconds < b.fecha.fecha.seconds ? 1 : a.fecha.fecha.seconds > b.fecha.fecha.seconds ? -1 : 0))
        setRecibosOrdenados(sortedList);
    }, [recibos])

    useEffect(() => {

        if (eliminar) {
            const db = getFirestore();
            const docRef = doc(db, "recibos", reciboSeleccionado);
            deleteDoc(docRef).then(
                setEliminar(false),
                setRecargar(true)
            )
        }
    }, [eliminar])

    const controlEliminarRecibo = (id) => {
        setModalEliminar(true)
        setReciboSeleccionado(id)

    }


    return (
        <>
            {modalEliminar
                ?
                <ModalEliminar setModalEliminar={setModalEliminar} setEliminar={setEliminar} />
                :
                ""
            }
            <div key={Math.random()} className="contenedor-recibos">
                {recibosOrdenados.slice(0, limite).map(e => (
                    <div key={e.id} className="contenedor-recibo">
                        <div className="mostrar-recibo">
                            <div className="div-nombre">
                                <p>{e.apelliodo} {e.nombre} ({e.tipo})</p>
                            </div>
                            <div className="contenido-recibo ">
                                <label className="label-datos">En concepto de:</label>
                                <div className="div-concepto input-nombre-nota">
                                    <p>{e.concepto}</p>
                                </div>
                                {
                                    e.concepto == "Alquiler"
                                        ?
                                        (
                                            e.impuestos
                                                ?
                                                <p className="my-0">Incluye Impuestos: <b>Si</b></p>
                                                :
                                                <p className="my-0">Incluye Impuestos: <b>No</b></p>
                                        )
                                        :
                                        ""
                                }
                                {
                                    e.concepto == "Alquiler"
                                        ?
                                        (
                                            e.expensas
                                                ?
                                                <p className="my-0">Incluye Expensas: <b>Si</b></p>
                                                :
                                                <p className="my-0">Incluye Expensas: <b>No</b></p>
                                        )
                                        :
                                        ""
                                }
                                <p>Monto: <b>${e.monto}</b> </p>
                            </div>
                            <div className="contenedor-fecha-eliminar">
                                <p> {new Intl.DateTimeFormat('es-ES',).format(e.fecha.fecha.seconds * 1000)}</p>
                                <DeleteIcon cursor={"pointer"} onClick={() => controlEliminarRecibo(e.id)}></DeleteIcon>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Recibo;