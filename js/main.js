/* ALN Glamz — Vanilla JS */
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ——— Loading ——— */
  function initLoading() {
    const screen = $('#loading-screen');
    const app = $('#app');
    if (!screen || !app) return;

    const letters = $('#loading-letters');
    if (letters) {
      const text = 'ALN GLAMZ';
      letters.innerHTML = text
        .split('')
        .map((ch, i) => {
          const cls = ch === ' ' ? 'space' : '';
          const delay = i * 0.06;
          return `<span class="${cls}" style="animation-delay:${delay}s">${ch === ' ' ? '' : ch}</span>`;
        })
        .join('');
    }

    setTimeout(() => {
      screen.classList.add('is-hidden');
      app.classList.remove('is-loading');
      document.body.classList.add('has-custom-cursor');
      setTimeout(() => screen.remove(), 900);
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }, 2800);
  }

  /* ——— Navigation ——— */
  function initNavigation() {
    const nav = $('#nav');
    const overlay = $('#mobile-menu');
    const openBtn = $('#nav-menu-open');
    const closeBtn = $('#nav-menu-close');

    const onScroll = () => {
      if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    openBtn?.addEventListener('click', () => overlay?.classList.add('is-open'));
    closeBtn?.addEventListener('click', () => overlay?.classList.remove('is-open'));
    $$('#mobile-menu a').forEach((a) => {
      a.addEventListener('click', () => overlay?.classList.remove('is-open'));
    });

    const scrollToSection = (id) => {
      const target = document.getElementById(id);
      if (!target) return;

      const navOffset = nav?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      history.pushState(null, '', `#${id}`);
    };

    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1);
        if (!id || !document.getElementById(id)) return;

        e.preventDefault();
        overlay?.classList.remove('is-open');
        scrollToSection(id);
      });
    });

    $('#nav-book')?.addEventListener('click', () => {
      scrollToSection('book');
    });
    $('#hero-book')?.addEventListener('click', () => {
      scrollToSection('book');
    });
    $('#hero-explore')?.addEventListener('click', () => {
      scrollToSection('services');
    });

    const scrollToCurrentHash = () => {
      const id = window.location.hash.slice(1);
      if (id && document.getElementById(id)) scrollToSection(id);
    };

    window.addEventListener('hashchange', scrollToCurrentHash);
  }

  /* ——— Custom cursor ——— */
  function initCursor() {
    const cursor = $('#custom-cursor');
    if (!cursor || window.matchMedia('(max-width: 767px)').matches) return;

    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;

    document.addEventListener('mousemove', (e) => {
      x = e.clientX;
      y = e.clientY;
    });

    const tick = () => {
      cx += (x - cx) * 0.35;
      cy += (y - cy) * 0.35;
      cursor.style.left = `${cx}px`;
      cursor.style.top = `${cy}px`;
      requestAnimationFrame(tick);
    };
    tick();

    document.addEventListener('mouseover', (e) => {
      const t = e.target;
      const hover =
        t.closest('a, button, .cursor-pointer, input, select, textarea, label');
      cursor.classList.toggle('is-hover', !!hover);
    });
  }

  /* ——— Magnet buttons ——— */
  function initMagnet() {
    if (window.matchMedia('(max-width: 767px)').matches) return;
    $$('[data-magnet]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${dx * 0.2}px, ${dy * 0.2}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ——— Scroll reveal ——— */
  function initReveal() {
    const els = $$('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ——— Footer line ——— */
  function initFooterLine() {
    const line = $('#footer-line');
    if (!line) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) line.classList.add('is-visible');
      },
      { threshold: 0.5 }
    );
    io.observe(line);
  }

  /* ——— Hero background slideshow ——— */
  function initHeroSlideshow() {
    // Change hero images in the `heroImages` array below.
  }

  /* Change hero images here (replace filenames in assets/). */
  const heroImages = ['assets/heronew1.jpeg', 'assets/heronew2.avif', 'assets/heronew3.jpg'];

  function initHeroSlideshow() {
    const container = $('#hero-bg');
    if (!container || !heroImages.length) return;

    // Build slides from the centralized `heroImages` array.
    container.innerHTML = '';
    heroImages.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' is-active' : '');
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.width = 1920;
      img.height = 2560;
      img.decoding = 'async';
      if (i === 0) img.setAttribute('fetchpriority', 'high');
      slide.appendChild(img);
      container.appendChild(slide);

      // Preload
      const p = new Image();
      p.src = src;
    });

    const slides = $$('#hero-bg .hero-slide');
    if (slides.length < 2) return;

    let index = 0;
    setInterval(() => {
      slides[index].classList.remove('is-active');
      index = (index + 1) % slides.length;
      slides[index].classList.add('is-active');
    }, 4000);
  }

  /* ——— GSAP sections ——— */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const hero = $('#hero');
    const heroBg = $('#hero-bg');
    const heroContent = $('#hero-content');
    if (hero && heroBg && heroContent) {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        gsap.to(heroBg, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
        gsap.to(heroContent, {
          yPercent: 50,
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '60% top',
            scrub: true,
          },
        });
      });
    }

    const bridal = $('#bridal');
    const bridalBg = $('#bridal-bg');
    if (bridal && bridalBg) {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px)', () => {
        gsap.to(bridalBg, {
          yPercent: 25,
          ease: 'none',
          scrollTrigger: {
            trigger: bridal,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });
    }
  }

  /* ——— Bridal dots ——— */
  function initBridalDots() {
    const bridal = $('#bridal');
    if (!bridal) return;
    const dots = [
      { left: '12%', top: '20%', dur: 14 },
      { left: '25%', top: '65%', dur: 11 },
      { left: '45%', top: '15%', dur: 16 },
      { left: '60%', top: '75%', dur: 12 },
      { left: '72%', top: '30%', dur: 15 },
      { left: '85%', top: '55%', dur: 10 },
      { left: '38%', top: '85%', dur: 13 },
    ];
    dots.forEach((d, i) => {
      const el = document.createElement('div');
      el.className = 'bridal-dot';
      el.style.left = d.left;
      el.style.top = d.top;
      el.style.animationDuration = `${d.dur}s`;
      el.style.animationDelay = `${i * 1.3}s`;
      bridal.appendChild(el);
    });
  }

  /* ——— Booking form ——— */
  function initBookingForm() {
    const form = $('#booking-form');
    if (!form) return;

    const whatsappNumber = '918086706787';

    const validate = () => {
      let ok = true;
      const name = form.querySelector('[name="name"]');
      const phone = form.querySelector('[name="phone"]');
      const service = form.querySelector('[name="service"]');
      const date = form.querySelector('[name="date"]');

      const check = (input, test, msg) => {
        const group = input.closest('.form-group');
        const err = group?.querySelector('.form-error');
        const invalid = !test(input.value.trim());
        group?.classList.toggle('is-invalid', invalid);
        if (err) err.textContent = msg;
        if (invalid) ok = false;
      };

      check(name, (v) => v.length >= 2, 'Name is required');
      check(phone, (v) => v.length >= 10, 'Valid phone number required');
      check(service, (v) => v.length >= 1, 'Please select a service');
      check(date, (v) => v.length >= 1, 'Please select a preferred date');
      return ok;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate()) return;

      const formData = new FormData(form);
      const service = form.querySelector('[name="service"]');
      const selectedService = service?.options[service.selectedIndex]?.text || '';
      const name = String(formData.get('name') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const date = String(formData.get('date') || '').trim();
      const notes = String(formData.get('message') || '').trim();
      const message = [
        'Hello Aleena, I would like to book an appointment at ALN Glamz Makeover Studio.',
        '',
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Service: ${selectedService}`,
        `Preferred Date: ${date}`,
        `Notes: ${notes}`,
        '',
        'Please confirm availability.',
      ].join('\n');

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      $$('.form-group', form).forEach((g) => g.classList.remove('is-invalid'));
    });
  }

  /* ——— Init ——— */
  function init() {
    initLoading();
    initNavigation();
    initCursor();
    initMagnet();
    initReveal();
    initFooterLine();
    initBridalDots();
    initBookingForm();
    initHeroSlideshow();
    initGSAP();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
