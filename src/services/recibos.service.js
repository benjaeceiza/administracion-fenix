import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "recibos";
const NUMERO_RECIBOS_COLLECTION = "numeroRecibos";
const NUMERO_RECIBOS_DOC_ID = "AVEBwfSCF0yvfbmTliaI";

const recibosCollection = collection(db, COLLECTION_NAME);

const getTimestampSeconds = (recibo) => {
  if (recibo?.fecha?.fecha?.seconds) return recibo.fecha.fecha.seconds;
  if (recibo?.fecha?.seconds) return recibo.fecha.seconds;
  if (recibo?.fecha?.fecha instanceof Date) {
    return Math.floor(recibo.fecha.fecha.getTime() / 1000);
  }
  return 0;
};

const sortByFechaAsc = (items) =>
  [...items].sort((a, b) => {
    const diff = getTimestampSeconds(a) - getTimestampSeconds(b);
    if (diff !== 0) return diff;
    return String(a.id).localeCompare(String(b.id));
  });

const sortByFechaDesc = (items) =>
  [...items].sort((a, b) => {
    const diff = getTimestampSeconds(b) - getTimestampSeconds(a);
    if (diff !== 0) return diff;
    return (Number(b.reciboNumero) || 0) - (Number(a.reciboNumero) || 0);
  });

/**
 * Verifica si existen números de recibo duplicados o faltantes y los repara
 * secuencialmente por orden cronológico en Firestore, actualizando también el contador global.
 */
const normalizarNumerosDeRecibos = async (docs) => {
  if (!docs || docs.length === 0) return docs;

  const numerosVistos = new Set();
  let hayDuplicadosOSinNumero = false;

  for (const r of docs) {
    const num = Number(r.reciboNumero);
    if (!num || numerosVistos.has(num)) {
      hayDuplicadosOSinNumero = true;
      break;
    }
    numerosVistos.add(num);
  }

  if (!hayDuplicadosOSinNumero) {
    return docs;
  }

  // Ordenar de más antiguo a más reciente para asignar numeración correlativa única (1..N)
  const ordenadosAsc = sortByFechaAsc(docs);
  const pendientesActualizar = [];

  ordenadosAsc.forEach((recibo, idx) => {
    const numeroCorrelativo = idx + 1;
    if (Number(recibo.reciboNumero) !== numeroCorrelativo) {
      recibo.reciboNumero = numeroCorrelativo;
      pendientesActualizar.push({
        id: recibo.id,
        reciboNumero: numeroCorrelativo,
      });
    }
  });

  // Persistir la corrección en lotes de hasta 450 operaciones (límite Firestore: 500)
  try {
    const CHUNK_SIZE = 450;
    for (let i = 0; i < pendientesActualizar.length; i += CHUNK_SIZE) {
      const chunk = pendientesActualizar.slice(i, i + CHUNK_SIZE);
      const batch = writeBatch(db);
      chunk.forEach((item) => {
        batch.update(doc(db, COLLECTION_NAME, item.id), {
          reciboNumero: item.reciboNumero,
        });
      });
      await batch.commit();
    }

    // Actualizar contador global con el total real
    const contadorRef = doc(db, NUMERO_RECIBOS_COLLECTION, NUMERO_RECIBOS_DOC_ID);
    await updateDoc(contadorRef, { numeroRecibo: ordenadosAsc.length });
  } catch (error) {
    console.error("Error sincronizando numeración única de recibos:", error);
  }

  return ordenadosAsc;
};

/**
 * Obtiene todos los recibos ordenados por fecha descendente y garantiza numeración única.
 */
export const getRecibos = async () => {
  const snapshot = await getDocs(recibosCollection);
  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  const normalizados = await normalizarNumerosDeRecibos(docs);
  return sortByFechaDesc(normalizados);
};

/**
 * Obtiene un recibo por su ID.
 */
export const getReciboById = async (id) => {
  if (!id) return null;
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

/**
 * Obtiene los últimos recibos de alquiler de un inquilino por su nombre completo ("Apellido Nombre").
 */
export const getRecibosAlquilerByNombre = async (
  nombreCompleto,
  maxResults = 3
) => {
  if (!nombreCompleto) return [];
  const q = query(
    recibosCollection,
    where("concepto", "==", "Alquiler"),
    where("nombre", "==", nombreCompleto)
  );
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return sortByFechaDesc(docs).slice(0, maxResults);
};

/**
 * Obtiene el número actual de recibos desde la colección numeroRecibos.
 */
export const getNumeroReciboActual = async () => {
  const docRef = doc(db, NUMERO_RECIBOS_COLLECTION, NUMERO_RECIBOS_DOC_ID);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return 0;
  return Number(snapshot.data().numeroRecibo) || 0;
};

/**
 * Crea un recibo usando una transacción atómica para garantizar que el número
 * de comprobante nunca se repita, y si es de concepto "Alquiler" marca `alquiler: true`.
 */
export const createRecibo = async (reciboData) => {
  const contadorRef = doc(db, NUMERO_RECIBOS_COLLECTION, NUMERO_RECIBOS_DOC_ID);
  const nuevoReciboRef = doc(recibosCollection);

  const siguienteNumero = await runTransaction(db, async (transaction) => {
    const contadorSnap = await transaction.get(contadorRef);
    const numeroActual = contadorSnap.exists()
      ? Number(contadorSnap.data().numeroRecibo) || 0
      : 0;
    const nuevoNumero = numeroActual + 1;

    transaction.set(nuevoReciboRef, {
      ...reciboData,
      reciboNumero: nuevoNumero,
    });

    if (contadorSnap.exists()) {
      transaction.update(contadorRef, { numeroRecibo: nuevoNumero });
    } else {
      transaction.set(contadorRef, { numeroRecibo: nuevoNumero });
    }

    if (
      reciboData.concepto === "Alquiler" &&
      reciboData.tipo &&
      reciboData.idPersona
    ) {
      const personaRef = doc(db, reciboData.tipo, reciboData.idPersona);
      transaction.update(personaRef, { alquiler: true });
    }

    return nuevoNumero;
  });

  return siguienteNumero;
};

/**
 * Elimina un recibo por su ID.
 */
export const deleteRecibo = async (id) => {
  if (!id) return;
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
