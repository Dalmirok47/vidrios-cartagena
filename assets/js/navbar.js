export function initNavbar() {
  const nav = document.querySelector(".navbar");
  const btn = document.querySelector(".nav-toggle");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  btn.addEventListener("click", () => {
    const abierto = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", abierto);
  });
  nav.querySelectorAll(".nav-links a").forEach(a =>
    a.addEventListener("click", () => nav.classList.remove("open"))
  );
}
