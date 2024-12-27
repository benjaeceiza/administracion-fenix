
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Link } from "react-router-dom"
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useState } from 'react';

const FiltroRecibos = ({ filtroRecibos, setFiltroRecibos,setLimite }) => {
    const [personas, setPersonas] = useState([]);
    const [nombre, setNombre] = useState("")

    const cambioTipo = (e) => {
        setLimite(6)
        const db = getFirestore();
        const itemCollection = collection(db, "recibos")


        getDocs(itemCollection).then(Snapshot => {
            let recibos = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));

            if (Snapshot.size > 0) {
                if (e.target.value == "") {
                    setFiltroRecibos(recibos)
                 

                } else {

                    setFiltroRecibos(recibos.filter(recibo => recibo.tipo == e.target.value))
                 
                }
            } else {
                console.error("error")
            }
        })

        if (e.target.value == "") {
            setPersonas([])
        } else {
            const itemCollection2 = collection(db, e.target.value)
            getDocs(itemCollection2).then(Snapshot => {
                let personasPrev = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));

                if (Snapshot.size > 0) {
                    setPersonas(personasPrev)
                } else {
                    console.error("error")
                }
            })
        }


    }

    const cambioNombre = (e) => {
        setLimite(6)
        setNombre(e.target.value)
        const db = getFirestore();
        const itemCollection = collection(db, "recibos")

        getDocs(itemCollection).then(Snapshot => {
            let recibos = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));

            if (Snapshot.size > 0) {
                if (e.target.value == "") {
                    // setFiltroRecibos(recibos)
                } else {

                    setFiltroRecibos(recibos.filter(recibo => recibo.nombre == e.target.value))
                }
            } else {
                console.error("error")
            }
        })
    }

    const cambioMes = (e) => {
        setLimite(6)
        const db = getFirestore();
        const itemCollection = collection(db, "recibos")


        getDocs(itemCollection).then(Snapshot => {

            if (Snapshot.size > 0) {
                let recibos = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                setFiltroRecibos(recibos.filter(recibo => new Date(recibo.fecha.fecha.seconds * 1000).getMonth() == e.target.value))
            } else {
                console.error("error")
            }
        })



    }

    return (
        <>
            <div className="contenedor-filtro-botones-recibos">
                <div className="contenedor-filtro my-3">
                    <div className="mb-3">
                        <select className="form-select" aria-label="Default select example" onChange={cambioTipo}>
                            <option value="">Seleccione Tipo</option>
                            <option value="inquilinos">Inquilino</option>
                            <option value="propietarios">Propietario</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <select className="form-select" aria-label="Default select example" onChange={cambioNombre} >
                            <option value="">Seleccione Nombre</option>
                            {personas.map(persona => (
                                <option key={persona.id} value={persona.apellido + " " + persona.nombre}>{persona.apellido} {persona.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <select className="form-select" aria-label="Default select example" onChange={cambioMes}>
                            <option value="">Seleccione Mes</option>
                            <option value={0}>Enero</option>
                            <option value={1}>Febrero</option>
                            <option value={2}>Marzo</option>
                            <option value={3}>Abril</option>
                            <option value={4}>Mayo</option>
                            <option value={5}>Junio</option>
                            <option value={6}>Julio</option>
                            <option value={7}>Agosto</option>
                            <option value={8}>Septiembre</option>
                            <option value={9}>Octubre</option>
                            <option value={10}>Noviembre</option>
                            <option value={11}>Diciembre</option>
                        </select>
                    </div>

                    <div className="contenedor-buscar-agregar-recibo">
                        <div className="contenedor-boton-agregar-recibo">
                            <Link to={"/recibos"}><AddRoundedIcon className="text-white" ></AddRoundedIcon></Link>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default FiltroRecibos