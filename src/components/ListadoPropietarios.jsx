import { collection, onSnapshot, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import Cargando from "./load/Cargando";
import BotonAgregar from "./botones/BotonAgregar";
import Propietarios from "./Propietarios";

const ListadoPropietarios = () => {

  const [todosLosPropietarios, setTodosLosPropietarios] = useState([]);
  const [propietariosMostrados, setPropietariosMostrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  // 1. Conexión a Firebase (Tiempo Real)
  useEffect(() => {
    const db = getFirestore();
    const itemCollection = collection(db, "propietarios");

    const unsubscribe = onSnapshot(itemCollection, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Ordenar por Apellido
      const docsOrdenados = docs.sort((a, b) =>
        (a.apellido > b.apellido ? 1 : a.apellido < b.apellido ? -1 : 0)
      );

      setTodosLosPropietarios(docsOrdenados);
      setCargando(false);
    }, (error) => {
      console.error("Error:", error);
      setCargando(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Buscador
  useEffect(() => {
    if (!busqueda) {
      setPropietariosMostrados(todosLosPropietarios);
    } else {
      const termino = busqueda.toUpperCase();
      const filtrados = todosLosPropietarios.filter(p =>
        (p.nombre && p.nombre.toUpperCase().includes(termino)) ||
        (p.apellido && p.apellido.toUpperCase().includes(termino))
      );
      setPropietariosMostrados(filtrados);
    }
  }, [busqueda, todosLosPropietarios]);

  return (
    <>
      {cargando ? <Cargando /> :
        <div className="container my-5">

          <div className="row mb-4 align-items-center">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control search-input"
                placeholder="Buscar propietario..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="col-md-6 text-end mt-3 mt-md-0">
              <BotonAgregar />
            </div>
          </div>

          <div className="contenedor-propietarios text-center">
            {/* Renderizamos la Tabla si hay datos */}
            {propietariosMostrados.length > 0 ? (
              <Propietarios propietarios={propietariosMostrados} />
            ) : (
              <h3 className="text-muted mt-5">No se encontraron resultados.</h3>
            )}
          </div>
        </div>
      }
    </>
  );
}

export default ListadoPropietarios;