/* ==========================================================================
   HiPP USA — página de producto.
   --------------------------------------------------------------------------
   Solo REFRESCA lo que ya esta en pantalla: precio, imagen, disponibilidad y
   resumen. La eleccion de variante la resuelve el form nativo, porque los
   radios se llaman name="id" y su value es el id de la variante. Si este
   archivo no carga, la pagina sigue vendiendo.

   Reemplaza al custom element <variant-radios> que definia js-main-product.js
   (813 KB de webpack en modo desarrollo, sin codigo fuente).
   ========================================================================== */
(function () {
  'use strict';

  function init(root) {
    if (!root || root.dataset.hpBound) return;
    root.dataset.hpBound = '1';

    var dataEl = root.querySelector('[data-hp-variants]');
    var variants = [];
    try {
      variants = JSON.parse(dataEl.textContent);
    } catch (e) {
      return; // sin datos no hay nada que refrescar; el form nativo sigue vivo
    }

    var byId = {};
    variants.forEach(function (v) { byId[String(v.id)] = v; });

    var priceCurrent = root.querySelector('[data-hp-price-current]');
    var priceWas = root.querySelector('[data-hp-price-was]');
    var summaryVariant = root.querySelector('[data-hp-summary-variant]');
    var summaryTotal = root.querySelector('[data-hp-summary-total]');
    var atc = root.querySelector('[data-hp-atc]');
    var atcLabel = root.querySelector('[data-hp-atc-label]');
    var mainImage = root.querySelector('[data-hp-main-image]');

    // Los dos textos vienen del Liquid en data attributes, no del DOM
    // renderizado: si la variante inicial estuviera agotada, leer el label del
    // boton daria "Sold out" como texto de compra y ya no se recuperaria nunca.
    var labels = {
      add: root.getAttribute('data-label-add') || '',
      soldOut: root.getAttribute('data-label-soldout') || ''
    };

    function selectedId() {
      var checked = root.querySelector('input[name="id"]:checked');
      if (checked) return checked.value;
      var select = root.querySelector('select[name="id"]');
      if (select) return select.value;
      var hidden = root.querySelector('input[name="id"][type="hidden"]');
      return hidden ? hidden.value : null;
    }

    function update() {
      var id = selectedId();
      var v = id ? byId[String(id)] : null;
      if (!v) return;

      if (priceCurrent) priceCurrent.textContent = v.price;

      if (priceWas) {
        if (v.has_compare_at) {
          priceWas.textContent = v.compare_at_price;
          priceWas.hidden = false;
        } else {
          priceWas.textContent = '';
          priceWas.hidden = true;
        }
      }

      if (summaryVariant) summaryVariant.textContent = v.title;
      if (summaryTotal) summaryTotal.textContent = v.price;

      if (atc) {
        atc.disabled = !v.available;
        if (atcLabel) atcLabel.textContent = v.available ? labels.add : labels.soldOut;
      }

      // La URL refleja la variante elegida para que compartir el link conserve
      // la eleccion, sin recargar.
      if (v.available && window.history && window.history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', v.id);
        window.history.replaceState({}, '', url.toString());
      }

      if (mainImage && v.image) setImage(v.image, null);
    }

    function setImage(src, srcset) {
      if (!mainImage) return;
      // El srcset le gana al src: si no se limpia primero, el navegador vuelve
      // a elegir un candidato del srcset viejo y la imagen no cambia.
      mainImage.removeAttribute('srcset');
      mainImage.src = src;
      if (srcset) mainImage.srcset = srcset;
    }

    root.addEventListener('change', function (event) {
      var t = event.target;
      if (t.name === 'id' || (t.tagName === 'SELECT' && t.name === 'id')) update();
    });

    root.addEventListener('click', function (event) {
      var thumb = event.target.closest('[data-hp-thumb]');
      if (!thumb) return;
      event.preventDefault();
      setImage(thumb.getAttribute('data-full'), thumb.getAttribute('data-srcset'));
      root.querySelectorAll('[data-hp-thumb]').forEach(function (b) {
        var active = b === thumb;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    });

    update();
  }

  function boot() {
    document.querySelectorAll('[data-hp-product]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('shopify:section:load', boot);
})();
