import { useEffect, useState } from "react";
import Cargando from "./Cargando"
import { addDoc, collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Recibos = () => {

    registerLocale("es", es);
    const [concepto, setConcepto] = useState("Alquiler")
    const [inputConcepto, setInputConcepto] = useState(false)
    const [cargando, setCargando] = useState(true);
    const [tipo, setTipo] = useState("inquilinos");
    const [personas, setPersonas] = useState([]);
    const [monto, setMonto] = useState(0);
    const [nombrePersona, setnombrePersona] = useState("");
    const [idPersona, setIdPersona] = useState("")
    const [fechaRecibo, setFechaRecibo] = useState({ fecha: new Date });


    const notifySucces = () => toast.success("Recibo Enviado", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",

    })


    useEffect(() => {
        const db = getFirestore();
        const itemCollection = collection(db, tipo)
        getDocs(itemCollection).then(Snapshot => {

            if (Snapshot.size > 0) {

                setPersonas(Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() })));


            } else {
                console.error("error")
            }
        })




    }, [tipo])


    setTimeout(() => {
        setCargando(false)
    }, 1500)


    const cambioConcepto = (e) => {
        if (e.target.value == "Alquiler") {
            setConcepto(e.target.value)
            setInputConcepto(false)
        } else {
            if (e.target.value == "Otro") {
                setConcepto("")
                setInputConcepto(true)
            }
        }
    }


    const cambioTipo = (e) => {
        setTipo(e.target.value)
        setnombrePersona("")
    }

    const cambioNombre = (e) => {
        setnombrePersona(e.target.value)
        personas.map(persona => {

            if ((persona.apellido + " " + persona.nombre) == e.target.value) {

                setIdPersona(persona.id)
            }
        })

    }

    const onChangeFecha = (fecha) => {

        setFechaRecibo({ fecha: fecha })
    }

    const enviar = () => {

        if (concepto == "Alquiler") {
            const reciboPersona = {
                nombre: nombrePersona,
                tipo: tipo,
                concepto: concepto,
                monto: monto,
                fecha: fechaRecibo,
                idPersona: idPersona

            }

            const db = getFirestore();
            const docRef = doc(db, tipo, idPersona)
            const docRef2 = collection(db, "recibos")
            updateDoc(docRef, { alquiler: true })
            addDoc(docRef2, reciboPersona).then(
                notifySucces()
            )

        } else {

            const reciboPersona = {
                nombre: nombrePersona,
                tipo: tipo,
                concepto: concepto,
                monto: monto,
                fecha: fechaRecibo,
                idPersona: idPersona

            }

            const db = getFirestore();
            const docRef2 = collection(db, "recibos")
            addDoc(docRef2, reciboPersona).then(
                notifySucces()
            )
        }

    }





    return (
        <>
            <ToastContainer />
            {cargando ? <Cargando /> : <div className="container">
                <div className="text-end">
                    <Link to={"/recibos/verrecibos"}><button className="btn btn-primary my-3">Ver Recibos</button></Link>
                </div>
                <div className="row ancho-recibo">
                    <div className="col recibo my-5">
                        <form action="">
                            <div className="my-3">
                                <label className="label-datos">En concepto de</label>
                                <select className="form-select" aria-label="Default select example" onChange={cambioConcepto} >
                                    <option value={"Alquiler"}>Alquiler</option>
                                    <option value={"Otro"}>Otro</option>
                                </select>
                            </div>
                            <div className="my-3">
                                {inputConcepto ?
                                    <input className="form-control" type="text" placeholder="Concepto" onInput={e => setConcepto(e.target.value)} /> : ""}
                                <label className="label-datos">Tipo</label>
                                <select className="form-select" aria-label="Default select example" onChange={cambioTipo}>
                                    <option value={"inquilinos"}>Inquilino</option>
                                    <option value={"propietarios"}>Propietario</option>
                                </select>
                            </div>
                            <div className="my-3">
                                <label className="label-datos">Nombre</label>
                                <select className="form-select" aria-label="Default select example" onChange={cambioNombre}>
                                    <option value="">Seleccione un nombre</option>
                                    {personas.map(e => (
                                        <option key={e.id} value={(e.apellido) + " " + (e.nombre)}>{e.apellido} {e.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="my-3">
                                <div className="contenedor-fecha-label">
                                    <label className="label-datos">Fecha</label>
                                    <DatePicker className="input-fecha" selected={fechaRecibo.fecha} onChange={onChangeFecha} locale={"es"} dateFormat={"dd-MM-yyyy"} />
                                </div>
                            </div>
                            <div className="my-3">
                                <label className="label-datos">Monto</label>
                                <input placeholder="Monto" className="form-control" type="text" onInput={e => setMonto(e.target.value)} />
                            </div>
                        </form>
                        <div className="text-center">
                            <button onClick={() => enviar()} className="btn btn-primary my-3">Terminar Recibo</button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Recibos;