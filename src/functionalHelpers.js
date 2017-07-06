import { javaScriptTypes, shallowClone } from './helpers';
import { curry, identity, constant } from './combinators';

/**
 * @description: Updates the value stored in a single specified index of an array. The function
 * argument should be some form of a unary projector. The 'projector' function will receive
 * the value stored in the existing array at the specified 'idx' argument location. A new array
 * is returned and the original array remains unchanged.
 * @type: {function}
 * @param: {function} fn - A function that can operate on a single point of data from the array
 * and a value to be used as an update for the same index in the new array.
 * @param: {number} idx - A number representing the zero-based offset of the array; idx determines
 * what value will be passed as the unary argument to the operator function and what index in the
 * newly created array will be altered. If the value is less than zero, the function will use the
 * 'idx' argument value as an offset from the last element in the array.
 * @param: {Array} List - The List to update.
 * @return: {Array} - Returns a new array identical to the original array except where the new,
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
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var add = curry((x, y) => x + y);

/**
 * and :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description:
 * @type {function}
 * @param: {*} a
 * @param: {*} b
 * @return: {boolean}
 */
var and = curry((a, b) => !!(a && b));

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
    return adjust(constant(x), idx, list);
});

/**
 * @description:
 * @param: {Array} first
 * @param: {Array} rest
 * @return: {string | Array}
 */
function concat(first, ...rest) {
    if (null == rest || !rest.length) return first;
    return rest.reduce(function _concatStrings(cur, next) {
        return cur.concat(next);
    }, first);
}

/**
 * @description:
 * @type: {function}
 * @returns: {boolean}
 */
var defaultPredicate = constant(true);

/**
 * @description:
 * @type: {function}
 * @param: {object} delegate
 * @param: {object} delegator
 * @returns: {boolean}
 */
var delegatesFrom = curry((delegate, delegator) => delegate.isPrototypeOf(delegator));

/**
 * @description:
 * @type: {function}
 * @param: {object} delegator
 * @param: {object} delegate
 * @returns: {boolean}
 */
var delegatesTo = curry((delegator, delegate) => delegate.isPrototypeOf(delegator));

/**
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var divide = curry((x, y) => x / y);

/**
 * @description:
 * @type: {function}
 * @param: {*} x
 * @param: {*} y
 * @return: {boolean}
 */
var equals = curry((x, y) => x == y);

/**
 * @description:
 * @type {flip}
 * @see flip
 * @param {*} x
 * @returns {boolean}
 */
var falsey = flip;

/**
 * @description:
 * @param: {*} x
 * @return: {boolean}
 */
var flip = x => !x;

/**
 * @description:
 * @type: {function}
 * @param: {string} prop
 * @param: {object} obj
 * @returns: {*}
 */
var getWith = curry((prop, obj) => obj[prop]);

/**
 * @description:
 * @type: {function}
 * @param: {number | string} x
 * @param: {number | string} y
 * @return: {boolean}
 */
var greaterThan = curry((x, y) => x > y);

/**
 * @description:
 * @type: {function}
 * @param: {string | number} x
 * @param: {string | number} y
 * @return: {boolean}
 */
var greaterThanOrEqual = curry((x, y) => x >= y);

/**
 * isArray :: a -> Boolean
 * @description:
 * @param: data
 * @return: {boolean}
 */
var isArray = data => Array.isArray(data);

/**
 * @description:
 * @param: {boolean} bool
 * @return: {boolean}
 */
var isBoolean = bool => javaScriptTypes.Boolean === type(bool);

/**
 * isFunction :: a -> Boolean
 * @description:
 * @param: {function} fn
 * @return: {boolean}
 */
var isFunction = fn => javaScriptTypes.Function === type(fn);

/**
 * isObject :: a -> Boolean
 * @description:
 * @param: item
 * @return: {boolean}
 */
var isObject = item => javaScriptTypes.Object === type(item) && null !== item;

/**
 * @description:
 * @param: {*} x
 * @return: {boolean}
 */
var isNothing = x => null == x;

/**
 * @description:
 * @param: {*} n
 * @return: {string|boolean}
 */
var isNull = n => type(n) && null === n;

/**
 * @description:
 * @param: {number} num
 * @return: {boolean}
 */
var isNumber = num => javaScriptTypes.Number == type(num);

/**
 * @description:
 * @param: {*} x
 * @return: {boolean}
 */
var isSomething = x => null != x;

/**
 * @description:
 * @param: {string} str
 * @return: {boolean}
 */
var isString = str => javaScriptTypes.String === type(str);

/**
 * @description:
 * @param: {Symbol} sym
 * @return: {boolean}
 */
var isSymbol = sym => javaScriptTypes.Symbol === type(sym);

/**
 * @description:
 * @param: {*} u
 * @return: {boolean}
 */
var isUndefined = u => javaScriptTypes.Undefined === type(u);

/**
 * @description:
 * @type: {function}
 * @param: {string | number} x
 * @param: {string | number} y
 * @return: {boolean}
 */
var lessThan = curry((x, y) => x < y);

/**
 * @description:
 * @type: {function}
 * @param: {string | number} x
 * @param: {string | number} y
 * @return: {boolean}
 */
var lessThanOrEqual = curry((x, y) => x <= y);

/**
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var modulus = curry((x, y) => x % y);

/**
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var multiple = curry((x, y) => x * y);

/**
 * @description:
 * @param: {number} x
 * @return: {number}
 */
var negate = x => -x;

/**
 * @description:
 * @type: {function}
 * @param: {*}
 * @param: {*}
 * @return: {boolean}
 */
var notEqual = curry((x, y) => x != y);

/**
 * @description: No-op function; used as default function in some cases when argument is optional
 * and consumer does not provide.
 * @returns: {undefined}
 */
function noop() {}

/**
 * @description:
 * @type: {function}
 * @param: {number} offset
 * @param: {Array} List
 * @return: {*}
 */
var nth = curry(function nth(offset, list) {
    var idx = 0 > offset ? list.length + offset : offset;
    return 'string' === typeof list ? list.charAt(idx) : list[idx];
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
    var result = shallowClone(obj);
    result[prop] = val;
    return result;
});

/**
 * @description:
 * @param: {function} fn
 * @returns: {function}
 */
function once(fn) {
    var invoked = false;
    return (...args) => invoked ? undefined : fn(...args);
}

/**
 * or :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description:
 * @type {function}
 * @param: {*} a
 * @param: {*} b
 * @return: {boolean}
 */
var or = curry((a, b) => !!(a || b));

/**
 * @description:
 * @type: {function}
 * @param: {string} prop
 * @param: {*} val
 * @param: {object} obj
 * @return: {object}
 */
var set = curry(function _set(prop, val, obj) {
    obj[prop] = val;
    return obj;
});

/**
 * @description:
 * @type: {function}
 * @param: {*} x
 * @param: {*} y
 * @return: {boolean}
 */
var strictEquals = curry((x, y) => x === y);

/**
 * @description:
 * @type: {function}
 * @param: {*} x
 * @param: {*} y
 * @return: {boolean}
 */
var strictNotEqual = curry((x, y) => x !== y);

/**
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var subtract = curry((x, y) => x - y);

/**
 * @description:
 * @param: {*} x
 * @return: {boolean}
 */
var truthy = x => flip(falsey(x));

/**
 * @description:
 * @param: {*} a
 * @return: {string}
 */
var type = a => typeof a;

/**
 * wrap :: a -> [a]
 * @description: Takes any value of any type and returns an array containing
 * the value passed as its only item
 *
 * @param: {*} data - Any value, any type
 * @return: {[*]} - Returns an array of any value, any type
 */
var wrap = data => [data];

function reverse(...args) {
    if (1 === args.length) {
        if ('string' === typeof args[0]) return args[0].split('').reverse().join();
        return args;
    }
    return args.reverse();
}

export { add, adjust, and, arraySet, concat, defaultPredicate, delegatesFrom, delegatesTo, divide, equals, falsey, flip,
        getWith, greaterThan, greaterThanOrEqual, isArray, isBoolean, isFunction, isObject, isNothing, isNull, isNumber,
        isSomething, isString, isSymbol, isUndefined, lessThan, lessThanOrEqual, modulus, multiple, negate, notEqual, noop,
        nth, objectSet, once, or, set, strictEquals, strictNotEqual, subtract, truthy, type, wrap, reverse };