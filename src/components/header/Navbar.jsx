

import logo from "../../assets/logo-2.png"
import { NavLink, useNavigate } from "react-router-dom"
import menu from "../../assets/menu.png"
import lupa from "../../assets/lupa.png"
import { useState } from "react"
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';




const Navbar = () => {

    const [buscado, setBuscado] = useState("");
    const navigate = useNavigate()
    const [propietarios, setPropietarios] = useState(false);
    const [inquilinos, setInquilinos] = useState(false);
    const [alquileres, setAlquileres] = useState(false);
    const [recibos, setRecibos] = useState(false);
    const [notas, setNotas] = useState(false);



    const buscar = () => {

        navigate("/buscar/" + buscado)
    }

    const ItemFondo = (value) => {

        if (value == "propietarios") {
            setPropietarios(true)
            setInquilinos(false)
            setAlquileres(false)
            setRecibos(false)
            setNotas(false)
        } else {

            if (value == "inquilinos") {
                setInquilinos(true)
                setPropietarios(false)
                setAlquileres(false)
                setRecibos(false)
                setNotas(false)
            } else {
                if (value == "alquileres") {
                    setAlquileres(true)
                    setInquilinos(false)
                    setPropietarios(false)
                    setRecibos(false)
                    setNotas(false)
                } else {
                    if (value == "recibos") {
                        setRecibos(true)
                        setInquilinos(false)
                        setPropietarios(false)
                        setAlquileres(false)
                        setNotas(false)
                    } else {
                        if (value == "notas") {
                            setNotas(true)
                            setInquilinos(false)
                            setPropietarios(false)
                            setAlquileres(false)
                            setRecibos(false)
                        } else {
                            if (value == "inicio") {

                                setNotas(false)
                                setInquilinos(false)
                                setPropietarios(false)
                                setAlquileres(false)
                                setRecibos(false)
                            }
                        }
                    }
                }
            }
        }
    }

    return (

        <>
            <nav className="nav-desktop navbar navbar-expand-lg bg-body-tertiary ">
                <div className="container-fluid  largo  bg-success ">
                    <img onClick={() => ItemFondo("inicio")} className="logo" src={logo} alt="Logo" />
                    <button className="navbar-toggler border-white border-0 " type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span ><img src={menu} alt="Boton Menu" /></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav text-end">
                            <li className="nav-item">
                                <NavLink to={"/propietarios"} className={propietarios ? "nav-link text-white active " : "nav-link text-white"} onClick={() => ItemFondo("propietarios")} >Propietarios</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/alquileres"} className={alquileres ? "nav-link text-white active " : "nav-link text-white"} onClick={() => ItemFondo("alquileres")}>Alquileres</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/recibos/verrecibos"} className={recibos ? "nav-link text-white active " : "nav-link text-white"} onClick={() => ItemFondo("recibos")} >Recibos</NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to={"/notas"} className={notas ? "nav-link text-white active " : "nav-link text-white"} onClick={() => ItemFondo("notas")} >Notas</NavLink>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav>

            {/* NAV MOBILE */}

            <nav className="nav-mob navbar navbar-expand-lg bg-body-tertiary ">
                <div className="container-fluid  largo  bg-success ">
                    <NavLink to={"/"} onClick={() => ItemFondo("inicio")}><img className="logo" src={logo} alt="Logo" /></NavLink>
                   
                    <button className="navbar-toggler border-white border-0 " type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className=""><img src={menu} alt="Boton Menu" /></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav text-end">
                            <li className="nav-item">
                                <NavLink to={"/propietarios"} className={propietarios ? "nav-link text-white active " : "nav-link text-white"} onClick={() => ItemFondo("propietarios")} >Propietarios</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/inquilinos"} className={inquilinos ? "nav-link text-white active" : "nav-link text-white"} onClick={() => ItemFondo("inquilinos")}>Inquilinos</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/alquileres"} className={alquileres ? "nav-link text-white active " : "nav-link text-white"} onClick={() => ItemFondo("alquileres")}>Alquileres</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/recibos/verrecibos"} className={recibos ? "nav-link text-white active " : "nav-link text-white"} onClick={() => ItemFondo("recibos")} >Recibos</NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink to={"/notas"} className={notas ? "nav-link text-white active " : "nav-link text-white"} onClick={() => ItemFondo("notas")} >Notas</NavLink>
                            </li>
                        </ul>

                    </div>
                </div>
            </nav>


            <nav className="nav-mob-ultra navbar navbar-expand-lg bg-body-tertiary ">
                <div className="container-fluid  largo  bg-success ">
                    <NavLink to={"/"}><img className="logo" src={logo} alt="Logo" /></NavLink>
                   
                </div>
            </nav>
        </>
    )
}

export default Navbar;