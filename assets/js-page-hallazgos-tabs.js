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

/***/ "./zrc/scripts/sections/page/hallazgos/tabs.js":
/*!*****************************************************!*\
  !*** ./zrc/scripts/sections/page/hallazgos/tabs.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var swiper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! swiper */ \"./node_modules/swiper/swiper.esm.js\");\n/* harmony import */ var _shopify_theme_sections__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @shopify/theme-sections */ \"./node_modules/@shopify/theme-sections/theme-sections.js\");\n/* provided dependency */ var $ = __webpack_require__(/*! jquery */ \"./node_modules/jquery/dist/jquery.js\");\n\n\n(0,_shopify_theme_sections__WEBPACK_IMPORTED_MODULE_1__.register)('page-hallazgos-tabs', {\n  onLoad() {\n    this.$container = $(this.container);\n    this.$swiper = this.$container.find('.ings-h-tabs-carousel');\n    this.slidesLength = this.$swiper.data('slides');\n    this.$swiperButtonNext = this.container.querySelector('.ings-h-tabs-swiper-button.next');\n    this.$swiperButtonPrev = this.container.querySelector('.ings-h-tabs-swiper-button.prev');\n    this.$tabsButtons = this.$container.find('.ings-h-tab-button');\n    this.$blocks = this.$container.find('.ings-h-block');\n    this.$sections = this.$container.parent().prev().nextAll();\n    this.sectionsToAppendToBlocks = [];\n    this.swiperSettings = {\n      modules: [swiper__WEBPACK_IMPORTED_MODULE_0__.Navigation],\n      init: false,\n      loop: false,\n      speed: 300,\n      slidesPerView: 'auto',\n      centerInsufficientSlides: true,\n      longSwipesRatio: 0,\n      resistanceRatio: 0,\n      navigation: {\n        nextEl: this.$swiperButtonNext,\n        prevEl: this.$swiperButtonPrev\n      }\n    };\n    this.swiper = new swiper__WEBPACK_IMPORTED_MODULE_0__.default(this.$swiper[0], this.swiperSettings);\n    this.init();\n  },\n\n  init() {\n    this.initTabButtons();\n    this.initBlocks();\n    this.swiper.init();\n  },\n\n  initTabButtons() {\n    this.$tabsButtons.on('click', event => {\n      var $tabButton = $(event.target);\n      var blogName = $tabButton.attr('data-block');\n      this.$tabsButtons.removeClass('active');\n      $tabButton.addClass('active');\n      this.showBlog(blogName);\n    });\n    this.setDefaultActiveTab();\n  },\n\n  showBlog(blogName) {\n    var $blogTarget = this.$blocks.filter(\"[data-block=\\\"\".concat(blogName, \"\\\"]\"));\n    this.$blocks.removeClass('active');\n    $blogTarget.addClass('active');\n  },\n\n  setDefaultActiveTab() {\n    var $firstTab = this.$tabsButtons.first();\n    $firstTab.trigger('click');\n  },\n\n  initBlocks() {\n    this.$blocks.each((index, $block) => {\n      this.setSectionsToAppendToBlock(index, $($block));\n    });\n    this.sectionsToAppendToBlocks.forEach(item => {\n      var {\n        block,\n        sections\n      } = item;\n      sections.appendTo(block);\n    });\n  },\n\n  setSectionsToAppendToBlock(index, $block) {\n    var sectionsOffset = this.getBlockSectionsOffset($block);\n    var sectionsToAppend = this.getBlockSectionsToAppend($block, sectionsOffset);\n    this.sectionsToAppendToBlocks.push({\n      block: $block,\n      sections: sectionsToAppend\n    });\n  },\n\n  getBlockSectionsOffset($block) {\n    var offset = 0;\n    var $prevBlocks = $block.prevAll();\n    $prevBlocks.each((index, $prevBlock) => {\n      var sectionsQty = Number($($prevBlock).attr('data-sections-quantity'));\n      offset += sectionsQty;\n    });\n    return offset;\n  },\n\n  getBlockSectionsToAppend($block, offset) {\n    var blockSectionsQuantity = Number($($block).attr('data-sections-quantity'));\n    var $sectionsWithOffset = $(this.$sections.get(offset));\n    var $nextSectionTarget = $(this.$sections.get(offset + blockSectionsQuantity)).next();\n    var $sections = $sectionsWithOffset.nextUntil(\"#\".concat($nextSectionTarget.attr('id')));\n    return $sections;\n  }\n\n});\n\n//# sourceURL=webpack://getmore-workflow/./zrc/scripts/sections/page/hallazgos/tabs.js?");

    this.swiper.on('slideChange', () => {
    this.refreshImages();
  });

  this.refreshImages = () => {
    this.$blocks.each((index, $block) => {
      const $images = $($block).find('img');
      $images.each((i, img) => {
        const $img = $(img);
        const dataSrc = $img.attr('data-src');
        if (dataSrc && !$img.attr('src')) {
          $img.attr('src', dataSrc);
        }
      });
    });
  };

  this.refreshImages();

  
  // evento para actualizar el Swiper al cambiar de pestaña
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    this.swiper.update();
  }
});

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
/******/ 			"page-hallazgos-tabs": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./zrc/scripts/sections/page/hallazgos/tabs.js","commons"]
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

