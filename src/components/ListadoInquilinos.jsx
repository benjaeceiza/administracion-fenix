import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Cargando from "./Cargando"
import AvisoVencimiento from "./AvisoVencimiento";



const ListadoIquilinos = () => {

  let inquilinos;
  const [inquilinosOrdenados, setInquilinosOrdenados] = useState([]);
  const [cargando, setCargando] = useState(true);
 
  useEffect(() => {

    const db = getFirestore();

    const itemCollection = collection(db, "inquilinos");

    getDocs(itemCollection).then(Snapshot => {

      if (Snapshot.size > 0) {

        inquilinos = (Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() })));
        setInquilinosOrdenados([...inquilinos].sort((a, b) => (a.apellido > b.apellido ? 1 : a.apellido < b.apellido ? -1 : 0)))
        setCargando(false)
      } else {
        console.error("error")
      }
    })




  }, [])



  return (
    <>

      <AvisoVencimiento  inquilinos={inquilinosOrdenados}/>
  
      {cargando ? <Cargando /> : <div className="container">
        <div className="contenedor-propietarios text-center ">
          {inquilinosOrdenados.map(e => (
            <Link key={e.id} to={"/inquilino/" + e.id} style={{ textDecoration: "none" }}> <div className="col-3 my-5 ancho opacidad">
              <img src={e.imagen} alt={e.nombre} />
              <div className="fondo-nombre-inqui">
                <p className="my-3 nombre">{e.apellido} {e.nombre}</p>
              </div>
            </div></Link>
          ))}

        </div>
      </div>}


    </>
  )
}

export default ListadoIquilinos