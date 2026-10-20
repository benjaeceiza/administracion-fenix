import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "notas";
const notasCollection = collection(db, COLLECTION_NAME);

const getNotaSeconds = (nota) => {
  if (nota?.fecha?.seconds) return nota.fecha.seconds;
  if (nota?.fecha instanceof Date) return Math.floor(nota.fecha.getTime() / 1000);
  return 0;
};

const sortByFechaDesc = (items) =>
  [...items].sort((a, b) => getNotaSeconds(b) - getNotaSeconds(a));

/**
 * Obtiene todas las notas ordenadas por fecha descendente.
 */
export const getNotas = async () => {
  const snapshot = await getDocs(notasCollection);
  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return sortByFechaDesc(docs);
};

/**
 * Crea una nueva nota con fecha actual.
 */
export const createNota = async ({ nombre, nota }) => {
  const nuevaNota = {
    nombre: nombre.trim(),
    nota: nota.trim(),
    fecha: new Date(),
  };
  const docRef = await addDoc(notasCollection, nuevaNota);
  return docRef.id;
};

/**
 * Elimina una nota por su ID.
 */
export const deleteNota = async (id) => {
  if (!id) return;
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
