
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import Inicio from "./components/Inicio"
import ListadoPropietarios from "./components/ListadoPropietarios"
import PropietariosDetail from "./components/PropietariosDetail"
import InquilinosDetail from "./components/InquilinosDetail"
import ListadoIquilinos from "./components/ListadoInquilinos"
import AgregarInquilino from "./components/AgregarInquilino"
import AgregarPropietario from "./components/AgregarPropietario"
import FormularioCasa from "./components/FormularioCasa"
import Buscados from "./components/Buscados"
import Footer from "./components/Footer"
import ContextProvider from "./components/contexto/Context"
import Editar from "./components/Editar"
import EditarInquilino from "./components/EditarInquilino"
import Recibos from "./components/Recibos"
import VerRecibos from "./components/VerRecibos"
import Notas from "./components/Notas"
import Alquileres from "./components/Alquileres"




function App() {


  return (
    <>
      <ContextProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/propietarios" element={<ListadoPropietarios />} />
            <Route path="/inquilinos" element={<ListadoIquilinos />} />
            <Route path="/propietario/:id" element={<PropietariosDetail />} />
            <Route path="/inquilino/:idInquilino" element={<InquilinosDetail />} />
            <Route path="/agregar/inquilino/:idInquilino" element={<AgregarInquilino />} />
            <Route path="/agregar/propietario" element={<AgregarPropietario />} />
            <Route path="/agregar/propiedad/:idPropietario" element={<FormularioCasa />} />
            <Route path="/buscar/:nombreBuscado" element={<Buscados />} />
            <Route path="/editar/:id" element={<Editar />} />
            <Route path="/editar/inquilino/:idInquilino" element={<EditarInquilino />} />
            <Route path="/alquileres" element={<Alquileres/>} />
            <Route path="/recibos" element={<Recibos/>} />
            <Route path="/recibos/verrecibos" element={<VerRecibos/>} />
            <Route path="/notas" element={<Notas/>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ContextProvider>
    </>
  )
}

export default App
