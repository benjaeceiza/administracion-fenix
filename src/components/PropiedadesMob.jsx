import { collection, deleteDoc, getDocs, getFirestore } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import tacho from "../assets/eliminar.png"


const PropiedadesMob = ({idPropietario}) => {

    let propiedades;
    const [filtroPropiedades, setFiltroPropiedades] = useState([]);
    const { id } = useParams()
    const [cargador, setCargador] = useState(true);


    useEffect(() => {

        const db = getFirestore();
        const itemCollection = collection(db, "propiedades");


        getDocs(itemCollection).then(Snapshot => {

            if (Snapshot.size >= 0) {

                propiedades = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                setFiltroPropiedades(propiedades.filter(e => e.idprop == id));
                setCargador(false)

            } else {
                console.error("error")
            }


        })



    }, [])


    const eliminarPropiedad = (idPropiedad) => {
        const db = getFirestore();
        const docRef = doc(db,"propiedades", idPropiedad);

        deleteDoc(docRef)

        const itemCollection = collection(db, "propiedades");
        getDocs(itemCollection).then(Snapshot => {

            if (Snapshot.size >= 0) {

                propiedades = Snapshot.docs.map(documento => ({ id: documento.id, ...documento.data() }));
                setFiltroPropiedades(propiedades.filter(e => e.idprop == id));


            } else {
                console.error("error")
            }


        })

    }



    return (
        <>
            <div className="accordion accordion-flush propiedades-mob" id="accordionFlushExample">
                <div className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed bg-success text-white" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                            Presione para ver las propiedades
                        </button>
                    </h2>
                    <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                        <div className="accordion-body borde ">
                            <div className="text-end">
                                <Link to={"/agregar/propiedad/" + idPropietario}><img className="my-3" height={20} src="/src/assets/mas.png" alt="" /></Link>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Dirrección</th>
                                        <th scope="col">N° Finca</th>
                                        <th scope="col">N° Nis</th>
                                        <th scope="col">N° Cta Gas</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {filtroPropiedades.map(e => (
                                        <tr key={e.id}>
                                            <td>{e.direccion}</td>
                                            <td>{e.finca}</td>
                                            <td>{e.nix}</td>
                                            <td>{e.gas}</td>
                                            <td onClick={() => eliminarPropiedad(e.id)}><img height={20} src={tacho} alt="Eliminar" className="mouse" /></td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PropiedadesMob;