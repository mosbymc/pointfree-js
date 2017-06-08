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
var add = curry(function _add(x, y) {
    return x + y;
});

/**
 * and :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description:
 * @type {function}
 * @param: {*} a
 * @param: {*} b
 * @return: {boolean}
 */
var and = curry(function _and(a, b) {
    return !!(a && b);
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
var delegatesFrom = curry(function _delegatesFrom(delegate, delegator) {
    return delegate.isPrototypeOf(delegator);
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
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var divide = curry(function _divide(x, y) {
    return x / y;
});

/**
 * @description:
 * @type: {function}
 * @param: {*} x
 * @param: {*} y
 * @return: {boolean}
 */
var equal = curry(function _curry(x, y) {
    return x == y;
});

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
function flip(x) {
    return !x;
}

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
 * @description:
 * @type: {function}
 * @param: {number | string} x
 * @param: {number | string} y
 * @return: {boolean}
 */
var greaterThan = curry(function _greaterThan(x, y) {
    return x > y;
});

/**
 * @description:
 * @type: {function}
 * @param: {string | number} x
 * @param: {string | number} y
 * @return: {boolean}
 */
var greaterThanOrEqual = curry(function _greaterThanOrEqual(x, y) {
    return x >= y;
});

/**
 * isArray :: a -> Boolean
 * @description:
 * @param: data
 * @return: {boolean}
 */
function isArray(data) {
    return Array.isArray(data);
}

/**
 * @description:
 * @param: {boolean} bool
 * @return: {boolean}
 */
function isBoolean(bool) {
    return javaScriptTypes.boolean === type(bool);
}

/**
 * isFunction :: a -> Boolean
 * @description:
 * @param: {function} fn
 * @return: {boolean}
 */
function isFunction(fn) {
    return javaScriptTypes.function === type(fn);
}

/**
 * isObject :: a -> Boolean
 * @description:
 * @param: item
 * @return: {boolean}
 */
function isObject(item) {
    return javaScriptTypes.object === type(item) && null !==  item;
}

/**
 * @description:
 * @param: {*} x
 * @return: {boolean}
 */
function isNothing(x) {
    return null == x;
}

/**
 * @description:
 * @param: {*} n
 * @return: {string|boolean}
 */
function isNull(n) {
    return type(n) && null === n;
}

/**
 * @description:
 * @param: {number} num
 * @return: {boolean}
 */
function isNumber(num) {
    return javaScriptTypes.number === type(num);
}

/**
 * @description:
 * @param: {*} x
 * @return: {boolean}
 */
function isSomething(x) {
    return null != x;
}

/**
 * @description:
 * @param: {string} str
 * @return: {boolean}
 */
function isString(str) {
    return javaScriptTypes.string === type(str);
}

/**
 * @description:
 * @param: {Symbol} sym
 * @return: {boolean}
 */
function isSymbol(sym) {
    return javaScriptTypes.symbol === type(sym);
}

/**
 * @description:
 * @param: {*} u
 * @return: {boolean}
 */
function isUndefined(u) {
    return javaScriptTypes.undefined === type(u);
}

/**
 * @description:
 * @type: {function}
 * @param: {string | number} x
 * @param: {string | number} y
 * @return: {boolean}
 */
var lessThan = curry(function _lessThan(x, y) {
    return x < y;
});

/**
 * @description:
 * @type: {function}
 * @param: {string | number} x
 * @param: {string | number} y
 * @return: {boolean}
 */
var lessThanOrEqual = curry(function _lessThanOrEqual(x, y) {
    return x <= y;
});

/**
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var modulus = curry(function _modulus(x, y) {
    return x % y;
});

/**
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var multiple = curry(function _multiple(x, y) {
    return x * y;
});

/**
 * @description:
 * @param: {number} x
 * @return: {number}
 */
function negate(x) {
    return -x;
}

/**
 * @description:
 * @type: {function}
 * @param: {*}
 * @param: {*}
 * @return: {boolean}
 */
var notEqual = curry(function _notEqual(x, y) {
    return x != y;
});

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
    return function _once(...args) {
        return invoked ? undefined : fn(...args);
    };
}

/**
 * or :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description:
 * @type {function}
 * @param: {*} a
 * @param: {*} b
 * @return: {boolean}
 */
var or = curry(function _or(a, b) {
    return !!(a || b);
});

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
var strictEqual = curry(function _strictEqual(x, y) {
    return x === y;
});

/**
 * @description:
 * @type: {function}
 * @param: {*} x
 * @param: {*} y
 * @return: {boolean}
 */
var strictNotEqual = curry(function _strictNotEqual(x, y) {
    return x !== y;
});

/**
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var subtract = curry(function _subtract(x, y) {
    return x - y;
});

/**
 * @description:
 * @param: {*} x
 * @return: {boolean}
 */
function truthy(x) {
    return flip(falsey(x));
}

/**
 * @description:
 * @param: {*} a
 * @return: {string}
 */
function type(a) {
    return typeof a;
}

/**
 * wrap :: a -> [a]
 * @description: Takes any value of any type and returns an array containing
 * the value passed as its only item
 *
 * @param: {*} data - Any value, any type
 * @return: {[*]} - Returns an array of any value, any type
 */
function wrap(data) {
    return [data];
}

export { add, adjust, and, arraySet, concat, defaultPredicate, delegatesFrom, delegatesTo, divide, equal, falsey, flip,
        get, greaterThan, greaterThanOrEqual, isArray, isBoolean, isFunction, isObject, isNothing, isNull, isNumber,
        isSomething, isString, isSymbol, isUndefined, lessThan, lessThanOrEqual, modulus, multiple, negate, notEqual, noop,
        nth, objectSet, once, or, set, strictEqual, strictNotEqual, subtract, truthy, type, wrap };