
import { Link } from "react-router-dom"
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import CargandoInquilinos from "./CargandoInquilinos";




const inquilinos = (id) => {

  let arrayDeInquilinos;
  const [inquilino, setInquilino] = useState([])
  const [cargador, setCargador] = useState(true);

  useEffect(() => {

    const db = getFirestore();
    const itemCollection = collection(db, "inquilinos");




    getDocs(itemCollection).then(Snapshot => {

      if (Snapshot.size > 0) {

        arrayDeInquilinos = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
        setInquilino(arrayDeInquilinos.filter(e => e.idprop == id.idPropietario))
        setCargador(false)

      } else {
        console.error("error")
      }
    })


  }, [])


  if (inquilino.length == 0) {
    return (
      <>
        {cargador ? <CargandoInquilinos /> : <div className="contenedor-inqui">
          <h3 className="my-3">Sin Inquilinos</h3>
        </div>}
      </>
    )
  }



  return (

    <>

      {cargador ? <CargandoInquilinos /> :
        <div className="contenedor-inqui">
          {inquilino.map(e => (
            <div className="img-nombre opacidad" key={e.id} >
              <Link to={"/inquilino/" + e.id}><img height={80} src={e.imagen} alt="" /></Link>
              <p>{e.apellido}</p>
            </div>  
          ))}
        </div>}


    </>
  )
}

export default inquilinos