/* ==========================================================================
   HiPP USA — controlador del cart drawer.

   Vanilla puro. NO depende de js-commons.js (813 KB de webpack en modo
   desarrollo con eval, jQuery 3.6 y Swiper adentro) ni de js-base.js.
   Lo unico que reusa del tema base es trapFocus/removeTrapFocus de theme.js,
   que es global.js de Dawn.

   Progressive enhancement: si este archivo no carga, el icono del header sigue
   siendo un <a href="/cart"> y los formularios de producto siguen haciendo POST
   nativo a /cart/add. Nada queda inutilizable.
   ========================================================================== */
(function () {
  'use strict';

  var SECTION_ID = 'cart-drawer';
  var DRAWER_SEL = '[data-hipp-cart-drawer]';
  var OPEN_CLASS = 'is-open';
  var BODY_CLASS = 'hipp-drawer-open';

  var routes = (window.routes && window.routes.cart_add_url) ? window.routes : {
    cart_add_url: '/cart/add',
    cart_change_url: '/cart/change',
    cart_update_url: '/cart/update'
  };

  var strings = window.cartStrings || {};
  var lastFocused = null;
  var inFlight = null;

  function drawer() {
    return document.querySelector(DRAWER_SEL);
  }

  function sectionsUrl() {
    return window.location.pathname + window.location.search;
  }

  /* ---- helpers de red ------------------------------------------------- */

  function postJSON(url, payload) {
    if (inFlight) inFlight.abort();
    var controller = new AbortController();
    inFlight = controller;

    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    })
      .then(readResponse)
      .finally(function () {
        if (inFlight === controller) inFlight = null;
      });
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

  /* ---- render --------------------------------------------------------- */

  // /cart/add.js y /cart/change.js devuelven la seccion ya renderizada cuando se
  // les pasa `sections`. Reemplazamos solo el contenido interno para no perder la
  // clase is-open del contenedor ni el nodo al que esta atado el focus trap.
  function applySections(data) {
    if (!data || !data.sections || !data.sections[SECTION_ID]) return false;

    var host = drawer();
    if (!host) return false;

    var parsed = new DOMParser().parseFromString(data.sections[SECTION_ID], 'text/html');
    var fresh = parsed.querySelector(DRAWER_SEL);
    if (!fresh) return false;

    host.innerHTML = fresh.innerHTML;
    host.setAttribute('data-item-count', fresh.getAttribute('data-item-count') || '0');
    updateBubbles(parseInt(fresh.getAttribute('data-item-count') || '0', 10));
    return true;
  }

  function updateBubbles(count) {
    document.querySelectorAll('.cart-count-counter').forEach(function (el) {
      el.textContent = count;
    });
    document.querySelectorAll('.cart-count-bubble').forEach(function (el) {
      el.hidden = count === 0;
    });
  }

  function announce(message) {
    var status = document.querySelector('[data-hipp-cart-status]');
    if (status) status.textContent = message || '';
  }

  function showError(message) {
    var body = document.querySelector('[data-hipp-cart-body]');
    if (!body) {
      window.alert(message);
      return;
    }
    var existing = body.querySelector('.hipp-drawer__error');
    if (existing) existing.remove();

    var box = document.createElement('p');
    box.className = 'hipp-drawer__error';
    box.setAttribute('role', 'alert');
    box.textContent = message;
    body.prepend(box);
    announce(message);
  }

  /* ---- abrir / cerrar -------------------------------------------------- */

  function open() {
    var host = drawer();
    if (!host) return;

    lastFocused = document.activeElement;
    host.classList.add(OPEN_CLASS);
    host.setAttribute('aria-hidden', 'false');
    document.body.classList.add(BODY_CLASS);

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
    if (!host) return;

    host.classList.remove(OPEN_CLASS);
    host.setAttribute('aria-hidden', 'true');
    document.body.classList.remove(BODY_CLASS);

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

  /* ---- operaciones de carrito ------------------------------------------ */

  function addFromForm(form) {
    var body = new FormData(form);
    body.append('sections', SECTION_ID);
    body.append('sections_url', sectionsUrl());

    var submit = form.querySelector('[type="submit"]');
    if (submit) submit.setAttribute('aria-busy', 'true');

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
        return data;
      })
      .catch(function (error) {
        // 422 tipico: no hay stock suficiente para la cantidad pedida.
        showError(error.data && error.data.description ? error.data.description : (strings.error || error.message));
        open();
      })
      .finally(function () {
        if (submit) submit.removeAttribute('aria-busy');
      });
  }

  // Se usa la KEY del line item, no el indice: si dos cambios se pisan, los indices
  // se corren al eliminarse una linea y terminarias modificando el producto equivocado.
  function changeLine(key, quantity) {
    return postJSON(routes.cart_change_url + '.js', {
      id: key,
      quantity: quantity,
      sections: SECTION_ID,
      sections_url: sectionsUrl()
    })
      .then(function (data) {
        applySections(data);
        emit(data);
        return data;
      })
      .catch(function (error) {
        if (error.name === 'AbortError') return;
        showError(error.data && error.data.description ? error.data.description : (strings.error || error.message));
      });
  }

  function refresh() {
    return fetch('?sections=' + SECTION_ID, { headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (sections) {
        applySections({ sections: sections });
      })
      .catch(function () { /* refresco best-effort: no romper la pagina */ });
  }

  function emit(cart) {
    document.dispatchEvent(new CustomEvent('cart:update', { detail: { cart: cart }, bubbles: true }));
  }

  /* ---- eventos --------------------------------------------------------- */

  var debounceTimer = null;

  document.addEventListener('click', function (event) {
    var host = drawer();

    var opener = event.target.closest('#cart-icon-bubble, [data-hipp-cart-open]');
    if (opener && host) {
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
      if (next < 0) next = 0;
      input.value = next;
      changeLine(row.dataset.key, next);
    }
  });

  document.addEventListener('change', function (event) {
    var input = event.target.closest('[data-hipp-qty-input]');
    if (!input) return;
    var row = input.closest('[data-key]');
    if (!row) return;

    var value = parseInt(input.value, 10);
    if (isNaN(value) || value < 0) value = 0;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      changeLine(row.dataset.key, value);
    }, 300);
  });

  document.addEventListener('submit', function (event) {
    var form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    var action = form.getAttribute('action') || '';
    if (action.indexOf('/cart/add') === -1) return;
    // El boton de checkout y los botones de pago dinamico no se interceptan.
    if (form.querySelector('[name="checkout"]')) return;

    event.preventDefault();
    addFromForm(form);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isOpen()) {
      event.preventDefault();
      close();
    }
  });

  window.HippCart = {
    open: open,
    close: close,
    refresh: refresh,
    change: changeLine,
    addFromForm: addFromForm
  };
})();
