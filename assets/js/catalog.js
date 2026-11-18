import { CATEGORIAS } from "./config.js";
import { PRODUCTOS } from "./productos.js";
import { esc, tarjeta } from "./ui.js";

export function initCatalogo() {
  const filtros = document.getElementById("filtros");
  const lista = document.getElementById("productos");
  const vacio = document.getElementById("sin-resultados");
  if (!filtros || !lista) return;

  // Permite entrar directo a una categoría: catalogo.html?cat=puertas
  const inicial = new URLSearchParams(location.search).get("cat");
  let activa = CATEGORIAS.some((c) => c.id === inicial) ? inicial : "todos";

  filtros.innerHTML = CATEGORIAS.map(
    (c) => `<button type="button" class="filter-btn" data-cat="${c.id}" aria-pressed="false">${esc(c.nombre)}</button>`
  ).join("");

  function pintar() {
    const items = activa === "todos" ? PRODUCTOS : PRODUCTOS.filter((p) => p.categoria === activa);
    lista.innerHTML = items.map(tarjeta).join("");
    vacio.hidden = items.length > 0;
    filtros.querySelectorAll(".filter-btn").forEach((b) => {
      const on = b.dataset.cat === activa;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on);
    });
  }

  filtros.addEventListener("click", (e) => {
    const b = e.target.closest(".filter-btn");
    if (!b) return;
    activa = b.dataset.cat;
    try {
      const url = new URL(location.href);
      if (activa === "todos") url.searchParams.delete("cat");
      else url.searchParams.set("cat", activa);
      history.replaceState(null, "", url);
    } catch (_) { /* sin historial, no pasa nada */ }
    pintar();
  });

  pintar();
}
