import { useEffect, useRef, useState } from "react";
import Cargando from "../load/Cargando"
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { Link, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const CreadoraRecibosInquilino = () => {

    registerLocale("es", es);
    const [cargando, setCargando] = useState(true);
    const [fechaRecibo, setFechaRecibo] = useState({ fecha: new Date });
    const [concepto, setConcepto] = useState("")
    const [monto, setMonto] = useState(0);
    const [descripcion, setDescripcion] = useState("")
    const [inputConcepto, setInputConcepto] = useState(false)
    const formulario = useRef()
    const { id } = useParams()
    const [persona, setPersona] = useState({});
    const [tamañoRecibos, setTamañoRecibos] = useState(0)
    const [impuesto, setImpuesto] = useState(false)
    const [expensas, setExpensas] = useState(false)
    const [municipalidad, setMunicipalidad] = useState(false)


    const onChangeFecha = (fecha) => {

        setFechaRecibo({ fecha: fecha })
    }


    useEffect(() => {
        const db = getFirestore();
        const docRef = doc(db, "inquilinos", id)
        getDoc(docRef).then(snapShot => {
            if (snapShot.exists()) {
                const inqui = ({ id: snapShot.id, ...snapShot.data() });
                setPersona(inqui)
                setCargando(false)

            } else {
                console.error("error")
            }

        })

    }, [])

    useEffect(() => {
        const db = getFirestore();
        const docRef = doc(db, "numeroRecibos", "AVEBwfSCF0yvfbmTliaI")
        getDoc(docRef).then(snapShot => {
            if (snapShot.exists()) {

                const numero = ({ id: snapShot.id, ...snapShot.data() });
                setTamañoRecibos(numero.numeroRecibo)

            } else {
                console.error("error")
            }

        })

    }, [])


    const notifySucces = () => toast.success("Recibo Enviado", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",

    })

    const cambioConcepto = (e) => {

        console.log(e.target.value)
        if (e.target.value == "Alquiler") {
            setConcepto(e.target.value)
            setInputConcepto(false)
        } else {
            if (e.target.value == "Otro") {
                setConcepto("")
                setInputConcepto(true)
            } else {
                setInputConcepto(false)
            }
        }
    }
    const checkValue = () => {

        if (expensas) {
            setExpensas(false)
        } else {
            setExpensas(true)
        }

    }
    const checkValueTwo = () => {
        if (impuesto) {
            setImpuesto(false)
        } else {
            setImpuesto(true)
        }

    }
    const checkValueThree = () => {
        if (municipalidad) {
            setMunicipalidad(false)
        } else {
            setMunicipalidad(true)
        }

    }


    const enviar = () => {

        if (concepto == "Alquiler") {
            const reciboPersona = {
                nombre: persona.apellido + " " + persona.nombre,
                tipo: "inquilinos",
                concepto: concepto,
                monto: monto,
                fecha: fechaRecibo,
                idPersona: id,
                impuestos: impuesto,
                expensas: expensas,
                municipalidad: municipalidad,
                descripcion: descripcion,
                reciboNumero: tamañoRecibos + 1

            }
       


            const db = getFirestore();
            const docRef = doc(db, "inquilinos", id)
            const docRef2 = collection(db, "recibos")
            const docRef3 = doc(db, "numeroRecibos", "AVEBwfSCF0yvfbmTliaI")
            updateDoc(docRef, { alquiler: true })
            addDoc(docRef2, reciboPersona).then(
                notifySucces(),
                formulario.current.reset()

            )

            updateDoc(docRef3, { numeroRecibo: tamañoRecibos + 1 })

        } else {

            const reciboPersona = {
                nombre: persona.apellido + " " + persona.nombre,
                tipo: "inquilinos",
                concepto: concepto,
                monto: monto,
                fecha: fechaRecibo,
                idPersona: id,
                reciboNumero: tamañoRecibos + 1
         
            }
          
      
            
            const db = getFirestore();
            const docRef2 = collection(db, "recibos")
            const docRef3 = doc(db, "numeroRecibos", "AVEBwfSCF0yvfbmTliaI")
            addDoc(docRef2, reciboPersona).then(
                notifySucces(),
                formulario.current.reset()
            )

            updateDoc(docRef3, { numeroRecibo: tamañoRecibos + 1 })
        }

    }

    return (
        <>
            <ToastContainer />
            {cargando ? <Cargando /> : <div className="container">

                <div className="row ancho-recibo">
                    <div className="col recibo my-5">
                        <form ref={formulario}>
                            <label className="label-datos">Tipo</label>
                            <select className="form-select input-nombre-nota" aria-label="Default select example">
                                <option value={"inquilinos"}>Inquilino</option>
                            </select>

                            <div className="my-3">
                                <label className="label-datos ">Nombre</label>
                                <select className="form-select input-nombre-nota" aria-label="Default select example">
                                    <option value="">{persona.apellido} {persona.nombre}</option>
                                </select>
                            </div>
                            <div className="my-3">
                                <label className="label-datos">En concepto de</label>
                                <select className="form-select input-nombre-nota" aria-label="Default select example" onChange={cambioConcepto} >
                                    <option value={""}>Seleccione el concepto</option>
                                    <option value={"Alquiler"}>Alquiler</option>
                                    <option value={"Otro"}>Otro</option>
                                </select>
                            </div>

                            <div className="my-3">
                                {inputConcepto
                                    ?
                                    <input className="form-control" type="text" placeholder="Concepto" onInput={e => setConcepto(e.target.value)} />
                                    :
                                    (
                                        concepto == "Alquiler"
                                            ?
                                            <div className="contenedor-checks">
                                                <div className="my-3">
                                                    <label className="label-datos">Descripción (opcional)</label>
                                                    <input placeholder="Descripción" className="form-control input-nombre-nota" type="text" onChange={e => setDescripcion(e.target.value)} />
                                                </div>
                                                <div className="contenedor-check">
                                                    <label>Incluye Expensas</label>
                                                    <input type="checkbox" onChange={checkValue} />
                                                </div>
                                                <div className="contenedor-check">
                                                    <label>Incluye Impuestos</label>
                                                    <input type="checkbox" onInput={checkValueTwo} />
                                                </div>
                                                <div className="contenedor-check">
                                                    <label>Incluye Municipalidad</label>
                                                    <input type="checkbox" onInput={checkValueThree} />
                                                </div>
                                            </div>
                                            : "")
                                }
                            </div>

                            <div className="my-3">
                                <div className="contenedor-fecha-label">
                                    <label className="label-datos">Fecha</label>
                                    <DatePicker className="input-fecha input-nombre-nota" selected={fechaRecibo.fecha} onChange={onChangeFecha} locale={"es"} dateFormat={"dd-MM-yyyy"} />
                                </div>
                            </div>
                            <div className="my-3">
                                <label className="label-datos">Monto</label>
                                <input placeholder="Monto" className="form-control input-nombre-nota" type="number" onInput={e => setMonto(e.target.value)} />
                            </div>
                        </form>
                        <div className="text-center">
                            <button onClick={() => enviar()} className="boton-nota my-3">Enviar Recibo</button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default CreadoraRecibosInquilino;