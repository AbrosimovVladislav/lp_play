// Единый блок «Жизнь клуба» для всех лендингов PlayUp.
// Это про комьюнити, а не про конкретный вид спорта, поэтому тексты карточек
// общие. Картинку для модалки берём из самой плитки — так каждый лендинг
// сохраняет свои фото (например, женские у padel-girls), а текст остаётся единым.
const activityDetails = {
  run: {
    kicker: "Каждое воскресенье · 9:00",
    title: "Воскресный бег по набережной",
    lead: "Лёгкий разговорный темп: бежим так, чтобы можно было общаться.",
    paragraphs: [
      "Можно прийти без подписки: познакомиться и пробежать с нами.  Бежим около 5 км.",
      "После заходим в кафе. Бег — повод собраться, спокойно поговорить и увидеть людей из клуба.",
      "Без рекордов и сравнений. Если хочешь бежать спокойно и знакомиться — этого достаточно.",
    ],
    facts: [
      ["Темп", "разговорный"],
      ["Когда", "воскресенье, 9:00"],
      ["Маршрут", "Калемегдан — Галерия"],
      ["Дистанция", "около 5 км"],
    ],
  },
  saturday: {
    kicker: "Суббота · старт в 13:00",
    title: "Тусовки в субботу",
    lead: "Дневная туса без алкоголя: DJ, кофе, лимонады и люди из клуба.",
    paragraphs: [
      "Это не ночной клуб и не обязательное afterparty: можно зайти на час или остаться дольше.",
      "Иногда DJ-сет во дворе кофейни, иногда бранч или музыка после недели. Формат живой, без расписания ради расписания.",
      "Можно прийти одному: рядом уже будут знакомые лица из занятий, пробежек и чата.",
    ],
    facts: [
      ["Когда", "суббота, 13:00"],
      ["Формат", "DJ, танцы, кофе"],
      ["Алко", "без алкоголя"],
      ["Вход", "по анонсу в чате"],
    ],
  },
  stretch: {
    kicker: "Парк · мягкий темп",
    title: "Растяжка в парке",
    lead: "Спокойная растяжка на траве после спорта, практики и недели.",
    paragraphs: [
      "Собираемся в парке, берём коврики и делаем простую мобильность: спина, ноги, плечи, дыхание.",
      "Можно прийти после занятия, пробежки или просто ради движения без спортивной задачи. Всё идёт в мягком темпе.",
      "После часто гуляем или заходим на кофе. Активность — ещё один повод увидеть своих.",
    ],
    facts: [
      ["Темп", "спокойный"],
      ["Где", "парк по анонсу"],
      ["Нужно", "коврик и вода"],
      ["Для кого", "любой уровень"],
    ],
  },
  recovery: {
    kicker: "Recovery · после нагрузки",
    title: "Рекавери",
    lead: "Хаммам, джакузи и спокойный разговор вместо ещё одной тренировки.",
    paragraphs: [
      "Иногда лучший способ продолжить спорт — восстановиться. Собираемся в spa-формате: хаммам, джакузи, вода и никакой спешки.",
      "Для тех, кто занимался, бегал или просто устал от недели. Приходишь без задачи: погреться, выдохнуть и побыть с клубом.",
      "Анонс появляется в чате. Если откликается — бронируешь место, если нет — спокойно пропускаешь.",
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

  // Картинку и alt берём из плитки, по которой кликнули, — у каждого лендинга свои фото.
  function fillActivityModal(activity, tileImage) {
    if (tileImage) {
      modalImage.src = tileImage.currentSrc || tileImage.src;
      modalImage.alt = tileImage.alt || "";
    }
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

  function openActivityModal(activityKey, sourceButton) {
    const activity = activityDetails[activityKey];
    if (!activity) return;

    lastFocusedElement = document.activeElement;
    fillActivityModal(activity, sourceButton && sourceButton.querySelector("img"));
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
    openActivityModal(activityButton.dataset.activity, activityButton);
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
