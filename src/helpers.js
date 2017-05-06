import { curry, kestrel } from './functionalHelpers';

/**
 * @description:
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
 * @description:
 * @type: {{inactive: number, active: number, paused: number, complete: number}}
 */
var observableStatus = {
    inactive: 0,
    active: 1,
    paused: 2,
    complete: 3
};

/**
 * @description:
 * @type: {{ascending: number, descending: number}}
 */
var sortDirection = {
    ascending: 1,
    descending: 2
};

/**
 * @description:
 * @param: {*} x
 * @param: {*} y
 * @param: {string} dir
 * @returns: {number}
 */
function sortComparer(x, y, dir) {
    var t = x > y ? 1 : x === y ? 0 : -1;
    return sortDirection.ascending === dir ? t : -t;
}

/**
 * @description:
 * @type: {function}
 * @param: {*} a
 * @param: {*} b
 * @returns: {boolean}
 */
var defaultEqualityComparer = curry(function _defaultEqualityComparer(a, b) {
    return a === b;
});

/**
 * @description:
 * @type: {function}
 * @param: {*} a
 * @param: {*} b
 * @returns: {boolean}
 */
var defaultGreaterThanComparer = curry(function defaultGreaterThanComparer(a, b) {
    return a > b;
});

/**
 * @description:
 * @type: {function}
 * @returns: {boolean}
 */
var defaultPredicate = kestrel(true);

/**
 * @description: - Prototype of a generator; used to detect if a function
 * argument is a generator or a regular function.
 * @type: {Object}
 */
var generatorProto = Object.getPrototypeOf(function *_generator(){});

/**
 * @description:
 * @param: {function} comparer
 * @return: {function}
 */
function cacher(comparer) {
    comparer = comparer || defaultEqualityComparer;
    var items = [];
    return function cacheChecker(item) {
        if (undefined === item || items.some(function _checkEquality(it) { return comparer(it, item); })) {
            return true;
        }
        items[items.length] = item;
        return false;
    };
}

/**
 * @description:
 * @param: {function} fn
 * @param: {function} keyMaker
 * @return {function}
 */
function memoizer(fn, keyMaker) {
    var lookup = new Map();
    return function _memoized(...args) {
        var key = javaScriptTypes.function === typeof keyMaker ? keyMaker(...args) : args;
        return lookup[key] || (lookup[key] = fn(...args));
    };
}

/**
 * @description:
 * @param: {*} obj
 * @returns: {*}
 */
function deepClone(obj) {
    if (null == obj || javaScriptTypes.object !== typeof obj)
        return obj;

    if (Array.isArray(obj))
        return deepCopy(obj);

    var temp = {};
    Object.keys(obj).forEach(function _cloneGridData(field) {
        temp[field] = deepClone(obj[field]);
    });
    return temp;
}

/**
 * @description:
 * @param: {Array} arr
 * @returns: {Array}
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
 * @description:
 * @param: {object} obj
 * @returns: {object}
 */
function shallowClone(obj) {
    var clone = {};
    for (var p in obj) {
        clone[p] = obj[p];
    }
    return clone;
}

/**
 * @description:
 * @type: {function}
 * @param: {number} len
 * @param: {function} fn
 * @returns: {function}
 */
var alterFunctionLength = curry(function _alterFunctionLength(len, fn) {
    return Object.defineProperty(
        fn,
        'length', {
            value: len
        }
    );
});

export { javaScriptTypes, sortDirection, observableStatus, sortComparer, defaultEqualityComparer, defaultGreaterThanComparer, defaultPredicate, cacher,
    deepClone, deepCopy, shallowClone, generatorProto, alterFunctionLength };
