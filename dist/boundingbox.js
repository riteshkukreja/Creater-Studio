/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 34);
/******/ })
/************************************************************************/
/******/ ({

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Helper_1 = __webpack_require__(6);
const Color_1 = __webpack_require__(7);
//const worker: Worker = <Worker> self;
// Setup an event listener that will handle messages sent to the worker.
self.addEventListener('message', function (e) {
    const data = e.data;
    const imageData = new ImageData(data.imageData.data.slice(), data.imageData.width, data.imageData.height);
    /** Execute bounding box task */
    const borders = Helper_1.BoundingBox(data.imageData, data.position, data.imageData.width, data.imageData.height, (position, color) => {
        const _color = new Color_1.Color(data.color.red, data.color.green, data.color.blue, data.color.alpha);
        Helper_1.SetImageDataColor(imageData, position, imageData.width, imageData.height, _color);
    });
    // Send the message back.
    self.postMessage({
        type: 'end',
        data: borders,
        imageData: imageData
    });
}, false);


/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Exception_1 = __webpack_require__(8);
class InvalidArgException extends Exception_1.Exception {
    constructor(message) {
        super("Invalid Argument Exception", message);
    }
}
exports.InvalidArgException = InvalidArgException;


/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Position {
    constructor(x, y) {
        this.x = parseInt(x + '');
        this.y = parseInt(y + '');
    }
    distance(pos) {
        return Math.sqrt(Math.pow(this.x - pos.x, 2) + Math.pow(this.y - pos.y, 2));
    }
    angle(pos) {
        return Math.atan2(pos.y - this.y, pos.x - this.x);
    }
    toString() {
        return `[${this.x},${this.y}]`;
    }
}
exports.Position = Position;


/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Position_1 = __webpack_require__(5);
const Color_1 = __webpack_require__(7);
const InvalidArgException_1 = __webpack_require__(4);
/**
 * Map a value from one range to another
 * @param val  value in source range to map in target range
 * @param minA minimum of source range
 * @param maxA maximum of source range
 * @param minB minimum of target range
 * @param maxB maximum of target range
 */
exports.RangeMap = (val, minA, maxA, minB, maxB) => {
    return (val - minA) * (maxB - minB) / (maxA - minA) + minB;
};
exports.PointsOnLineBetween = (pos1, pos2, offset) => {
    const points = [];
    const increment = offset || 1;
    /** Vertical line */
    if (pos1.x === pos2.x) {
        for (let y = Math.min(pos1.y, pos2.y) + 1; y < Math.max(pos1.y, pos2.y); y += increment) {
            points.push(new Position_1.Position(pos1.x, y));
        }
    }
    else {
        const m = (pos2.y - pos1.y) / (pos2.x - pos1.x);
        const b = pos1.y - (m * pos1.x);
        /** Check if y range is larger or x */
        const diffX = Math.max(pos1.x, pos2.x) - Math.min(pos1.x, pos2.x);
        const diffY = Math.max(pos1.y, pos2.y) - Math.min(pos1.y, pos2.y);
        if (Math.abs(diffX) > Math.abs(diffY)) {
            /** X is greater */
            for (let x = Math.min(pos1.x, pos2.x) + 1; x < Math.max(pos1.x, pos2.x); x += increment) {
                const y = Math.floor((m * x) + b);
                points.push(new Position_1.Position(x, y));
            }
        }
        else {
            /** Y is greater */
            for (let y = Math.min(pos1.y, pos2.y) + 1; y < Math.max(pos1.y, pos2.y); y += increment) {
                const x = Math.floor((y - b) / m);
                points.push(new Position_1.Position(x, y));
            }
        }
    }
    return points;
};
exports.getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};
exports.getRandomColor = () => {
    return new Color_1.Color(exports.getRandomNumber(0, 255), exports.getRandomNumber(0, 255), exports.getRandomNumber(0, 255), 1);
};
exports.uuidGenerator = () => {
    return "item-" + (new Date()).getTime().toString();
};
exports.MatrixToLinearPositions = (position, rowSize) => {
    return (position.y * rowSize + position.x);
};
exports.ImageDataColorAt = (imageData, position, width, height) => {
    const pos = 4 * exports.MatrixToLinearPositions(position, width);
    if (pos < 0 || pos >= imageData.data.length)
        throw new InvalidArgException_1.InvalidArgException("Index out of bound execption");
    const color = new Color_1.Color(imageData.data[pos], //red
    imageData.data[pos + 1], //green
    imageData.data[pos + 2], //blue
    exports.RangeMap(imageData.data[pos + 3], 0, 255, 0, 1) //alpha
    );
    return color;
};
exports.SetImageDataColor = (imageData, position, width, height, color) => {
    const pos = 4 * exports.MatrixToLinearPositions(position, width);
    if (pos < 0 || pos >= imageData.data.length)
        throw new InvalidArgException_1.InvalidArgException("Index out of bound execption");
    imageData.data[pos] = color.Red; //red
    imageData.data[pos + 1] = color.Green; //green
    imageData.data[pos + 2] = color.Blue; //blue
    imageData.data[pos + 3] = exports.RangeMap(color.Alpha, 0, 1, 0, 255); //alpha
};
exports.ColorDiff = (color1, color2) => {
    return new Color_1.Color(Math.abs(color1.Red - color2.Red), Math.abs(color1.Green - color2.Green), Math.abs(color1.Blue - color2.Blue), Math.abs(color1.Alpha - color2.Alpha));
};
exports.BoundingBox = (imageData, position, width, height, callback) => {
    const clickedPositionColor = exports.ImageDataColorAt(imageData, position, width, height);
    const colorDelta = 10; // delta between colors while selectin border of box
    const queue = new Queue([position]);
    const borderPositions = [];
    const traversed = new Map();
    while (!queue.empty()) {
        const pos = queue.pop();
        if (pos !== null) {
            try {
                /** Check if already travered */
                if (traversed.has(pos.toString()))
                    continue;
                traversed.set(pos.toString(), true);
                /** Retrieve the color at this position */
                const color = exports.ImageDataColorAt(imageData, pos, width, height);
                /** Calculate delta between colors */
                const diffColor = exports.ColorDiff(clickedPositionColor, color);
                const delta = Math.max(diffColor.Red, Math.max(diffColor.Blue, diffColor.Green));
                /** if color is within the delta change, then move to its surrounding positions */
                if (delta <= colorDelta) {
                    /** Execute callback */
                    if (typeof callback == "function")
                        callback(pos, color);
                    /** Push surrounding positions to queue */
                    if (pos.x > 0) {
                        queue.push(new Position_1.Position(pos.x - 1, pos.y));
                    }
                    if (pos.x < width - 1) {
                        queue.push(new Position_1.Position(pos.x + 1, pos.y));
                    }
                    if (pos.y > 0) {
                        queue.push(new Position_1.Position(pos.x, pos.y - 1));
                    }
                    if (pos.y < height - 1) {
                        queue.push(new Position_1.Position(pos.x, pos.y + 1));
                    }
                }
                else {
                    borderPositions.push(pos);
                }
            }
            catch (e) {
                /** do nothing */
                console.error(e);
            }
        }
        else {
            break;
        }
    }
    return borderPositions;
};
class Queue {
    constructor(items) {
        this.items = items || [];
    }
    push(...items) {
        this.items = this.items.concat(items);
    }
    pop() {
        const item = this.items.shift();
        return item || null;
    }
    front() {
        if (this.items.length > 0) {
            return this.items[0];
        }
        return null;
    }
    size() {
        return this.items.length;
    }
    empty() {
        return this.items.length == 0;
    }
}
exports.Queue = Queue;
exports.getCursorAngle = (position1, position2) => {
    if (!position1 || !position2)
        return 0;
    return position1.angle(position2);
};
class WorkerRunner {
    constructor(url, callback) {
        this.worker = null;
        this.worker = new Worker(url);
        this.worker.addEventListener('message', (e) => {
            const data = e.data;
            callback(data);
        });
    }
    timeout(time) {
        setTimeout(() => {
            if (this.worker !== null)
                this.worker.terminate();
        }, time);
        return this;
    }
    send(data) {
        if (this.worker !== null) {
            this.worker.postMessage(data);
        }
        return this;
    }
    running() {
        return this.worker !== null;
    }
    waitFor(time) {
        //Promise. 
    }
}
exports.WorkerRunner = WorkerRunner;
exports.CreateWorker = (url, data) => __awaiter(this, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        var v = new Worker(url);
        v.postMessage(data);
        v.onmessage = function (event) {
            // If you report errors via messages, you'd have a branch here for checking
            // for an error and either calling `reject` or `resolve` as appropriate.
            resolve(event.data);
        };
        v.onerror = function (event) {
            // Rejects the promise using the error associated with the ErrorEvent
            reject(event.error);
        };
    });
});


/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Color {
    constructor(r, g, b, a) {
        this.red = r;
        this.green = g;
        this.blue = b;
        this.alpha = a || 1;
    }
    toString() {
        return "rgba(" + this.red + "," + this.green + "," + this.blue + "," + (this.alpha) + ")";
    }
    clone() {
        return new Color(this.red, this.green, this.blue, this.alpha);
    }
    get Red() {
        return this.red;
    }
    get Blue() {
        return this.blue;
    }
    get Green() {
        return this.green;
    }
    get Alpha() {
        return this.alpha;
    }
    set Alpha(alpha) {
        this.alpha = alpha;
    }
}
exports.Color = Color;


/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Exception {
    constructor(name, message) {
        this._name = name;
        this._message = message;
    }
    getMessage() {
        return this._message;
    }
    getName() {
        return this._name;
    }
}
exports.Exception = Exception;


/***/ })

/******/ });