import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import DatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cargando from "../load/Cargando";


const EditarInquilino = () => {

    const [inquilino, setInquilino] = useState([])
    const { idInquilino } = useParams();
    let tipoAjuste = [
        {
            tipo: "Bimestral"
        },
        {
            tipo: "Trimestral"
        },
        {
            tipo: "Cuatrimestral"
        },
        {
            tipo: "Semestral"
        },
        {
            tipo: "Anual"
        }

    ];
    const [cargador, setCargador] = useState(true)
    const [vigencia, setVigencia] = useState({ fecha: "" });
    const [vencimiento, setVencimineto] = useState({ fecha: "" });
    const [modificarVigencia, setModificarVigencia] = useState(false)
    const [modificarVencimiento, setModificarVencimiento] = useState(false)
    const [nuevoVencimiento, setNuevoVencimiento] = useState(false)
    const [nuevaVigencia, setNuevaVigencia] = useState(false)
    const navigate = useNavigate()
    let inquilinoPrev = ""
    let ajuste = ""
    let nombre = "";
    let apellido = "";
    let telefono = "";
    let email = "";
    let dni = "";
    let direccion = "";
    let monto = "";
    let añoAumento = "";
    let mesAumento = "";

    registerLocale("es", es);

    useEffect(() => {

        const db = getFirestore();
        const docRef = doc(db, "inquilinos", idInquilino)

        getDoc(docRef).then(snapShot => {
            if (snapShot.exists()) {

                inquilinoPrev = { id: snapShot.id, ...snapShot.data() };
                setInquilino({ id: snapShot.id, ...snapShot.data() });
                setVencimineto({ fecha: inquilinoPrev.vencimiento.fecha })
                setVigencia({ fecha: inquilinoPrev.vigencia.fecha })
                setCargador(false)

            } else {
                console.error("error")
            }

        })


    }, [])

    useEffect(() => {


        if (modificarVencimiento) {


        } else {
       
            const db = getFirestore();
            const docRef = doc(db, "inquilinos", idInquilino)

            getDoc(docRef).then(snapShot => {
                if (snapShot.exists()) {

                    inquilinoPrev = { id: snapShot.id, ...snapShot.data() };
                    setVencimineto({ fecha: inquilinoPrev.vencimiento.fecha })


                } else {
                    console.error("error")
                }

            })
        }

      setNuevoVencimiento(false)

    }, [modificarVencimiento])

    useEffect(() => {


        if (modificarVigencia) {


        } else {
       
            const db = getFirestore();
            const docRef = doc(db, "inquilinos", idInquilino)

            getDoc(docRef).then(snapShot => {
                if (snapShot.exists()) {

                    inquilinoPrev = { id: snapShot.id, ...snapShot.data() };
                    setVigencia({ fecha: inquilinoPrev.vigencia.fecha })


                } else {
                    console.error("error")
                }

            })
        }

      setNuevaVigencia(false)

    }, [modificarVigencia])










    const notifySucces = () => toast.success("Inquilino Editado!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",

    })







    const onChangeVigencia = (fecha) => {
        setNuevaVigencia(true)
        setVigencia({ fecha: fecha })

    }

    const onChangeVencimiento = (fecha) => {

        setNuevoVencimiento(true)
        setVencimineto({ fecha: fecha })
    }


    const cambioAjuste = (e) => {

        ajuste = e.target.value
    }


    const cambioProximoMesAjuste = (e) => {
        mesAumento = e.target.value

    }
    const cambioProximoAñoAjuste = (e) => {
        añoAumento = e.target.value

    }

    const cancelarVigencia = () => {
        setModificarVigencia(false)
    }

    const cancelarVencimiento = () => {

        setModificarVencimiento(false)

        // setVencimineto({ fecha: inquilinoPrev.vencimiento.fecha })
    }

    const control = () => {


        if (nombre == "") {

            nombre = inquilino.nombre
        }

        if (apellido == "") {

            apellido = inquilino.apellido
        }
        if (telefono == "") {
            telefono = inquilino.telefono
        }
        if (email == "") {
            email = inquilino.email
        }
        if (dni == "") {
            dni = inquilino.dni
        }
        if (direccion == "") {
            direccion = inquilino.direccion
        }

        if (monto == "") {
            monto = inquilino.monto
        }

        if (ajuste == "") {

            ajuste = inquilino.aumento
        }
        if (mesAumento == "") {

            mesAumento = inquilino.mesAumento
        }
        if (añoAumento == "") {

            añoAumento = inquilino.añoAumento
        }


        crear()

    }

    const crear = () => {


        const inqui = {
            nombre: nombre.at(0).toUpperCase() + nombre.slice(1).toLowerCase(),
            apellido: apellido.at(0).toUpperCase() + apellido.slice(1).toLowerCase(),
            telefono: telefono,
            email: email,
            dni: dni,
            direccion: direccion,
            aumento: ajuste,
            vencimiento: vencimiento,
            vigencia: vigencia,
            monto: monto,
            añoAumento: añoAumento,
            mesAumento: mesAumento
        }



        const db = getFirestore();
        const docRef = doc(db, "inquilinos", idInquilino)
        updateDoc(docRef, inqui).then(
            notifySucces()
        )
        setTimeout(() => {
            navigate("/inquilino/" + inquilino.id)
        }, 1500)




    }






    return (
        <>
            <ToastContainer />
            {cargador ? <Cargando /> : <div className="container formulario-editar ">
                <form className="container" >
                    <div className="mb-3">
                        <label className="label-datos">Nombre:</label>
                        <input type="text" className="form-control input-nombre-nota" placeholder={inquilino.nombre} aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { nombre = (e.target.value) }} />
                    </div>

                    <div className="mb-3">
                        <label className="label-datos">Apellido:</label>
                        <input type="text" className="form-control input-nombre-nota" placeholder={inquilino.apellido} aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { apellido = (e.target.value) }} />

                    </div>
                    <div className="mb-3">
                        <label className="label-datos">Telefono:</label>
                        <input type="number" className="form-control input-nombre-nota" placeholder={inquilino.telefono} aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { telefono = (e.target.value) }} />

                    </div>
                    <div className=" mb-3">
                        <label className="label-datos">Email:</label>
                        <input type="email" className="form-control input-nombre-nota" placeholder={inquilino.email} aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { email = (e.target.value) }} />

                    </div>
                    <div className=" mb-3">
                        <label className="label-datos">Dni/Cuit/Cuil:</label>
                        <input type="number" className="form-control input-nombre-nota" placeholder={inquilino.dni} aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { dni = (e.target.value) }} />

                    </div>
                    <div className=" mb-3">
                        <label className="label-datos">Dirección:</label>
                        <input type="text" className="form-control input-nombre-nota" placeholder={inquilino.direccion} aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { direccion = (e.target.value) }} />

                    </div>
                    <div className="mb-3">
                        <label className="label-datos">Ajuste</label>
                        <select className="form-select input-nombre-nota" aria-label="Default select example" onChange={cambioAjuste}>
                            <option value={inquilino.aumento}>{inquilino.aumento}</option>
                            {tipoAjuste.map(valor => (
                                inquilino.aumento == valor.tipo ? "" : <option key={valor.tipo} value={valor.tipo}>{valor.tipo}</option>
                            ))}
                        </select>
                    </div>
                    <label className="label-datos">Proximo Ajuste</label>
                    <div className="mb-3 editar-proximo-aumento">
                        <select className="form-select input-nombre-nota" aria-label="Default select example" onChange={cambioProximoMesAjuste}>
                            <option value={inquilino.mesAumento}>{inquilino.mesAumento}</option>
                            <option value={1}>{"1"}</option>
                            <option value={2}>{"2"}</option>
                            <option value={3}>{"3"}</option>
                            <option value={4}>{"4"}</option>
                            <option value={5}>{"5"}</option>
                            <option value={6}>{"6"}</option>
                            <option value={7}>{"7"}</option>
                            <option value={8}>{"8"}</option>
                            <option value={9}>{"9"}</option>
                            <option value={10}>{"10"}</option>
                            <option value={11}>{"11"}</option>
                            <option value={12}>{"12"}</option>
                        </select>
                        <select className="form-select input-nombre-nota" aria-label="Default select example" onChange={cambioProximoAñoAjuste}>
                            <option value={inquilino.añoAmento}>{inquilino.añoAumento}</option>
                            <option value={2025}>2025</option>
                            <option value={2026}>2026</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="label-datos">Monto:</label>
                        <input type="number" className="form-control input-nombre-nota " placeholder={inquilino.monto} aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { monto = (e.target.value) }} />
                    </div>

                    {
                        modificarVigencia
                            ?
                            <div className="">
                                {
                                    nuevaVigencia
                                        ?
                                        <div className="editar-fecha-contenedor my-2">
                                            <div className="contenedor-fecha-label">
                                                <label htmlFor="" className="label-datos">Vigencia</label>
                                                <DatePicker className="input-fecha input-nombre-nota" selected={vigencia.fecha} onChange={onChangeVigencia} locale={"es"} dateFormat={"dd-MM-yyyy"} />
                                            </div>
                                            <button className="boton-cambiar" onClick={() => cancelarVigencia()}>Cancelar</button>
                                        </div>
                                        :
                                        <div className="editar-fecha-contenedor my-2">
                                            <div className="contenedor-fecha-label">
                                                <label htmlFor="" className="label-datos">Vigencia</label>
                                                <DatePicker className="input-fecha input-nombre-nota" selected={vigencia.fecha.seconds * 1000} onChange={onChangeVigencia} locale={"es"} dateFormat={"dd-MM-yyyy"} />
                                            </div>
                                            <button className="boton-cambiar" onClick={cancelarVigencia}>Cancelar</button>
                                        </div>
                                }
                            </div>
                            :
                            <div className="editar-fecha-contenedor my-2">
                                <div className="contenedor-fecha-label">
                                    <label htmlFor="" className="label-datos">Vigencia</label>
                                    <p className="input-nombre-nota mostrador-fecha">{new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(inquilino.vigencia.fecha.seconds * 1000)}</p>
                                </div>
                                <button className="boton-cambiar" onClick={() => setModificarVigencia(true)}>Modificar</button>
                            </div>
                    }
                    {
                        modificarVencimiento
                            ?
                            <div className="">
                                {
                                    nuevoVencimiento
                                        ?
                                        <div className="editar-fecha-contenedor my-2">
                                            <div className="contenedor-fecha-label">
                                                <label htmlFor="" className="label-datos">Vencimiento</label>
                                                <DatePicker className="input-fecha input-nombre-nota" selected={vencimiento.fecha} onChange={onChangeVencimiento} locale={"es"} dateFormat={"dd-MM-yyyy"} />
                                            </div>
                                            <button className="boton-cambiar" onClick={() => cancelarVencimiento()}>Cancelar</button>
                                        </div>
                                        :
                                        <div className="editar-fecha-contenedor my-2">
                                            <div className="contenedor-fecha-label">
                                                <label htmlFor="" className="label-datos">Vencimiento</label>
                                                <DatePicker className="input-fecha input-nombre-nota" selected={vencimiento.fecha.seconds * 1000} onChange={onChangeVencimiento} locale={"es"} dateFormat={"dd-MM-yyyy"} />
                                            </div>
                                            <button className="boton-cambiar" onClick={cancelarVencimiento}>Cancelar</button>
                                        </div>
                                }
                            </div>
                            :
                            <div className="editar-fecha-contenedor">
                                <div className="contenedor-fecha-label">
                                    <label htmlFor="" className="label-datos">Vencimiento</label>
                                    <p className="input-nombre-nota mostrador-fecha">{new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(inquilino.vencimiento.fecha.seconds * 1000)}</p>
                                </div>
                                <button className="boton-cambiar" onClick={() => setModificarVencimiento(true)}>Modificar</button>
                            </div>
                    }



                </form>
                <div className="text-center my-5">
                    <button className="boton-nota" onClick={() => control()} >Finalizar</button>
                </div>
            </div>}
        </>
    )
}

export default EditarInquilino