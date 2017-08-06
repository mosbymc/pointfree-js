/**
 * @description - Prototype of a generator; used to detect if a function
 * argument is a generator or a regular function.
 * @typedef {Object}
 */
var generatorProto = Object.getPrototypeOf(function *_generator(){});

/**
 * @description d
 * @typedef {Object}
 * @property {string} Function
 * @property {string} Object
 * @property {string} Boolean
 * @property {string} Number
 * @property {string} Symbol
 * @property {string} String
 * @property {string} Undefined
 */
var javaScriptTypes = {
    Function: 'function',
    Object: 'object',
    Boolean: 'boolean',
    Number: 'number',
    Symbol: 'symbol',
    String: 'string',
    Undefined: 'undefined'
};

var typeName = {
    'boolean': typeof true,
    'function': typeof Function,
    'number': typeof 0,
    'object': typeof{ a: 1 },
    'string': typeof '',
    'symbol': typeof Symbol.iterator,
    'undefined': typeof void 0
};

/**
 * @description d
 */
var collectionTypes = {
    'Generator': [generatorProto],
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
    'ArrayBuffer': [ArrayBuffer.prototype],
    'Map': [Map.prototype],
    'WeakMap': [WeakMap.prototype],
    'Set': [Set.prototype],
    'WeakSet': [WeakSet.prototype]
};

/**
 * @description d
 */
var observableStatus = {
    inactive: 0,
    active: 1,
    paused: 2,
    complete: 3
};

/**
 * @description d
 */
var sortDirection = {
    ascending: 1,
    descending: 2
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @param {*} y - b
 * @param {string} dir - c
 * @return {number} - d
 */
function sortComparer(x, y, dir) {
    var t = x > y ? 1 : x === y ? 0 : -1;
    return sortDirection.descending === dir ? t : -t;
}

/**
 * @sig
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
 * @sig
 * @description d
 * @param {Generator|Array|Map|Set} collection - a
 * @param {function} comparer - b
 * @return {{contains, getValue}} - c
 */
function genericCacher(collection, comparer) {
    function createCacheChequer() {
        switch (createBitMask(...buildTypeBits(collection))) {
            case 1: collection = Array.from(collection);
            case 2:
                //The collection's type is some kind of an array (@see collectionTypes). We
                //can use the .some and .find to determine if the cache already holds the
                //value we're looking for or return the value respectively.
                return {
                    contains: function _contains(item) {
                        return collection.some(function _checkEquality(it) {
                            return comparer(it, item);
                        });
                    },
                    getValue: function _getValue(value) {
                        return collection.find(function _findKey(key) {
                            return comparer(key, value);
                        });
                    }
                };
                break;
            case 4:
                //TODO: find out if an ArrayBuffer can be interacted with directly at all, and
                //TODO: remove this case if it cannot, or implement this case if it can.
                break;
            case 8: //Map
            case 16: //WeakMap
            case 32: //Set
            case 64: //WeakSet
                //Here, the type of the collection is a Map, WeakMap, Set, or WeakSet; we can use
                //the native functionality to find the result of the cache contains the item we
                //are looking for.
                return {
                    contains: function _contains(item) {
                        return collection.values().some(function _checkEquality(it) {
                            return comparer(it, item);
                        });
                    },
                    getValue: function _getValue(value) {
                        return collection.values().find(function _findKey(key) {
                            return comparer(key, value);
                        });
                    }
                };
                break;
            case 128:
                //The collection's type is a generator. We need to turn it into an array
                //and recursively call the 'createCacheChequer' function with the array
                //that was created from the generator.
                collection = Array.from(collection);
                //return createCacheChequer(Array.from(collection));
                break;
            default:
        }
    }

    function buildTypeBits(arrayType) {
        return Object.keys(collectionTypes).map(function _buildBits(key) {
            return collectionTypes[key].some(function _findDelegate(delegate) {
                return delegate.isPrototypeOf(arrayType);
            });
        });
    }

    function createBitMask(...args) {
        return args.reduce(function _reduce(curr, next, idx) {
            return curr |= next << idx;
        }, args[0]);
    }

    return createCacheChequer();
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @param {function} keyMaker - b
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
 * @sig
 * @description d
 * @param {*} obj - a
 * @return {*} - b
 */
function deepClone(obj) {
    var uniqueObjects = new Set();

    return objectCloner(obj);

    /**
     * @sig
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
 * @sig
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
 * @sig
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
 * @sig
 * @description d
 * @param {object} obj - a
 * @return {object} - b
 */
function shallowClone(obj) {
    var clone = {};
    for (var p in obj) {
        clone[p] = obj[p];
    }
    return clone;
}

var emptyObject = {};

/**
 * @sig
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
            deepClone, deepCopy, shallowClone, generatorProto, emptyObject, typeName };
