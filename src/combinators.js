/** @module combinators */

/**
 * @signature (* -> *) -> [*] -> boolean
 * @description Partially applied function that takes one or more functions followed
 * by zero or more arguments and applies each function to the arguments in the order
 * they were passed. If every function returns a truthy value when applied to the arguments,
 * 'true' is returned, 'false' other wise.
 * @note: This function is partially applied, not curried.
 * @kind function
 * @function all
 * @param {function} fns - One or more comma separated function arguments
 * @return {function} - a
 */
var all = applyAll((fns, args) => fns.every(fn => fn(...args)));

/**
 * @signature (* -> *) -> [*] -> boolean
 * @description Partially applied function that takes one or more functions followed
 * by zero or more arguments and applies each function to the arguments in the order
 * they were passed. If a single function returns a truthy value when applied to the
 * arguments, 'true' is returned, 'false' other wise.
 * @note: This function is partially applied, not curried.
 * @kind function
 * @function any
 * @param {Array} fns - One or more comma separated function arguments
 * @return {function} - a
 */
var any = applyAll((fns, args) => fns.some(fn => fn(...args)));

/**
 * @signature
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

/**
 * @description Takes any number of arguments, collects them, and then returns them
 * in an array in reverse order.
 * @param {*} args The arguments that are to be grouped and reversed.
 * @return {Array} Returns an array of values.
 */
var rev = (...args) => args.reverse();

/**
 * @signature compose :: (b -> c) -> (a -> b) -> (a -> c)
 * @description Takes one or more functions and feeds the result of each
 * into the following function. The return value of the last function is
 * the return value of this function. Note that the functions are invoked
 * in reverse order of how they are received. Use {@link pipe} if you want
 * the functions invoked in the same order they are received.
 * @note: This function is partially applied, not curried.
 * @see pipe
 * @param {function} fns - Two or more functions that should be composed
 * @return {*} - b
 *
 * @example
 *      var list = 6,
 *          mapFilter = compose(x => x > 5, x => x * 2);
 *
 *      mapFilter(list);    //10
*/
function compose(...fns) {
    fns = fns.reverse();
    return pipe(...fns);
}

/**
 * @signature
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
        x ? y(...args) : z(...args);
    };
};

/**
 * @signature constant :: a -> () -> a
 * @description A function that creates a constant function. When invoked
 * with any value, the constant function will return a new function. When
 * the new function is invoked, with or without values, it will always return
 * the value that was given to the initial function.
 * @param {*} item - Any value
 * @return {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
function constant(item) {
    return function _constant() {
        return item;
    };
}

/**
 * @signature curry :: (* -> a) -> (* -> a)
 * @description d
 * @note This function is partially applied, not curried.
 * @param {function} fn - a
 * @return {function|*} - b
 *
 * @example
 *      var c = curry((a, b, c, d) => a + b + c + d);
 *      c(1)(2, 3)(4)   //10
 */
function curry(fn) {
    if (1 >= fn.length) return fn;
    return curryN.call(this, fn.length, fn);
}

/**
 * @signature curryN :: (* -> a) -> (* -> a)
 * @description Curries a function to a specified arity
 * @param {number} arity - The number of arguments to curry the function for
 * @param {function} fn - The function to be curried
 * @param {Array} [received] - An optional array of the arguments to be applied to the
 * function.
 * @return {function | *} - Returns either a function waiting for more arguments to
 * be applied before invocation, or will return the result of the function applied
 * to the supplied arguments if the specified number of arguments have been received.
 *
 * @example
 *      var c = curryN(this, 5, (a, b, c) => a + b + c);
 *      c(1, 2)(3)(4, 5)    //6
 */
function curryN(arity, fn, received = []) {
    if (fn.orig && fn.orig !== fn) return curryN.call(this, arity, fn.orig, received);
    function _curryN(...rest) {
        var combined = received.concat(rest);
        if (arity > combined.length) return curryN.call(this, arity, fn, combined);
        return fn.call(this, ...combined.slice(0, arity));
    }

    _curryN.orig = fn;
    _curryN.toString = () => `${fn.toString()}(${received.join(',')})`;
    return _curryN;
}

/**
 * @signature
 * @description Behaves like curry, but executes the given function with the arguments
 * in reverse order from that in which they were received.
 * @note This function is partially applied, not curried.
 * @see curry
 * @param {function} fn - A function that should be curried and eventually invoked with
 * the arguments in reverse order.
 * @return {Function|*} - Returns a function waiting for arguments.
 *
 * @example
 *      var c = curryRight((a, b, c, d) => a + b * c / d);
 *      c(1)(2, 3, 4)   //1
 */
function curryRight(fn) {
    /**
     * @description Function returned both by {@link curryRight} and itself unless and
     * until it has received the appropriate number of arguments to invoked the curried
     * function.
     * @function _wrapper
     * @param {*} args One or more arguments that the function should be applied to.
     * @return {function|*} Returns either a function if not enough arguments have been
     * received yet, other wise it returns whatever the return value of the last function
     * in the pipeline returned.
     */
    return curryN.call(this, fn.length, function _wrapper(...args) {
        return fn.call(this, ...args.reverse());
    });
}

/**
 * @signature
 * @description d
 * @see constant
 * @kind function
 * @function first
 * @param {*} - a
 * @return {function} - b
 */
var first = constant;

/**
 * @signature
 * @description d
 * @note This function is partially applied, not curried.
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
 * @signature
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
 * @signature Identity :: a -> a
 * @description Identity function; takes any item and returns same item when invoked
 * @param {*} item - Any value of any type
 * @return {*} - returns item
 */
var identity = item => item;

/**
 * @signature ifElse :: Function -> ( Function -> ( Function -> (a -> b) ) )
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
 * @signature
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
 * @signature kestrel :: a -> () -> a
 * @description d
 * @kind function
 * @function kestrel
 * @see constant
 * @param {*} item - a
 * @return {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
var kestrel = constant;

/**
 * @signature
 * @description d
 * @param {function} a - a
 * @return {*} - b
 */
var m = a => a(a);

/**
 * @signature
 * @description d
 * @kind function
 * @function o
 * @param {function} a - a
 * @param {function} b - b
 * @return {*} - c
 */
var o = curry((a, b) => b(a(b)));

/**
 * @signature pipe :: [a] -> (b -> c)
 * @description -  Takes a List of functions as arguments and returns
 * a function waiting to be invoked with a single item. Once the returned
 * function is invoked, it will reduce the List of functions over the item,
 * starting with the first function in the List and working through
 * sequentially. Performs a similar functionality to compose, but applies
 * the functions in reverse order to that of compose.
 * @refer {compose}
 * @see compose
 * @param {function} fn - The function to run initially; may be any arity.
 * @param {Array} fns - The remaining functions in the pipeline. Each receives
 * its input from the output of the previous function. Therefore each of these
 * functions must be unary.
 * @return {function} - Returns a function waiting for the item over which
 * to reduce the functions.
 *
 * @example
 *      var p = pipe(x => x % 2, x => x * x);
 *
 *      p(10)  //0
 */
function pipe(fn, ...fns) {
    return function _pipe(...args) {
        return fns.reduce(function pipeReduce(item, f) {
            return f(item);
        }, fn(...args));
    };
}

/**
 * @signature
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
 * @signature
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
 * @signature
 * @description d
 * @kind function
 * @function second
 * @return {*} - a
 */
var second = constant(identity);

/**
 * @signature
 * @description d
 * @note This function is partially applied, not curried.
 * @kind function
 * @function sequence
 * @param {Array} fns - a
 * @return {function} - b
 */
var sequence = applyAll((fns, args) => fns.forEach(fn => fn(...args)));

/**
 * @signature
 * @description d
 * @kind function
 * @function t
 * @param {*} x - a
 * @param {function} f = b
 * @return {*} - c
 */
var t = curry((x, f) => f(x));

/**
 * @signature
 * @description d
 * @kind function
 * @function thrush
 * @refer {t}
 * @see t
 */
 var thrush = t;

 /**
 * @signature
 * @description d
 * @kind function
 * @function u
 * @param {function} a - a
 * @param {function} b - b
 * @return {*} - c
 */
var u = curry((a, b) => b(a(a)(b)));

/**
 * @signature
 * @description Takes any function curried by this library and uncurries it.
 * @param {function} fn - a
 * @return {function} - b
 *
 * @example
 *      var c = curry((a, b, c, d) => a + b + c + d),
 *      d = uncurry(c);
 *
 *      c(1)(2, 3, 4)   //10
 *      d(1)            //NaN
 */
function uncurry(fn) {
    if (fn && fn.orig) return fn.orig;
    return fn;
}

/**
 * @signature
 * @description d
 * @kind function
 * @function uncurryN
 * @param {number} depth - a
 * @param {function} fn - b
 * @return {function|*} - c
 *
 * @example
 *      var c = curry((a, b, c) => a + b + c),
 *          d = uncurryN(1, c);
 *
 *      c(1, 2)     //NaN
 */
var uncurryN = curry(function uncurryN(depth, fn) {
    return curryN.call(this, depth, function _uncurryN(...args) {
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
 * @signature
 * @description d
 * @kind function
 * @function w
 * @param {function} a - a
 * @param {*} b - b
 * @return {*} - c
 */
var w = curry((a, b) => a(b)(b));

/**
 * @signature when :: Function -> (Function -> (a -> b))
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
 * @signature whenNot :: () -> () -> * -> *
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
 * @signature
 * @description d
 * @kind function
 * @function y
 */
var y = fixedPoint;

/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function applyWhenReady(fn) {
    var values = [];

    /**
     * @signature (*...) -> (*...) -> *
     * @description Takes any function and will allow any number of arguments to
     * be passed as parameters until _applyWhenReady#apply, _applyWhenReady#leftApply,
     * or _applyWhenReady#rightApply are invoked.
     * @namespace _applyWhenReady
     * @param {*} args - Zero or more arguments to be applied to the given function.
     * @return {_applyWhenReady} Returns a function that will wait and gather arguments
     * to be applied to the given function.
     * @private
     * @property {function} apply
     * @property {function} leftApply
     * @property {function} rightApply
     * @property {function} args
     */
    function _applyWhenReady(...args) {
        values = values.concat(args);
        return _applyWhenReady;
    }

    /**
     * @signature () -> *
     * @description Invokes the given function using all of the provided
     * arguments.
     * @memberOf _applyWhenReady
     * @function apply
     * @return {*} Returns the value that the given function returns
     */
    _applyWhenReady.apply = () => fn(...values);

    /**
     * @signature () -> *
     * @description Invokes the given function using all of the provided
     * arguments.
     * @memberOf _applyWhenReady
     * @function leftApply
     * @return {*} Returns the value that the given function returns
     */
    _applyWhenReady.leftApply = _applyWhenReady.apply;

    /**
     * @signature () -> *
     * @description Invokes the given function using all of the provided
     * arguments in reverse order.
     * @memberOf _applyWhenReady
     * @function rightApply
     * @return {*} Returns the value that the given function returns
     */
    _applyWhenReady.rightApply = () => fn(...values.reverse());

    /**
     * @signature () -> [*]
     * @description Returns an array of the arguments received thus far.
     * @function args
     * @return {Array} Returns an array of values.
     */
    _applyWhenReady.args = () => values;

    return _applyWhenReady;
}

/**
 * @signature () -> () -> * -> *
 * @description Takes two or more functions and zero or more
 * arguments and invokes the function with the arguments.
 * @note This function is partially applied, not curried.
 * @param {function} fn - The first function in a pipeline that
 * should have all of the provided arguments applied to first.
 * @return {function} Returns a function waiting for more functions.
 */
function applyAll(fn) {
    return function _applyAll(...fns) {
        return function __applyAll(...args) {
            return fn(fns, args);
        };
    };
}

export { all, any, applyWhenReady, c, compose, constant, curry, curryN, curryRight, first, fixedPoint, fork, identity,
          ifElse, ifThisThenThat, kestrel, m, pipe, o, q, reduce, rev, second, sequence, t, thrush, u, uncurry, uncurryN, w, when, whenNot, y };