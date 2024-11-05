
const FiltroRecibos = () => {

    return (
        <>
            <div className="contenedor-filtro my-3">
                <div className="mb-3">
                    <select className="form-select" aria-label="Default select example" onChange={{}}>
                        <option value="">Seleccione Tipo</option>
                        <option value="inquilinos">Inquilino</option>
                        <option value="propietarios">Propietario</option>
                    </select>
                </div>
                <div className="mb-3">
                    <select className="form-select" aria-label="Default select example" onChange={{}}>
                        <option value="">Seleccione Nombre</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Mujer">Mujer</option>
                    </select>
                </div>
                <div className="mb-3">
                    <select className="form-select" aria-label="Default select example" onChange={{}}>
                        <option value="">Seleccione Mes</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Mujer">Mujer</option>
                    </select>
                </div>
            </div>
        </>
    )
}

export default FiltroRecibos;