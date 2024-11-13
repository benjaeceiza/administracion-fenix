import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Cargando from "../load/Cargando";



const Buscados = () => {

    const { nombreBuscado } = useParams()
    let arrayProp = [];
    let arrayInqui = [];
    const [buscados, setBuscados] = useState([]);
    const [buscadosInqui, setBuscadosInqui] = useState([]);
    const [cargador, setCargador] = useState(true);
    const [existe, setExiste] = useState(false);
    const [existe2, setExiste2] = useState(false);

    useEffect(() => {

        setTimeout(() => {
            setBuscados([])
            setBuscadosInqui([])
            setCargador(true)
        }, 1)

        const db = getFirestore();
        const itemCollection = collection(db, "propietarios");
        const itemCollection2 = collection(db, "inquilinos");


        getDocs(itemCollection).then(Snapshot => {

            if (Snapshot.size > 0) {
                arrayProp = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                if (arrayProp.some(e => (e.apellido.toUpperCase() + " " + e.nombre.toUpperCase()) == nombreBuscado.toUpperCase())) {

                    setBuscados(arrayProp.filter(e => (e.apellido.toUpperCase() + " " + e.nombre.toUpperCase()) == nombreBuscado.toUpperCase()))
                    setExiste(false)
                } else {
                    if (arrayProp.some(e => (e.nombre.toUpperCase() + " " + e.apellido.toUpperCase()) == (nombreBuscado.toUpperCase()))) {
          
                        setBuscados(arrayProp.filter(e => (e.nombre.toUpperCase() + " " + e.apellido.toUpperCase()) == nombreBuscado.toUpperCase()))
                        setExiste(false)
                    } else {
                        if (arrayProp.some(e => e.apellido.toUpperCase() == nombreBuscado.toUpperCase())) {
          
                            setBuscados(arrayProp.filter(e => e.apellido.toUpperCase() == nombreBuscado.toUpperCase()))
                            setExiste(false)
          
                        } else {
          
                            if (arrayProp.some(e => e.nombre.toUpperCase() == nombreBuscado.toUpperCase())) {
          
                                setBuscados(arrayProp.filter(e => e.nombre.toUpperCase() == nombreBuscado.toUpperCase()))
                                setExiste(false)
          
                            } else {
                                setExiste(true)
                            }
                        }
          
                    }
                }
                
            } else {
                console.error("error")
            }
        })

        getDocs(itemCollection2).then(Snapshot => {

            if (Snapshot.size > 0) {
                arrayInqui = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                if (arrayInqui.some(e => (e.apellido.toUpperCase() + " " + e.nombre.toUpperCase()) == nombreBuscado.toUpperCase())) {

                    setBuscadosInqui(arrayInqui.filter(e => (e.apellido.toUpperCase() + " " + e.nombre.toUpperCase()) == nombreBuscado.toUpperCase()))
                    setExiste2(false)
                } else {
                    if (arrayInqui.some(e => (e.nombre.toUpperCase() + " " + e.apellido.toUpperCase()) == nombreBuscado.toUpperCase())) {
          
                        setBuscadosInqui(arrayInqui.filter(e => (e.nombre.toUpperCase() + " " + e.apellido.toUpperCase()) == nombreBuscado.toUpperCase()))
                        setExiste2(false)
                    } else {
                        if (arrayInqui.some(e => e.apellido.toUpperCase() == nombreBuscado.toUpperCase())) {
          
                            setBuscadosInqui(arrayInqui.filter(e => e.apellido.toUpperCase() == nombreBuscado.toUpperCase()))
                            setExiste2(false)
          
                        } else {
          
                            if (arrayInqui.some(e => e.nombre.toUpperCase() == nombreBuscado.toUpperCase())) {
          
                                setBuscadosInqui(arrayInqui.filter(e => e.nombre.toUpperCase() == nombreBuscado.toUpperCase()))
                                setExiste2(false)
          
                            } else {
                                setExiste2(true)
          
                            }
                        }
          
                    }
                }
               
            } else {
                console.error("error")
            }
        })
        
   
    }, [nombreBuscado])

    setTimeout(() =>{
        setCargador(false)
    },2000)
    

  

    if (existe && existe2) {

        return (
            <>
                {cargador ? <Cargando /> : <h1 className="text-center my-5">No existe usuario</h1>}
            </>

        )

    } else {
        return (
            <>
                {cargador ? <Cargando /> :
                    <div className="container">
                        <h1 className="text-center my-5">Resultados de: {nombreBuscado}</h1>
                        <div className="row">
                            {buscados.map(e => (
                                <div key={e.id} className={existe ? "" : "col my-5"}>
                                    <div  className="mg ancho text-center opacidad">
                                        <Link to={"/propietario/" + e.id}><img src={e.imagen} alt="" /></Link>
                                        <div className="nombre fondo-nombre">
                                            <p className="my-3 nombre"> {e.apellido} {e.nombre}</p>
                                        </div>
                                    </div>

                                </div>
                            ))}
                            {buscadosInqui.map(e => (
                                <div key={e.id} className={existe2 ? "" : "col my-5"}>
                                    <div className="mg ancho text-center opacidad ">
                                        <Link to={"/inquilino/" + e.id}><img src={e.imagen} alt="" /></Link>
                                        <div className="nombre fondo-nombre-inqui">
                                            <p className="my-3 nombre"> {e.apellido} {e.nombre}</p>
                                        </div>
                                    </div>

                                </div>
                            ))}

                        </div>

                    </div>}
            </>

        )
    }



}

export default Buscados;