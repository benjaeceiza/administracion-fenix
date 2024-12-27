import { collection, getDocs, getFirestore } from "firebase/firestore"
import { useEffect, useState } from "react"
import Cargando from "../load/Cargando"
import Recibo from "./Recibo"
import FiltroRecibos from "./FiltroRecibos"

const VerRecibos = () => {

    let recibos;
    const [cargando, setCargando] = useState(true);
    const [filtroRecibos, setFiltroRecibos] = useState([]);
    const [recargar,setRecargar] = useState(false)
    const [limite,setLimite] = useState(6)

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

    useEffect(() => {

        if(recargar){
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
            
            setRecargar(false)
        }


    }, [recargar])

    return (
        <>
            {cargando
                ?
                <Cargando />
                :
                <div className="container">
                    <FiltroRecibos filtroRecibos={filtroRecibos}  setFiltroRecibos={setFiltroRecibos} setLimite={setLimite} />

                    {filtroRecibos.length == 0 
                    ?
                    <h3 className="text-center my-5">NO SE ENCONTRARON RESULTADOS</h3>
                    :
                    <div>
                        <Recibo recibos={filtroRecibos} setRecargar={setRecargar} limite={limite}/>
                        {limite >= filtroRecibos.length ? "" : <p className='ver-mas' onClick={() => setLimite(limite + 3)}>Ver Mas</p>}
                    </div>
                     
                     }

                </div>}
        </>
    )
}

export default VerRecibos