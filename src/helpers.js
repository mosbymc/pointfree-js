/**
 * @description: - Prototype of a generator; used to detect if a function
 * argument is a generator or a regular function.
 * @type: {Object}
 */
var generatorProto = Object.getPrototypeOf(function *_generator(){});

/**
 * @description
 * @type {{Function: string, object: string, boolean: string, number: string, symbol: string, string: string, undefined: string}}
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
    'object': typeof { a: 1 },
    'string': typeof '',
    'symbol': typeof Symbol.iterator,
    'undefined': typeof void 0
};

/**
 * @description:
 * @type: {{Array: [*], ArrayBuffer: [*], Map: [*], WeakMap: [*], Set: [*], WeakSet: [*]}}
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
    return sortDirection.descending === dir ? t : -t;
}

/**
 * @description:
 * @param: {function} comparer
 * @return: {function}
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
 * @description:
 * @param: {function} fn
 * @param: {function} keyMaker
 * @return {function}
 */
function memoizer(fn, keyMaker) {
    var lookup = new Map();
    return function _memoized(...args) {
        var key = javaScriptTypes.Function === typeof keyMaker ? keyMaker(...args) : args;
        return lookup[key] || (lookup[key] = fn(...args));
    };
}

/**
 * @type:
 * @description:
 * @param: {Object|Array|Function} obj
 * @return: {Object|Array|Function}
 */
function deepCloneUltra(obj) {
    if (null == obj || 'object' !== typeof obj)
        return obj;

    if (Array.isArray(obj))
        return deepCopy(obj);

    var ret = !(Object.getPrototypeOf(obj) === Object.prototype) ? Object.create(Object.getPrototypeOf(obj)) : {};
    var propNames = Object.getOwnPropertyNames(obj);

    var g = propNames.slice(1).reduce(function _reducePropNames(prop) {
        return ret[prop] = deepCloneUltra(obj[prop]), ret;
    }, propNames[0]);

    return ret;
}

/**
 * @description:
 * @param: {*} obj
 * @returns: {*}
 */
function deepClone(obj) {
    if (null == obj || javaScriptTypes.Object !== typeof obj)
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

var emptyObject = {};

function emptyMonoidFactory(m) {
    return function empty() {
        return m(Object.create(emptyObject));
    }
}

/**
 * @description:
 * @type: {function}
 * @param: {number} len
 * @param: {function} fn
 * @returns: {function}
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
            deepClone, deepCopy, shallowClone, generatorProto, emptyObject, emptyMonoidFactory, typeName };
