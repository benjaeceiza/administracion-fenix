import { useState } from "react";

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

            personas.push(inquilino.apellido + " " + inquilino.nombre)

        }


    })


    return (
        <>
            {personas.length == 0
                ?
                ""
                :
                <div class="accordion accordion-flush" id="accordionFlushExample">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button collapsed aviso-vencimiento" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                AVISO VENCIMIENTO
                            </button>
                        </h2>
                        <div id="flush-collapseOne" class="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                            <div class="accordion-body cuerpo-venciminento">
                                {avisoVisible ? <div className="aviso-vencimiento">
                                    <ul>
                                        {personas.map(e => (
                                            <li key={Math.random()} className="text-white">{e}</li>
                                        ))}
                                    </ul>
                                </div> : ""}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default AvisoVencimiento;


