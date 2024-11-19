
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/header/Navbar"
import Inicio from "./components/Inicio"
import ListadoPropietarios from "./components/ListadoPropietarios"
import PropietariosDetail from "./components/detail/PropietariosDetail"
import InquilinosDetail from "./components/detail/InquilinosDetail"
import ListadoIquilinos from "./components/ListadoInquilinos"
import AgregarInquilino from "./components/AgregarInquilino"
import AgregarPropietario from "./components/AgregarPropietario"
import FormularioCasa from "./components/formularios/FormularioCasa"
import Buscados from "./components/buscar/Buscados"
import Footer from "./components/Footer"
import ContextProvider from "./components/contexto/Context"
import Editar from "./components/editar/Editar"
import EditarInquilino from "./components/editar/EditarInquilino"
import CreadoraRecibos from "./components/recibos/CreadoraRecibos"
import VerRecibos from "./components/recibos/VerRecibos"
import Notas from "./components/notas/Notas"
import AgregarNota from "./components/notas/AgregarNota"
import Alquileres from "./components/Alquileres"
import TabNavegador from "./components/TabNavegador"




function App() {


  return (
    <>
      <ContextProvider>
        <BrowserRouter>
          <Navbar />
          <TabNavegador/>
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
            <Route path="/recibos" element={<CreadoraRecibos/>} />
            <Route path="/recibos/verrecibos" element={<VerRecibos/>} />
            <Route path="/notas" element={<Notas/>} />
            <Route path="/notas/agregarNota" element={<AgregarNota/>} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </ContextProvider>
    </>
  )
}

export default App
