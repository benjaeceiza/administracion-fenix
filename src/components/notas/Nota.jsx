import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';


const Nota = ({notas}) => {

  return (
    <>
      {notas.map(notas => (
        <div key={notas.id} className="col my-5 text-center">
          <div className="contenedor-notas">
            <div className="nombre-nota">
              <p>{notas.nombre}</p>
            </div>
            <p className="cuerpo-nota">{notas.nota}</p>
            <div className="contenedor-fecha-eliminar">
              <p>{new Intl.DateTimeFormat('es-ES',).format(notas.fecha.seconds * 1000)}</p>
              <DeleteRoundedIcon className="text-black"></DeleteRoundedIcon>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default Nota