
import { useEffect, useState } from 'react';
import BotonAgregarNota from '../botones/BotonAgregarNota';
import FiltroNotas from './FiltroNotas';
import Nota from "./Nota"
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import Cargando from "../load/Cargando"


const Notas = () => {

  const [notas, setNotas] = useState([])
  const [cargando, setCargando] = useState(true)


  useEffect(() => {

    const db = getFirestore()
    const itemCollection = collection(db, "notas")

    getDocs(itemCollection).then(Snapshot => {

      if (Snapshot.size > 0) {
        let notasPrev = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
        notasPrev = [...notasPrev].sort((a, b) => (a.fecha.seconds < b.fecha.seconds ? 1 : a.fecha.seconds > b.fecha.seconds ? -1 : 0))
        setNotas(notasPrev)
        setCargando(false)


      } else {
        console.error("error")
      }
    })

  }, [])


  return (
    <>
      <FiltroNotas notas={notas} setNotas={setNotas} setCargando={setCargando} />
      {
        cargando
          ?
          <Cargando />
          :
          <div className="container">
            <BotonAgregarNota />
            <div className="row my-5">
              <Nota notas={notas} />
            </div>
          </div>}
    </>
  )
}


export default Notas;