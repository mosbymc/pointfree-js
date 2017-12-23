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
 * @signature both :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
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
 * greater than operator on the two arguments. The operation is performed as: x > y where 'x' is the
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
 * @description Accepts any two strings or numbers and returns the result of using the
 * 'greater than or equal to' operator on the two arguments. The operation is performed
 * as: x >= y where 'x' is the first argument and 'y' is the second.
 * @kind function
 * @function greaterThanOrEqual
 * @param {string | number} x - A number or string value
 * @param {string | number} y - A number or string value
 * @return {boolean} - Returns a boolean indicating if the first argument is greater than or
 * equal to the second.
 */
var greaterThanOrEqual = curry((x, y) => x >= y);

/**
 * @signature has :: String -> Object -> Boolean
 * @description Determines if an object has a specified own property.
 * @kind function
 * @function has
 * @param {string} prop - The property to check for 'own' ownership
 * @param {object} obj - The object to check
 * @return {boolean} - Returns a boolean indicating if the object has the property
 * as it's own; i.e. assigned to the object itself, not found in the object's
 * prototype chain.
 */
var has = curry(function _has(prop, obj) {
    return obj.hasOwnProperty(prop);
});

/**
 * @signature inObject :: String -> Object -> Boolean
 * @description Determines if a specified property can be found 'in' a given object.
 * @kind function
 * @function inObject
 * @param {string} prop - The property to check existence
 * @param {object} obj - The object to check
 * @return {boolean} - Returns a boolean indicating if the object has the property
 * assigned directly to it, or if it exists in the object's prototype chain.
 */
var inObject = curry(function _inObject(prop, obj) {
    return prop in obj;
});

/**
 * @signature invoke :: Function -> *
 * @description Accepts a single function and invokes it with no arguments. Good for getting an
 * iterator from a generator function.
 * @param {function|generator} fn - The function to be invoked
 * @return {*} - Returns the return value of the invoked function
 */
var invoke = fn => fn();

/**
 * @signature isArray :: a -> Boolean
 * @description Accepts any value and returns a boolean indicating if it is an array
 * @param {*} data - Any value
 * @return {boolean} - Returns 'true' if the value is an array, 'false' otherwise
 */
var isArray = data => Array.isArray(data);

/**
 * @signature isBoolean :: * -> Boolean
 * @description Accepts any value and returns a boolean indicating if it is a boolean
 * @param {*} [bool] - Any value
 * @return {boolean} - Returns 'true' if the value is an array, 'false' otherwise
 */
var isBoolean = bool => javaScriptTypes.Boolean === type(bool);

/**
 * @signature isFunction :: a -> Boolean
 * @description Accepts any value and returns a boolean indicating if it is a function
 * @param {function} [fn] - Any value
 * @return {boolean} - Returns 'true' if the value is a function, 'false' otherwise
 */
var isFunction = fn => javaScriptTypes.Function === type(fn);

/**
 * @signature isObject :: a -> Boolean
 * @description Accepts any value and returns a boolean indicating if it is an object
 * @param {*} [item] - Any value
 * @return {boolean} - Returns 'true' if the value is an object, 'false' otherwise
 */
var isObject = item => javaScriptTypes.Object === type(item) && null !== item;

/**
 * @signature isPrimitive :: * -> Boolean
 * @description Accepts any value and returns a boolean indicating if it is a primitive value
 * @param {*} [item] - Any value
 * @return {boolean} - Returns 'true' if the value is primitive (i.e. number, string, boolean, null, undefined),
 * 'false' otherwise
 */
function isPrimitive(item) {
    var itemType = type(item);
    return itemType in typeNames && (isNothing(item) || (javaScriptTypes.Object !== itemType && javaScriptTypes.Function !== itemType));
}

/**
 * @signature isNothing :: * -> Boolean
 * @description Accepts any value and returns a boolean indicating if it is 'null' or 'undefined'
 * @param {*} [x] - Any value
 * @return {boolean} - Returns 'true' if the value is 'null' or 'undefined', 'false' otherwise
 */
var isNothing = x => null == x;

/**
 * @signature isNull :: * -> Boolean
 * @description Accepts any value and returns a boolean indicating if it is null
 * @param {*} [n] - Any value
 * @return {boolean} - Returns 'true' if the value is 'null', 'false' otherwise
 */
var isNull = n => null === n;

/**
 * @signature isNumber :: * -> Boolean
 * @description Accepts any value and returns a boolean indicating if it is a number
 * @param {*} [num] - Any value
 * @return {boolean} - Returns 'true' if the value is a number, 'false' otherwise
 */
var isNumber = num => javaScriptTypes.Number == type(num);

/**
 * @signature isSomething :: * -> Boolean
 * @description Accepts any value and returns a boolean indicating if it is not 'null' or 'undefined'
 * @param {*} [x] - Any value
 * @return {boolean} - Returns 'true' if the value is not 'null' or 'undefined', 'false' otherwise
 */
var isSomething = x => null != x;

/**
 * @signature isString :: * -> Boolean
 * @description Accepts any value and returns a boolean indicating if it is a string
 * @param {string} str - Any value
 * @return {boolean} - Returns 'true' if the value is a string, 'false' otherwise
 */
var isString = str => javaScriptTypes.String === type(str);

/**
 * @signature isSymbol :: * -> Boolean
 * @description Accepts any value and returns a boolean indicating if it is a symbol
 * @param {*} [sym] - Any value
 * @return {boolean} - Returns 'true' if the value is a symbol, 'false' otherwise
 */
var isSymbol = sym => javaScriptTypes.Symbol === type(sym);

/**
 * @signature isUndefined :: * -> Boolean
 * @description Accepts and value and returns a boolean indicating if it is 'undefined'
 * @param {*} [u] - Any value
 * @return {boolean} - Returns 'true' if the value is 'undefined', 'false' otherwise
 */
var isUndefined = u => javaScriptTypes.Undefined === type(u);

/**
 * @signature lessThan :: Number -> Number -> Boolean
 * @description Accepts any two strings or numbers and returns the result of using the
 * less than operator on the two arguments. The operation is performed as: x < y where 'x' is the
 * first argument and 'y' is the second.
 * @kind function
 * @function lessThan
 * @param {string | number} x - Any number or string
 * @param {string | number} y - Any number or string
 * @return {boolean} Returns a boolean value indicating if the first value is less than the second.
 */
var lessThan = curry((x, y) => x < y);

/**
 * @signature lessThanOrEqual :: Number -> Number -> Boolean
 * @description Accepts any two strings or numbers and returns the result of using the
 * less than or equal operator on the two arguments. The operation is performed as:
 * x <= y where 'x' is the first argument and 'y' is the second.
 * @kind function
 * @function lessThanOrEqual
 * @param {string | number} x - Any number or string
 * @param {string | number} y - Any number or string
 * @return {boolean} - Returns a boolean value indicating if the first value is less
 * than or equal to the second.
 */
var lessThanOrEqual = curry((x, y) => x <= y);

/**
 * @signature * -> * -> Map -> Map
 * @description Accepts a a key-value pair to either insert into a map, or updating
 * an existing entry. A new map is created with the inserted/updated value, and the
 * original map is left unmodified.
 * @kind function
 * @function mapSet
 * @param {*} key - The key to which the new value should be associated
 * @param {*} val - The value to insert into/update the map
 * @param {Map} xs - The map object to be updated
 * @return {Map} - Returns a new map object with the kvp set as specified
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
 * @signature modulus :: Integer -> Integer -> Integer
 * @description Accepts any two integers and returns the result of modulating the
 * first integer with the second. This is different from the 'remainder' function
 * in that the sign of the remainder is returned 'correctly' according to a modulus
 * operation; i.e. the sign is taken from the divisor, not the dividend.
 * @see remainder
 * @kind function
 * @function modulus
 * @param {Integer} x - Any integer
 * @param {Integer} y - Any integer
 * @return {Integer} - Returns the remainder of modulating the first integer by the second
 */
var modulus = curry(function _modulus(x, y) {
    let sign = !!((0 > x) ^ (0 > y)) ? -1 : 1;
    return sign * remainder(x, y);
});

/**
 * @signature multiply :: Number -> Number -> Number
 * @description Accepts and two numbers and returns the result of multiplying them together
 * @kind function
 * @function multiply
 * @param {number} x - Any number
 * @param {number} y - Any number
 * @return {number} - Returns the result of multiplying 'x' by 'y'
 */
var multiply = curry((x, y) => x * y);

/**
 * @signature negate :: Number -> Number
 * @description Accepts a single number or boolean value and flips its sign; i.e. a positive
 * number will become negative and a negative number will become positive in the case of numbers,
 * and 'true' will become 'false', and 'false' will become 'true' in the case of booleans.
 * @param {Number|Boolean} x - Any number or boolean value
 * @return {Number|Boolean} - Returns a negated numeric value or an inverted boolean value
 */
var negate = x => -x;

/**
 * @signature notEqual :: * -> * -> -> Boolean
 * @description Accepts any two value and returns the result of applying the loose not
 * equal operator on them.
 * @kind function
 * @function notEqual
 * @param {*} - Any value
 * @param {*} - Any value
 * @return {boolean} - Returns 'true' if the value are loose not equal, 'false' otherwise
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
 * @signature Integer -> * -> *
 * @description Accepts an integer offset from the zeroth index of an array or string
 * and an array or string and returns the value at the specified offset. Negative integers
 * can be used to count backwards from the end of the array or string.
 * @kind function
 * @function nth
 * @param {number} offset - An integer zero-based offset
 * @param {Array|String} List - An array list or string
 * @return {*} - Returns either the item at the specified index of the array or the character
 * at the specified index of the string.
 */
var nth = curry(function nth(offset, list) {
    var idx = 0 > offset ? list.length + offset : offset;
    return 'string' === typeof list ? list.charAt(idx) : list[idx];
});

/**
 * @signature String -> * -> {} -> {}
 * @description Accepts a property name, value, and object and will return a new object
 * with the value provided assigned to the specified property. The original object remains
 * unchanged.
 * @kind function
 * @function objectSet
 * @param {String} prop - The name of the property that the value should be assigned to
 * @param {*} val - The value that should be assigned to the property name
 * @param {Object} obj - The object to clone and update
 * @return {Object} - Returns a cloned version of the provided object with the exception
 * of the addition/update of the specified property.
 */
var objectSet = curry(function _objectSet(prop, val, obj) {
    var result = shallowClone(obj);
    result[prop] = val;
    return result;
});

/**
 * @signature () -> ()
 * @description Accepts a function and returns a function awaiting invocation with zero or more
 * arguments. When the returned function is invoked, it will in turn invoke the provided function
 * with whatever arguments were passed to it. Subsequent invocation will not cause the provided
 * function to be executed again and 'undefined' will be returned.
 * @param {function} fn - A function that should only ever be invoked once
 * @return {function} - Returns a function awaiting invocation
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
 * @signature or :: * -> * -> -> Boolean
 * @description Accepts any two arguments and returns a boolean value based on
 * either of the two arguments being truthy
 * @kind function
 * @function or
 * @param {*} a - Any value
 * @param {*} b - Any value
 * @return {boolean} Returns 'true' if either argument is truthy, 'false' otherwise
 */
var or = curry((a, b) => !!(a || b));

/**
 * @signature Integer -> Integer -> Integer
 * @description Accepts two integer arguments and returns the remainder after dividing
 * the first integer by the second. This is different from the {@link remainder} function
 * in that the sign of the remainder is not changed to a true modulus remainder sign and
 * is instead based in the dividend, not the divisor.
 * @see modulus
 * @kind function
 * @param {Integer} x - Any integer
 * @param {Integer} y - Any integer
 * @return {Integer} Returns the remainder of a division operation
 */
var remainder = curry((x, y) => x % y);

/**
 * @signature reverse :: *... -> Array
 * @description Accepts either an array of arguments, a string, or several individual
 * arguments and returns an array of arguments in reverse order they were received.
 * @param {Array|String|*} args - An array, string, or several individual arguments
 * @return {Array|String} - Returns a string if a string was received, or an array; all
 * values are returned in reverse order they were received
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
        lessThanOrEqual, mapSet, modulus, multiply, negate, notEqual, noop, nth, objectSet, once, or, remainder, reverse,
        setSet, strictEquals, strictNotEqual, subtract, truthy, type, wrap };