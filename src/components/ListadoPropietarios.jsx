import Propietarios from "./Propietarios";
import BotonAgregar from "./botones/BotonAgregar";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import Cargando from "./load/Cargando";





const ListadoPropietarios = () => {

  let propietarios;
  const [propietariosOrdenados, setPropietariosOrdenados] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {

    const db = getFirestore();
    const itemCollection = collection(db, "propietarios");


    getDocs(itemCollection).then(Snapshot => {

      if (Snapshot.size > 0) {

        propietarios = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
        setPropietariosOrdenados([...propietarios].sort((a, b) => (a.apellido > b.apellido ? 1 : a.apellido < b.apellido ? -1 : 0)))
        setCargando(false)

      } else {
        console.error("error")
      }
    })



  }, [])



  return (
    <>{cargando ? <Cargando /> :
      <div className="container my-5">
        <div className="text-end">
         
          <BotonAgregar />
        </div>
        <div className="contenedor-propietarios text-center">
          <Propietarios propietario={propietariosOrdenados} />
        </div>
      </div>
    }
    </>
  )
}

export default ListadoPropietarios;