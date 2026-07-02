/* ========================================================
   PARTICLE / CONSTELLATION BACKGROUND (canvas)
======================================================== */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const COUNT = window.innerWidth < 760 ? 45 : 90;
  const MAXDIST = 140;
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.documentElement.scrollHeight;
  }
  function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6
      });
    }
  }
  function step() {
    ctx.clearRect(0, 0, w, h);
    const scrollY = window.scrollY;
    const viewTop = scrollY - 200, viewBottom = scrollY + window.innerHeight + 200;

    for (let p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      if (p.y < viewTop || p.y > viewBottom) continue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139,148,255,0.5)';
      ctx.fill();
    }
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      if (a.y < viewTop || a.y > viewBottom) continue;
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAXDIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,58,237,${(1 - dist / MAXDIST) * 0.18})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }
  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('load', () => { resize(); init(); });
  resize(); init(); step();
})();

/* ========================================================
   CURSOR GLOW
======================================================== */
(function () {
  const glow = document.getElementById('cursorGlow');
  let raf = null, tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('pointermove', (e) => {
    tx = e.clientX; ty = e.clientY;
    glow.style.opacity = 1;
    if (!raf) raf = requestAnimationFrame(tick);
  });
  function tick() {
    cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
    glow.style.left = cx + 'px'; glow.style.top = cy + 'px';
    if (Math.abs(tx - cx) > 0.3 || Math.abs(ty - cy) > 0.3) {
      raf = requestAnimationFrame(tick);
    } else { raf = null; }
  }
})();

/* ========================================================
   TYPEWRITER ROLE ROTATOR
======================================================== */
(function () {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const roles = ['Full Stack Developer', 'Problem Solver', 'Software Developer', 'Frontend Developer', 'Backend Developer'];
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const full = roles[ri];
    if (!deleting) {
      ci++;
      el.textContent = full.slice(0, ci);
      if (ci === full.length) { deleting = true; setTimeout(tick, 1400); return; }
    } else {
      ci--;
      el.textContent = full.slice(0, ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }
  el.style.color = 'var(--blue)';
  tick();
})();

/* ========================================================
   MAGNETIC BUTTONS
======================================================== */
(function () {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
})();

/* ========================================================
   SKILL CARD 3D TILT (delegated, since cards render dynamically)
======================================================== */
(function () {
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.skill-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-8px) rotateY(${px * 18}deg) rotateX(${-py * 18}deg)`;
  });
  document.addEventListener('pointerout', (e) => {
    const card = e.target.closest('.skill-card');
    if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
  });
})();

/* ========================================================
   PROJECT CARD SPOTLIGHT (cursor-following glow)
======================================================== */
(function () {
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.project-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--spot-x', (e.clientX - r.left) + 'px');
    card.style.setProperty('--spot-y', (e.clientY - r.top) + 'px');
  });
})();

/* ========================================================
   NAV: progress bar, active link, mobile menu, scroll style
======================================================== */
(function () {
  const nav = document.getElementById('nav');
  const progress = document.getElementById('navProgress');
  const links = document.querySelectorAll('.nav-links a');
  const sections = [...links].map(l => document.querySelector(l.getAttribute('href')));
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const scrollTopBtn = document.getElementById('scrollTop');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  function onScroll() {
    const doc = document.documentElement;
    const scrolled = (window.scrollY / (doc.scrollHeight - window.innerHeight)) * 100;
    progress.style.width = scrolled + '%';
    nav.style.boxShadow = window.scrollY > 20 ? '0 10px 30px rgba(0,0,0,0.3)' : 'none';
    scrollTopBtn.classList.toggle('show', window.scrollY > 600);

    let current = sections[0];
    const pos = window.scrollY + 140;
    sections.forEach(sec => { if (sec && sec.offsetTop <= pos) current = sec; });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current.id));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ========================================================
   THEME TOGGLE
======================================================== */
(function () {
  const btn = document.getElementById('themeToggle');
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
  });
})();

/* ========================================================
   HERO 3D TILT CARD + PARALLAX SHAPES
======================================================== */
(function () {
  const wrap = document.getElementById('tiltCard');
  const card = wrap.querySelector('.tilt-card');
  const shapes = document.querySelectorAll('.hero-shapes .shape');

  wrap.addEventListener('pointermove', (e) => {
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `rotateY(${px * 16}deg) rotateX(${-py * 16}deg) translateZ(0)`;
  });
  wrap.addEventListener('pointerleave', () => {
    card.style.transform = 'rotateY(0) rotateX(0)';
  });

  window.addEventListener('pointermove', (e) => {
    const px = e.clientX / window.innerWidth - 0.5;
    const py = e.clientY / window.innerHeight - 0.5;
    shapes.forEach((s, i) => {
      const depth = (i + 1) * 10;
      s.style.transform = `translate(${px * depth}px, ${py * depth}px)`;
    });
  });

  // ambient float animation via GSAP
  if (window.gsap) {
    shapes.forEach((s, i) => {
      gsap.to(s, {
        y: '+=18', duration: 3 + i, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.3
      });
    });
  }
})();

/* ========================================================
   SCROLL REVEAL (IntersectionObserver)
======================================================== */
(function () {
  const els = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
})();

/* ========================================================
   ANIMATED STAT COUNTERS
======================================================== */
(function () {
  const nums = document.querySelectorAll('.stat-num');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
})();

/* ========================================================
   SKILLS CAROUSEL
======================================================== */
(function () {
  const track = document.getElementById('skillsTrack');
  track.innerHTML = SKILLS.map(s => `
    <div class="skill-card">
      <div class="skill-icon${s.mono ? ' mono' : ''}"><i class="${s.icon}"></i></div>
      <div class="skill-name">${s.name}</div>
    </div>
  `).join('');

  document.getElementById('skillsPrev').addEventListener('click', () => track.scrollBy({ left: -300, behavior: 'smooth' }));
  document.getElementById('skillsNext').addEventListener('click', () => track.scrollBy({ left: 300, behavior: 'smooth' }));

  staggerIn(track.querySelectorAll('.skill-card'));
})();

/* helper: staggered pop-in for a set of elements when scrolled into view */
function staggerIn(nodeList, opts = {}) {
  const items = [...nodeList];
  if (!items.length) return;
  if (window.gsap) gsap.set(items, { opacity: 0, y: 24, scale: 0.94 });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      if (window.gsap) {
        gsap.to(entry.target, {
          opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.6)',
          delay: (items.indexOf(entry.target) % 8) * 0.06
        });
      } else {
        entry.target.style.opacity = 1;
      }
      io.unobserve(entry.target);
    });
  }, { threshold: 0.2, rootMargin: opts.rootMargin || '0px 200px' });
  items.forEach(i => io.observe(i));
}

/* ========================================================
   PROJECTS GRID + ANIMATED MEDIA CANVAS
======================================================== */
(function () {
  const grid = document.getElementById('projectGrid');
  grid.innerHTML = PROJECTS.map((p, i) => `
    <div class="project-card">
      <div class="project-media">
        <span class="project-tag-float">${p.tag}</span>
        <canvas data-idx="${i}" data-accent="${p.accent}" data-kind="${p.kind}"></canvas>
      </div>
      <div class="project-body">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
        <div class="project-stack">${p.stack.map(t => `<span>${t}</span>`).join('')}</div>
        <div class="project-actions">
          <a href="${p.github || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-small">View Code
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </a>
        </div>
      </div>
    </div>
  `).join('');

  staggerIn(grid.querySelectorAll('.project-card'), { rootMargin: '0px 0px -100px 0px' });

  // animate each canvas: a lightweight generative "dashboard" or "route" motif
  grid.querySelectorAll('canvas').forEach(canvas => {
    const kind = canvas.dataset.kind;
    const accent = canvas.dataset.accent;
    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    }
    resize();
    window.addEventListener('resize', resize);
    const ctx = canvas.getContext('2d');
    let t = 0;

    function drawGrid() {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#12162e'); g.addColorStop(1, '#080a18');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

      if (kind === 'grid') {
        // bars like a timetable
        const cols = 8, rows = 4;
        const pad = w * 0.08;
        const cw = (w - pad * 2) / cols, ch = (h - pad * 2) / rows;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const seed = Math.sin(c * 12.9898 + r * 78.233 + Math.floor(t / 40)) * 43758.5453;
            const on = (seed - Math.floor(seed)) > 0.55;
            if (!on) continue;
            const x = pad + c * cw, y = pad + r * ch;
            ctx.fillStyle = c % 3 === 0 ? 'rgba(139,92,246,0.55)' : c % 3 === 1 ? 'rgba(79,139,255,0.5)' : 'rgba(236,72,153,0.45)';
            ctx.beginPath();
            ctx.roundRect(x + 4, y + 4, cw - 8, ch - 8, 5);
            ctx.fill();
          }
        }
      } else {
        // route/path motif with moving dot
        ctx.strokeStyle = 'rgba(79,139,255,0.35)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.75);
        ctx.bezierCurveTo(w * 0.3, h * 0.2, w * 0.6, h * 0.9, w * 0.92, h * 0.25);
        ctx.stroke();
        const progress = (Math.sin(t / 60) + 1) / 2;
        const pt = bezierPoint(progress, [w*0.1,h*0.75],[w*0.3,h*0.2],[w*0.6,h*0.9],[w*0.92,h*0.25]);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.shadowColor = accent; ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      t++;
      requestAnimationFrame(drawGrid);
    }
    function bezierPoint(t, p0, p1, p2, p3) {
      const x = Math.pow(1-t,3)*p0[0] + 3*Math.pow(1-t,2)*t*p1[0] + 3*(1-t)*t*t*p2[0] + t*t*t*p3[0];
      const y = Math.pow(1-t,3)*p0[1] + 3*Math.pow(1-t,2)*t*p1[1] + 3*(1-t)*t*t*p2[1] + t*t*t*p3[1];
      return { x, y };
    }
    drawGrid();
  });
})();

/* ========================================================
   MINI PROJECT GRID (small clone cards with tilt + glow)
======================================================== */
(function () {
  const grid = document.getElementById('miniProjectGrid');
  if (!grid || typeof MORE_PROJECTS === 'undefined') return;

  grid.innerHTML = MORE_PROJECTS.map(p => `
    <div class="mini-project-card" style="--accent:${p.accent}">
      <div class="mini-project-icon"><i class="${p.icon}"></i></div>
      <span class="mini-project-tag">${p.tag}</span>
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <div class="mini-project-stack">${p.stack.map(t => `<span>${t}</span>`).join('')}</div>
      <a href="${p.github}" target="_blank" rel="noopener noreferrer" class="mini-project-link">
        View Code
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14m0 0-6-6m6 6-6 6"/></svg>
      </a>
    </div>
  `).join('');

  staggerIn(grid.querySelectorAll('.mini-project-card'), { rootMargin: '0px 0px -80px 0px' });

  // 3D tilt on hover, same feel as skill cards but a touch subtler
  grid.addEventListener('pointermove', (e) => {
    const card = e.target.closest('.mini-project-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `translateY(-6px) scale(1.03) rotateY(${px * 10}deg) rotateX(${-py * 10}deg)`;
    card.style.setProperty('--spot-x', (e.clientX - r.left) + 'px');
    card.style.setProperty('--spot-y', (e.clientY - r.top) + 'px');
  });
  grid.addEventListener('pointerout', (e) => {
    const card = e.target.closest('.mini-project-card');
    if (card && !card.contains(e.relatedTarget)) card.style.transform = '';
  });
})();

/* ========================================================
   CERTIFICATIONS TIMELINE
======================================================== */
(function () {
  const icons = {
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z"/><path d="M17 4h3a3 3 0 0 1-3 5M7 4H4a3 3 0 0 0 3 5"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    chart: '<path d="M3 3v18h18"/><path d="M18.7 8 13 13.7l-4-4L3 16"/>',
    cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3"/>',
    grad: '<path d="m22 10-10-5L2 10l10 5 10-5Z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/>'
  };
  const track = document.getElementById('certTrack');
  track.innerHTML = CERTS.map(c => `
    <div class="cert-card">
      <div class="cert-icon"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2">${icons[c.icon]}</svg></div>
      <div class="cert-year" style="margin-top:12px;">${c.year}</div>
      <div class="cert-title">${c.title}</div>
      <div class="cert-org">${c.org}</div>
    </div>
  `).join('');
  document.getElementById('certPrev').addEventListener('click', () => track.scrollBy({ left: -280, behavior: 'smooth' }));
  document.getElementById('certNext').addEventListener('click', () => track.scrollBy({ left: 280, behavior: 'smooth' }));

  staggerIn(track.querySelectorAll('.cert-card'));
})();

/* ========================================================
   ABOUT: rotating wireframe globe (canvas, no deps)
======================================================== */
(function () {
  const canvas = document.getElementById('globeCanvas');
  const ctx = canvas.getContext('2d');
  let size = 220;
  function resize() {
    canvas.width = size * devicePixelRatio;
    canvas.height = size * devicePixelRatio;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(devicePixelRatio, devicePixelRatio);
  }
  resize();
  const R = size * 0.36, cx = size / 2, cy = size / 2;
  let angle = 0;
  const lats = 7, lons = 10;
  function project(lat, lon) {
    const x = R * Math.cos(lat) * Math.sin(lon + angle);
    const y = R * Math.sin(lat);
    const z = R * Math.cos(lat) * Math.cos(lon + angle);
    return { x: cx + x, y: cy + y, z };
  }
  function draw() {
    ctx.clearRect(0, 0, size, size);
    for (let i = 0; i <= lats; i++) {
      const lat = (i / lats - 0.5) * Math.PI;
      ctx.beginPath();
      for (let j = 0; j <= 40; j++) {
        const lon = (j / 40) * Math.PI * 2;
        const p = project(lat, lon);
        const op = (p.z / R + 1) / 2;
        if (j === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = 'rgba(139,148,255,0.18)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    for (let j = 0; j < lons; j++) {
      const lon = (j / lons) * Math.PI * 2;
      ctx.beginPath();
      for (let i = 0; i <= 40; i++) {
        const lat = (i / 40 - 0.5) * Math.PI;
        const p = project(lat, lon);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = 'rgba(139,148,255,0.18)';
      ctx.stroke();
    }
    // pin
    const pin = project(0.35, 1.55);
    ctx.beginPath();
    ctx.arc(pin.x, pin.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ec4899';
    ctx.shadowColor = '#ec4899'; ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    angle += 0.004;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ========================================================
   CONTACT FORM (email submit + envelope particles)
======================================================== */
(function () {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const originalButtonText = button.innerHTML;
    const formData = new FormData(form);
    success.classList.remove('show');
    button.disabled = true;
    button.innerHTML = 'Sending...';

    if (formData.get('access_key') === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      success.textContent = 'Add your Web3Forms access key first.';
      success.classList.add('show');
      button.disabled = false;
      button.innerHTML = originalButtonText;
      return;
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Message failed');

      success.textContent = 'Message sent — thanks for reaching out! ✦';
      success.classList.add('show');
      form.reset();
    } catch (error) {
      success.textContent = 'Opening secure submit page...';
      success.classList.add('show');
      form.submit();
      return;
    } finally {
      button.disabled = false;
      button.innerHTML = originalButtonText;
    }

    if (window.gsap) {
      gsap.fromTo('.env-body', { rotate: -2 }, { rotate: 6, duration: 0.15, yoyo: true, repeat: 5, ease: 'power1.inOut' });
    }
    setTimeout(() => success.classList.remove('show'), 4000);
  });
})();
