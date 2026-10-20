import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { getPropietarioById } from "../services/propietarios.service";
import { formatDate, formatCurrency } from "./formatters";
import logoFenix from "../assets/logo-2.png";
import pieRecibo from "../assets/pie-recibo.jpeg";

/**
 * Genera y descarga el comprobante en PDF de un recibo (Inquilino o Propietario)
 * con diseño corporativo profesional y proporciones cuidadas.
 */
export const generarReciboPdf = async (recibo) => {
  const {
    nombre,
    concepto,
    descripcion,
    monto,
    fecha,
    reciboNumero,
    tipo,
    idprop,
    expensas,
    impuestos,
    municipalidad,
  } = recibo;

  const esInquilino = tipo === "inquilinos";
  const tituloDoc = esInquilino ? "RECIBO DE COBRO" : "COMPROBANTE DE ENTREGA";
  const subtituloDoc = esInquilino
    ? "Comprobante de pago de locación"
    : "Liquidación y entrega a propietario";
  const textoAccion = esInquilino ? "RECIBIMOS DE" : "ENTREGAMOS A";
  const etiquetaTotal = esInquilino ? "TOTAL ABONADO" : "TOTAL ENTREGADO";

  let nombreLocador = "";
  if (esInquilino && idprop) {
    try {
      const propietario = await getPropietarioById(idprop);
      if (propietario) {
        nombreLocador = `${propietario.apellido || ""} ${propietario.nombre || ""}`.trim();
      }
    } catch (error) {
      console.error("Error obteniendo propietario para PDF:", error);
    }
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const marginX = 15;
  const contentWidth = pageWidth - marginX * 2;

  // 1. Franja superior corporativa
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 5, "F");
  doc.setFillColor(217, 119, 6); // Amber / Dorado Fénix
  doc.rect(0, 5, pageWidth, 1.2, "F");

  // 2. Cabecera con Logo (proporción original 4:3 sin deformar) y Datos del Comprobante
  try {
    doc.addImage(logoFenix, "PNG", marginX, 12, 38, 28);
  } catch {
    // Fallback tipográfico si no carga la imagen
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text("FENIX PROPIEDADES", marginX, 24);
  }

  // Bloque derecho: Título y numeración
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(tituloDoc, pageWidth - marginX, 18, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(subtituloDoc, pageWidth - marginX, 23.5, { align: "right" });

  // Caja de N° de comprobante y fecha
  const metaBoxWidth = 68;
  const metaBoxX = pageWidth - marginX - metaBoxWidth;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(metaBoxX, 27, metaBoxWidth, 15, 2, 2, "FD");

  const numFormateado = reciboNumero
    ? `#${String(reciboNumero).padStart(4, "0")}`
    : "-";

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Comprobante N°: ${numFormateado}`, pageWidth - marginX - 4, 33, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Fecha: ${formatDate(fecha)}`, pageWidth - marginX - 4, 38.5, {
    align: "right",
  });

  // Línea separadora
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(marginX, 47, pageWidth - marginX, 47);

  // 3. Tarjeta de datos del destinatario
  const cardY = 53;
  const cardHeight = nombreLocador ? 30 : 24;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, cardY, contentWidth, cardHeight, 2.5, 2.5, "FD");

  // Columna izquierda: Destinatario
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(textoAccion, marginX + 5, cardY + 7);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(nombre || "-", marginX + 5, cardY + 14);

  if (nombreLocador) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `Por cuenta y orden de: ${nombreLocador}`,
      marginX + 5,
      cardY + 22
    );
  }

  // Columna derecha: Ubicación y Administración
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("LUGAR DE EMISIÓN", pageWidth - marginX - 5, cardY + 7, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(
    "Villa Mercedes, San Luis",
    pageWidth - marginX - 5,
    cardY + 14,
    { align: "right" }
  );

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Administración Fénix • Belgrano 486",
    pageWidth - marginX - 5,
    cardY + 20,
    { align: "right" }
  );

  // 4. Tabla de Concepto e Importe
  const incluyeExtras = [
    expensas ? "Expensas" : null,
    impuestos ? "Impuestos" : null,
    municipalidad ? "Municipalidad" : null,
  ].filter(Boolean);

  const tituloConcepto = concepto || "Comprobante";
  const detalleConcepto = descripcion
    ? `${tituloConcepto} — ${descripcion}`
    : tituloConcepto;

  const filasTabla = [[detalleConcepto, formatCurrency(monto)]];

  if (incluyeExtras.length > 0) {
    filasTabla.push([
      `Conceptos adicionales incluidos: ${incluyeExtras.join(" • ")}`,
      "Incluido",
    ]);
  }

  const montoFormateado = formatCurrency(monto);

  autoTable(doc, {
    startY: cardY + cardHeight + 8,
    margin: { left: marginX, right: marginX },
    head: [["Concepto / Descripción de la Operación", "Importe"]],
    body: filasTabla,
    theme: "grid",
    headStyles: {
      fillColor: esInquilino ? [13, 148, 136] : [15, 23, 42],
      textColor: 255,
      fontSize: 10,
      fontStyle: "bold",
      halign: "left",
      cellPadding: 4,
    },
    columnStyles: {
      0: {
        cellWidth: contentWidth - 48,
        halign: "left",
        valign: "middle",
      },
      1: {
        cellWidth: 48,
        halign: "right",
        valign: "middle",
        fontStyle: "bold",
      },
    },
    styles: {
      fontSize: 10.5,
      cellPadding: 5,
      textColor: [30, 41, 59],
      lineColor: [203, 213, 225],
      lineWidth: 0.3,
    },
    didParseCell: (data) => {
      if (data.section === "head" && data.column.index === 1) {
        data.cell.styles.halign = "right";
      }
    },
  });

  // 5. Recuadro de Total Destacado
  const finalY = doc.lastAutoTable.finalY + 8;
  const totalBoxWidth = 88;
  const totalBoxX = pageWidth - marginX - totalBoxWidth;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(totalBoxX, finalY, totalBoxWidth, 14, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text(etiquetaTotal, totalBoxX + 5, finalY + 8.8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12.5);
  doc.setTextColor(15, 23, 42);
  doc.text(montoFormateado, pageWidth - marginX - 5, finalY + 9, {
    align: "right",
  });

  // 6. Línea de Firma y Sello
  const firmaY = Math.max(finalY + 42, 175);
  const firmaLineX1 = pageWidth - marginX - 65;
  const firmaLineX2 = pageWidth - marginX - 5;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(firmaLineX1, firmaY, firmaLineX2, firmaY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(
    "Por Fénix Propiedades",
    (firmaLineX1 + firmaLineX2) / 2,
    firmaY + 5,
    { align: "center" }
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Firma y aclaración",
    (firmaLineX1 + firmaLineX2) / 2,
    firmaY + 9.5,
    { align: "center" }
  );

  // 7. Pie Institucional (proporción exacta sin estirar)
  try {
    // pie-recibo.jpeg tiene proporción 1600x957 (~1.67:1)
    const imgWidth = 115;
    const imgHeight = 68;
    const imgX = (pageWidth - imgWidth) / 2;
    doc.addImage(pieRecibo, "JPEG", imgX, pageHeight - 78, imgWidth, imgHeight);
  } catch {
    // Fallback limpio si no carga la imagen
  }

  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, pageHeight - 16, pageWidth - marginX, pageHeight - 16);

  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Fénix Propiedades SRL actúa por cuenta y orden de terceros • Belgrano 486, Villa Mercedes (San Luis)",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  const safeName = (nombre || "Comprobante").replace(/\s+/g, "_");
  doc.save(`${esInquilino ? "Recibo" : "Entrega"}_${safeName}.pdf`);
};
