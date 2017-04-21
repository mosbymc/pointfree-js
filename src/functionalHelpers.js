import { alterFunctionLength, javaScriptTypes } from './helpers';

/**
 * No-op function; used as default function in some cases when argument is optional
 * and consumer does not provide.
 */
function noop() {}

/**
 * identity :: a -> a
 * Identity function; takes any item and returns same item when invoked
 *
 * @param item - Any value of any type
 * @returns {*} - returns item
 */
function identity(item) { return item; }

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
 * @refer - constant
 * @type {constant}
 * @param {*} item
 * @returns {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
var kestrel = constant;

var tap = curry(function _tap(a, f) {
    return f(a), a;
});

function sequence(fns) {
    return function _sequence(...args) {
        fns.forEach(function fSequence(fn) {
            fn(...args);
        });
    };
}

var fork = curry(function _fork(join, fn1, fn2) {
    return function _fork_(...args) {
        return join(fn1(...args), fn2(...args));
    };
});

/**
 *
 * @type {*}
 */
var get = curry(function _get(prop, obj) {
    return obj[prop];
});

/**
 *
 * @type {*}
 */
var set = curry(function _set(val, prop, obj) {
    obj[prop] = val;
    return val;
});

/**
 * compose :: [a] -> (b -> c)
 * @type {*}
 */
var compose = curry(function _compose(funcs, item) {
    return pipe(funcs.reverse(), item);
});

/**
 * pipe :: [a] -> (b -> c)
 * @description -  Takes a list of functions as arguments and returns
 * a function waiting to be invoked with a single item. Once the returned
 * function is invoked, it will reduce the list of functions over the item,
 * starting with the first function in the list and working through
 * sequentially. Performs a similar functionality to compose, but applies
 * the functions in reverse order to that of compose.
 * @refer {compose}
 * @param {function} fn - The function to run initially; may be any arity.
 * @param {Array} fns - The remaining functions in the pipeline. Each receives
 * its input from the output of the previous function. Therefore each of these
 * functions must be unary.
 * @returns {function} - Returns a function waiting for the item over which
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
 * Takes a predicate function that is applied to the data; If a truthy value
 * is returned from the application, the provided ifFunc argument will be
 * invoked, passing the data as an argument, otherwise the elseFunc is
 * invoked with the data as an argument.
 *
 * @predicate {function}
 * @ifFunc {function}
 * @elseFunc {function}
 * @data {*}
 * @returns {*} - returns the result of invoking the ifFunc or elseFunc
 * on the data
 */
var ifElse = curry(function ifElse(predicate, ifFunc, elseFunc, data) {
    if (predicate(data))
        return ifFunc(data);
    return elseFunc(data);
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
 * @type {*}
 */
var whenNot = curry(function _whenNot(predicate, transform, data) {
    if (!predicate(data)) return transform(data);
    return data;
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
    return javaScriptTypes.object === typeof item && null !==  item;
}

/**
 * isFunction :: a -> Boolean
 *
 * @param fn
 * @returns {boolean}
 */
function isFunction(fn) {
    return javaScriptTypes.function === typeof fn;
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
    return curry(alterFunctionLength(function _not(...rest) {
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
 * curry :: (* -> a) -> (* -> a)
 *
 * @param fn
 * @returns {*}
 */
function curry(fn) {
    if (!fn.length || 1 === fn.length) return fn;
    return _curry(fn.length, [], fn);
}

function _curry(length, received, fn) {
    return function _c(...rest) {
        var combined = received.concat(rest);
        if (length > combined.length)
            return _curry(length, combined, fn);
        return fn.call(this, ...combined);
    };
}

export { noop, identity, constant, kestrel, get, set, compose, pipe, ifElse, when, whenNot, wrap, isArray, isObject, isFunction, not, or, and, curry };