import avataresHombre from "../data/avataresHombres.json";
import avataresMujer from "../data/avataresMujeres.json";

export const DEFAULT_AVATAR = avataresHombre[0];
export { avataresHombre, avataresMujer };

export const MESES = [
  { valor: 0, nombre: "Enero" },
  { valor: 1, nombre: "Febrero" },
  { valor: 2, nombre: "Marzo" },
  { valor: 3, nombre: "Abril" },
  { valor: 4, nombre: "Mayo" },
  { valor: 5, nombre: "Junio" },
  { valor: 6, nombre: "Julio" },
  { valor: 7, nombre: "Agosto" },
  { valor: 8, nombre: "Septiembre" },
  { valor: 9, nombre: "Octubre" },
  { valor: 10, nombre: "Noviembre" },
  { valor: 11, nombre: "Diciembre" },
];

export const TIPOS_AJUSTE = [
  "Bimestral",
  "Trimestral",
  "Cuatrimestral",
  "Semestral",
  "Anual",
];

export const MESES_POR_AJUSTE = {
  Bimestral: 2,
  Trimestral: 3,
  Cuatrimestral: 4,
  Semestral: 6,
  Anual: 12,
};

/**
 * Convierte cualquier representación de fecha de Firestore o JS a un objeto Date válido.
 */
export const toDateObject = (value) => {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  if (value?.fecha) return toDateObject(value.fecha);
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Formatea una fecha a dd/mm/yyyy en formato argentino.
 */
export const formatDate = (value) => {
  const date = toDateObject(value);
  if (!date) return "-";
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

/**
 * Normaliza un monto (numérico o string con puntos de miles como "500.000") a número JS completo.
 */
export const parseMonto = (amount) => {
  if (amount === undefined || amount === null || amount === "") return NaN;
  let num;
  if (typeof amount === "number") {
    num = amount;
  } else {
    const str = String(amount).trim();
    if (!str) return NaN;
    const normalized = str.replace(/\./g, "").replace(",", ".");
    num = Number(normalized);
  }
  if (isNaN(num)) return NaN;
  // Si el monto quedó guardado como decimal truncado por separador de miles (ej: 500 en vez de 500.000 o 357.5 en vez de 357.500)
  if (num > 0 && num < 1000) {
    num = Math.round(num * 1000);
  }
  return num;
};

/**
 * Formatea un monto numérico como moneda en pesos argentinos.
 */
export const formatCurrency = (amount) => {
  const num = parseMonto(amount);
  if (isNaN(num)) return "-";
  return `$ ${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(num)}`;
};

/**
 * Capitaliza la primera letra de un texto.
 */
export const capitalize = (text = "") => {
  const clean = String(text).trim();
  if (!clean) return "";
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
};

/**
 * Obtiene un avatar aleatorio según el género.
 */
export const getRandomAvatar = (genero = "Hombre") => {
  const lista = genero === "Mujer" ? avataresMujer : avataresHombre;
  const idx = Math.floor(Math.random() * lista.length);
  return lista[idx] || lista[0];
};

/**
 * Calcula el próximo mes (1-12) y año de aumento a partir de la fecha de vigencia y el tipo de ajuste.
 */
export const calcularProximoAjuste = (fechaVigencia, tipoAjuste) => {
  const date = toDateObject(fechaVigencia) || new Date();
  const incremento = MESES_POR_AJUSTE[tipoAjuste];
  if (!incremento) {
    return { mesAumento: date.getMonth() + 1, añoAumento: date.getFullYear() };
  }

  const mesBase1 = date.getMonth() + 1;
  let nuevoMes = mesBase1 + incremento;
  let nuevoAño = new Date().getFullYear();

  if (nuevoMes > 12) {
    nuevoMes -= 12;
    nuevoAño += 1;
  }

  return {
    mesAumento: nuevoMes,
    añoAumento: nuevoAño,
  };
};
