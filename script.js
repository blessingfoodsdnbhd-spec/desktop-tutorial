/* ============================================================
   Atelier Noir — site interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav__toggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });

    nav.querySelectorAll(".nav__list a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Sticky header behaviour ---------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const isTransparent = header.classList.contains("site-header--transparent");
    const onScroll = () => {
      const y = window.scrollY;
      if (y > 40) {
        header.classList.add("site-header--scrolled");
        if (isTransparent) header.classList.remove("site-header--transparent");
      } else {
        header.classList.remove("site-header--scrolled");
        if (isTransparent) header.classList.add("site-header--transparent");
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Portfolio filter ---------- */
  const filterBar = document.querySelector("[data-filter-bar]");
  if (filterBar) {
    const cards = document.querySelectorAll("[data-filter-target]");
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-filter]");
      if (!btn) return;
      const filter = btn.getAttribute("data-filter");
      filterBar.querySelectorAll("button").forEach((b) =>
        b.classList.toggle("is-active", b === btn)
      );
      cards.forEach((card) => {
        const tags = (card.getAttribute("data-tags") || "").split(/\s+/);
        const show = filter === "all" || tags.includes(filter);
        card.style.display = show ? "" : "none";
      });
    });
  }

  /* ---------- Contact form ---------- */
  const form = document.querySelector("[data-contact-form]");
  if (form) {
    const success = form.querySelector(".form-success");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (success) {
        success.classList.add("is-visible");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
