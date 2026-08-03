/* ==========================================================================
   HiPP USA — comportamiento de la capa nueva
   --------------------------------------------------------------------------
   Vanilla, sin jQuery y sin depender de js-commons.js (813 KB de webpack en
   modo desarrollo que no se puede recompilar). Se carga con `defer`.

   Cubre: barra de progreso, parallax del hero, CTA fijo, reveals al scroll,
   panel de navegacion movil, rotacion del announcement y altura real del
   header para el scroll-padding de los anchors.

   Todo es defensivo a proposito: cada pieza se auto-desactiva si su markup no
   esta en la pagina, porque las secciones son opcionales en el editor.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Altura real del header
     css-base.css usa var(--header-height) en html{scroll-padding-top:calc(...)}
     pero nunca la declara. hipp-usa.css le pone un fallback estatico; aca se
     corrige al valor medido para que los anchors (#faq, #products) no queden
     tapados por el header sticky.
     --------------------------------------------------------------------- */
  function measureHeader() {
    var header = document.querySelector('[data-hp-header]');
    var announce = document.querySelector('[data-hp-announce]');
    var root = document.documentElement;

    if (header) {
      root.style.setProperty('--header-height', Math.round(header.offsetHeight) + 'px');
    }
    // El announcement no es sticky: no debe sumar al offset del anchor. Se
    // publica igual porque css-base.css la usa en la misma calc.
    root.style.setProperty('--announcement-bar-height', announce ? '0px' : '0px');
  }

  /* ---------------------------------------------------------------------
     Reveals
     --------------------------------------------------------------------- */
  function initReveals() {
    var groups = document.querySelectorAll('[data-hp-stagger]');
    groups.forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.classList.add('hp-reveal');
        child.style.transitionDelay = i * 110 + 'ms';
      });
    });

    var targets = document.querySelectorAll('.hp-reveal');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion) {
      targets.forEach(function (el) {
        el.classList.add('is-in');
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------------------------------------------------------------------
     Scroll: progreso, parallax del hero, CTA fijo
     --------------------------------------------------------------------- */
  var scroll = { progress: null, sticky: null, hero: null, layers: [], bound: false, ticking: false };

  // Se re-resuelve en cada init(): en el editor de temas una seccion puede
  // reinyectarse y dejar las referencias viejas apuntando a nodos huerfanos.
  function refreshScrollRefs() {
    scroll.progress = document.querySelector('[data-hp-progress]');
    scroll.sticky = document.querySelector('[data-hp-sticky]');
    scroll.hero = document.querySelector('[data-hp-hero]');
    scroll.layers = scroll.hero
      ? [
          [scroll.hero.querySelector('[data-hp-back]'), 0.05],
          [scroll.hero.querySelector('[data-hp-mid]'), 0.11],
          [scroll.hero.querySelector('[data-hp-front]'), 0.18],
          [scroll.hero.querySelector('[data-hp-sun]'), 0.28]
        ].filter(function (pair) {
          return pair[0];
        })
      : [];
  }

  function onScroll() {
    scroll.ticking = false;
    var y = window.scrollY || window.pageYOffset;

    if (scroll.progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }

    if (scroll.sticky) {
      // Punto a partir del cual aparece el CTA fijo. Sin hero (paginas
      // internas) se muestra apenas arranca el scroll.
      var threshold = scroll.hero ? scroll.hero.offsetTop + scroll.hero.offsetHeight - 100 : 240;
      scroll.sticky.classList.toggle('is-shown', y > threshold);
    }

    if (!reduceMotion && scroll.hero && scroll.layers.length && y < scroll.hero.offsetHeight + 200) {
      scroll.layers.forEach(function (pair) {
        pair[0].setAttribute('transform', 'translate(0,' + y * pair[1] + ')');
      });
    }
  }

  function initScroll() {
    refreshScrollRefs();

    if (!scroll.bound) {
      scroll.bound = true;
      window.addEventListener(
        'scroll',
        function () {
          if (scroll.ticking) return;
          scroll.ticking = true;
          requestAnimationFrame(onScroll);
        },
        { passive: true }
      );
    }

    onScroll();
  }

  /* ---------------------------------------------------------------------
     Navegacion movil
     --------------------------------------------------------------------- */
  function initMobileNav() {
    var panel = document.querySelector('[data-hp-mobilenav]');
    var opener = document.querySelector('[data-hp-mobilenav-open]');
    if (!panel || !opener || panel.dataset.hpBound) return;
    panel.dataset.hpBound = '1';

    var lastFocused = null;

    function focusables() {
      return Array.prototype.filter.call(
        panel.querySelectorAll('a[href], button:not([disabled])'),
        function (el) {
          return el.offsetParent !== null;
        }
      );
    }

    function open() {
      lastFocused = document.activeElement;
      panel.classList.add('is-open');
      panel.removeAttribute('aria-hidden');
      opener.setAttribute('aria-expanded', 'true');
      document.documentElement.classList.add('hp-scroll-lock');
      var first = focusables()[0];
      if (first) first.focus();
    }

    function close() {
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      opener.setAttribute('aria-expanded', 'false');
      document.documentElement.classList.remove('hp-scroll-lock');
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    opener.addEventListener('click', open);

    panel.addEventListener('click', function (event) {
      if (event.target.closest('[data-hp-mobilenav-close]')) {
        event.preventDefault();
        close();
        return;
      }
      // Un link ancla no cambia de pagina: hay que cerrar a mano.
      if (event.target.closest('a[href]')) close();
    });

    document.addEventListener('keydown', function (event) {
      if (!panel.classList.contains('is-open')) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }

      if (event.key !== 'Tab') return;

      // Trampa de foco calculada en vivo, no con referencias capturadas: el
      // panel puede cambiar de contenido entre aperturas.
      var list = focusables();
      if (!list.length) return;
      var first = list[0];
      var last = list[list.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------------------------------------------------------------------
     Rotacion del announcement
     --------------------------------------------------------------------- */
  function initAnnounce() {
    var slides = document.querySelector('[data-hp-announce-slides]');
    if (!slides || reduceMotion || slides.dataset.hpBound) return;

    var items = slides.querySelectorAll('.hp-announce__text');
    if (items.length < 2) return;
    slides.dataset.hpBound = '1';

    var speed = parseInt(slides.getAttribute('data-speed'), 10);
    if (!speed || speed < 2000) speed = 6000;

    var index = 0;
    setInterval(function () {
      items[index].classList.remove('is-active');
      index = (index + 1) % items.length;
      items[index].classList.add('is-active');
    }, speed);
  }

  /* ---------------------------------------------------------------------
     Arranque
     --------------------------------------------------------------------- */
  // shopify:section:load reinyecta HTML sin recargar, asi que init() corre
  // varias veces. Cada pieza se protege sola contra el doble binding
  // (scroll.bound / dataset.hpBound) pero re-resuelve sus referencias.
  function init() {
    measureHeader();
    initReveals();
    initScroll();
    initMobileNav();
    initAnnounce();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measureHeader, 150);
  });

  // El editor de temas reinyecta el HTML de una seccion sin recargar la pagina.
  document.addEventListener('shopify:section:load', init);
  document.addEventListener('shopify:section:unload', measureHeader);
})();
