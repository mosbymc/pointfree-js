import { curry, curryN } from './combinators';

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {function} decoration - b
 * @param {*} args - c
 * @return {*} - d
 */
var after = curryN(this, 3, function _after(fn, decoration, ...args) {
    var ret = fn(...args);
    decoration(...args);
    return ret;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
var apply = fn => (...args) => () => fn(...args);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {function} decoration - b
 * @param {*} args - c
 * @return {*} - d
 */
var before = curryN(this, 3, function _before(fn, decoration, ...args) {
    decoration(...args);
    return fn(...args);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {*} args - b
 * @return {function} - c
 */
var binary = (fn, ...args) => curryN(this, 2, fn, ...args);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {object} context - a
 * @param {function} fn - b
 * @return {function} - c
 */
var bindFunction = curry(function _bindFunction(context, fn) {
    return fn.bind(context);
});

/*
function guardAfter(...fns) {
    return function waitForArgs(...args) {
        if (fns.reverse().slice(1).every(function _functionRunner(fn) {
                return fn(...args);
            })) return fns[fns.length - 1](...args);
    };
}
*/

/**
 * @sig
 * @description d
 * @param {function} fns - a
 * @return {function} - b
 */
function guard(...fns) {
    return function waitForArgs(...args) {
        if (fns.slice(1).every(function _functionRunner(fn) {
                return fn(...args);
            })) return fns[0](...args);
    };
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @return {function} - b
 */
var leftApply = fn => (...args) => fn(...args);

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
var maybe = (fn) => (...args) => 1 <= args.length && args.every(function _testNull(val) { return null != val; }) ? fn.call(this, ...args) : null;

/**
 * @sig not :: () -> !()
 * @description - Returns a function, that, when invoked, will return the
 * result of the inversion of the invocation of the function argument. The
 * returned function is curried to the same arity as the function argument,
 * so it can be partially applied even after being 'wrapped' inside the
 * not function.
 * @param {function} fn - a
 * @return {*} - b
 */
var not = fn => (...args) => !fn(...args);

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @returns {function} - b
 */
function once(fn) {
    var invoked = false;
    return function _once(...args) {
        if (!invoked) {
            invoked = true;
            return fn(...args);
        }
        return undefined;
    };
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} num - a
 * @param {function} fn - b
 * @return {*} - c
 */
var repeat = curry(function _repeat(num, fn) {
    return 0 < num ? (_repeat(num - 1, fn), fn(num)) : undefined;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
var rightApply = fn => (...args) => fn(...args.reverse());

//TODO: need to add a try/catch function here, and see about renaming the existing 'safe' function
//TODO: as that seems more along the lines of a try/catch function, rather than a 'maybe' function.
/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function safe(fn) {
    return function _safe(...args) {
        if (!args.length || args.includes(null) || args.includes(undefined)) return;
        return fn(...args);
    };
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} arg - a
 * @param {function} fn - b
 * @return {arg} - c
 */
var tap = curry(function _tap(fn, arg) {
    fn(arg);
    return arg;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @param {*} args - b
 * @return {function} - c
 */
var ternary = (fn, ...args) => curryN(this, 3, fn, ...args);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} catcher - a
 * @param {function} tryer - b
 * @return {function} - c
 */
var tryCatch = curry(function _tryCatch(catcher, tryer) {
    return curryN(this, tryer.length, function _tryCatch_(...args) {
        try {
            return tryer(...args);
        }
        catch (e) {
            return catcher(e, ...args);
        }
    });
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @param {*} arg - b
 * @return {function} - c
 */
var unary = (fn, arg) => undefined === arg ? curryN(this, 1, fn) : fn(arg);

/**
 * @sig
 * @description d
 * @param {*} seed - a
 * @return {function} - b
 */
function unfold(seed) {
    return function *_unfold(fn) {

    };
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function unfoldWith(fn) {
    return function *_unfold (value) {
        let { next, element, done } = fn(value);

        if (!done) {
            yield element;
            yield * _unfold(next);
        }
    };
}

/**
 * @sig
 * @description d
 * @param cata - a
 * @param ana - b
 * @param seed - c
 * @return {*} - d
 */
var hyloWith = curry(function _hylo(cata, ana, seed) {
    let { next: n, element: acc, done } = ana(seed);
    let { next, element } = ana(n); // not a monoid

    while (!done) {
        acc = cata(acc, element);
        ({ next, element, done } = ana(next));
    }
    return acc;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
var voidFn = fn => (...args) => void fn(...args);


/*
 var c = leftApply(leftApply, rightApply);

 var getWith = c(getWith);
 */


export { after, apply, before, binary, bindFunction, guard, hyloWith, leftApply, maybe, not, once, repeat, rightApply,
        safe, tap, ternary, tryCatch, unary, unfold, unfoldWith, voidFn };