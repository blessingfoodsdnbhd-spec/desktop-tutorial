/* ==============================================================
   render.js — reads content.js (window.SITE) and renders into
   the HTML page skeletons.
   You should NOT need to edit this file. Edit content.js instead.
   ============================================================== */
(function () {
  "use strict";

  if (!window.SITE) {
    console.error("content.js did not load — window.SITE is missing.");
    return;
  }
  const S = window.SITE;
  const studio = S.studio;
  const waBase = `https://wa.me/${studio.phoneRaw}?text=${encodeURIComponent(studio.whatsappMsg)}`;

  /* ---------- Helpers ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const html = (tpl) => tpl;        // identity for readability
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));

  /* ---------- 1. Studio info: nav, footer, contact, WhatsApp ---------- */
  $$('[data-studio="name"]').forEach(el => el.textContent = studio.name);
  $$('[data-studio="name-upper"]').forEach(el => el.textContent = studio.name.toUpperCase());
  $$('[data-studio="subtitle"]').forEach(el => el.textContent = studio.subtitle);
  $$('[data-studio="email"]').forEach(el => {
    el.textContent = studio.email;
    if (el.tagName === "A") el.href = `mailto:${studio.email}`;
  });
  $$('[data-studio="phone"]').forEach(el => {
    el.textContent = studio.phoneDisplay;
    if (el.tagName === "A") el.href = `tel:+${studio.phoneRaw}`;
  });
  $$('[data-studio="whatsapp-link"]').forEach(el => el.href = waBase);
  $$('[data-studio="whatsapp-display"]').forEach(el => el.textContent = studio.phoneDisplay);
  $$('[data-studio="location-line1"]').forEach(el => el.textContent = studio.locationLine1);
  $$('[data-studio="location-line2"]').forEach(el => el.textContent = studio.locationLine2);
  $$('[data-studio="hours-line1"]').forEach(el => el.textContent = studio.hoursLine1);
  $$('[data-studio="hours-line2"]').forEach(el => el.textContent = studio.hoursLine2);
  $$('[data-studio="hours-note"]').forEach(el => el.textContent = studio.hoursNote);
  $$('[data-studio="map"]').forEach(el => el.src = studio.mapEmbedUrl);
  $$('[data-current-year]').forEach(el => el.textContent = new Date().getFullYear());


  /* ---------- 2. Hero (homepage) ---------- */
  const hero = $('[data-render="hero"]');
  if (hero) {
    hero.innerHTML = html`
      <div class="hero__media" style="background-image: url('${esc(S.hero.image)}');"></div>
      <div class="container">
        <div class="hero__content">
          <span class="eyebrow hero__eyebrow">${esc(S.hero.eyebrow)}</span>
          <h1 class="hero__title">${S.hero.titleHTML}</h1>
          <p class="hero__lead">${esc(S.hero.lead)}</p>
          <div class="btn-row">
            <a href="portfolio.html" class="btn btn--light">View Portfolio</a>
            <a href="contact.html" class="btn btn--light">Contact Us</a>
          </div>
        </div>
      </div>
      <div class="hero__scroll">Scroll</div>
    `;
  }

  /* ---------- 3. Home intro ---------- */
  const homeIntro = $('[data-render="home-intro"]');
  if (homeIntro) {
    homeIntro.innerHTML = html`
      <div class="reveal" style="max-width: 880px; margin: 0 auto; text-align: center;">
        <span class="eyebrow">${esc(S.homeIntro.eyebrow)}</span>
        <h2 style="font-size: clamp(1.8rem, 3.4vw, 2.6rem); margin: 0.5rem 0 0; line-height: 1.25;">
          ${S.homeIntro.titleHTML}
        </h2>
      </div>
    `;
  }

  /* ---------- 4. Featured projects on homepage ----------
     One repeatable layout: full-bleed image + caption below.
     All featured projects render the same way.
  --------------------------------------------------------------- */
  const featuredEl = $('[data-render="featured-projects"]');
  if (featuredEl) {
    const featured = S.projects.filter(p => p.featured);
    featuredEl.innerHTML = featured.map((p, i) => html`
      <a href="project.html?id=${esc(p.id)}" class="showcase__item showcase__item--bleed reveal">
        <div class="showcase__media" style="background-image: url('${esc(p.coverImage)}');"></div>
        <div class="showcase__caption">
          <div>
            <div class="showcase__index">${String(i + 1).padStart(2, "0")} — ${esc(capitalize(p.type))}</div>
            <h3 class="showcase__title">${esc(p.name)}</h3>
            <div class="showcase__meta">${esc(p.location)} · ${esc(p.year)}</div>
          </div>
          <span class="showcase__cta">View Project →</span>
        </div>
      </a>
    `).join("");
  }

  /* ---------- 5. Home CTA ---------- */
  const homeCta = $('[data-render="home-cta"]');
  if (homeCta) {
    homeCta.innerHTML = html`
      <div class="reveal">
        <span class="eyebrow" style="color: rgba(255,255,255,0.6);">${esc(S.homeCta.eyebrow)}</span>
        <h2>${S.homeCta.titleHTML}</h2>
        <p>${esc(S.homeCta.text)}</p>
        <div class="btn-row" style="justify-content: center;">
          <a href="contact.html" class="btn btn--light">${esc(S.homeCta.buttonText)}</a>
        </div>
      </div>
    `;
  }


  /* ---------- 6. Portfolio grid (all projects + filters) ---------- */
  const portfolioEl = $('[data-render="all-projects"]');
  if (portfolioEl) {
    portfolioEl.innerHTML = S.projects.map((p, i) => html`
      <a href="project.html?id=${esc(p.id)}" class="project-card reveal ${i % 2 ? "reveal--delay-1" : ""}" data-filter-target data-tags="${esc(p.type)}">
        <div class="project-card__media-wrap">
          <div class="project-card__media" style="aspect-ratio: 4 / 5; background-image: url('${esc(p.coverImage)}');"></div>
          <div class="project-card__overlay">
            <div>
              <h3>${esc(p.name)}</h3>
              <div class="project-card__overlay-meta">${esc(capitalize(p.type))} · ${esc(p.location)}</div>
            </div>
          </div>
        </div>
        <div class="project-card__body">
          <div>
            <h3 class="project-card__title">${esc(p.name)}</h3>
            <div class="project-card__meta">${esc(capitalize(p.type))} · ${esc(p.location)}</div>
          </div>
          <span class="project-card__cta">→</span>
        </div>
      </a>
    `).join("");
  }


  /* ---------- 7. Project detail page ---------- */
  const projectDetail = $('[data-render="project-detail"]');
  if (projectDetail) {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const project = S.projects.find(p => p.id === id) || S.projects[0];

    document.title = `${project.name} — ${studio.name}`;
    setMeta('og:title', `${project.name} — ${studio.name}`);
    setMeta('og:description', project.shortDesc);
    setMeta('og:image', project.coverImage);

    // Index for next-project link
    const idx = S.projects.indexOf(project);
    const next = S.projects[(idx + 1) % S.projects.length];

    const galleryHtml = (project.gallery || []).map((img, i) => {
      const isWide = i === 0 || i === 2;
      const ratio = isWide ? "16 / 9" : "4 / 5";
      return html`
        <div class="bleed reveal" style="margin-top: ${i === 0 ? "2rem" : "clamp(2rem, 5vw, 4rem)"};">
          <div class="gallery__img" style="aspect-ratio: ${ratio}; background-image: url('${esc(img)}');"></div>
        </div>
      `;
    }).join("");

    projectDetail.innerHTML = html`
      <section class="project-hero" style="height: 100vh; min-height: 100svh; background-image: url('${esc(project.coverImage)}');">
        <div class="container" style="position: absolute; left: 0; right: 0; bottom: 4rem; color: #fff;">
          <span class="eyebrow" style="color: rgba(255,255,255,0.85);">Project · ${esc(project.year)} · ${esc(capitalize(project.type))}</span>
          <h1 style="color: #fff; margin: 0.5rem 0 0; font-size: clamp(2.6rem, 6vw, 5rem);">${esc(project.name)}</h1>
        </div>
      </section>

      <section class="container">
        <div class="project-meta">
          <div class="reveal">
            <span class="eyebrow">Concept</span>
            <h2 style="font-size: clamp(1.6rem, 3vw, 2.4rem); margin: 0.5rem 0 0;">${esc(project.shortDesc)}</h2>
            ${(project.longDesc || []).map(p => `<p class="lead" style="margin-top: 1.5rem;">${esc(p)}</p>`).join("")}
          </div>
          <div class="project-meta__details reveal reveal--delay-1">
            <div><div class="detail__label">Location</div>     <div class="detail__value">${esc(project.location)}</div></div>
            <div><div class="detail__label">Type</div>         <div class="detail__value">${esc(capitalize(project.type))}</div></div>
            <div><div class="detail__label">Area</div>         <div class="detail__value">${esc(project.area)}</div></div>
            <div><div class="detail__label">Year</div>         <div class="detail__value">${esc(project.year)}</div></div>
            <div><div class="detail__label">Scope</div>        <div class="detail__value">${esc(project.scope)}</div></div>
            <div><div class="detail__label">Photography</div>  <div class="detail__value">${esc(project.photographer)}</div></div>
          </div>
        </div>
      </section>

      ${galleryHtml}

      <section class="container" style="margin-top: var(--space-xl);">
        <div class="next-project">
          <a href="portfolio.html" class="link-arrow" style="border-bottom: none; padding: 0;">← All Projects</a>
          <a href="project.html?id=${esc(next.id)}" style="text-align: right;">
            <span class="next-project__label">Next Project</span>
            <span style="font-family: var(--font-display); font-size: clamp(1.6rem, 2.6vw, 2.2rem); color: var(--color-ink);">${esc(next.name)} →</span>
          </a>
        </div>
      </section>
    `;
  }


  /* ---------- 8. Services rows (services page) ---------- */
  const servicesEl = $('[data-render="services-rows"]');
  if (servicesEl) {
    servicesEl.innerHTML = S.services.map((s, i) => html`
      <article class="service-row ${i % 2 ? "service-row--reverse" : ""} reveal">
        <div class="service-row__media" style="background-image: url('${esc(s.image)}');"></div>
        <div>
          <span class="service-row__num">${esc(s.number)} — Service</span>
          <h2 class="service-row__title">${esc(s.title)}</h2>
          <p class="lead">${esc(s.desc)}</p>
          <ul class="service-card__list">
            ${(s.items || []).map(it => `<li>${esc(it)}</li>`).join("")}
          </ul>
        </div>
      </article>
    `).join("");
  }

  /* ---------- 9. Process steps ---------- */
  const processEl = $('[data-render="process-steps"]');
  if (processEl) {
    processEl.innerHTML = S.process.map((p, i) => html`
      <div class="process__step reveal ${i ? "reveal--delay-" + i : ""}">
        <div class="process__step-num">${esc(p.number)}</div>
        <h3 class="process__step-title">${esc(p.title)}</h3>
        <p class="process__step-desc">${esc(p.text)}</p>
      </div>
    `).join("");
  }


  /* ---------- 10. About — story, values, team, press ---------- */
  const aboutHero = $('[data-render="about-hero"]');
  if (aboutHero) {
    aboutHero.innerHTML = html`
      <div class="page-hero__inner">
        <span class="eyebrow">About the Studio</span>
        <h1 class="page-hero__title">${esc(S.about.pageHeading)}</h1>
        <p class="page-hero__lead">${esc(S.about.pageLead)}</p>
      </div>
    `;
  }

  const aboutStory = $('[data-render="about-story"]');
  if (aboutStory) {
    aboutStory.innerHTML = html`
      <div class="intro__media reveal" style="background-image: url('${esc(S.about.storyImage)}');"></div>
      <div class="intro__copy reveal reveal--delay-1">
        <span class="eyebrow">Our Story</span>
        <h2>${esc(S.about.storyHeading)}</h2>
        ${(S.about.storyText || []).map(p => `<p>${esc(p)}</p>`).join("")}
        <div class="signature">${esc(S.about.signature)}</div>
      </div>
    `;
  }

  const valuesEl = $('[data-render="values"]');
  if (valuesEl) {
    valuesEl.innerHTML = S.values.map((v, i) => html`
      <article class="value reveal ${i ? "reveal--delay-" + i : ""}">
        <span class="value__num">${esc(v.number)}</span>
        <h3>${esc(v.title)}</h3>
        <p>${esc(v.text)}</p>
      </article>
    `).join("");
  }

  const teamEl = $('[data-render="team"]');
  if (teamEl) {
    teamEl.innerHTML = S.team.map((m, i) => html`
      <article class="reveal ${i % 3 ? "reveal--delay-" + (i % 3) : ""}">
        <div class="team__member-photo" style="background-image: url('${esc(m.photo)}');"></div>
        <h3 class="team__member-name">${esc(m.name)}</h3>
        <div class="team__member-role">${esc(m.role)}</div>
      </article>
    `).join("");
  }

  const pressEl = $('[data-render="press"]');
  if (pressEl) {
    pressEl.innerHTML = S.press.map(name => `<span>${esc(name)}</span>`).join("");
  }


  /* ---------- Helpers ---------- */
  function capitalize(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  }

  function setMeta(prop, value) {
    let el = document.querySelector(`meta[property="${prop}"]`) ||
             document.querySelector(`meta[name="${prop}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(prop.startsWith("og:") ? "property" : "name", prop);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  }
})();
