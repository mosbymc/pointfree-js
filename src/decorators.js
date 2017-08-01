import { curry, curryN } from './combinators';

/**
 * @description:
 * @type: {function}
 * @param: {function} fn
 * @param: {function} decoration
 * @param: {*} args
 * @return: {*}
 */
var after = curryN(this, 3, function _after(fn, decoration, ...args) {
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
var before = curryN(this, 3, function _before(fn, decoration, ...args) {
    decoration(...args);
    return fn(...args);
});

/**
 * @description:
 * @param: {function} fn
 * @return: {function}
 */
var binary = (fn, ...args) => curryN(this, 2, fn, ...args);

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
 * @description:
 * @param: {function} fns
 * @return: {function}
 */
function guard(...fns) {
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
var maybe = (fn) => (...args) => 1 <= args.length && args.every(function _testNull(val) { return null != val; }) ? fn.call(this, ...args) : null;

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

/**
 * @description:
 * @type: {function}
 */
var not2point0 = curryN(this, 2, function _not2point0(fn, ...args) {
    if (args.length < fn.length) {
        return curryN(this, fn.length, function _not(...a) {
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
        if (!invoked) {
            invoked = true;
            return fn(...args);
        }
        return undefined;
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
var ternary = (fn, ...args) => curryN(this, 3, fn, ...args);

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
var unary = (fn, arg) => undefined === arg ? curryN(this, 1, fn) : fn(arg);

/**
 * @type:
 * @description:
 * @param: {*} seed
 * @return: {function}
 */
function unfold(seed) {
    return function *_unfold(fn) {

    };
}

/**
 * @type:
 * @description:
 * @param: {function} fn
 * @return: {function}
 */
function unfoldWith(fn) {
    return function *_unfold (value) {
        let { next, element, done } = fn(value);

        if (!done) {
            yield element;
            yield * _unfold(next);
        }
    }
}

/**
 * @type:
 * @description:
 * @param: cata
 * @param: ana
 * @param: seed
 * @return: {*}
 */
var hyloWith = curry(function _hylo(cata, ana, seed) {
    let { next: n, element: acc, done } = ana(seed);
    let { next, element } = ana(n); // not a monoid

    while (!done) {
        acc = cata(acc, element);
        ({ next, element, done } = ana(next));
    }
    return acc
});

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


export { after, apply, before, binary, bindFunction, guard, hyloWith, leftApply, maybe, not, once, repeat, rightApply,
        safe, tap, ternary, tryCatch, unary, unfold, unfoldWith, voidFn, not2point0 };