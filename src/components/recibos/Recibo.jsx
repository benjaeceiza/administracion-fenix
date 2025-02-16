import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore } from "firebase/firestore";
import ModalEliminar from "../modal/ModalEliminar";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from "jspdf"
import "jspdf-autotable"

const Recibo = ({ recibos, setRecargar, limite }) => {

    const [recibosOrdenados, setRecibosOrdenados] = useState([])
    const [modalEliminar, setModalEliminar] = useState(false)
    const [reciboSeleccionado, setReciboSeleccionado] = useState("")
    const [eliminar, setEliminar] = useState(false)
    const [locatario, setLocatario] = useState("")
    let propietarios = [];
    let locador = "";




    useEffect(() => {
        let sortedList = [...recibos].sort((a, b) => (a.fecha.fecha.seconds < b.fecha.fecha.seconds ? 1 : a.fecha.fecha.seconds > b.fecha.fecha.seconds ? -1 : 0))
        setRecibosOrdenados(sortedList);
    }, [recibos])
    


    useEffect(() => {

        if (eliminar) {
            const db = getFirestore();
            const docRef = doc(db, "recibos", reciboSeleccionado);
            deleteDoc(docRef).then(
                setEliminar(false),
                setRecargar(true)
            )
        }
    }, [eliminar])


    const dataPdf = (nombre, concepto, descripcion, monto, fecha, numero, tipo, idprop) => {

        const dataPrev = {
            nombre: nombre,
            concepto: concepto,
            descripcion: descripcion,
            monto: monto,
            fecha: fecha,
            tipo: tipo,
            idprop: idprop
        }

        const docc = new jsPDF();

        docc.addImage("https://i.postimg.cc/vZsjPByL/fenix-logo.jpg", "JPG", 10, 10, 60, 20);
        docc.setFontSize(20)
        docc.setFont("italic")
        docc.text('COMPROBANTE', 140, 21)
        docc.text('N°' + numero, 180, 30)

        const columns = ['Nombre', 'Localidad', 'Concepto', 'Monto', 'Fecha']
        const columns2 = ['Locador']
        const data = [
            [`${dataPrev.nombre}`, `Villa Mercedes`, dataPrev.descripcion ? dataPrev.descripcion : dataPrev.concepto, `$${dataPrev.monto}`, new Intl.DateTimeFormat('es-ES',).format(dataPrev.fecha.fecha.seconds * 1000)]
        ]
        const data2 = [
            [`${idprop}`]
        ]




        docc.autoTable({
            startY: 60,
            head: [columns],
            body: data
        })

        if (dataPrev.tipo == "inquilinos") {

                    propietarios.map( e => {
                        if (e.id == dataPrev.idprop) {

                            locador = (e.nombre + " " + e.apellido)
                           
                        } 
                    })

                } else {
                    console.error("error")
                }

        


            // docc.autoTable({
            //     startY: 95,
            //     head: [columns2],
            //     body: data2
            // })
        


        docc.addImage("https://i.postimg.cc/bvMMFcp4/E-COMERCE-1.jpg", "JPG", 10, 230, 180, 100);
        docc.setFontSize(15)
        docc.setFont("italic")
        docc.text('Fenix Propiedades SRL actúa a cuenta y orden de terceros', 40, 250)
        docc.save(`factura_${dataPrev.nombre}.pdf`);


    }

    const controlEliminarRecibo = (id) => {
        setModalEliminar(true)
        setReciboSeleccionado(id)

    }




    return (
        <>

            {modalEliminar
                ?
                <ModalEliminar setModalEliminar={setModalEliminar} setEliminar={setEliminar} />
                :
                ""
            }
            <div key={Math.random()} className="contenedor-recibos">
                {recibosOrdenados.slice(0, limite).map(e => (
                    <div key={e.id} className="contenedor-recibo">
                        <div className="mostrar-recibo">
                            <div className={e.tipo == "inquilinos" ? "div-nombre" : "div-nombre-prop"}>
                                <p>{e.nombre} ({e.tipo})</p>
                            </div>
                            <div className="contenido-recibo ">
                                <label className="label-datos">En concepto de:</label>
                                <div className="div-concepto input-nombre-nota">
                                    {e.descripcion ? <p>{e.descripcion}</p> : <p>{e.concepto}</p>}
                                </div>
                                <p>Monto: <b>${e.monto}</b> </p>
                            </div>
                            <div className="contenedor-fecha-eliminar">
                                <p> {new Intl.DateTimeFormat('es-ES',).format(e.fecha.fecha.seconds * 1000)}</p>
                                <div>
                                    <FileDownloadIcon onClick={() => dataPdf(e.nombre, e.concepto, e.descripcion, e.monto, e.fecha, e.reciboNumero, e.tipo, e.idprop)} cursor={"pointer"} className="icono-recibo"></FileDownloadIcon>
                                    <DeleteIcon className="icono-recibo" cursor={"pointer"} onClick={() => controlEliminarRecibo(e.id)}></DeleteIcon>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Recibo;