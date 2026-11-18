import { renderLayout } from "./layout.js";
import { initNavbar } from "./navbar.js";
import { initReveal } from "./scroll-reveal.js";
import { initCatalogo } from "./catalog.js";
import { initProducto } from "./producto.js";
import { initForm } from "./form.js";

function iniciar() {
  const pagina = document.body.dataset.page;
  renderLayout(pagina);
  initNavbar();
  if (pagina === "home") initForm();
  if (pagina === "catalogo") initCatalogo();
  if (pagina === "producto") initProducto();
  initReveal();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
else iniciar();
