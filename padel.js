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

const activityDetails = {
  run: {
    image: "assets/images/club-run.jpg",
    alt: "Участники клуба бегут вдоль реки утром",
    kicker: "Каждое воскресенье · 9:00",
    title: "Воскресный бег по набережной",
    lead: "Лёгкий разговорный темп: бежим так, чтобы можно было спокойно общаться.",
    paragraphs: [
      "Можно приходить и без подписки, чтобы познакомиться с нами. Стартуем на набережной возле Калемегдана, даём круг до Галерии и обратно — в сумме около 5 км.",
      "После идём в кафе. Там часто самое интересное: пробежка скорее повод собраться, спокойно поговорить и увидеть, кто вообще в клубе.",
      "Никто не меряется темпом и не ждёт личных рекордов. Если можешь поддерживать лёгкий бег и хочешь познакомиться с людьми — этого достаточно.",
    ],
    facts: [
      ["Темп", "разговорный"],
      ["Когда", "воскресенье, 9:00"],
      ["Маршрут", "Калемегдан — Галерия"],
      ["Дистанция", "около 5 км"],
    ],
  },
  saturday: {
    image: "assets/images/club-saturday-v2.png",
    alt: "Дневная субботняя тусовка клуба в кофейне с DJ, танцами, кофе и лимонадами",
    kicker: "Суббота · старт в 13:00",
    title: "Тусовки в субботу",
    lead: "Дневная туса без алкоголя: DJ, танцы, кофе, лимонады и люди из клуба.",
    paragraphs: [
      "Это не ночной клуб и не обязательное afterparty. Просто лёгкий дневной формат, куда можно зайти на час или зависнуть дольше, если пошло.",
      "Иногда это DJ-сет во дворе кофейни, иногда бранч, иногда просто музыка и разговоры после недели. Мы специально держим формат живым, чтобы он не превращался в расписание ради расписания.",
      "Можно прийти одному: вокруг уже будут знакомые лица из игр, пробежек и чата, а дальше всё обычно складывается само.",
    ],
    facts: [
      ["Когда", "суббота, 13:00"],
      ["Формат", "DJ, танцы, кофе"],
      ["Алко", "без алкоголя"],
      ["Вход", "по анонсу в чате"],
    ],
  },
  stretch: {
    image: "assets/images/club-stretch-park.png",
    alt: "Участники клуба делают растяжку в парке после спорта",
    kicker: "Парк · мягкий темп",
    title: "Растяжка в парке",
    lead: "Спокойная растяжка на траве, чтобы тело выдохнуло после игр, пробежек и недели.",
    paragraphs: [
      "Собираемся в парке, берём коврики и делаем простую мобильность: спина, ноги, плечи, дыхание. Это не урок на гибкость и не проверка формы.",
      "Можно прийти после игры, после пробежки или просто потому что хочется чуть больше движения без корта. Всё идёт в комфортном темпе, без давления.",
      "После часто остаёмся погулять или заходим на кофе. Как и везде в PlayUp, активность — скорее повод увидеть своих.",
    ],
    facts: [
      ["Темп", "спокойный"],
      ["Где", "парк по анонсу"],
      ["Нужно", "коврик и вода"],
      ["Для кого", "любой уровень"],
    ],
  },
  recovery: {
    image: "assets/images/club-recovery-spa.png",
    alt: "Спортивные участники клуба отдыхают в джакузи и хаммаме после нагрузки",
    kicker: "Recovery · после нагрузки",
    title: "Рекавери",
    lead: "Хаммам, джакузи и спокойный разговор вместо ещё одной тренировки.",
    paragraphs: [
      "Иногда лучший способ продолжить спорт — нормально восстановиться. Собираемся в spa-формате: хаммам, джакузи, вода, расслабленный темп и никакой спешки.",
      "Это история для тех, кто играл, бегал или просто устал от недели. Приходишь без спортивной задачи: погреться, выдохнуть и побыть с людьми из клуба.",
      "Формат появляется в чате отдельным анонсом. Если откликается — бронируешь место, если нет — спокойно пропускаешь.",
    ],
    facts: [
      ["Формат", "хаммам и джакузи"],
      ["Темп", "медленно"],
      ["Когда", "по анонсу"],
      ["Настрой", "восстановиться"],
    ],
  },
};

const activityModal = document.querySelector("[data-activity-modal]");
const activityList = document.querySelector(".masonry");

if (activityModal && activityList) {
  const modalImage = activityModal.querySelector("[data-activity-image]");
  const modalKicker = activityModal.querySelector("[data-activity-kicker]");
  const modalTitle = activityModal.querySelector("[data-activity-title]");
  const modalLead = activityModal.querySelector("[data-activity-lead]");
  const modalText = activityModal.querySelector("[data-activity-text]");
  const modalFacts = activityModal.querySelector("[data-activity-facts]");
  const closeButtons = activityModal.querySelectorAll("[data-activity-close]");
  const closeButton = activityModal.querySelector(".activity-modal__close");
  let lastFocusedElement = null;

  function fillActivityModal(activity) {
    modalImage.src = activity.image;
    modalImage.alt = activity.alt;
    modalKicker.textContent = activity.kicker;
    modalTitle.textContent = activity.title;
    modalLead.textContent = activity.lead;
    modalText.replaceChildren(
      ...activity.paragraphs.map((paragraph) => {
        const element = document.createElement("p");
        element.textContent = paragraph;
        return element;
      }),
    );
    modalFacts.replaceChildren(
      ...activity.facts.map(([term, description]) => {
        const group = document.createElement("div");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = term;
        dd.textContent = description;
        group.append(dt, dd);
        return group;
      }),
    );
  }

  function openActivityModal(activityKey) {
    const activity = activityDetails[activityKey];
    if (!activity) return;

    lastFocusedElement = document.activeElement;
    fillActivityModal(activity);
    activityModal.hidden = false;
    document.body.classList.add("is-modal-open");
    closeButton.focus({ preventScroll: true });
  }

  function closeActivityModal() {
    if (activityModal.hidden) return;

    activityModal.hidden = true;
    document.body.classList.remove("is-modal-open");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus({ preventScroll: true });
    }
  }

  document.addEventListener("click", (event) => {
    const activityButton = event.target.closest("[data-activity]");
    if (!activityButton || !activityList.contains(activityButton)) return;

    event.preventDefault();
    openActivityModal(activityButton.dataset.activity);
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeActivityModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeActivityModal();
    }
  });
}

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
