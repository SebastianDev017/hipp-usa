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

/***/ "./zrc/scripts/templates/cart/main/cart.js":
/*!*************************************************!*\
  !*** ./zrc/scripts/templates/cart/main/cart.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shopify/theme-sections */ \"./node_modules/@shopify/theme-sections/theme-sections.js\");\n/* provided dependency */ var $ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n\n(0,_shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__.register)('template-cart', {\n  onLoad() {\n    this.typingTimer = '';\n    this.doneTypingInterval = 1000;\n    this.$quantityInputs = $('.js-cart-item-input');\n    this.initQuantityInputs();\n  },\n\n  initQuantityInputs() {\n    var timer = {\n      set: event => {\n        window.clearTimeout(this.typingTimer);\n        this.typingTimer = window.setTimeout(() => {\n          this.doneTyping($(event.target));\n        }, this.doneTypingInterval);\n      },\n      stop: () => {\n        window.clearTimeout(this.typingTimer);\n      }\n    };\n    this.$quantityInputs.on('keyup', event => {\n      timer.set(event);\n    });\n    this.$quantityInputs.on('keydown', () => {\n      timer.stop();\n    });\n  },\n\n  disableAllQuantityInputs() {\n    this.$quantityInputs.prop('disabled', true).addClass('input-disabled');\n  },\n\n  enableAllQuantityInputs() {\n    this.$quantityInputs.prop('disabled', false).removeClass('input-disabled');\n  },\n\n  doneTyping($input) {\n    var quantityAmount = Number($input.val());\n    this.disableAllQuantityInputs();\n\n    if (quantityAmount !== '' && quantityAmount > 0) {\n      this.quantityInputHandler($input);\n      return;\n    }\n\n    $input.val(1);\n    this.quantityInputHandler($input);\n  },\n\n  quantityInputHandler($input) {\n    var $lineItem = $input.closest('.cart-item');\n    var $lineItemInput = $lineItem.find('.js-cart-item-input');\n    var productId = $input.attr('data-id');\n    var quantityAmount = Number($input.val());\n    $lineItemInput.val(quantityAmount);\n    $.post('/cart/update.js', \"updates[\".concat(productId, \"]=\").concat(quantityAmount), response => {\n      this.updateCartData(response, productId, $lineItem);\n      this.enableAllQuantityInputs();\n    });\n  },\n\n  updateCartData(response, productId, $lineItem) {\n    var cart = JSON.parse(response);\n    var itemData = cart.items.filter(product => product.id === Number(productId))[0];\n    this.updateDiscounts(cart, $lineItem, itemData);\n    this.updateProductPrice($lineItem, itemData);\n    this.updateCartSubtotal(cart);\n    this.updateCartBubble(cart);\n  },\n\n  updateDiscounts(cart, $item, itemData) {\n    var cartTotalDiscount = window.formatMoney(cart.total_discount, window.moneyFormat);\n    var itemOriginalPrice = window.formatMoney(itemData.original_line_price, window.moneyFormat);\n    $item.find('.cart-item-line-old-price').text(itemOriginalPrice);\n    $('.cart-savings-amount').text(cartTotalDiscount);\n  },\n\n  updateProductPrice($item, itemData) {\n    var priceProduct = \"\".concat(window.formatMoney(itemData.final_line_price, window.moneyFormat));\n    $item.find('.cart-item-line-price').text(priceProduct);\n  },\n\n  updateCartSubtotal(cart) {\n    var subtotalQuantity = window.formatMoney(cart.items_subtotal_price, window.moneyFormat);\n    $('.cart-subtotal-price').text(subtotalQuantity);\n  },\n\n  updateCartBubble(cart) {\n    $('.cart-count-bubble').find('span').first().text(\"\".concat(cart.item_count));\n  }\n\n});\n\n//# sourceURL=webpack://getmore-workflow/./zrc/scripts/templates/cart/main/cart.js?");

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
/******/ 			"main-cart": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./zrc/scripts/templates/cart/main/cart.js","commons"]
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