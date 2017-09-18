import { curry, curryN } from './combinators';

/** @module decorators */

/**
 * @signature ((*... -> a)) -> (*... -> a) -> [*] -> a
 * @description Used as a helper function, invoker takes any function that
 * requires a single function argument and one or more additional parameters
 * and partially applies that function.
 * @note This function is partially applied, not curried.
 * @see apply
 * @param {function} func - A non-curried, non-partially applied function
 * that expects at least two arguments
 * @return {function} - Returns a function that has turned the 'func' param
 * into a partially applied function.
 */
var invoker = func => fn => (...args) => func(fn, ...args);

/**
 * @signature (*... -> a) -> (*... -> a) -> [*] -> a
 * @description A curried function that takes two functions and
 * n arguments to apply both functions to. The first function is
 * applied to the arguments, followed by the second. The return value
 * is equal to the return value of the first function's invocation.
 * @function after
 * @param {function} fn - A function that should be applied to the arguments. The return
 * value is equal to this function's return value.
 * @param {function} decoration - A function that should be applied to the arguments after
 * the first function; the return value is ignored.
 * @param {*} args - The arguments that each function should be invoked with.
 * @return {*} - The return value of the first function.
 */
var after = curryN.call(this, 3, function _after(fn, decoration, ...args) {
    var ret = fn(...args);
    decoration(...args);
    return ret;
});

/**
 * @signature (*... -> a) -> [*] -> a
 * @description A partially applied function that takes a function and any arguments
 * and returns the result of apply the function to the arguments.
 * @note This function is partially applied, not curried.
 * @function apply
 * @param {function} fn - The function that should be applied to the arguments.
 * @return {function} - The result of applying the function to the arguments.
 */
var apply = invoker((fn, ...args) => fn(...args));

/**
 * @signature (* -> *) -> (* -> *) -> [*] -> *
 * @description d
 * @function before
 * @param {function} fn - a
 * @param {function} decoration - b
 * @param {*} args - c
 * @return {*} - d
 */
var before = curryN.call(this, 3, function _before(fn, decoration, ...args) {
    decoration(...args);
    return fn(...args);
});

/**
 * @signature (*... -> a) -> (*...) -> a
 * @description Takes a non-curried function of any arity and turns it
 * into a binary, curried function.
 * @function binary
 * @param {function} fn - The function that should be made binary.
 * @param {*} args - The arguments that should be applied to the new
 * binary function.
 * @return {function} - A function waiting for both arguments to be applied.
 */
var binary = (fn, ...args) => curryN.call(this, 2, fn, ...args);

/**
 * @signature {*} -> (* -> *) -> (* -> *)
 * @description A curried function that takes an object context and
 * a function and returns the function bound to the context of the
 * object.
 * @function bindFunction
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
 * @signature {*} -> (* -> *) -> (* -> *)
 * @description A curried function that takes an object context and
 * a function and returns the function bound to the context of the
 * object.
 * @function bindWith
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
 * @signature (* -> *), (* -> *), ... (* -> *) -> [*] -> *
 * @description Accepts one or more functions to be executed with
 * zero or more arguments, and will only invoke the first function argument
 * if all the other functions return a truthy value. If all the functions
 * return truthy, the return value is the result of apply the first function
 * argument to the parameters provided; otherwise the result is 'undefined'.
 * @note This function is partially applied, not curried.
 * @param {function} fns - One or more functions that should be applied to the arguments.
 * @return {function} - A function waiting for the arguments to be provided.
 */
function guard(...fns) {
    return function waitForArgs(...args) {
        if (1 === fns.length || fns.slice(1).every(function _functionRunner(fn) {
                return fn(...args);
            })) return fns[0](...args);
    };
}

/**
 * @signature (* -> *) -> [*] -> () -> *
 * @description Partially applied function that takes a function as
 * its first parameter, followed by zero or more arguments that the
 * function should be applied to. Finally, a function that takes no
 * arguments is returned. Once invoked, the provided function will
 * be applied to the provided arguments. This is similar to {@see apply}
 * except after the arguments are provided, there is an intermediary
 * function returned that needs to be invoked before anything happens.
 * @note This function is partially applied, not curried.
 * @function lateApply
 * @param {function} fn - A function to be executed
 * @return {function} - The return value of the 'fn' function argument.
 */
var lateApply = invoker((fn, ...args) => () => fn(...args));

/**
 * @signature (*... -> a) -> [*] -> a
 * @alias apply
 * @description A partially applied function that takes a function and any arguments
 * and returns the result of apply the function to the arguments.
 * @function leftApply
 * @param {function} fn - The function that should be applied to the arguments.
 * @return {function} - The result of applying the function to the arguments.
 */
var leftApply = apply;

/**
 * @signature (* -> *) -> [*] -> null|*
 * @description A partially applied function that takes a function
 * and zero or more arguments. If no arguments are provided, or at
 * least of the the arguments is null or undefined, a value of null
 * is returned. Otherwise, the return value is the result of apply
 * the function to the arguments.
 * @note This function is partially applied, not curried.
 * @function maybe
 * @param {function} fn - The function that may run
 * @return {null|*} - Returns either null, or the result of the function.
 */
var maybe = invoker((fn, ...args) => 1 <= args.length && args.every(function _testNull(val) { return null != val; }) ? fn.call(this, ...args) : null);

/**
 * @signature (* -> *) -> [*] -> boolean
 * @description - Takes a function and one or more parameters that the function
 * should be applied to. The result is the inverse coercion of the return
 * value of the function's application to the provided arguments to a
 * boolean.
 * @note This function is partially applied, not curried.
 * @function not
 * @param {function} fn - A function that should be applied to the arguments.
 * @return {*} - The inverted coercion of the return value of the function to
 * a boolean.
 */
var not = invoker((fn, ...args) => !fn(...args));

/**
 * @signature (* -> *) -> [*] ->
 * @description - Takes a function and zero or more arguments that the
 * function should be applied to. When invoked the first time, the function
 * argument will be applied to the argument parameters and the result of
 * that application is returned. Subsequent invocations will not execute
 * the function, but will returned the cached results of the first invocation.
 * @note This function is partially applied, not curried.
 * @param {function} fn - The function that should be run a single time.
 * @returns {function} - The value of the application of the function
 * to the arguments.
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
 * @signature number -> (number -> *) -> *
 * @description d
 * @function repeat
 * @param {number} num - a
 * @param {function} fn - b
 * @return {*} - c
 */
var repeat = curry(function _repeat(num, fn) {
    return 0 < num ? (_repeat(num - 1, fn), fn(num)) : undefined;
});

/**
 * @signature rightApply :: (*... -> a) -> [*] -> a
 * @description d
 * @note This function is partially applied, not curried.
 * @function rightApply
 * @param {function} fn - a
 * @return {function} - b
 */
var rightApply = invoker((fn, ...args) => fn(...args.reverse()));

//TODO: need to add a try/catch function here, and see about renaming the existing 'safe' function
//TODO: as that seems more along the lines of a try/catch function, rather than a 'maybe' function.
/**
 * @signature
 * @description d
 * @note This function is partially applied, not curried.
 * @function safe
 * @param {function} fn - a
 * @return {function} - b
 */
var safe = invoker((fn, ...args) => !args.length || args.includes(null) || args.includes(undefined) ? undefined : fn(...args));

/**
 * @signature tap :: () -> * -> *
 * @description d
 * @function tap
 * @param {*} arg - a
 * @param {function} fn - b
 * @return {arg} - c
 */
var tap = curry(function _tap(fn, arg) {
    fn(arg);
    return arg;
});

/**
 * @signature ternary :: (* -> *) -> [*] -> (*, *, * -> *)
 * @description Takes any function and turns it into a curried ternary function.
 * @param {function} fn - a
 * @param {*} [args] - Accepts zero or more optional arguments. If three or more arguments
 * and given, the function is invoked immediately with the first three values.
 * @return {function} - c
 */
var ternary = (fn, ...args) => curryN.call(this, 3, fn, ...args);

/**
 * @signature tryCatch :: () -> () -> *
 * @description d
 * @function tryCatch
 * @param {function} catcher - a
 * @param {function} tryer - b
 * @return {function} - c
 */
var tryCatch = curry(function _tryCatch(catcher, tryer) {
    return curryN.call(this, tryer.length, function _tryCatch_(...args) {
        try {
            return tryer(...args);
        }
        catch (e) {
            return catcher(e, ...args);
        }
    });
});

/**
 * @signature unary :: (*... -> *) -> * -> *
 * @description - Takes a single function of any arity and turns it into
 * a unary function. An optional argument may be provided. If it is, the
 * immediate result of the function's application to the argument is returned,
 * otherwise, a new function expecting a single argument is returned.
 * @param {function} fn - The function that should be turned into a unary function.
 * @param {*} [arg] - Optional argument that the unary function should be applied to.
 * @return {function|*} - Returns either a function waiting for a single argument
 * before invocation, or the result of applying the function to the provided
 * argument.
 */
var unary = (fn, arg) => undefined === arg ? curryN.call(this, 1, fn) : fn(arg);

/**
 * @signature
 * @description d
 * @param {*} seed - a
 * @return {function} - b
 */
function unfold(seed) {
    return function *_unfold(fn) {

    };
}

/**
 * @signature
 * @description d
 * @note This function is partially applied, not curried.
 * @param {function} fn - a
 * @return {function} - b
 */
function unfoldWith(fn) {
    return function *_unfold (val) {
        let { next, value, done } = fn(val);

        while (!done) {
            yield value;
            ({ next, value, done } = fn(next));
        }
    };
}

/**
 * @signature
 * @description d
 * @function hyloWith
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
 * @signature (* -> *) -> [*] -> undefined
 * @description This function works just like {@see apply} except that
 * 'undefined' is always returned, regardless of the result of the function.
 * @note This function is partially applied, not curried.
 * @function voidFn
 * @param {function} fn - The function that should be applied to the arguments
 * @return {function} -
 */
var voidFn = invoker((fn, ...args) => void fn(...args));

/*
 var c = leftApply(leftApply, rightApply);

 var getWith = c(getWith);
 */

export { after, apply, before, binary, bindFunction, bindWith, guard, hyloWith, lateApply, leftApply, maybe, not, once, repeat, rightApply,
        safe, tap, ternary, tryCatch, unary, unfold, unfoldWith, voidFn };