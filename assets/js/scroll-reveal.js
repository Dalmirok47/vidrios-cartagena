export function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add("visible"), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  items.forEach(el => observer.observe(el));
}
