/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main/store.ts":
/*!***************************!*\
  !*** ./src/main/store.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_MessageEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/MessageEmitter */ "./src/utils/MessageEmitter.ts");
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

_utils_MessageEmitter__WEBPACK_IMPORTED_MODULE_0__["default"].on("storage", (key, send) => __async(undefined, null, function* () {
  try {
    send("storage", yield figma.clientStorage.getAsync(key));
  } catch (e) {
    send("storage", "{}");
  }
}));
_utils_MessageEmitter__WEBPACK_IMPORTED_MODULE_0__["default"].on("storage set item", ({ key, value }, send) => {
  figma.clientStorage.setAsync(key, value);
  send("storage set item", true);
});
_utils_MessageEmitter__WEBPACK_IMPORTED_MODULE_0__["default"].on("storage get item", (key, send) => __async(undefined, null, function* () {
  try {
    const store = yield figma.clientStorage.getAsync(key);
    send("storage get item", store[key]);
  } catch (e) {
    send("storage get item", false);
  }
}));
_utils_MessageEmitter__WEBPACK_IMPORTED_MODULE_0__["default"].on("storage remove item", (key, send) => __async(undefined, null, function* () {
  try {
    yield figma.clientStorage.setAsync(key, void 0);
    send("storage remove item", true);
  } catch (e) {
    send("storage remove item", false);
  }
}));


/***/ }),

/***/ "./src/utils/MessageEmitter.ts":
/*!*************************************!*\
  !*** ./src/utils/MessageEmitter.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class EventEmitter {
  constructor() {
    this.messageEvent = /* @__PURE__ */ new Map();
    try {
      this.emit = (name, data) => {
        figma.ui.postMessage({
          name,
          data: data || null
        });
      };
      figma.ui.onmessage = (event) => {
        if (this.messageEvent.has(event.name)) {
          this.messageEvent.get(event.name)(event.data, this.emit);
        }
      };
    } catch (e) {
      onmessage = (event) => {
        if (this.messageEvent.has(event.data.pluginMessage.name)) {
          this.messageEvent.get(event.data.pluginMessage.name)(event.data.pluginMessage.data, this.emit);
        }
      };
      this.emit = (name = "", data = {}) => {
        parent.postMessage({
          pluginMessage: {
            name,
            data: data || null
          }
        }, "*");
      };
    }
  }
  on(name, callback) {
    this.messageEvent.set(name, callback);
    return () => this.remove(name);
  }
  once(name, callback) {
    const remove = this.on(name, (data, emit) => {
      callback(data, emit);
      remove();
    });
  }
  ask(name, data = void 0) {
    this.emit(name, data);
    return new Promise((resolve) => this.once(name, resolve));
  }
  answer(name, functionOrValue) {
    this.on(name, (incomingData, emit) => {
      if (this.isAsyncFunction(functionOrValue)) {
        functionOrValue(incomingData).then((data) => emit(name, data));
      } else if (typeof functionOrValue === "function") {
        emit(name, functionOrValue(incomingData));
      } else {
        emit(name, functionOrValue);
      }
    });
  }
  remove(name) {
    if (this.messageEvent.has(name)) {
      this.messageEvent.delete(name);
    }
  }
  isAsyncFunction(func) {
    func = func.toString().trim();
    return func.match("__awaiter") || func.match("function*") || func.match("async");
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new EventEmitter());


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./src/main/code.ts ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_MessageEmitter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/MessageEmitter */ "./src/utils/MessageEmitter.ts");
/* harmony import */ var _store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./store */ "./src/main/store.ts");
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};


figma.showUI(__html__, {
  width: 285,
  height: 530
});
const transformNode = (node) => {
  var _a;
  return {
    id: node.id,
    name: node.name,
    width: node.width,
    height: node.height,
    type: node.type,
    parentId: node.parent.id,
    childrenCount: ((_a = node.children) == null ? void 0 : _a.length) || 0
  };
};
const getNodes = (nodes) => (nodes || []).map(transformNode);
const __fontCache = [];
const getFont = (textNode) => __async(undefined, null, function* () {
  if (textNode.fontName === figma.mixed) {
    const len = textNode.characters.length;
    for (let i = 0; i < len; i++) {
      const font = textNode.getRangeFontName(i, i + 1);
      if (!__fontCache.some((f) => f.family === font.family && f.style === font.style)) {
        yield figma.loadFontAsync(font);
        __fontCache.push(font);
      }
    }
  } else {
    const font = textNode.fontName;
    if (!__fontCache.some((f) => f.family === font.family && f.style === font.style)) {
      yield figma.loadFontAsync(textNode.fontName);
      __fontCache.push(textNode.fontName);
    }
  }
});
figma.on("selectionchange", () => __async(undefined, null, function* () {
  _utils_MessageEmitter__WEBPACK_IMPORTED_MODULE_0__["default"].emit("selection", getNodes(figma.currentPage.selection));
}));
_utils_MessageEmitter__WEBPACK_IMPORTED_MODULE_0__["default"].on("drop image", (data) => {
  const { dropPosition, windowSize, offset, image } = data;
  const bounds = figma.viewport.bounds;
  const zoom = figma.viewport.zoom;
  const hasUI = Math.round(bounds.width * zoom) !== windowSize.width;
  const leftPaneWidth = windowSize.width - bounds.width * zoom - 240;
  const xFromCanvas = hasUI ? dropPosition.clientX - leftPaneWidth : dropPosition.clientX;
  const yFromCanvas = hasUI ? dropPosition.clientY - 48 : dropPosition.clientY;
  const rect = figma.createRectangle();
  rect.resize(200, 200);
  figma.currentPage.appendChild(rect);
  rect.x = bounds.x + xFromCanvas / zoom - offset.x;
  rect.y = bounds.y + yFromCanvas / zoom - offset.y;
  const imageHash = figma.createImage(image).hash;
  rect.fills = [].filter((fill) => fill.type !== "IMAGE").concat({
    type: "IMAGE",
    imageHash,
    scaleMode: "FILL"
  });
});
_utils_MessageEmitter__WEBPACK_IMPORTED_MODULE_0__["default"].answer("create items frame", () => __async(undefined, null, function* () {
  const frame = figma.createFrame();
  frame.name = "covr images";
  frame.resize(200, 200);
  figma.viewport.scrollAndZoomIntoView([frame]);
  return frame.id;
}));
_utils_MessageEmitter__WEBPACK_IMPORTED_MODULE_0__["default"].on("insert item", ({ data, parentId }) => {
  const parentNode = figma.getNodeById(parentId);
  if (parentNode && parentNode.type === "FRAME") {
    const rect = figma.createRectangle();
    rect.resize(200, 200);
    const imageHash = figma.createImage(data).hash;
    rect.fills = [].filter((fill) => fill.type !== "IMAGE").concat({
      type: "IMAGE",
      imageHash,
      scaleMode: "FILL"
    });
    parentNode.layoutMode = "VERTICAL";
    parentNode.appendChild(rect);
  }
});
_utils_MessageEmitter__WEBPACK_IMPORTED_MODULE_0__["default"].on("set image", (data) => {
  const selection = figma.currentPage.selection;
  if (!selection.some((node) => node.type !== "GROUP" && node.type !== "SLICE" && node.type !== "CONNECTOR" && node.type !== "CODE_BLOCK" && node.type !== "WIDGET" && node.type !== "EMBED" && node.type !== "LINK_UNFURL" && node.type !== "MEDIA")) {
    figma.notify("Please select a valid target or use drag&drop");
  } else {
    for (const node of figma.currentPage.selection) {
      if (node && node.type !== "GROUP" && node.type !== "SLICE" && node.type !== "CONNECTOR" && node.type !== "CODE_BLOCK" && node.type !== "WIDGET" && node.type !== "EMBED" && node.type !== "LINK_UNFURL" && node.type !== "MEDIA") {
        const imageHash = figma.createImage(data).hash;
        const fills = JSON.parse(JSON.stringify(node.fills || []));
        node.fills = fills.filter((fill) => fill.type !== "IMAGE").concat({
          type: "IMAGE",
          imageHash,
          scaleMode: "FILL"
        });
      }
    }
  }
});
_utils_MessageEmitter__WEBPACK_IMPORTED_MODULE_0__["default"].on("set text", (data) => __async(undefined, null, function* () {
  const selection = figma.currentPage.selection;
  if (!selection.some((node) => node.type === "TEXT")) {
    figma.notify("Please select at least one text layer");
  } else {
    for (const node of figma.currentPage.selection) {
      if (node && node.type === "TEXT") {
        yield getFont(node);
        node.characters = data;
      }
    }
  }
}));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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TUFBTSxZQUFZLE1BQU07QUFFMUMsY0FBTSxRQUFpQixLQUFLLE1BQU0sS0FBSyxVQUFVLEtBQUssU0FBUztBQUUvRCxhQUFLLFFBQVEsTUFDVixPQUFPLENBQUMsU0FBUyxLQUFLLFNBQVMsU0FDL0IsT0FBTztBQUFBLFVBQ04sTUFBTTtBQUFBLFVBQ047QUFBQSxVQUNBLFdBQVc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT3ZCLGdFQUFpQixDQUFDLFlBQVksQ0FBTyxTQUFTO0FBQzVDLFFBQU0sWUFBWSxNQUFNLFlBQVk7QUFFcEMsTUFBSSxDQUFDLFVBQVUsS0FBSyxDQUFDLFNBQVMsS0FBSyxTQUFTLFNBQVM7QUFDbkQsVUFBTSxPQUFPO0FBQUEsU0FDUjtBQUNMLGVBQVcsUUFBUSxNQUFNLFlBQVksV0FBVztBQUM5QyxVQUFJLFFBQVEsS0FBSyxTQUFTLFFBQVE7QUFDaEMsY0FBTSxRQUFRO0FBQ2QsYUFBSyxhQUFhO0FBQUE7QUFBQTtBQUFBO0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb3ZyLy4vc3JjL21haW4vc3RvcmUudHMiLCJ3ZWJwYWNrOi8vY292ci8uL3NyYy91dGlscy9NZXNzYWdlRW1pdHRlci50cyIsIndlYnBhY2s6Ly9jb3ZyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NvdnIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NvdnIvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9jb3ZyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY292ci8uL3NyYy9tYWluL2NvZGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZtZSBmcm9tICcuLi91dGlscy9NZXNzYWdlRW1pdHRlcic7XG5cbmZtZS5vbignc3RvcmFnZScsIGFzeW5jIChrZXksIHNlbmQpID0+IHtcbiAgdHJ5IHtcbiAgICBzZW5kKCdzdG9yYWdlJywgYXdhaXQgZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYyhrZXkpKTtcbiAgfSBjYXRjaCB7XG4gICAgc2VuZCgnc3RvcmFnZScsICd7fScpO1xuICB9XG59KTtcblxuZm1lLm9uKCdzdG9yYWdlIHNldCBpdGVtJywgKHsga2V5LCB2YWx1ZSB9LCBzZW5kKSA9PiB7XG4gIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoa2V5LCB2YWx1ZSk7XG5cbiAgc2VuZCgnc3RvcmFnZSBzZXQgaXRlbScsIHRydWUpO1xufSk7XG5cbmZtZS5vbignc3RvcmFnZSBnZXQgaXRlbScsIGFzeW5jIChrZXksIHNlbmQpID0+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzdG9yZSA9IGF3YWl0IGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoa2V5KTtcblxuICAgIHNlbmQoJ3N0b3JhZ2UgZ2V0IGl0ZW0nLCBzdG9yZVtrZXldKTtcbiAgfSBjYXRjaCB7XG4gICAgc2VuZCgnc3RvcmFnZSBnZXQgaXRlbScsIGZhbHNlKTtcbiAgfVxufSk7XG5cbmZtZS5vbignc3RvcmFnZSByZW1vdmUgaXRlbScsIGFzeW5jIChrZXksIHNlbmQpID0+IHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKGtleSwgdW5kZWZpbmVkKTtcblxuICAgIHNlbmQoJ3N0b3JhZ2UgcmVtb3ZlIGl0ZW0nLCB0cnVlKTtcbiAgfSBjYXRjaCB7XG4gICAgc2VuZCgnc3RvcmFnZSByZW1vdmUgaXRlbScsIGZhbHNlKTtcbiAgfVxufSk7XG4iLCIvKipcbiAqIEFuIHN0cnVjdHVyZWQgd2F5IHRvIGhhbmRsZSByZW5kZXJlciBhbmQgbWFpbiBtZXNzYWdlc1xuICovXG4gY2xhc3MgRXZlbnRFbWl0dGVyIHtcbiAgbWVzc2FnZUV2ZW50ID0gbmV3IE1hcCgpO1xuICBlbWl0OiAoXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGRhdGE/OiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bWJlciB8IHN0cmluZyB8IFVpbnQ4QXJyYXkgfCB1bmtub3duW11cbiAgKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8vIE1BSU4gUFJPQ0VTU1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmVtaXQgPSAobmFtZSwgZGF0YSkgPT4ge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7XG4gICAgICAgICAgbmFtZSxcbiAgICAgICAgICBkYXRhOiBkYXRhIHx8IG51bGwsXG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgZmlnbWEudWkub25tZXNzYWdlID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGlmICh0aGlzLm1lc3NhZ2VFdmVudC5oYXMoZXZlbnQubmFtZSkpIHtcbiAgICAgICAgICB0aGlzLm1lc3NhZ2VFdmVudC5nZXQoZXZlbnQubmFtZSkoZXZlbnQuZGF0YSwgdGhpcy5lbWl0KTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIHdlIGlnbm9yZSB0aGUgZXJyb3IsIGJlY2F1c2UgaXQgb25seSBzYXlzLCB0aGF0IFwiZmlnbWFcIiBpcyB1bmRlZmluZWRcbiAgICAgIC8vIFJFTkRFUkVSIFBST0NFU1NcbiAgICAgIG9ubWVzc2FnZSA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAodGhpcy5tZXNzYWdlRXZlbnQuaGFzKGV2ZW50LmRhdGEucGx1Z2luTWVzc2FnZS5uYW1lKSkge1xuICAgICAgICAgIHRoaXMubWVzc2FnZUV2ZW50LmdldChldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2UubmFtZSkoXG4gICAgICAgICAgICBldmVudC5kYXRhLnBsdWdpbk1lc3NhZ2UuZGF0YSxcbiAgICAgICAgICAgIHRoaXMuZW1pdFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHRoaXMuZW1pdCA9IChuYW1lID0gJycsIGRhdGEgPSB7fSkgPT4ge1xuICAgICAgICBwYXJlbnQucG9zdE1lc3NhZ2UoXG4gICAgICAgICAge1xuICAgICAgICAgICAgcGx1Z2luTWVzc2FnZToge1xuICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICBkYXRhOiBkYXRhIHx8IG51bGwsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJyonXG4gICAgICAgICk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBlbWl0cyBhIG1lc3NhZ2UgdG8gbWFpbiBvciByZW5kZXJlclxuICAgKiBAcGFyYW0gbmFtZSBzdHJpbmdcbiAgICogQHBhcmFtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICBvbihuYW1lLCBjYWxsYmFjaykge1xuICAgIHRoaXMubWVzc2FnZUV2ZW50LnNldChuYW1lLCBjYWxsYmFjayk7XG5cbiAgICByZXR1cm4gKCkgPT4gdGhpcy5yZW1vdmUobmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIHRvIGEgbWVzc2FnZSBvbmNlXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSBjYWxsYmFja1xuICAgKi9cbiAgb25jZShuYW1lLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IHJlbW92ZSA9IHRoaXMub24obmFtZSwgKGRhdGEsIGVtaXQpID0+IHtcbiAgICAgIGNhbGxiYWNrKGRhdGEsIGVtaXQpO1xuICAgICAgcmVtb3ZlKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQXNrIGZvciBkYXRhXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqL1xuICBhc2sobmFtZSwgZGF0YSA9IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuZW1pdChuYW1lLCBkYXRhKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gdGhpcy5vbmNlKG5hbWUsIHJlc29sdmUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbnN3ZXIgZGF0YSBmcm9tIFwiYXNrXCJcbiAgICogQHBhcmFtIG5hbWVcbiAgICogQHBhcmFtIGZ1bmN0aW9uT3JWYWx1ZVxuICAgKi9cbiAgYW5zd2VyKG5hbWUsIGZ1bmN0aW9uT3JWYWx1ZSkge1xuICAgIHRoaXMub24obmFtZSwgKGluY29taW5nRGF0YSwgZW1pdCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNBc3luY0Z1bmN0aW9uKGZ1bmN0aW9uT3JWYWx1ZSkpIHtcbiAgICAgICAgZnVuY3Rpb25PclZhbHVlKGluY29taW5nRGF0YSkudGhlbigoZGF0YSkgPT4gZW1pdChuYW1lLCBkYXRhKSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBmdW5jdGlvbk9yVmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZW1pdChuYW1lLCBmdW5jdGlvbk9yVmFsdWUoaW5jb21pbmdEYXRhKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbWl0KG5hbWUsIGZ1bmN0aW9uT3JWYWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuZCBhY3RpdmUgbGlzdGVuZXJcbiAgICogQHBhcmFtIG5hbWVcbiAgICovXG4gIHJlbW92ZShuYW1lKSB7XG4gICAgaWYgKHRoaXMubWVzc2FnZUV2ZW50LmhhcyhuYW1lKSkge1xuICAgICAgdGhpcy5tZXNzYWdlRXZlbnQuZGVsZXRlKG5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGNoZWNrcyBpZiBpdCBpcyBhc3luY2hyb25vdXMgb3Igbm90XG4gICAqIEBwYXJhbSBmdW5jXG4gICAqL1xuICBpc0FzeW5jRnVuY3Rpb24oZnVuYykge1xuICAgIGZ1bmMgPSBmdW5jLnRvU3RyaW5nKCkudHJpbSgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIGZ1bmMubWF0Y2goJ19fYXdhaXRlcicpIHx8IGZ1bmMubWF0Y2goJ2Z1bmN0aW9uKicpIHx8IGZ1bmMubWF0Y2goJ2FzeW5jJylcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IE1lc3NhZ2VFbWl0dGVyIGZyb20gJy4uL3V0aWxzL01lc3NhZ2VFbWl0dGVyJztcbmltcG9ydCAnLi9zdG9yZSc7XG5cbmZpZ21hLnNob3dVSShfX2h0bWxfXywge1xuICB3aWR0aDogMjg1LFxuICBoZWlnaHQ6IDUzMCxcbn0pO1xuXG5jb25zdCB0cmFuc2Zvcm1Ob2RlID0gKG5vZGUpID0+ICh7XG4gIGlkOiBub2RlLmlkLFxuICBuYW1lOiBub2RlLm5hbWUsXG4gIHdpZHRoOiBub2RlLndpZHRoLFxuICBoZWlnaHQ6IG5vZGUuaGVpZ2h0LFxuICB0eXBlOiBub2RlLnR5cGUsXG4gIHBhcmVudElkOiBub2RlLnBhcmVudC5pZCxcbiAgY2hpbGRyZW5Db3VudDogbm9kZS5jaGlsZHJlbj8ubGVuZ3RoIHx8IDAsXG59KTtcblxuY29uc3QgZ2V0Tm9kZXMgPSAobm9kZXMpID0+IChub2RlcyB8fCBbXSkubWFwKHRyYW5zZm9ybU5vZGUpO1xuXG5jb25zdCBfX2ZvbnRDYWNoZTogRm9udE5hbWVbXSA9IFtdO1xuXG5jb25zdCBnZXRGb250ID0gYXN5bmMgKHRleHROb2RlOiBUZXh0Tm9kZSkgPT4ge1xuICBpZiAodGV4dE5vZGUuZm9udE5hbWUgPT09IGZpZ21hLm1peGVkKSB7XG4gICAgY29uc3QgbGVuID0gdGV4dE5vZGUuY2hhcmFjdGVycy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgZm9udCA9IHRleHROb2RlLmdldFJhbmdlRm9udE5hbWUoaSwgaSArIDEpIGFzIEZvbnROYW1lO1xuICAgICAgaWYgKFxuICAgICAgICAhX19mb250Q2FjaGUuc29tZShcbiAgICAgICAgICAoZikgPT4gZi5mYW1pbHkgPT09IGZvbnQuZmFtaWx5ICYmIGYuc3R5bGUgPT09IGZvbnQuc3R5bGVcbiAgICAgICAgKVxuICAgICAgKSB7XG4gICAgICAgIGF3YWl0IGZpZ21hLmxvYWRGb250QXN5bmMoZm9udCk7XG4gICAgICAgIF9fZm9udENhY2hlLnB1c2goZm9udCk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IGZvbnQgPSB0ZXh0Tm9kZS5mb250TmFtZTtcbiAgICBpZiAoXG4gICAgICAhX19mb250Q2FjaGUuc29tZShcbiAgICAgICAgKGYpID0+IGYuZmFtaWx5ID09PSBmb250LmZhbWlseSAmJiBmLnN0eWxlID09PSBmb250LnN0eWxlXG4gICAgICApXG4gICAgKSB7XG4gICAgICBhd2FpdCBmaWdtYS5sb2FkRm9udEFzeW5jKHRleHROb2RlLmZvbnROYW1lKTtcbiAgICAgIF9fZm9udENhY2hlLnB1c2godGV4dE5vZGUuZm9udE5hbWUpO1xuICAgIH1cbiAgfVxufTtcblxuZmlnbWEub24oJ3NlbGVjdGlvbmNoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgTWVzc2FnZUVtaXR0ZXIuZW1pdCgnc2VsZWN0aW9uJywgZ2V0Tm9kZXMoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKSk7XG59KTtcblxuTWVzc2FnZUVtaXR0ZXIub24oJ2Ryb3AgaW1hZ2UnLCAoZGF0YSkgPT4ge1xuICBjb25zdCB7IGRyb3BQb3NpdGlvbiwgd2luZG93U2l6ZSwgb2Zmc2V0LCBpbWFnZSB9ID0gZGF0YTtcblxuICAvLyBUaGFua3MgdG8gQGphY2tpZWNvcm4gaHR0cHM6Ly9naXRodWIuY29tL2phY2tpZWNvcm4vZmlnbWEtcGx1Z2luLWRyYWctYW5kLWRyb3BcbiAgY29uc3QgYm91bmRzID0gZmlnbWEudmlld3BvcnQuYm91bmRzO1xuICBjb25zdCB6b29tID0gZmlnbWEudmlld3BvcnQuem9vbTtcbiAgY29uc3QgaGFzVUkgPSBNYXRoLnJvdW5kKGJvdW5kcy53aWR0aCAqIHpvb20pICE9PSB3aW5kb3dTaXplLndpZHRoO1xuICBjb25zdCBsZWZ0UGFuZVdpZHRoID0gd2luZG93U2l6ZS53aWR0aCAtIGJvdW5kcy53aWR0aCAqIHpvb20gLSAyNDA7XG5cbiAgY29uc3QgeEZyb21DYW52YXMgPSBoYXNVSVxuICAgID8gZHJvcFBvc2l0aW9uLmNsaWVudFggLSBsZWZ0UGFuZVdpZHRoXG4gICAgOiBkcm9wUG9zaXRpb24uY2xpZW50WDtcbiAgY29uc3QgeUZyb21DYW52YXMgPSBoYXNVSSA/IGRyb3BQb3NpdGlvbi5jbGllbnRZIC0gNDggOiBkcm9wUG9zaXRpb24uY2xpZW50WTtcblxuICBjb25zdCByZWN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gIHJlY3QucmVzaXplKDIwMCwgMjAwKTtcbiAgZmlnbWEuY3VycmVudFBhZ2UuYXBwZW5kQ2hpbGQocmVjdCk7XG5cbiAgcmVjdC54ID0gYm91bmRzLnggKyB4RnJvbUNhbnZhcyAvIHpvb20gLSBvZmZzZXQueDtcbiAgcmVjdC55ID0gYm91bmRzLnkgKyB5RnJvbUNhbnZhcyAvIHpvb20gLSBvZmZzZXQueTtcblxuICBjb25zdCBpbWFnZUhhc2ggPSBmaWdtYS5jcmVhdGVJbWFnZShpbWFnZSkuaGFzaDtcblxuICByZWN0LmZpbGxzID0gW11cbiAgICAuZmlsdGVyKChmaWxsKSA9PiBmaWxsLnR5cGUgIT09ICdJTUFHRScpXG4gICAgLmNvbmNhdCh7XG4gICAgICB0eXBlOiAnSU1BR0UnLFxuICAgICAgaW1hZ2VIYXNoLFxuICAgICAgc2NhbGVNb2RlOiAnRklMTCcsXG4gICAgfSk7XG59KTtcblxuTWVzc2FnZUVtaXR0ZXIuYW5zd2VyKCdjcmVhdGUgaXRlbXMgZnJhbWUnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGZyYW1lID0gZmlnbWEuY3JlYXRlRnJhbWUoKTtcblxuICBmcmFtZS5uYW1lID0gJ2NvdnIgaW1hZ2VzJztcbiAgZnJhbWUucmVzaXplKDIwMCwgMjAwKTtcblxuICBmaWdtYS52aWV3cG9ydC5zY3JvbGxBbmRab29tSW50b1ZpZXcoW2ZyYW1lXSk7XG5cbiAgcmV0dXJuIGZyYW1lLmlkO1xufSk7XG5cbk1lc3NhZ2VFbWl0dGVyLm9uKCdpbnNlcnQgaXRlbScsICh7IGRhdGEsIHBhcmVudElkIH0pID0+IHtcbiAgY29uc3QgcGFyZW50Tm9kZSA9IGZpZ21hLmdldE5vZGVCeUlkKHBhcmVudElkKTtcblxuICBpZiAocGFyZW50Tm9kZSAmJiBwYXJlbnROb2RlLnR5cGUgPT09ICdGUkFNRScpIHtcbiAgICBjb25zdCByZWN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgcmVjdC5yZXNpemUoMjAwLCAyMDApO1xuXG4gICAgY29uc3QgaW1hZ2VIYXNoID0gZmlnbWEuY3JlYXRlSW1hZ2UoZGF0YSkuaGFzaDtcblxuICAgIHJlY3QuZmlsbHMgPSBbXVxuICAgICAgLmZpbHRlcigoZmlsbCkgPT4gZmlsbC50eXBlICE9PSAnSU1BR0UnKVxuICAgICAgLmNvbmNhdCh7XG4gICAgICAgIHR5cGU6ICdJTUFHRScsXG4gICAgICAgIGltYWdlSGFzaCxcbiAgICAgICAgc2NhbGVNb2RlOiAnRklMTCcsXG4gICAgICB9KTtcblxuICAgIHBhcmVudE5vZGUubGF5b3V0TW9kZSA9ICdWRVJUSUNBTCc7XG4gICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZChyZWN0KTtcbiAgfVxufSk7XG5cbk1lc3NhZ2VFbWl0dGVyLm9uKCdzZXQgaW1hZ2UnLCAoZGF0YSkgPT4ge1xuICBjb25zdCBzZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG5cbiAgaWYgKFxuICAgICFzZWxlY3Rpb24uc29tZShcbiAgICAgIChub2RlKSA9PlxuICAgICAgICBub2RlLnR5cGUgIT09ICdHUk9VUCcgJiZcbiAgICAgICAgbm9kZS50eXBlICE9PSAnU0xJQ0UnICYmXG4gICAgICAgIG5vZGUudHlwZSAhPT0gJ0NPTk5FQ1RPUicgJiZcbiAgICAgICAgbm9kZS50eXBlICE9PSAnQ09ERV9CTE9DSycgJiZcbiAgICAgICAgbm9kZS50eXBlICE9PSAnV0lER0VUJyAmJlxuICAgICAgICBub2RlLnR5cGUgIT09ICdFTUJFRCcgJiZcbiAgICAgICAgbm9kZS50eXBlICE9PSAnTElOS19VTkZVUkwnICYmXG4gICAgICAgIG5vZGUudHlwZSAhPT0gJ01FRElBJ1xuICAgIClcbiAgKSB7XG4gICAgZmlnbWEubm90aWZ5KCdQbGVhc2Ugc2VsZWN0IGEgdmFsaWQgdGFyZ2V0IG9yIHVzZSBkcmFnJmRyb3AnKTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKSB7XG4gICAgICBpZiAoXG4gICAgICAgIG5vZGUgJiZcbiAgICAgICAgbm9kZS50eXBlICE9PSAnR1JPVVAnICYmXG4gICAgICAgIG5vZGUudHlwZSAhPT0gJ1NMSUNFJyAmJlxuICAgICAgICBub2RlLnR5cGUgIT09ICdDT05ORUNUT1InICYmXG4gICAgICAgIG5vZGUudHlwZSAhPT0gJ0NPREVfQkxPQ0snICYmXG4gICAgICAgIG5vZGUudHlwZSAhPT0gJ1dJREdFVCcgJiZcbiAgICAgICAgbm9kZS50eXBlICE9PSAnRU1CRUQnICYmXG4gICAgICAgIG5vZGUudHlwZSAhPT0gJ0xJTktfVU5GVVJMJyAmJlxuICAgICAgICBub2RlLnR5cGUgIT09ICdNRURJQSdcbiAgICAgICkge1xuICAgICAgICBjb25zdCBpbWFnZUhhc2ggPSBmaWdtYS5jcmVhdGVJbWFnZShkYXRhKS5oYXNoO1xuXG4gICAgICAgIGNvbnN0IGZpbGxzOiBQYWludFtdID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShub2RlLmZpbGxzIHx8IFtdKSk7XG5cbiAgICAgICAgbm9kZS5maWxscyA9IGZpbGxzXG4gICAgICAgICAgLmZpbHRlcigoZmlsbCkgPT4gZmlsbC50eXBlICE9PSAnSU1BR0UnKVxuICAgICAgICAgIC5jb25jYXQoe1xuICAgICAgICAgICAgdHlwZTogJ0lNQUdFJyxcbiAgICAgICAgICAgIGltYWdlSGFzaCxcbiAgICAgICAgICAgIHNjYWxlTW9kZTogJ0ZJTEwnLFxuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG5cbk1lc3NhZ2VFbWl0dGVyLm9uKCdzZXQgdGV4dCcsIGFzeW5jIChkYXRhKSA9PiB7XG4gIGNvbnN0IHNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcblxuICBpZiAoIXNlbGVjdGlvbi5zb21lKChub2RlKSA9PiBub2RlLnR5cGUgPT09ICdURVhUJykpIHtcbiAgICBmaWdtYS5ub3RpZnkoJ1BsZWFzZSBzZWxlY3QgYXQgbGVhc3Qgb25lIHRleHQgbGF5ZXInKTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGNvbnN0IG5vZGUgb2YgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKSB7XG4gICAgICBpZiAobm9kZSAmJiBub2RlLnR5cGUgPT09ICdURVhUJykge1xuICAgICAgICBhd2FpdCBnZXRGb250KG5vZGUpO1xuICAgICAgICBub2RlLmNoYXJhY3RlcnMgPSBkYXRhO1xuICAgICAgfVxuICAgIH1cbiAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=