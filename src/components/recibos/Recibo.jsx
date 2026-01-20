import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteDoc, doc, getDoc, getFirestore } from "firebase/firestore";
import ModalEliminar from "../modal/ModalEliminar";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; 

const Recibo = ({ recibos, setRecargar, limite }) => {

    const [recibosOrdenados, setRecibosOrdenados] = useState([])
    const [modalEliminar, setModalEliminar] = useState(false)
    const [idParaEliminar, setIdParaEliminar] = useState(null)

    useEffect(() => {
        if (recibos) {
            let sortedList = [...recibos].sort((a, b) => (a.fecha?.fecha?.seconds < b.fecha?.fecha?.seconds ? 1 : a.fecha?.fecha?.seconds > b.fecha?.fecha?.seconds ? -1 : 0))
            setRecibosOrdenados(sortedList);
        }
    }, [recibos])

    const confirmarEliminacion = async () => {
        if (!idParaEliminar) return;
        const db = getFirestore();
        try {
            await deleteDoc(doc(db, "recibos", idParaEliminar));
            setRecargar(true);
            setModalEliminar(false);
            setIdParaEliminar(null);
        } catch (error) {
            console.error("Error al eliminar recibo:", error);
        }
    }

    const abrirModalEliminar = (id) => {
        setIdParaEliminar(id);
        setModalEliminar(true);
    }

    // --- FUNCIÓN PDF CON LÓGICA DE ENTREGA VS RECIBO ---
    const dataPdf = async (recibo) => {
        const { nombre, concepto, descripcion, monto, fecha, reciboNumero, tipo, idprop } = recibo;
        let nombreLocador = "";
        
        // Determinar si es un cobro (inquilino) o un pago (propietario)
        const esInquilino = tipo === "inquilinos";

        // Títulos dinámicos según el tipo de persona
        const tituloDoc = esInquilino ? "RECIBO DE COBRO" : "COMPROBANTE DE ENTREGA";
        const textoAccion = esInquilino ? "Recibimos de:" : "Entregamos a:";
        const etiquetaTotal = esInquilino ? "TOTAL PAGADO:" : "TOTAL ENTREGADO:";

        // Buscar datos del propietario SOLO si es inquilino (para poner "por cuenta y orden de")
        if (esInquilino && idprop) {
            try {
                const db = getFirestore();
                const propSnap = await getDoc(doc(db, "propietarios", idprop));
                if (propSnap.exists()) {
                    const d = propSnap.data();
                    nombreLocador = `${d.nombre} ${d.apellido}`;
                }
            } catch (error) { console.error(error); }
        }

        // --- INICIO PDF ---
        const docc = new jsPDF();
        const pageWidth = docc.internal.pageSize.width;
        const pageHeight = docc.internal.pageSize.height;

        // 1. HEADER
        try {
            docc.addImage("https://i.postimg.cc/tTmRfD5f/logo_2.png", "JPG", 10, 10, 40, 0); 
        } catch (e) { }

        // Título dinámico a la derecha
        docc.setFont("helvetica", "bold");
        docc.setFontSize(16);
        docc.text(tituloDoc, pageWidth - 15, 20, { align: 'right' });
        
        docc.setFontSize(10);
        docc.setFont("helvetica", "normal");
        docc.text(`N° Comprobante: ${reciboNumero || "-"}`, pageWidth - 15, 28, { align: 'right' });
        
        const fechaTxt = fecha?.fecha?.seconds 
            ? new Intl.DateTimeFormat('es-AR').format(fecha.fecha.seconds * 1000) 
            : "-";
        docc.text(`Fecha: ${fechaTxt}`, pageWidth - 15, 34, { align: 'right' });

        docc.setDrawColor(200, 200, 200);
        docc.line(15, 40, pageWidth - 15, 40);

        // 2. DATOS DE LA PERSONA (Dinámicos)
        docc.setFontSize(11);
        
        // Aquí cambia: "Recibimos de" vs "Entregamos a"
        docc.text(`${textoAccion} ${nombre}`, 15, 50);
        docc.text(`Localidad: Villa Mercedes (San Luis)`, 15, 56);
        
       

        // 3. TABLA
        const conceptoFinal = descripcion ? descripcion : concepto;
        
        autoTable(docc, {
            startY: 70,
            head: [['Concepto / Descripción', 'Importe']],
            body: [
                [conceptoFinal, `$ ${monto}`]
            ],
            theme: 'grid', 
            headStyles: { 
                fillColor: esInquilino ? [41, 128, 185] : [39, 174, 96], // Azul para cobros, Verde para pagos (opcional)
                textColor: 255,
                halign: 'center'
            },
            columnStyles: {
                0: { halign: 'left' }, 
                1: { halign: 'right', fontStyle: 'bold' } 
            },
            styles: { fontSize: 12, cellPadding: 4 }
        });

        // 4. TOTAL
        const finalY = docc.lastAutoTable.finalY + 10;
        docc.setFont("helvetica", "bold");
        docc.setFontSize(12);
        docc.text(`${etiquetaTotal} $ ${monto}`, pageWidth - 15, finalY, { align: 'right' });

        // 5. FOOTER
        const footerY = pageHeight - 50; 
        try {
            docc.addImage("https://i.postimg.cc/tTmRfD5f/logo_2.png", "JPG", 15, footerY, pageWidth - 30, 30);
        } catch (e) { }
        
        docc.setFontSize(8);
        docc.setFont("helvetica", "italic");
        docc.setTextColor(100);
        docc.text('Fenix Propiedades SRL actúa a cuenta y orden de terceros.', pageWidth / 2, pageHeight - 10, { align: 'center' });
        
        docc.save(`${esInquilino ? 'Recibo' : 'Entrega'}_${nombre}.pdf`);
    }

    return (
        <>
            {modalEliminar && (
                <ModalEliminar 
                    setModalEliminar={setModalEliminar} 
                    accionConfirmar={confirmarEliminacion} 
                />
            )}

            <div key={Math.random()} className="contenedor-recibos">
                {recibosOrdenados.slice(0, limite).map(e => (
                    <div key={e.id} className="contenedor-recibo">
                        <div className="mostrar-recibo">
                            <div className={e.tipo === "inquilinos" ? "div-nombre" : "div-nombre-prop"}>
                                <p>{e.nombre} ({e.tipo})</p>
                            </div>
                            <div className="contenido-recibo">
                                <label className="label-datos">En concepto de:</label>
                                <div className="div-concepto input-nombre-nota">
                                    {e.descripcion ? <p>{e.descripcion}</p> : <p>{e.concepto}</p>}
                                </div>
                                <p>Monto: <b>${e.monto}</b> </p>
                            </div>
                            <div className="contenedor-fecha-eliminar">
                                <p> 
                                    {e.fecha?.fecha?.seconds 
                                        ? new Intl.DateTimeFormat('es-AR').format(e.fecha.fecha.seconds * 1000)
                                        : "Sin fecha"}
                                </p>
                                <div>
                                    <FileDownloadIcon 
                                        onClick={() => dataPdf(e)} 
                                        style={{ cursor: "pointer" }} 
                                        className="icono-recibo" 
                                    />
                                    <DeleteIcon 
                                        className="icono-recibo" 
                                        style={{ cursor: "pointer" }}
                                        onClick={() => abrirModalEliminar(e.id)} 
                                    />
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