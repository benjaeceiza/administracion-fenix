import { useEffect, useState } from "react";

const AvisoVencimiento = ({ inquilinos }) => {

    const [avisoVisible, setAvisoVisible] = useState(true);
    let añoActual = new Date().getFullYear();
    let mesActual = new Date().getMonth() + 1;
    let personas = [];
     
   
       
    inquilinos.map(inquilino => {

        const añoAVencer = new Date(inquilino.vencimiento.fecha.seconds * 1000).getFullYear();
        const mesAVencer = new Date(inquilino.vencimiento.fecha.seconds * 1000).getMonth() + 1;
        const diaAVencer = new Date(inquilino.vencimiento.fecha.seconds * 1000).getUTCDate();


        if ((añoActual == añoAVencer) && (mesActual >= mesAVencer)) {

            personas.push(inquilino.apellido +" "+ inquilino.nombre)

        }

        
    })
     
   
    return (
        <>
            {personas.length == 0
             ? 
             ""
             :
             (avisoVisible ? <div className="aviso-vencimiento">
                <p className="texto-aviso">AVISO DE VENCIMIENTO</p>
                {personas.map(e => (
                    <p key={Math.random()} className="text-white">{e}</p>
                ))}
                <button className="boton-cerrar-aviso" onClick={() => setAvisoVisible(false)}>X</button>
            </div> : "")}
        </>
    )
}

export default AvisoVencimiento;