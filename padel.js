const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("[data-delay]").forEach((element) => {
  element.style.setProperty("--delay", `${element.dataset.delay}ms`);
});

const revealElements = Array.from(document.querySelectorAll(".reveal"));

function revealVisibleElements() {
  const viewportHeight = window.innerHeight || 1;

  revealElements.forEach((element) => {
    if (element.classList.contains("is-visible")) return;

    const rect = element.getBoundingClientRect();
    if (rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.06) {
      element.classList.add("is-visible");
    }
  });
}

if (!reducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
  window.addEventListener("load", () => {
    revealVisibleElements();
    window.setTimeout(revealVisibleElements, 600);
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const parallaxFrames = Array.from(document.querySelectorAll(".parallax-frame"));

function updateParallax() {
  if (reducedMotion) return;

  const viewportHeight = window.innerHeight || 1;

  parallaxFrames.forEach((frame) => {
    const image = frame.querySelector("img");
    if (!image) return;

    const rect = frame.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > viewportHeight) return;

    const strength = Number(frame.dataset.parallax || 0.06);
    const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
    const offset = progress * rect.height * strength * -1;

    image.style.setProperty("--parallax-y", `${offset.toFixed(2)}px`);
  });
}

const stepsWrap = document.querySelector("[data-steps]");
const stepItems = stepsWrap ? Array.from(stepsWrap.querySelectorAll("[data-step]")) : [];

function updateSteps() {
  if (!stepsWrap) return;

  const rect = stepsWrap.getBoundingClientRect();
  const viewportHeight = window.innerHeight || 1;
  const start = viewportHeight * 0.74;
  const end = viewportHeight * 0.28;
  const rawProgress = (start - rect.top) / (rect.height + start - end);
  const progress = Math.max(0, Math.min(1, rawProgress));

  stepsWrap.style.setProperty("--line-progress", `${(progress * 100).toFixed(1)}%`);

  stepItems.forEach((step) => {
    const stepRect = step.getBoundingClientRect();
    const midpoint = stepRect.top + stepRect.height * 0.5;
    step.classList.toggle("is-active", midpoint < viewportHeight * 0.72);
  });
}

let ticking = false;

function requestParallaxUpdate() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateParallax();
    updateSteps();
    revealVisibleElements();
    ticking = false;
  });
}

window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
window.addEventListener("resize", requestParallaxUpdate);
requestParallaxUpdate();
