/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./zrc/scripts/apps/rebuy/smart-cart.js":
/*!**********************************************!*\
  !*** ./zrc/scripts/apps/rebuy/smart-cart.js ***!
  \**********************************************/
/***/ (() => {

eval("/* eslint-disable no-prototype-builtins */\nvar GMSmartCart = function () {\n  return {\n    removeIncompleteBundles(cart) {\n      // == Eliminar los regalos que no tengan producto padre ==\n      var itemsWithBundleId = [];\n      var bundlesId = []; // Buscar los items que sean parte de un bundle\n\n      cart.items.forEach(item => {\n        if (item.properties === null || !item.properties.hasOwnProperty('_bundleId')) {\n          return;\n        }\n\n        var bundleId = item.properties._bundleId;\n        itemsWithBundleId.push(item);\n        bundlesId.push(bundleId);\n      }); // Obtener el id de los bundles incompletos\n\n      var incompleteBundles = this.getIncompleteBundles(bundlesId); // window.console.log('bundles incompletos: ', incompleteBundles);\n      // window.console.log('gifts: ', gifts);\n      // Eliminar los regalos que no tengan producto padre\n\n      var gifts = itemsWithBundleId.filter(item => item.properties.hasOwnProperty('_gift'));\n      gifts.forEach(item => {\n        var isAGift = Boolean(item.properties._gift);\n        var itemBundleId = item.properties._bundleId;\n\n        if (isAGift && incompleteBundles.includes(itemBundleId)) {\n          window.Rebuy.Cart.removeItem(item);\n        }\n      });\n    },\n\n    getIncompleteBundles(bundleIds) {\n      function filterIncompleteBundles(array) {\n        // eslint-disable-next-line id-length\n        return array.filter((elem, index, arr) => arr.filter(e => e === elem).length === 1);\n      }\n\n      return filterIncompleteBundles(bundleIds);\n    }\n\n  };\n}();\n\ndocument.addEventListener('rebuy:smartcart.ready', event => {\n  GMSmartCart.removeIncompleteBundles(event.detail.smartcart.cart);\n});\ndocument.addEventListener('rebuy:cart.change', event => {\n  GMSmartCart.removeIncompleteBundles(event.detail.cart.cart);\n});\n\n//# sourceURL=webpack://getmore-workflow/./zrc/scripts/apps/rebuy/smart-cart.js?");

/***/ }),

/***/ "./zrc/scripts/base.js":
/*!*****************************!*\
  !*** ./zrc/scripts/base.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aos */ \"./node_modules/aos/dist/aos.js\");\n/* harmony import */ var aos__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aos__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shopify/theme-sections */ \"./node_modules/@shopify/theme-sections/theme-sections.js\");\n/* harmony import */ var _layout_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./layout/index */ \"./zrc/scripts/layout/index.js\");\n/* harmony import */ var _apps_rebuy_smart_cart__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./apps/rebuy/smart-cart */ \"./zrc/scripts/apps/rebuy/smart-cart.js\");\n/* harmony import */ var _apps_rebuy_smart_cart__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_apps_rebuy_smart_cart__WEBPACK_IMPORTED_MODULE_3__);\n/**\n * 🏷 Info about theme sections\n * @package: @shopify/theme-sections\n * @url: https://yarnpkg.com/en/package/@shopify/theme-sections\n */\n\n\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,_shopify_theme_sections__WEBPACK_IMPORTED_MODULE_1__.load)('*');\n  aos__WEBPACK_IMPORTED_MODULE_0___default().init({\n    duration: 800,\n    ease: 'ease-out-cubic',\n    once: true\n  });\n});\n\n//# sourceURL=webpack://getmore-workflow/./zrc/scripts/base.js?");

/***/ }),

/***/ "./zrc/scripts/layout/announcement-bar.js":
/*!************************************************!*\
  !*** ./zrc/scripts/layout/announcement-bar.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swiper */ \"./node_modules/swiper/swiper.esm.js\");\n/* harmony import */ var _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shopify/theme-sections */ \"./node_modules/@shopify/theme-sections/theme-sections.js\");\n/* eslint-disable no-lonely-if */\n\n\n(0,_shopify_theme_sections__WEBPACK_IMPORTED_MODULE_1__.register)('announcement-bar', {\n  onLoad() {\n    this.announcementSlider();\n  },\n\n  announcementSlider() {\n    var $announcementBarContainer = this.container;\n    var autoplay = JSON.parse($announcementBarContainer.dataset.autoplay);\n    var items = JSON.parse($announcementBarContainer.dataset.items);\n    var swiper = null;\n\n    if ($announcementBarContainer.length === 0) {\n      return;\n    }\n\n    var init = () => {\n      if (window.matchMedia('(max-width: 900px)').matches) {\n        if (!$announcementBarContainer.classList.contains('swiper-initialized')) {\n          swiper = new swiper__WEBPACK_IMPORTED_MODULE_0__.default($announcementBarContainer, {\n            modules: [swiper__WEBPACK_IMPORTED_MODULE_0__.Autoplay],\n            init: false,\n            loop: items > 1,\n            autoplay: autoplay ? {\n              disableOnInteraction: true\n            } : false,\n            breakpointsBase: 'container',\n            centeredSlides: true,\n            longSwipesRatio: 0,\n            resistanceRatio: 0,\n            slidesPerView: 1,\n            speed: 400,\n            threshold: 0\n          });\n          swiper.init();\n        }\n      } else {\n        if ($announcementBarContainer.classList.contains('swiper-initialized')) {\n          swiper.destroy();\n          swiper = null;\n        }\n      }\n    };\n\n    init();\n    window.addEventListener('resize', init);\n  }\n\n});\n\n//# sourceURL=webpack://getmore-workflow/./zrc/scripts/layout/announcement-bar.js?");

/***/ }),

/***/ "./zrc/scripts/layout/header.js":
/*!**************************************!*\
  !*** ./zrc/scripts/layout/header.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shopify/theme-sections */ \"./node_modules/@shopify/theme-sections/theme-sections.js\");\n/* provided dependency */ var $ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n/* eslint-disable no-undef */\n\n(0,_shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__.register)('header-section', {\n  onLoad() {\n    this.$container = $(this.container);\n    this.$mainHeaderWrapper = $('#header');\n    this.$hamburger = this.$container.find('.hamburger');\n    this.$headerWrapper = $('.header-wrapper');\n    this.isHomepage = $('body').hasClass('template-index');\n    this.scrollOffset = 3;\n    window.isHomepage = this.isHomepage;\n    this.init();\n  },\n\n  init() {\n    // this.scrollHandle();\n    this.setCssProperties();\n    this.initHamburger();\n    window.addEventListener('resize', debounce(this.setCssProperties, 100), false);\n  },\n\n  setCssProperties() {\n    var announcementBarHeight = $('#shopify-section-announcement-bar').height();\n    document.documentElement.style.setProperty('--announcement-bar-height', \"\".concat(announcementBarHeight, \"px\"));\n    var headerHeight = $('.header').height();\n    document.documentElement.style.setProperty('--header-height', \"\".concat(headerHeight, \"px\"));\n    var viewportHeight = window.innerHeight;\n    document.documentElement.style.setProperty('--viewport-height', \"\".concat(viewportHeight, \"px\"));\n  },\n\n  scrollHandle() {\n    var setScrollClass = () => {\n      if (this.isHomepage) {\n        if (window.scrollY > this.scrollOffset) {\n          this.$mainHeaderWrapper.addClass('scroll');\n        } else {\n          this.$mainHeaderWrapper.removeClass('scroll');\n        }\n      }\n    };\n\n    setScrollClass();\n    window.addEventListener('scroll', () => {\n      setScrollClass();\n      this.setCssProperties();\n    });\n    this.$hamburger.on('scroll', () => {\n      this.$hamburger.get(0).style.setProperty('--scroll-top', \"\".concat(this.$hamburger.get(0).scrollTop, \"px\"));\n    });\n  },\n\n  /*  ---  Hamburger  ---  */\n  initHamburger() {\n    this.hamburgerLinkHoverHandle();\n  },\n\n  disableHamburgerScroll() {// const $hamburger = this.$hamburger.get(0);\n    // const scrollTop = $hamburger.scrollTop;\n    // this.$hamburger.on('scroll', () => {\n    //   $hamburger.scrollTo(0, scrollTop);\n    // });\n  },\n\n  enableHamburgerScroll() {// this.$hamburger.off('scroll');\n    // this.$hamburger.on('scroll', () => {\n    //   this.$hamburger.get(0).style.setProperty('--scroll-top', `${this.$hamburger.get(0).scrollTop}px`);\n    // });\n  },\n\n  hamburgerLinkHoverHandle() {\n    // Links que abren un submenu\n    var $submenuToggles = $('.hamburger-main-link').not('.mobile-nav-link, .submenu-toggle-content, .mobile-nav-return-text'); // Lado izquiero del hamburger\n\n    var $sidebar = $('.hamburger-sidebar');\n    var $submenusWrapper = $('.hamburger-submenus');\n    $submenuToggles.hover(event => {\n      var $toggle = $(event.target);\n      var {\n        submenuTarget\n      } = event.target.dataset;\n      var $submenus = $('.hamburger-submenus');\n      var $submenuWrappers = $('.hamburger-submenu-wrapper');\n      var $submenu = $submenuWrappers.filter(\"[data-parent-link=\\\"\".concat(submenuTarget, \"\\\"]\"));\n      $submenuWrappers.add($submenus).removeClass('show');\n      $submenuToggles.removeClass('hover');\n      $toggle.addClass('hover');\n\n      if ($submenu.length) {\n        $submenu.add($submenus).addClass('show');\n        this.$hamburger.addClass('submenu-open');\n      } else {\n        $submenu.add($submenus).removeClass('show');\n        this.$hamburger.removeClass('submenu-open');\n      }\n    }, false);\n    $sidebar.hover(() => {\n      this.$hamburger.removeClass('disabled-scroll');\n      $submenusWrapper.addClass('disabled-scroll');\n    }, false);\n    $submenusWrapper.hover(() => {\n      if (!$('.hamburger-submenu-wrapper').hasClass('show')) {\n        return;\n      }\n\n      this.$hamburger.addClass('disabled-scroll');\n      $submenusWrapper.removeClass('disabled-scroll');\n    }, false);\n  }\n\n});\n\n//# sourceURL=webpack://getmore-workflow/./zrc/scripts/layout/header.js?");

/***/ }),

/***/ "./zrc/scripts/layout/index.js":
/*!*************************************!*\
  !*** ./zrc/scripts/layout/index.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shopify/theme-sections */ \"./node_modules/@shopify/theme-sections/theme-sections.js\");\n/* harmony import */ var _announcement_bar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./announcement-bar */ \"./zrc/scripts/layout/announcement-bar.js\");\n/* harmony import */ var _header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./header */ \"./zrc/scripts/layout/header.js\");\n\n\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  (0,_shopify_theme_sections__WEBPACK_IMPORTED_MODULE_0__.load)('*');\n});\n\n//# sourceURL=webpack://getmore-workflow/./zrc/scripts/layout/index.js?");

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
/******/ 			"base": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./zrc/scripts/base.js","commons"]
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