import { useEffect, useState } from "react";


const AvisoVencimientoDetail = ({ inquilino }) => {

    const [avisoVisible, setAvisoVisible] = useState(false);
    let añoActual = new Date().getFullYear();
    let mesActual = new Date().getMonth() + 2;
    let diaActual = new Date().getUTCDate();
    let personas = [];


    useEffect(() => {
        const añoAVencer = new Date(inquilino.vencimiento.fecha.seconds * 1000).getFullYear();
        const mesAVencer = new Date(inquilino.vencimiento.fecha.seconds * 1000).getMonth() + 1;
        const diaAVencer = new Date(inquilino.vencimiento.fecha.seconds * 1000).getUTCDate();


        if ((añoActual === añoAVencer) && (mesActual >= mesAVencer)) {

            setAvisoVisible(true)
            
        }
    }, [])
    




    return (
        <>
            {avisoVisible ? <div className="aviso-vencimiento-detail">
                <p className="texto-aviso-detail">AVISO DE VENCIMIENTO</p>
                {personas.map(e => (
                    <p key={Math.random()} className="text-white">{e}</p>
                ))}
            </div> : ""}
        </>
    )
}

export default AvisoVencimientoDetail