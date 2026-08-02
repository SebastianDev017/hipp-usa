/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./zrc/scripts/components/product-card.js":
/*!************************************************!*\
  !*** ./zrc/scripts/components/product-card.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _texts_height__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./texts-height */ \"./zrc/scripts/components/texts-height.js\");\n/* provided dependency */ var $ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (() => {\n  var $cards = $('.product-card');\n  var $addToCartButton = $('.js-add-to-cart-button');\n  var $cartCounter = $('#cart-counter');\n\n  var calculateHeights = () => {\n    var _document$querySelect, _document$querySelect2, _document$querySelect3, _document$querySelect4, _document$querySelect5;\n\n    var $types = (_document$querySelect = document.querySelector('.collection-grid')) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.querySelectorAll('.product-card-type');\n    var $badges = (_document$querySelect2 = document.querySelector('.collection-grid')) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.querySelectorAll('.product-card-badge-wrapper');\n    var $titles = (_document$querySelect3 = document.querySelector('.collection-grid')) === null || _document$querySelect3 === void 0 ? void 0 : _document$querySelect3.querySelectorAll('.product-card-title');\n    var $reviews = (_document$querySelect4 = document.querySelector('.collection-grid')) === null || _document$querySelect4 === void 0 ? void 0 : _document$querySelect4.querySelectorAll('.product-card-reviews');\n    var $prices = (_document$querySelect5 = document.querySelector('.collection-grid')) === null || _document$querySelect5 === void 0 ? void 0 : _document$querySelect5.querySelectorAll('.product-card-price');\n    var options = {\n      cssVariable: '--height',\n      gridOptions: {\n        defaultColumns: 3,\n        responsive: {\n          680: 2\n        }\n      }\n    };\n\n    if ($titles === undefined) {\n      return;\n    }\n\n    (0,_texts_height__WEBPACK_IMPORTED_MODULE_0__.default)($types, options);\n    (0,_texts_height__WEBPACK_IMPORTED_MODULE_0__.default)($titles, options);\n    (0,_texts_height__WEBPACK_IMPORTED_MODULE_0__.default)($badges, options);\n    (0,_texts_height__WEBPACK_IMPORTED_MODULE_0__.default)($reviews, options);\n    (0,_texts_height__WEBPACK_IMPORTED_MODULE_0__.default)($prices, options);\n  }; // eslint-disable-next-line shopify/prefer-early-return\n\n\n  function getImageMaxHeight() {\n    if ($cards.length) {\n      var $card = $('.js-product-cards-grid').find('.product-card').first();\n      var height = $card.find('.product-card-image-container-wrapper').height();\n      $('.js-product-cards-grid')[0].style.setProperty('--image-max-height', \"\".concat(height, \"px\"));\n    }\n  }\n\n  function initAddToCartButtons() {\n    if (!$addToCartButton.length) {\n      return;\n    } // Obtener los datos del producto a agregar\n\n\n    function getProductData($button) {\n      var {\n        variantId\n      } = $button.dataset;\n      var data = {\n        items: [{\n          id: variantId,\n          quantity: 1\n        }]\n      };\n      return data;\n    } // Actualizar contador de items en carrito\n\n\n    function updateCartCount() {\n      $cartCounter.text(window.Rebuy.Cart.cart.item_count);\n    }\n\n    $addToCartButton.on('click', event => {\n      var $button = event.target;\n      var productData = getProductData($button);\n      window.Rebuy.Cart.addItem(productData, {\n        success() {\n          window.Rebuy.SmartCart.show();\n          window.setTimeout(updateCartCount, 500);\n        },\n\n        error() {\n          window.Rebuy.SmartCart.show();\n        }\n\n      });\n    });\n  }\n\n  getImageMaxHeight();\n  calculateHeights();\n  initAddToCartButtons();\n  window.addEventListener('resize', () => {\n    getImageMaxHeight();\n  });\n});\n\n//# sourceURL=webpack://getmore-workflow/./zrc/scripts/components/product-card.js?");

/***/ }),

/***/ "./zrc/scripts/templates/collection/main/collection.js":
/*!*************************************************************!*\
  !*** ./zrc/scripts/templates/collection/main/collection.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shopify/theme-sections */ \"./node_modules/@shopify/theme-sections/theme-sections.js\");\n/* harmony import */ var _components_product_card__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../components/product-card */ \"./zrc/scripts/components/product-card.js\");\n/* provided dependency */ var $ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* eslint-disable eslint-comments/no-unlimited-disable */\n\n/* eslint-disable */\n\n\n(0,_shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__.register)('main-collection', {\n  onLoad() {\n    this.filterDataCache = [];\n    this.initCustomSortingSelect();\n    (0,_components_product_card__WEBPACK_IMPORTED_MODULE_1__.default)();\n    this.automaticScroll();\n    window.addEventListener('resize', () => {\n      if (!this.isMobile()) {\n        this._closeCustomSortingSelect();\n      }\n    });\n  },\n\n  automaticScroll() {\n    var urlHasPageParameter = window.location.search.includes('page');\n\n    if (!urlHasPageParameter) {\n      this.showContent();\n      return;\n    }\n\n    if ('scrollRestoration' in window.history) {\n      window.history.scrollRestoration = 'manual';\n    }\n\n    var coverHeight = $('.collection-cover').height();\n    var scrollOffset = coverHeight;\n    window.scrollTo(0, scrollOffset);\n    this.showContent();\n  },\n\n  showContent() {\n    $('.collection-section').removeClass('content-hidden');\n  },\n\n  initCustomSortingSelect() {\n    // obtenemos todos los custom selects\n    var $customSelect = this.container.querySelector('.collection-custom-sort');\n    var $button = this.container.querySelector('.collection-custom-sort-button'); // si no hay ninguno no hacemos nada\n\n    if ($customSelect == null || $button == null) {\n      return;\n    } // funcion a invocar al darle click a el select\n\n\n    $button.addEventListener('click', () => {\n      $customSelect.classList.toggle('active');\n      $button.classList.toggle('active');\n    });\n    document.addEventListener('click', event => {\n      var target = event.target;\n\n      if ($customSelect.contains(target)) {\n        return;\n      }\n\n      $customSelect.classList.remove('active');\n      $button.classList.remove('active');\n    }); // obtenemos todas las opciones y las recorremos\n\n    var optionsArray = $customSelect.querySelectorAll('.collection-custom-sort-option'); // Lo que se hara al darle click a una opción\n\n    var handleOptionClick = event => {\n      var $clickedOption = event.currentTarget;\n      var valueSelected = $clickedOption.dataset.value; // const valueNameSelected = $clickedOption.dataset.name;\n\n      var searchParams = \"sort_by=\".concat(valueSelected);\n      optionsArray.forEach($opt => $opt.classList.remove('selected'));\n      $clickedOption.classList.add('selected'); // code from facets.js on theme Down\n\n      var url = \"\".concat(window.location.pathname, \"?section_id=\").concat(this.id, \"&\").concat(searchParams);\n\n      var filteredDataCacheByUrl = element => element.url === url;\n\n      var searchInCache = this.filterDataCache.some(filteredDataCacheByUrl);\n\n      if (searchInCache) {\n        this._renderSectionFromCache(filteredDataCacheByUrl);\n      } else {\n        this._renderSectionFromFetch(url);\n      }\n\n      this._updateURLHash(searchParams); // end of code from facets.js on theme Down\n\n\n      $customSelect.classList.remove('active');\n      $button.classList.remove('active');\n      $customSelect.dispatchEvent(new window.Event('change', {\n        bubbles: true\n      }));\n    };\n\n    optionsArray.forEach($option => {\n      $option.addEventListener('click', handleOptionClick);\n    });\n    var $gridContainer = document.getElementById('ProductGridContainer');\n\n    if ($gridContainer == null) {\n      return;\n    }\n\n    $gridContainer.addEventListener('grid::update', () => {\n      (0,_components_product_card__WEBPACK_IMPORTED_MODULE_1__.default)();\n    });\n  },\n\n  _renderSectionFromCache(filteredDataCacheByUrl) {\n    var html = this.filterDataCache.find(filteredDataCacheByUrl).html;\n\n    this._renderProductGridContainer(html);\n  },\n\n  _renderSectionFromFetch(url) {\n    window.fetch(url).then(response => response.text()).then(responseText => {\n      var html = responseText;\n      this.filterDataCache = [...this.filterDataCache, {\n        html,\n        url\n      }];\n\n      this._renderProductGridContainer(html);\n    }).catch(error => {\n      window.console.log(error);\n    });\n  },\n\n  _renderProductGridContainer(html) {\n    var $gridContainer = document.getElementById('ProductGridContainer');\n    var newGridSorted = new window.DOMParser().parseFromString(html, 'text/html').getElementById('ProductGridContainer');\n    $gridContainer.innerHTML = newGridSorted.innerHTML;\n    $gridContainer.dispatchEvent(new window.Event('grid::update', {\n      bubbles: true\n    }));\n  },\n\n  _updateURLHash(searchParams) {\n    window.history.pushState({\n      searchParams\n    }, '', \"\".concat(window.location.pathname).concat(searchParams && '?'.concat(searchParams)));\n  },\n\n  _closeCustomSortingSelect() {\n    // obtenemos todos los custom selects\n    var $customSelect = this.container.querySelector('.collection-custom-sort');\n    var $button = this.container.querySelector('.collection-custom-sort-button'); // si no hay ninguno no hacemos nada\n\n    if ($customSelect == null || $button == null) {\n      return;\n    }\n\n    $customSelect.classList.remove('active');\n    $button.classList.remove('active');\n  },\n\n  isMobile() {\n    var check = false;\n\n    (a => {\n      if (/(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-/i.test(a.substr(0, 4))) {\n        check = true;\n      }\n\n      ;\n    })(navigator.userAgent || navigator.vendor || window.opera);\n\n    return check;\n  }\n\n});\n\n//# sourceURL=webpack://getmore-workflow/./zrc/scripts/templates/collection/main/collection.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	// It's empty as some runtime module handles the default behavior
/******/ 	__webpack_require__.x = x => {};
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main-collection": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./zrc/scripts/templates/collection/main/collection.js","commons"]
/******/ 		];
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		var checkDeferredModules = x => {};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkgetmore_workflow"] = self["webpackChunkgetmore_workflow"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 		
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = x => {};
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		var startup = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = startup || (x => {});
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// run startup
/******/ 	__webpack_require__.x();
/******/ })()
;