/**
 * Fred's Records - Premium Interaction Layer
 * Scroll reveals, spatial depth, magnetic buttons, context-aware hero, quiet mode.
 * Pure vanilla JS. No dependencies. Progressive enhancement only.
 */

(function () {
  'use strict';

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let quietMode = false;

  // =========================================
  // 1. SCROLL-TRIGGERED REVEAL ANIMATIONS
  // =========================================
  function initScrollReveals() {
    if (quietMode || prefersReduced) return;

    const targets = document.querySelectorAll(
      '.product-card, .merch-card, .value-card, .process-card, .why-card, .tl-item, ' +
      '.section-header, .collection-block, .heritage-inner > div, .genre-card'
    );

    targets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(32px)';
      el.style.transition = 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Stagger siblings
          const parent = el.parentElement;
          const siblings = parent ? Array.from(parent.children).filter(c => targets.length && c.style.opacity === '0') : [];
          const idx = siblings.indexOf(el);
          const delay = Math.max(0, idx) * 80;

          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  }

  // =========================================
  // 2. SPATIAL DEPTH / PARALLAX (Cursor)
  // =========================================
  function initSpatialDepth() {
    if (quietMode || prefersReduced) return;

    const heroVisual = document.querySelector('.hero-visual-content, .hero-vinyl-wrap');
    const heritagePhotos = document.querySelector('.heritage-photos');

    function handleMouseMove(e, container, children, intensity) {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      children.forEach((child, i) => {
        const depth = (i + 1) * intensity;
        child.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
        child.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    }

    // Hero vinyl parallax
    if (heroVisual) {
      const heroSection = heroVisual.closest('.hero-visual') || heroVisual.closest('.hero');
      if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
          const vinyl = heroVisual.querySelector('.hero-vinyl');
          const label = heroVisual.querySelector('.hero-vinyl-label');
          if (vinyl && label) {
            handleMouseMove(e, heroSection, [vinyl, label], 12);
          }
        });
      }
    }

    // Heritage photos parallax
    if (heritagePhotos) {
      const heritage = heritagePhotos.closest('.heritage');
      if (heritage) {
        heritage.addEventListener('mousemove', (e) => {
          const photos = heritagePhotos.querySelectorAll('img');
          handleMouseMove(e, heritage, Array.from(photos), 8);
        });
      }
    }
  }

  // =========================================
  // 3. MAGNETIC BUTTON EFFECT
  // =========================================
  function initMagneticButtons() {
    if (quietMode || prefersReduced) return;

    const buttons = document.querySelectorAll('.btn-primary, .btn-gold, .btn-dig, .nav-cta, .form-btn');

    buttons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        btn.style.transition = 'transform 0.2s ease-out';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  // =========================================
  // 4. CONTEXT-AWARE HERO (Time of Day)
  // =========================================
  function initContextHero() {
    const eyebrow = document.querySelector('.hero-eyebrow');
    if (!eyebrow || !eyebrow.textContent.includes('Featured Drop')) return;

    const hour = new Date().getHours();
    let greeting, icon;

    if (hour >= 5 && hour < 12) {
      greeting = 'Good Morning. Fresh Wax Awaits.';
      icon = 'wb_sunny';
    } else if (hour >= 12 && hour < 17) {
      greeting = 'Afternoon Session. New Arrivals Just Landed.';
      icon = 'album';
    } else if (hour >= 17 && hour < 21) {
      greeting = 'Evening Listening. Tonight\'s Selections Are In.';
      icon = 'nightlight_round';
    } else {
      greeting = 'Late Night Digging. The Rare Bins Are Open.';
      icon = 'dark_mode';
    }

    // Replace the eyebrow dot content
    const dot = eyebrow.querySelector('.hero-eyebrow-dot');
    if (dot) {
      eyebrow.innerHTML = '';
      eyebrow.appendChild(dot);
      eyebrow.appendChild(document.createTextNode(' ' + greeting));
    }
  }

  // =========================================
  // 5. SMOOTH PAGE ENTRANCE
  // =========================================
  function initPageEntrance() {
    if (quietMode || prefersReduced) return;
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.style.opacity = '1';
      });
    });
  }

  // =========================================
  // 6. NAVBAR SCROLL EFFECT
  // =========================================
  function initNavScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const scroll = window.scrollY;
      if (scroll > 100) {
        nav.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
      } else {
        nav.style.boxShadow = 'none';
      }
      lastScroll = scroll;
    }, { passive: true });
  }

  // =========================================
  // 7. PRODUCT CARD TILT ON HOVER
  // =========================================
  function initCardTilt() {
    if (quietMode || prefersReduced) return;

    const cards = document.querySelectorAll('.product-card, .merch-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 6;
        const rotateY = (x - 0.5) * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        card.style.transition = 'transform 0.15s ease-out';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    });
  }

  // =========================================
  // 8. QUIET MODE TOGGLE
  // =========================================
  function initQuietMode() {
    // Find footer and inject toggle
    const footerBottom = document.querySelector('.footer-bottom');
    if (!footerBottom) return;

    const toggle = document.createElement('button');
    toggle.textContent = 'Quiet Mode';
    toggle.setAttribute('aria-label', 'Toggle reduced motion and simplified UI');
    toggle.style.cssText = 'background:none;border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.35);padding:4px 12px;font-family:"Space Mono",monospace;font-size:0.6rem;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all 0.3s;';

    toggle.addEventListener('click', () => {
      quietMode = !quietMode;
      document.body.classList.toggle('quiet-mode', quietMode);
      toggle.style.borderColor = quietMode ? 'var(--gold)' : 'rgba(255,255,255,0.15)';
      toggle.style.color = quietMode ? 'var(--gold)' : 'rgba(255,255,255,0.35)';
      toggle.textContent = quietMode ? 'Quiet Mode: ON' : 'Quiet Mode';

      if (quietMode) {
        // Kill all transforms
        document.querySelectorAll('.product-card, .merch-card, .genre-card').forEach(el => {
          el.style.transform = 'none';
          el.style.transition = 'none';
        });
      }
    });

    footerBottom.appendChild(toggle);
  }

  // =========================================
  // 9. COUNTER ANIMATION
  // =========================================
  function initCounters() {
    if (quietMode || prefersReduced) return;

    const counters = document.querySelectorAll('.hero-meta-value, .shop-stat-val');
    counters.forEach(el => {
      const text = el.textContent.trim();
      const match = text.match(/^([\d,]+)/);
      if (!match) return;

      const target = parseInt(match[1].replace(/,/g, ''), 10);
      if (isNaN(target) || target > 100000) return;

      const suffix = text.replace(match[1], '');
      let counted = false;

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !counted) {
          counted = true;
          let start = 0;
          const duration = 1200;
          const startTime = performance.now();

          function step(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);
            el.textContent = current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          observer.unobserve(el);
        }
      }, { threshold: 0.5 });

      observer.observe(el);
    });
  }

  // =========================================
  // 10. MOBILE NAVIGATION DRAWER
  // =========================================
  function initMobileNav() {
    const hamburger = document.querySelector('.nav-hamburger');
    const drawer = document.querySelector('.nav-drawer');
    if (!hamburger || !drawer) return;

    const closeBtn = drawer.querySelector('.nav-drawer-close');
    const backdrop = drawer;

    hamburger.addEventListener('click', () => {
      drawer.classList.add('open');
      // Force reflow for transition
      drawer.offsetHeight;
      document.body.style.overflow = 'hidden';
    });

    function closeDrawer() {
      drawer.querySelector('.nav-drawer-panel').style.transform = 'translateX(100%)';
      setTimeout(() => {
        drawer.classList.remove('open');
        drawer.querySelector('.nav-drawer-panel').style.transform = '';
        document.body.style.overflow = '';
      }, 350);
    }

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeDrawer();
    });
  }

  // =========================================
  // 11. BACK TO TOP BUTTON
  // =========================================
  function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '<span class="material-icons">keyboard_arrow_up</span>';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =========================================
  // 12. ACTIVE NAV STATE HIGHLIGHTING
  // =========================================
  function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .nav-drawer-panel a');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath) {
        link.classList.add('active');
      }
    });

    // Handle generic active state for product.html (make shop active)
    if (currentPath === 'product.html') {
      const shopLink = document.querySelector('.nav-links a[href="shop.html"]');
      if (shopLink) shopLink.classList.add('active');
    }
  }

  // =========================================
  // INIT
  // =========================================
  document.addEventListener('DOMContentLoaded', () => {
    initPageEntrance();
    initScrollReveals();
    initSpatialDepth();
    initMagneticButtons();
    initContextHero();
    initNavScroll();
    initCardTilt();
    initQuietMode();
    initCounters();
    initMobileNav();
    initBackToTop();
    initActiveNav();
  });

})();
