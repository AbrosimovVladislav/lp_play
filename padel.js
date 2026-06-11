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

window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
window.addEventListener("resize", requestParallaxUpdate);
requestParallaxUpdate();

document.querySelectorAll("[data-accordion] .faq-item__button").forEach((button, index) => {
  const item = button.closest(".faq-item");

  if (index === 0) {
    item.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
  }

  button.addEventListener("click", () => {
    const isOpen = item.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
});

// Печатающееся слово в hero: своих → друзей → свою команду → …
const rotateWord = document.querySelector("[data-rotate]");

if (rotateWord && !reducedMotion) {
  const words = ["своих", "друзей", "компанию", "партнеров"];
  const typeSpeed = 80;
  const deleteSpeed = 45;
  const holdFull = 1500;
  const holdEmpty = 360;

  let wordIndex = 0;
  let charIndex = words[0].length;
  let deleting = true;

  function rotateTick() {
    const current = words[wordIndex];

    if (deleting) {
      charIndex -= 1;
      rotateWord.textContent = current.slice(0, charIndex);
      if (charIndex <= 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        window.setTimeout(rotateTick, holdEmpty);
        return;
      }
      window.setTimeout(rotateTick, deleteSpeed);
    } else {
      charIndex += 1;
      rotateWord.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        deleting = true;
        window.setTimeout(rotateTick, holdFull);
        return;
      }
      window.setTimeout(rotateTick, typeSpeed);
    }
  }

  window.setTimeout(rotateTick, holdFull);
}

// Форма записи → Supabase (таблица signups, проект PlayUp)
const signupForm = document.querySelector(".signup-form");

if (signupForm) {
  const SUPABASE_URL = "https://kebkzhztzlnomxzhtzwh.supabase.co";
  const SUPABASE_KEY = "sb_publishable_Rn2QUvh4_bkXNxhTCbXqDQ_bgos6Vp_";
  const SPORT = "Падел";
  const SOURCE = "signup";
  const TELEGRAM_RE = /^@[A-Za-z0-9_]{5,32}$/;

  const input = signupForm.querySelector("#telegram");
  const submitButton = signupForm.querySelector("button");
  const status = signupForm.querySelector(".signup-form__status");
  const defaultLabel = submitButton.textContent;

  function setStatus(message, kind) {
    if (!status) return;
    status.textContent = message || "";
    status.hidden = !message;
    status.classList.remove("is-error", "is-success");
    if (kind) status.classList.add(`is-${kind}`);
  }

  // Приводим ввод к виду @username: срезаем ссылку t.me и лишние @
  function normalizeTelegram(raw) {
    let value = raw.trim();
    value = value
      .replace(/^https?:\/\//i, "")
      .replace(/^(?:t|telegram)\.me\//i, "")
      .replace(/^@+/, "");
    return value ? `@${value}` : "";
  }

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const telegram = normalizeTelegram(input.value);

    if (!TELEGRAM_RE.test(telegram)) {
      setStatus(
        "Введи Telegram в виде @username (5–32 символа: буквы, цифры, _).",
        "error",
      );
      input.focus();
      return;
    }

    input.value = telegram;
    submitButton.disabled = true;
    submitButton.textContent = "Отправляем…";
    setStatus("");

    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/signups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          telegram,
          sport: SPORT,
          source: SOURCE,
          user_agent: navigator.userAgent.slice(0, 400),
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      signupForm.reset();
      submitButton.textContent = "Заявка отправлена";
      setStatus("Готово! Скоро напишем тебе в Telegram.", "success");
    } catch (error) {
      submitButton.disabled = false;
      submitButton.textContent = defaultLabel;
      setStatus(
        "Не получилось отправить. Попробуй ещё раз через минуту.",
        "error",
      );
    }
  });
}
