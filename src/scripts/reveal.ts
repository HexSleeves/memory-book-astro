/**
 * Adds `is-visible` to any [data-reveal] element when it scrolls into view.
 * One observer for the whole page; no per-element React hydration cost.
 */

const supportsIO = "IntersectionObserver" in window;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");

if (!supportsIO || reduceMotion) {
  elements.forEach((el) => el.classList.add("is-visible"));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
  );

  elements.forEach((el) => io.observe(el));
}
