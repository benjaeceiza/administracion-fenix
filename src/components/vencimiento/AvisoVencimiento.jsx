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


        // switch (inquilino.aumento) {


        //     case "Bimestral":
        //         let mesAumento = new Date(inquilino.mesAumento).getMonth() + 2;
        //         let añoAumento = new Date().getFullYear();

        //         if(inquilino.mesAumento < new Date().getMonth()+1 && inquilino.añoAumento == new Date().getFullYear()){


        //             if (mesAumento > 12) {
        //                 mesAumento = mesAumento - 12;
        //                 añoAumento = añoAumento + 1;
        //                 updateDoc(docRef, { mesAumento: mesAumento,añoAumento:añoAumento })

        //             }
        //         }


        //         break;
        //     case "Trimestral":

        //         let mesAumento2 = new Date(inquilino.mesAumento).getMonth() + 3; 
        //         let añoAumento2 = new Date().getFullYear();

        //         if(inquilino.mesAumento <= new Date().getMonth()+1 && inquilino.añoAumento == new Date().getFullYear()){


        //             if (mesAumento2 > 12) {
        //                 mesAumento2 = mesAumento2 - 12;
        //                 añoAumento2 = añoAumento2 + 1;
        //                 updateDoc(docRef, { mesAumento: mesAumento2,añoAumento:añoAumento2 })

        //             }
        //         }


        //         break;
        //     case "Cuatrimestral":
        //         let mesAumento3 = new Date(inquilino.mesAumento).getMonth() + 4; 
        //         let añoAumento3 = new Date().getFullYear();

        //         if(inquilino.mesAumento <= new Date().getMonth()+1 && inquilino.añoAumento == new Date().getFullYear()){


        //             if (mesAumento3 > 12) {
        //                 mesAumento3 = mesAumento3 - 12;
        //                 añoAumento3 = añoAumento3 + 1;
        //                 updateDoc(docRef, { mesAumento: mesAumento3,añoAumento:añoAumento3 })

        //             }
        //         }

        //         break;
        //     case "Semestral":

        //         let mesAumento4 = inquilino.mesAumento + 6;
        //         let añoAumento4 = new Date().getFullYear();

        //         if(inquilino.mesAumento <= new Date().getMonth()+ 1 && inquilino.añoAumento == new Date().getFullYear()){


        //             if (mesAumento4 > 12) {
        //                 mesAumento4 = mesAumento4 - 12;
        //                 añoAumento4 = añoAumento4 + 1;
        //                 updateDoc(docRef, { mesAumento: mesAumento4,añoAumento:añoAumento4 })


        //             }
        //         }

        //         break;
        //     case "Anual":


        //         let mesAumento5 = new Date(inquilino.vigencia.fecha.seconds * 1000).getMonth() + 13;

        //         if (mesAumento5 > 12) {
        //             mesAumento5 = mesAumento5 - 12;
        //         }
        //         updateDoc(docRef, { añoAumento: 2025 })

        //         break;

        // }
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


