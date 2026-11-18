import { CATEGORIAS } from "./config.js";

export const ICONOS = {
  "puertas": '<rect x="5" y="2" width="14" height="20" rx="1"/><circle cx="15" cy="12" r="1"/>',
  "ventanas": '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M12 3v18M3 12h18"/>',
  "puertas-ventanas": '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M12 3v18M8 12h.01M16 12h.01"/>',
  "divisiones-bano": '<path d="M4 21V6a3 3 0 0 1 6 0M4 10h12v11M8 14v.01M12 14v.01M10 17v.01"/>',
  "divisiones-cocina": '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M9 4v16M15 4v16"/>',
};

export const esc = (t = "") =>
  String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export const nombreCategoria = (id) => CATEGORIAS.find((c) => c.id === id)?.nombre ?? id;

// Tarjeta del catálogo: toda la tarjeta lleva a la página de detalle.
export function tarjeta(p, i = 0) {
  const primera = p.imagenes?.find((im) => im.src);
  const media = primera
    ? `<img src="${esc(primera.src)}" alt="${esc(p.nombre)}" loading="lazy">`
    : `<div class="product-ph"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[p.categoria] ?? ""}</svg></div>`;
  return `
    <a class="product" href="producto.html?id=${encodeURIComponent(p.id)}" style="animation-delay:${i * 60}ms">
      <div class="product-media">
        ${media}
        <span class="badge">${esc(nombreCategoria(p.categoria))}</span>
      </div>
      <div class="product-body">
        <h3>${esc(p.nombre)}</h3>
        <p class="product-desc">${esc(p.descripcion)}</p>
        <ul class="product-meta">
          <li><strong>Material:</strong> ${esc(p.material)}</li>
          <li><strong>Ref:</strong> ${esc(p.id)}</li>
        </ul>
        <span class="btn btn-ghost btn-block">Ver detalles</span>
      </div>
    </a>`;
}
