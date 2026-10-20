import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "inquilinos";
const inquilinosCollection = collection(db, COLLECTION_NAME);

const sortByApellido = (items) =>
  [...items].sort((a, b) =>
    (a.apellido || "").localeCompare(b.apellido || "", "es", { sensitivity: "base" })
  );

/**
 * Suscripción en tiempo real a la colección de inquilinos.
 */
export const subscribeInquilinos = (onData, onError) => {
  return onSnapshot(
    inquilinosCollection,
    (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onData(sortByApellido(docs));
    },
    (error) => {
      console.error("Error en suscripción de inquilinos:", error);
      if (onError) onError(error);
    }
  );
};

/**
 * Obtiene todos los inquilinos ordenados por apellido.
 */
export const getInquilinos = async () => {
  const snapshot = await getDocs(inquilinosCollection);
  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return sortByApellido(docs);
};

/**
 * Obtiene los inquilinos asociados a un propietario específico mediante query filtrada en Firestore.
 */
export const getInquilinosByPropietario = async (idPropietario) => {
  if (!idPropietario) return [];
  const q = query(inquilinosCollection, where("idprop", "==", idPropietario));
  const snapshot = await getDocs(q);
  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return sortByApellido(docs);
};

/**
 * Obtiene un inquilino por su ID.
 */
export const getInquilinoById = async (id) => {
  if (!id) return null;
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

/**
 * Crea un nuevo inquilino.
 */
export const createInquilino = async (inquilinoData) => {
  const docRef = await addDoc(inquilinosCollection, inquilinoData);
  return docRef.id;
};

/**
 * Actualiza un inquilino existente.
 */
export const updateInquilino = async (id, data) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
};

/**
 * Elimina un inquilino por su ID.
 */
export const deleteInquilino = async (id) => {
  if (!id) return;
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
