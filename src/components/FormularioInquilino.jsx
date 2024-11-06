import { useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import avataresHombre from "../json/avatarHombres.json"
import avataresMujer from "../json/avatarMujeres.json"




const FormularioInquilino = () => {
   
 
    const navigate = useNavigate()
    
    registerLocale("es", es);
    
    let avatar = Math.floor(Math.random()*(30-1)+1)
    const { idInquilino } = useParams();
    const [nombreInqui, setNombreInqui] = useState("");
    const [apellidoInqui, setApellidoInqui] = useState("");
    const [telefonoInqui, setTelefonoInqui] = useState(0);
    const [emailInqui, setEmailInqui] = useState("");
    const [genero,setGenero] = useState("");
    const [dniInqui, setDniInqui] = useState(0);
    const [direccionInqui, setDireccionInqui] = useState("");
    const [aumento, setAumento] = useState("");
    const [vigencia, setVigencia] = useState({ fecha: new Date() });
    const [vencimiento, setVencimineto] = useState({ fecha: new Date() });
    const [monto, setMonto] = useState(0);
    
    let  inquilinoNuevo;
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



    const notify = (texto) => toast.error(texto, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",

    });

    const notifySucces = () => toast.success("Inquilino Creado", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });




    const onChangeVigencia = (fecha) => {

        setVigencia({ fecha: fecha })
    }

    const onChangeVencimiento = (fecha) => {

        setVencimineto({ fecha: fecha })
    }

    const cambioAjuste = (e) =>{
     
        setAumento(e.target.value)
    }

    const  cambioGenero =  (e) =>{
     
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

       if(genero == "Hombre"){

        inquilinoNuevo = {
            nombre: nombreInqui.at(0).toUpperCase()+nombreInqui.slice(1).toLowerCase(),
            apellido: apellidoInqui.at(0).toUpperCase()+apellidoInqui.slice(1).toLowerCase(),
            email: emailInqui,
            dni: dniInqui,
            direccion: direccionInqui,
            telefono: telefonoInqui,
            aumento: aumento,
            vigencia: vigencia,
            vencimiento: vencimiento,
            idprop: idInquilino,
            monto: monto,
            alquiler: false,
            imagen:avataresHombre[avatar],
            genero:genero

        }
     

       }else{
       
        inquilinoNuevo = {
            nombre: nombreInqui.at(0).toUpperCase()+nombreInqui.slice(1).toLowerCase(),
            apellido: apellidoInqui.at(0).toUpperCase()+apellidoInqui.slice(1).toLowerCase(),
            email: emailInqui,
            dni: dniInqui,
            direccion: direccionInqui,
            telefono: telefonoInqui,
            aumento: aumento,
            vigencia: vigencia,
            vencimiento: vencimiento,
            idprop: idInquilino,
            monto: monto,
            alquiler: false,
            imagen:avataresMujer[avatar],
            genero:genero

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
            navigate("/propietario/" + idInquilino)

        }, 1500)
    }



    return (

        <>
            <ToastContainer />
            <div className="container formulario">
                <form className="container" ref={formulario} >
                    <div className="mb-3">
                        <label className="label-datos">Nombre</label>
                        <input type="text" className={"form-control " + (error ? "validacion-error" : " ")} placeholder="Nombre" aria-label="Username" aria-describedby="basic-addon1" onInput={(e) => { setNombreInqui(e.target.value) }} />
                    </div>
                    <div className="mb-3">
                        <label className="label-datos">Apellido</label>
                        <input type="text" className={"form-control " + (error2 ? "validacion-error" : " ")} placeholder="Apellido" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setApellidoInqui(e.target.value) }} />
                    </div>
                    <div className="mb-3">
                        <label className="label-datos">Género</label>
                        <select className="form-select" aria-label="Default select example" onChange={cambioGenero}>
                            <option value="">Seleccione el género</option>
                            <option value= "Hombre">Hombre</option>
                            <option value= "Mujer">Mujer</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="label-datos">Telefono</label>
                        <input type="number" className={"form-control " + (error3 ? "validacion-error" : " ")} placeholder="Telefono" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setTelefonoInqui(e.target.value) }} />
                    </div>
                    <div className="mb-3">
                        <label className="label-datos">Email</label>
                        
                        <input type="email" className={"form-control " + (error4 ? "validacion-error" : " ")} placeholder="Correo Electronico" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setEmailInqui(e.target.value) }} />
                    </div>
                    <div className="mb-3">
                        <label className="label-datos">Dni</label>
                        <input type="number" className={"form-control " + (error5 ? "validacion-error" : " ")} placeholder="Dni" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setDniInqui(e.target.value) }} />
                    </div>
                    <div className="mb-3">
                        <label className="label-datos">Dirección</label>
                        <input type="text" className={"form-control " + (error6 ? "validacion-error" : " ")} placeholder="Direccion del Inmbueble" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setDireccionInqui(e.target.value) }} />
                    </div>
                    <div className="mb-3">
                        <label className="label-datos">Ajuste</label>
                        <select className="form-select" aria-label="Default select example" onChange={cambioAjuste}>
                            <option value="">Seleccione el tipo de ajuste</option>
                            <option value= "Bimestral">Bimestral</option>
                            <option value= "Trimestral">Trimestral</option>
                            <option value= "Cuatrimestral">Cuatrimestral</option>
                            <option value= "Semestral">Semestral</option>
                            <option value= "Anual">Anual</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="label-datos">Monto</label>
                        <input type="number" className={"form-control " + (error8 ? "validacion-error" : " ")} placeholder="Monto" aria-label="Recipient's username" aria-describedby="basic-addon2" onInput={(e) => { setMonto(e.target.value) }} />
                    </div>
                    <div className="mb-3 contenedor-fecha-label">
                        <label className="label-datos">Vigencia</label>
                        <DatePicker className="input-fecha" selected={vigencia.fecha} onChange={onChangeVigencia} locale={"es"} dateFormat={"dd-MM-yyyy"} />
                    </div>
                    <div className="mb-3 contenedor-fecha-label">
                        <label className="label-datos">Vencimiento</label>
                        <DatePicker className="input-fecha" selected={vencimiento.fecha} onChange={onChangeVencimiento} locale={"es"} dateFormat={"dd-MM-yyyy"} />
                    </div>

                </form>
                <div className="text-center">
                    <button className="btn btn-primary " onClick={control} >Agregar</button>
                </div>
            </div>
        </>
    )

}

export default FormularioInquilino