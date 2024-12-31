import { collection, getDocs, getFirestore, limit, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"





const RecibosInquilinoDetail = ({ nombre, apellido }) => {

    const [recibos, setRecibos] = useState([])

    useEffect(() => {
        const db = getFirestore();
        const q = query(
            collection(db, "recibos"),
            where("concepto", "==", "Alquiler"),
            where("nombre", "==", (apellido) + " " + (nombre)),

        )

        getDocs(q).then(Snapshot => {

            if (Snapshot.size >= 0) {

                const propiedadesPrev = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                let sortedList = [...propiedadesPrev].sort((a, b) => (a.fecha.fecha.seconds < b.fecha.fecha.seconds ? 1 : a.fecha.fecha.seconds > b.fecha.fecha.seconds ? -1 : 0))
                setRecibos(sortedList.slice(0, 3));


            } else {
                console.error("error")
            }


        })

    }, [])

    return (
        <>
            {
                recibos.length == 0
                    ?
                    <div className="col my-5">
                        <div className="pagos">
                            <h5 className="no-recibos">NO HAY RECIBOS</h5>
                        </div>
                    </div>
                    :
                    <div className="col my-5">
                        <div className="pagos">
                            {recibos.map(inquilino => (
                                <div key={inquilino.id} className="contenedor-pagos-detail">
                                    <p className="recibo-detail-titulo">{inquilino.concepto}</p>
                                    <p>${inquilino.monto}</p>
                                    <p className="recibo-detail-fecha">{new Intl.DateTimeFormat('es-ES',).format(inquilino.fecha.fecha.seconds * 1000)}</p>
                                </div>

                            ))}
                        </div>
                    </div>
            }
        </>
    )
}

export default RecibosInquilinoDetail