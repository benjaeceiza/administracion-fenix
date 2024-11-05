import { collection, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import Cargando from "./Cargando"
import ReseteoAlquileres from "./ReseteoAlquileres";



const Alquileres = () => {

    let inquilinos;

    const [cargando, setCargando] = useState(true);
    const [filtrosAlDia, setFiltrosAlDia] = useState([]);
    const [filtrosPendiente, setFiltroPendiente] = useState([]);
 


    useEffect(() => {
        const db = getFirestore();
        const itemCollection = collection(db, "inquilinos")
    
        getDocs(itemCollection).then(Snapshot => {

            if (Snapshot.size > 0) {

                inquilinos = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                setFiltrosAlDia(inquilinos.filter(e => e.alquiler == true).sort((a, b) => (a.apellido > b.apellido ? 1 : a.apellido < b.apellido ? -1 : 0)));
                setFiltroPendiente(inquilinos.filter(e => e.alquiler == false).sort((a, b) => (a.apellido > b.apellido ? 1 : a.apellido < b.apellido ? -1 : 0)));
                setCargando(false)

            } else {
                console.error("error")
            }
        })
     
     
     
        
    }, [])

  



    return (
        <>
            <div className="container">
                {cargando ? <Cargando /> : <div className="row">
                    <div className="col my-5">
                    <ReseteoAlquileres />
                    <div className="titulo-alquiler-al-dia">
                            <p className="">Alquileres al dia</p>
                        </div>
                        <ul className="list-group lista-alquileres">
                            {filtrosAlDia.map(e => (
                                <li key={Math.random()} className="list-group-item">{e.apellido} {e.nombre}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="col my-5">
                        <div className="titulo-alquiler-pendientes">
                            <p className="">Alquileres Pendientes</p>
                        </div>
                        <ul className="list-group lista-alquileres">

                            {filtrosPendiente.map(e => (
                                <li key={Math.random()} className="list-group-item">{e.apellido} {e.nombre}</li>
                            ))}
                        </ul>
                    </div>
                </div>}
            </div>

        </>
    )
}

export default Alquileres;