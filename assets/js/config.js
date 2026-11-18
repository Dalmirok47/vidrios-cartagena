// Un solo lugar para el número del asesor y las categorías.
export const CONFIG = {
  whatsapp: "573137505895", // TODO: número real del asesor (código de país + número, sin + ni espacios)
  empresa: "Vidrios Cartagena",
};

export const CATEGORIAS = [
  { id: "todos", nombre: "Todos" },
  { id: "puertas", nombre: "Puertas" },
  { id: "ventanas", nombre: "Ventanas" },
  { id: "puertas-ventanas", nombre: "Puertas-ventanas" },
  { id: "divisiones-bano", nombre: "Divisiones de baño" },
  { id: "divisiones-cocina", nombre: "Divisiones de cocina" },
];

export function enlaceWhatsApp(texto) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`;
}

