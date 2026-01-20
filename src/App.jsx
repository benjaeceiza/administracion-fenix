
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/header/Navbar"
import ListadoPropietarios from "./components/ListadoPropietarios"
import PropietariosDetail from "./components/detail/PropietariosDetail"
import InquilinosDetail from "./components/detail/InquilinosDetail"
import ListadoIquilinos from "./components/ListadoInquilinos"
import AgregarInquilino from "./components/AgregarInquilino"
import AgregarPropietario from "./components/AgregarPropietario"
import FormularioCasa from "./components/formularios/FormularioCasa"
import Footer from "./components/Footer"
import ContextProvider from "./components/contexto/Context"
import Editar from "./components/editar/Editar"
import EditarInquilino from "./components/editar/EditarInquilino"
import CreadoraRecibos from "./components/recibos/CreadoraRecibos"
import VerRecibos from "./components/recibos/VerRecibos"
import Notas from "./components/notas/Notas"
import AgregarNota from "./components/notas/AgregarNota"
import TabNavegador from "./components/TabNavegador"
import CreadoraRecibosInquilino from "./components/recibos/CradorRecibosInquilino"
import CreadoraRecibosProp from "./components/recibos/CreadoraRecibosProp"




function App() {


  return (
    <>
      <ContextProvider>
        <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
          <Navbar />
          <TabNavegador/>
          <Routes>
            <Route path="/" element={<ListadoPropietarios />} />
            <Route path="/propietarios" element={<ListadoPropietarios />} />
            <Route path="/inquilinos" element={<ListadoIquilinos />} />
            <Route path="/propietario/:id" element={<PropietariosDetail />} />
            <Route path="/inquilino/:idInquilino" element={<InquilinosDetail />} />
            <Route path="/agregar/inquilino" element={<AgregarInquilino />} />
            <Route path="/agregar/inquilino/:idInquilino" element={<AgregarInquilino />} />
            <Route path="/agregar/propietario" element={<AgregarPropietario />} />
            <Route path="/agregar/propiedad/:idPropietario" element={<FormularioCasa />} />
            <Route path="/editar/:id" element={<Editar />} />
            <Route path="/editar/inquilino/:idInquilino" element={<EditarInquilino />} />
            <Route path="/alquileres" element={<ListadoIquilinos/>} />
            <Route path="/recibos" element={<CreadoraRecibos/>} />
            <Route path="/recibos/propietario/:id" element={<CreadoraRecibosProp/>} />
            <Route path="/recibos/inquilino/:id" element={<CreadoraRecibosInquilino/>} />
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
