/* ==========================================================================
   D. Makewitz Cerimonial — Main JS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Header scroll effect ---------- */
  var header = document.querySelector('.header');
  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    // Back to top
    var btn = document.querySelector('.back-to-top');
    if (btn) {
      if (window.scrollY > 400) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.header__toggle');
  var mobileMenu = document.querySelector('.mobile-menu');
  var mobileClose = document.querySelector('.mobile-menu__close');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function () {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    mobileClose.addEventListener('click', function () {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Typewriter effect ---------- */
  var taglineEl = document.querySelector('.hero__tagline');
  if (taglineEl) {
    var text = taglineEl.getAttribute('data-text');
    taglineEl.textContent = '';
    var i = 0;
    function typeChar() {
      if (i < text.length) {
        taglineEl.textContent += text.charAt(i);
        i++;
        setTimeout(typeChar, 60);
      }
    }
    setTimeout(typeChar, 800);
  }

  /* ---------- Counter animation ---------- */
  var counters = document.querySelectorAll('[data-count]');
  var observed = new Set();

  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !observed.has(entry.target)) {
        observed.add(entry.target);
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1500;
        var start = 0;
        var startTime = null;

        function animateCount(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var value = Math.floor(progress * target);
          el.textContent = prefix + value + suffix;
          if (progress < 1) requestAnimationFrame(animateCount);
          else el.textContent = prefix + target + suffix;
        }
        requestAnimationFrame(animateCount);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(function (c) { counterObserver.observe(c); });

  /* ---------- Portfolio lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  var lightboxImg = document.querySelector('.lightbox__img');
  var items = document.querySelectorAll('.portfolio__item');
  var currentIdx = 0;

  function openLightbox(idx) {
    currentIdx = idx;
    lightboxImg.src = items[idx].querySelector('img').src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  items.forEach(function (item, idx) {
    item.addEventListener('click', function () { openLightbox(idx); });
  });

  if (lightbox) {
    document.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox__prev').addEventListener('click', function () {
      openLightbox((currentIdx - 1 + items.length) % items.length);
    });
    document.querySelector('.lightbox__next').addEventListener('click', function () {
      openLightbox((currentIdx + 1) % items.length);
    });
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') openLightbox((currentIdx - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') openLightbox((currentIdx + 1) % items.length);
    });
  }

  /* ---------- Testimonials carousel ---------- */
  var track = document.querySelector('.testimonials__track');
  var dots = document.querySelectorAll('.testimonials__dot');
  var prevBtn = document.querySelector('.testimonials__btn--prev');
  var nextBtn = document.querySelector('.testimonials__btn--next');
  var pauseBtn = document.querySelector('.testimonials__btn--pause');
  var totalSlides = dots.length;
  var currentSlide = 0;
  var autoplayInterval;
  var paused = false;

  function goToSlide(n) {
    currentSlide = (n + totalSlides) % totalSlides;
    track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  function startAutoplay() {
    autoplayInterval = setInterval(function () {
      if (!paused) goToSlide(currentSlide + 1);
    }, 6000);
  }

  if (track && dots.length) {
    prevBtn.addEventListener('click', function () { goToSlide(currentSlide - 1); });
    nextBtn.addEventListener('click', function () { goToSlide(currentSlide + 1); });
    if (pauseBtn) {
      pauseBtn.addEventListener('click', function () {
        paused = !paused;
        this.textContent = paused ? '\u25B6' : '\u275A\u275A';
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { goToSlide(i); });
    });
    goToSlide(0);
    startAutoplay();
  }

  /* ---------- Contact form → WhatsApp ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var msg = 'Olá! Meu nome é ' + fd.get('name') + '.\n\n';
      if (fd.get('eventType')) msg += 'Tipo de evento: ' + fd.get('eventType') + '\n';
      if (fd.get('date')) msg += 'Data: ' + fd.get('date') + '\n';
      if (fd.get('message')) msg += '\nMensagem: ' + fd.get('message') + '\n';
      if (fd.get('email')) msg += '\nEmail: ' + fd.get('email');
      if (fd.get('phone')) msg += '\nTelefone: ' + fd.get('phone');
      window.open('https://wa.me/5551999999999?text=' + encodeURIComponent(msg), '_blank');
    });
  }

  /* ---------- Floating WhatsApp ---------- */
  var whatsFloat = document.querySelector('.whatsapp-float');
  var tooltip = document.querySelector('.whatsapp-float__tooltip');
  var tooltipClose = document.querySelector('.whatsapp-float__tooltip-close');

  if (whatsFloat) {
    setTimeout(function () { whatsFloat.classList.add('visible'); }, 2000);
    setTimeout(function () { if (tooltip) tooltip.classList.add('visible'); }, 4000);
    if (tooltipClose) {
      tooltipClose.addEventListener('click', function () {
        tooltip.classList.remove('visible');
      });
    }
  }

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Fade-in on scroll ---------- */
  var fadeEls = document.querySelectorAll('.fade-in');
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in--visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(function (el) { fadeObserver.observe(el); });

});
