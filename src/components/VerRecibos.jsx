import { collection, getDocs, getFirestore } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Cargando from "./Cargando"
import Recibo from "./Recibo"


const VerRecibos = () => {

    let recibos;
    const [cargando, setCargando] = useState(true);
    const [personas, setPersonas] = useState([]);
    const [tipo, setTipo] = useState("");
    const [filtroRecibos, setFiltroRecibos] = useState([]);
    const [nombre, setNombre] = useState("");
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




    const cambioTipo = (e) => {

        setTipo(e.target.value)
        const db = getFirestore();
        const itemCollection = collection(db, e.target.value)

        getDocs(itemCollection).then(Snapshot => {

            if (Snapshot.size > 0) {

                setPersonas(Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() })));
            } else {
                console.error("error")
            }
        })


    }

    const cambioNombre = (e) => {
        setNombre(e.target.value)
    }

    const mostrar = () => {


        if ((tipo == "inquilinos" && nombre == "")) {
            const db = getFirestore();
            const itemCollection = collection(db, "recibos")

            getDocs(itemCollection).then(Snapshot => {

                if (Snapshot.size > 0) {

                    recibos = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                    setFiltroRecibos(recibos.filter(persona => persona.tipo == tipo));
                } else {
                    console.error("error")
                }
            })
        } else {
            if ((tipo == "propietarios" && nombre == "")) {
                const db = getFirestore();
                const itemCollection = collection(db, "recibos")

                getDocs(itemCollection).then(Snapshot => {

                    if (Snapshot.size > 0) {

                        recibos = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                        setFiltroRecibos(recibos.filter(persona => persona.tipo == tipo));
                    } else {
                        console.error("error")
                    }
                })
            } else {
                if ((tipo == "propietarios")) {

                    const db = getFirestore();
                    const itemCollection = collection(db, "recibos")

                    getDocs(itemCollection).then(Snapshot => {

                        if (Snapshot.size > 0) {

                            recibos = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                            setFiltroRecibos(recibos.filter(persona => persona.nombre == nombre));
                        } else {
                            console.error("error")
                        }
                    })
                } else {
                    if ((tipo == "inquilinos")) {

                        const db = getFirestore();
                        const itemCollection = collection(db, "recibos")

                        getDocs(itemCollection).then(Snapshot => {

                            if (Snapshot.size > 0) {

                                recibos = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                                setFiltroRecibos(recibos.filter(persona => persona.nombre == nombre));
                            } else {
                                console.error("error")
                            }
                        })
                    }


                }

            }

        }
        setNombre("")

    }
    return (
        <>
            {cargando ? <Cargando /> : <div className="container">
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
                            <select className="form-select" aria-label="Default select example">
                                <option value="">Seleccione Mes</option>
                                <option value="Enero">Enero</option>
                                <option value="Febrero">Febrero</option>
                                <option value="Marzo">Marzo</option>
                                <option value="Abril">Abril</option>
                                <option value="Mayo">Mayo</option>
                                <option value="Junio">Junio</option>
                                <option value="Julio">Julio</option>
                                <option value="Agosto">Agosto</option>
                                <option value="Septiembre">Septiembre</option>
                                <option value="Octubre">Octubre</option>
                                <option value="Noviembre">Noviembre</option>
                                <option value="Diciembre">Diciembre</option>
                            </select>
                        </div>

                        <button className="boton-buscar-recibos" onClick={mostrar}><img src="/src/assets/lupa.png" alt="" /></button>
                    </div>
                    <div>
                        <Link to={"/recibos"}>< img height={25} src="/src/assets/mas.png" alt="Agregar Recibo" /></Link>
                    </div>
                </div>
                <div className="column">
                    <Recibo recibos={filtroRecibos} />
                </div>
            </div>}
        </>
    )
}

export default VerRecibos