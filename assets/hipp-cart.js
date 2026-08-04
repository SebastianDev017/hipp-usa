/* ==========================================================================
   HiPP USA — controlador del cart drawer.

   Vanilla puro. NO depende de js-commons.js (813 KB de webpack en modo
   desarrollo con eval, jQuery 3.6 y Swiper adentro) ni de js-base.js.
   Lo unico que reusa del tema base es trapFocus/removeTrapFocus de theme.js,
   que es global.js de Dawn.

   Verificado sobre el tema base: no hay NI UN listener de submit ni una sola
   referencia a "cart/add" en assets/*.js, y <product-form> es un custom element
   que nadie define (inerte). O sea que este archivo es el unico handler de
   add-to-cart: no hay doble submit.

   Progressive enhancement: si este archivo no carga, el icono del header sigue
   siendo un <a href="/cart"> y los formularios de producto siguen haciendo POST
   nativo a /cart/add. Nada queda inutilizable.
   ========================================================================== */
(function () {
  'use strict';

  var SECTION_ID = 'cart-drawer';
  var DRAWER_SEL = '[data-hipp-cart-drawer]';
  var PAGE_SEL = '[data-hipp-cart-page]';
  var OPEN_CLASS = 'is-open';
  var BODY_CLASS = 'hipp-drawer-open';
  var EMPTY_CLASS = 'is-empty';

  var routes = (window.routes && window.routes.cart_add_url) ? window.routes : {
    cart_add_url: '/cart/add',
    cart_change_url: '/cart/change',
    cart_update_url: '/cart/update'
  };

  var strings = window.cartStrings || {};
  var lastFocused = null;
  var scrollY = 0;

  // Las mutaciones se SERIALIZAN en una cola. Antes se compartia un unico
  // AbortController y cada request abortaba al anterior: el abort del cliente
  // no cancela el trabajo del servidor, asi que dos cambios rapidos en lineas
  // distintas podian dejar la UI mostrando un carrito que ya no existia.
  var queue = Promise.resolve();

  function enqueue(task) {
    queue = queue.then(task, task);
    return queue;
  }

  function drawer() {
    return document.querySelector(DRAWER_SEL);
  }

  /* ---- pagina /cart ------------------------------------------------------
     La plantilla del carrito renderiza sections/main-cart-usa.liquid, que usa
     LOS MISMOS data-attributes que el drawer. Sin esto, tocar el stepper en
     /cart mutaba el carrito de verdad pero solo repintaba el drawer (que esta
     cerrado): la pagina se quedaba mostrando el estado viejo.

     El id no se puede hardcodear: en una plantilla JSON el id de la seccion es
     la CLAVE del objeto, y el editor de temas puede cambiarla. Se lee del DOM.
  ------------------------------------------------------------------------- */

  function page() {
    return document.querySelector(PAGE_SEL);
  }

  function pageId() {
    var host = page();
    return host ? host.getAttribute('data-section-id') : null;
  }

  function sectionsParam() {
    var id = pageId();
    return id ? SECTION_ID + ',' + id : SECTION_ID;
  }

  function sectionsUrl() {
    return window.location.pathname + window.location.search;
  }

  function readResponse(response) {
    return response.json().then(function (data) {
      if (!response.ok) {
        var err = new Error(data.description || data.message || 'Cart error');
        err.data = data;
        throw err;
      }
      return data;
    });
  }

  function errorMessage(error) {
    if (error && error.data && error.data.description) return error.data.description;
    if (strings.error) return strings.error;
    return (error && error.message) || 'Cart error';
  }

  /* ---- foco --------------------------------------------------------------
     trapFocus() de theme.js captura las referencias a los elementos primero y
     ultimo EN EL MOMENTO de la llamada. Como el re-render reemplaza el innerHTML
     del drawer, esas referencias quedan apuntando a nodos desconectados y el Tab
     se escapa. Por eso hay que volver a armar el trap despues de cada render, y
     devolver el foco al control equivalente en vez de saltar siempre al cierre.
  ------------------------------------------------------------------------- */

  function focusToken(host) {
    var active = document.activeElement;
    if (!host || !active || !host.contains(active)) return null;

    var row = active.closest('[data-key]');
    var role = active.hasAttribute('data-hipp-qty-up') ? 'up'
      : active.hasAttribute('data-hipp-qty-down') ? 'down'
      : active.hasAttribute('data-hipp-qty-input') ? 'input'
      : active.hasAttribute('data-hipp-remove') ? 'remove'
      : active.hasAttribute('data-hipp-cart-close') ? 'close'
      : null;

    if (!role) return null;
    return { key: row ? row.dataset.key : null, role: role };
  }

  function findTarget(host, token) {
    if (!token) return null;
    if (token.role === 'close') return host.querySelector('[data-hipp-cart-close]');
    if (!token.key) return null;

    var row = host.querySelector('[data-key="' + CSS.escape(token.key) + '"]');
    if (!row) return null;

    return row.querySelector(
      token.role === 'up' ? '[data-hipp-qty-up]'
        : token.role === 'down' ? '[data-hipp-qty-down]'
          : token.role === 'input' ? '[data-hipp-qty-input]'
            : '[data-hipp-remove]'
    );
  }

  function restoreFocus(token) {
    var host = drawer();
    if (!host) return;

    // Si la linea desaparecio (cantidad 0) caemos al boton de cerrar.
    var target = findTarget(host, token) || host.querySelector('[data-hipp-cart-close]');

    var panel = host.querySelector('.hipp-drawer__panel');
    if (panel && typeof window.trapFocus === 'function') {
      window.trapFocus(panel, target || panel);
    } else if (target) {
      target.focus();
    }
  }

  /* ---- render ------------------------------------------------------------ */

  function applySections(data) {
    if (!data || !data.sections) return false;

    var applied = applyDrawer(data);
    applyPage(data);
    return applied;
  }

  function applyDrawer(data) {
    if (!data.sections[SECTION_ID]) return false;

    var host = drawer();
    if (!host) return false;

    var parsed = new DOMParser().parseFromString(data.sections[SECTION_ID], 'text/html');
    var fresh = parsed.querySelector(DRAWER_SEL);
    if (!fresh) return false;

    var wasOpen = host.classList.contains(OPEN_CLASS);
    var token = wasOpen ? focusToken(host) : null;

    host.innerHTML = fresh.innerHTML;
    var count = parseInt(fresh.getAttribute('data-item-count') || '0', 10);
    host.setAttribute('data-item-count', count);
    updateBubbles(count);

    if (wasOpen) restoreFocus(token);
    return true;
  }

  function applyPage(data) {
    var id = pageId();
    if (!id || !data.sections[id]) return false;

    var host = page();
    if (!host) return false;

    var parsed = new DOMParser().parseFromString(data.sections[id], 'text/html');
    var fresh = parsed.querySelector(PAGE_SEL);
    if (!fresh) return false;

    var token = focusToken(host);

    // El servidor devuelve la nota GUARDADA. Si el usuario esta escribiendo y
    // todavia no la mando, el re-render se la borraria a mitad de frase.
    var note = host.querySelector('[data-hipp-cart-note]');
    var draft = note ? note.value : null;

    host.innerHTML = fresh.innerHTML;
    host.setAttribute('data-item-count', fresh.getAttribute('data-item-count') || '0');

    if (draft !== null) {
      var freshNote = host.querySelector('[data-hipp-cart-note]');
      if (freshNote) freshNote.value = draft;
    }

    // Sin trap de foco: esto es una pagina, no un dialogo. Si la linea que tenia
    // el foco desaparecio, se deja donde el navegador lo mande (body) en vez de
    // secuestrarlo a un control arbitrario.
    var target = findTarget(host, token);
    if (target) target.focus();

    return true;
  }

  // .cart-count-bubble trae display:flex desde css-base.css, y una declaracion
  // de display gana sobre el atributo hidden (que solo es display:none del UA
  // stylesheet). Por eso se togglea una clase, no el atributo.
  function updateBubbles(count) {
    document.querySelectorAll('.cart-count-counter').forEach(function (el) {
      el.textContent = count;
    });
    document.querySelectorAll('.cart-count-bubble').forEach(function (el) {
      el.classList.toggle(EMPTY_CLASS, count === 0);
    });
  }

  function announce(message) {
    document.querySelectorAll('[data-hipp-cart-status], [data-hipp-cart-page-status]')
      .forEach(function (el) { el.textContent = message || ''; });
  }

  function showError(message) {
    // En /cart el drawer esta cerrado: el error tiene que aparecer en la pagina,
    // no dentro de un panel que nadie ve.
    var host = page() && !isOpen()
      ? page().querySelector('.hp-wrap')
      : document.querySelector('[data-hipp-cart-body]');
    if (!host) return;

    var existing = host.querySelector('.hipp-drawer__error');
    if (existing) existing.remove();

    var box = document.createElement('p');
    box.className = 'hipp-drawer__error';
    box.setAttribute('role', 'alert');
    box.textContent = message;
    host.prepend(box);
    announce(message);
  }

  /* ---- abrir / cerrar ---------------------------------------------------- */

  function open() {
    var host = drawer();
    if (!host || host.classList.contains(OPEN_CLASS)) return;

    lastFocused = document.activeElement;

    // iOS Safari ignora overflow:hidden en body, asi que se fija la posicion.
    scrollY = window.scrollY;
    document.body.style.top = -scrollY + 'px';
    document.body.classList.add(BODY_CLASS);

    host.classList.add(OPEN_CLASS);
    host.setAttribute('aria-hidden', 'false');

    var panel = host.querySelector('.hipp-drawer__panel');
    var closeBtn = host.querySelector('[data-hipp-cart-close]');
    if (typeof window.trapFocus === 'function' && panel) {
      window.trapFocus(panel, closeBtn || panel);
    } else if (closeBtn) {
      closeBtn.focus();
    }
  }

  function close() {
    var host = drawer();
    if (!host || !host.classList.contains(OPEN_CLASS)) return;

    host.classList.remove(OPEN_CLASS);
    host.setAttribute('aria-hidden', 'true');

    document.body.classList.remove(BODY_CLASS);
    document.body.style.top = '';
    window.scrollTo(0, scrollY);

    if (typeof window.removeTrapFocus === 'function') {
      window.removeTrapFocus(lastFocused);
    } else if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
    lastFocused = null;
  }

  function isOpen() {
    var host = drawer();
    return !!host && host.classList.contains(OPEN_CLASS);
  }

  /* ---- operaciones de carrito -------------------------------------------- */

  function addFromForm(form) {
    var body = new FormData(form);
    body.append('sections', sectionsParam());
    body.append('sections_url', sectionsUrl());

    var submit = form.querySelector('[type="submit"]');
    if (submit) submit.setAttribute('aria-busy', 'true');

    return enqueue(function () {
      return fetch(routes.cart_add_url + '.js', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: body
      })
        .then(readResponse)
        .then(function (data) {
          applySections(data);
          open();
          announce('Item added to your bag');
          emit(data);
        })
        .catch(function (error) {
          // 422 tipico: no hay stock suficiente para la cantidad pedida.
          open();
          showError(errorMessage(error));
        })
        .finally(function () {
          if (submit) submit.removeAttribute('aria-busy');
        });
    });
  }

  // Se usa la KEY del line item, no el indice: si dos cambios se pisan, los
  // indices se corren al eliminarse una linea y terminarias modificando el
  // producto equivocado.
  function changeLine(key, quantity) {
    return enqueue(function () {
      return fetch(routes.cart_change_url + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          id: key,
          quantity: quantity,
          sections: sectionsParam(),
          sections_url: sectionsUrl()
        })
      })
        .then(readResponse)
        .then(function (data) {
          applySections(data);
          emit(data);
        })
        .catch(function (error) {
          showError(errorMessage(error));
        });
    });
  }

  function refresh() {
    return fetch('?sections=' + encodeURIComponent(sectionsParam()), { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (sections) { applySections({ sections: sections }); })
      .catch(function () { /* refresco best-effort: no romper la pagina */ });
  }

  function emit(cart) {
    document.dispatchEvent(new CustomEvent('cart:update', { detail: { cart: cart }, bubbles: true }));
  }

  /* ---- eventos ------------------------------------------------------------ */

  // Un timer por linea: con un unico timer global, editar a mano la cantidad de
  // dos lineas distintas en menos de 300ms perdia una de las dos.
  var timers = new Map();

  document.addEventListener('click', function (event) {
    var host = drawer();

    var opener = event.target.closest('#cart-icon-bubble, [data-hipp-cart-open]');
    if (opener && host) {
      // En /cart no se abre el drawer encima de la misma informacion: el icono
      // es un <a href="/cart">, asi que se lo deja navegar (o recargar) solo.
      if (page()) return;
      event.preventDefault();
      refresh().then(open);
      return;
    }

    if (event.target.closest('[data-hipp-cart-close], [data-hipp-cart-overlay]')) {
      event.preventDefault();
      close();
      return;
    }

    var remove = event.target.closest('[data-hipp-remove]');
    if (remove) {
      event.preventDefault();
      var lineEl = remove.closest('[data-key]');
      if (lineEl) changeLine(lineEl.dataset.key, 0);
      return;
    }

    var step = event.target.closest('[data-hipp-qty-up], [data-hipp-qty-down]');
    if (step) {
      event.preventDefault();
      var wrap = step.closest('[data-hipp-qty]');
      var input = wrap && wrap.querySelector('[data-hipp-qty-input]');
      var row = step.closest('[data-key]');
      if (!input || !row) return;

      var next = parseInt(input.value, 10) + (step.hasAttribute('data-hipp-qty-up') ? 1 : -1);
      if (isNaN(next) || next < 0) next = 0;
      input.value = next;
      changeLine(row.dataset.key, next);
    }
  });

  document.addEventListener('change', function (event) {
    var input = event.target.closest('[data-hipp-qty-input]');
    if (!input) return;
    var row = input.closest('[data-key]');
    if (!row) return;

    var key = row.dataset.key;
    var value = parseInt(input.value, 10);
    if (isNaN(value) || value < 0) value = 0;

    clearTimeout(timers.get(key));
    timers.set(key, setTimeout(function () {
      timers.delete(key);
      changeLine(key, value);
    }, 300));
  });

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    var action = form.getAttribute('action') || '';
    if (action.indexOf('/cart/add') === -1) return;

    event.preventDefault();
    addFromForm(form);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      event.preventDefault();
      close();
    }
  });

  // Estado inicial de la burbuja (server-side puede venir con 0).
  document.addEventListener('DOMContentLoaded', function () {
    var host = drawer();
    if (host) updateBubbles(parseInt(host.getAttribute('data-item-count') || '0', 10));
  });

  window.HippCart = {
    open: open,
    close: close,
    refresh: refresh,
    change: changeLine,
    addFromForm: addFromForm
  };
})();
