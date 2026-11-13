const WHATSAPP = "573000000000"; // TODO: cambiar por el número real de la empresa

export function initForm() {
  const form = document.getElementById("form-contacto");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const texto = `Hola, soy ${d.get("nombre")}. Quiero cotizar: ${d.get("servicio")}. ${d.get("mensaje") || ""}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank");
    form.reset();
  });
}
