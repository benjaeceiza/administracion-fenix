import { NavLink, useLocation } from "react-router-dom";
import { FiUsers, FiKey, FiFileText, FiClipboard } from "react-icons/fi";
import logo from "../../assets/logo-2.png";

const NAV_ITEMS = [
  {
    to: "/propietarios",
    label: "Propietarios",
    icon: FiUsers,
    matchPaths: ["/", "/propietarios", "/propietario", "/agregar/propietario", "/editar"],
  },
  {
    to: "/alquileres",
    label: "Inquilinos / Alquileres",
    icon: FiKey,
    matchPaths: ["/alquileres", "/inquilinos", "/inquilino", "/agregar/inquilino", "/editar/inquilino"],
  },
  {
    to: "/recibos/verrecibos",
    label: "Recibos",
    icon: FiFileText,
    matchPaths: ["/recibos"],
  },
  {
    to: "/notas",
    label: "Notas",
    icon: FiClipboard,
    matchPaths: ["/notas"],
  },
];

const Navbar = () => {
  const { pathname } = useLocation();

  const isItemActive = (matchPaths) =>
    matchPaths.some((p) =>
      p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(`${p}/`)
    );

  return (
    <header className="fenix-navbar">
      <div className="container fenix-navbar-inner">
        <NavLink to="/" className="fenix-brand">
          <img className="fenix-logo" src={logo} alt="Fénix Propiedades" />
          <div className="fenix-brand-text">
            <span className="fenix-brand-title">Administración Fénix</span>
            <span className="fenix-brand-subtitle">Gestión Inmobiliaria</span>
          </div>
        </NavLink>

        <nav className="fenix-nav-links" aria-label="Navegación principal">
          {NAV_ITEMS.map(({ to, label, icon: Icon, matchPaths }) => (
            <NavLink
              key={to}
              to={to}
              className={`fenix-nav-link ${isItemActive(matchPaths) ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
