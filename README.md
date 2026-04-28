# Atelier Noir — Interior Design Studio

A premium, fully responsive multi-page website for a luxury interior design
studio. Built as static HTML/CSS/JS, with no build step or framework.

## Pages

- `index.html` — Homepage (hero, intro, featured projects, services preview, CTA)
- `portfolio.html` — Filterable portfolio grid (Residential / Commercial / Hospitality)
- `project.html` — Project detail page (gallery, before/after, narrative)
- `about.html` — Company story, brand values, team
- `services.html` — Detailed services + design process
- `contact.html` — Contact form, business info, Google Map

## Design

- Typography: Cormorant Garamond (display) + Inter (body), via Google Fonts
- Palette: white / warm cream / charcoal-black / accent neutral
- Spacious layout, scroll-triggered fade-in animations
- Sticky transparent → solid header
- Floating WhatsApp button on every page
- Mobile-first responsive (hamburger nav under 768px)

## Editing content

Each page is plain HTML, organised in clearly commented sections. To swap
photography, change the `background-image: url('…')` references on
`.project-card__media`, `.intro__media`, `.hero__media`, `.team__member-photo`,
`.service-row__media`, etc. To wire up a CMS, the section structure maps
cleanly to typical content models (project, team-member, service).

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```
