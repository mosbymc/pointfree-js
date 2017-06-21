import { curry, curryN } from './combinators';

/**
 * @description:
 * @type: {function}
 * @param: {function} fn
 * @param: {function} decoration
 * @param: {*} args
 * @return: {*}
 */
var after = curry(function _after(fn, decoration, ...args) {
    var ret = fn(...args);
    decoration(...args);
    return ret;
});

/**
 * @description:
 * @param: {function} fn
 * @return: {function}
 */
var apply = fn => (...args) => () => fn(...args);

/**
 * @description:
 * @type: {function}
 * @param: {function} fn
 * @param: {function} decoration
 * @param: {*} args
 * @return: {*};
 */
var before = curry(function _before(fn, decoration, ...args) {
    decoration(...args);
    return fn(...args);
});

/**
 * @description:
 * @param: {function} fn
 * @return: {function}
 */
var binary = fn => curryN(this, 2, fn);

/**
 * @description:
 * @type: {function}
 * @param: {object} context
 * @param: {function} fn
 * @return: {function}
 */
var bindFunction = curry(function _bindFunction(context, fn) {
    return fn.bind(context);
});

/**
 * @description:
 * @param: {function} fns
 * @return: {function}
 */
function guardAfter(...fns) {
    return function waitForArgs(...args) {
        if (fns.reverse().slice(1).every(function _functionRunner(fn) {
                return fn(...args);
            })) return fns[fns.length - 1](...args);
    };
}

/**
 * @description:
 * @param: {function} fns
 * @return: {function}
 */
function guardBefore(...fns) {
    return function waitForArgs(...args) {
        if (fns.slice(1).every(function _functionRunner(fn) {
                return fn(...args);
            })) return fns[0](...args);
    };
}

/**
 * @description:
 * @type: {function}
 * @param: {function} fn
 * @return: {function}
 */
var leftApply = fn => (...args) => fn(...args);

/**
 * @description:
 * @param: {function} fn
 * @return: {*}
 */
var maybe = (fn) =>
    function _maybe(...args) {
        return null != args ? fn.call(this, ...args) : null;
    };

/**
 * not :: () -> !()
 *
 * @description: - Returns a function, that, when invoked, will return the
 * result of the inversion of the invocation of the function argument. The
 * returned function is curried to the same arity as the function argument,
 * so it can be partially applied even after being 'wrapped' inside the
 * not function.
 * @param: {function} fn
 * @return: {*}
 */
var not = fn => (...args) => !fn(...args);

var not2point0 = curry(function _n(fn, ...args) {
    if (args.length < fn.length) {
        return curryN(this, (fn.length - args.length), function _not(...a) {
            return !fn(...a);
        }, args);
    }
    return !fn(...args);
});

/**
 * @description:
 * @param: {function} fn
 * @returns: {function}
 */
function once(fn) {
    var invoked = false;
    return function _once(...args) {
        return invoked ? undefined : fn(...args);
    };
}

/**
 * @description:
 * @type: {function}
 * @param: {number} num
 * @param: {function} fn
 * @return: {*}
 */
var repeat = curry(function _repeat(num, fn) {
    return 0 < num ? (_repeat(num - 1, fn), fn(num)) : undefined;
});

/**
 * @description:
 * @type: {function}
 * @param: {function} fn
 * @return: {function}
 */
var rightApply = fn => (...args) => fn(...args.reverse());

//TODO: need to add a try/catch function here, and see about renaming the existing 'safe' function
//TODO: as that seems more along the lines of a try/catch function, rather than a 'maybe' function.
/**
 * @description:
 * @param: {function} fn
 * @return: {function}
 */
function safe(fn) {
    return function _safe(...args) {
        if (!args.length || args.includes(null) || args.includes(undefined)) return;
        return fn(...args);
    };
}

/**
 * @description:
 * @type: {function}
 * @param: {*} arg
 * @param: {function} fn
 * @return: {arg}
 */
var tap = curry(function _tap(fn, arg) {
    fn(arg);
    return arg;
});

/**
 * @description:
 * @param: {function} fn
 * @return: {function}
 */
var ternary = fn => curryN(this, 3, fn);

/**
 * @description:
 * @type: {function}
 * @param: {function} catcher
 * @param: {function} tryer
 * @return: {function}
 */
var tryCatch = curry(function _tryCatch(catcher, tryer) {
    return curryN(this, tryer.length, function _tryCatch_(...args) {
        try {
            return tryer(...args);
        }
        catch (e) {
            return catcher(e, ...args);
        }
    })
});

/**
 * @description:
 * @param: {function} fn
 * @return: {function}
 */
var unary = fn => curryN(this, 1, fn);

/**
 * @description:
 * @param: {function} fn
 * @return:
 */
var voidFn = fn => (...args) => void fn(...args);


/*
 var c = leftApply(leftApply, rightApply);

 var getWith = c(getWith);
 */


export { after, apply, before, binary, bindFunction, guardAfter, guardBefore, leftApply, maybe, not, once, repeat, rightApply,
        safe, tap, ternary, tryCatch, unary, voidFn };