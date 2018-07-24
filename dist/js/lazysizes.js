'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (window, factory) {
	var lazySizes = factory(window, window.document);
	window.lazySizes = lazySizes;
	if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {
		module.exports = lazySizes;
	}
})(window, function l(window, document) {
	'use strict';
	/*jshint eqnull:true */

	if (!document.getElementsByClassName) {
		return;
	}

	var lazysizes, lazySizesConfig;

	var docElem = document.documentElement;

	var Date = window.Date;

	var supportPicture = window.HTMLPictureElement;

	var _addEventListener = 'addEventListener';

	var _getAttribute = 'getAttribute';

	var addEventListener = window[_addEventListener];

	var setTimeout = window.setTimeout;

	var requestAnimationFrame = window.requestAnimationFrame || setTimeout;

	var requestIdleCallback = window.requestIdleCallback;

	var regPicture = /^picture$/i;

	var loadEvents = ['load', 'error', 'lazyincluded', '_lazyloaded'];

	var regClassCache = {};

	var forEach = Array.prototype.forEach;

	var hasClass = function hasClass(ele, cls) {
		if (!regClassCache[cls]) {
			regClassCache[cls] = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		}
		return regClassCache[cls].test(ele[_getAttribute]('class') || '') && regClassCache[cls];
	};

	var addClass = function addClass(ele, cls) {
		if (!hasClass(ele, cls)) {
			ele.setAttribute('class', (ele[_getAttribute]('class') || '').trim() + ' ' + cls);
		}
	};

	var removeClass = function removeClass(ele, cls) {
		var reg;
		if (reg = hasClass(ele, cls)) {
			ele.setAttribute('class', (ele[_getAttribute]('class') || '').replace(reg, ' '));
		}
	};

	var addRemoveLoadEvents = function addRemoveLoadEvents(dom, fn, add) {
		var action = add ? _addEventListener : 'removeEventListener';
		if (add) {
			addRemoveLoadEvents(dom, fn);
		}
		loadEvents.forEach(function (evt) {
			dom[action](evt, fn);
		});
	};

	var triggerEvent = function triggerEvent(elem, name, detail, noBubbles, noCancelable) {
		var event = document.createEvent('CustomEvent');

		if (!detail) {
			detail = {};
		}

		detail.instance = lazysizes;

		event.initCustomEvent(name, !noBubbles, !noCancelable, detail);

		elem.dispatchEvent(event);
		return event;
	};

	var updatePolyfill = function updatePolyfill(el, full) {
		var polyfill;
		if (!supportPicture && (polyfill = window.picturefill || lazySizesConfig.pf)) {
			polyfill({ reevaluate: true, elements: [el] });
		} else if (full && full.src) {
			el.src = full.src;
		}
	};

	var getCSS = function getCSS(elem, style) {
		return (getComputedStyle(elem, null) || {})[style];
	};

	var getWidth = function getWidth(elem, parent, width) {
		width = width || elem.offsetWidth;

		while (width < lazySizesConfig.minSize && parent && !elem._lazysizesWidth) {
			width = parent.offsetWidth;
			parent = parent.parentNode;
		}

		return width;
	};

	var rAF = function () {
		var running, waiting;
		var firstFns = [];
		var secondFns = [];
		var fns = firstFns;

		var run = function run() {
			var runFns = fns;

			fns = firstFns.length ? secondFns : firstFns;

			running = true;
			waiting = false;

			while (runFns.length) {
				runFns.shift()();
			}

			running = false;
		};

		var rafBatch = function rafBatch(fn, queue) {
			if (running && !queue) {
				fn.apply(this, arguments);
			} else {
				fns.push(fn);

				if (!waiting) {
					waiting = true;
					(document.hidden ? setTimeout : requestAnimationFrame)(run);
				}
			}
		};

		rafBatch._lsFlush = run;

		return rafBatch;
	}();

	var rAFIt = function rAFIt(fn, simple) {
		return simple ? function () {
			rAF(fn);
		} : function () {
			var that = this;
			var args = arguments;
			rAF(function () {
				fn.apply(that, args);
			});
		};
	};

	var throttle = function throttle(fn) {
		var running;
		var lastTime = 0;
		var gDelay = lazySizesConfig.throttleDelay;
		var rICTimeout = lazySizesConfig.ricTimeout;
		var run = function run() {
			running = false;
			lastTime = Date.now();
			fn();
		};
		var idleCallback = requestIdleCallback && rICTimeout > 49 ? function () {
			requestIdleCallback(run, { timeout: rICTimeout });

			if (rICTimeout !== lazySizesConfig.ricTimeout) {
				rICTimeout = lazySizesConfig.ricTimeout;
			}
		} : rAFIt(function () {
			setTimeout(run);
		}, true);

		return function (isPriority) {
			var delay;

			if (isPriority = isPriority === true) {
				rICTimeout = 33;
			}

			if (running) {
				return;
			}

			running = true;

			delay = gDelay - (Date.now() - lastTime);

			if (delay < 0) {
				delay = 0;
			}

			if (isPriority || delay < 9) {
				idleCallback();
			} else {
				setTimeout(idleCallback, delay);
			}
		};
	};

	//based on http://modernjavascript.blogspot.de/2013/08/building-better-debounce.html
	var debounce = function debounce(func) {
		var timeout, timestamp;
		var wait = 99;
		var run = function run() {
			timeout = null;
			func();
		};
		var later = function later() {
			var last = Date.now() - timestamp;

			if (last < wait) {
				setTimeout(later, wait - last);
			} else {
				(requestIdleCallback || run)(run);
			}
		};

		return function () {
			timestamp = Date.now();

			if (!timeout) {
				timeout = setTimeout(later, wait);
			}
		};
	};

	(function () {
		var prop;

		var lazySizesDefaults = {
			lazyClass: 'lazyload',
			loadedClass: 'lazyloaded',
			loadingClass: 'lazyloading',
			preloadClass: 'lazypreload',
			errorClass: 'lazyerror',
			//strictClass: 'lazystrict',
			autosizesClass: 'lazyautosizes',
			srcAttr: 'data-src',
			srcsetAttr: 'data-srcset',
			sizesAttr: 'data-sizes',
			//preloadAfterLoad: false,
			minSize: 40,
			customMedia: {},
			init: true,
			expFactor: 1.5,
			hFac: 0.8,
			loadMode: 2,
			loadHidden: true,
			ricTimeout: 0,
			throttleDelay: 125
		};

		lazySizesConfig = window.lazySizesConfig || window.lazysizesConfig || {};

		for (prop in lazySizesDefaults) {
			if (!(prop in lazySizesConfig)) {
				lazySizesConfig[prop] = lazySizesDefaults[prop];
			}
		}

		window.lazySizesConfig = lazySizesConfig;

		setTimeout(function () {
			if (lazySizesConfig.init) {
				init();
			}
		});
	})();

	var loader = function () {
		var preloadElems, isCompleted, resetPreloadingTimer, loadMode, started;

		var eLvW, elvH, eLtop, eLleft, eLright, eLbottom;

		var defaultExpand, preloadExpand, hFac;

		var regImg = /^img$/i;
		var regIframe = /^iframe$/i;

		var supportScroll = 'onscroll' in window && !/glebot/.test(navigator.userAgent);

		var shrinkExpand = 0;
		var currentExpand = 0;

		var isLoading = 0;
		var lowRuns = -1;

		var resetPreloading = function resetPreloading(e) {
			isLoading--;
			if (e && e.target) {
				addRemoveLoadEvents(e.target, resetPreloading);
			}

			if (!e || isLoading < 0 || !e.target) {
				isLoading = 0;
			}
		};

		var isNestedVisible = function isNestedVisible(elem, elemExpand) {
			var outerRect;
			var parent = elem;
			var visible = getCSS(document.body, 'visibility') == 'hidden' || getCSS(elem, 'visibility') != 'hidden';

			eLtop -= elemExpand;
			eLbottom += elemExpand;
			eLleft -= elemExpand;
			eLright += elemExpand;

			while (visible && (parent = parent.offsetParent) && parent != document.body && parent != docElem) {
				visible = (getCSS(parent, 'opacity') || 1) > 0;

				if (visible && getCSS(parent, 'overflow') != 'visible') {
					outerRect = parent.getBoundingClientRect();
					visible = eLright > outerRect.left && eLleft < outerRect.right && eLbottom > outerRect.top - 1 && eLtop < outerRect.bottom + 1;
				}
			}

			return visible;
		};

		var checkElements = function checkElements() {
			var eLlen, i, rect, autoLoadElem, loadedSomething, elemExpand, elemNegativeExpand, elemExpandVal, beforeExpandVal;

			var lazyloadElems = lazysizes.elements;

			if ((loadMode = lazySizesConfig.loadMode) && isLoading < 8 && (eLlen = lazyloadElems.length)) {

				i = 0;

				lowRuns++;

				if (preloadExpand == null) {
					if (!('expand' in lazySizesConfig)) {
						lazySizesConfig.expand = docElem.clientHeight > 500 && docElem.clientWidth > 500 ? 500 : 370;
					}

					defaultExpand = lazySizesConfig.expand;
					preloadExpand = defaultExpand * lazySizesConfig.expFactor;
				}

				if (currentExpand < preloadExpand && isLoading < 1 && lowRuns > 2 && loadMode > 2 && !document.hidden) {
					currentExpand = preloadExpand;
					lowRuns = 0;
				} else if (loadMode > 1 && lowRuns > 1 && isLoading < 6) {
					currentExpand = defaultExpand;
				} else {
					currentExpand = shrinkExpand;
				}

				for (; i < eLlen; i++) {

					if (!lazyloadElems[i] || lazyloadElems[i]._lazyRace) {
						continue;
					}

					if (!supportScroll) {
						unveilElement(lazyloadElems[i]);continue;
					}

					if (!(elemExpandVal = lazyloadElems[i][_getAttribute]('data-expand')) || !(elemExpand = elemExpandVal * 1)) {
						elemExpand = currentExpand;
					}

					if (beforeExpandVal !== elemExpand) {
						eLvW = innerWidth + elemExpand * hFac;
						elvH = innerHeight + elemExpand;
						elemNegativeExpand = elemExpand * -1;
						beforeExpandVal = elemExpand;
					}

					rect = lazyloadElems[i].getBoundingClientRect();

					if ((eLbottom = rect.bottom) >= elemNegativeExpand && (eLtop = rect.top) <= elvH && (eLright = rect.right) >= elemNegativeExpand * hFac && (eLleft = rect.left) <= eLvW && (eLbottom || eLright || eLleft || eLtop) && (lazySizesConfig.loadHidden || getCSS(lazyloadElems[i], 'visibility') != 'hidden') && (isCompleted && isLoading < 3 && !elemExpandVal && (loadMode < 3 || lowRuns < 4) || isNestedVisible(lazyloadElems[i], elemExpand))) {
						unveilElement(lazyloadElems[i]);
						loadedSomething = true;
						if (isLoading > 9) {
							break;
						}
					} else if (!loadedSomething && isCompleted && !autoLoadElem && isLoading < 4 && lowRuns < 4 && loadMode > 2 && (preloadElems[0] || lazySizesConfig.preloadAfterLoad) && (preloadElems[0] || !elemExpandVal && (eLbottom || eLright || eLleft || eLtop || lazyloadElems[i][_getAttribute](lazySizesConfig.sizesAttr) != 'auto'))) {
						autoLoadElem = preloadElems[0] || lazyloadElems[i];
					}
				}

				if (autoLoadElem && !loadedSomething) {
					unveilElement(autoLoadElem);
				}
			}
		};

		var throttledCheckElements = throttle(checkElements);

		var switchLoadingClass = function switchLoadingClass(e) {
			addClass(e.target, lazySizesConfig.loadedClass);
			removeClass(e.target, lazySizesConfig.loadingClass);
			addRemoveLoadEvents(e.target, rafSwitchLoadingClass);
			triggerEvent(e.target, 'lazyloaded');
		};
		var rafedSwitchLoadingClass = rAFIt(switchLoadingClass);
		var rafSwitchLoadingClass = function rafSwitchLoadingClass(e) {
			rafedSwitchLoadingClass({ target: e.target });
		};

		var changeIframeSrc = function changeIframeSrc(elem, src) {
			try {
				elem.contentWindow.location.replace(src);
			} catch (e) {
				elem.src = src;
			}
		};

		var handleSources = function handleSources(source) {
			var customMedia;

			var sourceSrcset = source[_getAttribute](lazySizesConfig.srcsetAttr);

			if (customMedia = lazySizesConfig.customMedia[source[_getAttribute]('data-media') || source[_getAttribute]('media')]) {
				source.setAttribute('media', customMedia);
			}

			if (sourceSrcset) {
				source.setAttribute('srcset', sourceSrcset);
			}
		};

		var lazyUnveil = rAFIt(function (elem, detail, isAuto, sizes, isImg) {
			var src, srcset, parent, isPicture, event, firesLoad;

			if (!(event = triggerEvent(elem, 'lazybeforeunveil', detail)).defaultPrevented) {

				if (sizes) {
					if (isAuto) {
						addClass(elem, lazySizesConfig.autosizesClass);
					} else {
						elem.setAttribute('sizes', sizes);
					}
				}

				srcset = elem[_getAttribute](lazySizesConfig.srcsetAttr);
				src = elem[_getAttribute](lazySizesConfig.srcAttr);

				if (isImg) {
					parent = elem.parentNode;
					isPicture = parent && regPicture.test(parent.nodeName || '');
				}

				firesLoad = detail.firesLoad || 'src' in elem && (srcset || src || isPicture);

				event = { target: elem };

				if (firesLoad) {
					addRemoveLoadEvents(elem, resetPreloading, true);
					clearTimeout(resetPreloadingTimer);
					resetPreloadingTimer = setTimeout(resetPreloading, 2500);

					addClass(elem, lazySizesConfig.loadingClass);
					addRemoveLoadEvents(elem, rafSwitchLoadingClass, true);
				}

				if (isPicture) {
					forEach.call(parent.getElementsByTagName('source'), handleSources);
				}

				if (srcset) {
					elem.setAttribute('srcset', srcset);
				} else if (src && !isPicture) {
					if (regIframe.test(elem.nodeName)) {
						changeIframeSrc(elem, src);
					} else {
						elem.src = src;
					}
				}

				if (isImg && (srcset || isPicture)) {
					updatePolyfill(elem, { src: src });
				}
			}

			if (elem._lazyRace) {
				delete elem._lazyRace;
			}
			removeClass(elem, lazySizesConfig.lazyClass);

			rAF(function () {
				if (!firesLoad || elem.complete && elem.naturalWidth > 1) {
					if (firesLoad) {
						resetPreloading(event);
					} else {
						isLoading--;
					}
					switchLoadingClass(event);
				}
			}, true);
		});

		var unveilElement = function unveilElement(elem) {
			var detail;

			var isImg = regImg.test(elem.nodeName);

			//allow using sizes="auto", but don't use. it's invalid. Use data-sizes="auto" or a valid value for sizes instead (i.e.: sizes="80vw")
			var sizes = isImg && (elem[_getAttribute](lazySizesConfig.sizesAttr) || elem[_getAttribute]('sizes'));
			var isAuto = sizes == 'auto';

			if ((isAuto || !isCompleted) && isImg && (elem[_getAttribute]('src') || elem.srcset) && !elem.complete && !hasClass(elem, lazySizesConfig.errorClass) && hasClass(elem, lazySizesConfig.lazyClass)) {
				return;
			}

			detail = triggerEvent(elem, 'lazyunveilread').detail;

			if (isAuto) {
				autoSizer.updateElem(elem, true, elem.offsetWidth);
			}

			elem._lazyRace = true;
			isLoading++;

			lazyUnveil(elem, detail, isAuto, sizes, isImg);
		};

		var onload = function onload() {
			if (isCompleted) {
				return;
			}
			if (Date.now() - started < 999) {
				setTimeout(onload, 999);
				return;
			}
			var afterScroll = debounce(function () {
				lazySizesConfig.loadMode = 3;
				throttledCheckElements();
			});

			isCompleted = true;

			lazySizesConfig.loadMode = 3;

			throttledCheckElements();

			addEventListener('scroll', function () {
				if (lazySizesConfig.loadMode == 3) {
					lazySizesConfig.loadMode = 2;
				}
				afterScroll();
			}, true);
		};

		return {
			_: function _() {
				started = Date.now();

				lazysizes.elements = document.getElementsByClassName(lazySizesConfig.lazyClass);
				preloadElems = document.getElementsByClassName(lazySizesConfig.lazyClass + ' ' + lazySizesConfig.preloadClass);
				hFac = lazySizesConfig.hFac;

				addEventListener('scroll', throttledCheckElements, true);

				addEventListener('resize', throttledCheckElements, true);

				if (window.MutationObserver) {
					new MutationObserver(throttledCheckElements).observe(docElem, { childList: true, subtree: true, attributes: true });
				} else {
					docElem[_addEventListener]('DOMNodeInserted', throttledCheckElements, true);
					docElem[_addEventListener]('DOMAttrModified', throttledCheckElements, true);
					setInterval(throttledCheckElements, 999);
				}

				addEventListener('hashchange', throttledCheckElements, true);

				//, 'fullscreenchange'
				['focus', 'mouseover', 'click', 'load', 'transitionend', 'animationend', 'webkitAnimationEnd'].forEach(function (name) {
					document[_addEventListener](name, throttledCheckElements, true);
				});

				if (/d$|^c/.test(document.readyState)) {
					onload();
				} else {
					addEventListener('load', onload);
					document[_addEventListener]('DOMContentLoaded', throttledCheckElements);
					setTimeout(onload, 20000);
				}

				if (lazysizes.elements.length) {
					checkElements();
					rAF._lsFlush();
				} else {
					throttledCheckElements();
				}
			},
			checkElems: throttledCheckElements,
			unveil: unveilElement
		};
	}();

	var autoSizer = function () {
		var autosizesElems;

		var sizeElement = rAFIt(function (elem, parent, event, width) {
			var sources, i, len;
			elem._lazysizesWidth = width;
			width += 'px';

			elem.setAttribute('sizes', width);

			if (regPicture.test(parent.nodeName || '')) {
				sources = parent.getElementsByTagName('source');
				for (i = 0, len = sources.length; i < len; i++) {
					sources[i].setAttribute('sizes', width);
				}
			}

			if (!event.detail.dataAttr) {
				updatePolyfill(elem, event.detail);
			}
		});
		var getSizeElement = function getSizeElement(elem, dataAttr, width) {
			var event;
			var parent = elem.parentNode;

			if (parent) {
				width = getWidth(elem, parent, width);
				event = triggerEvent(elem, 'lazybeforesizes', { width: width, dataAttr: !!dataAttr });

				if (!event.defaultPrevented) {
					width = event.detail.width;

					if (width && width !== elem._lazysizesWidth) {
						sizeElement(elem, parent, event, width);
					}
				}
			}
		};

		var updateElementsSizes = function updateElementsSizes() {
			var i;
			var len = autosizesElems.length;
			if (len) {
				i = 0;

				for (; i < len; i++) {
					getSizeElement(autosizesElems[i]);
				}
			}
		};

		var debouncedUpdateElementsSizes = debounce(updateElementsSizes);

		return {
			_: function _() {
				autosizesElems = document.getElementsByClassName(lazySizesConfig.autosizesClass);
				addEventListener('resize', debouncedUpdateElementsSizes);
			},
			checkElems: debouncedUpdateElementsSizes,
			updateElem: getSizeElement
		};
	}();

	var init = function init() {
		if (!init.i) {
			init.i = true;
			autoSizer._();
			loader._();
		}
	};

	lazysizes = {
		cfg: lazySizesConfig,
		autoSizer: autoSizer,
		loader: loader,
		init: init,
		uP: updatePolyfill,
		aC: addClass,
		rC: removeClass,
		hC: hasClass,
		fire: triggerEvent,
		gW: getWidth,
		rAF: rAF
	};

	return lazysizes;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxhenlzaXplcy5qcyJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJmYWN0b3J5IiwibGF6eVNpemVzIiwiZG9jdW1lbnQiLCJtb2R1bGUiLCJleHBvcnRzIiwibCIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJsYXp5c2l6ZXMiLCJsYXp5U2l6ZXNDb25maWciLCJkb2NFbGVtIiwiZG9jdW1lbnRFbGVtZW50IiwiRGF0ZSIsInN1cHBvcnRQaWN0dXJlIiwiSFRNTFBpY3R1cmVFbGVtZW50IiwiX2FkZEV2ZW50TGlzdGVuZXIiLCJfZ2V0QXR0cmlidXRlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldFRpbWVvdXQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyZXF1ZXN0SWRsZUNhbGxiYWNrIiwicmVnUGljdHVyZSIsImxvYWRFdmVudHMiLCJyZWdDbGFzc0NhY2hlIiwiZm9yRWFjaCIsIkFycmF5IiwicHJvdG90eXBlIiwiaGFzQ2xhc3MiLCJlbGUiLCJjbHMiLCJSZWdFeHAiLCJ0ZXN0IiwiYWRkQ2xhc3MiLCJzZXRBdHRyaWJ1dGUiLCJ0cmltIiwicmVtb3ZlQ2xhc3MiLCJyZWciLCJyZXBsYWNlIiwiYWRkUmVtb3ZlTG9hZEV2ZW50cyIsImRvbSIsImZuIiwiYWRkIiwiYWN0aW9uIiwiZXZ0IiwidHJpZ2dlckV2ZW50IiwiZWxlbSIsIm5hbWUiLCJkZXRhaWwiLCJub0J1YmJsZXMiLCJub0NhbmNlbGFibGUiLCJldmVudCIsImNyZWF0ZUV2ZW50IiwiaW5zdGFuY2UiLCJpbml0Q3VzdG9tRXZlbnQiLCJkaXNwYXRjaEV2ZW50IiwidXBkYXRlUG9seWZpbGwiLCJlbCIsImZ1bGwiLCJwb2x5ZmlsbCIsInBpY3R1cmVmaWxsIiwicGYiLCJyZWV2YWx1YXRlIiwiZWxlbWVudHMiLCJzcmMiLCJnZXRDU1MiLCJzdHlsZSIsImdldENvbXB1dGVkU3R5bGUiLCJnZXRXaWR0aCIsInBhcmVudCIsIndpZHRoIiwib2Zmc2V0V2lkdGgiLCJtaW5TaXplIiwiX2xhenlzaXplc1dpZHRoIiwicGFyZW50Tm9kZSIsInJBRiIsInJ1bm5pbmciLCJ3YWl0aW5nIiwiZmlyc3RGbnMiLCJzZWNvbmRGbnMiLCJmbnMiLCJydW4iLCJydW5GbnMiLCJsZW5ndGgiLCJzaGlmdCIsInJhZkJhdGNoIiwicXVldWUiLCJhcHBseSIsImFyZ3VtZW50cyIsInB1c2giLCJoaWRkZW4iLCJfbHNGbHVzaCIsInJBRkl0Iiwic2ltcGxlIiwidGhhdCIsImFyZ3MiLCJ0aHJvdHRsZSIsImxhc3RUaW1lIiwiZ0RlbGF5IiwidGhyb3R0bGVEZWxheSIsInJJQ1RpbWVvdXQiLCJyaWNUaW1lb3V0Iiwibm93IiwiaWRsZUNhbGxiYWNrIiwidGltZW91dCIsImlzUHJpb3JpdHkiLCJkZWxheSIsImRlYm91bmNlIiwiZnVuYyIsInRpbWVzdGFtcCIsIndhaXQiLCJsYXRlciIsImxhc3QiLCJwcm9wIiwibGF6eVNpemVzRGVmYXVsdHMiLCJsYXp5Q2xhc3MiLCJsb2FkZWRDbGFzcyIsImxvYWRpbmdDbGFzcyIsInByZWxvYWRDbGFzcyIsImVycm9yQ2xhc3MiLCJhdXRvc2l6ZXNDbGFzcyIsInNyY0F0dHIiLCJzcmNzZXRBdHRyIiwic2l6ZXNBdHRyIiwiY3VzdG9tTWVkaWEiLCJpbml0IiwiZXhwRmFjdG9yIiwiaEZhYyIsImxvYWRNb2RlIiwibG9hZEhpZGRlbiIsImxhenlzaXplc0NvbmZpZyIsImxvYWRlciIsInByZWxvYWRFbGVtcyIsImlzQ29tcGxldGVkIiwicmVzZXRQcmVsb2FkaW5nVGltZXIiLCJzdGFydGVkIiwiZUx2VyIsImVsdkgiLCJlTHRvcCIsImVMbGVmdCIsImVMcmlnaHQiLCJlTGJvdHRvbSIsImRlZmF1bHRFeHBhbmQiLCJwcmVsb2FkRXhwYW5kIiwicmVnSW1nIiwicmVnSWZyYW1lIiwic3VwcG9ydFNjcm9sbCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsInNocmlua0V4cGFuZCIsImN1cnJlbnRFeHBhbmQiLCJpc0xvYWRpbmciLCJsb3dSdW5zIiwicmVzZXRQcmVsb2FkaW5nIiwiZSIsInRhcmdldCIsImlzTmVzdGVkVmlzaWJsZSIsImVsZW1FeHBhbmQiLCJvdXRlclJlY3QiLCJ2aXNpYmxlIiwiYm9keSIsIm9mZnNldFBhcmVudCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImxlZnQiLCJyaWdodCIsInRvcCIsImJvdHRvbSIsImNoZWNrRWxlbWVudHMiLCJlTGxlbiIsImkiLCJyZWN0IiwiYXV0b0xvYWRFbGVtIiwibG9hZGVkU29tZXRoaW5nIiwiZWxlbU5lZ2F0aXZlRXhwYW5kIiwiZWxlbUV4cGFuZFZhbCIsImJlZm9yZUV4cGFuZFZhbCIsImxhenlsb2FkRWxlbXMiLCJleHBhbmQiLCJjbGllbnRIZWlnaHQiLCJjbGllbnRXaWR0aCIsIl9sYXp5UmFjZSIsInVudmVpbEVsZW1lbnQiLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJwcmVsb2FkQWZ0ZXJMb2FkIiwidGhyb3R0bGVkQ2hlY2tFbGVtZW50cyIsInN3aXRjaExvYWRpbmdDbGFzcyIsInJhZlN3aXRjaExvYWRpbmdDbGFzcyIsInJhZmVkU3dpdGNoTG9hZGluZ0NsYXNzIiwiY2hhbmdlSWZyYW1lU3JjIiwiY29udGVudFdpbmRvdyIsImxvY2F0aW9uIiwiaGFuZGxlU291cmNlcyIsInNvdXJjZSIsInNvdXJjZVNyY3NldCIsImxhenlVbnZlaWwiLCJpc0F1dG8iLCJzaXplcyIsImlzSW1nIiwic3Jjc2V0IiwiaXNQaWN0dXJlIiwiZmlyZXNMb2FkIiwiZGVmYXVsdFByZXZlbnRlZCIsIm5vZGVOYW1lIiwiY2xlYXJUaW1lb3V0IiwiY2FsbCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiY29tcGxldGUiLCJuYXR1cmFsV2lkdGgiLCJhdXRvU2l6ZXIiLCJ1cGRhdGVFbGVtIiwib25sb2FkIiwiYWZ0ZXJTY3JvbGwiLCJfIiwiTXV0YXRpb25PYnNlcnZlciIsIm9ic2VydmUiLCJjaGlsZExpc3QiLCJzdWJ0cmVlIiwiYXR0cmlidXRlcyIsInNldEludGVydmFsIiwicmVhZHlTdGF0ZSIsImNoZWNrRWxlbXMiLCJ1bnZlaWwiLCJhdXRvc2l6ZXNFbGVtcyIsInNpemVFbGVtZW50Iiwic291cmNlcyIsImxlbiIsImRhdGFBdHRyIiwiZ2V0U2l6ZUVsZW1lbnQiLCJ1cGRhdGVFbGVtZW50c1NpemVzIiwiZGVib3VuY2VkVXBkYXRlRWxlbWVudHNTaXplcyIsImNmZyIsInVQIiwiYUMiLCJyQyIsImhDIiwiZmlyZSIsImdXIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUMsV0FBU0EsTUFBVCxFQUFpQkMsT0FBakIsRUFBMEI7QUFDMUIsS0FBSUMsWUFBWUQsUUFBUUQsTUFBUixFQUFnQkEsT0FBT0csUUFBdkIsQ0FBaEI7QUFDQUgsUUFBT0UsU0FBUCxHQUFtQkEsU0FBbkI7QUFDQSxLQUFHLFFBQU9FLE1BQVAseUNBQU9BLE1BQVAsTUFBaUIsUUFBakIsSUFBNkJBLE9BQU9DLE9BQXZDLEVBQStDO0FBQzlDRCxTQUFPQyxPQUFQLEdBQWlCSCxTQUFqQjtBQUNBO0FBQ0QsQ0FOQSxFQU1DRixNQU5ELEVBTVMsU0FBU00sQ0FBVCxDQUFXTixNQUFYLEVBQW1CRyxRQUFuQixFQUE2QjtBQUN0QztBQUNBOztBQUNBLEtBQUcsQ0FBQ0EsU0FBU0ksc0JBQWIsRUFBb0M7QUFBQztBQUFROztBQUU3QyxLQUFJQyxTQUFKLEVBQWVDLGVBQWY7O0FBRUEsS0FBSUMsVUFBVVAsU0FBU1EsZUFBdkI7O0FBRUEsS0FBSUMsT0FBT1osT0FBT1ksSUFBbEI7O0FBRUEsS0FBSUMsaUJBQWlCYixPQUFPYyxrQkFBNUI7O0FBRUEsS0FBSUMsb0JBQW9CLGtCQUF4Qjs7QUFFQSxLQUFJQyxnQkFBZ0IsY0FBcEI7O0FBRUEsS0FBSUMsbUJBQW1CakIsT0FBT2UsaUJBQVAsQ0FBdkI7O0FBRUEsS0FBSUcsYUFBYWxCLE9BQU9rQixVQUF4Qjs7QUFFQSxLQUFJQyx3QkFBd0JuQixPQUFPbUIscUJBQVAsSUFBZ0NELFVBQTVEOztBQUVBLEtBQUlFLHNCQUFzQnBCLE9BQU9vQixtQkFBakM7O0FBRUEsS0FBSUMsYUFBYSxZQUFqQjs7QUFFQSxL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LGFBQVk7QUFDWDhOLE9BQUs3TixlQURNO0FBRVh1TSxhQUFXQSxTQUZBO0FBR1g5RSxVQUFRQSxNQUhHO0FBSVhOLFFBQU1BLElBSks7QUFLWDJHLE1BQUloTCxjQUxPO0FBTVhpTCxNQUFJeE0sUUFOTztBQU9YeU0sTUFBSXRNLFdBUE87QUFRWHVNLE1BQUkvTSxRQVJPO0FBU1hnTixRQUFNL0wsWUFUSztBQVVYZ00sTUFBSXpLLFFBVk87QUFXWE8sT0FBS0E7QUFYTSxFQUFaOztBQWNBLFFBQU9sRSxTQUFQO0FBQ0EsQ0F4ckJBLENBQUQiLCJmaWxlIjoibGF6eXNpemVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKHdpbmRvdywgZmFjdG9yeSkge1xuXHR2YXIgbGF6eVNpemVzID0gZmFjdG9yeSh3aW5kb3csIHdpbmRvdy5kb2N1bWVudCk7XG5cdHdpbmRvdy5sYXp5U2l6ZXMgPSBsYXp5U2l6ZXM7XG5cdGlmKHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpe1xuXHRcdG1vZHVsZS5leHBvcnRzID0gbGF6eVNpemVzO1xuXHR9XG59KHdpbmRvdywgZnVuY3Rpb24gbCh3aW5kb3csIGRvY3VtZW50KSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0Lypqc2hpbnQgZXFudWxsOnRydWUgKi9cblx0aWYoIWRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUpe3JldHVybjt9XG5cblx0dmFyIGxhenlzaXplcywgbGF6eVNpemVzQ29uZmlnO1xuXG5cdHZhciBkb2NFbGVtID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG5cdHZhciBEYXRlID0gd2luZG93LkRhdGU7XG5cblx0dmFyIHN1cHBvcnRQaWN0dXJlID0gd2luZG93LkhUTUxQaWN0dXJlRWxlbWVudDtcblxuXHR2YXIgX2FkZEV2ZW50TGlzdGVuZXIgPSAnYWRkRXZlbnRMaXN0ZW5lcic7XG5cblx0dmFyIF9nZXRBdHRyaWJ1dGUgPSAnZ2V0QXR0cmlidXRlJztcblxuXHR2YXIgYWRkRXZlbnRMaXN0ZW5lciA9IHdpbmRvd1tfYWRkRXZlbnRMaXN0ZW5lcl07XG5cblx0dmFyIHNldFRpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dDtcblxuXHR2YXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBzZXRUaW1lb3V0O1xuXG5cdHZhciByZXF1ZXN0SWRsZUNhbGxiYWNrID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2s7XG5cblx0dmFyIHJlZ1BpY3R1cmUgPSAvXnBpY3R1cmUkL2k7XG5cblx0dmFyIGxvYWRFdmVudHMgPSBbJ2xvYWQnLCAnZXJyb3InLCAnbGF6eWluY2x1ZGVkJywgJ19sYXp5bG9hZGVkJ107XG5cblx0dmFyIHJlZ0NsYXNzQ2FjaGUgPSB7fTtcblxuXHR2YXIgZm9yRWFjaCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xuXG5cdHZhciBoYXNDbGFzcyA9IGZ1bmN0aW9uKGVsZSwgY2xzKSB7XG5cdFx0aWYoIXJlZ0NsYXNzQ2FjaGVbY2xzXSl7XG5cdFx0XHRyZWdDbGFzc0NhY2hlW2Nsc10gPSBuZXcgUmVnRXhwKCcoXFxcXHN8XiknK2NscysnKFxcXFxzfCQpJyk7XG5cdFx0fVxuXHRcdHJldHVybiByZWdDbGFzc0NhY2hlW2Nsc10udGVzdChlbGVbX2dldEF0dHJpYnV0ZV0oJ2NsYXNzJykgfHwgJycpICYmIHJlZ0NsYXNzQ2FjaGVbY2xzXTtcblx0fTtcblxuXHR2YXIgYWRkQ2xhc3MgPSBmdW5jdGlvbihlbGUsIGNscykge1xuXHRcdGlmICghaGFzQ2xhc3MoZWxlLCBjbHMpKXtcblx0XHRcdGVsZS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgKGVsZVtfZ2V0QXR0cmlidXRlXSgnY2xhc3MnKSB8fCAnJykudHJpbSgpICsgJyAnICsgY2xzKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIHJlbW92ZUNsYXNzID0gZnVuY3Rpb24oZWxlLCBjbHMpIHtcblx0XHR2YXIgcmVnO1xuXHRcdGlmICgocmVnID0gaGFzQ2xhc3MoZWxlLGNscykpKSB7XG5cdFx0XHRlbGUuc2V0QXR0cmlidXRlKCdjbGFzcycsIChlbGVbX2dldEF0dHJpYnV0ZV0oJ2NsYXNzJykgfHwgJycpLnJlcGxhY2UocmVnLCAnICcpKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIGFkZFJlbW92ZUxvYWRFdmVudHMgPSBmdW5jdGlvbihkb20sIGZuLCBhZGQpe1xuXHRcdHZhciBhY3Rpb24gPSBhZGQgPyBfYWRkRXZlbnRMaXN0ZW5lciA6ICdyZW1vdmVFdmVudExpc3RlbmVyJztcblx0XHRpZihhZGQpe1xuXHRcdFx0YWRkUmVtb3ZlTG9hZEV2ZW50cyhkb20sIGZuKTtcblx0XHR9XG5cdFx0bG9hZEV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGV2dCl7XG5cdFx0XHRkb21bYWN0aW9uXShldnQsIGZuKTtcblx0XHR9KTtcblx0fTtcblxuXHR2YXIgdHJpZ2dlckV2ZW50ID0gZnVuY3Rpb24oZWxlbSwgbmFtZSwgZGV0YWlsLCBub0J1YmJsZXMsIG5vQ2FuY2VsYWJsZSl7XG5cdFx0dmFyIGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG5cblx0XHRpZighZGV0YWlsKXtcblx0XHRcdGRldGFpbCA9IHt9O1xuXHRcdH1cblxuXHRcdGRldGFpbC5pbnN0YW5jZSA9IGxhenlzaXplcztcblxuXHRcdGV2ZW50LmluaXRDdXN0b21FdmVudChuYW1lLCAhbm9CdWJibGVzLCAhbm9DYW5jZWxhYmxlLCBkZXRhaWwpO1xuXG5cdFx0ZWxlbS5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcblx0XHRyZXR1cm4gZXZlbnQ7XG5cdH07XG5cblx0dmFyIHVwZGF0ZVBvbHlmaWxsID0gZnVuY3Rpb24gKGVsLCBmdWxsKXtcblx0XHR2YXIgcG9seWZpbGw7XG5cdFx0aWYoICFzdXBwb3J0UGljdHVyZSAmJiAoIHBvbHlmaWxsID0gKHdpbmRvdy5waWN0dXJlZmlsbCB8fCBsYXp5U2l6ZXNDb25maWcucGYpICkgKXtcblx0XHRcdHBvbHlmaWxsKHtyZWV2YWx1YXRlOiB0cnVlLCBlbGVtZW50czogW2VsXX0pO1xuXHRcdH0gZWxzZSBpZihmdWxsICYmIGZ1bGwuc3JjKXtcblx0XHRcdGVsLnNyYyA9IGZ1bGwuc3JjO1xuXHRcdH1cblx0fTtcblxuXHR2YXIgZ2V0Q1NTID0gZnVuY3Rpb24gKGVsZW0sIHN0eWxlKXtcblx0XHRyZXR1cm4gKGdldENvbXB1dGVkU3R5bGUoZWxlbSwgbnVsbCkgfHwge30pW3N0eWxlXTtcblx0fTtcblxuXHR2YXIgZ2V0V2lkdGggPSBmdW5jdGlvbihlbGVtLCBwYXJlbnQsIHdpZHRoKXtcblx0XHR3aWR0aCA9IHdpZHRoIHx8IGVsZW0ub2Zmc2V0V2lkdGg7XG5cblx0XHR3aGlsZSh3aWR0aCA8IGxhenlTaXplc0NvbmZpZy5taW5TaXplICYmIHBhcmVudCAmJiAhZWxlbS5fbGF6eXNpemVzV2lkdGgpe1xuXHRcdFx0d2lkdGggPSAgcGFyZW50Lm9mZnNldFdpZHRoO1xuXHRcdFx0cGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHdpZHRoO1xuXHR9O1xuXG5cdHZhciByQUYgPSAoZnVuY3Rpb24oKXtcblx0XHR2YXIgcnVubmluZywgd2FpdGluZztcblx0XHR2YXIgZmlyc3RGbnMgPSBbXTtcblx0XHR2YXIgc2Vjb25kRm5zID0gW107XG5cdFx0dmFyIGZucyA9IGZpcnN0Rm5zO1xuXG5cdFx0dmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgcnVuRm5zID0gZm5zO1xuXG5cdFx0XHRmbnMgPSBmaXJzdEZucy5sZW5ndGggPyBzZWNvbmRGbnMgOiBmaXJzdEZucztcblxuXHRcdFx0cnVubmluZyA9IHRydWU7XG5cdFx0XHR3YWl0aW5nID0gZmFsc2U7XG5cblx0XHRcdHdoaWxlKHJ1bkZucy5sZW5ndGgpe1xuXHRcdFx0XHRydW5GbnMuc2hpZnQoKSgpO1xuXHRcdFx0fVxuXG5cdFx0XHRydW5uaW5nID0gZmFsc2U7XG5cdFx0fTtcblxuXHRcdHZhciByYWZCYXRjaCA9IGZ1bmN0aW9uKGZuLCBxdWV1ZSl7XG5cdFx0XHRpZihydW5uaW5nICYmICFxdWV1ZSl7XG5cdFx0XHRcdGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmbnMucHVzaChmbik7XG5cblx0XHRcdFx0aWYoIXdhaXRpbmcpe1xuXHRcdFx0XHRcdHdhaXRpbmcgPSB0cnVlO1xuXHRcdFx0XHRcdChkb2N1bWVudC5oaWRkZW4gPyBzZXRUaW1lb3V0IDogcmVxdWVzdEFuaW1hdGlvbkZyYW1lKShydW4pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJhZkJhdGNoLl9sc0ZsdXNoID0gcnVuO1xuXG5cdFx0cmV0dXJuIHJhZkJhdGNoO1xuXHR9KSgpO1xuXG5cdHZhciByQUZJdCA9IGZ1bmN0aW9uKGZuLCBzaW1wbGUpe1xuXHRcdHJldHVybiBzaW1wbGUgP1xuXHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJBRihmbik7XG5cdFx0XHR9IDpcblx0XHRcdGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHM7XG5cdFx0XHRcdHJBRihmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHQ7XG5cdH07XG5cblx0dmFyIHRocm90dGxlID0gZnVuY3Rpb24oZm4pe1xuXHRcdHZhciBydW5uaW5nO1xuXHRcdHZhciBsYXN0VGltZSA9IDA7XG5cdFx0dmFyIGdEZWxheSA9IGxhenlTaXplc0NvbmZpZy50aHJvdHRsZURlbGF5O1xuXHRcdHZhciBySUNUaW1lb3V0ID0gbGF6eVNpemVzQ29uZmlnLnJpY1RpbWVvdXQ7XG5cdFx0dmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRydW5uaW5nID0gZmFsc2U7XG5cdFx0XHRsYXN0VGltZSA9IERhdGUubm93KCk7XG5cdFx0XHRmbigpO1xuXHRcdH07XG5cdFx0dmFyIGlkbGVDYWxsYmFjayA9IHJlcXVlc3RJZGxlQ2FsbGJhY2sgJiYgcklDVGltZW91dCA+IDQ5ID9cblx0XHRcdGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJlcXVlc3RJZGxlQ2FsbGJhY2socnVuLCB7dGltZW91dDogcklDVGltZW91dH0pO1xuXG5cdFx0XHRcdGlmKHJJQ1RpbWVvdXQgIT09IGxhenlTaXplc0NvbmZpZy5yaWNUaW1lb3V0KXtcblx0XHRcdFx0XHRySUNUaW1lb3V0ID0gbGF6eVNpemVzQ29uZmlnLnJpY1RpbWVvdXQ7XG5cdFx0XHRcdH1cblx0XHRcdH0gOlxuXHRcdFx0ckFGSXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0c2V0VGltZW91dChydW4pO1xuXHRcdFx0fSwgdHJ1ZSlcblx0XHQ7XG5cblx0XHRyZXR1cm4gZnVuY3Rpb24oaXNQcmlvcml0eSl7XG5cdFx0XHR2YXIgZGVsYXk7XG5cblx0XHRcdGlmKChpc1ByaW9yaXR5ID0gaXNQcmlvcml0eSA9PT0gdHJ1ZSkpe1xuXHRcdFx0XHRySUNUaW1lb3V0ID0gMzM7XG5cdFx0XHR9XG5cblx0XHRcdGlmKHJ1bm5pbmcpe1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdHJ1bm5pbmcgPSAgdHJ1ZTtcblxuXHRcdFx0ZGVsYXkgPSBnRGVsYXkgLSAoRGF0ZS5ub3coKSAtIGxhc3RUaW1lKTtcblxuXHRcdFx0aWYoZGVsYXkgPCAwKXtcblx0XHRcdFx0ZGVsYXkgPSAwO1xuXHRcdFx0fVxuXG5cdFx0XHRpZihpc1ByaW9yaXR5IHx8IGRlbGF5IDwgOSl7XG5cdFx0XHRcdGlkbGVDYWxsYmFjaygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2V0VGltZW91dChpZGxlQ2FsbGJhY2ssIGRlbGF5KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9O1xuXG5cdC8vYmFzZWQgb24gaHR0cDovL21vZGVybmphdmFzY3JpcHQuYmxvZ3Nwb3QuZGUvMjAxMy8wOC9idWlsZGluZy1iZXR0ZXItZGVib3VuY2UuaHRtbFxuXHR2YXIgZGVib3VuY2UgPSBmdW5jdGlvbihmdW5jKSB7XG5cdFx0dmFyIHRpbWVvdXQsIHRpbWVzdGFtcDtcblx0XHR2YXIgd2FpdCA9IDk5O1xuXHRcdHZhciBydW4gPSBmdW5jdGlvbigpe1xuXHRcdFx0dGltZW91dCA9IG51bGw7XG5cdFx0XHRmdW5jKCk7XG5cdFx0fTtcblx0XHR2YXIgbGF0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBsYXN0ID0gRGF0ZS5ub3coKSAtIHRpbWVzdGFtcDtcblxuXHRcdFx0aWYgKGxhc3QgPCB3YWl0KSB7XG5cdFx0XHRcdHNldFRpbWVvdXQobGF0ZXIsIHdhaXQgLSBsYXN0KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdChyZXF1ZXN0SWRsZUNhbGxiYWNrIHx8IHJ1bikocnVuKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHRcdFx0dGltZXN0YW1wID0gRGF0ZS5ub3coKTtcblxuXHRcdFx0aWYgKCF0aW1lb3V0KSB7XG5cdFx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCB3YWl0KTtcblx0XHRcdH1cblx0XHR9O1xuXHR9O1xuXG5cdChmdW5jdGlvbigpe1xuXHRcdHZhciBwcm9wO1xuXG5cdFx0dmFyIGxhenlTaXplc0RlZmF1bHRzID0ge1xuXHRcdFx0bGF6eUNsYXNzOiAnbGF6eWxvYWQnLFxuXHRcdFx0bG9hZGVkQ2xhc3M6ICdsYXp5bG9hZGVkJyxcblx0XHRcdGxvYWRpbmdDbGFzczogJ2xhenlsb2FkaW5nJyxcblx0XHRcdHByZWxvYWRDbGFzczogJ2xhenlwcmVsb2FkJyxcblx0XHRcdGVycm9yQ2xhc3M6ICdsYXp5ZXJyb3InLFxuXHRcdFx0Ly9zdHJpY3RDbGFzczogJ2xhenlzdHJpY3QnLFxuXHRcdFx0YXV0b3NpemVzQ2xhc3M6ICdsYXp5YXV0b3NpemVzJyxcblx0XHRcdHNyY0F0dHI6ICdkYXRhLXNyYycsXG5cdFx0XHRzcmNzZXRBdHRyOiAnZGF0YS1zcmNzZXQnLFxuXHRcdFx0c2l6ZXNBdHRyOiAnZGF0YS1zaXplcycsXG5cdFx0XHQvL3ByZWxvYWRBZnRlckxvYWQ6IGZhbHNlLFxuXHRcdFx0bWluU2l6ZTogNDAsXG5cdFx0XHRjdXN0b21NZWRpYToge30sXG5cdFx0XHRpbml0OiB0cnVlLFxuXHRcdFx0ZXhwRmFjdG9yOiAxLjUsXG5cdFx0XHRoRmFjOiAwLjgsXG5cdFx0XHRsb2FkTW9kZTogMixcblx0XHRcdGxvYWRIaWRkZW46IHRydWUsXG5cdFx0XHRyaWNUaW1lb3V0OiAwLFxuXHRcdFx0dGhyb3R0bGVEZWxheTogMTI1LFxuXHRcdH07XG5cblx0XHRsYXp5U2l6ZXNDb25maWcgPSB3aW5kb3cubGF6eVNpemVzQ29uZmlnIHx8IHdpbmRvdy5sYXp5c2l6ZXNDb25maWcgfHwge307XG5cblx0XHRmb3IocHJvcCBpbiBsYXp5U2l6ZXNEZWZhdWx0cyl7XG5cdFx0XHRpZighKHByb3AgaW4gbGF6eVNpemVzQ29uZmlnKSl7XG5cdFx0XHRcdGxhenlTaXplc0NvbmZpZ1twcm9wXSA9IGxhenlTaXplc0RlZmF1bHRzW3Byb3BdO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHdpbmRvdy5sYXp5U2l6ZXNDb25maWcgPSBsYXp5U2l6ZXNDb25maWc7XG5cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRpZihsYXp5U2l6ZXNDb25maWcuaW5pdCl7XG5cdFx0XHRcdGluaXQoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSkoKTtcblxuXHR2YXIgbG9hZGVyID0gKGZ1bmN0aW9uKCl7XG5cdFx0dmFyIHByZWxvYWRFbGVtcywgaXNDb21wbGV0ZWQsIHJlc2V0UHJlbG9hZGluZ1RpbWVyLCBsb2FkTW9kZSwgc3RhcnRlZDtcblxuXHRcdHZhciBlTHZXLCBlbHZILCBlTHRvcCwgZUxsZWZ0LCBlTHJpZ2h0LCBlTGJvdHRvbTtcblxuXHRcdHZhciBkZWZhdWx0RXhwYW5kLCBwcmVsb2FkRXhwYW5kLCBoRmFjO1xuXG5cdFx0dmFyIHJlZ0ltZyA9IC9eaW1nJC9pO1xuXHRcdHZhciByZWdJZnJhbWUgPSAvXmlmcmFtZSQvaTtcblxuXHRcdHZhciBzdXBwb3J0U2Nyb2xsID0gKCdvbnNjcm9sbCcgaW4gd2luZG93KSAmJiAhKC9nbGVib3QvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpO1xuXG5cdFx0dmFyIHNocmlua0V4cGFuZCA9IDA7XG5cdFx0dmFyIGN1cnJlbnRFeHBhbmQgPSAwO1xuXG5cdFx0dmFyIGlzTG9hZGluZyA9IDA7XG5cdFx0dmFyIGxvd1J1bnMgPSAtMTtcblxuXHRcdHZhciByZXNldFByZWxvYWRpbmcgPSBmdW5jdGlvbihlKXtcblx0XHRcdGlzTG9hZGluZy0tO1xuXHRcdFx0aWYoZSAmJiBlLnRhcmdldCl7XG5cdFx0XHRcdGFkZFJlbW92ZUxvYWRFdmVudHMoZS50YXJnZXQsIHJlc2V0UHJlbG9hZGluZyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCFlIHx8IGlzTG9hZGluZyA8IDAgfHwgIWUudGFyZ2V0KXtcblx0XHRcdFx0aXNMb2FkaW5nID0gMDtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dmFyIGlzTmVzdGVkVmlzaWJsZSA9IGZ1bmN0aW9uKGVsZW0sIGVsZW1FeHBhbmQpe1xuXHRcdFx0dmFyIG91dGVyUmVjdDtcblx0XHRcdHZhciBwYXJlbnQgPSBlbGVtO1xuXHRcdFx0dmFyIHZpc2libGUgPSBnZXRDU1MoZG9jdW1lbnQuYm9keSwgJ3Zpc2liaWxpdHknKSA9PSAnaGlkZGVuJyB8fCBnZXRDU1MoZWxlbSwgJ3Zpc2liaWxpdHknKSAhPSAnaGlkZGVuJztcblxuXHRcdFx0ZUx0b3AgLT0gZWxlbUV4cGFuZDtcblx0XHRcdGVMYm90dG9tICs9IGVsZW1FeHBhbmQ7XG5cdFx0XHRlTGxlZnQgLT0gZWxlbUV4cGFuZDtcblx0XHRcdGVMcmlnaHQgKz0gZWxlbUV4cGFuZDtcblxuXHRcdFx0d2hpbGUodmlzaWJsZSAmJiAocGFyZW50ID0gcGFyZW50Lm9mZnNldFBhcmVudCkgJiYgcGFyZW50ICE9IGRvY3VtZW50LmJvZHkgJiYgcGFyZW50ICE9IGRvY0VsZW0pe1xuXHRcdFx0XHR2aXNpYmxlID0gKChnZXRDU1MocGFyZW50LCAnb3BhY2l0eScpIHx8IDEpID4gMCk7XG5cblx0XHRcdFx0aWYodmlzaWJsZSAmJiBnZXRDU1MocGFyZW50LCAnb3ZlcmZsb3cnKSAhPSAndmlzaWJsZScpe1xuXHRcdFx0XHRcdG91dGVyUmVjdCA9IHBhcmVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHRcdFx0XHR2aXNpYmxlID0gZUxyaWdodCA+IG91dGVyUmVjdC5sZWZ0ICYmXG5cdFx0XHRcdFx0XHRlTGxlZnQgPCBvdXRlclJlY3QucmlnaHQgJiZcblx0XHRcdFx0XHRcdGVMYm90dG9tID4gb3V0ZXJSZWN0LnRvcCAtIDEgJiZcblx0XHRcdFx0XHRcdGVMdG9wIDwgb3V0ZXJSZWN0LmJvdHRvbSArIDFcblx0XHRcdFx0XHQ7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHZpc2libGU7XG5cdFx0fTtcblxuXHRcdHZhciBjaGVja0VsZW1lbnRzID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZUxsZW4sIGksIHJlY3QsIGF1dG9Mb2FkRWxlbSwgbG9hZGVkU29tZXRoaW5nLCBlbGVtRXhwYW5kLCBlbGVtTmVnYXRpdmVFeHBhbmQsIGVsZW1FeHBhbmRWYWwsIGJlZm9yZUV4cGFuZFZhbDtcblxuXHRcdFx0dmFyIGxhenlsb2FkRWxlbXMgPSBsYXp5c2l6ZXMuZWxlbWVudHM7XG5cblx0XHRcdGlmKChsb2FkTW9kZSA9IGxhenlTaXplc0NvbmZpZy5sb2FkTW9kZSkgJiYgaXNMb2FkaW5nIDwgOCAmJiAoZUxsZW4gPSBsYXp5bG9hZEVsZW1zLmxlbmd0aCkpe1xuXG5cdFx0XHRcdGkgPSAwO1xuXG5cdFx0XHRcdGxvd1J1bnMrKztcblxuXHRcdFx0XHRpZihwcmVsb2FkRXhwYW5kID09IG51bGwpe1xuXHRcdFx0XHRcdGlmKCEoJ2V4cGFuZCcgaW4gbGF6eVNpemVzQ29uZmlnKSl7XG5cdFx0XHRcdFx0XHRsYXp5U2l6ZXNDb25maWcuZXhwYW5kID0gZG9jRWxlbS5jbGllbnRIZWlnaHQgPiA1MDAgJiYgZG9jRWxlbS5jbGllbnRXaWR0aCA+IDUwMCA/IDUwMCA6IDM3MDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRkZWZhdWx0RXhwYW5kID0gbGF6eVNpemVzQ29uZmlnLmV4cGFuZDtcblx0XHRcdFx0XHRwcmVsb2FkRXhwYW5kID0gZGVmYXVsdEV4cGFuZCAqIGxhenlTaXplc0NvbmZpZy5leHBGYWN0b3I7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZihjdXJyZW50RXhwYW5kIDwgcHJlbG9hZEV4cGFuZCAmJiBpc0xvYWRpbmcgPCAxICYmIGxvd1J1bnMgPiAyICYmIGxvYWRNb2RlID4gMiAmJiAhZG9jdW1lbnQuaGlkZGVuKXtcblx0XHRcdFx0XHRjdXJyZW50RXhwYW5kID0gcHJlbG9hZEV4cGFuZDtcblx0XHRcdFx0XHRsb3dSdW5zID0gMDtcblx0XHRcdFx0fSBlbHNlIGlmKGxvYWRNb2RlID4gMSAmJiBsb3dSdW5zID4gMSAmJiBpc0xvYWRpbmcgPCA2KXtcblx0XHRcdFx0XHRjdXJyZW50RXhwYW5kID0gZGVmYXVsdEV4cGFuZDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjdXJyZW50RXhwYW5kID0gc2hyaW5rRXhwYW5kO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Zm9yKDsgaSA8IGVMbGVuOyBpKyspe1xuXG5cdFx0XHRcdFx0aWYoIWxhenlsb2FkRWxlbXNbaV0gfHwgbGF6eWxvYWRFbGVtc1tpXS5fbGF6eVJhY2Upe2NvbnRpbnVlO31cblxuXHRcdFx0XHRcdGlmKCFzdXBwb3J0U2Nyb2xsKXt1bnZlaWxFbGVtZW50KGxhenlsb2FkRWxlbXNbaV0pO2NvbnRpbnVlO31cblxuXHRcdFx0XHRcdGlmKCEoZWxlbUV4cGFuZFZhbCA9IGxhenlsb2FkRWxlbXNbaV1bX2dldEF0dHJpYnV0ZV0oJ2RhdGEtZXhwYW5kJykpIHx8ICEoZWxlbUV4cGFuZCA9IGVsZW1FeHBhbmRWYWwgKiAxKSl7XG5cdFx0XHRcdFx0XHRlbGVtRXhwYW5kID0gY3VycmVudEV4cGFuZDtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZihiZWZvcmVFeHBhbmRWYWwgIT09IGVsZW1FeHBhbmQpe1xuXHRcdFx0XHRcdFx0ZUx2VyA9IGlubmVyV2lkdGggKyAoZWxlbUV4cGFuZCAqIGhGYWMpO1xuXHRcdFx0XHRcdFx0ZWx2SCA9IGlubmVySGVpZ2h0ICsgZWxlbUV4cGFuZDtcblx0XHRcdFx0XHRcdGVsZW1OZWdhdGl2ZUV4cGFuZCA9IGVsZW1FeHBhbmQgKiAtMTtcblx0XHRcdFx0XHRcdGJlZm9yZUV4cGFuZFZhbCA9IGVsZW1FeHBhbmQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmVjdCA9IGxhenlsb2FkRWxlbXNbaV0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cblx0XHRcdFx0XHRpZiAoKGVMYm90dG9tID0gcmVjdC5ib3R0b20pID49IGVsZW1OZWdhdGl2ZUV4cGFuZCAmJlxuXHRcdFx0XHRcdFx0KGVMdG9wID0gcmVjdC50b3ApIDw9IGVsdkggJiZcblx0XHRcdFx0XHRcdChlTHJpZ2h0ID0gcmVjdC5yaWdodCkgPj0gZWxlbU5lZ2F0aXZlRXhwYW5kICogaEZhYyAmJlxuXHRcdFx0XHRcdFx0KGVMbGVmdCA9IHJlY3QubGVmdCkgPD0gZUx2VyAmJlxuXHRcdFx0XHRcdFx0KGVMYm90dG9tIHx8IGVMcmlnaHQgfHwgZUxsZWZ0IHx8IGVMdG9wKSAmJlxuXHRcdFx0XHRcdFx0KGxhenlTaXplc0NvbmZpZy5sb2FkSGlkZGVuIHx8IGdldENTUyhsYXp5bG9hZEVsZW1zW2ldLCAndmlzaWJpbGl0eScpICE9ICdoaWRkZW4nKSAmJlxuXHRcdFx0XHRcdFx0KChpc0NvbXBsZXRlZCAmJiBpc0xvYWRpbmcgPCAzICYmICFlbGVtRXhwYW5kVmFsICYmIChsb2FkTW9kZSA8IDMgfHwgbG93UnVucyA8IDQpKSB8fCBpc05lc3RlZFZpc2libGUobGF6eWxvYWRFbGVtc1tpXSwgZWxlbUV4cGFuZCkpKXtcblx0XHRcdFx0XHRcdHVudmVpbEVsZW1lbnQobGF6eWxvYWRFbGVtc1tpXSk7XG5cdFx0XHRcdFx0XHRsb2FkZWRTb21ldGhpbmcgPSB0cnVlO1xuXHRcdFx0XHRcdFx0aWYoaXNMb2FkaW5nID4gOSl7YnJlYWs7fVxuXHRcdFx0XHRcdH0gZWxzZSBpZighbG9hZGVkU29tZXRoaW5nICYmIGlzQ29tcGxldGVkICYmICFhdXRvTG9hZEVsZW0gJiZcblx0XHRcdFx0XHRcdGlzTG9hZGluZyA8IDQgJiYgbG93UnVucyA8IDQgJiYgbG9hZE1vZGUgPiAyICYmXG5cdFx0XHRcdFx0XHQocHJlbG9hZEVsZW1zWzBdIHx8IGxhenlTaXplc0NvbmZpZy5wcmVsb2FkQWZ0ZXJMb2FkKSAmJlxuXHRcdFx0XHRcdFx0KHByZWxvYWRFbGVtc1swXSB8fCAoIWVsZW1FeHBhbmRWYWwgJiYgKChlTGJvdHRvbSB8fCBlTHJpZ2h0IHx8IGVMbGVmdCB8fCBlTHRvcCkgfHwgbGF6eWxvYWRFbGVtc1tpXVtfZ2V0QXR0cmlidXRlXShsYXp5U2l6ZXNDb25maWcuc2l6ZXNBdHRyKSAhPSAnYXV0bycpKSkpe1xuXHRcdFx0XHRcdFx0YXV0b0xvYWRFbGVtID0gcHJlbG9hZEVsZW1zWzBdIHx8IGxhenlsb2FkRWxlbXNbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoYXV0b0xvYWRFbGVtICYmICFsb2FkZWRTb21ldGhpbmcpe1xuXHRcdFx0XHRcdHVudmVpbEVsZW1lbnQoYXV0b0xvYWRFbGVtKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR2YXIgdGhyb3R0bGVkQ2hlY2tFbGVtZW50cyA9IHRocm90dGxlKGNoZWNrRWxlbWVudHMpO1xuXG5cdFx0dmFyIHN3aXRjaExvYWRpbmdDbGFzcyA9IGZ1bmN0aW9uKGUpe1xuXHRcdFx0YWRkQ2xhc3MoZS50YXJnZXQsIGxhenlTaXplc0NvbmZpZy5sb2FkZWRDbGFzcyk7XG5cdFx0XHRyZW1vdmVDbGFzcyhlLnRhcmdldCwgbGF6eVNpemVzQ29uZmlnLmxvYWRpbmdDbGFzcyk7XG5cdFx0XHRhZGRSZW1vdmVMb2FkRXZlbnRzKGUudGFyZ2V0LCByYWZTd2l0Y2hMb2FkaW5nQ2xhc3MpO1xuXHRcdFx0dHJpZ2dlckV2ZW50KGUudGFyZ2V0LCAnbGF6eWxvYWRlZCcpO1xuXHRcdH07XG5cdFx0dmFyIHJhZmVkU3dpdGNoTG9hZGluZ0NsYXNzID0gckFGSXQoc3dpdGNoTG9hZGluZ0NsYXNzKTtcblx0XHR2YXIgcmFmU3dpdGNoTG9hZGluZ0NsYXNzID0gZnVuY3Rpb24oZSl7XG5cdFx0XHRyYWZlZFN3aXRjaExvYWRpbmdDbGFzcyh7dGFyZ2V0OiBlLnRhcmdldH0pO1xuXHRcdH07XG5cblx0XHR2YXIgY2hhbmdlSWZyYW1lU3JjID0gZnVuY3Rpb24oZWxlbSwgc3JjKXtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGVsZW0uY29udGVudFdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKHNyYyk7XG5cdFx0XHR9IGNhdGNoKGUpe1xuXHRcdFx0XHRlbGVtLnNyYyA9IHNyYztcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dmFyIGhhbmRsZVNvdXJjZXMgPSBmdW5jdGlvbihzb3VyY2Upe1xuXHRcdFx0dmFyIGN1c3RvbU1lZGlhO1xuXG5cdFx0XHR2YXIgc291cmNlU3Jjc2V0ID0gc291cmNlW19nZXRBdHRyaWJ1dGVdKGxhenlTaXplc0NvbmZpZy5zcmNzZXRBdHRyKTtcblxuXHRcdFx0aWYoIChjdXN0b21NZWRpYSA9IGxhenlTaXplc0NvbmZpZy5jdXN0b21NZWRpYVtzb3VyY2VbX2dldEF0dHJpYnV0ZV0oJ2RhdGEtbWVkaWEnKSB8fCBzb3VyY2VbX2dldEF0dHJpYnV0ZV0oJ21lZGlhJyldKSApe1xuXHRcdFx0XHRzb3VyY2Uuc2V0QXR0cmlidXRlKCdtZWRpYScsIGN1c3RvbU1lZGlhKTtcblx0XHRcdH1cblxuXHRcdFx0aWYoc291cmNlU3Jjc2V0KXtcblx0XHRcdFx0c291cmNlLnNldEF0dHJpYnV0ZSgnc3Jjc2V0Jywgc291cmNlU3Jjc2V0KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0dmFyIGxhenlVbnZlaWwgPSByQUZJdChmdW5jdGlvbiAoZWxlbSwgZGV0YWlsLCBpc0F1dG8sIHNpemVzLCBpc0ltZyl7XG5cdFx0XHR2YXIgc3JjLCBzcmNzZXQsIHBhcmVudCwgaXNQaWN0dXJlLCBldmVudCwgZmlyZXNMb2FkO1xuXG5cdFx0XHRpZighKGV2ZW50ID0gdHJpZ2dlckV2ZW50KGVsZW0sICdsYXp5YmVmb3JldW52ZWlsJywgZGV0YWlsKSkuZGVmYXVsdFByZXZlbnRlZCl7XG5cblx0XHRcdFx0aWYoc2l6ZXMpe1xuXHRcdFx0XHRcdGlmKGlzQXV0byl7XG5cdFx0XHRcdFx0XHRhZGRDbGFzcyhlbGVtLCBsYXp5U2l6ZXNDb25maWcuYXV0b3NpemVzQ2xhc3MpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRlbGVtLnNldEF0dHJpYnV0ZSgnc2l6ZXMnLCBzaXplcyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0c3Jjc2V0ID0gZWxlbVtfZ2V0QXR0cmlidXRlXShsYXp5U2l6ZXNDb25maWcuc3Jjc2V0QXR0cik7XG5cdFx0XHRcdHNyYyA9IGVsZW1bX2dldEF0dHJpYnV0ZV0obGF6eVNpemVzQ29uZmlnLnNyY0F0dHIpO1xuXG5cdFx0XHRcdGlmKGlzSW1nKSB7XG5cdFx0XHRcdFx0cGFyZW50ID0gZWxlbS5wYXJlbnROb2RlO1xuXHRcdFx0XHRcdGlzUGljdHVyZSA9IHBhcmVudCAmJiByZWdQaWN0dXJlLnRlc3QocGFyZW50Lm5vZGVOYW1lIHx8ICcnKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGZpcmVzTG9hZCA9IGRldGFpbC5maXJlc0xvYWQgfHwgKCgnc3JjJyBpbiBlbGVtKSAmJiAoc3Jjc2V0IHx8IHNyYyB8fCBpc1BpY3R1cmUpKTtcblxuXHRcdFx0XHRldmVudCA9IHt0YXJnZXQ6IGVsZW19O1xuXG5cdFx0XHRcdGlmKGZpcmVzTG9hZCl7XG5cdFx0XHRcdFx0YWRkUmVtb3ZlTG9hZEV2ZW50cyhlbGVtLCByZXNldFByZWxvYWRpbmcsIHRydWUpO1xuXHRcdFx0XHRcdGNsZWFyVGltZW91dChyZXNldFByZWxvYWRpbmdUaW1lcik7XG5cdFx0XHRcdFx0cmVzZXRQcmVsb2FkaW5nVGltZXIgPSBzZXRUaW1lb3V0KHJlc2V0UHJlbG9hZGluZywgMjUwMCk7XG5cblx0XHRcdFx0XHRhZGRDbGFzcyhlbGVtLCBsYXp5U2l6ZXNDb25maWcubG9hZGluZ0NsYXNzKTtcblx0XHRcdFx0XHRhZGRSZW1vdmVMb2FkRXZlbnRzKGVsZW0sIHJhZlN3aXRjaExvYWRpbmdDbGFzcywgdHJ1ZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZihpc1BpY3R1cmUpe1xuXHRcdFx0XHRcdGZvckVhY2guY2FsbChwYXJlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NvdXJjZScpLCBoYW5kbGVTb3VyY2VzKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKHNyY3NldCl7XG5cdFx0XHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoJ3NyY3NldCcsIHNyY3NldCk7XG5cdFx0XHRcdH0gZWxzZSBpZihzcmMgJiYgIWlzUGljdHVyZSl7XG5cdFx0XHRcdFx0aWYocmVnSWZyYW1lLnRlc3QoZWxlbS5ub2RlTmFtZSkpe1xuXHRcdFx0XHRcdFx0Y2hhbmdlSWZyYW1lU3JjKGVsZW0sIHNyYyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGVsZW0uc3JjID0gc3JjO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKGlzSW1nICYmIChzcmNzZXQgfHwgaXNQaWN0dXJlKSl7XG5cdFx0XHRcdFx0dXBkYXRlUG9seWZpbGwoZWxlbSwge3NyYzogc3JjfSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYoZWxlbS5fbGF6eVJhY2Upe1xuXHRcdFx0XHRkZWxldGUgZWxlbS5fbGF6eVJhY2U7XG5cdFx0XHR9XG5cdFx0XHRyZW1vdmVDbGFzcyhlbGVtLCBsYXp5U2l6ZXNDb25maWcubGF6eUNsYXNzKTtcblxuXHRcdFx0ckFGKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmKCAhZmlyZXNMb2FkIHx8IChlbGVtLmNvbXBsZXRlICYmIGVsZW0ubmF0dXJhbFdpZHRoID4gMSkpe1xuXHRcdFx0XHRcdGlmKGZpcmVzTG9hZCl7XG5cdFx0XHRcdFx0XHRyZXNldFByZWxvYWRpbmcoZXZlbnQpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRpc0xvYWRpbmctLTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0c3dpdGNoTG9hZGluZ0NsYXNzKGV2ZW50KTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgdHJ1ZSk7XG5cdFx0fSk7XG5cblx0XHR2YXIgdW52ZWlsRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtKXtcblx0XHRcdHZhciBkZXRhaWw7XG5cblx0XHRcdHZhciBpc0ltZyA9IHJlZ0ltZy50ZXN0KGVsZW0ubm9kZU5hbWUpO1xuXG5cdFx0XHQvL2FsbG93IHVzaW5nIHNpemVzPVwiYXV0b1wiLCBidXQgZG9uJ3QgdXNlLiBpdCdzIGludmFsaWQuIFVzZSBkYXRhLXNpemVzPVwiYXV0b1wiIG9yIGEgdmFsaWQgdmFsdWUgZm9yIHNpemVzIGluc3RlYWQgKGkuZS46IHNpemVzPVwiODB2d1wiKVxuXHRcdFx0dmFyIHNpemVzID0gaXNJbWcgJiYgKGVsZW1bX2dldEF0dHJpYnV0ZV0obGF6eVNpemVzQ29uZmlnLnNpemVzQXR0cikgfHwgZWxlbVtfZ2V0QXR0cmlidXRlXSgnc2l6ZXMnKSk7XG5cdFx0XHR2YXIgaXNBdXRvID0gc2l6ZXMgPT0gJ2F1dG8nO1xuXG5cdFx0XHRpZiggKGlzQXV0byB8fCAhaXNDb21wbGV0ZWQpICYmIGlzSW1nICYmIChlbGVtW19nZXRBdHRyaWJ1dGVdKCdzcmMnKSB8fCBlbGVtLnNyY3NldCkgJiYgIWVsZW0uY29tcGxldGUgJiYgIWhhc0NsYXNzKGVsZW0sIGxhenlTaXplc0NvbmZpZy5lcnJvckNsYXNzKSAmJiBoYXNDbGFzcyhlbGVtLCBsYXp5U2l6ZXNDb25maWcubGF6eUNsYXNzKSl7cmV0dXJuO31cblxuXHRcdFx0ZGV0YWlsID0gdHJpZ2dlckV2ZW50KGVsZW0sICdsYXp5dW52ZWlscmVhZCcpLmRldGFpbDtcblxuXHRcdFx0aWYoaXNBdXRvKXtcblx0XHRcdFx0IGF1dG9TaXplci51cGRhdGVFbGVtKGVsZW0sIHRydWUsIGVsZW0ub2Zmc2V0V2lkdGgpO1xuXHRcdFx0fVxuXG5cdFx0XHRlbGVtLl9sYXp5UmFjZSA9IHRydWU7XG5cdFx0XHRpc0xvYWRpbmcrKztcblxuXHRcdFx0bGF6eVVudmVpbChlbGVtLCBkZXRhaWwsIGlzQXV0bywgc2l6ZXMsIGlzSW1nKTtcblx0XHR9O1xuXG5cdFx0dmFyIG9ubG9hZCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZihpc0NvbXBsZXRlZCl7cmV0dXJuO31cblx0XHRcdGlmKERhdGUubm93KCkgLSBzdGFydGVkIDwgOTk5KXtcblx0XHRcdFx0c2V0VGltZW91dChvbmxvYWQsIDk5OSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdHZhciBhZnRlclNjcm9sbCA9IGRlYm91bmNlKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGxhenlTaXplc0NvbmZpZy5sb2FkTW9kZSA9IDM7XG5cdFx0XHRcdHRocm90dGxlZENoZWNrRWxlbWVudHMoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpc0NvbXBsZXRlZCA9IHRydWU7XG5cblx0XHRcdGxhenlTaXplc0NvbmZpZy5sb2FkTW9kZSA9IDM7XG5cblx0XHRcdHRocm90dGxlZENoZWNrRWxlbWVudHMoKTtcblxuXHRcdFx0YWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYobGF6eVNpemVzQ29uZmlnLmxvYWRNb2RlID09IDMpe1xuXHRcdFx0XHRcdGxhenlTaXplc0NvbmZpZy5sb2FkTW9kZSA9IDI7XG5cdFx0XHRcdH1cblx0XHRcdFx0YWZ0ZXJTY3JvbGwoKTtcblx0XHRcdH0sIHRydWUpO1xuXHRcdH07XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0XzogZnVuY3Rpb24oKXtcblx0XHRcdFx0c3RhcnRlZCA9IERhdGUubm93KCk7XG5cblx0XHRcdFx0bGF6eXNpemVzLmVsZW1lbnRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShsYXp5U2l6ZXNDb25maWcubGF6eUNsYXNzKTtcblx0XHRcdFx0cHJlbG9hZEVsZW1zID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShsYXp5U2l6ZXNDb25maWcubGF6eUNsYXNzICsgJyAnICsgbGF6eVNpemVzQ29uZmlnLnByZWxvYWRDbGFzcyk7XG5cdFx0XHRcdGhGYWMgPSBsYXp5U2l6ZXNDb25maWcuaEZhYztcblxuXHRcdFx0XHRhZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aHJvdHRsZWRDaGVja0VsZW1lbnRzLCB0cnVlKTtcblxuXHRcdFx0XHRhZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aHJvdHRsZWRDaGVja0VsZW1lbnRzLCB0cnVlKTtcblxuXHRcdFx0XHRpZih3aW5kb3cuTXV0YXRpb25PYnNlcnZlcil7XG5cdFx0XHRcdFx0bmV3IE11dGF0aW9uT2JzZXJ2ZXIoIHRocm90dGxlZENoZWNrRWxlbWVudHMgKS5vYnNlcnZlKCBkb2NFbGVtLCB7Y2hpbGRMaXN0OiB0cnVlLCBzdWJ0cmVlOiB0cnVlLCBhdHRyaWJ1dGVzOiB0cnVlfSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGRvY0VsZW1bX2FkZEV2ZW50TGlzdGVuZXJdKCdET01Ob2RlSW5zZXJ0ZWQnLCB0aHJvdHRsZWRDaGVja0VsZW1lbnRzLCB0cnVlKTtcblx0XHRcdFx0XHRkb2NFbGVtW19hZGRFdmVudExpc3RlbmVyXSgnRE9NQXR0ck1vZGlmaWVkJywgdGhyb3R0bGVkQ2hlY2tFbGVtZW50cywgdHJ1ZSk7XG5cdFx0XHRcdFx0c2V0SW50ZXJ2YWwodGhyb3R0bGVkQ2hlY2tFbGVtZW50cywgOTk5KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLCB0aHJvdHRsZWRDaGVja0VsZW1lbnRzLCB0cnVlKTtcblxuXHRcdFx0XHQvLywgJ2Z1bGxzY3JlZW5jaGFuZ2UnXG5cdFx0XHRcdFsnZm9jdXMnLCAnbW91c2VvdmVyJywgJ2NsaWNrJywgJ2xvYWQnLCAndHJhbnNpdGlvbmVuZCcsICdhbmltYXRpb25lbmQnLCAnd2Via2l0QW5pbWF0aW9uRW5kJ10uZm9yRWFjaChmdW5jdGlvbihuYW1lKXtcblx0XHRcdFx0XHRkb2N1bWVudFtfYWRkRXZlbnRMaXN0ZW5lcl0obmFtZSwgdGhyb3R0bGVkQ2hlY2tFbGVtZW50cywgdHJ1ZSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdGlmKCgvZCR8XmMvLnRlc3QoZG9jdW1lbnQucmVhZHlTdGF0ZSkpKXtcblx0XHRcdFx0XHRvbmxvYWQoKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRhZGRFdmVudExpc3RlbmVyKCdsb2FkJywgb25sb2FkKTtcblx0XHRcdFx0XHRkb2N1bWVudFtfYWRkRXZlbnRMaXN0ZW5lcl0oJ0RPTUNvbnRlbnRMb2FkZWQnLCB0aHJvdHRsZWRDaGVja0VsZW1lbnRzKTtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KG9ubG9hZCwgMjAwMDApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYobGF6eXNpemVzLmVsZW1lbnRzLmxlbmd0aCl7XG5cdFx0XHRcdFx0Y2hlY2tFbGVtZW50cygpO1xuXHRcdFx0XHRcdHJBRi5fbHNGbHVzaCgpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRocm90dGxlZENoZWNrRWxlbWVudHMoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdGNoZWNrRWxlbXM6IHRocm90dGxlZENoZWNrRWxlbWVudHMsXG5cdFx0XHR1bnZlaWw6IHVudmVpbEVsZW1lbnRcblx0XHR9O1xuXHR9KSgpO1xuXG5cblx0dmFyIGF1dG9TaXplciA9IChmdW5jdGlvbigpe1xuXHRcdHZhciBhdXRvc2l6ZXNFbGVtcztcblxuXHRcdHZhciBzaXplRWxlbWVudCA9IHJBRkl0KGZ1bmN0aW9uKGVsZW0sIHBhcmVudCwgZXZlbnQsIHdpZHRoKXtcblx0XHRcdHZhciBzb3VyY2VzLCBpLCBsZW47XG5cdFx0XHRlbGVtLl9sYXp5c2l6ZXNXaWR0aCA9IHdpZHRoO1xuXHRcdFx0d2lkdGggKz0gJ3B4JztcblxuXHRcdFx0ZWxlbS5zZXRBdHRyaWJ1dGUoJ3NpemVzJywgd2lkdGgpO1xuXG5cdFx0XHRpZihyZWdQaWN0dXJlLnRlc3QocGFyZW50Lm5vZGVOYW1lIHx8ICcnKSl7XG5cdFx0XHRcdHNvdXJjZXMgPSBwYXJlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NvdXJjZScpO1xuXHRcdFx0XHRmb3IoaSA9IDAsIGxlbiA9IHNvdXJjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspe1xuXHRcdFx0XHRcdHNvdXJjZXNbaV0uc2V0QXR0cmlidXRlKCdzaXplcycsIHdpZHRoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZighZXZlbnQuZGV0YWlsLmRhdGFBdHRyKXtcblx0XHRcdFx0dXBkYXRlUG9seWZpbGwoZWxlbSwgZXZlbnQuZGV0YWlsKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR2YXIgZ2V0U2l6ZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbSwgZGF0YUF0dHIsIHdpZHRoKXtcblx0XHRcdHZhciBldmVudDtcblx0XHRcdHZhciBwYXJlbnQgPSBlbGVtLnBhcmVudE5vZGU7XG5cblx0XHRcdGlmKHBhcmVudCl7XG5cdFx0XHRcdHdpZHRoID0gZ2V0V2lkdGgoZWxlbSwgcGFyZW50LCB3aWR0aCk7XG5cdFx0XHRcdGV2ZW50ID0gdHJpZ2dlckV2ZW50KGVsZW0sICdsYXp5YmVmb3Jlc2l6ZXMnLCB7d2lkdGg6IHdpZHRoLCBkYXRhQXR0cjogISFkYXRhQXR0cn0pO1xuXG5cdFx0XHRcdGlmKCFldmVudC5kZWZhdWx0UHJldmVudGVkKXtcblx0XHRcdFx0XHR3aWR0aCA9IGV2ZW50LmRldGFpbC53aWR0aDtcblxuXHRcdFx0XHRcdGlmKHdpZHRoICYmIHdpZHRoICE9PSBlbGVtLl9sYXp5c2l6ZXNXaWR0aCl7XG5cdFx0XHRcdFx0XHRzaXplRWxlbWVudChlbGVtLCBwYXJlbnQsIGV2ZW50LCB3aWR0aCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHZhciB1cGRhdGVFbGVtZW50c1NpemVzID0gZnVuY3Rpb24oKXtcblx0XHRcdHZhciBpO1xuXHRcdFx0dmFyIGxlbiA9IGF1dG9zaXplc0VsZW1zLmxlbmd0aDtcblx0XHRcdGlmKGxlbil7XG5cdFx0XHRcdGkgPSAwO1xuXG5cdFx0XHRcdGZvcig7IGkgPCBsZW47IGkrKyl7XG5cdFx0XHRcdFx0Z2V0U2l6ZUVsZW1lbnQoYXV0b3NpemVzRWxlbXNbaV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHZhciBkZWJvdW5jZWRVcGRhdGVFbGVtZW50c1NpemVzID0gZGVib3VuY2UodXBkYXRlRWxlbWVudHNTaXplcyk7XG5cblx0XHRyZXR1cm4ge1xuXHRcdFx0XzogZnVuY3Rpb24oKXtcblx0XHRcdFx0YXV0b3NpemVzRWxlbXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGxhenlTaXplc0NvbmZpZy5hdXRvc2l6ZXNDbGFzcyk7XG5cdFx0XHRcdGFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGRlYm91bmNlZFVwZGF0ZUVsZW1lbnRzU2l6ZXMpO1xuXHRcdFx0fSxcblx0XHRcdGNoZWNrRWxlbXM6IGRlYm91bmNlZFVwZGF0ZUVsZW1lbnRzU2l6ZXMsXG5cdFx0XHR1cGRhdGVFbGVtOiBnZXRTaXplRWxlbWVudFxuXHRcdH07XG5cdH0pKCk7XG5cblx0dmFyIGluaXQgPSBmdW5jdGlvbigpe1xuXHRcdGlmKCFpbml0Lmkpe1xuXHRcdFx0aW5pdC5pID0gdHJ1ZTtcblx0XHRcdGF1dG9TaXplci5fKCk7XG5cdFx0XHRsb2FkZXIuXygpO1xuXHRcdH1cblx0fTtcblxuXHRsYXp5c2l6ZXMgPSB7XG5cdFx0Y2ZnOiBsYXp5U2l6ZXNDb25maWcsXG5cdFx0YXV0b1NpemVyOiBhdXRvU2l6ZXIsXG5cdFx0bG9hZGVyOiBsb2FkZXIsXG5cdFx0aW5pdDogaW5pdCxcblx0XHR1UDogdXBkYXRlUG9seWZpbGwsXG5cdFx0YUM6IGFkZENsYXNzLFxuXHRcdHJDOiByZW1vdmVDbGFzcyxcblx0XHRoQzogaGFzQ2xhc3MsXG5cdFx0ZmlyZTogdHJpZ2dlckV2ZW50LFxuXHRcdGdXOiBnZXRXaWR0aCxcblx0XHRyQUY6IHJBRixcblx0fTtcblxuXHRyZXR1cm4gbGF6eXNpemVzO1xufVxuKSk7Il19
