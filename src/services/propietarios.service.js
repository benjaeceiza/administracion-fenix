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

const COLLECTION_NAME = "propietarios";
const propietariosCollection = collection(db, COLLECTION_NAME);

const sortByApellido = (items) =>
  [...items].sort((a, b) =>
    (a.apellido || "").localeCompare(b.apellido || "", "es", { sensitivity: "base" })
  );

/**
 * Suscripción en tiempo real a la colección de propietarios.
 */
export const subscribePropietarios = (onData, onError) => {
  return onSnapshot(
    propietariosCollection,
    (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onData(sortByApellido(docs));
    },
    (error) => {
      console.error("Error en suscripción de propietarios:", error);
      if (onError) onError(error);
    }
  );
};

/**
 * Obtiene todos los propietarios ordenados por apellido.
 */
export const getPropietarios = async () => {
  const snapshot = await getDocs(propietariosCollection);
  const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  return sortByApellido(docs);
};

/**
 * Obtiene un propietario por su ID.
 */
export const getPropietarioById = async (id) => {
  if (!id) return null;
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
};

/**
 * Crea un nuevo propietario.
 */
export const createPropietario = async (propietarioData) => {
  const docRef = await addDoc(propietariosCollection, propietarioData);
  return docRef.id;
};

/**
 * Actualiza los datos de un propietario existente.
 */
export const updatePropietario = async (id, data) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, data);
};

/**
 * Elimina un propietario junto con sus inquilinos y propiedades asociadas.
 */
export const deletePropietario = async (id) => {
  if (!id) return;
  const inquilinosQuery = query(collection(db, "inquilinos"), where("idprop", "==", id));
  const propiedadesQuery = query(collection(db, "propiedades"), where("idprop", "==", id));

  const [inquilinosSnap, propiedadesSnap] = await Promise.all([
    getDocs(inquilinosQuery),
    getDocs(propiedadesQuery),
  ]);

  const deletePromises = [
    ...inquilinosSnap.docs.map((d) => deleteDoc(doc(db, "inquilinos", d.id))),
    ...propiedadesSnap.docs.map((d) => deleteDoc(doc(db, "propiedades", d.id))),
    deleteDoc(doc(db, COLLECTION_NAME, id)),
  ];

  await Promise.all(deletePromises);
};
