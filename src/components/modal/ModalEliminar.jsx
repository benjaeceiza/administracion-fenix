const ModalEliminar = ({ setModalEliminar, accionConfirmar }) => {

    return (
        <>
            <div className="contenedor-modal-eliminar">
                <div className="modal-eliminar">
                    <div className="contenedor-cerrar-modal-eliminar">
                        {/* Botón X para cerrar sin hacer nada */}
                        <p onClick={() => setModalEliminar(false)}>x</p>
                    </div>

                    <div className="contenedor-contenido-modal-eliminar">
                        <p className="titulo-modal-eliminar my-3">¿Está seguro?</p>
                        <p className="subtitulo-modal-eliminar">Esta acción no se podrá deshacer y borrará también a los inquilinos asociados.</p>

                        <div className="contenedor-botones-modal-eliminar">
                            {/* Botón Cancelar */}
                            <button
                                className="boton-modal-eliminar"
                                onClick={() => setModalEliminar(false)}
                            >
                                Cancelar
                            </button>

                            {/* Botón Aceptar: Ejecuta la función que le enviamos desde el padre */}
                            <button
                                className="boton-modal-eliminar boton-eliminar"
                                onClick={accionConfirmar}
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalEliminar;