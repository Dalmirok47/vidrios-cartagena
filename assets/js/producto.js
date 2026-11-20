import { CONFIG, enlaceWhatsApp } from "./config.js";
import { PRODUCTOS, ETIQUETAS_IMAGENES } from "./productos.js";
import { ICONOS, esc, nombreCategoria, tarjeta } from "./ui.js";

function imagenesDe(p) {
  return p.imagenes?.length ? p.imagenes : ETIQUETAS_IMAGENES.map((etiqueta) => ({ src: "", etiqueta }));
}

// Diagrama de medidas generado con los datos del producto (cuando no hay imagen real)
function svgMedidas(p) {
  const a = p.medidas?.ancho ?? "—";
  const h = p.medidas?.alto ?? "—";
  return `<svg class="slide-svg" viewBox="0 0 400 300" role="img" aria-label="Medidas del producto">
    <rect x="110" y="40" width="180" height="190" rx="6" fill="rgba(143,211,244,.35)" stroke="#1a8ac4" stroke-width="3"/>
    <g stroke="#8793a0" stroke-width="2" fill="none">
      <path d="M110 256h180M110 248v16M290 248v16"/>
      <path d="M82 40v190M74 40h16M74 230h16"/>
    </g>
    <text x="200" y="284" text-anchor="middle" class="dim">Ancho: ${esc(a)}</text>
    <text x="62" y="135" text-anchor="middle" transform="rotate(-90 62 135)" class="dim">Alto: ${esc(h)}</text>
  </svg>`;
}

function contenidoSlide(p, im) {
  if (im.src) return `<img src="${esc(im.src)}" alt="${esc(p.nombre)} - ${esc(im.etiqueta)}">`;
  if (im.etiqueta.toLowerCase().includes("medida")) return svgMedidas(p);
  return `<div class="product-ph"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[p.categoria] ?? ""}</svg><small>${esc(im.etiqueta)}</small></div>`;
}

// Enlace público del producto (página con vista previa para WhatsApp). En local no existe.
function enlacePublico(p) {
  const local = ["localhost", "127.0.0.1", ""].includes(location.hostname);
  if (!/^https?:$/.test(location.protocol) || local) return "";
  return new URL(`p/${encodeURIComponent(p.id)}.html`, location.href).href;
}

function mensajeCotizacion(p, color, medidas) {
  const url = enlacePublico(p);
  const l = [`Hola, ${CONFIG.empresa}. Quiero cotizar este producto:`, ``];
  if (url) l.push(url);
  else l.push(`• Producto: ${p.nombre} (Ref. ${p.id})`, `• Material: ${p.material}`);
  l.push(``);
  if (color) l.push(`• Color / acabado: ${color}`);
  l.push(`• Medidas requeridas: ${medidas.trim() || "por definir, necesito asesoría"}`);
  l.push(``, `${p.agotado ? "Vi que está agotado. Quisiera saber cuándo estará disponible o si hay una alternativa. ¡Gracias!" : "Quisiera conocer el valor y coordinar la forma de pago y el día de la visita. ¡Gracias!"}`);
  return l.join("\n");
}

export function initProducto() {
  const cont = document.getElementById("producto");
  if (!cont) return;

  const id = new URLSearchParams(location.search).get("id");
  const p = PRODUCTOS.find((x) => x.id === id);

  if (!p) {
    cont.innerHTML = `<div class="glass-box" style="text-align:center">
      <h1>Producto no encontrado</h1>
      <p class="muted" style="margin:.8rem 0 1.5rem">Puede que el enlace haya cambiado o el producto ya no esté disponible.</p>
      <a class="btn btn-primary" href="catalogo.html">Volver al catálogo</a></div>`;
    return;
  }

  document.title = `${p.nombre} | ${CONFIG.empresa}`;
  const imgs = imagenesDe(p);
  let actual = 0;
  let color = p.colores?.[0] ?? "";
  const etiquetaBoton = p.agotado ? "Consultar disponibilidad" : "Cotizar por WhatsApp";

  const specs = [
    ["Material", p.material],
    ...(p.medidas ? [["Medidas estándar", `${p.medidas.ancho} de ancho × ${p.medidas.alto} de alto`]] : []),
    ...(p.especificaciones ?? []),
    ["Referencia", p.id],
  ];
  const relacionados = [
    ...PRODUCTOS.filter((x) => x.id !== p.id && x.categoria === p.categoria),
    ...PRODUCTOS.filter((x) => x.id !== p.id && x.categoria !== p.categoria),
  ].slice(0, 3);

  cont.innerHTML = `
    <a class="volver" href="catalogo.html?cat=${esc(p.categoria)}">‹ ${esc(nombreCategoria(p.categoria))}</a>
    <nav class="breadcrumb" aria-label="Ruta">
      <a href="index.html">Inicio</a><span aria-hidden="true">›</span>
      <a href="catalogo.html">Catálogo</a><span aria-hidden="true">›</span>
      <a href="catalogo.html?cat=${esc(p.categoria)}">${esc(nombreCategoria(p.categoria))}</a><span aria-hidden="true">›</span>
      <strong>${esc(p.nombre)}</strong>
    </nav>

    <div class="detail">
      <div class="gallery">
        <div class="thumbs" aria-label="Imágenes del producto">
          ${imgs.map((im, i) => `<button type="button" class="thumb${i === 0 ? " active" : ""}" data-i="${i}" aria-label="Ver: ${esc(im.etiqueta)}">${contenidoSlide(p, im)}</button>`).join("")}
        </div>
        <div class="viewer">
          <button type="button" class="g-nav prev" aria-label="Imagen anterior">‹</button>
          <div class="viewer-stage" id="visor" title="Toca para ampliar"></div>
          <button type="button" class="g-nav next" aria-label="Imagen siguiente">›</button>
          <span class="viewer-tag" id="visor-etiqueta"></span>
          <span class="viewer-count" id="visor-conteo"></span>
        </div>
      </div>

      <aside class="detail-panel glass-box">
        <div class="panel-head">
          <span class="badge badge-inline">${esc(nombreCategoria(p.categoria))}</span>
          <h1>${esc(p.nombre)}</h1>
          <p class="ref">Ref. ${esc(p.id)}</p>
        </div>
        <div class="panel-buy">
          <p class="panel-material"><strong>Material:</strong> ${esc(p.material)}</p>

          ${p.colores?.length ? `<div class="panel-block">
            <h4>Color / acabado</h4>
            <div class="chips">${p.colores.map((c, i) => `<button type="button" class="chip${i === 0 ? " active" : ""}" data-color="${esc(c)}">${esc(c)}</button>`).join("")}</div>
          </div>` : ""}

          <div class="panel-block">
            <h4>Medidas que necesitas</h4>
            <input class="input-med" id="medidas" type="text" placeholder="Ej: 90 x 210 cm (ancho x alto)" autocomplete="off">
            <p class="nota">Si no las sabes, el asesor te orienta.</p>
          </div>

          ${p.agotado ? `<p class="aviso-agotado">Este producto está agotado por ahora. Escríbenos y te contamos cuándo vuelve a estar disponible o te proponemos una alternativa.</p>` : ""}<a class="btn btn-primary btn-lg btn-block" id="cotizar" target="_blank" rel="noopener">${etiquetaBoton}</a>
          <p class="nota">Te atenderá un asesor por WhatsApp para acordar el valor, el pago y el día de la visita.</p>
        </div>
      </aside>
    </div>

    <div class="detail-info">
      <div>
        <h2>Descripción</h2>
        <p class="muted">${esc(p.descripcion)}</p>
      </div>
      <div>
        <h2>Especificaciones</h2>
        <table class="specs"><tbody>
          ${specs.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}
        </tbody></table>
      </div>
    </div>

    <div class="related">
      <h2>Más productos que te pueden gustar</h2>
      <div class="products">${relacionados.map(tarjeta).join("")}</div>
    </div>

    <div class="cta-bar"><a class="btn btn-primary" id="cotizar-bar" target="_blank" rel="noopener">${etiquetaBoton}</a></div>`;

  // ----- Galería -----
  const visor = cont.querySelector("#visor");
  const etiqueta = cont.querySelector("#visor-etiqueta");
  const conteo = cont.querySelector("#visor-conteo");
  const thumbs = cont.querySelectorAll(".thumb");

  function mostrar(i) {
    actual = (i + imgs.length) % imgs.length;
    visor.innerHTML = contenidoSlide(p, imgs[actual]);
    etiqueta.textContent = imgs[actual].etiqueta;
    conteo.textContent = `${actual + 1} / ${imgs.length}`;
    thumbs.forEach((t, k) => t.classList.toggle("active", k === actual));
  }

  cont.querySelector(".g-nav.prev").addEventListener("click", () => mostrar(actual - 1));
  cont.querySelector(".g-nav.next").addEventListener("click", () => mostrar(actual + 1));

  // Deslizar con el dedo para cambiar de imagen
  let x0 = null;
  visor.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  visor.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 40) mostrar(actual + (dx < 0 ? 1 : -1));
  }, { passive: true });

  thumbs.forEach((t) => {
    t.addEventListener("click", () => mostrar(+t.dataset.i));
    t.addEventListener("mouseenter", () => mostrar(+t.dataset.i));
  });

  // ----- Ampliar imagen (lightbox) -----
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.hidden = true;
  lb.innerHTML = `
    <button type="button" class="lb-btn lb-close" aria-label="Cerrar">×</button>
    <button type="button" class="lb-btn lb-prev" aria-label="Anterior">‹</button>
    <div class="lb-stage"></div>
    <button type="button" class="lb-btn lb-next" aria-label="Siguiente">›</button>`;
  document.body.appendChild(lb);
  const lbStage = lb.querySelector(".lb-stage");

  const abrir = () => { lbStage.innerHTML = contenidoSlide(p, imgs[actual]); lb.hidden = false; document.body.style.overflow = "hidden"; };
  const cerrar = () => { lb.hidden = true; document.body.style.overflow = ""; };
  const moverLb = (d) => { mostrar(actual + d); lbStage.innerHTML = contenidoSlide(p, imgs[actual]); };

  visor.addEventListener("click", abrir);
  lb.querySelector(".lb-close").addEventListener("click", cerrar);
  lb.querySelector(".lb-prev").addEventListener("click", () => moverLb(-1));
  lb.querySelector(".lb-next").addEventListener("click", () => moverLb(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) cerrar(); });

  document.addEventListener("keydown", (e) => {
    if (e.target.matches("input, textarea")) return;
    if (lb.hidden) {
      if (e.key === "ArrowLeft") mostrar(actual - 1);
      if (e.key === "ArrowRight") mostrar(actual + 1);
      return;
    }
    if (e.key === "Escape") cerrar();
    if (e.key === "ArrowLeft") moverLb(-1);
    if (e.key === "ArrowRight") moverLb(1);
  });

  // ----- Cotizar por WhatsApp (botón de la caja y botón de la barra fija) -----
  const botones = [cont.querySelector("#cotizar"), cont.querySelector("#cotizar-bar")];
  const inputMed = cont.querySelector("#medidas");
  const actualizarEnlace = () => {
    const href = enlaceWhatsApp(mensajeCotizacion(p, color, inputMed.value));
    botones.forEach((b) => { if (b) b.href = href; });
  };

  inputMed.addEventListener("input", actualizarEnlace);
  cont.querySelectorAll(".chip").forEach((ch) =>
    ch.addEventListener("click", () => {
      color = ch.dataset.color;
      cont.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c === ch));
      actualizarEnlace();
    })
  );

  mostrar(0);
  actualizarEnlace();
}
