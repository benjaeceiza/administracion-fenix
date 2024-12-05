

const ModalEliminar = ({setModalEliminar,setEliminar}) => {

    const eliminar =  () => {
      setEliminar(true)
      setModalEliminar(false)
    }

    return (
        <>
            <div className="contenedor-modal-eliminar">
                <div className="modal-eliminar">
                    <div className="contenedor-cerrar-modal-eliminar"><p onClick={() => setModalEliminar(false)}>x</p></div>
                    <div className="contenedor-contenido-modal-eliminar">
                        <p className="titulo-modal-eliminar my-3">Está seguro?</p>
                        <p className="subtitulo-modal-eliminar">Esta acción no se prodrá deshacer</p>
                        <div className="contenedor-botones-modal-eliminar">
                            <button className="boton-modal-eliminar" onClick={() => setModalEliminar(false)}>Cancelar</button>
                            <button className="boton-modal-eliminar boton-eliminar"onClick={eliminar} >Aceptar</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalEliminar