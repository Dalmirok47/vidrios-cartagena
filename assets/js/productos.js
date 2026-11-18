// Los productos viven en assets/data/productos.json
// (así el generador de páginas para compartir también los lee).
export const ETIQUETAS_IMAGENES = ["Vista frontal", "Ángulo lateral", "Detalle", "Medidas"];

const respuesta = await fetch(new URL("../data/productos.json", import.meta.url));
export const PRODUCTOS = respuesta.ok ? await respuesta.json() : [];
