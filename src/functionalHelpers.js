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
    }
}

function or(a, b, item) {
    return a(item) || b(item);
}

function and(a, b, item) {
    return a(item) && b(item);
}

function curry(fn) {
    if (!fn.length) return fn;
    return curryN(fn.length, [], fn);
}

function curryN(length, received, fn) {
    return function _c(...rest) {
        var combined = received.concat(rest);
        if (length > combined.length)
            return curryN(length, combined, fn);
        return fn.call(this, ...combined);
    }
}

export { identity, ifElse, when, wrap, isArray, isObject, isFunction, not, or, and, curry };