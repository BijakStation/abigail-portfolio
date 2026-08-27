(() => {
  "use strict";

  const projects = window.ABIGAIL_PROJECTS;
  const browser = document.querySelector("[data-work-browser]");
  const grid = document.querySelector("[data-projects-grid]");
  const filtersContainer = document.querySelector("[data-filters]");
  const projectView = document.querySelector("[data-project-view]");
  const workIntro = document.querySelector("[data-work-intro]");

  if (!projects || !browser || !grid || !filtersContainer || !projectView || !workIntro) return;

  const categories = [
    { value: "all", label: "All" },
    { value: "editorial", label: "Editorial" },
    { value: "campaign", label: "Campaign" },
    { value: "talents", label: "Talents" },
    { value: "personal", label: "Personal Projects" }
  ];

  let activeFilter = "all";
  let activeProjectId = null;
  let activeSlide = 0;

  const padNumber = (number) => String(number).padStart(2, "0");
  const getProjectMedia = (project) => [
  ...project.images.map((src) => ({ type: "image", src })),
  ...(project.videos || []).map((src) => ({ type: "video", src }))
];

  const renderFilters = () => {
    filtersContainer.innerHTML = categories
      .map((category) => {
        const count = category.value === "all"
          ? projects.length
          : projects.filter((project) => project.category === category.value).length;

        return `
          <button type="button" class="filter-button${category.value === activeFilter ? " is-active" : ""}" data-filter="${category.value}">
            ${category.label} <span>${padNumber(count)}</span>
          </button>
        `;
      })
      .join("");
  };

  const renderGrid = () => {
    const visibleProjects = activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

    grid.innerHTML = visibleProjects
      .map((project) => `
        <article class="project-card reveal is-visible">
          <button type="button" data-project-id="${project.id}" aria-label="Ouvrir le projet ${project.title}">
            <span class="project-card__media">
              <img src="${project.images[0]}" alt="${project.title}" loading="lazy">
              <span class="project-card__overlay">View project</span>
            </span>
            <span class="project-card__meta">
              <span>
                <strong>${project.title}</strong>
                <small>${project.categoryLabel} · ${project.year}</small>
              </span>
              <span aria-hidden="true">↗</span>
            </span>
          </button>
        </article>
      `)
      .join("");
  };

const updateSlider = (project) => {
  const track = projectView.querySelector("[data-project-track]");
  const current = projectView.querySelector("[data-current-slide]");
  const previous = projectView.querySelector("[data-previous-slide]");
  const next = projectView.querySelector("[data-next-slide]");

  if (!track || !current || !previous || !next) return;

  const media = getProjectMedia(project);
  const slides = projectView.querySelectorAll(".project-slide");

  track.style.transform = `translateX(-${activeSlide * 100}%)`;
  current.textContent = padNumber(activeSlide + 1);

  previous.disabled = activeSlide === 0;
  next.disabled = activeSlide === media.length - 1;

  slides.forEach((slide, index) => {
    const video = slide.querySelector("video");

    if (!video) return;

    if (index === activeSlide) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  });
};

  const getRelatedProjects = (project) => {
    const sameCategory = projects.filter(
      (candidate) => candidate.category === project.category && candidate.id !== project.id
    );
    const remaining = projects.filter(
      (candidate) => candidate.category !== project.category && candidate.id !== project.id
    );

    return [...sameCategory, ...remaining].slice(0, 3);
  };

  const renderProject = (project) => {
    const relatedProjects = getRelatedProjects(project);

    projectView.innerHTML = `
      <div class="project-view__top page-shell">
        <button class="back-button" type="button" data-back-to-grid>← Back to all projects</button>
      </div>

      <header class="project-detail-header page-shell">
        <div>
          <p class="eyebrow blue-text">${project.categoryLabel} / ${project.year}</p>
          <h1>${project.title}</h1>
        </div>
        ${project.description ? `<p>${project.description}</p>` : ""}
      </header>

<div class="project-slider" data-project-slider tabindex="0" aria-label="Galerie du projet ${project.title}">
  <div class="project-slider__viewport">
    <div class="project-slider__track" data-project-track>

      ${getProjectMedia(project).map((media, index, allMedia) => {
        if (media.type === "video") {
          return `
            <figure class="project-slide">
                <video controls playsinline muted preload="metadata">
                <source src="${media.src}" type="video/mp4">
                Votre navigateur ne prend pas en charge la lecture vidéo.
              </video>
            </figure>
          `;
        }

        return `
          <figure class="project-slide">
            <img
              src="${media.src}"
              alt="${project.title} — image ${index + 1} sur ${allMedia.length}"
              loading="lazy"
            >
          </figure>
        `;
      }).join("")}

    </div>
  </div>

  <button class="slider-arrow slider-arrow--previous" type="button" data-previous-slide aria-label="Média précédent">←</button>
  <button class="slider-arrow slider-arrow--next" type="button" data-next-slide aria-label="Média suivant">→</button>

  <div class="slider-counter" aria-live="polite">
    <span data-current-slide>01</span>
    <i aria-hidden="true"></i>
    <span>${padNumber(getProjectMedia(project).length)}</span>
  </div>

  <p class="slider-hint">Use arrows or swipe</p>
</div>

      <section class="project-information page-shell">
  <dl>
    ${Object.entries(project.credits).map(([label, value]) => `
      <div>
        <dt>${label}</dt>
        <dd>${value}</dd>
      </div>
    `).join("")}
  </dl>

  ${project.concept ? `
    <div>
      <p class="section-label blue-text">Concept</p>
      <p class="project-concept">${project.concept}</p>
    </div>
  ` : ""}
</section>
      <section class="related-projects">
        <div class="page-shell">
          <p class="section-label">Continue exploring</p>
          <h2>Other projects</h2>
          <div class="related-grid">
            ${relatedProjects.map((related) => `
              <button type="button" data-related-id="${related.id}">
                <img src="${related.images[0]}" alt="${related.title}" loading="lazy">
                <span>${related.categoryLabel} · ${related.year}</span>
                <strong>${related.title}</strong>
              </button>
            `).join("")}
          </div>
        </div>
      </section>
    `;

    updateSlider(project);
  };

  const openProject = (projectId, updateHistory = true) => {
    const project = projects.find((item) => item.id === projectId);
    if (!project) return;

    activeProjectId = project.id;
    activeSlide = 0;
    renderProject(project);

    browser.hidden = true;
    workIntro.hidden = true;
    projectView.hidden = false;
    document.body.classList.add("project-is-open");

    if (updateHistory) {
      history.pushState({ projectId: project.id }, "", `#project=${project.id}`);
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    projectView.querySelector("[data-back-to-grid]")?.focus({ preventScroll: true });
  };

  const closeProject = (updateHistory = true) => {
    activeProjectId = null;
    activeSlide = 0;
    projectView.hidden = true;
    projectView.innerHTML = "";
    browser.hidden = false;
    workIntro.hidden = false;
    document.body.classList.remove("project-is-open");

    if (updateHistory) {
      history.pushState({}, "", `${window.location.pathname}${window.location.search}`);
    }

    window.scrollTo({ top: 0, behavior: "instant" });
    grid.querySelector("button")?.focus({ preventScroll: true });
  };

  const changeSlide = (direction) => {
  if (!activeProjectId) return;

  const project = projects.find((item) => item.id === activeProjectId);
  if (!project) return;

  const media = getProjectMedia(project);

  activeSlide = Math.max(
    0,
    Math.min(activeSlide + direction, media.length - 1)
  );

  updateSlider(project);
};

  filtersContainer.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    activeFilter = button.dataset.filter;
    renderFilters();
    renderGrid();
  });

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-project-id]");
    if (!button) return;
    openProject(button.dataset.projectId);
  });

  projectView.addEventListener("click", (event) => {
    if (event.target.closest("[data-back-to-grid]")) {
      closeProject();
      return;
    }

    if (event.target.closest("[data-previous-slide]")) {
      changeSlide(-1);
      return;
    }

    if (event.target.closest("[data-next-slide]")) {
      changeSlide(1);
      return;
    }

    const relatedButton = event.target.closest("[data-related-id]");
    if (relatedButton) openProject(relatedButton.dataset.relatedId);
  });

  projectView.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") changeSlide(-1);
    if (event.key === "ArrowRight") changeSlide(1);
    if (event.key === "Escape") closeProject();
  });

  let touchStartX = 0;
  projectView.addEventListener("touchstart", (event) => {
    if (!event.target.closest("[data-project-slider]")) return;
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });

  projectView.addEventListener("touchend", (event) => {
    if (!event.target.closest("[data-project-slider]")) return;
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) < 50) return;
    changeSlide(distance > 0 ? -1 : 1);
  }, { passive: true });

  window.addEventListener("popstate", () => {
    const projectId = new URLSearchParams(window.location.hash.replace("#", "")).get("project");
    if (projectId) openProject(projectId, false);
    else if (activeProjectId) closeProject(false);
  });

  renderFilters();
  renderGrid();

  const initialProjectId = new URLSearchParams(window.location.hash.replace("#", "")).get("project");
  if (initialProjectId) openProject(initialProjectId, false);
})();
