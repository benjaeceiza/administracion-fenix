const Cargando = ({ inline = false, texto = "Cargando datos..." }) => {
  return (
    <div className={inline ? "cargando-inline" : "cargando-pantalla"}>
      <div className="spinner-fenix" role="status" aria-label={texto} />
      <span className="cargando-texto">{texto}</span>
    </div>
  );
};

export default Cargando;
