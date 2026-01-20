import { Link, useNavigate } from "react-router-dom";
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { IoReceiptOutline } from "react-icons/io5";
import { useState } from "react";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";
import ModalEliminar from "./modal/ModalEliminar";

const InquilinoCard = ({ inquilinosOrdenados }) => {
    
    const navigate = useNavigate();
    const [idEliminar, setIdEliminar] = useState(null);
    const [modalEliminar, setModalEliminar] = useState(false);

    const confirmarEliminacion = async () => {
        if (!idEliminar) return;
        const db = getFirestore();
        try {
            await deleteDoc(doc(db, "inquilinos", idEliminar));
        } catch (error) { console.error(error); } 
        finally { setModalEliminar(false); setIdEliminar(null); }
    };

    const handleClickEliminar = (e, id) => {
        e.preventDefault(); e.stopPropagation();
        setIdEliminar(id); setModalEliminar(true);
    };

    const formatearFecha = (timestamp) => timestamp?.toDate ? timestamp.toDate().toLocaleDateString("es-AR") : "-";
    const formatearDinero = (monto) => monto ? `$ ${monto.toLocaleString('es-AR')}` : "-";

    return (
        <>
            {modalEliminar && <ModalEliminar setModalEliminar={setModalEliminar} accionConfirmar={confirmarEliminacion} />}

            {/* Agregamos la clase 'tabla-responsive-mobile' */}
            <table className="table table-hover align-middle tabla-responsive-mobile">
                <thead className="table-light">
                    <tr>
                        <th scope="col">Avatar</th>
                        <th scope="col">Nombre</th>
                        <th scope="col">Vigencia</th>
                        <th scope="col">Vencimiento</th>
                        <th scope="col">Monto</th>
                        <th scope="col">Aumento</th>
                        <th scope="col" className="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {inquilinosOrdenados.map(i => (
                        <tr key={i.id} onClick={() => navigate("/inquilino/" + i.id)} style={{ cursor: "pointer" }}>
                            
                            {/* IMPORTANTE: data-label DEBE coincidir con el título de la columna */}
                            <td data-label="Avatar">
                                <img src={i.imagen || "https://via.placeholder.com/40"} alt="avatar" className="avatar-chico"/>
                            </td>
                            <td data-label="Nombre" className="fw-bold">{i.apellido} {i.nombre}</td>
                            <td data-label="Vigencia">{formatearFecha(i.vigencia.fecha)}</td>
                            <td data-label="Vencimiento">{formatearFecha(i.vencimiento.fecha)}</td>
                            <td data-label="Monto" className="text-success fw-bold">{formatearDinero(i.monto)}</td>
                            <td data-label="Aumento">{i.aumento ? `${i.aumento}%` : "-"}</td>
                            
                            <td data-label="Acciones">
                                <div className="d-flex justify-content-center">
                                    <Link to={`/editar-inquilino/${i.id}`} onClick={(e) => e.stopPropagation()}>
                                        <MdModeEditOutline className="text-primary mouse" size={24} />
                                    </Link>
                                    <div onClick={(e) => handleClickEliminar(e, i.id)}>
                                        <MdDelete className="text-danger mouse" size={24} />
                                    </div>
                                    <Link to={`/recibos/inquilino/${i.id}`} onClick={(e) => e.stopPropagation()}>
                                        <IoReceiptOutline className="text-dark mouse" size={24} />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default InquilinoCard;