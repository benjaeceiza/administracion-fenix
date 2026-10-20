import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/layout/Navbar";
import MobileTabNav from "./components/layout/MobileTabNav";
import Footer from "./components/layout/Footer";
import PropietariosPage from "./components/propietarios/PropietariosPage";
import PropietarioDetailPage from "./components/propietarios/PropietarioDetailPage";
import FormularioPropietario from "./components/propietarios/FormularioPropietario";
import FormularioPropiedad from "./components/propietarios/FormularioPropiedad";
import InquilinosPage from "./components/inquilinos/InquilinosPage";
import InquilinoDetailPage from "./components/inquilinos/InquilinoDetailPage";
import FormularioInquilino from "./components/inquilinos/FormularioInquilino";
import RecibosPage from "./components/recibos/RecibosPage";
import ReciboDetailPage from "./components/recibos/ReciboDetailPage";
import FormularioRecibo from "./components/recibos/FormularioRecibo";
import NotasPage from "./components/notas/NotasPage";
import FormularioNota from "./components/notas/FormularioNota";

function App() {
  return (
    <BrowserRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <div className="app-shell">
        <ToastContainer />
        <Navbar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<PropietariosPage />} />
            <Route path="/propietarios" element={<PropietariosPage />} />
            <Route path="/inquilinos" element={<InquilinosPage />} />
            <Route path="/alquileres" element={<InquilinosPage />} />
            <Route path="/propietario/:id" element={<PropietarioDetailPage />} />
            <Route
              path="/inquilino/:idInquilino"
              element={<InquilinoDetailPage />}
            />
            <Route
              path="/agregar/inquilino"
              element={<FormularioInquilino />}
            />
            <Route
              path="/agregar/inquilino/:idInquilino"
              element={<FormularioInquilino />}
            />
            <Route
              path="/editar/inquilino/:idInquilino"
              element={<FormularioInquilino />}
            />
            <Route
              path="/agregar/propietario"
              element={<FormularioPropietario />}
            />
            <Route path="/editar/:id" element={<FormularioPropietario />} />
            <Route
              path="/agregar/propiedad/:idPropietario"
              element={<FormularioPropiedad />}
            />
            <Route path="/recibos" element={<FormularioRecibo />} />
            <Route
              path="/recibos/propietario/:id"
              element={<FormularioRecibo />}
            />
            <Route
              path="/recibos/inquilino/:id"
              element={<FormularioRecibo />}
            />
            <Route path="/recibos/verrecibos" element={<RecibosPage />} />
            <Route path="/recibos/detalle/:id" element={<ReciboDetailPage />} />
            <Route path="/notas" element={<NotasPage />} />
            <Route path="/notas/agregarNota" element={<FormularioNota />} />
          </Routes>
        </div>
        <MobileTabNav />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
