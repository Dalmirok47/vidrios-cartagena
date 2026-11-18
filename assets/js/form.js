import { CONFIG, enlaceWhatsApp } from "./config.js";

export function initForm() {
  const form = document.getElementById("form-contacto");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const texto = `Hola, ${CONFIG.empresa}. Soy ${d.get("nombre")}. Quiero cotizar: ${d.get("servicio")}. ${d.get("mensaje") || ""}`;
    window.open(enlaceWhatsApp(texto), "_blank");
    form.reset();
  });
}
