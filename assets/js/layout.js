import { CONFIG, enlaceWhatsApp } from "./config.js";

const ENLACES = [
  { href: "index.html", texto: "Inicio", paginas: ["home"] },
  { href: "catalogo.html", texto: "Catálogo", paginas: ["catalogo", "producto"] },
  { href: "index.html#nosotros", texto: "Nosotros", paginas: [] },
  { href: "index.html#contacto", texto: "Contacto", paginas: [] },
];

export function renderLayout(pagina) {
  const enlaces = ENLACES.map((e) => {
    const activo = e.paginas.includes(pagina);
    return `<a href="${e.href}"${activo ? ' class="active" aria-current="page"' : ""}>${e.texto}</a>`;
  }).join("");

  const header = `
    <header class="navbar">
      <div class="container nav-inner">
        <a href="index.html" class="logo"><img src="assets/img/logo/logo-icon.png" alt="" width="40" height="40"><span>Vidrios <span class="gradient-text">Cartagena</span></span></a>
        <nav class="nav-links" aria-label="Principal">
          ${enlaces}
          <a href="catalogo.html" class="btn btn-primary btn-sm">Cotizar</a>
        </nav>
        <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
    </header>`;

  const footer = `
    <footer class="footer">
      <div class="container footer-inner">
        <span>© ${new Date().getFullYear()} ${CONFIG.empresa}. Todos los derechos reservados.</span>
        <span>Puertas · Ventanas · Divisiones de baño y cocina</span>
      </div>
    </footer>`;

  const h = document.getElementById("site-header");
  if (h) h.outerHTML = header;
  const f = document.getElementById("site-footer");
  if (f) f.outerHTML = footer;

  let wa = document.querySelector(".wa-float");
  if (!wa) {
    wa = document.createElement("a");
    wa.className = "wa-float";
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.textContent = "WhatsApp";
    wa.setAttribute("aria-label", "Escríbenos por WhatsApp");
    document.body.appendChild(wa);
  }
  wa.href = enlaceWhatsApp("Hola, quisiera información sobre sus productos.");
}
