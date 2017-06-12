(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.addFront = undefined;

var _functionalHelpers = require('../functionalHelpers');

var _helpers = require('../helpers');

function addFront(source, enumerable) {
    return function* addFront() {
        enumerable = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, enumerable);
        for (let item of enumerable) {
            if (_helpers.javaScriptTypes.undefined !== item) yield item;
        }

        for (let item of source) {
            if (_helpers.javaScriptTypes.undefined !== item) yield item;
        }
    };
}

exports.addFront = addFront;

},{"../functionalHelpers":18,"../helpers":19}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zip = exports.union = exports.join = exports.intersect = exports.groupJoin = exports.except = exports.concat = exports.addFront = undefined;

var _addFront = require('./addFront');

var _concat = require('./concat');

var _except = require('./except');

var _groupJoin = require('./groupJoin');

var _intersect = require('./intersect');

var _join = require('./join');

var _union = require('./union');

var _zip = require('./zip');

exports.addFront = _addFront.addFront;
exports.concat = _concat.concat;
exports.except = _except.except;
exports.groupJoin = _groupJoin.groupJoin;
exports.intersect = _intersect.intersect;
exports.join = _join.join;
exports.union = _union.union;
exports.zip = _zip.zip;

},{"./addFront":1,"./concat":3,"./except":4,"./groupJoin":5,"./intersect":6,"./join":7,"./union":8,"./zip":9}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.concat = undefined;

var _functionalHelpers = require('../functionalHelpers');

var _helpers = require('../helpers');

function concat(source, enumerables, argsCount) {
    return function* concatIterator() {
        for (let item of source) {
            if (_helpers.javaScriptTypes.undefined !== item) yield item;
        }

        var enumerable;
        if (1 === argsCount) {
            enumerable = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, enumerables);
            for (let item of enumerable) {
                if (_helpers.javaScriptTypes.undefined !== item) yield item;
            }
        } else {
            for (let list of enumerables) {
                enumerable = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, list);
                for (let item of enumerable) {
                    if (_helpers.javaScriptTypes.undefined !== item) yield item;
                }
            }
        }
    };
}

exports.concat = concat;

},{"../functionalHelpers":18,"../helpers":19}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.except = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

function except(source, enumerable, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;

    return function* exceptIterator() {
        var res;
        for (let item of source) {
            enumerable = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, enumerable);
            res = !enumerable.some(function _comparer(it) {
                return comparer(item, it);
            });
            if (res) yield item;
        }
    };
}

exports.except = except;

},{"../functionalHelpers":18,"../helpers":19}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupJoin = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

function groupJoin(outer, inner, outerSelector, innerSelector, projector, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;

    return function* groupJoinIterator() {
        var innerGroups = [];
        inner = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, inner);
        for (let innerItem of inner) {
            var innerRes = innerSelector(innerItem);
            var matchingGroup = innerGroups.find(_findInnerGroup);

            if (!matchingGroup) matchingGroup = { key: innerRes, items: [innerItem] };
            innerGroups[innerGroups.length] = matchingGroup;
        }

        for (var outerItem of outer) {
            var innerMatch = innerGroups.find(_compareByKeys);
            let res = projector(outerItem, undefined === innerMatch ? [] : innerMatch.items);
            if (_helpers.javaScriptTypes.undefined !== res) yield res;
        }

        function _findInnerGroup(grp) {
            return comparer(grp.key, innerRes);
        }

        function _compareByKeys(innerItem) {
            return comparer(outerSelector(outerItem), innerItem.key);
        }
    };
}

exports.groupJoin = groupJoin;

},{"../functionalHelpers":18,"../helpers":19}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.intersect = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

function intersect(source, enumerable, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;

    return function* intersectIterator() {
        enumerable = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, enumerable);
        for (let item of source) {
            if (_helpers.javaScriptTypes.undefined !== item && enumerable.some(function _checkEquivalency(it) {
                return comparer(item, it);
            })) {
                yield item;
            }
        }
    };
}

exports.intersect = intersect;

},{"../functionalHelpers":18,"../helpers":19}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.join = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

function join(outer, inner, outerSelector, innerSelector, projector, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;
    return function* joinIterator() {
        inner = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, inner);
        for (let outerItem of outer) {
            for (let innerItem of inner) {
                if (comparer(outerSelector(outerItem), innerSelector(innerItem))) {
                    let res = projector(outerItem, innerItem);
                    if (_helpers.javaScriptTypes.undefined !== res) yield res;
                }
            }
        }
    };
}

exports.join = join;

},{"../functionalHelpers":18,"../helpers":19}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.union = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

function union(source, enumerable, comparer) {
    comparer = comparer || _helpers.defaultEqualityComparer;
    var havePreviouslyViewed = (0, _helpers.memoizer)(comparer);

    return function* unionIterator() {
        var res;
        for (let item of source) {
            res = havePreviouslyViewed(item);
            if (!res) yield item;
        }

        enumerable = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, enumerable);
        for (let item of enumerable) {
            res = havePreviouslyViewed(item);
            if (!res) yield item;
        }
    };
}

exports.union = union;

},{"../functionalHelpers":18,"../helpers":19}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.zip = undefined;

var _functionalHelpers = require('../functionalHelpers');

var _helpers = require('../helpers');

function zip(source, enumerable, selector) {
    return function* zipIterator() {
        var res,
            idx = 0;
        enumerable = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, enumerable);

        if (!enumerable.length < 1) {
            for (let item of source) {
                if (idx > enumerable.length) return;
                res = selector(item, enumerable[idx]);
                if (_helpers.javaScriptTypes.undefined !== res) yield res;
                ++idx;
            }
        }
    };
}

exports.zip = zip;

},{"../functionalHelpers":18,"../helpers":19}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.all = undefined;

var _helpers = require('../helpers');

function all(source, predicate) {
    if (_helpers.javaScriptTypes.function !== typeof predicate) return false;
    return Array.from(source).every(predicate);
}

exports.all = all;

},{"../helpers":19}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.any = undefined;

var _helpers = require('../helpers');

function any(source, predicate) {
    if (_helpers.javaScriptTypes.function !== typeof predicate) return Array.from(source).length > 0;
    return Array.from(source).some(predicate);
}

exports.any = any;

},{"../helpers":19}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.contains = undefined;

var _functionalHelpers = require('../functionalHelpers');

var _helpers = require('../helpers');

//TODO: see if there is any real performance increase by Just using .includes when a comparer hasn't been passed
//import { defaultEqualityComparer } from '../helpers';
function contains(source, val, comparer) {
    source = (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, source);
    if (_helpers.javaScriptTypes.undefined === comparer) return source.includes(val);
    return source.some(function _checkEquality(item) {
        return comparer(item, val);
    });
}

exports.contains = contains;

},{"../functionalHelpers":18,"../helpers":19}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.count = undefined;

var _helpers = require('../helpers');

function count(source, predicate) {
    if (_helpers.javaScriptTypes.undefined === predicate) return Array.from(source).length;
    return Array.from(source).filter(function filterItems(item) {
        return predicate(item);
    }).length;
}

exports.count = count;

},{"../helpers":19}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.count = exports.last = exports.fold = exports.first = exports.contains = exports.any = exports.all = undefined;

var _all = require('./all');

var _any = require('./any');

var _contains = require('./contains');

var _first = require('./first');

var _fold = require('./fold');

var _last = require('./last');

var _count = require('./count');

exports.all = _all.all;
exports.any = _any.any;
exports.contains = _contains.contains;
exports.first = _first.first;
exports.fold = _fold.fold;
exports.last = _last.last;
exports.count = _count.count;

},{"./all":10,"./any":11,"./contains":12,"./count":13,"./first":15,"./fold":16,"./last":17}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.first = undefined;

var _helpers = require('../helpers');

function first(source, predicate) {
    if (_helpers.javaScriptTypes.function === typeof predicate) return Array.from(source).find(predicate);
    return Array.from(source)[0];
}

exports.first = first;

},{"../helpers":19}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fold = undefined;

var _functionalHelpers = require('../functionalHelpers');

function fold(source, fn, initial = 0) {
    return (0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, source).reduce(fn, initial);
}

exports.fold = fold;

},{"../functionalHelpers":18}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.last = undefined;

var _helpers = require('../helpers');

function last(source, predicate) {
    var data = Array.from(source);
    if (_helpers.javaScriptTypes.function === typeof predicate) data = data.filter(predicate);
    return data[data.length - 1];
}

exports.last = last;

},{"../helpers":19}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sequence = exports.fork = exports.tap = exports.curryN = exports.curry = exports.adjust = exports.mapped = exports.lensPath = exports.makeLenses = exports.put = exports.over = exports.view = exports.objectLens = exports.arrayLens = exports.delegatesFrom = exports.delegatesTo = exports.lessThanOrEqual = exports.lessThan = exports.greaterThanOrEqual = exports.greaterThan = exports.strictNotEqual = exports.notEqual = exports.strictEqual = exports.equal = exports.negate = exports.concat = exports.modulus = exports.multiple = exports.divide = exports.subtract = exports.add = exports.falsey = exports.truthy = exports.flip = exports.and = exports.or = exports.not = exports.isSomething = exports.isNothing = exports.isUndefined = exports.isNull = exports.isSymbol = exports.isBoolean = exports.isString = exports.isNumber = exports.isFunction = exports.isObject = exports.isArray = exports.type = exports.wrap = exports.whenNot = exports.when = exports.ifThisThenThat = exports.ifElse = exports.pipe = exports.compose = exports.nth = exports.arraySet = exports.objectSet = exports.set = exports.get = exports.kestrel = exports.once = exports.apply = exports.constant = exports.identity = exports.noop = undefined;

var _helpers = require('./helpers');

/**
 * No-op function; used as default function in some cases when argument is optional
 * and consumer does not provide.
 * @returns {undefined}
 */
function noop() {}

/**
 * Identity :: a -> a
 * Identity function; takes any item and returns same item when invoked
 *
 * @param {*} item - Any value of any type
 * @returns {*} - returns item
 */
function identity(item) {
    return item;
}

/**
 * constant :: a -> () -> a
 * @param {*} item
 * @returns {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
function constant(item) {
    return function _constant() {
        return item;
    };
}

/**
 * kestrel :: a -> () -> a
 * @note @see {@link constant}
 * @type {function}
 * @param {*} item
 * @returns {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
var kestrel = constant;

function apply(fn) {
    return function _apply(...args) {
        return function _apply_() {
            return fn(...args);
        };
    };
}

/**
 * @description:
 * @type: {function}
 * @param: {*} arg
 * @param: {function} fn
 * @returns {arg}
 */
var tap = curry(function _tap(fn, arg) {
    fn(arg);
    return arg;
});

/**
 * @description:
 * @param: {function} fn
 * @returns: {function}
 */
function once(fn) {
    var invoked = false;
    return function _once(...args) {
        return invoked ? undefined : fn(...args);
    };
}

/**
 * @description:
 * @param: {Array} fns
 * @returns: {function}
 */
function sequence(fns) {
    return function _sequence(...args) {
        fns.forEach(function fSequence(fn) {
            fn(...args);
        });
    };
}

/**
 * @description:
 * @type: {function}
 * @param: {function} join
 * @param: {function} fn1
 * @param: {function} fn2
 * @returns: {function}
 */
var fork = curry(function _fork(join, fn1, fn2) {
    return function _fork_(...args) {
        return join(fn1(...args), fn2(...args));
    };
});

/**
 * @description:
 * @type: {function}
 * @param: {string} prop
 * @param: {object} obj
 * @returns: {*}
 */
var get = curry(function _get(prop, obj) {
    return obj[prop];
});

/**
 *
 * @type {*}
 */
var set = curry(function _set(prop, val, obj) {
    obj[prop] = val;
    return obj;
});

/**
 * @description:
 * @type: {function}
 * @param: {string} prop
 * @param: {*} val
 * @param: {object} obj
 * @returns: {object}
 */
var objectSet = curry(function _objectSet(prop, val, obj) {
    var result = (0, _helpers.shallowClone)(obj);
    result[prop] = val;
    return result;
});

/**
 * @description: Updates the value at a specified index of an array by first creating a shallow copy
 * of the array and then updating its value at the specified index.
 * @type: {function}
 * @note: @see {@link adjust}
 * @param: {number} idx - The index of the array to which the alternate value will be set.
 * @param: {*} x - The value to be used to update the array at the index specified.
 * @param: {Array} List - The List on which to perform the update.
 * @returns: {Array} - Returns a new array with the value at the specified index being
 * set to the value of the 'x' argument.
 */
var arraySet = curry(function _arraySet(idx, x, list) {
    return adjust(kestrel(x), idx, list);
});

/**
 * compose :: [a] -> (b -> c)
 * @description:
 * @type: {function}
 * @note: @see {@link pipe}
 * @param: {Array} funcs
 * @returns: {*}
 */
function compose(...funcs) {
    return pipe(funcs.reverse());
}

/**
 * pipe :: [a] -> (b -> c)
 * @description: -  Takes a List of functions as arguments and returns
 * a function waiting to be invoked with a single item. Once the returned
 * function is invoked, it will reduce the List of functions over the item,
 * starting with the first function in the List and working through
 * sequentially. Performs a similar functionality to compose, but applies
 * the functions in reverse order to that of compose.
 * @refer: {compose}
 * @note: @see {@link compose}
 * @param: {function} fn - The function to run initially; may be any arity.
 * @param: {Array} fns - The remaining functions in the pipeline. Each receives
 * its input from the output of the previous function. Therefore each of these
 * functions must be unary.
 * @returns: {function} - Returns a function waiting for the item over which
 * to reduce the functions.
 */
function pipe(fn, ...fns) {
    return function _pipe(...args) {
        return fns.reduce(function pipeReduce(item, f) {
            return f(item);
        }, fn(...args));
    };
}

/**
 * ifElse :: Function -> ( Function -> ( Function -> (a -> b) ) )
 * @description: Takes a predicate function that is applied to the data; If a truthy value
 * is returned from the application, the provided ifFunc argument will be
 * invoked, passing the data as an argument, otherwise the elseFunc is
 * invoked with the data as an argument.
 * @type: {function}
 * @predicate {function}
 * @ifFunc {function}
 * @elseFunc {function}
 * @data {*}
 * @returns {*} - returns the result of invoking the ifFunc or elseFunc
 * on the data
 */
var ifElse = curry(function _ifElse(predicate, ifFunc, elseFunc, data) {
    if (predicate(data)) return ifFunc(data);
    return elseFunc(data);
});

/**
 *
 * @type {function}
 * @param {function} predicate
 * @param {function} ifFunc
 * @param {*} ifArg
 * @param {*} thatArg
 */
var ifThisThenThat = curry(function _ifThisThenThat(predicate, ifFunc, ifArg, thatArg) {
    if (predicate(ifArg)) return ifFunc(thatArg);
    return thatArg;
});

/**
 * when :: Function -> (Function -> (a -> b))
 * Similar to ifElse, but no 'elseFunc' argument. Instead, if the application
 * of the predicate to the data returns truthy, the transform is applied to
 * the data. Otherwise, the data is returned without invoking the transform.
 * @predicate {function}
 * @transform {function}
 * @data {*}
 * @returns {*}
 */
var when = curry(function _when(predicate, transform, data) {
    if (predicate(data)) return transform(data);
    return data;
});

/**
 *
 * @type {function}
 * @param {function} predicate
 * @param {function} transform
 * @param {*} data
 * @returns {*}
 */
var whenNot = curry(function _whenNot(predicate, transform, data) {
    if (!predicate(data)) return transform(data);
    return data;
});

/**
 *
 * @type {function}
 * @param {number} offset
 * @param {Array} list
 * @returns {*}
 */
var nth = curry(function nth(offset, list) {
    var idx = offset < 0 ? list.length + offset : offset;
    return 'string' === typeof list ? list.charAt(idx) : list[idx];
});

/**
 * wrap :: a -> [a]
 * Takes any value of any type and returns an array containing
 * the value passed as its only item
 *
 * @param {*} data - Any value, any type
 * @returns {[*]} - Returns an array of any value, any type
 */
function wrap(data) {
    return [data];
}

/**
 *
 * @param a
 * @returns {string}
 */
function type(a) {
    return typeof a;
}

/**
 * isArray :: a -> Boolean
 *
 * @param data
 * @returns {boolean}
 */
function isArray(data) {
    return Array.isArray(data);
}

/**
 * isObject :: a -> Boolean
 *
 * @param item
 * @returns {boolean}
 */
function isObject(item) {
    return _helpers.javaScriptTypes.object === type(item) && null !== item;
}

/**
 * isFunction :: a -> Boolean
 *
 * @param fn
 * @returns {boolean}
 */
function isFunction(fn) {
    return _helpers.javaScriptTypes.function === type(fn);
}

/**
 *
 * @param num
 * @returns {boolean}
 */
function isNumber(num) {
    return _helpers.javaScriptTypes.number === type(num);
}

/**
 *
 * @param str
 * @returns {boolean}
 */
function isString(str) {
    return _helpers.javaScriptTypes.string === type(str);
}

/**
 *
 * @param bool
 * @returns {boolean}
 */
function isBoolean(bool) {
    return _helpers.javaScriptTypes.boolean === type(bool);
}

/**
 *
 * @param sym
 * @returns {boolean}
 */
function isSymbol(sym) {
    return _helpers.javaScriptTypes.symbol === type(sym);
}

/**
 *
 * @param n
 * @returns {string|boolean}
 */
function isNull(n) {
    return type(n) && null === n;
}

/**
 *
 * @param u
 * @returns {boolean}
 */
function isUndefined(u) {
    return _helpers.javaScriptTypes.undefined === type(u);
}

/**
 *
 * @param x
 * @returns {boolean}
 */
function isNothing(x) {
    return null == x;
}

/**
 *
 * @param x
 * @returns {boolean}
 */
function isSomething(x) {
    return null != x;
}

/**
 * not :: () -> !()
 *
 * @description - Returns a function, that, when invoked, will return the
 * result of the inversion of the invocation of the function argument. The
 * returned function is curried to the same arity as the function argument,
 * so it can be partially applied even after being 'wrapped' inside the
 * not function.
 * @param fn
 * @returns {*}
 */
function not(fn) {
    return curry((0, _helpers.alterFunctionLength)(function _not(...rest) {
        return !fn(...rest);
    }, get('length', fn)));
}

/**
 * or :: (*... -> Boolean) -> ((*... -> Boolean) -> ((*... -> Boolean)))
 *
 * @type {*}
 */
var or = curry(function _or(a, b, item) {
    return a(item) || b(item);
});

/**
 * and :: (*... -> Boolean) -> ((*... -> Boolean) -> ((*... -> Boolean)))
 *
 * @type {*}
 */
var and = curry(function _and(a, b, item) {
    return a(item) && b(item);
});

/**
 *
 * @param {*} x
 * @returns {boolean}
 */
function flip(x) {
    return !x;
}

/**
 *
 * @param {*} x
 * @returns {boolean}
 */
function truthy(x) {
    return !!x;
}

/**
 * @type {flip}
 * @see flip
 * @param {*} x
 * @returns {boolean}
 */
var falsey = flip;

/**
 *
 * @type {function}
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
var add = curry(function _add(x, y) {
    return x + y;
});

/**
 *
 * @type {function}
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
var subtract = curry(function _subtract(x, y) {
    return x - y;
});

/**
 *
 * @type {function}
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
var divide = curry(function _divide(x, y) {
    return x / y;
});

/**
 *
 * @type {function}
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
var multiple = curry(function _multiple(x, y) {
    return x * y;
});

/**
 *
 * @type {function}
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
var modulus = curry(function _modulus(x, y) {
    return x % y;
});

/**
 *
 * @param {Array} first
 * @param {Array} rest
 * @returns {string | Array}
 */
function concat(first, ...rest) {
    if (null == rest || !rest.length) return first;
    return rest.reduce(function _concatStrings(cur, next) {
        return cur.concat(next);
    }, first);
}

/**
 *
 * @param {number} x
 * @returns {number}
 */
function negate(x) {
    return -x;
}

/**
 *
 * @type {function}
 * @param {*} x
 * @param {*} y
 * @returns {boolean}
 */
var equal = curry(function _curry(x, y) {
    return x == y;
});

/**
 *
 * @type {function}
 * @param {*} x
 * @param {*} y
 * @returns {boolean}
 */
var strictEqual = curry(function _strictEqual(x, y) {
    return x === y;
});

/**
 *
 * @type {function}
 * @param {*}
 * @param {*}
 * @returns {boolean}
 */
var notEqual = curry(function _notEqual(x, y) {
    return x != y;
});

/**
 *
 * @type {function}
 * @param {*} x
 * @param {*} y
 * @returns {boolean}
 */
var strictNotEqual = curry(function _strictNotEqual(x, y) {
    return x !== y;
});

/**
 *
 * @type {function}
 * @param {number | string} x
 * @param {number | string} y
 * @returns {boolean}
 */
var greaterThan = curry(function _greaterThan(x, y) {
    return x > y;
});

/**
 *
 * @type {function}
 * @param {string | number} x
 * @param {string | number} y
 * @returns {boolean}
 */
var greaterThanOrEqual = curry(function _greaterThanOrEqual(x, y) {
    return x >= y;
});

/**
 *
 * @type {function}
 * @param {string | number} x
 * @param {string | number} y
 * @returns {boolean}
 */
var lessThan = curry(function _lessThan(x, y) {
    return x < y;
});

/**
 *
 * @type {function}
 * @param {string | number} x
 * @param {string | number} y
 * @returns {boolean}
 */
var lessThanOrEqual = curry(function _lessThanOrEqual(x, y) {
    return x <= y;
});

/**
 * @description:
 * @type: {function}
 * @param: {object} delegator
 * @param: {object} delegate
 * @returns: {boolean}
 */
var delegatesTo = curry(function _delegatesTo(delegator, delegate) {
    return delegate.isPrototypeOf(delegator);
});

/**
 * @description:
 * @type: {function}
 * @param: {object} delegate
 * @param: {object} delegator
 * @returns: {boolean}
 */
var delegatesFrom = curry(function _delegatesFrom(delegate, delegator) {
    return delegate.isPrototypeOf(delegator);
});

/**
 *
 * @type {*}
 */
var arrayLens = curry(function _arrayLens(idx, f, xs) {
    return map(function (val) {
        return arraySet(idx, val, xs);
    }, f(xs[idx]));
});

/**
 *
 * @type {*}
 */
var objectLens = curry(function _objectLens(prop, f, xs) {
    return map(function _map(rep) {
        return objectSet(prop, rep, xs);
    }, f(xs[prop]));
});

/**
 *
 * @type {*}
 */
var view = curry(function _view(lens, target) {
    return lens(kestrel)(target).value;
});

/**
 *
 * @type {*}
 */
var over = curry(function _over(lens, mapFn, target) {
    return lens(function _lens(y) {
        return identity(mapFn(y));
    })(target).value;
});

/**
 *
 * @type {*}
 */
var put = curry(function _put(lens, val, target) {
    return over(lens, kestrel(val), target);
});

/**
 *
 * @param paths
 * @returns {*}
 */
function makeLenses(...paths) {
    return paths.reduce(function _pathReduce(cur, next) {
        var ol = objectLens(next);
        return put(ol, ol, cur);
    }, { num: arrayLens });
}

/**
 *
 * @param path
 * @returns {*}
 */
function lensPath(...path) {
    return compose(...path.map(function _pathMap(p) {
        return 'string' === typeof p ? objectLens(p) : arrayLens(p);
    }));
}

/**
 *
 * @type {function}
 * @param {function} f
 * @param {object} x
 * @returns {identity<T>}
 */
var mapped = curry(function _mapped(f, x) {
    return identity(map(compose(function _mCompose(x) {
        return x.value;
    }, f), x));
});

/**
 * @description: Updates the value stored in a single specified index of an array. The function
 * argument should be some form of a unary projector. The 'projector' function will receive
 * the value stored in the existing array at the specified 'idx' argument location. A new array
 * is returned and the original array remains unchanged.
 * @type {function}
 * @param {function} fn - A function that can operate on a single point of data from the array
 * and a value to be used as an update for the same index in the new array.
 * @param {number} idx - A number representing the zero-based offset of the array; idx determines
 * what value will be passed as the unary argument to the operator function and what index in the
 * newly created array will be altered. If the value is less than zero, the function will use the
 * 'idx' argument value as an offset from the last element in the array.
 * @param {Array} List - The List to update.
 * @returns {Array} - Returns a new array identical to the original array except where the new,
 * computed value is inserted
 */
var adjust = curry(function _adjust(fn, idx, list) {
    if (idx >= list.length || idx < -list.length) {
        return list;
    }
    var _idx = idx < 0 ? list.length + idx : idx,
        _list = list.map(identity);
    _list[_idx] = fn(list[_idx]);
    return _list;
});

/**
 * curry :: (* -> a) -> (* -> a)
 *
 * @param fn
 * @returns {*}
 */
function curry(fn) {
    if (!fn.length || 1 === fn.length) return fn;
    return curryN(fn.length, [], fn);
}

/**
 * Curries a function to a specified arity
 * @param {number} arity - The number of arguments to curry the function for
 * @param {Array} received - An array of the arguments to be applied to the function
 * @param {function} fn - The function to be curried
 * @returns {function | *} - Returns either a function waiting for more arguments to
 * be applied before invocation, or will return the result of the function invocation
 * if the specified number of arguments have been received
 */
function curryN(arity, received, fn) {
    return function _curryN(...rest) {
        var combined = received.concat(rest);
        if (arity > combined.length) return curryN(arity, combined, fn);
        return fn.call(this, ...combined);
    };
}

exports.noop = noop;
exports.identity = identity;
exports.constant = constant;
exports.apply = apply;
exports.once = once;
exports.kestrel = kestrel;
exports.get = get;
exports.set = set;
exports.objectSet = objectSet;
exports.arraySet = arraySet;
exports.nth = nth;
exports.compose = compose;
exports.pipe = pipe;
exports.ifElse = ifElse;
exports.ifThisThenThat = ifThisThenThat;
exports.when = when;
exports.whenNot = whenNot;
exports.wrap = wrap;
exports.type = type;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isFunction = isFunction;
exports.isNumber = isNumber;
exports.isString = isString;
exports.isBoolean = isBoolean;
exports.isSymbol = isSymbol;
exports.isNull = isNull;
exports.isUndefined = isUndefined;
exports.isNothing = isNothing;
exports.isSomething = isSomething;
exports.not = not;
exports.or = or;
exports.and = and;
exports.flip = flip;
exports.truthy = truthy;
exports.falsey = falsey;
exports.add = add;
exports.subtract = subtract;
exports.divide = divide;
exports.multiple = multiple;
exports.modulus = modulus;
exports.concat = concat;
exports.negate = negate;
exports.equal = equal;
exports.strictEqual = strictEqual;
exports.notEqual = notEqual;
exports.strictNotEqual = strictNotEqual;
exports.greaterThan = greaterThan;
exports.greaterThanOrEqual = greaterThanOrEqual;
exports.lessThan = lessThan;
exports.lessThanOrEqual = lessThanOrEqual;
exports.delegatesTo = delegatesTo;
exports.delegatesFrom = delegatesFrom;
exports.arrayLens = arrayLens;
exports.objectLens = objectLens;
exports.view = view;
exports.over = over;
exports.put = put;
exports.makeLenses = makeLenses;
exports.lensPath = lensPath;
exports.mapped = mapped;
exports.adjust = adjust;
exports.curry = curry;
exports.curryN = curryN;
exports.tap = tap;
exports.fork = fork;
exports.sequence = sequence;

},{"./helpers":19}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.alterFunctionLength = exports.generatorProto = exports.shallowClone = exports.deepCopy = exports.deepClone = exports.memoizer = exports.defaultPredicate = exports.defaultGreaterThanComparer = exports.defaultEqualityComparer = exports.sortComparer = exports.observableStatus = exports.sortDirection = exports.javaScriptTypes = undefined;

var _functionalHelpers = require('./functionalHelpers');

/**
 *
 * @type {{function: string, object: string, boolean: string, number: string, symbol: string, string: string, undefined: string}}
 */
var javaScriptTypes = {
    'function': 'function',
    'object': 'object',
    'boolean': 'boolean',
    'number': 'number',
    'symbol': 'symbol',
    'string': 'string',
    'undefined': 'undefined'
};

/**
 *
 * @type {{inactive: number, active: number, paused: number, complete: number}}
 */
var observableStatus = {
    inactive: 0,
    active: 1,
    paused: 2,
    complete: 3
};

/**
 *
 * @type {{ascending: number, descending: number}}
 */
var sortDirection = {
    ascending: 1,
    descending: 2
};

/**
 * @description:
 * @type: {function}
 * @param: {function} keySelector
 * @param: {number} idx1
 * @param: {number} idx2
 * @param: {*} val1
 * @param: {Array} List
 * @param: {string} dir
 * @returns: {number}
 */

var sortComparer = (0, _functionalHelpers.curry)(function _sortComparer(keySelector, idx1, idx2, val1, source, dir) {
    var val2 = keySelector(source[idx2]);
    var c = val1 > val2 ? 1 : val1 === val2 ? idx1 - idx2 : -1;
    return dir === sortDirection.ascending ? c : -c;
});

/**
 *
 * @type {function}
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
var defaultEqualityComparer = (0, _functionalHelpers.curry)(function _defaultEqualityComparer(a, b) {
    return a === b;
});

/**
 *
 * @type {function}
 * @param {*} a
 * @param {*} b
 * @returns {boolean}
 */
var defaultGreaterThanComparer = (0, _functionalHelpers.curry)(function defaultGreaterThanComparer(a, b) {
    return a > b;
});

/**
 * @type {function}
 * @returns {boolean}
 */
var defaultPredicate = (0, _functionalHelpers.kestrel)(true);

/**
 * @description - Prototype of a generator; used to detect if a function
 * argument is a generator or a regular function.
 * @type {Object}
 */
var generatorProto = Object.getPrototypeOf(function* _generator() {});

//TODO: this will have to be changed as the false value could be a legit value for a collection...
//TODO:... I'm thinking reusing the 'flag' object to indicate the end of the List for the .next functions
//TODO: should be reusable here to indicate a 'false' value
function memoizer(comparer) {
    comparer = comparer || defaultEqualityComparer;
    //TODO: need to make another change here... ideally, no queryable function should ever pass an undefined value to
    //TODO: the cacher, but I don't want to depend on that. The problem here is that, if the defaultEqualityComparer is
    //TODO: not used, then an exception could well be thrown if the comparer tries to access a property on or invoke the
    //TODO: undefined value that the cacher's array is initialized with. Likely the best approach is to examine the item
    //TODO to be memoized, and if it is undefined, then Just return true
    var items = []; //initialize the array with an undefined value as we don't accept that as a legit value for the comparator
    return function _memoizeThis(item) {
        if (undefined === item || items.some(function _checkEquality(it) {
            return comparer(it, item);
        })) {
            return true;
        }
        items[items.length] = item;
        return false;
    };
}

function newMemoizer(fn, comparer = defaultEqualityComparer) {
    var items = [];

    return function _memoizedFunc(...args) {
        if (!args.length || items.some(function _checkEquality(it) {
            return comparer(it, args);
        })) return true;
        items[items.length] = args;
        return fn(...args);
    };
}

function memoized(fn, keyMaker) {
    var lookup = new Map();
    return function _memoized(...args) {
        var key = javaScriptTypes.function === typeof keyMaker ? keyMaker(...args) : args;
        return lookup[key] || (lookup[key] = fn(...args));
    };
}

/**
 *
 * @param {*} obj
 * @returns {object}
 */
function deepClone(obj) {
    if (null == obj || javaScriptTypes.object !== typeof obj) return obj;

    if (Array.isArray(obj)) return deepCopy(obj);

    var temp = {};
    Object.keys(obj).forEach(function _cloneGridData(field) {
        temp[field] = deepClone(obj[field]);
    });
    return temp;
}

/**
 *
 * @param {Array} arr
 * @returns {Array}
 */
function deepCopy(arr) {
    var length = arr.length,
        newArr = new arr.constructor(length),
        index = -1;
    while (++index < length) {
        newArr[index] = deepClone(arr[index]);
    }
    return newArr;
}

/**
 *
 * @param {object} obj
 * @returns {object}
 */
function shallowClone(obj) {
    var clone = {};
    for (var p in obj) {
        clone[p] = obj[p];
    }
    return clone;
}

/**
 *
 * @type {function}
 * @param {number} len
 * @param {function} fn
 * @returns {function}
 */
var alterFunctionLength = (0, _functionalHelpers.curry)(function _alterFunctionLength(len, fn) {
    return Object.defineProperty(fn, 'length', {
        value: len
    });
});

exports.javaScriptTypes = javaScriptTypes;
exports.sortDirection = sortDirection;
exports.observableStatus = observableStatus;
exports.sortComparer = sortComparer;
exports.defaultEqualityComparer = defaultEqualityComparer;
exports.defaultGreaterThanComparer = defaultGreaterThanComparer;
exports.defaultPredicate = defaultPredicate;
exports.memoizer = memoizer;
exports.deepClone = deepClone;
exports.deepCopy = deepCopy;
exports.shallowClone = shallowClone;
exports.generatorProto = generatorProto;
exports.alterFunctionLength = alterFunctionLength;

},{"./functionalHelpers":18}],20:[function(require,module,exports){
'use strict';

var _queryable = require('./queryObjects/queryable');

var _list = require('./list_monad/List');

var _observable = require('./streams/observable');

window.queryable = _queryable.queryable || {};
window.list = _list.list || {};
window.observable = _observable.observable || {};

},{"./list_monad/list":25,"./queryObjects/queryable":35,"./streams/observable":36}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.distinct = undefined;

var _helpers = require('../helpers');

function distinct(source, comparer = _helpers.defaultEqualityComparer) {
    var havePreviouslyViewed = (0, _helpers.memoizer)(comparer);

    return function* distinctIterator() {
        for (let item of source) {
            if (!havePreviouslyViewed(item)) yield item;
        }
    };
}

exports.distinct = distinct;

},{"../helpers":19}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.where = exports.ofType = exports.distinct = undefined;

var _distinct = require('./distinct');

var _ofType = require('./ofType');

var _where = require('./where');

exports.distinct = _distinct.distinct;
exports.ofType = _ofType.ofType;
exports.where = _where.where;

},{"./distinct":21,"./ofType":23,"./where":24}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ofType = undefined;

var _helpers = require('../helpers');

function ofType(source, dataType) {
    return function* ofTypeIterator() {
        function _checkTypeKeys(key) {
            return key in objItem;
        }
        function _checkItemKeys(key) {
            return key in dataType;
        }

        if (dataType in _helpers.javaScriptTypes) {
            for (let item of source) {
                if (_helpers.javaScriptTypes[dataType] === typeof item) yield item;
            }
        } else {
            if (typeof dataType === _helpers.javaScriptTypes.function) {
                for (let item of source) {
                    if (item === dataType) yield item;
                }
            } else if (null === dataType) {
                for (let item of source) {
                    if (dataType === item) yield item;
                }
            } else {
                for (var objItem of source) {
                    if (dataType.isPrototypeOf(objItem)) yield objItem;else if (_helpers.javaScriptTypes.object === typeof objItem && null !== objItem && Object.keys(dataType).every(_checkTypeKeys) && Object.keys(objItem).every(_checkItemKeys)) {
                        yield objItem;
                    }
                }
            }
        }
    };
}

exports.ofType = ofType;

},{"../helpers":19}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function where(source, predicate) {
    return function* whereIterator() {
        for (let item of source) {
            if (false !== predicate(item)) yield item;
        }
    };
}

exports.where = where;

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.list_core = exports.list = undefined;

var _collationFunctions = require('../collation/collationFunctions');

var _evaluationFunctions = require('../evaluation/evaluationFunctions');

var _limitationFunctions = require('../limitation/limitationFunctions');

var _projectionFunctions = require('../projection/projectionFunctions');

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

/**
 * @description: Object that contains the core functionality of a List; both the m_list and ordered_m_list
 * objects delegate to this object for all functionality besides orderBy/orderByDescending
 * and thenBy/thenByDescending respectively. Getter/setters are present for state-manipulation
 * at the consumer-object level, as well as to provide default values for a consumer-level
 * object at creation if not specified.
 * @type {{
 * value,
 * value,
 * mapWith: list_core._map,
 * groupBy: list_core._groupBy,
 * groupByDescending: list_core._groupByDescending,
 * flatten: list_core._flatten,
 * deepFlatten: list_core._deepFlatten,
 * deepMap: list_core._deepMap,
 * addFront: list_core._addFront,
 * concat: list_core._concat,
 * except: list_core._except,
 * groupJoin: list_core._groupJoin,
 * intersect: list_core._intersect,
 * join: list_core._join,
 * union: list_core._union,
 * zip: list_core._zip,
 * where: list_core._where,
 * ofType: list_core._ofType,
 * distinct: list_core._distinct,
 * take: list_core._take,
 * takeWhile: list_core._takeWhile,
 * skip: list_core._skip,
 * skipWhile: list_core._skipWhile,
 * any: list_core._any,
 * all: list_core._all,
 * contains: list_core._contains,
 * first: list_core._first,
 * fold: list_core._fold,
 * last: list_core._last,
 * count: list_core._count,
 * toArray: list_core._toArray,
 * toSet: list_core._toSet,
 * reverse: list_core._reverse,
 * [Symbol.iterator]: list_core._iterator
 * }}
 */
var list_core = {
    //Using getters for these properties because there's a chance the setting and/or getting
    //functionality could change; this will allow for a consistent interface while the
    //logic beneath changes

    /**
     * @description: Getter for the underlying source object of the List
     * @returns: {*}
     */
    get value() {
        return this._value;
    },

    /**
     * @description: Setter for the underlying source object of the List
     * @param: val
     */
    set value(val) {
        this._value = val;
    },

    /**
     * @description:
     * @param: {function} mapFunc
     * @returns: {*}
     */
    map: function _map(mapFunc) {
        return createListDelegator(this, (0, _projectionFunctions.map)(this, mapFunc));
    },

    /**
     * @description:
     * @param: {function} keySelector
     * @param: {function} comparer
     * @returns: {m_list}
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
        return createListDelegator(this, (0, _projectionFunctions.groupBy)(this, groupObj));
    },

    /**
     * @description:
     * @param: {function} keySelector
     * @param: {function} comparer
     * @returns: {*}
     */
    groupByDescending: function _groupByDescending(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: 'desc' }];
        return createListDelegator(this, (0, _projectionFunctions.groupBy)(this, groupObj));
    },

    /**
     * @description:
     * @returns:
     */
    flatten: function _flatten() {
        return createListDelegator(this, (0, _projectionFunctions.flatten)(this));
    },

    /**
     * @description:
     * @returns:
     */
    deepFlatten: function _deepFlatten() {
        return createListDelegator(this, (0, _projectionFunctions.deepFlatten)(this));
    },

    /**
     * @description:
     * @param: {function} fn
     * @returns: {*}
     */
    deepMap: function _deepMap(fn) {
        return createListDelegator(this, (0, _projectionFunctions.deepMap)(this, fn));
    },

    /**
     * @description:
     * @param: enumerable
     * @returns: {*}
     */
    addFront: function _addFront(enumerable) {
        return createListDelegator(this, (0, _collationFunctions.addFront)(this, enumerable));
    },

    /**
     * @description: Concatenates two or more lists by appending the "method's" List argument(s) to the
     * List's value. This function is a deferred execution call that returns
     * a new queryable object delegator instance that contains all the requisite
     * information on how to perform the operation.
     * @param: {Array | *} enumerables
     * @returns: {*}
     */
    concat: function _concat(...enumerables) {
        return createListDelegator(this, (0, _collationFunctions.concat)(this, enumerables, enumerables.length));
    },

    /**
     * @description: Produces a List that contains the objectSet difference between the queryable object
     * and the List that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * equality comparer.
     * @param: enumerable
     * @param: {function} comparer
     * @returns: {*}
     */
    except: function _except(enumerable, comparer) {
        return createListDelegator(this, (0, _collationFunctions.except)(this, enumerable, comparer));
    },

    /**
     * @description: Correlates the items in two lists based on the equality of a key and groups
     * all items that share the same key. A comparer function may be provided to
     * the function that determines the equality/inequality of the items in each
     * List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @param: {Array|List} inner
     * @param: {function} outerSelector
     * @param: {function} innerSelector
     * @param: {function} projector
     * @param: {function} comparer
     * @returns: {*}
     */
    groupJoin: function _groupJoin(inner, outerSelector, innerSelector, projector, comparer) {
        return createListDelegator(this, (0, _collationFunctions.groupJoin)(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     * @description: Produces the objectSet intersection of the List object's value and the List
     * that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @param: enumerable
     * @param: {function} comparer
     * @returns: {*}
     */
    intersect: function _intersect(enumerable, comparer) {
        return createListDelegator(this, (0, _collationFunctions.intersect)(this, enumerable, comparer));
    },

    /**
     * @description: Correlates the items in two lists based on the equality of items in each
     * List. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param: {Array|List} inner
     * @param: {function} outerSelector
     * @param: {function} innerSelector
     * @param: {function} projector
     * @param: {function} comparer
     * @returns: {*}
     */
    join: function _join(inner, outerSelector, innerSelector, projector, comparer) {
        return createListDelegator(this, (0, _collationFunctions.join)(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     * @description: Produces the objectSet union of two lists by selecting each unique item in both
     * lists. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param: enumerable
     * @param: {function} comparer
     * @returns: {*}
     */
    union: function _union(enumerable, comparer) {
        return createListDelegator(this, (0, _collationFunctions.union)(this, enumerable, comparer));
    },

    /**
     * @description: Produces a List of the items in the queryable object and the List passed as
     * a function argument. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param: {function} selector
     * @param: enumerable
     * @returns {*}
     */
    zip: function _zip(selector, enumerable) {
        return createListDelegator(this, (0, _collationFunctions.zip)(this, selector, enumerable));
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {*}
     */
    where: function _where(predicate) {
        return createListDelegator(this, (0, _limitationFunctions.where)(this, predicate));
    },

    /**
     * @description:
     * @param: type
     * @returns: {*}
     */
    ofType: function _ofType(type) {
        return createListDelegator(this, (0, _limitationFunctions.ofType)(this, type));
    },

    /**
     * @description:
     * @param: {function} comparer
     * @returns: {*}
     */
    distinct: function _distinct(comparer) {
        return createListDelegator(this, (0, _limitationFunctions.distinct)(this, comparer));
    },

    /**
     * @description:
     * @param: {number} amt
     * @returns: {Array}
     */
    take: function _take(amt) {
        if (!amt) return [];
        var res = [],
            idx = 0;

        for (let item of this) {
            if (idx < amt) res[res.length] = item;else break;
            ++idx;
        }
        return res;
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {Array}
     */
    takeWhile: function _takeWhile(predicate = _helpers.defaultPredicate) {
        var res = [];

        for (let item of this.value) {
            if (predicate(item)) res[res.length] = item;else {
                return res;
            }
        }
    },

    /**
     * @description: Skips over a specified number of items in the source and returns the
     * remaining items. If no amount is specified, an empty array is returned;
     * Otherwise, an array containing the items collected from the source is
     * returned.
     * @param: {number} amt - The number of items in the source to skip before
     * returning the remainder.
     * @returns: {*}
     */
    skip: function _skip(amt) {
        var idx = 0,
            res = [];

        for (let item of this.value) {
            if (idx >= amt) res[res.length] = item;
            ++idx;
        }
        return res;
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {Array}
     */
    skipWhile: function _skipWhile(predicate = _helpers.defaultPredicate) {
        var hasFailed = false,
            res = [];

        for (let item of this.value) {
            if (!hasFailed) {
                if (!predicate(item)) {
                    hasFailed = true;
                    res[res.length] = item;
                }
            } else res[res.length] = item;
        }
        return res;
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {*}
     */
    any: function _any(predicate = _helpers.defaultPredicate) {
        return (0, _evaluationFunctions.any)(this, predicate);
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {*}
     */
    all: function _all(predicate = _helpers.defaultPredicate) {
        return (0, _evaluationFunctions.all)(this, predicate);
    },

    /**
     * @description:
     * @param: val
     * @param: {function} comparer
     * @returns: {*}
     */
    contains: function _contains(val, comparer) {
        return (0, _evaluationFunctions.contains)(this, val, comparer);
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {*}
     */
    first: function _first(predicate = _helpers.defaultPredicate) {
        return (0, _evaluationFunctions.first)(this, predicate);
    },

    /**
     * @description:
     * @param: {function} fn
     * @param: initial
     * @returns: {*}
     */
    fold: function _fold(fn, initial) {
        return (0, _evaluationFunctions.fold)(this, fn, initial);
    },

    /**
     * @description:
     * @see: list_core.fold
     * @param: fn
     * @param: initial
     * @returns:
     */
    reduce: function _reduce(fn, initial) {
        return (0, _evaluationFunctions.fold)(this, fn, initial);
    },

    /**
     * @description:
     * @param: {function} predicate
     * @returns: {*}
     */
    last: function _last(predicate = _helpers.defaultPredicate) {
        return (0, _evaluationFunctions.last)(this, predicate);
    },

    /**
     * @description:
     * @returns: {*}
     */
    count: function _count() {
        return (0, _evaluationFunctions.count)(this);
    },

    /**
     * @description:
     * @returns: {Array}
     */
    toArray: function _toArray() {
        return Array.from(this);
    },

    /**
     * @description:
     * @returns: {Set}
     */
    toSet: function _toSet() {
        return new Set(this);
    },

    /**
     * @description:
     * @param: {*} item
     * @returns: {m_list}
     */
    of: function _of(item) {
        return list(item);
    },

    /**
     * @description: Evaluates the current List instance and returns a new List
     * instance with the evaluated data as its source. This is used when the
     * initial List's data must be iterated more than once as it will cause
     * the evaluation to happen each item it is iterated. Rather the pulling the
     * initial data through the List's 'pipeline' every time, this property will
     * allow you to evaluate the List's data and store it in a new List that can
     * be iterated many times without needing to re-evaluate. It is effectively
     * a syntactical shortcut for: List.from(listInstance.data);
     * @returns: {m_list}
     */
    toEvaluatedList: function _toEvaluatedList() {
        return list.from(this.data /* the .data property is a getter function that forces evaluation */);
    },

    /**
     * @description:
     * @returns: {Array<*>}
     */
    reverse: function _reverse() {
        return Array.from(this).reverse();
    },

    /**
     * @description: Base iterator to which all queryable_core delegator objects
     * delegate to for iteration if for some reason an iterator wasn't
     * objectSet on the delegator at the time of creation.
     */
    [Symbol.iterator]: function* _iterator() {
        for (let item of this.value) yield item;
    }
};

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the list_core object, also exposes .orderBy and .orderByDescending
 * functions. These functions allow a consumer to sort a List's data by
 * a given key.
 * @type: {list_core}
 */
var m_list = Object.create(list_core, {
    /**
     * @description:
     * @param: keySelector
     * @param: comparer
     * @returns: {*}
     */
    orderBy: {
        value: function _orderBy(keySelector, comparer) {
            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
            return createListDelegator(this, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
        }
    },
    /**
     * @description:
     * @param: keySelector
     * @param: comparer
     * @returns: {*}
     */
    orderByDescending: {
        value: function _orderByDescending(keySelector, comparer) {
            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'desc' }];
            return createListDelegator(this, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
        }
    }
});

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the queryable_core object, also exposes .thenBy and .thenByDescending
 * functions. These functions allow a consumer to sort more on than a single column.
 * @type: {list_core}
 */
var ordered_m_list = Object.create(list_core, {
    _appliedSorts: {
        value: []
    },
    //In these two functions, feeding the call to "orderBy" with the .value property of the List delegate
    //rather than the delegate itself, effectively excludes the previous call to the orderBy/orderByDescending
    //since the iterator exists on the delegate, not on its value. Each subsequent call to thenBy/thenByDescending
    //will continue to exclude the previous call's iterator... effectively what we're doing is ignoring all the
    //prior calls made to orderBy/orderByDescending/thenBy/thenByDescending and calling it once but with an array
    //of the the requested sorts.
    /**
     * @description:
     * @param: keySelector
     * @param: comparer
     * @returns: {*}
     */
    thenBy: {
        value: function _thenBy(keySelector, comparer) {
            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'asc' });
            return createListDelegator(this.value, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
        }
    },
    /**
     * @description:
     * @param: keySelector
     * @param: comparer
     * @returns: {*}
     */
    thenByDescending: {
        value: function thenByDescending(keySelector, comparer) {
            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'desc' });
            return createListDelegator(this.value, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
        }
    }
});

//TODO: functional
//TODO: functional programming
//TODO: FP
//TODO: monad
//TODO: functor
//TODO: container
//TODO: JavaScript
//TODO: JS
//TODO: JunctionalS
//TODO: JunctorS
//TODO: lanoitcunf
//TODO: rotcnuf
//TODO: danom
//TODO: tpircSavaJ
//TODO: Junctional FavaScript

var setValue = (0, _functionalHelpers.set)('value'),
    setIterator = (0, _functionalHelpers.set)(Symbol.iterator),
    isIterator = (0, _functionalHelpers.apply)((0, _functionalHelpers.delegatesFrom)(_helpers.generatorProto)),
    create = (0, _functionalHelpers.ifElse)(_functionalHelpers.isSomething, createOrderedList, createList);

function createList() {
    return Object.create(m_list, {
        data: {
            get: function _getData() {
                return Array.from(this);
            }
        }
    });
}

function createOrderedList(sorts) {
    return (0, _functionalHelpers.set)('_appliedSorts', sorts, Object.create(ordered_m_list, {
        data: {
            get: function _getData() {
                return Array.from(this);
            }
        }
    }));
}

function createListDelegator(value, iterator, sortObj) {
    return (0, _functionalHelpers.compose)((0, _functionalHelpers.when)(isIterator(iterator), setIterator(iterator)), setValue)(value, create(sortObj));
}

/**
 * @description: Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @param: {*} source - Any type, any value; used as the underlying source of the List
 * @returns: {m_list} - A new List instance with the value provided as the underlying source.
 */
function list(source) {
    //TODO: should I exclude strings from being used as a source directly, or allow it because
    //TODO: they have an iterator?
    return createListDelegator(source && source[Symbol.iterator] ? source : (0, _functionalHelpers.wrap)(source));
}

/**
 * @description: Convenience function for create a new List instance; internally calls List.
 * @see: List
 * @param: {*} source - Any type, any value; used as the underlying source of the List
 * @returns: {m_list} - A new List instance with the value provided as the underlying source.
 */
list.from = function _from(source) {
    return list(source);
};

/**
 * @description: Alias for List.from
 * @see: List.from
 * @type: {function}
 * @param: {*}
 * @returns: {m_list}
 */
list.of = list.from;

/**
 * @description: Extension function that allows new functionality to be applied to
 * the queryable object
 * @param: {string} propName - The name of the new property that should exist on the List; must be unique
 * @param: {function} fn - A function that defines the new List functionality and
 * will be called when this new List property is invoked.
 *
 * NOTE: The fn parameter must be a non-generator function that takes one or more
 * arguments. If this new List function should be an immediately evaluated
 * function (like: take, any, reverse, etc.), it merely needs the accept one or more
 * arguments and know how to iterate the source. In the case of an immediately evaluated
 * function, the return type can be any javascript type. The first argument is always the
 * previous List instance that must be iterated. Additional arguments may be specified
 * if desired.
 *
 * If the function's evaluation should be deferred it needs to work a bit differently.
 * In this case, the function should accept one or more arguments, the first and only
 * required argument being the underlying source of the List object. This underlying
 * source can be anything with an iterator (generator, array, mapWith, set, another queryable).
 * Any additional arguments that the function needs should be specified in the signature.
 * The return value of the function should be a generator that knows how to iterate the
 * underlying source. If the generator should operate like most List functions, i.e.
 * take a single item, process it, and then yield it out before asking for the next, a
 * for-of loop is the preferred method for employment. However, if the generator needs
 * all of the underlying data upfront (like orderBy and groupBy), Array.from is the
 * preferred method. Array.from will 'force' all the underlying List instances
 * to evaluate their data before it is handed over in full to the generator. The generator
 * can then act with full knowledge of the data and perform whatever operation is needed
 * before ultimately yielding out a single item at a time. If your extension function
 * needs to yield out all items at once, then that function is not a lazy evaluation
 * function and should be constructed like the immediately evaluated functions described
 * above.
 */
list.extend = function _extend(propName, fn) {
    if (!(propName in m_list) && !(propName in ordered_m_list)) {
        list_core[propName] = function (...args) {
            return createListDelegator(this, fn(this, ...args));
        };
    }
};

exports.list = list;
exports.list_core = list_core;

},{"../collation/collationFunctions":2,"../evaluation/evaluationFunctions":14,"../functionalHelpers":18,"../helpers":19,"../limitation/limitationFunctions":22,"../projection/projectionFunctions":32}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deepFlatten = undefined;

var _functionalHelpers = require('../functionalHelpers');

function deepFlatten(source) {
    return function* iterator() {
        var unyieldedData = [],
            res;

        for (let item of source) {
            res = flatteningFunc(item);

            if ((0, _functionalHelpers.isArray)(res)) unyieldedData = unyieldedData.concat(Array.prototype.concat.apply([], res));
            if (unyieldedData.length) yield unyieldedData.shift();else yield res;
        }
        while (unyieldedData.length) yield unyieldedData.shift();
    };
}

function flatteningFunc(data) {
    return (0, _functionalHelpers.ifElse)(_functionalHelpers.isArray, mapData, (0, _functionalHelpers.when)(_functionalHelpers.isObject, (0, _functionalHelpers.when)(objectContainsOnlyArrays, getObjectKeysAsArray)), data);
}

function mapData(data) {
    return Array.prototype.concat.apply([], data.map(function flattenArray(item) {
        return flatteningFunc(item);
    }));
}

function getObjectKeysAsArray(data) {
    return Object.keys(data).map(function _flattenKeys(key) {
        return flatteningFunc(data[key]);
    });
}

function objectContainsOnlyArrays(data) {
    return Object.keys(data).every(function _isMadeOfArrays(key) {
        return (0, _functionalHelpers.isArray)(data[key]);
    });
}

exports.deepFlatten = deepFlatten;

},{"../functionalHelpers":18}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deepMap = undefined;

var _functionalHelpers = require('../functionalHelpers');

var _list = require('../list_monad/List');

function deepMap(source, fn) {
    return function* deepMapIterator() {
        var results = [];
        for (let item of source) {
            let res = recursiveMap(item);
            if (results.length) {
                results = results.concat(res);
                yield results.shift();
            } else if (undefined !== res) {
                if ((0, _functionalHelpers.isArray)(res)) {
                    yield res.shift();
                    results = results.concat(res);
                } else yield res;
            }
        }

        while (results.length) yield results.shift();

        function recursiveMap(item) {
            if ((0, _functionalHelpers.isArray)(item)) {
                var res = [];
                for (let it of item) {
                    res = res.concat(recursiveMap(it));
                }
                return res;
            }
            return fn(item);
        }
    };
}

function flatMap(source, fn) {
    return function* flatMapIterator() {
        var results = [];
        for (let item of source) {
            var res = fn(item);
            if (res.length) {
                results = results.concat(res);
                yield results.shift();
            } else if (undefined !== res) {
                if ((0, _functionalHelpers.isArray)(res)) {
                    yield res.shift();
                    results = results.concat(res);
                }
            } else yield res;
        }

        while (results.length) yield results.shift();
    };
}

function flatMap2(source, fn) {
    return function* flatMap2Iterator() {
        for (let item of source) {
            if (null != item && item.map && 'function' === typeof item.map) {
                var res;
                if (_list.list_core.isPrototypeOf(item)) res = item.map(fn).data;else res = item.map(fn);

                yield res;
            } else yield fn(item);
        }
    };
}

exports.deepMap = deepMap;

},{"../functionalHelpers":18,"../list_monad/list":25}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.flatten = undefined;

var _functionalHelpers = require('../functionalHelpers');

function flatten(source) {
    return function* flattenIterator() {
        var unyieldedData = [];

        for (let item of source) {
            if ((0, _functionalHelpers.isArray)(item)) unyieldedData = unyieldedData.concat(item);
            if (unyieldedData.length) yield unyieldedData.shift();else yield item;
        }

        while (unyieldedData.length) yield unyieldedData.shift();
    };
}

exports.flatten = flatten;

},{"../functionalHelpers":18}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupBy = undefined;

var _functionalHelpers = require('../functionalHelpers');

var _sortHelpers = require('./sortHelpers');

var _queryDelegatorCreators = require('../queryObjects/queryDelegatorCreators');

function groupBy(source, groupObject) {
    return function* groupByIterator() {
        //gather all data from the source before grouping
        var groupedData = groupData((0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, source), groupObject);
        for (let item of groupedData) yield (0, _queryDelegatorCreators.createNewQueryableDelegator)(item);
    };
}

function groupData(data, groupObject) {
    var sortedData = (0, _sortHelpers.sortData)(data, groupObject),
        retData = [];

    sortedData.forEach(function _groupSortedData(item) {
        let grp = retData;
        groupObject.forEach(function _createGroupsByFields(group) {
            grp = findGroup(grp, group.keySelector(item));
        });
        grp[grp.length] = item;
    });

    return retData;
}

function findGroup(arr, field) {
    var grp;
    if (arr.some(function _findGroup(group) {
        if ((0, _functionalHelpers.get)('key', group) === field) {
            grp = group;
            return true;
        }
    })) return grp;else {
        grp = [];
        (0, _functionalHelpers.objectSet)(field, 'key', grp);
        arr.push(grp);
        return grp;
    }
}

exports.groupBy = groupBy;

},{"../functionalHelpers":18,"../queryObjects/queryDelegatorCreators":34,"./sortHelpers":33}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.map = undefined;

var _helpers = require('../helpers');

function map(source, fn) {
    return function* mapIterator() {
        for (let item of source) {
            let res = fn(item);
            if (_helpers.javaScriptTypes.undefined !== res) yield res;
        }
    };
}

exports.map = map;

},{"../helpers":19}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.orderBy = undefined;

var _functionalHelpers = require('../functionalHelpers');

var _sortHelpers = require('./sortHelpers');

var _helpers = require('../helpers');

//TODO: I should probably make this take either a "fields" object, or a selector function
//TODO: It also seems an insertion sort would work better in terms of lazy evaluation... of course, if
//TODO: I can chain multiple calls to "orderBy/orderByDescending/thenBy/thenByDescending" together
//TODO: beneath the covers, then I'd need all the data up front.

//TODO: Since group by functionality will work the same way, it's probably best to think this through
//TODO: first before committing to a mode of functionality  now.
function orderBy(source, orderObject) {
    return function* orderByIterator() {
        //gather all data from the source before sorting
        var orderedData = (0, _sortHelpers.sortData)((0, _functionalHelpers.when)((0, _functionalHelpers.not)(_functionalHelpers.isArray), Array.from, source), orderObject);
        for (let item of orderedData) {
            if (_helpers.javaScriptTypes.undefined !== item) yield item;
        }
    };
}

exports.orderBy = orderBy;

},{"../functionalHelpers":18,"../helpers":19,"./sortHelpers":33}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orderBy = exports.map = exports.groupBy = exports.flatten = exports.deepMap = exports.deepFlatten = undefined;

var _deepFlatten = require('./deepFlatten');

var _deepMap = require('./deepMap');

var _flatten = require('./flatten');

var _groupBy = require('./groupBy');

var _map = require('./mapWith');

var _orderBy = require('./orderBy');

exports.deepFlatten = _deepFlatten.deepFlatten;
exports.deepMap = _deepMap.deepMap;
exports.flatten = _flatten.flatten;
exports.groupBy = _groupBy.groupBy;
exports.map = _map.map;
exports.orderBy = _orderBy.orderBy;

},{"./deepFlatten":26,"./deepMap":27,"./flatten":28,"./groupBy":29,"./map":30,"./orderBy":31}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.quickSort = exports.sortData = undefined;

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

function sortData(data, sortObject) {
    var sortedData = data;
    sortObject.forEach(function _sortItems(sort, index) {
        let comparer = sort.direction === 'asc' ? sort.comparer : (0, _functionalHelpers.not)(sort.comparer);
        if (index === 0) sortedData = mergeSort(data, sort.keySelector, comparer);else {
            let sortedSubData = [],
                itemsToSort = [],
                prevKeySelector = sortObject[index - 1].keySelector;
            sortedData.forEach(function _sortData(item, idx) {
                //TODO: re-examine this logic; I think it is in reverse order
                if (!itemsToSort.length || (0, _helpers.defaultEqualityComparer)(prevKeySelector(itemsToSort[0]), prevKeySelector(item))) itemsToSort.push(item);else {
                    //TODO: see if there's a realistic way that length === 1 || 2 could be combined into one statement
                    if (itemsToSort.length === 1) sortedSubData = sortedSubData.concat(itemsToSort);else if (itemsToSort.length === 2) {
                        sortedSubData = comparer(sort.keySelector(itemsToSort[0]), sort.keySelector(itemsToSort[1])) ? sortedSubData.concat(itemsToSort) : sortedSubData.concat(itemsToSort.reverse());
                    } else {
                        sortedSubData = sortedSubData.concat(mergeSort(itemsToSort, sort.keySelector, comparer));
                    }
                    itemsToSort.length = 0;
                    itemsToSort.push(item);
                }
                if (idx === sortedData.length - 1) {
                    sortedSubData = sortedSubData.concat(mergeSort(itemsToSort, sort.keySelector, comparer));
                }
            });
            sortedData = sortedSubData;
        }
    });
    return sortedData;
}

function mergeSort(data, keySelector, comparer) {
    if (data.length < 2) return data;
    var middle = parseInt(data.length / 2);
    return merge(mergeSort(data.slice(0, middle), keySelector, comparer), mergeSort(data.slice(middle), keySelector, comparer), keySelector, comparer);
}

function merge(left, right, keySelector, comparer) {
    if (!left.length) return right;
    if (!right.length) return left;

    if (comparer(keySelector(left[0]), keySelector(right[0]))) return [(0, _helpers.deepClone)(left[0])].concat(merge(left.slice(1, left.length), right, keySelector, comparer));
    return [(0, _helpers.deepClone)(right[0])].concat(merge(left, right.slice(1, right.length), keySelector, comparer));
}

function quickSort(source, keySelector, keyComparer) {
    var count = source.length,
        i = 0,
        cop = [];

    while (i < source.length) {
        cop[i] = source[i];
        ++i;
    }
    qSort(cop, 0, count - 1, keySelector, keyComparer);
    return cop;
}

function qSort(data, left, right, dir, keySelector, keyComparer) {
    do {
        var i = left,
            j = right,
            itemIdx = i + (j - i >> 1),
            x = keySelector(data[itemIdx]);

        do {
            while (i < data.length && dir === _helpers.sortDirection.ascending ? keyComparer(keySelector, itemIdx, i, x, data) > 0 : keyComparer(keySelector, itemIdx, i, x, data) < 0) ++i;
            while (j >= 0 && dir === _helpers.sortDirection.ascending ? keyComparer(keySelector, itemIdx, j, x, data) < 0 : keyComparer(keySelector, itemIdx, j, x, data) < 0) --j;
            if (i > j) break;
            if (i < j) {
                let tmp = data[i];
                data[i] = data[j];
                data[j] = tmp;
            }
            ++i;
            --j;
        } while (i <= j);

        if (j - left <= right - i) {
            if (left < j) qSort(data, left, j, dir, keySelector, keyComparer);
            left = i;
        } else {
            if (i < right) qSort(data, i, right, dir, keySelector, keyComparer);
            right = j;
        }
    } while (left < right);
}

exports.sortData = sortData;
exports.quickSort = quickSort;

},{"../functionalHelpers":18,"../helpers":19}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.constructQueryableDelegator = exports.createNewOrderedQueryableDelegator = exports.createNewQueryableDelegator = undefined;

var _queryable = require('./queryable');

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

//=========================================================================================//
//===============================          Helpers         ================================//
//=========================================================================================//
var setSource = (0, _functionalHelpers.set)('source'),
    setIterator = (0, _functionalHelpers.set)(Symbol.iterator),
    isIterator = (0, _functionalHelpers.apply)(_helpers.generatorProto.isPrototypeOf),
    queryable = (0, _functionalHelpers.ifElse)(_functionalHelpers.isSomething, createOrderedQueryable, createQueryable);

function constructQueryableDelegator(source, iterator, sortObj) {
    //var b = when(constant(isIterator(iterator)), set(Symbol.iterator, iterator)),
    //f = tap(isIterator, iterator); //=> true
    //f => iterator
    //TODO: I might be able to work out a composition of 'isIterator' and 'setIterator' via 'tap'. I would still
    //TODO: need the 'when' function, but if 'tap' internally runs 'isIterator', then it would return the iterator
    //TODO: object which would then be passed to the setIterator function, which would then be waiting for the
    //TODO: object argument to be passed to it.
    return (0, _functionalHelpers.compose)((0, _functionalHelpers.when)(isIterator(iterator), setIterator(iterator)), setSource)(source, queryable(sortObj));
}

function createQueryable() {
    return Object.create(_queryable.internal_queryable, {
        data: {
            get: function _getData() {
                return Array.from(this);
            }
        }
    });
}

function createOrderedQueryable(sorts) {
    return (0, _functionalHelpers.set)('_appliedSorts', sorts, Object.create(_queryable.internal_orderedQueryable, {
        data: {
            get: function _getData() {
                return Array.from(this);
            }
        }
    }));
}

function createNewQueryableDelegator(source, iterator) {
    var obj = createQueryable();
    obj.source = source;
    //if the iterator param has been passed and is a generator, objectSet it as the object's
    //iterator; other wise let the object delegate to the queryable's iterator
    if (_helpers.generatorProto.isPrototypeOf(iterator)) obj[Symbol.iterator] = iterator;

    return obj;
}

function createNewOrderedQueryableDelegator(source, iterator, sortObj) {
    var obj = createOrderedQueryable(sortObj);
    obj.source = source;
    //Need to maintain a List of all the sorts that have been applied; effectively,
    //the underlying sorting function will only be called a single time for
    //all sorts.
    obj._appliedSorts = sortObj;
    //if the iterator param has been passed and is a generator, objectSet it as the object's
    //iterator; other wise let the object delegate to the queryable's iterator
    if (_helpers.generatorProto.isPrototypeOf(iterator)) obj[Symbol.iterator] = iterator;

    return obj;
}

exports.createNewQueryableDelegator = createNewQueryableDelegator;
exports.createNewOrderedQueryableDelegator = createNewOrderedQueryableDelegator;
exports.constructQueryableDelegator = constructQueryableDelegator;

},{"../functionalHelpers":18,"../helpers":19,"./queryable":35}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.queryable = exports.internal_orderedQueryable = exports.internal_queryable = exports.queryable_core = undefined;

var _collationFunctions = require('../collation/collationFunctions');

var _evaluationFunctions = require('../evaluation/evaluationFunctions');

var _limitationFunctions = require('../limitation/limitationFunctions');

var _projectionFunctions = require('../projection/projectionFunctions');

var _queryDelegatorCreators = require('./queryDelegatorCreators');

var _helpers = require('../helpers');

var _functionalHelpers = require('../functionalHelpers');

/**
 * Object that contains the core functionality; both the queryable and orderedQueryable
 * objects delegate to this object for all functionality besides orderBy/orderByDescending
 * and thenBy/thenByDescending respectively. Getter/setters are present for state-manipulation
 * at the consumer-object level, as well as to provide default values for a consumer-level
 * object at creation if not specified.
 * @type {{
 * source,
 * source,
 * mapWith: queryable_core._map,
 * groupBy: queryable_core._groupBy,
 * groupByDescending: queryable_core._groupByDescending,
 * flatten: queryable_core._flatten,
 * deepFlatten: queryable_core._deepFlatten,
 * deepMap: queryable_core._deepMap,
 * addFront: queryable_core._addFront,
 * concat: queryable_core._concat,
 * except: queryable_core._except,
 * groupJoin: queryable_core._groupJoin,
 * intersect: queryable_core._intersect,
 * join: queryable_core._join,
 * union: queryable_core._union,
 * zip: queryable_core._zip,
 * where: queryable_core._where,
 * ofType: queryable_core._ofType,
 * distinct: queryable_core._distinct,
 * take: queryable_core._take,
 * takeWhile: queryable_core._takeWhile,
 * skip: queryable_core._skip,
 * skipWhile: queryable_core._skipWhile,
 * any: queryable_core._any,
 * all: queryable_core._all,
 * contains: queryable_core._contains,
 * first: queryable_core._first,
 * fold: queryable_core._fold,
 * last: queryable_core._last,
 * count: queryable_core._count,
 * toArray: queryable_core._toArray,
 * toSet: queryable_core._toSet,
 * reverse: queryable_core._reverse,
 * [Symbol.iterator]: queryable_core._iterator
 * }}
 */
var queryable_core = {
    //Using getters for these properties because there's a chance the setting and/or getting
    //functionality could change; this will allow for a consistent interface while the
    //logic beneath changes

    /**
     * Getter for the underlying source object of the queryable
     * @returns {*}
     */
    get source() {
        return this._source;
    },

    /**
     * Setter for the underlying source object of the queryable
     * @param val
     */
    set source(val) {
        this._source = val;
    },

    /**
     *
     * @param mapFunc
     * @returns {*}
     */
    map: function _map(mapFunc) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.map)(this, mapFunc));
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.groupBy)(this, groupObj));
    },

    /**
     *
     * @param keySelector
     * @param comparer
     * @returns {*}
     */
    groupByDescending: function _groupByDescending(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: 'desc' }];
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.groupBy)(this, groupObj));
    },

    /**
     *@type {function}
     */
    flatten: function _flatten() {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.flatten)(this));
    },

    /**
     *@type {function}
     */
    deepFlatten: function _deepFlatten() {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.deepFlatten)(this));
    },

    /**
     *
     * @param fn
     * @returns {*}
     */
    deepMap: function _deepMap(fn) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _projectionFunctions.deepMap)(this, fn));
    },

    /**
     *
     * @param enumerable
     * @returns {*}
     */
    addFront: function _addFront(enumerable) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.addFront)(this, enumerable));
    },

    /**
     * Concatenates two or more lists by appending the "method's" List argument(s) to the
     * queryable's source. This function is a deferred execution call that returns
     * a new queryable object delegator instance that contains all the requisite
     * information on how to perform the operation.
     * @param {Array | *} enumerables
     * @returns {*}
     */
    concat: function _concat(...enumerables) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.concat)(this, enumerables, enumerables.length));
    },

    /**
     * Produces a List that contains the objectSet difference between the queryable object
     * and the List that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * equality comparer.
     * @param enumerable
     * @param comparer
     * @returns {*}
     */
    except: function _except(enumerable, comparer) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.except)(this, enumerable, comparer));
    },

    /**
     * Correlates the items in two lists based on the equality of a key and groups
     * all items that share the same key. A comparer function may be provided to
     * the function that determines the equality/inequality of the items in each
     * List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @param inner
     * @param outerSelector
     * @param innerSelector
     * @param projector
     * @param comparer
     * @returns {*}
     */
    groupJoin: function _groupJoin(inner, outerSelector, innerSelector, projector, comparer) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.groupJoin)(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     * Produces the objectSet intersection of the queryable object's source and the List
     * that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @param enumerable
     * @param comparer
     * @returns {*}
     */
    intersect: function _intersect(enumerable, comparer) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.intersect)(this, enumerable, comparer));
    },

    /**
     * Correlates the items in two lists based on the equality of items in each
     * List. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param inner
     * @param outerSelector
     * @param innerSelector
     * @param projector
     * @param comparer
     * @returns {*}
     */
    join: function _join(inner, outerSelector, innerSelector, projector, comparer) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.join)(this, inner, outerSelector, innerSelector, projector, comparer));
    },

    /**
     * Produces the objectSet union of two lists by selecting each unique item in both
     * lists. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param enumerable
     * @param comparer
     * @returns {*}
     */
    union: function _union(enumerable, comparer) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.union)(this, enumerable, comparer));
    },

    /**
     * Produces a List of the items in the queryable object and the List passed as
     * a function argument. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @param selector
     * @param enumerable
     * @returns {*}
     */
    zip: function _zip(selector, enumerable) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _collationFunctions.zip)(this, selector, enumerable));
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    where: function _where(predicate) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _limitationFunctions.where)(this, predicate));
    },

    /**
     *
     * @param type
     * @returns {*}
     */
    ofType: function _ofType(type) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _limitationFunctions.ofType)(this, type));
    },

    /**
     *
     * @param comparer
     * @returns {*}
     */
    distinct: function _distinct(comparer) {
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, (0, _limitationFunctions.distinct)(this, comparer));
    },

    /**
     *
     * @param amt
     * @returns {Array}
     */
    take: function _take(amt) {
        if (!amt) return [];
        var res = [],
            idx = 0;

        for (let item of this) {
            if (idx < amt) res[res.length] = item;else break;
            ++idx;
        }
        return res;
    },

    /**
     *
     * @param predicate
     * @returns {Array}
     */
    takeWhile: function _takeWhile(predicate = _helpers.defaultPredicate) {
        var res = [];

        for (let item of this.source) {
            if (predicate(item)) res[res.length] = item;else {
                return res;
            }
        }
    },

    /**
     * Skips over a specified number of items in the source and returns the
     * remaining items. If no amount is specified, an empty array is returned;
     * Otherwise, an array containing the items collected from the source is
     * returned.
     * @param {number} amt - The number of items in the source to skip before
     * returning the remainder.
     * @returns {*}
     */
    skip: function _skip(amt) {
        var idx = 0,
            res = [];

        for (let item of this.source) {
            if (idx >= amt) res[res.length] = item;
            ++idx;
        }
        return res;
    },

    /**
     *
     * @param predicate
     * @returns {Array}
     */
    skipWhile: function _skipWhile(predicate = _helpers.defaultPredicate) {
        var hasFailed = false,
            res = [];

        //TODO: check this logic out; seems incorrect
        for (let item of this.source) {
            if (!hasFailed && !predicate(item)) hasFailed = true;
            if (hasFailed) res[res.length] = item;
        }
        return res;
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    any: function _any(predicate = _helpers.defaultPredicate) {
        return (0, _evaluationFunctions.any)(this, predicate);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    all: function _all(predicate = _helpers.defaultPredicate) {
        return (0, _evaluationFunctions.all)(this, predicate);
    },

    /**
     *
     * @param val
     * @param comparer
     * @returns {*}
     */
    contains: function _contains(val, comparer) {
        return (0, _evaluationFunctions.contains)(this, val, comparer);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    first: function _first(predicate = _helpers.defaultPredicate) {
        return (0, _evaluationFunctions.first)(this, predicate);
    },

    /**
     *
     * @param fn
     * @param initial
     * @returns {*}
     */
    fold: function _fold(fn, initial) {
        return (0, _evaluationFunctions.fold)(this, fn, initial);
    },

    /**
     *
     * @param predicate
     * @returns {*}
     */
    last: function _last(predicate = _helpers.defaultPredicate) {
        return (0, _evaluationFunctions.last)(this, predicate);
    },

    /**
     *
     * @returns {*}
     */
    count: function _count() {
        return (0, _evaluationFunctions.count)(this);
    },

    /**
     *
     * @returns {Array}
     */
    toArray: function _toArray() {
        return Array.from(this);
    },

    /**
     *
     * @returns {Set}
     */
    toSet: function _toSet() {
        return new Set(this);
    },

    /**
     *
     * @returns {*}
     */
    toEvaluatedQueryable: function _toEvaluatedQueryable() {
        return queryable.from(this.data);
    },

    /**
     *
     * @returns {Array.<*>}
     */
    reverse: function _reverse() {
        return Array.from(this).reverse();
    },

    /**
     * Base iterator to which all queryable_core delegator objects
     * delegate to for iteration if for some reason an iterator wasn't
     * objectSet on the delegator at the time of creation.
     */
    [Symbol.iterator]: function* _iterator() {
        var data = Array.from(this.source);
        for (let item of data) yield item;
    }
};

/**
 * A queryable_core delegator object that, in addition to the delegatable functionality
 * it has from the queryable_core object, also exposes .orderBy and .orderByDescending
 * functions. These functions allow a consumer to sort a queryable object's data by
 * a given key.
 * @type {queryable_core}
 */
var internal_queryable = Object.create(queryable_core);

/**
 *
 * @param keySelector
 * @param comparer
 * @returns {*}
 */
internal_queryable.orderBy = function _orderBy(keySelector, comparer) {
    var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
    return (0, _queryDelegatorCreators.createNewOrderedQueryableDelegator)(this, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
};

/**
 *
 * @param keySelector
 * @param comparer
 * @returns {*}
 */
internal_queryable.orderByDescending = function _orderByDescending(keySelector, comparer) {
    var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'desc' }];
    return (0, _queryDelegatorCreators.createNewOrderedQueryableDelegator)(this, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
};

/**
 * A queryable_core delegator object that, in addition to the delegatable functionality
 * it has from the queryable_core object, also exposes .thenBy and .thenByDescending
 * functions. These functions allow a consumer to sort more on than a single column.
 * @type {queryable_core}
 */
var internal_orderedQueryable = Object.create(queryable_core);

internal_orderedQueryable._appliedSort = [];

//In these two functions, feeding the call to "orderBy" with the .source property of the queryable delegate
//rather than the delegate itself, effectively excludes the previous call to the orderBy/orderByDescending
//since the iterator exists on the delegate, not on its source. Each subsequent call to thenBy/thenByDescending
//will continue to exclude the previous call's iterator... effectively what we're doing is ignoring all the
//prior calls made to orderBy/orderByDescending/thenBy/thenByDescending and calling it once but with an array
//of the the requested sorts.

/**
 *
 * @param keySelector
 * @param comparer
 * @returns {*}
 */
internal_orderedQueryable.thenBy = function _thenBy(keySelector, comparer) {
    var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'asc' });
    return (0, _queryDelegatorCreators.createNewOrderedQueryableDelegator)(this.source, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
};

/**
 *
 * @param keySelector
 * @param comparer
 * @returns {*}
 */
internal_orderedQueryable.thenByDescending = function thenByDescending(keySelector, comparer) {
    var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: 'desc' });
    return (0, _queryDelegatorCreators.createNewOrderedQueryableDelegator)(this.source, (0, _projectionFunctions.orderBy)(this, sortObj), sortObj);
};

//TODO: functional
//TODO: functional programming
//TODO: FP
//TODO: monad
//TODO: functor
//TODO: container
//TODO: JavaScript
//TODO: JS
//TODO: JunctionalS
//TODO: JunctorS
//TODO: lanoitcunf
//TODO: rotcnuf
//TODO: danom
//TODO: tpircSavaJ
//TODO: Junctional FavaScript

/**
 * @description: Creator function for a new mlist object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the mlist as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @param {*} source - Any type, any value; used as the underlying source of the mlist
 * @returns {internal_queryable} - A new mlist instance with the value provided as the underlying source.
 */
function mlist(source) {
    //TODO: should I exclude strings from being used as a source directly, or allow it because
    //TODO: they have an iterator?
    return (0, _queryDelegatorCreators.constructQueryableDelegator)(source && source[Symbol.iterator] ? source : (0, _functionalHelpers.wrap)(source));
}

/**
 * @description: Convenience function for create a new mlist instance; internally calls mlist.
 * @see mlist
 * @param {*} source - Any type, any value; used as the underlying source of the mlist
 * @returns {internal_queryable} - A new mlist instance with the value provided as the underlying source.
 */
mlist.from = function _from(source) {
    return mlist(source);
};

/**
 * Extension function that allows new functionality to be applied to
 * the queryable object
 * @param {string} propName - The name of the new queryable property; must be unique
 * @param {function} fn - A function that defines the new queryable functionality and
 * will be called when this new queryable property is invoked.
 *
 * NOTE: The fn parameter must be a non-generator function that takes one or more
 * arguments. If this new queryable function should be an immediately evaluated
 * function (like: take, any, reverse, etc.), it merely needs the accept a single
 * argument and know how to iterate it. In the case of an immediately evaluated
 * function, the return type can be any javascript type, and the only input will
 * be the previous instance of the queryable.
 *
 * If the function's evaluation should be deferred it needs to work a bit differently.
 * In this case, the function should accept one or more arguments, the first and only
 * required argument being the underlying source of the queryable object. This underlying
 * source can be anything with an iterator (generator, array, mapWith, set, another queryable).
 * Any additional arguments that the function needs should be specified in the signature.
 * The return value of the function should be a generator that knows how to iterate the
 * underlying source. If the generator should operate like most queryable functions, i.e.
 * take a single item, process it, and then yield it out before asking for the next, a
 * for-of loop is the preferred method for employment. However, if the generator needs
 * all of the underlying data upfront (like orderBy and groupBy), Array.from is the
 * preferred method. Array.from will 'force' all the underlying queryable instances
 * to evaluate their data before it is handed over in full to the generator. The generator
 * can then act with full knowledge of the data and perform whatever operation is needed
 * before ultimately yielding out a single item at a time. If your extension function
 * needs to yield out all items at once, then that function is not a lazy evaluation
 * function and should be constructed like the immediately evaluated functions described
 * above.
 */
mlist.extend = function _extend(propName, fn) {
    if (!propName in queryable_core) {
        queryable_core[propName] = function (...args) {
            return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, fn(this, ...args));
        };
    }
};

//TODO: consider adding a function property to this object that can create a new consumer-level
//TODO: so that the queryable_core object can call that function for each deferred execution
//TODO: function rather than creating the consumer-level objects itself. This may to resolve
//TODO: the circular dependency that I am dealing with between queryable_core, queryObjectCreators
//TODO: function, and the internal_queryable/internal_orderedQueryable objects.
/**
 * Public API for consumers to create new object instance that delegate to a queryable object
 * for functionality. This object also has a ".extend" function property that can extend the
 * functionality of all queryable objects by allowing a consumer to define their own function
 * that will be invokable on all queryable objects.
 * @type {{extend: queryable._extend, from: queryable._from}}
 */
var queryable = {
    /**
     * Extension function that allows new functionality to be applied to
     * the queryable object
     * @param {string} propName - The name of the new queryable property; must be unique
     * @param {function} fn - A function that defines the new queryable functionality and
     * will be called when this new queryable property is invoked.
     *
     * NOTE: The fn parameter must be a non-generator function that takes one or more
     * arguments and returns a generator function that knows how to iterate the data
     * and yield out each item one at a time. The first argument must be the 'source'
     * argument of the function which will be what the returned generator must iterate
     * in order to retrieve the items it work work on. The function may work on all
     * the data as a single objectSet, or it can iterate it's queryable source and apply the
     * functionality to a single item before yielding that item and calling for the next.
     * The source argument may be any iterable object, generally an array or another
     * queryable; the returned generator needs either turn the iterable into an array
     * using Array#from if all the data is needed up front, or iterate the source in
     * a for-of loop if each item is only needed one-at-a-time.
     */
    extend: function _extend(propName, fn) {
        if (!queryable_core[propName]) {
            queryable_core[propName] = function (...args) {
                return (0, _queryDelegatorCreators.createNewQueryableDelegator)(this, fn(this, ...args));
            };
        }
    },

    /**
     * Creates a new queryable delegator object from whatever source value is provided.
     * @param {*} source - The source argument can be any JavaScript value. It will default
     * to an empty array if 'undefined' is passed. If the source argument is a generator,
     * an array, or another queryable, the function will accept it as is; if the source
     * argument has a [Symbol.iterator] definition, it will call Array.from on the source
     * before creating a new delegator, otherwise it will wrap the source argument in
     * as array.
     * @returns { Object } Returns a new queryable delegator object with its source objectSet
     * to the value of the provided source argument
     */
    from: function _from(source = []) {
        //... if the source is a generator, an array, or another queryable, accept it as is...
        if (_helpers.generatorProto.isPrototypeOf(source) || (0, _functionalHelpers.isArray)(source) || queryable_core.isPrototypeOf(source)) return (0, _queryDelegatorCreators.createNewQueryableDelegator)(source);
        //... otherwise, turn the source into an array before creating a new queryable delegator object;
        //if it has an iterator, use Array.from, else wrap the source arg in an array...
        return (0, _queryDelegatorCreators.createNewQueryableDelegator)(null !== source && source[Symbol.iterator] ? Array.from(source) : (0, _functionalHelpers.wrap)(source));
    }
};

exports.queryable_core = queryable_core;
exports.internal_queryable = internal_queryable;
exports.internal_orderedQueryable = internal_orderedQueryable;
exports.queryable = queryable;

},{"../collation/collationFunctions":2,"../evaluation/evaluationFunctions":14,"../functionalHelpers":18,"../helpers":19,"../limitation/limitationFunctions":22,"../projection/projectionFunctions":32,"./queryDelegatorCreators":34}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.observable = undefined;

var _helpers = require('../helpers');

var _subscriber = require('./subscribers/subscriber');

var _operators = require('./streamOperators/operators');

var _functionalHelpers = require('../functionalHelpers');

//TODO: I thinking about implementing an 'observable watcher' functionality. the concept would be
//TODO: that you have an observable that is registered to watch one or more other observables. When
//TODO: the complete or error, the watcher will be notified in its .next handler. To do this, I'd
//TODO: need to assign each observable a unique id, and allow an observable watching to register a
//TODO: unique handler per watched observable if so desired.
var observable = {
    get source() {
        return this._source;
    },
    set source(src) {
        this._source = src;
    },
    get operator() {
        return this._operator;
    },
    set operator(op) {
        this._operator = op;
    },
    /**
     *
     * @param fn
     * @returns {observable}
     */
    map: function _map(fn) {
        if (_operators.mapOperator.isPrototypeOf(this.operator)) return this.lift.call(this.source, Object.create(_operators.mapOperator).init((0, _functionalHelpers.compose)(fn, this.operator.transform)));
        return this.lift(Object.create(_operators.mapOperator).init(fn));
    },
    /**
     *
     * @param fn
     * @returns {observable}
     */
    deepMap: function _deepMap(fn) {
        return this.lift(Object.create(_operators.deepMapOperator).init(fn));
    },
    /**
     *
     * @param predicate
     * @returns {observable}
     */
    filter: function _filter(predicate) {
        if (_operators.filterOperator.isPrototypeOf(this.operator)) return this.lift.call(this.source, Object.create(_operators.filterOperator).init((0, _functionalHelpers.and)(predicate, this.operator.predicate)));
        return this.lift(Object.create(_operators.filterOperator).init(predicate));
    },
    /**
     *
     * @param keySelector
     * @param comparer
     * @param bufferAmt
     * @returns {observable}
     */
    groupBy: function _groupBy(keySelector, comparer, bufferAmt = 0) {
        return this.lift(Object.create(_operators.groupByOperator).init(keySelector, comparer, bufferAmt));
    },
    /**
     *
     * @param observables
     * @returns {observable}
     */
    merge: function _merge(...observables) {
        if (_operators.mergeOperator.isPrototypeOf(this.operator)) return this.lift.call(this.source, Object.create(_operators.mergeOperator).init([this].concat(observables, this.operator.observables)));
        return this.lift(Object.create(_operators.mergeOperator).init([this].concat(observables)));
    },
    /**
     *
     * @param count
     * @returns {observable}
     */
    itemBuffer: function _itemBuffer(count) {
        return this.lift(Object.create(_operators.itemBufferOperator).init(count));
    },
    /**
     *
     * @param amt
     * @returns {observable}
     */
    timeBuffer: function _timeBuffer(amt) {
        return this.lift(Object.create(_operators.timeBufferOperator).init(amt));
    },
    /**
     *
     * @param amt
     * @returns {*|observable}
     */
    debounce: function _debounce(amt) {
        return this.lift(Object.create(_operators.debounceOperator).init(amt));
    },
    /**
     *
     * @param operator
     * @returns {observable}
     */
    lift: function lift(operator) {
        var o = Object.create(observable);
        o.source = this;
        o.operator = operator;
        return o;
    },
    /**
     *
     * @param src
     * @param evt
     * @returns {observable}
     */
    fromEvent: function _fromEvent(src, evt) {
        var o = Object.create(observable);
        o.source = src;
        o.event = evt;
        o.subscribe = function _subscribe(subscriber) {
            var source = this.source,
                event = this.event;

            function eventHandler(e) {
                return subscriber.next(e);
            }

            function unSub() {
                subscriber.status = _helpers.observableStatus.complete;
                return source.removeEventListener(event, eventHandler);
            }
            source.addEventListener(event, eventHandler);
            subscriber.unsubscribe = unSub;
            return subscriber;
        };
        return o;
    },
    /**
     *
     * @param src
     * @param startingIdx
     * @returns {observable}
     */
    fromList: function _fromList(src, startingIdx = 0) {
        var o = Object.create(observable);
        o.source = src;
        o.idx = startingIdx;
        o.subscribe = function _subscribe(subscriber) {
            function unSub() {
                this.status = _helpers.observableStatus.complete;
            }

            /*
            var runner = (function _runner() {
                if (subscriber.status !== observableStatus.paused && subscriber.status !== observableStatus.complete && this.idx < this.source.length) {
                    for (let item of source) {
                        Promise.resolve(item)
                            .then(function _resolve(val) {
                                subscriber.next(val);
                                runner();
                            });
                    }
                }
                else {
                    //TODO: don't think I need to do this 'recursive' unsubscribe here since the
                    //TODO: unsubscribe function is itself recursive
                    var d = subscriber;
                    while (d.subscriber.subscriber) d = d.subscriber;
                    d.unsubscribe();
                }
            }).bind(this);
              Promise.resolve()
                .then(function _callRunner() {
                    runner();
                });
               */

            Promise.resolve().then(function _callRunner() {
                (function _runner() {
                    if (subscriber.status !== _helpers.observableStatus.paused && subscriber.status !== _helpers.observableStatus.complete && this.idx < this.source.length) {
                        for (let item of source) {
                            Promise.resolve(item).then(function _resolve(val) {
                                subscriber.next(val);
                                _runner();
                            });
                        }
                    } else {
                        //TODO: don't think I need to do this 'recursive' unsubscribe here since the
                        //TODO: unsubscribe function is itself recursive
                        var d = subscriber;
                        while (d.subscriber.subscriber) d = d.subscriber;
                        d.unsubscribe();
                    }
                }).bind(this)();
            });

            subscriber.unsubscribe = unSub;
            return subscriber;
        };
        return o;
    },
    /**
     * Creates a new observable from a generator function
     * @param src
     * @returns {observable}
     */
    fromGenerator: function _fromGenerator(src) {
        var o = Object.create(observable);
        o.source = src;
        o.subscribe = function _subscribe(subscriber_next, error, complete) {
            var it = this.source();
            (function _runner() {
                if ('object' !== typeof subscriber_next || subscriber_next.status !== _helpers.observableStatus.paused && subscriber_next.status !== _helpers.observableStatus.complete) {
                    Promise.resolve(it.next()).then(function _then(val) {
                        if (!val.done) {
                            if ('function' === typeof subscriber_next) subscriber_next(val.value);else subscriber_next.next(val.value);
                            _runner();
                        }
                    });
                } else if ('function' !== typeof subscriber_next) {
                    this.unsubscribe();
                } else complete();
            }).bind(this)();
        };
        return o;
    },
    /**
     *
     * @param src
     * @returns {observable} - Returns a new observable
     */
    from: function _from(src) {
        if (_helpers.generatorProto.isPrototypeOf(src)) return this.fromGenerator(src);
        return this.fromList(src[Symbol.iterator] ? src : (0, _functionalHelpers.wrap)(src));
    },
    /**
     * Creates a new subscriber for this observable. Takes three function handlers;
     * a 'next' handler that receives each item after having passed through the lower
     * level subscribers, an 'error' handler that is called if an exception is thrown
     * while the stream is active, and a complete handler that is called whenever the
     * stream is done.
     * @param {function} next - A function handler
     * @param {function} error - A function handler
     * @param {function} complete - A function handler
     * @returns {subscriber}
     */
    subscribe: function _subscribe(next, error, complete) {
        var s = Object.create(_subscriber.subscriber).initialize(next, error, complete);
        if (this.operator) this.operator.subscribe(s, this.source);
        return s;
    },
    /**
     *
     * @param next
     * @returns {*}
     */
    onValue: function _onValue(next) {
        var s = Object.create(_subscriber.subscriber).initialize(next, _functionalHelpers.noop, _functionalHelpers.noop);
        if (this.operator) this.operator.subscriber(s, this.source);
        return s;
    }
};

exports.observable = observable;

},{"../functionalHelpers":18,"../helpers":19,"./streamOperators/operators":44,"./subscribers/subscriber":53}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debounceOperator = undefined;

var _debounceSubscriber = require('../subscribers/debounceSubscriber');

var debounceOperator = {
    init: function _init(amt) {
        this.interval = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_debounceSubscriber.debounceSubscriber).init(subscriber, this.interval));
    }
};

exports.debounceOperator = debounceOperator;

},{"../subscribers/debounceSubscriber":46}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deepMapOperator = undefined;

var _deepMapSubscriber = require('../subscribers/deepMapSubscriber');

var deepMapOperator = {
    get transform() {
        return this._transform;
    },
    set transform(fn) {
        this._transform = fn;
    },
    init: function _init(projectionFunc) {
        this.transform = projectionFunc;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_deepMapSubscriber.deepMapSubscriber).init(subscriber, this.transform));
    }
};

exports.deepMapOperator = deepMapOperator;

},{"../subscribers/deepMapSubscriber":47}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filterOperator = undefined;

var _filterSubscriber = require('../subscribers/filterSubscriber');

var filterOperator = {
    get predicate() {
        return this._predicate;
    },
    set predicate(fn) {
        this._predicate = fn;
    },
    init: function _init(predicate) {
        this.predicate = predicate;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_filterSubscriber.filterSubscriber).init(subscriber, this.predicate));
    }
};

exports.filterOperator = filterOperator;

},{"../subscribers/filterSubscriber":48}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupByOperator = undefined;

var _groupBySubscriber = require('../subscribers/groupBySubscriber');

var groupByOperator = {
    get keySelector() {
        return this._keySelector;
    },
    set keySelector(ks) {
        this._keySelector = ks;
    },
    get comparer() {
        return this._comparer;
    },
    set comparer(c) {
        this._comparer = c;
    },
    get bufferAmount() {
        return this._bufferAmount || 0;
    },
    set bufferAmount(amt) {
        this._bufferAmount = amt;
    },
    init: function _init(keySelector, comparer, bufferAmount) {
        this.keySelector = keySelector;
        this.comparer = comparer;
        this.bufferAmount = bufferAmount;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_groupBySubscriber.groupBySubscriber).init(subscriber, this.keySelector, this.comparer, this.bufferAmount));
    }
};

exports.groupByOperator = groupByOperator;

},{"../subscribers/groupBySubscriber":49}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.itemBufferOperator = undefined;

var _itemBufferSubscriber = require('../subscribers/itemBufferSubscriber');

var itemBufferOperator = {
    init: function _init(amt) {
        this.count = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_itemBufferSubscriber.itemBufferSubscriber).init(subscriber, this.count));
    }
};

exports.itemBufferOperator = itemBufferOperator;

},{"../subscribers/itemBufferSubscriber":50}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapOperator = undefined;

var _mapSubscriber = require('../subscribers/mapSubscriber');

var mapOperator = {
    get transform() {
        return this._transform;
    },
    set transform(fn) {
        this._transform = fn;
    },
    init: function _init(projectionFunc) {
        this.transform = projectionFunc;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_mapSubscriber.mapSubscriber).init(subscriber, this.transform));
    }
};

exports.mapOperator = mapOperator;

},{"../subscribers/mapSubscriber":51}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeOperator = undefined;

var _mergeSubscriber = require('../subscribers/mergeSubscriber');

var mergeOperator = {
    get observables() {
        return this._observables || [];
    },
    set observables(arr) {
        this._observables = arr;
    },
    init: function _init(observables) {
        this.observables = observables;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_mergeSubscriber.mergeSubscriber).init(subscriber, this.observables));
    }
};

exports.mergeOperator = mergeOperator;

},{"../subscribers/mergeSubscriber":52}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeBufferOperator = exports.mergeOperator = exports.mapOperator = exports.itemBufferOperator = exports.groupByOperator = exports.filterOperator = exports.deepMapOperator = exports.debounceOperator = undefined;

var _debounceOperator = require('./debounceOperator');

var _deepMapOperator = require('./deepMapOperator');

var _filterOperator = require('./filterOperator');

var _groupByOperator = require('./groupByOperator');

var _itemBufferOperator = require('./itemBufferOperator');

var _mapOperator = require('./mapOperator');

var _mergeOperator = require('./mergeOperator');

var _timeBufferOperator = require('./timeBufferOperator');

exports.debounceOperator = _debounceOperator.debounceOperator;
exports.deepMapOperator = _deepMapOperator.deepMapOperator;
exports.filterOperator = _filterOperator.filterOperator;
exports.groupByOperator = _groupByOperator.groupByOperator;
exports.itemBufferOperator = _itemBufferOperator.itemBufferOperator;
exports.mapOperator = _mapOperator.mapOperator;
exports.mergeOperator = _mergeOperator.mergeOperator;
exports.timeBufferOperator = _timeBufferOperator.timeBufferOperator;

},{"./debounceOperator":37,"./deepMapOperator":38,"./filterOperator":39,"./groupByOperator":40,"./itemBufferOperator":41,"./mapOperator":42,"./mergeOperator":43,"./timeBufferOperator":45}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.timeBufferOperator = undefined;

var _timeBufferSubscriber = require('../subscribers/timeBufferSubscriber');

var timeBufferOperator = {
    init: function _init(amt) {
        this.interval = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_timeBufferSubscriber.timeBufferSubscriber).init(subscriber, this.interval));
    }
};

exports.timeBufferOperator = timeBufferOperator;

},{"../subscribers/timeBufferSubscriber":54}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debounceSubscriber = undefined;

var _subscriber = require('./subscriber');

var _helpers = require('../../helpers');

var debounceSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            if (null != this.id) this.tearDownTimeout();
            this.lastItem = item;
            this.lastTick = Date.now();
            this.id = setTimeout(this.getTimeoutFunc.bind(this), this.interval, item);
        }
    },
    init: {
        value: function _init(subscriber, interval) {
            this.initialize(subscriber);
            this.lastTick = null;
            this.lastItem = undefined;
            this.interval = interval;
            this.id = null;
            return this;
        }
    },
    getTimeoutFunc: {
        get: function _getTimeoutFunc() {
            return function timeoutFunc(item) {
                var thisTick = Date.now();
                if (this.lastTick <= thisTick - this.interval) {
                    var tmp = this.lastItem;
                    this.lastItem = undefined;
                    this.lastTick = thisTick;
                    this.subscriber.next(tmp);
                } else {
                    this.lastTick = thisTick;
                    this.lastItem = item;
                }
            };
        }
    },
    cleanUp: {
        value: function _cleanUp() {
            this.tearDownTimeout();
            this.lastTick = undefined;
            this.lastItem = undefined;
        }
    },
    tearDownTimeout: {
        value: function _tearDownTimeout() {
            if (this.id && _helpers.javaScriptTypes.number === typeof this.id) {
                clearTimeout(this.id);
                this.id = null;
            }
        }
    }
});

exports.debounceSubscriber = debounceSubscriber;

},{"../../helpers":19,"./subscriber":53}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.deepMapSubscriber = undefined;

var _subscriber = require('./subscriber');

var deepMapSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            var mappedResult;
            try {
                mappedResult = recursiveMap(item);
            } catch (err) {
                this.subscriber.error(err);
                return;
            }
            this.subscriber.next(mappedResult);
            //Promise.resolve(mappedResult).then(this.then);

            function recursiveMap(item) {
                if (isArray(item)) {
                    var res = [];
                    for (let it of item) {
                        res = res.concat(recursiveMap(it));
                    }
                    return res;
                }
                return this.transform(item, this.count++);
            }
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, transform) {
            this.initialize(subscriber);
            this.transform = transform;
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.deepMapSubscriber = deepMapSubscriber;

},{"./subscriber":53}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filterSubscriber = undefined;

var _subscriber = require('./subscriber');

var filterSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            try {
                if (this.predicate(item, this.count++)) this.subscriber.next(item);
                //Promise.resolve(item).then(this.then);
            } catch (err) {
                this.subscriber.error(err);
            }
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, predicate) {
            this.initialize(subscriber);
            this.predicate = predicate;
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.filterSubscriber = filterSubscriber;

},{"./subscriber":53}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupBySubscriber = undefined;

var _subscriber = require('./subscriber');

var _sortHelpers = require('../../projection/sortHelpers');

var groupBySubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            if (this.buffer.length + 1 >= this.bufferAmount) {
                try {
                    var res = groupData(this.buffer, [{ keySelector: this.keySelector, comparer: this.comparer, direction: 'desc' }]);
                    this.subscriber.next(res);
                    this.buffer.length = 0;
                } catch (ex) {
                    this.subscriber.error(ex);
                }
            } else this.buffer[this.buffer.length] = item;
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, keySelector, comparer, bufferAmount) {
            this.initialize(subscriber);
            this.keySelector = keySelector;
            this.comparer = comparer;
            this.bufferAmount = bufferAmount;
            this.buffer = [];
            return this;
        },
        writable: false,
        configurable: false
    }
});

function groupData(data, groupObject) {
    var sortedData = (0, _sortHelpers.sortData)(data, groupObject),
        retData = [];

    sortedData.forEach(function _groupSortedData(item) {
        let grp = retData;
        groupObject.forEach(function _createGroupsByFields(group) {
            grp = findGroup(grp, group.keySelector(item));
        });
        grp[grp.length] = item;
    });

    return retData;
}

function findGroup(arr, field) {
    var grp;
    if (arr.some(function _findGroup(group) {
        if (group.key === field) {
            grp = group;
            return true;
        }
    })) return grp;else {
        grp = [];
        grp.key = field;
        arr.push(grp);
        return grp;
    }
}

exports.groupBySubscriber = groupBySubscriber;

},{"../../projection/sortHelpers":33,"./subscriber":53}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.itemBufferSubscriber = undefined;

var _subscriber = require('./subscriber');

var itemBufferSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(val) {
            this.buffer[this.buffer.length] = val;
            if (this.buffer.length >= this.count) {
                this.subscriber.next(this.buffer.map(function _mapBuffer(item) {
                    return item;
                }));
                this.buffer.length = 0;
            }
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, count) {
            this.initialize(subscriber);
            this.buffer = [];
            this.count = count;
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.itemBufferSubscriber = itemBufferSubscriber;

},{"./subscriber":53}],51:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapSubscriber = undefined;

var _subscriber = require('./subscriber');

var mapSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            var res;
            try {
                res = this.transform(item, this.count++);
            } catch (err) {
                this.subscriber.error(err);
                return;
            }
            this.subscriber.next(res);
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, transform) {
            this.initialize(subscriber);
            this.transform = transform;
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.mapSubscriber = mapSubscriber;

},{"./subscriber":53}],52:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeSubscriber = undefined;

var _subscriber = require('./subscriber');

var mergeSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            if (this.transform) {
                var res;
                try {
                    res = this.transform(item, this.count++);
                } catch (err) {
                    this.subscriber.error(err);
                    return;
                }
                //Promise.resolve(res).then(this.then);
                this.subscriber.next(res);
            } else this.subscriber.next(item);
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, observables, transform) {
            this.transform = transform;
            observables.forEach(function _subscribeToEach(observable) {
                observable.subscribe(this);
            }, this);
            this.initialize(subscriber);
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.mergeSubscriber = mergeSubscriber;

},{"./subscriber":53}],53:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.subscriber = undefined;

var _helpers = require('../../helpers');

var subscriber = {
    get status() {
        return this._status || _helpers.observableStatus.inactive;
    },
    set status(status) {
        this._status = Object.keys(_helpers.observableStatus).map(function _statusValues(status) {
            return _helpers.observableStatus[status];
        }).includes(status) ? status : _helpers.observableStatus.inactive;
    },
    get count() {
        return this._count || 0;
    },
    set count(cnt) {
        this._count = cnt || 0;
    },
    removeSubscriber: function _removeSubscriber() {
        this.subscriber = null;
    },
    removeSubscription: function _removeSubscription(subscription) {
        if (this.subscriptions.length) {
            this.subscriptions = this.subscriptions.filter(function _findSubscriber(sub) {
                return sub !== subscription;
            });
        }
    },
    removeSubscriptions: function _removeSubscriptions() {
        this.subscriptions.length = 0;
    },
    next: function _next(item) {
        this.subscriber.next(item);
        //Promise.resolve(item).then(this.then);
    },
    error: function _error(err) {
        this.status = _helpers.observableStatus.complete;
        this.subscriber.error(err);
    },
    complete: function _complete() {
        this.status = _helpers.observableStatus.complete;
        if (this.subscriber && _helpers.observableStatus.complete !== this.subscriber.status) this.subscriber.complete();
    },
    initialize: function _initialize(next, error, complete) {
        this.status = _helpers.observableStatus.active;
        this.count = 0;
        this.subscriptions = [];
        this.then = function _then(val) {
            return this.subscriber.next(val);
        }.bind(this);

        if (subscriber.isPrototypeOf(next)) {
            this.subscriber = next;
            next.subscriptions = next.subscriptions ? next.subscriptions.concat(this) : [].concat(this);
            return this;
        }
        this.subscriber = {
            next: next,
            error: error,
            complete: complete
        };
        return this;
    },
    onError: function _onError(error) {
        this.subscriber.error = error;
        return this;
    },
    onComplete: function _onComplete(complete) {
        this.subscriber.complete = complete;
        return this;
    },
    unsubscribe: function _unsubscribe() {
        if (_helpers.observableStatus.complete === this.status) return;
        this.complete();
        if (this.subscriber && subscriber.isPrototypeOf(this.subscriber)) {
            var sub = this.subscriber;
            this.subscriber = null;
            sub.unsubscribe();
        }

        while (this.subscriptions.length) {
            var subscription = this.subscriptions.shift();
            if (subscription.cleanUp) subscription.cleanUp();
            subscription.unsubscribe();
        }
    }
};

exports.subscriber = subscriber;

},{"../../helpers":19}],54:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.timeBufferSubscriber = undefined;

var _subscriber = require('./subscriber');

var timeBufferSubscriber = Object.create(_subscriber.subscriber, {
    id: {
        get: function _getId() {
            return this._id || 0;
        },
        set: function _setId(val) {
            this._id = val;
        }
    },
    next: {
        value: function _next(val) {
            this.buffer[this.buffer.length] = val;
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, interval) {
            this.initialize(subscriber);
            this.buffer = [];
            this.now = Date.now;

            function _interval() {
                if (this.buffer.length) {
                    //the mapWith is needed here because, due to the asychronous nature of subscribers and the subsequent
                    //clearing of the buffer, the subscriber#next argument would be nullified before it had a chance
                    //to act on it.
                    this.subscriber.next(this.buffer.map(function _mapBuffer(item) {
                        return item;
                    }));
                    this.buffer.length = 0;
                }
            }

            this.id = setInterval(_interval.bind(this), interval);
            return this;
        },
        writable: false,
        configurable: false
    },
    cleanUp: {
        value: function _cleanUp() {
            clearInterval(this.id);
            this.buffer.length = 0;
        },
        writable: false,
        configurable: false
    }
});

exports.timeBufferSubscriber = timeBufferSubscriber;

},{"./subscriber":53}]},{},[20])

//# sourceMappingURL=index.js.mapWith
