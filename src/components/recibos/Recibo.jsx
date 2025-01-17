import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import ModalEliminar from "../modal/ModalEliminar";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from "jspdf"
import "jspdf-autotable"

const Recibo = ({ recibos, setRecargar, limite }) => {

    const [recibosOrdenados, setRecibosOrdenados] = useState([])
    const [modalEliminar, setModalEliminar] = useState(false)
    const [reciboSeleccionado, setReciboSeleccionado] = useState("")
    const [eliminar, setEliminar] = useState(false)


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


    const dataPdf = (nombre, concepto, impuestos, expensas,municipalidad, monto, fecha, numero) => {
 
        const dataPrev = {
            nombre: nombre,
            concepto: concepto,
            impuestos: impuestos,
            expensas: expensas,
            municipalidad:municipalidad,
            monto: monto,
            fecha: fecha
        }

        const doc = new jsPDF();

        doc.addImage("https://i.postimg.cc/vZsjPByL/fenix-logo.jpg", "JPG", 10, 10, 60, 20);
        doc.setFontSize(20)
        doc.setFont("italic")
        doc.text('COMPROBANTE', 140, 21)
        doc.text('N°' + numero, 180, 30)
      
        const columns = ['Nombre', 'Localidad', 'Concepto', 'Monto', 'Fecha']
        const data = [
            [`${dataPrev.nombre}`, `Villa Mercedes`, `${dataPrev.concepto}`, `$${dataPrev.monto}`, new Intl.DateTimeFormat('es-ES',).format(dataPrev.fecha.fecha.seconds * 1000)]
        ]

        let columns2;
        let data2;

        if (concepto == "Alquiler") {
             columns2 = ['Incluye impuestos', 'Incluye Expensas','Incluye Municipalidad']
             data2 = [
                [dataPrev.impuestos ? "SI" : "NO",dataPrev.expensas ? "SI" : "NO",dataPrev.municipalidad ? "SI" : "NO" ]
            ]
        }


        doc.autoTable({
            startY: 60,
            head: [columns],
            body: data
        })
        doc.autoTable({
            startY: 80,
            head: [columns2],
            body: data2
        })

        doc.addImage("https://i.postimg.cc/KjjyjgFT/E-COMERCE-1.jpg", "JPG", 15, 100, 180, 140);

        doc.save(`factura_${dataPrev.nombre}.pdf`);



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
                                    <p>{e.concepto}</p>
                                </div>
                                {
                                    e.concepto == "Alquiler"
                                        ?
                                        (
                                            e.impuestos
                                                ?
                                                <p className="my-0">Incluye Impuestos: <b>Si</b></p>
                                                :
                                                <p className="my-0">Incluye Impuestos: <b>No</b></p>
                                        )
                                        :
                                        ""
                                }
                                {
                                    e.concepto == "Alquiler"
                                        ?
                                        (
                                            e.expensas
                                                ?
                                                <p className="my-0">Incluye Expensas: <b>Si</b></p>
                                                :
                                                <p className="my-0">Incluye Expensas: <b>No</b></p>
                                        )
                                        :
                                        ""
                                }
                                {
                                    e.concepto == "Alquiler"
                                        ?
                                        (
                                            e.municipalidad
                                                ?
                                                <p className="my-0">Incluye Municipalidad: <b>Si</b></p>
                                                :
                                                <p className="my-0">Incluye Municipalidad: <b>No</b></p>
                                        )
                                        :
                                        ""
                                }
                                <p>Monto: <b>${e.monto}</b> </p>
                            </div>
                            <div className="contenedor-fecha-eliminar">
                                <p> {new Intl.DateTimeFormat('es-ES',).format(e.fecha.fecha.seconds * 1000)}</p>
                                <div>
                                    <FileDownloadIcon onClick={() => dataPdf(e.nombre, e.concepto, e.impuestos, e.expensas,e.municipalidad, e.monto, e.fecha, e.reciboNumero)} cursor={"pointer"} className="icono-recibo"></FileDownloadIcon>
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