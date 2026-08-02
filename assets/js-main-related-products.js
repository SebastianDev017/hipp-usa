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

/***/ "./zrc/scripts/templates/product/related-products/related-products.js":
/*!****************************************************************************!*\
  !*** ./zrc/scripts/templates/product/related-products/related-products.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shopify/theme-sections */ \"./node_modules/@shopify/theme-sections/theme-sections.js\");\n/* harmony import */ var _components_texts_height__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../components/texts-height */ \"./zrc/scripts/components/texts-height.js\");\n/* provided dependency */ var $ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n\n\nvar sectionType = 'related-products';\nvar sectionConfig = {\n  onLoad() {\n    this.init();\n  },\n\n  init() {\n    this.listenWidgetInitialization();\n  },\n\n  listenWidgetInitialization() {\n    document.addEventListener('rebuy.ready', event => {\n      var widget = event.detail.widget;\n\n      if (widget.id !== '72912') {\n        return;\n      }\n\n      var $rebuyProductCards = $('.rebuy-product-card');\n      var $rebuyProductsGrid = $('.rebuy-products-grid');\n\n      if (!$rebuyProductCards.length) {\n        return;\n      }\n\n      $rebuyProductCards.each((index, element) => {\n        var originalProductUrl = $(element).attr('data-product-url').split('?')[0];\n        var viewProductCardTemplate = '?view=card';\n        var productUrl = \"\".concat(originalProductUrl).concat(viewProductCardTemplate);\n        $.get(productUrl).done(response => {\n          var newProductCard = response;\n          $rebuyProductsGrid.append(newProductCard);\n        });\n      });\n      this.initProductCards();\n    });\n  },\n\n  initProductCards() {\n    var timer = window.setInterval(() => {\n      var $target = $(this.container).find('.product-card');\n\n      if ($target.length) {\n        window.clearInterval(timer);\n        this.listenWhenJudgeMeInit();\n        this.setProductCardHeights();\n      }\n    }, 500);\n  },\n\n  listenWhenJudgeMeInit() {\n    var timer = window.setInterval(() => {\n      var $target = $(this.container).find('.jdgm-prev-badge__text');\n\n      if ($target.length) {\n        window.clearInterval(timer);\n        this.adjustJudgeMeReviews();\n      }\n    }, 100);\n  },\n\n  adjustJudgeMeReviews() {\n    // Ajustar el texto de JudgeMe\n    var $judgeMeTexts = $(this.container).find('.jdgm-prev-badge__text');\n    $judgeMeTexts.each((index, element) => {\n      var $judgeMeText = $(element);\n      var reviewsNumber = $judgeMeText.text().match(/\\d+/g);\n      var newJudgeMeText = \"(\".concat(reviewsNumber, \")\");\n      $judgeMeText.text(newJudgeMeText);\n    });\n  },\n\n  setProductCardHeights() {\n    var $cards = $(this.container).find('.product-card');\n    var $addToCartButton = $(this.container).find('.js-add-to-cart-button');\n    var $cartCounter = $('#cart-counter');\n\n    var calculateHeights = () => {\n      var $types = this.container.querySelectorAll('.product-card-type');\n      var $badges = this.container.querySelectorAll('.product-card-badge-wrapper');\n      var $titles = this.container.querySelectorAll('.product-card-title');\n      var $reviews = this.container.querySelectorAll('.product-card-reviews');\n      var $prices = this.container.querySelectorAll('.product-card-price');\n      var options = {\n        cssVariable: '--height',\n        gridOptions: {\n          defaultColumns: 3,\n          responsive: {\n            523: 2\n          }\n        }\n      };\n      (0,_components_texts_height__WEBPACK_IMPORTED_MODULE_1__.default)($types, options);\n      (0,_components_texts_height__WEBPACK_IMPORTED_MODULE_1__.default)($titles, options);\n      (0,_components_texts_height__WEBPACK_IMPORTED_MODULE_1__.default)($badges, options);\n      (0,_components_texts_height__WEBPACK_IMPORTED_MODULE_1__.default)($reviews, options);\n      (0,_components_texts_height__WEBPACK_IMPORTED_MODULE_1__.default)($prices, options);\n    }; // eslint-disable-next-line shopify/prefer-early-return\n\n\n    var getImageMaxHeight = () => {\n      if ($cards.length) {\n        var $card = $(this.container).find('.product-card').first();\n        var height = $card.find('.product-card-image-container-wrapper').height();\n        $(this.container)[0].style.setProperty('--image-max-height', \"\".concat(height, \"px\"));\n      }\n    };\n\n    var initAddToCartButtons = () => {\n      if (!$addToCartButton.length) {\n        return;\n      } // Obtener los datos del producto a agregar\n\n\n      function getProductData($button) {\n        var {\n          variantId\n        } = $button.dataset;\n        var data = {\n          items: [{\n            id: variantId,\n            quantity: 1\n          }]\n        };\n        return data;\n      } // Actualizar contador de items en carrito\n\n\n      function updateCartCount() {\n        $cartCounter.text(window.Rebuy.Cart.cart.item_count);\n      }\n\n      $addToCartButton.on('click', event => {\n        var $button = event.target;\n        var productData = getProductData($button);\n        window.Rebuy.Cart.addItem(productData, {\n          success() {\n            window.Rebuy.SmartCart.show();\n            window.setTimeout(updateCartCount, 500);\n          },\n\n          error() {\n            window.Rebuy.SmartCart.show();\n          }\n\n        });\n      });\n    };\n\n    getImageMaxHeight();\n    calculateHeights();\n    initAddToCartButtons();\n    window.addEventListener('resize', () => {\n      getImageMaxHeight();\n    });\n  }\n\n};\n\nif (_shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__.registered[sectionType] == null) {\n  (0,_shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__.register)(sectionType, sectionConfig);\n}\n\n//# sourceURL=webpack://getmore-workflow/./zrc/scripts/templates/product/related-products/related-products.js?");

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
/******/ 			"main-related-products": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./zrc/scripts/templates/product/related-products/related-products.js","commons"]
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