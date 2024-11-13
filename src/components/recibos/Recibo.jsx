import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDoc, doc, getFirestore } from "firebase/firestore";


const Recibo = ({ recibos }) => {
    let fecha;
    const [recibosOrdenados, setRecibosOrdenados] = useState([])

    useEffect(() => {
        let sortedList = [...recibos].sort((a, b) => (a.fecha.fecha.seconds < b.fecha.fecha.seconds ? 1 : a.fecha.fecha.seconds > b.fecha.fecha.seconds ? -1 : 0))
        setRecibosOrdenados(sortedList);
    }, [recibos])

    const eliminarRecibo = (id) => {

        const db = getFirestore();
        const docRef = doc(db,"recibos",id);
        deleteDoc(docRef)
    }


    return (
        <>
            <div key={Math.random()} className="contenedor-recibos">
                {recibosOrdenados.map(e => (
                    <div key={e.id}  className="contenedor-recibo">
                        <div className="mostrar-recibo">
                            <div className="div-nombre">
                                <p>{e.apelliodo} {e.nombre} ({e.tipo})</p>
                            </div>
                            <div className="contenido-recibo">
                                <p>Fecha: {new Intl.DateTimeFormat('es-ES',).format(e.fecha.fecha.seconds * 1000)}</p>
                                <div className="div-concepto">
                                    <p>En concepto de: {e.concepto}</p>
                                </div>
                                {
                                    e.concepto == "Alquiler"
                                        ?
                                        (
                                            e.impuestos
                                            ?
                                            <p>Incluye Impuestos</p>
                                            :
                                            <p>No incluye Impuestos</p>
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
                                            <p>Incluye Expensas</p>
                                            :
                                            <p>No incluye Expensas</p>
                                        )
                                        :
                                        ""
                                }
                                <p>Monto: ${e.monto}</p>
                            </div>
                            <div className="text-end p-2">
                                <DeleteIcon onClick={() => eliminarRecibo(e.id)}></DeleteIcon>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Recibo;