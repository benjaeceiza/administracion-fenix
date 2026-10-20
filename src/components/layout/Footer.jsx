import { FiBriefcase } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="d-flex align-items-center gap-2">
          <FiBriefcase size={16} className="text-amber" />
          <span>
            <strong>Fénix Propiedades SRL</strong> — Sistema de Administración
          </span>
        </div>
        <span className="footer-copy">
          Villa Mercedes, San Luis • {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
