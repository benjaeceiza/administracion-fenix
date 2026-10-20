import { NavLink, useLocation } from "react-router-dom";
import { FiUsers, FiKey, FiFileText, FiClipboard } from "react-icons/fi";

const TAB_ITEMS = [
  {
    to: "/propietarios",
    label: "Propietarios",
    icon: FiUsers,
    matchPaths: ["/", "/propietarios", "/propietario", "/agregar/propietario", "/editar"],
  },
  {
    to: "/alquileres",
    label: "Alquileres",
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

const MobileTabNav = () => {
  const { pathname } = useLocation();

  const isItemActive = (matchPaths) =>
    matchPaths.some((p) =>
      p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(`${p}/`)
    );

  return (
    <nav className="tab-navegador" aria-label="Navegación móvil">
      <ul className="lista-tab-navegador">
        {TAB_ITEMS.map(({ to, label, icon: Icon, matchPaths }) => (
          <li key={to} className="ancho-icono">
            <NavLink
              to={to}
              className={`item-tab-navegador ${
                isItemActive(matchPaths) ? "active" : ""
              }`}
            >
              <Icon size={21} />
              <span className="nombre-boton">{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileTabNav;
