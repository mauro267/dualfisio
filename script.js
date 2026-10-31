/* =====================
   DUALFISIO — script.js v2
   ===================== */

/* ── Canvas particle background ── */
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, pts = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function mkPt() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + .4,
      dx: (Math.random() - .5) * .28,
      dy: (Math.random() - .5) * .28,
      op: Math.random() * .45 + .08,
      col: Math.random() > .5 ? '179,157,219' : '212,114,176'
    };
  }

  function init() {
    resize();
    pts = Array.from({ length: 70 }, mkPt);
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);

    // Lines
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(179,157,219,${.055 * (1 - d / 110)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }

    // Dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col},${p.op})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;
      if (p.y < -5) p.y = H + 5;
      if (p.y > H + 5) p.y = -5;
    });

    requestAnimationFrame(frame);
  }

  init();
  frame();
  window.addEventListener('resize', resize, { passive: true });
})();


/* ── Navbar scroll class ── */
(function () {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 36);
  }, { passive: true });
})();


/* ── Hamburger / mobile menu ── */
(function () {
  const btn = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('active', open);
    btn.setAttribute('aria-expanded', open);
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('active');
    });
  });
})();


/* ── Smooth scroll (offset for fixed nav) ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.pageYOffset - 80,
      behavior: 'smooth'
    });
  });
});


/* ── Scroll reveal ── */
(function () {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const delay = +en.target.dataset.delay || 0;
      setTimeout(() => en.target.classList.add('visible'), delay);
      io.unobserve(en.target);
    });
  }, { threshold: 0.13 });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));

  // Auto-stagger children of [data-stagger]
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.dataset.delay = i * 90;
      if (!child.classList.contains('reveal') &&
          !child.classList.contains('reveal-left') &&
          !child.classList.contains('reveal-right')) {
        child.classList.add('reveal');
      }
      io.observe(child);
    });
  });
})();


/* ── Animated counters ── */
(function () {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = +el.dataset.target;
      const dur = 1800;
      const step = target / (dur / 16);
      let cur = 0;
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.floor(cur).toLocaleString('es-CO');
        if (cur >= target) clearInterval(t);
      }, 16);
      io.unobserve(el);
    });
  }, { threshold: .5 });

  counters.forEach(c => io.observe(c));
})();


/* ── Parallax on hero orbs ── */
(function () {
  const hero = document.getElementById('hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.querySelectorAll('.orb').forEach((orb, i) => {
      orb.style.transform = `translateY(${y * (.15 + i * .08)}px)`;
    });
  }, { passive: true });
})();


/* ── Contact form submit ── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-send');
    btn.textContent = 'Enviando…';
    btn.disabled = true;
    setTimeout(() => {
      form.style.display = 'none';
      document.getElementById('form-ok').classList.add('show');
    }, 1400);
  });
})();


/* ── Active nav link highlight ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 110) cur = s.id;
    });
    links.forEach(l => {
      l.style.color = l.getAttribute('href') === `#${cur}` ? 'var(--purple-500)' : '';
    });
  }, { passive: true });
})();


/* ── Galería: carrusel de una imagen a la vez ── */
(function () {
  const root = document.getElementById('g-carousel');
  if (!root) return;
  const track = root.querySelector('.g-track');
  const slides = root.querySelectorAll('.g-slide');
  const dotsWrap = root.querySelector('.g-dots');
  const n = slides.length;
  let i = 0;

  const dots = Array.from(slides).map((_, k) => {
    const d = document.createElement('button');
    d.type = 'button';
    d.className = 'g-dot';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', `Ir a la imagen ${k + 1}`);
    d.addEventListener('click', () => go(k));
    dotsWrap.appendChild(d);
    return d;
  });

  function go(k) {
    i = (k + n) % n;
    track.style.transform = `translateX(-${i * 100}%)`;
    dots.forEach((d, j) => {
      d.classList.toggle('active', j === i);
      d.setAttribute('aria-selected', j === i ? 'true' : 'false');
    });
  }

  root.querySelector('.g-prev').addEventListener('click', () => go(i - 1));
  root.querySelector('.g-next').addEventListener('click', () => go(i + 1));
  root.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') go(i - 1);
    if (e.key === 'ArrowRight') go(i + 1);
  });

  let x0 = null;
  root.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  }, { passive: true });

  go(0);
})();
