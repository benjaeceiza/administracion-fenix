

const FotoNombreInqui = ({ inquilino }) => {

  return (
    <>

      <div key={inquilino.id} className="mg tamano ancho-detail">
        <img src={inquilino.imagen} alt="" />
        <div className="nombre fondo-nombre-inqui">
          <p className="my-3 nombre"> {inquilino.apellido} {inquilino.nombre}</p>
        </div>
      </div>


    </>
  )
}

export default FotoNombreInqui