
import { useEffect, useState } from 'react';
import BotonAgregarNota from '../botones/BotonAgregarNota';
import FiltroNotas from './FiltroNotas';
import Nota from "./Nota"
import { collection, getDocs, getFirestore, limit, query } from 'firebase/firestore';
import Cargando from "../load/Cargando"


const Notas = () => {

  const [notas, setNotas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [limite, setLimite] = useState(5)
  const [recargar, setRecargar] = useState(false)


  useEffect(() => {

    const db = getFirestore()
    const q = query(
      collection(db, "notas"),
      limit(limite)
    )


    getDocs(q).then(Snapshot => {

      if (Snapshot.size > 0) {
        let notasPrev = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
        notasPrev = [...notasPrev].sort((a, b) => (a.fecha.seconds < b.fecha.seconds ? 1 : a.fecha.seconds > b.fecha.seconds ? -1 : 0))
        setNotas(notasPrev)
        setCargando(false)


      } else {
        console.error("error")
      }
    })

  }, [limite])

  useEffect(() => {

    if (recargar) {

      const db = getFirestore()
      const q = query(
        collection(db, "notas"),
        limit(limite)
      )


      getDocs(q).then(Snapshot => {

        if (Snapshot.size > 0) {
          let notasPrev = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
          notasPrev = [...notasPrev].sort((a, b) => (a.fecha.seconds < b.fecha.seconds ? 1 : a.fecha.seconds > b.fecha.seconds ? -1 : 0))
          setNotas(notasPrev)
          setCargando(false)


        } else {
          console.error("error")
        }
      })

      setRecargar(false)
    }


  }, [recargar])


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
            {notas.length == 0
              ?
              <h3 className='text-center my-5'>NO SE ENCONTRARON NOTAS</h3>
              :
              <div className="row my-5">
                <Nota notas={notas} setRecargar={setRecargar} />
                <p className='text-center' onClick={() => setLimite(limite + 5)}>Ver Mas</p>
              </div>
            }
          </div>}
    </>
  )
}


export default Notas;