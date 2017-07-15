/**
 * @description:
 * @param: {Array} fns - One or more comma separated function arguments
 * @return: {function}
 */
function all(...fns) {
    return function _all(...args) {
        return fns.every(function _testAll(fn) {
            return fn(...args);
        });
    };
}

/**
 * @description:
 * @param: {Array} fns - One or more comma separated function arguments
 * @return: {function}
 */
function any(...fns) {
    return function _any(...args) {
        return fns.some(function _testAny(fn) {
            return fn(...args);
        });
    };
}

/**
 * @description:
 * @type: {function}
 * @param: {function} x
 * @param: {*} y
 * @param: {*} z
 * @return: {*}
 */
var c = curry(function _c(x, y, z) {
    return x(y)(z);
});

var rev = (...args) => args.reverse();

/**
 * compose :: (b -> c) -> (a -> b) -> (a -> c)
 * @description:
 * @type: {function}
 * @note: @see {@link pipe}
 * @param: {Array} fns
 * @returns: {*}
 */
function compose(...fns) {
    fns = fns.reverse();
    return pipe(...fns);
}

/**
 * @description:
 * @type: {function}
 * @param: {function} exp1
 * @param: {function} exp2
 * @param: {function} cond
 * @return: {*}
 */
var condition = curry((exp1, exp2, cond) => cond(x, exp1, exp2));

var notFn = condition(constant(x => x), x => x);

var n = function _n(x, y, z) {
    return function (...args) {
        console.log(x, y, z);
        x ? y(...args) : z(...args);
    };
};

/**
 * constant :: a -> () -> a
 * @description:
 * @param: {*} item
 * @returns: {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
function constant(item) {
    return function _constant() {
        return item;
    };
}

/**
 * @type: curry :: (* -> a) -> (* -> a)
 * @description:
 * @param: {function} fn
 * @return: {function|*}
 */
function curry(fn) {
    if (!fn.length || 1 === fn.length) return fn;
    return curryN(this, fn.length, fn);
}

/**
 * @type: curryN :: (* -> a) -> (* -> a)
 * @description: Curries a function to a specified arity
 * @param: {number} arity - The number of arguments to curry the function for
 * @param: {Array} received - An array of the arguments to be applied to the function
 * @param: {function} fn - The function to be curried
 * @return: {function | *} - Returns either a function waiting for more arguments to
 * be applied before invocation, or will return the result of the function applied
 * to the supplied arguments is the specified number of arguments have been received.
 */
function curryN(context, arity, fn, received = []) {
    return function _curryN(...rest) {
        var combined = received.concat(rest);
        if (arity > combined.length) return curryN(context, arity, fn, combined);
        return fn.call(context, ...combined.slice(0, arity));
    };
}

/**
 * @type:
 * @description:
 * @param: {function} fn
 * @return: {Function|*}
 */
function curryRight(fn) {
    return curryN(this, fn.length, function _wrapper(...args) {
        return fn.call(this, ...args.reverse());
    });
}

/**
 * @type:
 * @description:
 * @param: {function} predicate
 * @param: {function} reduceFn
 * @param: {*} result
 * @param: {*} input
 * @return: {*}
 */
var filtering = curry(function _filtering2(predicate, reduceFn, result, input) {
    return predicate(input) ? reduceFn(result, input) : result;
});

/**
 * @type:
 * @description:
 * @param: {function} predicate
 * @return: {function}
 */
function filterReducer(predicate) {
    return function _filterReducer(result, input) {
        return predicate(input) ? result.concat(input) : result;
    };
}

/**
 * @type:
 * @description:
 * @param: {*}
 * @return: {function}
 */
var first = constant;

/**
 * @type:
 * @description:
 * @param: {function} fn
 * @return {*}
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
 * @type:
 * @description:
 * @param: {function} join
 * @param: {function} fn1
 * @param: {function} fn2
 * @returns: {function}
 */
var fork = curry((join, fn1, fn2) => {
    return (...args) => join(fn1(...args), fn2(...args));
});

/**
 * @type: Identity :: a -> a
 * @description: Identity function; takes any item and returns same item when invoked
 * @param: {*} item - Any value of any type
 * @returns: {*} - returns item
 */
var identity = item => item;

/**
 * @type: ifElse :: Function -> ( Function -> ( Function -> (a -> b) ) )
 * @description: Takes a predicate function that is applied to the data; If a truthy value
 * is returned from the application, the provided ifFunc argument will be
 * invoked, passing the data as an argument, otherwise the elseFunc is
 * invoked with the data as an argument.
 * @param: {function} predicate
 * @param: {function} ifFunc
 * @param: {function} elseFunc
 * @param: {*} data
 * @return: {*} - returns the result of invoking the ifFunc or elseFunc
 * on the data
 */
var ifElse = curry((predicate, ifFunc, elseFunc, data) => predicate(data) ? ifFunc(data) : elseFunc(data));

/**
 * @type:
 * @description:
 * @param: {function} predicate
 * @param: {function} ifFunc
 * @param: {*} ifArg
 * @param: {*} thatArg
 * @return: {*}
 */
var ifThisThenThat = curry((predicate, ifFunc, ifArg, thatArg) => predicate(ifArg) ? ifFunc(thatArg) : thatArg);

/**
 * @type: kestrel :: a -> () -> a
 * @description:
 * @note: @see {@link constant}
 * @param: {*} item
 * @returns: {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
var kestrel = constant;

/**
 * @type:
 * @description:
 * @param: {function} a
 * @return: {*}
 */
var m = a => a(a);

/**
 * @type:
 * @description:
 * @param: {function} f
 * @param: {object} x
 * @return: {identity<T>}
 */
var mapped = curry(function _mapped(f, x) {
    return identity(map(compose(function _mCompose(x) {
        return x.value;
    }, f), x));
});

/**
 * @type:
 * @description:
 * @param: {function} mapFn
 * @param: {function} reduceFn
 * @param: {*} result
 * @param: {*} input
 * @return: {*}
 */
var mapping = curry(function _mapping2(mapFn, reduceFn, result, input) {
    return reduceFn(result, mapFn(input));
});

/**
 * @type:
 * @description:
 * @param: {function} mapFn
 * @return: {function}
 */
function mapReducer (mapFn) {
    return function _mapReducer(result, input) {
        return result.concat(mapFn(input));
    };
}

/**
 * @type:
 * @description:
 * @param: {function} a
 * @param: {function} b
 * @return: {*}
 */
var o = curry((a, b) => b(a(b)));

/**
 * @type: pipe :: [a] -> (b -> c)
 * @description: -  Takes a List of functions as arguments and returns
 * a function waiting to be invoked with a single item. Once the returned
 * function is invoked, it will reduce the List of functions over the item,
 * starting with the first function in the List and working through
 * sequentially. Performs a similar functionality to compose, but applies
 * the functions in reverse order to that of compose.
 * @refer: {compose}
 * @note: @see {@link compose}
 * @param: {function} fn - The function to run initially; may be any arity.
 * @param: {Array} fns - The remaining functions in the pipeline. Each receives
 * its input from the output of the previous function. Therefore each of these
 * functions must be unary.
 * @returns: {function} - Returns a function waiting for the item over which
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
 * @type:
 * @description:
 * @param: {function} a
 * @param: {function} b
 * @param: {*} c
 * @return: {*}
 */
var q = curry((a, b, c) => b(a(c)));

//const reduce = (accFn, start, xs) => xs.reduce(accFn, start);
/**
 * @type:
 * @description:
 * @param: {function} accFunc
 * @param: {*} start
 * @param: {Array} xs
 * @return: {Array};
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
 * @type:
 * @description:
 */
var second = constant(identity);

/**
 * @type:
 * @description:
 * @param: {Array} fns
 * @returns: {function}
 */
function sequence(fns) {
    return function _sequence(...args) {
        fns.forEach(function fSequence(fn) {
            fn(...args);
        });
    };
}

/**
 * @type:
 * @description:
 * @param: {*} x
 * @param: {function} f
 * @return: {*}
 */
var t = curry((x, f) => f(x));

/**
 * @type:
 * @description:
 * @refer: {t}
 * @note: @see {@link t}
 */
var thrush = t;

/**
 * @type:
 * @description:
 * @param: {function} a
 * @param: {function} b
 * @return: {*}
 */
var u = curry((a, b) => b(a(a)(b)));

/**
 * @type:
 * @description:
 * @param: {function} a
 * @param: {*} b
 * @return: {*}
 */
var w = curry((a, b) => a(b)(b));

/**
 * @type: when :: Function -> (Function -> (a -> b))
 * @description: Similar to ifElse, but no 'elseFunc' argument. Instead, if the application
 * of the predicate to the data returns truthy, the transform is applied to
 * the data. Otherwise, the data is returned without invoking the transform.
 * @param: {function} predicate
 * @param: {function} transform
 * @param: {*} data
 * @return: {*}
 */
var when = curry((predicate, transform, data) => predicate(data) ? transform(data) : data);

/**
 * @type:
 * @description:
 * @param: {function} predicate
 * @param: {function} transform
 * @param: {*} data
 * @return: {*}
 */
var whenNot = curry((predicate, transform, data) => !predicate(data) ? transform(data) : data);

/**
 * @type:
 * @description:
 */
var y = fixedPoint;

/**
 * @type:
 * @description:
 * @param: {function} fn
 * @return: {function}
 */
function applyWhenReady(fn) {
    var values = [];
    function _applyWhenReady(...args) {
        values = values.concat(args);
        return _applyWhenReady;
    }

    _applyWhenReady.invoke = function _invoke() {
        fn(...values);
    };

    _applyWhenReady.reverseInvoke = function _reverseInvoke() {
        fn(...values.reverse());
    };

    return _applyWhenReady;
}






function dropGate(skips) {
    return function _dropGate(x) {
        return 0 > --skips;
    };
}

function dropping1(skips) {
    return filtering(dropGate(skips));
    //return compose(filtering, dropGate)(skips);
    //return filtering(function _f(x) { return --skips < 0; });
}

function dropping2(skips) {
    return function _dropping2(reducingFunc) {
        return function _dropping2_(acc, item) {
            return 0 <= --skips ? acc : reducingFunc(acc, item);
        };
    };
}


var x = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    .reduce(mapping((x) => x + 1)((xs, x) => {
        xs.push(x);
        return xs;
    }), [])
    .reduce(filtering((x) => 0 === x % 2)((xs, x) => {
        xs.push(x);
        return xs;
    }), []);

var xs1 = compose(
    mapping(function _mapFunc(x) {
        return x + 1;
    }),
    filtering(function _filterFunc(x) {
        return 0 === x % 2;
    }));

/*
 var g = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].reduce(xs1(function _reduce(xs, xi) {
 xs[xs.length] = xi;
 return xs;
 }), []);
 */

//var t = reduce(dropping1(3)(concat),[],[1,2,3,4,5]);//->
//const dropGate = skips => x => --skips>=0 ? false : true;

//const dropping = skips => filtering(dropGate(skips));
//or...                => compose(filtering, dropGate)(skips);
//or...                => filtering(x => --skips>=0 ? false : true);
//or....
/*
 const dropping = skips => reducingFn => (acc, item) => {
 return --skips >= 0 ? acc : reducingFn(acc, item);
 };*/

//usage
//reduce(dropping(3)(concat),[],[1,2,3,4,5]);//-> [4,5]

export { all, any, applyWhenReady, c, compose, constant, curry, curryN, curryRight, filtering, filterReducer, first, fixedPoint, fork, identity,
          ifElse, ifThisThenThat, kestrel, m, mapped, mapping, mapReducer, pipe, o, q, reduce, second, sequence, t, thrush, u, w, when, whenNot, y };