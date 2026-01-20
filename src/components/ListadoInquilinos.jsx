import { collection, onSnapshot, getFirestore, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import Cargando from "./load/Cargando";
import AvisoVencimiento from "./vencimiento/AvisoVencimiento";
import BotonAgregarInqulino from "./botones/BotonAgregarInquilino";
import InquilinoCard from "./InquilinoCard";
import ModalEliminar from "./modal/ModalEliminar";

const ListadoInquilinos = () => {

    const [todosInquilinos, setTodosInquilinos] = useState([]); // Todos los datos
    const [inquilinosMostrados, setInquilinosMostrados] = useState([]); // Datos filtrados
    
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    // Estados para el Modal de Eliminar
    const [modalEliminar, setModalEliminar] = useState(false);
    const [idEliminar, setIdEliminar] = useState(null);

    // 1. Carga de datos en Tiempo Real
    useEffect(() => {
        const db = getFirestore();
        const itemCollection = collection(db, "inquilinos");

        const unsubscribe = onSnapshot(itemCollection, (snapshot) => {
            const docs = snapshot.docs.map(documento => ({ 
                id: documento.id, 
                ...documento.data() 
            }));

            // Ordenar por apellido
            const docsOrdenados = docs.sort((a, b) => 
                (a.apellido > b.apellido ? 1 : a.apellido < b.apellido ? -1 : 0)
            );

            setTodosInquilinos(docsOrdenados);
            setCargando(false);
        }, (error) => {
            console.error("Error listando inquilinos:", error);
            setCargando(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Filtro de Búsqueda
    useEffect(() => {
        if (busqueda === "") {
            setInquilinosMostrados(todosInquilinos);
        } else {
            const termino = busqueda.toUpperCase();
            const filtrados = todosInquilinos.filter(i => 
                (i.nombre && i.nombre.toUpperCase().includes(termino)) || 
                (i.apellido && i.apellido.toUpperCase().includes(termino))
            );
            setInquilinosMostrados(filtrados);
        }
    }, [busqueda, todosInquilinos]);

    // 3. Función para ELIMINAR (Se la pasamos al Modal)
    const confirmarEliminacion = async () => {
        if (!idEliminar) return;
        
        const db = getFirestore();
        try {
            await deleteDoc(doc(db, "inquilinos", idEliminar));
            // Opcional: Agregar lógica si necesitas borrar pagos asociados a este inquilino
            console.log("Inquilino eliminado");
        } catch (error) {
            console.error("Error al eliminar:", error);
        } finally {
            setModalEliminar(false);
            setIdEliminar(null);
        }
    };

    // Handler para abrir el modal (se lo pasamos a InquilinoCard)
    const handleAbrirModal = (id) => {
        setIdEliminar(id);
        setModalEliminar(true);
    };

    return (
        <>
          
            {modalEliminar && (
                <ModalEliminar 
                    setModalEliminar={setModalEliminar} 
                    accionConfirmar={confirmarEliminacion} 
                />
            )}

            <AvisoVencimiento inquilinos={todosInquilinos} />

            {cargando ? <Cargando /> : (
                <div className="container my-5">
                    <div className="row mb-4 align-items-center">
                        <div className="col-md-6">
                            <input 
                                type="text"
                                className="form-control search-input"
                                placeholder="Buscar inquilino..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6 text-end mt-3 mt-md-0">
                            <BotonAgregarInqulino />
                        </div>
                    </div>

                    <div className="contenedor-propietarios text-center">
                        {/* Pasamos los datos Y la función para abrir el modal */}
                        <InquilinoCard 
                            inquilinosOrdenados={inquilinosMostrados} 
                            onDelete={handleAbrirModal} 
                        />
                    </div>
                </div>
            )}
        </>
    );
}

export default ListadoInquilinos;