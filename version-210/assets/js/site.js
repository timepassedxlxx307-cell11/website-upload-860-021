const menuToggle = document.querySelector("[data-menu-toggle]");
const mainNav = document.querySelector("[data-main-nav]");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("is-open");
  });
}

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    image.classList.add("is-missing");
  });
});

const hero = document.querySelector("[data-hero-carousel]");

if (hero) {
  const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
  const prev = hero.querySelector("[data-hero-prev]");
  const next = hero.querySelector("[data-hero-next]");
  let current = 0;
  let timer = 0;

  const showSlide = (index) => {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === current);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  };

  const startTimer = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(current + 1), 5200);
  };

  prev?.addEventListener("click", () => {
    showSlide(current - 1);
    startTimer();
  });

  next?.addEventListener("click", () => {
    showSlide(current + 1);
    startTimer();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.heroDot || 0));
      startTimer();
    });
  });

  showSlide(0);
  startTimer();
}

document.querySelectorAll("[data-search-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    const input = form.querySelector("input[name='q']");
    const query = input?.value.trim() || "";

    if (!query) {
      return;
    }

    event.preventDefault();
    const action = form.getAttribute("action") || "search.html";
    window.location.href = `${action}?q=${encodeURIComponent(query)}`;
  });
});

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const applyFilters = (panel) => {
  const targetSelector = panel.dataset.filterTarget;
  const target = targetSelector ? document.querySelector(targetSelector) : document;

  if (!target) {
    return;
  }

  const input = panel.querySelector("[data-search-input]");
  const typeFilter = panel.querySelector("[data-type-filter]");
  const regionFilter = panel.querySelector("[data-region-filter]");
  const yearFilter = panel.querySelector("[data-year-filter]");
  const cards = Array.from(target.querySelectorAll(".movie-card"));

  const update = () => {
    const query = normalize(input?.value);
    const type = normalize(typeFilter?.value);
    const region = normalize(regionFilter?.value);
    const year = normalize(yearFilter?.value);

    cards.forEach((card) => {
      const text = normalize([
        card.dataset.title,
        card.dataset.year,
        card.dataset.region,
        card.dataset.type,
        card.dataset.genre,
        card.dataset.tags,
        card.textContent
      ].join(" "));

      const matchesQuery = !query || text.includes(query);
      const matchesType = !type || normalize(card.dataset.type) === type;
      const matchesRegion = !region || normalize(card.dataset.region) === region;
      const matchesYear = !year || normalize(card.dataset.year) === year;

      card.hidden = !(matchesQuery && matchesType && matchesRegion && matchesYear);
    });
  };

  [input, typeFilter, regionFilter, yearFilter].forEach((control) => {
    control?.addEventListener("input", update);
    control?.addEventListener("change", update);
  });

  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");

  if (query && input) {
    input.value = query;
  }

  update();
};

document.querySelectorAll(".filter-panel").forEach(applyFilters);
