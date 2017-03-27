import { alterFunctionLength } from './helpers';

function noop() {}

function identity(item) { return item; }

var ifElse = curry(function ifElse(predicate, ifFunc, elseFunc, data) {
    if (predicate(data))
        return ifFunc(data);
    return elseFunc(data);
});

var when = curry(function _when(predicate, transform, data) {
    return ifElse(predicate, transform, identity, data);
});

function wrap(data) {
    return [data];
}

function isArray(data) {
    return Array.isArray(data);
}

function isObject(item) {
    return typeof item === 'object' && null !== item;
}

function isFunction(fn) {
    return typeof fn === 'function';
}

function not(fn) {
    return function _not(...rest) {
        return !fn(...rest);
    };
}

//TODO: need to play around with this a bit more. As it stands, the currying won't
//TODO: help much as long as the spread operator is being used
function not2(fn) {
    return curry(alterFunctionLength(function _not(...rest) {
        return !fn(...rest);
    }, fn.length));
}

var or = curry(function _or(a, b, item) {
    return a(item) || b(item);
});

var and = curry(function _and(a, b, item) {
    return a(item) && b(item);
});

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

export { noop, identity, ifElse, when, wrap, isArray, isObject, isFunction, not, or, and, curry };