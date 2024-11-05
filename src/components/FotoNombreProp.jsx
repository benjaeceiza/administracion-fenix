

const FotoNombreProp = ({ propietario }) => {

    return (

        <>
            <div key={propietario.id} className="mg tamano ancho-detail">
                    <img className="" src={propietario.imagen} alt={propietario.nombre} />
                <div className="nombre fondo-nombre">
                    <p className="my-3 nombre">{propietario.apellido} {propietario.nombre} </p>
                </div>
            </div>

        </>

    )

}


export default FotoNombreProp;