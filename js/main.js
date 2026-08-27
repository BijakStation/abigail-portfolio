(() => {
  "use strict";

  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  const yearTargets = document.querySelectorAll("[data-year]");
  const revealTargets = document.querySelectorAll(".reveal");

  yearTargets.forEach((target) => {
    target.textContent = String(new Date().getFullYear());
  });

  if (header) {
    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  if (menuToggle && navigation) {
    const closeMenu = () => {
      navigation.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    };

    menuToggle.addEventListener("click", () => {
      const willOpen = !navigation.classList.contains("is-open");
      navigation.classList.toggle("is-open", willOpen);
      menuToggle.setAttribute("aria-expanded", String(willOpen));
      document.body.classList.toggle("menu-open", willOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) closeMenu();
    });
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14 }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }
})();
