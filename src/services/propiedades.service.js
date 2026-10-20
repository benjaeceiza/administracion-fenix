import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "propiedades";
const propiedadesCollection = collection(db, COLLECTION_NAME);

/**
 * Obtiene las propiedades asociadas a un propietario específico.
 */
export const getPropiedadesByPropietario = async (idPropietario) => {
  if (!idPropietario) return [];
  const q = query(propiedadesCollection, where("idprop", "==", idPropietario));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
};

/**
 * Crea una nueva propiedad para un propietario.
 */
export const createPropiedad = async (propiedadData) => {
  const docRef = await addDoc(propiedadesCollection, propiedadData);
  return docRef.id;
};

/**
 * Elimina una propiedad por su ID.
 */
export const deletePropiedad = async (id) => {
  if (!id) return;
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};
