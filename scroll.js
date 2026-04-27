// ----- Scroll progress bar -----
const bar = document.getElementById('progress-bar');
function updateProgress() {
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  bar.style.width = pct + '%';
}
document.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ----- Reveal-on-scroll -----
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// ----- Hero parallax -----
const back = document.querySelector('.parallax-back');
const mid = document.querySelector('.parallax-mid');
function parallax() {
  const y = window.scrollY;
  if (back) back.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
  if (mid) mid.style.transform = `translate3d(0, ${y * 0.32}px, 0)`;
}
document.addEventListener('scroll', parallax, { passive: true });

// ----- Smooth nav highlight -----
const navLinks = document.querySelectorAll('.nav-links a');
const sections = [...document.querySelectorAll('main .section')];
const linkFor = (id) => [...navLinks].find((a) => a.getAttribute('href') === '#' + id);
const navIO = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      navLinks.forEach((a) => a.classList.remove('active'));
      const link = linkFor(e.target.id);
      if (link) link.classList.add('active');
    }
  }
}, { threshold: 0.5 });
sections.forEach((s) => navIO.observe(s));
