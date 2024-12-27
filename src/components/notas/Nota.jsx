import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useEffect, useState } from 'react';
import ModalEliminar from '../modal/ModalEliminar';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';



const Nota = ({ notas, setRecargar, limite }) => {

  const [modalEliminar, setModalEliminar] = useState(false)
  const [eliminar, setEliminar] = useState(false)
  const [notaSeleccionada, setNotaSeleccionada] = useState("")


  useEffect(() => {
    if (eliminar) {
      const db = getFirestore()
      const docRef = doc(db, "notas", notaSeleccionada);

      deleteDoc(docRef).then(
        setModalEliminar(false),
        setEliminar(false),
        setRecargar(true)
      )
    }


  }, [eliminar])

  const controlEliminarNota = (id) => {
    setModalEliminar(true)
    setNotaSeleccionada(id)

  }

  notas.map(notas => {
    console.log(new Date(notas.fecha.seconds * 1000).getMonth())
  })
  return (
    <>
      {modalEliminar
        ?
        <ModalEliminar setModalEliminar={setModalEliminar} setEliminar={setEliminar} />
        :
        ""
      }

      {notas.slice(0, limite).map(notas => (
        <div key={notas.id} className="col my-5 text-center">
          <div className="contenedor-notas">
            <div className="nombre-nota">
              <p>{notas.nombre}</p>
            </div>
            <p className="cuerpo-nota">{notas.nota}</p>
            <div className="contenedor-fecha-eliminar">
              <p>{new Intl.DateTimeFormat('es-ES',).format(notas.fecha.seconds * 1000)}</p>
              <DeleteRoundedIcon className="text-black" onClick={() => controlEliminarNota(notas.id)}></DeleteRoundedIcon>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default Nota