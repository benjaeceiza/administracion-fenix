import { collection, getDocs, getFirestore } from "firebase/firestore"
import { useEffect, useState } from "react"
import Cargando from "../load/Cargando"
import Recibo from "./Recibo"
import FiltroRecibos from "./FiltroRecibos"

const VerRecibos = () => {

    let recibos;
    const [cargando, setCargando] = useState(true);
    const [tipo, setTipo] = useState("");
    const [filtroRecibos, setFiltroRecibos] = useState([]);
    const [mes, setMes] = useState(0)

    useEffect(() => {

        const db = getFirestore();
        const itemCollection = collection(db, "recibos")

        getDocs(itemCollection).then(Snapshot => {

            if (Snapshot.size > 0) {

                recibos = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                setFiltroRecibos(recibos)
                setCargando(false)

            } else {
                console.error("error")
            }
        })

    }, [])

    return (
        <>
            {cargando
                ?
                <Cargando />
                :
                <div className="container">
                    <FiltroRecibos filtroRecibos={filtroRecibos}  setFiltroRecibos={setFiltroRecibos}/>
                    <Recibo recibos={filtroRecibos} />

                </div>}
        </>
    )
}

export default VerRecibos