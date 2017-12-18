import { javaScriptTypes, typeNames, shallowClone } from './helpers';
import { curry, identity, constant } from './combinators';

/** @module functionalHelpers */

/**
 * @signature
 * @description Updates the value stored in a single specified index of an array. The function
 * argument should be some form of a unary projector. The 'projector' function will receive
 * the value stored in the existing array at the specified 'idx' argument location. A new array
 * is returned and the original array remains unchanged.
 * @kind function
 * @function adjust
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
 * @signature add :: Number -> Number -> Number
 * @signature String -> String -> String
 * @description Adds two numbers together and returns the result
 * @kind function
 * @function add
 * @param {number} x - A number
 * @param {number} y - A number
 * @return {number} - A number; the result of adding the two arguments
 */
var add = curry((x, y) => x + y);

/**
 * @signature and :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description Performs an '&&' operation on any two arguments and returns the result
 * @kind function
 * @function and
 * @param {*} a - Any value
 * @param {*} b - Any value
 * @return {boolean} - Returns 'true' if both arguments are truthy, 'false' otherwise
 */
var and = curry((a, b) => !!(a && b));

/**
 * @signature arraySet :: Number -> * -> [] -> []
 * @description Updates the value at a specified index of an array by first creating a shallow copy
 * of the array and then updating its value at the specified index.
 * @kind function
 * @function arraySet
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
 * @signature both :: () -> () -> [*] -> Boolean
 * @description Accepts two functions as arguments and returns a function waiting to be invoked.
 * Any arguments passed to the returned function will be passed to the initial two function arguments
 * during invocation. If the result of both of the two function arguments is truthy, the result will
 * be 'true', otherwise the result will be 'false'.
 * @kind function
 * @function both
 * @param {function} f - a
 * @param {function} g - b
 * @return {function} - c
 */
var both = curry(function _both(f, g) {
    return (...args) => !!(f(...args) && g(...args));
});

/**
 * @signature
 * @description Accepts a string or an array and returns a function that accepts any number of
 * individual arguments. When the returned function is invoked, it will concatenate all the individual
 * arguments to the initial string or array passed in and return either a string or an array based on the
 * type of the initial parameter.
 * @param {Array|String} first - A string or an array
 * @return {function} - Returns a function waiting for zero or more arguments to concatenate to
 * the string or array.
 */
var concat = first => (...rest) => null == rest || !rest.length ? first :
    rest.reduce(function _concatStrings(cur, next) {
        return cur.concat(next);
    }, first);

/**
 * @signature defaultPredicate :: * -> Boolean
 * @description A function that always returns 'true'
 * @kind function
 * @function defaultPredicate
 * @return {boolean} - The return value of this function will always be 'true', regardless
 * of any arguments passed to it.
 */
var defaultPredicate = constant(true);

/**
 * @signature delegatesFrom :: {} -> {} -> Boolean
 * @description Accepts any two objects and returns a boolean indicating if the first
 * object is in the prototype chain of the second object.
 * @kind function
 * @function delegatesFrom
 * @param {object} delegate - The delegate object
 * @param {object} delegator - The delegator object
 * @return {boolean} - Returns 'true' if the delegator delegates to the delegate, 'false' otherwise.
 */
var delegatesFrom = curry((delegate, delegator) => delegate.isPrototypeOf(delegator));

/**
 * @signature delegatesTo :: {} -> {} -> Boolean
 * @description Accepts any two objects and returns a boolean indicating if the second
 * object is in the prototype chain of the first object.
 * @kind function
 * @function delegatesTo
 * @param {object} delegator - The delegator object
 * @param {object} delegate - The delegate object
 * @return {boolean} - Returns 'true' if the delegator delegates to the delegate, 'false' otherwise.
 */
var delegatesTo = curry((delegator, delegate) => delegate.isPrototypeOf(delegator));

/**
 * @signature divide :: Number -> Number -> Number
 * @description Accepts any two numbers and returns the result of dividing the first number
 * by the second number.
 * @kind function
 * @function divide
 * @param {number} x - The dividend
 * @param {number} y - The divisor
 * @return {number} - Returns the quotient
 */
var divide = curry((x, y) => x / y);

/**
 * @signature either :: () -> () -> Boolean
 * @description Accepts two function, invokes them both, and returns true if either of
 * the function returns a truthy value, false otherwise.
 * @kind function
 * @function either
 * @param {function} f - A function to be tested for truthiness
 * @param {function} g - A function to be tested for truthiness
 * @return {boolean} - A boolean value indicating the truthiness of either function
 */
var either = curry(function _either(f, g) {
    return !!(f() || g());
});

/**
 * @signature equals :: * -> * -> Boolean
 * @description Accepts any two values and returns a boolean indicating loose equality of the values
 * @kind function
 * @function equals
 * @param {*} x - Any value
 * @param {*} y - Any value
 * @return {boolean} - A boolean indicating if the two values are loose equal
 */
var equals = curry((x, y) => x == y);

/**
 * @signature falsey :: * -> Boolean
 * @description Accepts any value and returns a boolean indicating if the value is falsey or not
 * @kind function
 * @function falsey
 * @see flip
 * @param {*} x - Any value
 * @return {boolean} - Returns 'true' if the value provided is falsey, 'false' otherwise
 */
var falsey = flip;

/**
 * @signature flip :: * -> Boolean
 * @description Accepts any value and applies the '!' operator to it.
 * @param {*} x - Any value
 * @return {boolean} - Returns 'false' is the value is truthy, 'true' otherwise.
 */
var flip = x => !x;

/**
 * @signature getWith :: String -> Object -> *
 * @description Returns a the value assigned to a property of an object.
 * @kind function
 * @function getWith
 * @param {string} prop - The property of the object whose assigned value should be returned.
 * @param {object} obj - The object that has the property who's assigned value should be returned.
 * @return {*} - Returns whatever value is assigned to the object's property
 */
var getWith = curry((prop, obj) => obj[prop]);

/**
 * @signature greaterThan :: Number -> Number -> Boolean
 * @description Accepts any two strings or numbers and returns the result of using the
 * greater than operator on the two arguments. The is performed as: x > y where 'x' is the
 * first argument and 'y' is the second.
 * @kind function
 * @function greaterThan
 * @param {number | string} x - A number or string value
 * @param {number | string} y - A number or string value
 * @return {boolean} - Returns a boolean indicating if the first argument is greater than the second
 */
var greaterThan = curry((x, y) => x > y);

/**
 * @signature greaterThanOrEqual :: Number -> Number -> Boolean
 * @description d
 * @kind function
 * @function greaterThanOrEqual
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var greaterThanOrEqual = curry((x, y) => x >= y);

/**
 * @signature has :: String -> Object -> Boolean
 * @description d
 * @kind function
 * @function has
 * @param {string} prop - a
 * @param {object} obj - b
 * @return {boolean} - c
 */
var has = curry(function _has(prop, obj) {
    return obj.hasOwnProperty(prop);
});

/**
 * @signature inObject :: String -> Object -> Boolean
 * @description d
 * @kind function
 * @function inObject
 * @param {string} key - a
 * @param {object} obj - b
 * @return {boolean} - c
 */
var inObject = curry(function _inObject(prop, obj) {
    return prop in obj;
});

/**
 * @signature invoke :: Function -> *
 * @description d
 * @param {function|generator} fn - a
 * @return {*} - b
 */
var invoke = fn => fn();

/**
 * @signature isArray :: a -> Boolean
 * @description d
 * @param {*} data - a
 * @return {boolean} - b
 */
var isArray = data => Array.isArray(data);

/**
 * @signature isBoolean :: * -> Boolean
 * @description d
 * @param {*} [bool] - a
 * @return {boolean} - b
 */
var isBoolean = bool => javaScriptTypes.Boolean === type(bool);

/**
 * @signature isFunction :: a -> Boolean
 * @description d
 * @param {function} [fn] - a
 * @return {boolean} - b
 */
var isFunction = fn => javaScriptTypes.Function === type(fn);

/**
 * @signature isObject :: a -> Boolean
 * @description d
 * @param {*} [item] - a
 * @return {boolean} - b
 */
var isObject = item => javaScriptTypes.Object === type(item) && null !== item;

/**
 * @signature isPrimitive :: * -> Boolean
 * @description d
 * @param {*} [item] - a
 * @return {boolean} - b
 */
function isPrimitive(item) {
    var itemType = type(item);
    return itemType in typeNames && (isNothing(item) || (javaScriptTypes.Object !== itemType && javaScriptTypes.Function !== itemType));
}

/**
 * @signature isNothing :: * -> Boolean
 * @description d
 * @param {*} [x] - a
 * @return {boolean} - b
 */
var isNothing = x => null == x;

/**
 * @signature isNull :: * -> Boolean
 * @description d
 * @param {*} [n] - a
 * @return {string|boolean} - b
 */
var isNull = n => null === n;

/**
 * @signature isNumber :: * -> Boolean
 * @description d
 * @param {*} [num] - a
 * @return {boolean} - b
 */
var isNumber = num => javaScriptTypes.Number == type(num);

/**
 * @signature isSomething :: * -> Boolean
 * @description d
 * @param {*} [x] - a
 * @return {boolean} - b
 */
var isSomething = x => null != x;

/**
 * @signature isString :: * -> Boolean
 * @description d
 * @param {string} str - a
 * @return {boolean} - b
 */
var isString = str => javaScriptTypes.String === type(str);

/**
 * @signature isSymbol :: * -> Boolean
 * @description d
 * @param {*} [sym] - a
 * @return {boolean} - b
 */
var isSymbol = sym => javaScriptTypes.Symbol === type(sym);

/**
 * @signature isUndefined :: * -> Boolean
 * @description d
 * @param {*} [u] - a
 * @return {boolean} - b
 */
var isUndefined = u => javaScriptTypes.Undefined === type(u);

/**
 * @signature lessThan :: Number -> Number -> Boolean
 * @description d
 * @kind function
 * @function lessThan
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var lessThan = curry((x, y) => x < y);

/**
 * @signature lessThanOrEqual :: Number -> Number -> Boolean
 * @description d
 * @kind function
 * @function lessThanOrEqual
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var lessThanOrEqual = curry((x, y) => x <= y);

/**
 * @signature * -> * -> Map -> Map
 * @description d
 * @kind function
 * @function mapSet
 * @param {*} key - a
 * @param {*} val - b
 * @param {Map} xs - c
 * @return {Map} - d
 */
var mapSet = curry(function _mapSet(key, val, xs) {
    var ret = new Map();
    for (let k of xs.keys()) {
        ret.set(k, xs.get(k));
    }
    ret.set(key, val);
    return ret;
});

/**
 * @signature modulus :: Number -> Number -> Number
 * @description d
 * @kind function
 * @function modulus
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var modulus = curry((x, y) => x % y);

/**
 * @signature multiply :: Number -> Number -> Number
 * @description d
 * @kind function
 * @function multiply
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var multiply = curry((x, y) => x * y);

/**
 * @signature negate :: Number -> Number
 * @description d
 * @param {number} x - a
 * @return {number} - b
 */
var negate = x => -x;

/**
 * @signature notEqual :: * -> * -> -> Boolean
 * @description d
 * @kind function
 * @function notEqual
 * @param {*} - a
 * @param {*} - b
 * @return {boolean} - c
 */
var notEqual = curry((x, y) => x != y);

/**
 * @signature noop :: () -> Undefined
 * @description No-op function; used as default function in some cases when argument is optional
 * and consumer does not provide.
 * @returns {undefined} - a
 */
function noop() {}

/**
 * @signature
 * @description d
 * @kind function
 * @function nth
 * @param {number} offset - a
 * @param {Array} List - b
 * @return {*} - c
 */
var nth = curry(function nth(offset, list) {
    var idx = 0 > offset ? list.length + offset : offset;
    return 'string' === typeof list ? list.charAt(idx) : list[idx];
});

/**
 * @signature
 * @description d
 * @kind function
 * @function objectSet
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
 * @signature
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function once(fn) {
    var invoked = false,
        res;
    return function _once(...args) {
        if (!invoked) {
            invoked = true;
            res = fn(...args);
        }
        return res;
    };
}

/**
 * @signature or :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description d
 * @kind function
 * @function or
 * @param {*} a - a
 * @param {*} b - b
 * @return {boolean} - c
 */
var or = curry((a, b) => !!(a || b));

/**
 * @signature
 * @description d
 * @param {Array|String|*} args - a
 * @return {Array|String} - b
 */
function reverse(...args) {
    if (1 === args.length) {
        return isArray(args[0]) ? args[0].slice(0).reverse() : args[0].split('').reverse().join('');
    }
    return args.reverse();
}

/**
 * @signature setSet :: * -> * -> Set -> Set
 * @description d
 * @kind function
 * @function setSet
 * @param {*} val - a
 * @param {Set} set - b
 * @return {Set} - c
 */
var setSet = curry(function _setSet(oldVal, newVal, set) {
    var ret = new Set();
    for (let item of set) {
        if (item !== oldVal) ret.add(item);
    }
    ret.add(newVal);
    return ret;
});

/**
 * @signature strictEquals :: * -> * -> Boolean
 * @description d
 * @kind function
 * @function strictEquals
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var strictEquals = curry((x, y) => x === y);

/**
 * @signature strictNotEquals :: * -> * -> boolean
 * @description d
 * @kind function
 * @function strictNotEqual
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var strictNotEqual = curry((x, y) => x !== y);

/**
 * @signature subtract :: number -> number -> number
 * @description d
 * @kind function
 * @function subtract
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var subtract = curry((x, y) => x - y);

/**
 * @signature truthy :: * -> boolean
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var truthy = x => flip(flip(x));

/**
 * @signature type :: * -> string
 * @description d
 * @param {*} a - a
 * @return {string} - b
 */
var type = a => typeof a;

/**
 * @signature wrap :: a -> [a]
 * @description Takes any value of any type and returns an array containing
 * the value passed as its only item
 * @param {*} data - Any value, any type
 * @return {Array} - Returns an array of any value, any type
 */
var wrap = data => [data];

export { add, adjust, and, arraySet, both, concat, defaultPredicate, delegatesFrom, delegatesTo, divide, either, equals,
        falsey, flip, getWith, greaterThan, greaterThanOrEqual, has, inObject, invoke, isArray, isBoolean, isFunction,
        isObject, isPrimitive, isNothing, isNull, isNumber, isSomething, isString, isSymbol, isUndefined, lessThan,
        lessThanOrEqual, mapSet, modulus, multiply, negate, notEqual, noop, nth, objectSet, once, or, reverse, setSet,
        strictEquals, strictNotEqual, subtract, truthy, type, wrap };