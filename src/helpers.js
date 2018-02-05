/** @module helpers */

/** @modules helpers */

/**
 * @description - Prototype of a generator; used to detect if a function
 * argument is a generator or a regular function.
 * @typedef {Object}
 */
var generatorProto = Object.getPrototypeOf(function *_generator(){});

/**
 * @description d
 * @enum {string}
 */
var javaScriptTypes = {
    /** function */
    Function: 'function',
    /** object */
    Object: 'object',
    /** boolean */
    Boolean: 'boolean',
    /** number */
    Number: 'number',
    /** symbol */
    Symbol: 'symbol',
    /** string */
    String: 'string',
    /** undefined */
    Undefined: 'undefined'
};

/**
 * @description Contains the list of all JavaScript types
 * @enum {string}
 */
var typeNames = {
    /** boolean */
    'boolean': typeof true,
    /** function */
    'function': typeof Function,
    /** number */
    'number': typeof 0,
    /** object */
    'object': typeof{ a: 1 },
    /** string */
    'string': typeof'',
    /** symbol */
    'symbol': typeof Symbol.iterator,
    /** undefined */
    'undefined': typeof void 0
};

/**
 * @description Contains a list of built-in iterables
 * @enum {Array}
 */
var collectionTypes = {
    /** Generator */
    'Generator': [generatorProto],
    /** Array Family */
    'Array': [
        Array.prototype,
        Int16Array.prototype,
        Int8Array.prototype,
        Int32Array.prototype,
        Float32Array.prototype,
        Float64Array.prototype,
        Uint16Array.prototype,
        Uint32Array.prototype,
        Uint8Array.prototype,
        Uint8ClampedArray.prototype
    ],
    /** ArrayBuffer */
    'ArrayBuffer': [ArrayBuffer.prototype],
    /** Map */
    'Map': [Map.prototype],
    /** WeakMap */
    'WeakMap': [WeakMap.prototype],
    /** Set */
    'Set': [Set.prototype],
    /** WeakSet */
    'WeakSet': [WeakSet.prototype]
};

/**
 * @description Contains the list of possible observable statuses
 * @enum {number}
 */
var observableStatus = {
    /** inactive */
    inactive: 0,
    /** active */
    active: 1,
    /** paused */
    paused: 2,
    /** complete */
    complete: 3
};

/**
 * @description Contains the list of possible sort directions
 * @enum {number}
 */
var sortDirection = {
    /** ascending */
    ascending: 1,
    /** descending */
    descending: 2
};

/**
 * @signature
 * @description d
 * @param {*} x - a
 * @param {*} y - b
 * @param {number} dir - c
 * @return {number} - d
 */
function sortComparer(x, y, dir) {
    var t = x > y ? 1 : x === y ? 0 : -1;
    return sortDirection.descending === dir ? t : -t;
}

/**
 * @signature
 * @description d
 * @param {function} comparer - a
 * @return {function} - b
 */
/*function cacheChecker(item) {
 console.log(((undefined !== item && items.some(function _checkEquality(it) {
 return comparer(it, item);
 }) && true) || !(items[items.length] = item)));

 return ((undefined !== item && items.some(function _checkEquality(it) {
 return comparer(it, item);
 }) && true) || !(items[items.length] = item));
 }*/


function cacher(comparer) {
    var items = [];
    function cacheChecker(item) {
        if (undefined === item || items.some(function _checkEquality(it) {
                return comparer(it, item);
            })) {
            return true;
        }
        items[items.length] = item;
        return false;
    }

    cacheChecker.contains = function _contains(item) {
        return items.some(function _checkEquality(it) {
            return comparer(it, item);
        });
    };

    return cacheChecker;
}

/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @param {function} [keyMaker] - b
 * @return {function} - c
 */
function memoizer(fn, keyMaker) {
    var lookup = new Map();
    return function _memoized(...args) {
        var key = javaScriptTypes.Function === typeof keyMaker ? keyMaker(...args) : args;
        return lookup[key] || (lookup[key] = fn(...args));
    };
}

/**
 * @signature
 * @description d
 * @param {*} obj - a
 * @return {*} - b
 */
function deepClone(obj) {
    var uniqueObjects = new Set();

    return objectCloner(obj);

    /**
     * @signature
     * @description d
     * @param {*} obj - a
     * @return {*} - b
     */
    function objectCloner(obj) {
        //if the 'obj' parameter is a primitive type, just return it; there's no way/need to copy
        if (null == obj || 'object' !== typeof obj && 'function' !== typeof obj)
            return obj;

        //if we've already seen this 'object' before, we don't want to get caught
        //in an infinite loop; just return the 'object'. Otherwise, add it to the
        //set of viewed 'objects'
        if (uniqueObjects.has(obj)) return obj;
        uniqueObjects.add(obj);

        //if the obj parameter is a function, invoke the functionClone function and return its return...
        if ('function' === typeof obj) return functionClone(obj);

        var ret = Object.create(Object.getPrototypeOf(obj));
        //...else, reduce over the obj parameter's own keys after creating a new object that has its
        //prototype delegating to the same object that the obj's prototype delegating to. This functionality
        //will work for an array as well.
        Object.getOwnPropertyNames(obj).reduce(_reducePropNames.bind(ret), '');

        return ret;

        //this is the function used in the reduce and is bound to the context of the return (cloned) object
        function _reducePropNames(prev, curr) {
            return this[curr] = objectCloner(obj[curr]), this;
        }
    }
}


/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @param {Object} cxt - b
 * @return {function} - c
 */
function functionClone(fn, cxt = null) {
    var clone = (function _clone(...args) {
        return fn(...args);
    }).bind(cxt);

    Object.defineProperties(clone, {
        'length': {
            value: fn.length,
            enumerable: false
        },
        'prototype': {
            value: Object.create(fn.prototype)
        },
        'name': {
            writable: true
        }
    });

    Object.getOwnPropertyNames(fn).reduce(function _reducePropName(prev, curr) {
        if ('length' !== curr && 'prototype' !== curr)
            return clone[curr] = deepClone(fn[curr]), clone;
        return clone;
    }, '');

    return clone;
}

/**
 * @signature
 * @description d
 * @param {Array} arr - a
 * @return {Array} - b
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
 * @signature
 * @description d
 * @param {object} obj - a
 * @return {object} - b
 */
function shallowClone(obj) {
    var clone = {};
    for (var item in obj) {
        clone[item] = obj[item];
    }
    return clone;
}

var emptyObject = {};

var nil = {};

/**
 * @signature
 * @description d
 * @param {number} len - a
 * @param {function} fn - b
 * @return {function} - c
 */
/*var alterFunctionLength = curry(function _alterFunctionLength(len, fn) {
    return Object.defineProperty(
        fn,
        'length', {
            value: len
        }
    );
});
*/

export { javaScriptTypes, sortDirection, observableStatus, sortComparer, cacher, memoizer,
            deepClone, deepCopy, shallowClone, generatorProto, emptyObject, typeNames, nil };
