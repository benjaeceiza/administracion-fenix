import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, getDocs, getFirestore } from 'firebase/firestore';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import avataresHombre from "../../json/avatarHombres.json"
import avataresMujer from "../../json/avatarMujeres.json"




const FormularioInquilino = () => {


    const navigate = useNavigate()

    registerLocale("es", es);

    let avatar = Math.floor(Math.random() * (30 - 1) + 1)
    const { idInquilino } = useParams();
    const  [idPropietario,setIdPropietario] = useState("")
    const [nombreInqui, setNombreInqui] = useState("");
    const [apellidoInqui, setApellidoInqui] = useState("");
    const [telefonoInqui, setTelefonoInqui] = useState(0);
    const [emailInqui, setEmailInqui] = useState("");
    const [genero, setGenero] = useState("");
    const [dniInqui, setDniInqui] = useState(0);
    const [direccionInqui, setDireccionInqui] = useState("");
    const [aumento, setAumento] = useState("");
    const [vigencia, setVigencia] = useState({ fecha: new Date() });
    const [vencimiento, setVencimineto] = useState({ fecha: new Date() });
    const [monto, setMonto] = useState(0);
    const [mesAumento, setMesAumento] = useState("")
    const [añoAumento, setAñoAumento] = useState("")
    const [propietarios, setPropietarios] = useState([])
    const [cargando, setCargando] = useState(true)
    let inquilinoNuevo;
    const formulario = useRef()
    const [error, setError] = useState(false);
    const [error2, setError2] = useState(false);
    const [error3, setError3] = useState(false);
    const [error4, setError4] = useState(false);
    const [error5, setError5] = useState(false);
    const [error6, setError6] = useState(false);
    const [error7, setError7] = useState(false);
    const [error8, setError8] = useState(false);
    const [error9, setError9] = useState(false);

    useEffect(() => {

        const db = getFirestore();
        const ItemCollection = collection(db, "propietarios");

        getDocs(ItemCollection).then(Snapshot => {

            if (Snapshot.size > 0) {

                const propietariosPrev = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                setPropietarios([...propietariosPrev].sort((a, b) => (a.apellido > b.apellido ? 1 : a.apellido < b.apellido ? -1 : 0)))
                setCargando(false)

            } else {
                console.error("error")
            }
        })
    }, [])

    const notify = (texto) => toast.error(texto, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",

    });

    const notifySucces = () => toast.success("Inquilino Creado", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
    });




    const cambioLocador = (e) => {
       
      
        setIdPropietario(e.target.value) 
       

    }

    const onChangeVigencia = (fecha) => {

        setVigencia({ fecha: fecha })

    }

    const onChangeVencimiento = (fecha) => {

        setVencimineto({ fecha: fecha })
    }

    const cambioAjuste = (e) => {

        setAumento(e.target.value)
        switch (e.target.value) {

            case "Bimestral":
                let mes = new Date(vigencia.fecha).getMonth() + 3
                let año = new Date().getFullYear();


                if (mes > 12) {
                    setMesAumento(mes - 12)
                    setAñoAumento(año + 1)

                } else {
                    setMesAumento(mes)
                    setAñoAumento(año)
                }


                break;
            case "Trimestral":

                let mes1 = new Date(vigencia.fecha).getMonth() + 4
                let año1 = new Date().getFullYear();


                if (mes1 > 12) {
                    setMesAumento(mes1 - 12)
                    setAñoAumento(año1 + 1)

                } else {
                    setMesAumento(mes1)
                    setAñoAumento(año1)
                }


                break;
            case "Cuatrimestral":
                let mes2 = new Date(vigencia.fecha).getMonth() + 5
                let año2 = new Date().getFullYear();


                if (mes2 > 12) {
                    setMesAumento(mes2 - 12)
                    setAñoAumento(año2 + 1)

                } else {
                    setMesAumento(mes2)
                    setAñoAumento(año2)
                }

                break;
            case "Semestral":

                let mes3 = new Date(vigencia.fecha).getMonth() + 7
                let año3 = new Date().getFullYear();


                if (mes3 > 12) {
                    setMesAumento(mes3 - 12)
                    setAñoAumento(año3 + 1)

                } else {
                    setMesAumento(mes3)
                    setAñoAumento(año3)
                }

                break;
            case "Anual":


                let mes4 = new Date(vigencia.fecha).getMonth() + 13
                let año4 = new Date().getFullYear();


                if (mes4 > 12) {
                    setMesAumento(mes4 - 12)
                    setAñoAumento(año4 + 1)

                } else {
                    setMesAumento(mes4)
                    setAñoAumento(año4)
                }

                break;

        }

    }


    const cambioGenero = (e) => {

        setGenero(e.target.value)
    }




    const control = () => {
        if (nombreInqui == "") {
            const texto = "Ingrese un Nombre"
            notify(texto)
            setError(true)
        } else {
            if (apellidoInqui == "") {
                const texto = "Ingrese un Apellido"
                notify(texto)
                setError2(true)
            } else {
                if (telefonoInqui == "") {
                    const texto = "Ingrese un Telefono"
                    notify(texto)
                    setError3(true)
                } else {
                    if (isNaN(telefonoInqui)) {
                        const texto = "Ingrese un Valor Numerico"
                        notify(texto)
                        setError3(true)

                    } else {
                        if (emailInqui == "") {
                            const texto = "Ingrese un Email"
                            notify(texto)
                            setError4(true)
                        } else {
                            if (dniInqui == "") {
                                const texto = "Ingrese un DNI"
                                notify(texto)
                                setError5(true)
                            } else {
                                if (isNaN(dniInqui)) {
                                    const texto = "Ingrese un valor Numerico"
                                    notify(texto)
                                    setError5(true)
                                } else {
                                    if (direccionInqui == "") {
                                        const texto = "Ingrese una Dirección"
                                        notify(texto)
                                        setError6(true)
                                    } else {
                                        if (aumento == "") {
                                            const texto = "Ingrese el tipo de Ajuste"
                                            notify(texto)
                                            setError7(true)
                                        } else {
                                            if (isNaN(monto) || monto == "") {
                                                const texto = "Ingrese un Número valido"
                                                notify(texto)
                                                setError8(true)
                                            } else {
                                                if (vigencia == "") {
                                                    const texto = "Ingrese la Vigencia"
                                                    notify(texto)
                                                    setError8(true)
                                                } else {
                                                    if (vencimiento == "") {
                                                        const texto = "Ingrese el Vencimiento"
                                                        notify(texto)
                                                        setError9(true)
                                                    } else {

                                                        crearInquilino();

                                                    }
                                                }

                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    const crearInquilino = () => {

        if (genero == "Hombre") {

            inquilinoNuevo = {
                nombre: nombreInqui.at(0).toUpperCase() + nombreInqui.slice(1).toLowerCase(),
                apellido: apellidoInqui.at(0).toUpperCase() + apellidoInqui.slice(1).toLowerCase(),
                email: emailInqui,
                dni: dniInqui,
                direccion: direccionInqui,
                telefono: telefonoInqui,
                aumento: aumento,
                vigencia: vigencia,
                vencimiento: vencimiento,
                idprop: idInquilino ? idInquilino : idPropietario,
                monto: monto,
                alquiler: false,
                imagen: avataresHombre[avatar],
                genero: genero,
                mesAumento: mesAumento,
                añoAumento: añoAumento
            
            }

           


        } else {

            inquilinoNuevo = {
                nombre: nombreInqui.at(0).toUpperCase() + nombreInqui.slice(1).toLowerCase(),
                apellido: apellidoInqui.at(0).toUpperCase() + apellidoInqui.slice(1).toLowerCase(),
                email: emailInqui,
                dni: dniInqui,
                direccion: direccionInqui,
                telefono: telefonoInqui,
                aumento: aumento,
                vigencia: vigencia,
                vencimiento: vencimiento,
                idprop: idInquilino ? idInquilino : idPropietario,
                monto: monto,
                alquiler: false,
                imagen: avataresMujer[avatar],
                genero: genero,
                mesAumento: mesAumento,
                añoAumento: añoAumento

            }
        }




        const db = getFirestore();
        const orderCollection = collection(db, "inquilinos");
        addDoc(orderCollection, inquilinoNuevo).then(

            notifySucces()

        )
        formulario.current.reset()

        setApellidoInqui("")
        setAumento("")
        setNombreInqui("")
        setDireccionInqui("")
        setDniInqui(0)
        setMonto(0)
        setEmailInqui("")
        setTelefonoInqui(0)
        setVencimineto({ fecha: "" })
        setVigencia({ fecha: "" })
        setTimeout(() => {
            navigate("/propietario/" + `${idInquilino ? idInquilino : idPropietario}`)

        }, 1500)
    }



    return (

        <>

            <ToastContainer />
            {
                idInquilino
                    ?
                    <div className="container formulario">
                        <form className="container" ref={formulario} >
                            <div className="mb-3">
                                <label className="label-datos">Nombre</label>
                                <input type="text" className={"form-control input-nombre-nota" + (error ? "validacion-error" : " ")} placeholder="Nombre" aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { setNombreInqui(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Apellido</label>
                                <input type="text" className={"form-control input-nombre-nota" + (error2 ? "validacion-error" : " ")} placeholder="Apellido" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setApellidoInqui(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Género</label>
                                <select className="form-select input-nombre-nota" aria-label="Default select example" onChange={cambioGenero}>
                                    <option value="">Seleccione el género</option>
                                    <option value="Hombre">Hombre</option>
                                    <option value="Mujer">Mujer</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Telefono</label>
                                <input type="number" className={"form-control input-nombre-nota" + (error3 ? "validacion-error" : " ")} placeholder="Telefono" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setTelefonoInqui(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Email</label>

                                <input type="email" className={"form-control input-nombre-nota" + (error4 ? "validacion-error" : " ")} placeholder="Correo Electronico" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setEmailInqui(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Dni</label>
                                <input type="number" className={"form-control input-nombre-nota" + (error5 ? "validacion-error" : " ")} placeholder="Dni" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setDniInqui(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Dirección</label>
                                <input type="text" className={"form-control input-nombre-nota" + (error6 ? "validacion-error" : " ")} placeholder="Direccion del Inmbueble" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setDireccionInqui(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Ajuste</label>
                                <select className="form-select input-nombre-nota" aria-label="Default select example" onChange={cambioAjuste}>
                                    <option value="">Seleccione el tipo de ajuste</option>
                                    <option value="Bimestral">Bimestral</option>
                                    <option value="Trimestral">Trimestral</option>
                                    <option value="Cuatrimestral">Cuatrimestral</option>
                                    <option value="Semestral">Semestral</option>
                                    <option value="Anual">Anual</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Monto</label>
                                <input type="number" className={"form-control input-nombre-nota" + (error8 ? "validacion-error" : " ")} placeholder="Monto" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setMonto(e.target.value) }} />
                            </div>
                            <div className="mb-3 contenedor-fecha-label">
                                <label className="label-datos">Vigencia</label>
                                <DatePicker className="input-fecha input-nombre-nota" selected={vigencia.fecha} onChange={onChangeVigencia} locale={"es"} dateFormat={"dd-MM-yyyy"} />
                            </div>
                            <div className="mb-3 contenedor-fecha-label">
                                <label className="label-datos">Vencimiento</label>
                                <DatePicker className="input-fecha input-nombre-nota" selected={vencimiento.fecha} onChange={onChangeVencimiento} locale={"es"} dateFormat={"dd-MM-yyyy"} />
                            </div>

                        </form>
                        <div className="text-center">
                            <button className="boton-nota " onClick={control} >Agregar</button>
                        </div>
                    </div>
                    :
                    <div className="container formulario">
                        <form className="container" ref={formulario} >
                            <div className="mb-3">
                                <label className="label-datos">Locador</label>
                                <select className="form-select input-nombre-nota" aria-label="Default select example" onChange={cambioLocador}>
                                    <option value={""}>Elija su locador</option>
                                    {propietarios.map(prop => (
                                        <option key={prop.id} value={prop.id}>{prop.apellido} {prop.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Nombre</label>
                                <input type="text" className={"form-control input-nombre-nota" + (error ? "validacion-error" : " ")} placeholder="Nombre" aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { setNombreInqui(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Apellido</label>
                                <input type="text" className={"form-control input-nombre-nota" + (error2 ? "validacion-error" : " ")} placeholder="Apellido" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setApellidoInqui(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Género</label>
                                <select className="form-select input-nombre-nota" aria-label="Default select example" onChange={cambioGenero}>
                                    <option value="">Seleccione el género</option>
                                    <option value="Hombre">Hombre</option>
                                    <option value="Mujer">Mujer</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Telefono</label>
                                <input type="number" className={"form-control input-nombre-nota" + (error3 ? "validacion-error" : " ")} placeholder="Telefono" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setTelefonoInqui(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Email</label>

                                <input type="email" className={"form-control input-nombre-nota" + (error4 ? "validacion-error" : " ")} placeholder="Correo Electronico" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setEmailInqui(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Dni</label>
                                <input type="number" className={"form-control input-nombre-nota" + (error5 ? "validacion-error" : " ")} placeholder="Dni" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setDniInqui(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Dirección</label>
                                <input type="text" className={"form-control input-nombre-nota" + (error6 ? "validacion-error" : " ")} placeholder="Direccion del Inmbueble" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setDireccionInqui(e.target.value) }} />
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Ajuste</label>
                                <select className="form-select input-nombre-nota" aria-label="Default select example" onChange={cambioAjuste}>
                                    <option value="">Seleccione el tipo de ajuste</option>
                                    <option value="Bimestral">Bimestral</option>
                                    <option value="Trimestral">Trimestral</option>
                                    <option value="Cuatrimestral">Cuatrimestral</option>
                                    <option value="Semestral">Semestral</option>
                                    <option value="Anual">Anual</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="label-datos">Monto</label>
                                <input type="number" className={"form-control input-nombre-nota" + (error8 ? "validacion-error" : " ")} placeholder="Monto" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setMonto(e.target.value) }} />
                            </div>
                            <div className="mb-3 contenedor-fecha-label">
                                <label className="label-datos">Vigencia</label>
                                <DatePicker className="input-fecha input-nombre-nota" selected={vigencia.fecha} onChange={onChangeVigencia} locale={"es"} dateFormat={"dd-MM-yyyy"} />
                            </div>
                            <div className="mb-3 contenedor-fecha-label">
                                <label className="label-datos">Vencimiento</label>
                                <DatePicker className="input-fecha input-nombre-nota" selected={vencimiento.fecha} onChange={onChangeVencimiento} locale={"es"} dateFormat={"dd-MM-yyyy"} />
                            </div>

                        </form>
                        <div className="text-center">
                            <button className="boton-nota " onClick={control} >Agregar</button>
                        </div>
                    </div>
            }
        </>
    )

}

export default FormularioInquilino