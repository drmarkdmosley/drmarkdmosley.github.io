/* ==========================================
   DR. MARK D. MOSLEY - PORTFOLIO v2
   Scroll-Up Reveal + Count-Up Stats
   ========================================== */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ---- Active nav link ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-50% 0px -50% 0px' });
sections.forEach(s => sectionObserver.observe(s));

// ---- Mobile nav ----
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !open);
  navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => { navMenu.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); });
});

// ============================================================
//  SCROLL-UP REVEAL SYSTEM
//  Like student portfolio: elements slide UP into view
//  when user scrolls to them. Hero items reveal on page load
//  with staggered delays.
// ============================================================
const suItems = document.querySelectorAll('.su-reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

suItems.forEach(el => revealObserver.observe(el));

// ============================================================
//  COUNT-UP ANIMATION
//  Fires 800ms after page load (hero is already visible).
//  easeOutCubic for professional deceleration effect.
// ============================================================
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  // Inject suffix span INSIDE .stat-num-wrap (after the number span)
  const wrap = el.closest('.stat-num-wrap') || el.parentNode;
  let suffixEl = wrap.querySelector('.stat-suffix');
  if (!suffixEl && suffix) {
    suffixEl = document.createElement('span');
    suffixEl.className = 'stat-suffix';
    suffixEl.textContent = suffix;
    wrap.appendChild(suffixEl);
  }

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const val = Math.floor(easeOutCubic(progress) * target);
    el.textContent = val;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }
  requestAnimationFrame(update);
}

// Fire counters when they scroll into view
let countersStarted = false;
function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  document.querySelectorAll('.counter').forEach((el, i) => {
    setTimeout(() => animateCounter(el), i * 150);
  });
}

const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      startCounters();
      statsObserver.disconnect();
    }
  }, { threshold: 0.1 });
  statsObserver.observe(statsSection);
}

// ---- Hero image fallback ----
const heroImg = document.getElementById('heroImg');
const photoFallback = document.getElementById('photoFallback');
if (heroImg && photoFallback) {
  heroImg.addEventListener('error', () => {
    heroImg.style.display = 'none';
    photoFallback.style.display = 'flex';
  });
}

// ---- Particle Canvas ----
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.45 + 0.1;
      this.r = Math.random() * 1.8 + 0.4;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${this.alpha})`;
      ctx.fill();
    }
  }

  const particles = Array.from({ length: 90 }, () => new Particle());

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201,168,76,${0.07 * (1 - d / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  })();
}

// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); }
  });
});

// ---- Card hover glow ----
document.querySelectorAll('.cert-card, .timeline-card, .edu-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.background = `radial-gradient(circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(201,168,76,0.06), var(--bg-card) 70%)`;
  });
  card.addEventListener('mouseleave', () => { card.style.background = ''; });
});

console.log('Dr. Mark D. Mosley Portfolio v2 initialized.');

// ============================================================
//  EXPERIENCE TAB LOGIC
// ============================================================
const expTabs = document.querySelectorAll('.exp-tab');
const expPanels = document.querySelectorAll('.exp-panel');
const expDetail = document.querySelector('.exp-detail');
const closeBtns = document.querySelectorAll('.exp-close-btn');

function switchTab(targetId) {
  expTabs.forEach(t => t.classList.remove('active'));
  expPanels.forEach(p => p.classList.remove('active'));

  const tab = document.querySelector(`.exp-tab[data-target="${targetId}"]`);
  const panel = document.getElementById(targetId);

  if (tab) tab.classList.add('active');
  if (panel) {
    panel.classList.add('active');
    // On mobile, show the detail modal overlay
    if (window.innerWidth <= 992) {
      expDetail.classList.add('mobile-active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }
}

expTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.target;
    switchTab(target);
  });
});

closeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    expDetail.classList.remove('mobile-active');
    document.body.style.overflow = '';
  });
});

function syncDetailHeight() {
  if (window.innerWidth > 992) {
    const expMaster = document.querySelector('.exp-master');
    const expDetail = document.querySelector('.exp-detail');
    if (expMaster && expDetail) {
      expDetail.style.height = expMaster.offsetHeight + "px";
    }

    const teachMaster = document.querySelector('.teach-master');
    const teachDetail = document.querySelector('.teach-detail');
    if (teachMaster && teachDetail) {
      teachDetail.style.height = teachMaster.offsetHeight + "px";
    }
  } else {
    const expDetail = document.querySelector('.exp-detail');
    if (expDetail) expDetail.style.height = "auto";
    const teachDetail = document.querySelector('.teach-detail');
    if (teachDetail) teachDetail.style.height = "auto";
  }
}
window.addEventListener("resize", syncDetailHeight);
window.addEventListener("load", syncDetailHeight);
// call immediately in case page is already loaded
setTimeout(syncDetailHeight, 100);


// Teaching Tabs
const teachTabs = document.querySelectorAll('.teach-tab');
const teachPanels = document.querySelectorAll('.teach-panel');
const teachDetail = document.querySelector('.teach-detail');
const teachCloseBtns = document.querySelectorAll('.teach-close-btn');

function switchTeachTab(targetId) {
  teachTabs.forEach(t => t.classList.remove('active'));
  teachPanels.forEach(p => p.classList.remove('active'));

  const tab = document.querySelector(`.teach-tab[data-target="${targetId}"]`);
  const panel = document.getElementById(targetId);

  if (tab) tab.classList.add('active');
  if (panel) {
    panel.classList.add('active');
    if (window.innerWidth <= 992 && teachDetail) {
      teachDetail.classList.add('mobile-active');
      document.body.style.overflow = 'hidden';
    }
  }
}

teachTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    switchTeachTab(tab.dataset.target);
  });
});

if (teachCloseBtns) {
  teachCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (teachDetail) {
        teachDetail.classList.remove('mobile-active');
      }
      document.body.style.overflow = '';
    });
  });
}




function initCertLogoRotators() {
  const multiLogoContainers = document.querySelectorAll('.cert-logo-multi');
  multiLogoContainers.forEach(container => {
    const images = container.querySelectorAll('img');
    if (images.length <= 1) return;

    let currentIndex = 0;
    setInterval(() => {
      images[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % images.length;
      images[currentIndex].classList.add('active');
    }, 2000);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCertLogoRotators);
} else {
  initCertLogoRotators();
}


// Certifications Carousel Logic
function initCertsCarousel() {
  const track = document.getElementById('certs-track');
  const prevBtn = document.getElementById('certs-prev');
  const nextBtn = document.getElementById('certs-next');
  const counter = document.getElementById('certs-counter');
  const wrapper = document.querySelector('.certs-track-wrapper');

  if (!track || !prevBtn || !nextBtn || !counter || !wrapper) return;

  const cards = track.querySelectorAll('.cert-card-sleek');
  let currentSlide = 0;
  let totalSlides = 1;
  let cardsPerView = 3;

  function updateLayout() {
    if (window.innerWidth <= 768) return;
    cardsPerView = window.innerWidth <= 1200 ? 2 : 3;
    totalSlides = Math.ceil(cards.length / cardsPerView);
    updateCounter();
  }

  function updateCounter() {
    if (window.innerWidth <= 768) return;

    const gap = 24;
    const viewWidth = wrapper.offsetWidth + gap;
    // Calculate current slide based on scroll position
    currentSlide = Math.round(wrapper.scrollLeft / viewWidth);

    // Safety clamp
    if (currentSlide >= totalSlides) currentSlide = Math.max(0, totalSlides - 1);

    counter.innerHTML = 'SLIDE ' + (currentSlide + 1) + ' OF ' + totalSlides + '<br>15 CERTIFICATIONS';
    prevBtn.disabled = wrapper.scrollLeft <= 10; // disable if near start
    // disable if near end
    nextBtn.disabled = (wrapper.scrollLeft + wrapper.offsetWidth >= track.scrollWidth - 10);
  }

  window.addEventListener('resize', updateLayout);
  wrapper.addEventListener('scroll', updateCounter, { passive: true });

  prevBtn.addEventListener('click', () => {
    const gap = 24;
    wrapper.scrollBy({ left: -(wrapper.offsetWidth + gap), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    const gap = 24;
    wrapper.scrollBy({ left: (wrapper.offsetWidth + gap), behavior: 'smooth' });
  });

  updateLayout();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCertsCarousel);
} else {
  initCertsCarousel();
}

// ---- Contact Form ----
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = document.getElementById('contactName').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    const bodyText = `Name: ${name}\n\nMessage:\n${message}`;

    const mailtoUrl = `mailto:drmarkdmosley@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    window.location.href = mailtoUrl;

    const btn = document.getElementById('contactSubmit');
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = 'Wait, opening your default email app...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        form.reset();
      }, 5000);
    }
  });
}

// ---- Smooth scroll ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); }
  });
});

// ============================================================
//  MOBILE SKILLS MODAL LOGIC
// ============================================================
function openSkillsModal(title, parentNode) {
  const modal = document.getElementById('skillsMobileModal');
  const modalTitle = document.getElementById('skillsModalTitle');
  const modalTags = document.getElementById('skillsModalTags');

  if (!modal || !modalTitle || !modalTags) return;

  // Set Title
  modalTitle.innerHTML = title;

  // Clone all ind-tag elements from the parent, except the button itself
  modalTags.innerHTML = '';
  const tags = parentNode.querySelectorAll('.ind-tag:not(.mobile-more-btn)');
  tags.forEach(tag => {
    const clone = tag.cloneNode(true);
    // Remove the mobile-hide class from the clones so they display in the modal!
    clone.classList.remove('mobile-hide');
    modalTags.appendChild(clone);
  });

  // Show Modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeSkillsModal() {
  const modal = document.getElementById('skillsMobileModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ============================================================
//  MOBILE EDUCATION MODAL LOGIC
// ============================================================
function openEduModal() {
  const modal = document.getElementById('eduMobileModal');
  const modalContent = document.getElementById('eduModalContent');
  const grid = document.querySelector('.education-grid');

  if (!modal || !modalContent || !grid) return;

  // Clone all edu-card elements, stripping the mobile-hide class so they all show in the modal
  modalContent.innerHTML = '';
  const cards = grid.querySelectorAll('.edu-card');
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.remove('edu-mobile-hide');
    clone.classList.add('visible'); // Force visibility, overriding any un-triggered scroll animations
    modalContent.appendChild(clone);
  });

  // Show Modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeEduModal() {
  const modal = document.getElementById('eduMobileModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ============================================================
//  MOBILE CERTIFICATIONS MODAL LOGIC
// ============================================================
function openCertsModal() {
  const modal = document.getElementById('certsMobileModal');
  const modalContent = document.getElementById('certsModalContent');
  const track = document.getElementById('certs-track');

  if (!modal || !modalContent || !track) return;

  modalContent.innerHTML = '';
  const cards = track.querySelectorAll('.cert-card-sleek');
  cards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.classList.remove('cert-mobile-hide');
    clone.classList.add('visible'); // Force visibility
    modalContent.appendChild(clone);
  });

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCertsModal() {
  const modal = document.getElementById('certsMobileModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
