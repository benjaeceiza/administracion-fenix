import { useEffect, useState } from "react";


const Recibo = ({ recibos }) => {
    let fecha;
    const [recibosOrdenados, setRecibosOrdenados] = useState([])

    useEffect(() => {
        let sortedList = [...recibos].sort((a, b) => (a.fecha.fecha.seconds < b.fecha.fecha.seconds ? 1 : a.fecha.fecha.seconds > b.fecha.fecha.seconds ? -1 : 0))
        setRecibosOrdenados(sortedList);
    }, [recibos])


    return (
        <>
            {recibosOrdenados.map(e => (
                <div key={Math.random()} className="col my-5">
                    <div className="mostrar-recibo">
                        <div className="div-nombre">
                            <p>{e.apelliodo} {e.nombre} ({e.tipo})</p>
                        </div>
                        <div className="contenido-recibo">
                            <div className="div-concepto">
                                <p>En concepto de: {e.concepto}</p>
                            </div>
                            <div className="fecha-monto d-flex justify-content-evenly">
                                <p>${e.monto}</p>
                                <p>{fecha = new Intl.DateTimeFormat('es-ES',).format(e.fecha.fecha.seconds * 1000)}</p>
                            </div>
                        </div>
                    </div>

                </div>
            ))}
        </>
    )
}

export default Recibo;