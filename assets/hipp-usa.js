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
  // Red de seguridad de los reveals. Un elemento .hp-reveal arranca en
  // opacity:0, asi que si el IntersectionObserver se pierde un callback ese
  // contenido queda INVISIBLE para siempre. Pasa de verdad: con scroll
  // programatico rapido el navegador agrupa o descarta entregas y quedan ~8 de
  // 48 sin revelar, distintos en cada corrida.
  //
  // El umbral (60% del alto del viewport) es a proposito MAS TARDIO que el del
  // observer (threshold 0.12 + rootMargin -8%, que dispara cuando el elemento
  // recien asoma por abajo). Asi en operacion normal siempre gana el observer y
  // el escalonado se conserva; esto solo entra cuando el observer ya deberia
  // haber disparado y no lo hizo.
  var pendingReveals = [];

  function sweepReveals() {
    if (!pendingReveals.length) return;
    var limit = window.innerHeight * 0.6;
    var rest = [];
    for (var i = 0; i < pendingReveals.length; i++) {
      var el = pendingReveals[i];
      if (!el.isConnected || el.classList.contains('is-in')) continue;
      if (el.getBoundingClientRect().top < limit) el.classList.add('is-in');
      else rest.push(el);
    }
    pendingReveals = rest;
  }

  function initReveals() {
    // El escalonado NO va como transition-delay inline. Un transition-delay
    // inline le gana al stylesheet, se aplica a TODAS las transiciones del
    // elemento (no solo a las del reveal) y no se limpia nunca: la tercera
    // tarjeta de una grilla quedaba con 220 ms de retardo tambien en el hover,
    // para siempre. Se guarda el retardo como dato y se escalona el momento en
    // que se agrega la clase.
    var groups = document.querySelectorAll('[data-hp-stagger]');
    groups.forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.classList.add('hp-reveal');
        child.dataset.hpDelay = i * 110;
      });
    });

    var targets = document.querySelectorAll('.hp-reveal:not(.is-in)');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window) || reduceMotion) {
      targets.forEach(function (el) {
        el.classList.add('is-in');
      });
      pendingReveals = [];
      return;
    }

    pendingReveals = Array.prototype.slice.call(targets);

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          io.unobserve(el);
          var delay = parseInt(el.dataset.hpDelay || 0, 10);
          if (delay > 0) {
            setTimeout(function () { el.classList.add('is-in'); }, delay);
          } else {
            el.classList.add('is-in');
          }
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

    // Si en el editor se borra u oculta el hero, no llega ningun
    // shopify:section:load posterior y scroll.hero queda apuntando a un nodo
    // desconectado: offsetTop y offsetHeight dan 0 y el CTA fijo aparecia desde
    // el primer pixel de scroll. Se re-resuelve y cae al umbral sin hero.
    if (scroll.hero && !document.contains(scroll.hero)) refreshScrollRefs();

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

    // Va al final y se apaga sola: la lista se vacia a medida que los elementos
    // se revelan, y cuando queda en cero esta funcion es un return inmediato.
    sweepReveals();
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
    // Reconciliacion ANTES del early-return: si el editor reinyecta el header
    // con el panel abierto, el nodo viejo se va y con el su close(), asi que el
    // bloqueo de scroll quedaria colgado en <html> y la pagina no scrollearia
    // mas. El panel nuevo siempre llega cerrado.
    if (!document.querySelector('[data-hp-mobilenav].is-open')) {
      document.documentElement.classList.remove('hp-scroll-lock');
    }

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
  // El guard no puede ser un dataset sobre el nodo: shopify:section:load
  // devuelve markup fresco del servidor, sin el atributo, asi que cada
  // reinyeccion arrancaba un timer nuevo encima del anterior y los mensajes
  // empezaban a saltar cada vez mas rapido. El id vive en el modulo.
  var announceTimer = null;

  function initAnnounce() {
    if (announceTimer) {
      clearInterval(announceTimer);
      announceTimer = null;
    }

    var slides = document.querySelector('[data-hp-announce-slides]');
    if (!slides || reduceMotion) return;

    var items = slides.querySelectorAll('.hp-announce__text');
    if (items.length < 2) return;

    var speed = parseInt(slides.getAttribute('data-speed'), 10);
    if (!speed || speed < 2000) speed = 6000;

    var index = 0;
    announceTimer = setInterval(function () {
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
