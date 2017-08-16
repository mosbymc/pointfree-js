import { curry, curryN } from './combinators';

/**
 * @sig ((*... -> a)) -> (*... -> a) -> [*] -> a
 * @description Used as a helper function, invoker takes any function that
 * requires a single function argument and one or more additional parameters
 * and partially applies that function. @see apply
 * @param {function} func - A non-curried, non-partially applied function
 * that expects at least two arguments
 * @return {function} - Returns a function that has turned the 'func' param
 * into a partially applied function.
 */
var invoker = func => fn => (...args) => func(fn, ...args);

/**
 * @sig (*... -> a) -> (*... -> a) -> [*] -> a
 * @description A curried function that takes two functions and
 * n arguments to apply both functions to. The first function is
 * applied to the arguments, followed by the second. The return value
 * is equal to the return value of the first function's invocation.
 * @type {function}
 * @param {function} fn - A function that should be applied to the arguments. The return
 * value is equal to this function's return value.
 * @param {function} decoration - A function that should be applied to the arguments after
 * the first function; the return value is ignored.
 * @param {*} args - The arguments that each function should be invoked with.
 * @return {*} - The return value of the first function.
 */
var after = curryN(this, 3, function _after(fn, decoration, ...args) {
    var ret = fn(...args);
    decoration(...args);
    return ret;
});

/**
 * @sig (*... -> a) -> [*] -> a
 * @description A partially applied function that takes a function and any arguments
 * and returns the result of apply the function to the arguments.
 * @param {function} fn - The function that should be applied to the arguments.
 * @return {function} - The result of applying the function to the arguments.
 */
var apply = invoker((fn, ...args) => fn(...args));

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
 * @sig (*... -> a) -> (*...) -> a
 * @description Takes a non-curried function of any arity and turns it
 * into a binary, curried function.
 * @type {function}
 * @param {function} fn - The function that should be made binary.
 * @param {*} args - The arguments that should be applied to the new
 * binary function.
 * @return {function} - A function waiting for both arguments to be applied.
 */
var binary = (fn, ...args) => curryN(this, 2, fn, ...args);

/**
 * @sig {*} -> (* -> *) -> (* -> *)
 * @description A curried function that takes an object context and
 * a function and returns the function bound to the context of the
 * object.
 * @type {function}
 * @param {object} context - The context the function should be
 * invoked with.
 * @param {function} fn - The function that should be bound to the
 * context of the object.
 * @return {function} - A function, bound to the provided context,
 * waiting to be invoked.
 */
var bindFunction = curry(function _bindFunction(context, fn) {
    return fn.bind(context);
});

/**
 * @sig {*} -> (* -> *) -> (* -> *)
 * @description A curried function that takes an object context and
 * a function and returns the function bound to the context of the
 * object.
 * @type {function}
 * @param {function} fn - The function that should be bound to the
 * context of the object.
 * @param {object} context - The context the function should be
 * invoked with.
 * @return {function} - A function, bound to the provided context,
 * waiting to be invoked.
 */
var bindWith = curry(function _bindWith(fn, context) {
    return bindFunction(context, fn);
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
 * @param {function} fn - a
 * @return {function} - b
 */
var lateApply = invoker((fn, ...args) => () => fn(...args));

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @return {function} - b
 */
var leftApply = apply;

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
var maybe = invoker((fn, ...args) => 1 <= args.length && args.every(function _testNull(val) { return null != val; }) ? fn.call(this, ...args) : null);

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
var not = invoker((fn, ...args) => !fn(...args));

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
var rightApply = invoker((fn, ...args) => fn(...args.reverse()));

//TODO: need to add a try/catch function here, and see about renaming the existing 'safe' function
//TODO: as that seems more along the lines of a try/catch function, rather than a 'maybe' function.
/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
var safe = invoker((fn, ...args) => !args.length || args.includes(null) || args.includes(undefined) ? undefined : fn(...args));

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
var voidFn = invoker((fn, ...args) => void fn(...args));

/*
 var c = leftApply(leftApply, rightApply);

 var getWith = c(getWith);
 */

export { after, apply, before, binary, bindFunction, bindWith, guard, hyloWith, lateApply, leftApply, maybe, not, once, repeat, rightApply,
        safe, tap, ternary, tryCatch, unary, unfold, unfoldWith, voidFn };