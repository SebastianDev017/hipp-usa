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

/***/ "./zrc/scripts/templates/product/info/info.js":
/*!****************************************************!*\
  !*** ./zrc/scripts/templates/product/info/info.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swiper */ \"./node_modules/swiper/swiper.esm.js\");\n/* harmony import */ var _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shopify/theme-sections */ \"./node_modules/@shopify/theme-sections/theme-sections.js\");\n/* provided dependency */ var $ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n\n\nvar sectionType = 'product-info';\nvar sectionConfig = {\n  onLoad() {\n    this.$container = $(this.container);\n    this.$tabsWrapper = this.$container.find('.product-info-tabs-bar-wrapper');\n    this.$swiper = this.$container.find('.product-info-tabs-bar');\n    this.$tabButtons = this.$container.find('.product-info-tab-title');\n    this.$tabPanels = this.$container.find('.product-info-tabpanel-wrapper');\n    this.$readMoreButtonWrapper = this.$container.find('.product-info-read-more-button-wrapper');\n    this.$readMoreButton = this.$container.find('.product-info-read-more-button');\n    this.readMoreText = 'Leer más';\n    this.readLessText = 'Leer menos';\n    this.init();\n  },\n\n  init() {\n    this.initTabs();\n    this.verifyIfShowReadMoreButton();\n    this.readMoreButtonClickHandler();\n  },\n\n  initTabs() {\n    if (!this.$tabButtons.length) {\n      return;\n    }\n\n    this.initSwiper();\n    this.initTabButtons(); // this.setTagsOverflowBehaviour();\n  },\n\n  initSwiper() {\n    var moveIndicatorsBehaviour = swiper => {\n      var {\n        isEnd,\n        isBeginning\n      } = swiper;\n\n      if (isEnd) {\n        this.$tabsWrapper.removeClass('.js-has-scroll');\n        this.$tabsWrapper.addClass('js-scroll-end');\n      } else {\n        this.$tabsWrapper.addClass('js-has-scroll');\n        this.$tabsWrapper.removeClass('js-scroll-end');\n      }\n\n      if (isBeginning) {\n        this.$tabsWrapper.removeClass('js-scroll--show-left-arrow');\n      } else {\n        this.$tabsWrapper.addClass('js-scroll--show-left-arrow');\n      }\n    };\n\n    new swiper__WEBPACK_IMPORTED_MODULE_0__.default(this.$swiper.get(0), {\n      modules: [swiper__WEBPACK_IMPORTED_MODULE_0__.Navigation, swiper__WEBPACK_IMPORTED_MODULE_0__.FreeMode],\n      freeMode: true,\n      slidesPerView: 'auto',\n      longSwipesRatio: 0.01,\n      resistanceRatio: 0.01,\n      navigation: {\n        nextEl: this.container.querySelector('.product-info-tabs-scroll-button.swiper-button.next'),\n        prevEl: this.container.querySelector('.product-info-tabs-scroll-button.swiper-button.prev')\n      },\n      on: {\n        resize: swiper => {\n          moveIndicatorsBehaviour(swiper);\n        },\n        reachEnd: swiper => {\n          moveIndicatorsBehaviour(swiper);\n        },\n        reachBeginning: swiper => {\n          moveIndicatorsBehaviour(swiper);\n        },\n        sliderMove: swiper => {\n          moveIndicatorsBehaviour(swiper);\n        }\n      }\n    });\n  },\n\n  initTabButtons() {\n    this.$tabButtons.on('click', event => {\n      var $tabButton = $(event.target);\n      var tabNumber = $tabButton.attr('data-tab');\n      var $activeTabPanel = $(\"#product-info-tabpanel-\".concat(tabNumber));\n      this.$tabButtons.attr({\n        'aria-selected': 'false',\n        tabindex: '-1'\n      });\n      $tabButton.attr('aria-selected', 'true').removeAttr('tabindex');\n      this.$tabPanels.addClass('is-hidden').removeClass('is-open');\n      $activeTabPanel.removeClass('is-hidden');\n      this.$readMoreButtonWrapper.removeClass('show');\n      this.$readMoreButton.text(this.readMoreText);\n      this.verifyIfShowReadMoreButton();\n    });\n  },\n\n  setTagsOverflowBehaviour() {\n    // NOTA: Este script fue tomado del Blog de SUNWARRIOR\n    // Function para poder hacer el cambio de golpe del diseño \"rebasado\" de las tags al hacer resize\n    // seleccionamos el wrapper general de las tabs.\n    var $tagsRow = this.container.querySelector('.product-info-tabs-bar-wrapper'); // seleccionamos el div con overflow\n\n    var $containerToCheck = $tagsRow.querySelector('.product-info-tabs-bar');\n\n    function addClassToWrapper() {\n      // Funcion para que añada una clase al wrapper una vez que este tenga una barra horizontal\n      // Quitamos la clase primero, para que se calcule todo en su \"Estado normal\"\n      $tagsRow.classList.remove('js-has-scroll'); // hacemos el chequeo de si tiene barra horizontal\n\n      var hasHorizontalScrollbar = $containerToCheck.scrollWidth > $containerToCheck.clientWidth; // Si es que no se tiene barra horizontal, ya no hacemos nada.\n\n      if (hasHorizontalScrollbar === false) {\n        return;\n      } // añadimos la clase en caso de tener barra horizontal\n\n\n      $tagsRow.classList.add('js-has-scroll');\n    }\n\n    function checkIfScrollReachedEnd() {\n      if ($tagsRow.classList.contains('js-has-scroll') === false) {\n        return;\n      }\n\n      var maxScroll = $containerToCheck.scrollWidth - $containerToCheck.clientWidth;\n      var currentScrollPosition = Math.ceil($containerToCheck.scrollLeft);\n\n      if (currentScrollPosition !== maxScroll) {\n        $tagsRow.classList.remove('js-scroll-end');\n        return;\n      }\n\n      $tagsRow.classList.add('js-scroll-end');\n    }\n\n    function checkToShowLeftArrow() {\n      if ($tagsRow.classList.contains('js-has-scroll') === false) {\n        return;\n      } // let currentPaddingLeft = parseInt(window.getComputedStyle($containerToCheck).paddingLeft, 10);\n      // currentPaddingLeft /= 2;\n\n\n      if ($containerToCheck.scrollLeft > 0) {\n        $tagsRow.classList.add('js-scroll--show-left-arrow');\n        return;\n      }\n\n      $tagsRow.classList.remove('js-scroll--show-left-arrow');\n    } // declaramos el observador, y lo que hara\n\n\n    var resizeObserver = new window.ResizeObserver(() => {\n      addClassToWrapper();\n    }); // inicializamos el observador para que \"vea\" el resize de solo el elemento que queremos.\n\n    resizeObserver.observe($tagsRow);\n    addClassToWrapper();\n    $containerToCheck.addEventListener('scroll', () => {\n      checkToShowLeftArrow();\n      checkIfScrollReachedEnd();\n    });\n  },\n\n  verifyIfShowReadMoreButton() {\n    var $activeTabPanel = this.$container.find('.product-info-tabpanel-wrapper').not('.is-hidden');\n    var $activePanelContent = $activeTabPanel.find('.product-info-tabpanel');\n\n    if ($activePanelContent.height() > $activeTabPanel.height()) {\n      this.$readMoreButtonWrapper.addClass('show');\n      return;\n    }\n\n    this.$readMoreButtonWrapper.removeClass('show');\n  },\n\n  readMoreButtonClickHandler() {\n    this.$readMoreButton.on('click', () => {\n      var $activeTabPanel = this.$container.find('.product-info-tabpanel-wrapper').not('.is-hidden');\n      var isActivePanelOpen = $activeTabPanel.hasClass('is-open');\n\n      if (isActivePanelOpen) {\n        $activeTabPanel.removeClass('is-open');\n        this.$readMoreButton.text(this.readMoreText);\n        return;\n      }\n\n      $activeTabPanel.addClass('is-open');\n      this.$readMoreButton.text(this.readLessText);\n    }); // btnReadMore.addEventListener('click', () => {\n    //   if (descriptionContainer.classList.contains('visible')) {\n    //     descriptionContainer.classList.remove('visible');\n    //     this.textContent = textReadMore;\n    //   } else {\n    //     descriptionContainer.classList.add('visible');\n    //     this.textContent = textReadLess;\n    //   }\n    // });\n  }\n\n};\n\nif (_shopify_theme_sections__WEBPACK_IMPORTED_MODULE_1__.registered[sectionType] == null) {\n  (0,_shopify_theme_sections__WEBPACK_IMPORTED_MODULE_1__.register)(sectionType, sectionConfig);\n}\n\n//# sourceURL=webpack://getmore-workflow/./zrc/scripts/templates/product/info/info.js?");

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
/******/ 			"main-product-info": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./zrc/scripts/templates/product/info/info.js","commons"]
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