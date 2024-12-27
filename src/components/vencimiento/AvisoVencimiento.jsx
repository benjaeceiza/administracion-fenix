import { addDoc, collection, deleteDoc, deleteField, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AvisoVencimiento = ({ inquilinos }) => {

    const [avisoVisible, setAvisoVisible] = useState(true);
    let añoActual = new Date().getFullYear();
    let mesActual = new Date().getMonth() + 1;
    let personas = [];
    let personasAumento = [];




    inquilinos.map(inquilino => {

        const añoAVencer = new Date(inquilino.vencimiento.fecha.seconds * 1000).getFullYear();
        const mesAVencer = new Date(inquilino.vencimiento.fecha.seconds * 1000).getMonth() + 1;



        if ((añoActual == añoAVencer) && (mesActual >= mesAVencer)) {

            personas.push({ nombre: inquilino.apellido + " " + inquilino.nombre, id: inquilino.id })

        }


    })






    inquilinos.map(inquilino => {

        const db = getFirestore();
        const docRef = doc(db, "inquilinos", inquilino.id)

        let porAumentar = new Date().getMonth() + 2

        if (porAumentar > 12) {
            porAumentar = porAumentar - 12
        }

        if (inquilino.mesAumento == porAumentar) {

            const nombre = {
                nombre: inquilino.apellido + " " + inquilino.nombre,
                id: inquilino.id

            }
            personasAumento.push(nombre)
        }

    })







    return (
        <>
            {personas.length == 0
                ?
                ""
                :
                <div className="accordion accordion-flush" id="accordionFlushExample">
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button className="accordion-button collapsed aviso-vencimiento" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                AVISO VENCIMIENTO
                            </button>
                        </h2>
                        <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                            <div className="accordion-body cuerpo-venciminento">
                                {avisoVisible ? <div className="aviso-vencimiento">
                                    <div className="contenedor-listas-vencimiento-ajuste">
                                        <div className="lista-vencimiento">
                                            <h3>Vencimiento:</h3>
                                            <ul>
                                                {personas.map(e => (
                                                    <li key={Math.random()} ><Link to={"/inquilino/" + e.id} className=" text-white link-aviso">{e.nombre}</Link></li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="lista-ajuste">
                                            <h3>Ajuste:</h3>
                                            <ul>
                                                {personasAumento.map(e => (
                                                    <li key={Math.random()} ><Link to={"/inquilino/" + e.id} className=" text-white link-aviso">{e.nombre}</Link></li>
                                                ))}
                                            </ul>
                                        </div>

                                    </div>
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


