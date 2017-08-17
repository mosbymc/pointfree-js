/**
 * @sig
 * @description d
 * @kind function
 * @function all
 * @param {function} fns - One or more comma separated function arguments
 * @return {function} - a
 */
var all = applyAll((fns, args) => fns.every(fn => fn(...args)));

/**
 * @sig
 * @description d
 * @kind function
 * @function any
 * @param {Array} fns - One or more comma separated function arguments
 * @return {function} - a
 */
var any = applyAll((fns, args) => fns.some(fn => fn(...args)));

/**
 * @sig
 * @description d
 * @kind function
 * @function c
 * @param {function} x
 * @param {*} y - a
 * @param {*} z - b
 * @return {*} - c
 */
var c = curry(function _c(x, y, z) {
    return x(y)(z);
});

var rev = (...args) => args.reverse();

/**
 * @sig compose :: (b -> c) -> (a -> b) -> (a -> c)
 * @description d
 * @note: @see {@link pipe}
 * @param {function} fns - a
 * @return {*} - b
 */
function compose(...fns) {
    fns = fns.reverse();
    return pipe(...fns);
}

/**
 * @sig
 * @description d
 * @kind function
 * @function condition
 * @param {function} exp1 - a
 * @param {function} exp2 - b
 * @param {function} cond - c
 * @return {*} - d
 */
var condition = curry((exp1, exp2, cond) => cond(exp1, exp2));

var notFn = condition(constant(x => x), x => x);

var n = function _n(x, y, z) {
    return function _n_(...args) {
        console.log(x, y, z);
        x ? y(...args) : z(...args);
    };
};

/**
 * @sig constant :: a -> () -> a
 * @description d
 * @param {*} item - a
 * @return {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
function constant(item) {
    return function _constant() {
        return item;
    };
}

/**
 * @sig curry :: (* -> a) -> (* -> a)
 * @description d
 * @param {function} fn - a
 * @return {function|*} - b
 */
function curry(fn) {
    if (!fn.length || 1 >= fn.length) return fn;
    return curryN(this, fn.length, fn);
}

/**
 * @sig curryN :: (* -> a) -> (* -> a)
 * @description Curries a function to a specified arity
 * @param {Object} context - The context the curried function should be invoked with
 * @param {number} arity - The number of arguments to curry the function for
 * @param {function} fn - The function to be curried
 * @param {Array} received - An array of the arguments to be applied to the function
 * @return {function | *} - Returns either a function waiting for more arguments to
 * be applied before invocation, or will return the result of the function applied
 * to the supplied arguments if the specified number of arguments have been received.
 */
function curryN(context, arity, fn, received = []) {
    if (fn.orig && fn.orig !== fn) return curryN(context, arity, fn.orig, received);
    function _curryN(...rest) {
        var combined = received.concat(rest);
        if (arity > combined.length) return curryN(context, arity, fn, combined);
        return fn.call(context, ...combined.slice(0, arity));
    }

    _curryN.orig = fn;
    return _curryN;
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {Function|*} - b
 */
function curryRight(fn) {
    return curryN(this, fn.length, function _wrapper(...args) {
        return fn.call(this, ...args.reverse());
    });
}

/**
 * @sig
 * @description d
 * @kind function
 * @function first
 * @param {*} - a
 * @return {function} - b
 */
var first = constant;

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
function fixedPoint(fn) {
    function _fixedPoint(x) {
        return fn(function _y_(v) {
            x(x)(v);
        });
    }
    return _fixedPoint(_fixedPoint);
}

/**
 * @sig
 * @description d
 * @kind function
 * @function fork
 * @param {function} join - a
 * @param {function} fn1 - b
 * @param {function} fn2 - c
 * @return {function} - d
 */
var fork = curry((join, fn1, fn2) => {
    return (...args) => join(fn1(...args), fn2(...args));
});

/**
 * @sig Identity :: a -> a
 * @description Identity function; takes any item and returns same item when invoked
 * @param {*} item - Any value of any type
 * @return {*} - returns item
 */
var identity = item => item;

/**
 * @sig ifElse :: Function -> ( Function -> ( Function -> (a -> b) ) )
 * @description Takes a predicate function that is applied to the data; If a truthy value
 * is returned from the application, the provided ifFunc argument will be
 * invoked, passing the data as an argument, otherwise the elseFunc is
 * invoked with the data as an argument.
 * @kind function
 * @function ifElse
 * @param {function} predicate - a
 * @param {function} ifFunc - b
 * @param {function} elseFunc - c
 * @param {*} data - d
 * @return {*} - returns the result of invoking the ifFunc or elseFunc
 * on the data
 */
var ifElse = curry((predicate, ifFunc, elseFunc, data) => predicate(data) ? ifFunc(data) : elseFunc(data));

/**
 * @sig
 * @description d
 * @kind function
 * @function ifThisThenThat
 * @param {function} predicate - a
 * @param {function} ifFunc - b
 * @param {*} ifArg - c
 * @param {*} thatArg - d
 * @return {*} - e
 */
var ifThisThenThat = curry((predicate, ifFunc, ifArg, thatArg) => predicate(ifArg) ? ifFunc(thatArg) : thatArg);

/**
 * @sig kestrel :: a -> () -> a
 * @description d
 * @kind function
 * @function kestrel
 * @note @see {@link constant}
 * @param {*} item - a
 * @return {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
var kestrel = constant;

/**
 * @sig
 * @description d
 * @param {function} a - a
 * @return {*} - b
 */
var m = a => a(a);

/**
 * @sig
 * @description d
 * @kind function
 * @function o
 * @param {function} a - a
 * @param {function} b - b
 * @return {*} - c
 */
var o = curry((a, b) => b(a(b)));

/**
 * @sig pipe :: [a] -> (b -> c)
 * @description -  Takes a List of functions as arguments and returns
 * a function waiting to be invoked with a single item. Once the returned
 * function is invoked, it will reduce the List of functions over the item,
 * starting with the first function in the List and working through
 * sequentially. Performs a similar functionality to compose, but applies
 * the functions in reverse order to that of compose.
 * @refer {compose}
 * @note @see {@link compose}
 * @param {function} fn - The function to run initially; may be any arity.
 * @param {Array} fns - The remaining functions in the pipeline. Each receives
 * its input from the output of the previous function. Therefore each of these
 * functions must be unary.
 * @return {function} - Returns a function waiting for the item over which
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
 * @sig
 * @description d
 * @kind function
 * @function q
 * @param {function} a - a
 * @param {function} b - b
 * @param {*} c - c
 * @return {*} - d
 */
var q = curry((a, b, c) => b(a(c)));

//const reduce = (accFn, start, xs) => xs.reduce(accFn, start);
/**
 * @sig
 * @description d
 * @kind function
 * @function reduce
 * @param {function} accFunc - a
 * @param {*} start - b
 * @param {Array} xs - c
 * @return {Array} - d
 */
var reduce = curry(function _reduce(accFunc, start, xs) {
    /*
     for (let item of xs) {
     start = accFunc(start, item);
     }
     return start;
     */

    /*
     for (let item of xs) {
     let next = txf(acc, item);//we could also pass an index or xs, but K.I.S.S.
     acc = next && next[reduce.stopper] || next;// {[reduce.stopper]:value} or just a value
     if (next[reduce.stopper]) {
     break;
     }
     }
     return acc;

     //goes outside reduce definition; or side by side with declaration:
     //set reduce.stopper be a Symbol that only is only ever = to reduce.stopper itself
     Object.defineProperty(reduce, 'stopper', {
     enumerable: false,
     configurable: false,
     writable: false,
     value: Symbol('stop reducing')//no possible computation could come up with this by accident
     });
     */
    return xs.reduce(accFunc, start);
});

/**
 * @sig
 * @description d
 * @kind function
 * @function second
 * @return {*} - a
 */
var second = constant(identity);

/**
 * @sig
 * @description d
 * @kind function
 * @function sequence
 * @param {Array} fns - a
 * @return {function} - b
 */
var sequence = applyAll((fns, args) => fns.forEach(fn => fn(...args)));

/**
 * @sig
 * @description d
 * @kind function
 * @function t
 * @param {*} x - a
 * @param {function} f = b
 * @return {*} - c
 */
var t = curry((x, f) => f(x));

/**
 * @sig
 * @description d
 * @kind function
 * @function thrush
 * @refer {t}
 * @note @see {@link t}
 */
var thrush = t;

/**
 * @sig
 * @description d
 * @kind function
 * @function u
 * @param {function} a - a
 * @param {function} b - b
 * @return {*} - c
 */
var u = curry((a, b) => b(a(a)(b)));

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function uncurry(fn) {
    if (fn && fn.orig) return fn.orig;
    return fn;
}

/**
 * @sig
 * @description d
 * @kind function
 * @function uncurryN
 * @param {number} depth - a
 * @param {function} fn - b
 * @return {function|*} - c
 */
var uncurryN = curry(function uncurryN(depth, fn) {
    return curryN(this, depth, function _uncurryN(...args) {
        var currentDepth = 1,
            value = fn,
            idx = 0,
            endIdx;
        while (currentDepth <= depth && 'function' === typeof value) {
            endIdx = currentDepth === depth ? args.length : idx + value.length;
            value = value.apply(this, args.slice(idx, endIdx));
            currentDepth += 1;
            idx = endIdx;
        }
        return value;
    });
});

/**
 * @sig
 * @description d
 * @kind function
 * @function w
 * @param {function} a - a
 * @param {*} b - b
 * @return {*} - c
 */
var w = curry((a, b) => a(b)(b));

/**
 * @sig when :: Function -> (Function -> (a -> b))
 * @description Similar to ifElse, but no 'elseFunc' argument. Instead, if the application
 * of the predicate to the data returns truthy, the transform is applied to
 * the data. Otherwise, the data is returned without invoking the transform.
 * @kind function
 * @function when
 * @param {function} predicate - a
 * @param {function} transform - b
 * @param {*} data - c
 * @return {*} - d
 */
var when = curry((predicate, transform, data) => predicate(data) ? transform(data) : data);

/**
 * @sig
 * @description d
 * @kind function
 * @function whenNot
 * @param {function} predicate - a
 * @param {function} transform - b
 * @param {*} data - c
 * @return {*} - d
 */
var whenNot = curry((predicate, transform, data) => !predicate(data) ? transform(data) : data);

/**
 * @sig
 * @description d
 * @kind function
 * @function y
 */
var y = fixedPoint;

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function applyWhenReady(fn) {
    var values = [];
    function _applyWhenReady(...args) {
        values = values.concat(args);
        return _applyWhenReady;
    }

    _applyWhenReady.apply = () => fn(...values);
    _applyWhenReady.leftApply = _applyWhenReady.apply;
    _applyWhenReady.rightApply = () => fn(...values.reverse());
    _applyWhenReady.args = () => values;

    return _applyWhenReady;
}

function applyAll(fn) {
    return function _applyAll(...fns) {
        return function __applyAll(...args) {
            return fn(fns, args);
        };
    };
}

export { all, any, applyWhenReady, c, compose, constant, curry, curryN, curryRight, first, fixedPoint, fork, identity,
          ifElse, ifThisThenThat, kestrel, m, pipe, o, q, reduce, rev, second, sequence, t, thrush, u, uncurry, uncurryN, w, when, whenNot, y };