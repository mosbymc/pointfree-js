import { javaScriptTypes, typeNames, shallowClone } from './helpers';
import { curry, identity, constant } from './combinators';

/**
 * @sig
 * @description Updates the value stored in a single specified index of an array. The function
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
 * @return {Array} - Returns a new array identical to the original array except where the new,
 * computed value is inserted
 */
var adjust = curry(function _adjust(fn, idx, list) {
    if (idx >= list.length || idx < -list.length) {
        return list;
    }
    var _idx = 0 > idx ? list.length + idx : idx,
        _list = list.map(identity);
    _list[_idx] = fn(list[_idx]);
    return _list;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var add = curry((x, y) => x + y);

/**
 * @sig and :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description d
 * @type {function}
 * @param {*} a - a
 * @param {*} b - b
 * @return {boolean} - c
 */
var and = curry((a, b) => !!(a && b));

/**
 * @sig
 * @description Updates the value at a specified index of an array by first creating a shallow copy
 * of the array and then updating its value at the specified index.
 * @type {function}
 * @note @see {@link adjust}
 * @param {number} idx - The index of the array to which the alternate value will be set.
 * @param {*} x - The value to be used to update the array at the index specified.
 * @param {Array} List - The List on which to perform the update.
 * @returns {Array} - Returns a new array with the value at the specified index being
 * set to the value of the 'x' argument.
 */
var arraySet = curry(function _arraySet(idx, x, list) {
    return adjust(constant(x), idx, list);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {boolean} - c
 */
var both = curry(function _both(f, g) {
    return !!(f() && g());
});

/**
 * @sig
 * @description d
 * @param {Array} first - a
 * @return {function} - b
 */
var concat = first => (...rest) => null == rest || !rest.length ? first :
    rest.reduce(function _concatStrings(cur, next) {
        return cur.concat(next);
    }, first);

/**
 * @sig
 * @description d
 * @type {function}
 * @return {boolean} - a
 */
var defaultPredicate = constant(true);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {object} delegate - a
 * @param {object} delegator - b
 * @return {boolean} - c
 */
var delegatesFrom = curry((delegate, delegator) => delegate.isPrototypeOf(delegator));

/**
 * @sig
 * @description d
 * @type {function}
 * @param {object} delegator - a
 * @param {object} delegate - b
 * @return {boolean} - c
 */
var delegatesTo = curry((delegator, delegate) => delegate.isPrototypeOf(delegator));

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var divide = curry((x, y) => x / y);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {boolean} - c
 */
var either = curry(function _either(f, g) {
    return !!(f() || g());
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var equals = curry((x, y) => x == y);

/**
 * @sig
 * @description d
 * @type {function}
 * @see flip
 * @param {*} x - a
 * @return {boolean} - b
 */
var falsey = flip;

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var flip = x => !x;

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {object} obj - b
 * @return {*} - c
 */
var getWith = curry((prop, obj) => obj[prop]);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number | string} x - a
 * @param {number | string} y - b
 * @return {boolean} - c
 */
var greaterThan = curry((x, y) => x > y);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var greaterThanOrEqual = curry((x, y) => x >= y);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {object} obj - b
 * @return {boolean} - c
 */
var has = curry(function _has(prop, obj) {
    return obj.hasOwnProperty(prop);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} key - a
 * @param {object} obj - b
 * @return {boolean} - c
 */
var inObject = curry(function _inObject(prop, obj) {
    return prop in obj;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
var invoke = fn => fn();

/**
 * @sig isArray :: a -> Boolean
 * @description d
 * @param {*} data - a
 * @return {boolean} - b
 */
var isArray = data => Array.isArray(data);

/**
 * @sig
 * @description d
 * @param {boolean} bool - a
 * @return {boolean} - b
 */
var isBoolean = bool => javaScriptTypes.Boolean === type(bool);

/**
 * @sig isFunction :: a -> Boolean
 * @description d
 * @param {function} fn - a
 * @return {boolean} - b
 */
var isFunction = fn => javaScriptTypes.Function === type(fn);

/**
 * @sig isObject :: a -> Boolean
 * @description d
 * @param {*} item - a
 * @return {boolean} - b
 */
var isObject = item => javaScriptTypes.Object === type(item) && null !== item;

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {boolean} - b
 */
function isPrimitive(item) {
    var itemType = type(item);
    return itemType in typeNames && (isNothing(item) || (javaScriptTypes.Object !== itemType && javaScriptTypes.Function !== itemType));
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var isNothing = x => null == x;

/**
 * @sig
 * @description d
 * @param {*} n - a
 * @return {string|boolean} - b
 */
var isNull = n => type(n) && null === n;

/**
 * @sig
 * @description d
 * @param {number} num - a
 * @return {boolean} - b
 */
var isNumber = num => javaScriptTypes.Number == type(num);

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var isSomething = x => null != x;

/**
 * @sig
 * @description d
 * @param {string} str - a
 * @return {boolean} - b
 */
var isString = str => javaScriptTypes.String === type(str);

/**
 * @sig
 * @description d
 * @param {Symbol} sym - a
 * @return {boolean} - b
 */
var isSymbol = sym => javaScriptTypes.Symbol === type(sym);

/**
 * @sig
 * @description d
 * @param {*} u - a
 * @return {boolean} - b
 */
var isUndefined = u => javaScriptTypes.Undefined === type(u);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var lessThan = curry((x, y) => x < y);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var lessThanOrEqual = curry((x, y) => x <= y);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} key - a
 * @param {*} val - b
 * @param {Map} map - c
 * @return {Map} - d
 */
var mapSet = curry(function _mapSet(key, val, map) {
    map.set(key, val);
    return map;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var modulus = curry((x, y) => x % y);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var multiply = curry((x, y) => x * y);

/**
 * @sig
 * @description d
 * @param {number} x - a
 * @return {number} - b
 */
var negate = x => -x;

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} - a
 * @param {*} - b
 * @return {boolean} - c
 */
var notEqual = curry((x, y) => x != y);

/**
 * @sig
 * @description No-op function; used as default function in some cases when argument is optional
 * and consumer does not provide.
 * @returns {undefined} - a
 */
function noop() {}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} offset - a
 * @param {Array} List - b
 * @return {*} - c
 */
var nth = curry(function nth(offset, list) {
    var idx = 0 > offset ? list.length + offset : offset;
    return 'string' === typeof list ? list.charAt(idx) : list[idx];
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {*} val - b
 * @param {object} obj - c
 * @return {object} - d
 */
var objectSet = curry(function _objectSet(prop, val, obj) {
    var result = shallowClone(obj);
    result[prop] = val;
    return result;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function once(fn) {
    var invoked = false;
    return function _once(...args) {
        if (!invoked) {
            invoked = true;
            fn(...args);
        }
    };
}

/**
 * @sig or :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description d
 * @type {function}
 * @param {*} a - a
 * @param {*} b - b
 * @return {boolean} - c
 */
var or = curry((a, b) => !!(a || b));

/**
 * @sig
 * @description d
 * @param {Array|String} xs - a
 * @return {Array|String} - b
 */
var reverse = xs => isArray(xs) ? xs.slice(0).reverse() : xs.split('').reverse().join('');

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {*} val - b
 * @param {object} obj - c
 * @return {object} - d
 */
var set = curry(function _set(prop, val, obj) {
    obj[prop] = val;
    return obj;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} val - a
 * @param {Set} set - b
 * @return {Set} - c
 */
var setSet = curry(function _setSet(val, set) {
    set.add(val);
    return set;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var strictEquals = curry((x, y) => x === y);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var strictNotEqual = curry((x, y) => x !== y);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var subtract = curry((x, y) => x - y);

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var truthy = x => flip(falsey(x));

/**
 * @sig
 * @description d
 * @param {*} a - a
 * @return {string} - b
 */
var type = a => typeof a;

/**
 * @sig wrap :: a -> [a]
 * @description Takes any value of any type and returns an array containing
 * the value passed as its only item
 * @param {*} data - Any value, any type
 * @return {Array} - Returns an array of any value, any type
 */
var wrap = data => [data];

function reverse2(...args) {
    if (1 === args.length) {
        if ('string' === typeof args[0]) return args[0].split('').reverse().join();
        return args;
    }
    return args.reverse();
}

export { add, adjust, and, arraySet, both, concat, defaultPredicate, delegatesFrom, delegatesTo, divide, either, equals,
        falsey, flip, getWith, greaterThan, greaterThanOrEqual, has, inObject, invoke, isArray, isBoolean, isFunction,
        isObject, isPrimitive, isNothing, isNull, isNumber, isSomething, isString, isSymbol, isUndefined, lessThan,
        lessThanOrEqual, mapSet, modulus, multiply, negate, notEqual, noop, nth, objectSet, once, or, reverse, set,
        setSet, strictEquals, strictNotEqual, subtract, truthy, type, wrap };