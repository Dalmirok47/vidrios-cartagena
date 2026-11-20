export function initNavbar() {
  const nav = document.querySelector(".navbar");
  const btn = document.querySelector(".nav-toggle");
  if (!nav || !btn) return;

  const cerrar = () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-label", "Abrir menú");
  };
  const alternar = () => {
    const abierto = nav.classList.toggle("open");
    document.body.classList.toggle("menu-open", abierto);
    btn.setAttribute("aria-expanded", abierto);
    btn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  };

  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  btn.addEventListener("click", alternar);
  nav.querySelectorAll(".nav-links a").forEach((a) => a.addEventListener("click", cerrar));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrar(); });
  window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => { if (e.matches) cerrar(); });
}
