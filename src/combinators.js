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

/**
 * compose :: (b -> c) -> (a -> b) -> (a -> c)
 * @description:
 * @type: {function}
 * @note: @see {@link pipe}
 * @param: {Array} fns
 * @returns: {*}
 */
function compose(...fns) {
    return pipe(...fns.reverse());
}

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
 * curry :: (* -> a) -> (* -> a)
 * @description:
 * @param: {function} fn
 * @return: {function|*}
 */
function curry(fn) {
    if (!fn.length || 1 === fn.length) return fn;
    return curryN(this, fn.length, [], fn);
}

/**
 * @description: Curries a function to a specified arity
 * @param: {number} arity - The number of arguments to curry the function for
 * @param: {Array} received - An array of the arguments to be applied to the function
 * @param: {function} fn - The function to be curried
 * @return: {function | *} - Returns either a function waiting for more arguments to
 * be applied before invocation, or will return the result of the function invocation
 * if the specified number of arguments have been received
 */
function curryN(context, arity, received, fn) {
    return function _curryN(...rest) {
        var combined = received.concat(rest);
        if (arity > combined.length) return curryN(context, arity, combined, fn);
        return fn.call(context, ...combined.slice(0, arity));
    };
}

/**
 * @description:
 * @param: {function} fn
 * @return: {Function|*}
 */
function curryRight(fn) {
    return curryN(this, fn.length, [], function _wrapper(...args) {
        return fn.call(this, ...args.reverse());
    });
}

/**
 * @description:
 * @type: {function}
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
 * @description:
 * @param: {function} predicate
 * @return: {function}
 */
function filterReducer(predicate) {
    return function _filterReducer(result, input) {
        return predicate(input) ? result.concat(input) : result;
    };
}

var first = constant;

/**
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
 * @description:
 * @type: {function}
 * @param: {function} join
 * @param: {function} fn1
 * @param: {function} fn2
 * @returns: {function}
 */
var fork = curry(function _fork(join, fn1, fn2) {
    return function _fork_(...args) {
        return join(fn1(...args), fn2(...args));
    };
});

/**
 * Identity :: a -> a
 * @description: Identity function; takes any item and returns same item when invoked
 *
 * @param: {*} item - Any value of any type
 * @returns: {*} - returns item
 */
function identity(item) { return item; }

/**
 * ifElse :: Function -> ( Function -> ( Function -> (a -> b) ) )
 * @description: Takes a predicate function that is applied to the data; If a truthy value
 * is returned from the application, the provided ifFunc argument will be
 * invoked, passing the data as an argument, otherwise the elseFunc is
 * invoked with the data as an argument.
 * @type: {function}
 * @param: {function} predicate
 * @param: {function} ifFunc
 * @param: {function} elseFunc
 * @param: {*} data
 * @return: {*} - returns the result of invoking the ifFunc or elseFunc
 * on the data
 */
var ifElse = curry(function _ifElse(predicate, ifFunc, elseFunc, data) {
    if (predicate(data))
        return ifFunc(data);
    return elseFunc(data);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} predicate
 * @param: {function} ifFunc
 * @param: {*} ifArg
 * @param: {*} thatArg
 * @return: {*}
 */
var ifThisThenThat = curry(function _ifThisThenThat(predicate, ifFunc, ifArg, thatArg) {
    if (predicate(ifArg))
        return ifFunc(thatArg);
    return thatArg;
});

/**
 * kestrel :: a -> () -> a
 * @description:
 * @note: @see {@link constant}
 * @type: {function}
 * @param: {*} item
 * @returns: {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
var kestrel = constant;

/**
 * @description:
 * @param: {function} a
 * @return: {*}
 */
function m(a) {
    return a(a);
}

/**
 * @description:
 * @type: {function}
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
 * @description:
 * @type: {function}
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
 * @description:
 * @type: {function}
 * @param: {function} a
 * @param: {function} b
 * @return: {*}
 */
var o = curry(function _o(a, b) {
    return b(a(b));
});

/**
 * pipe :: [a] -> (b -> c)
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
 * @description:
 * @type: {function}
 * @param: {function} a
 * @param: {function} b
 * @param: {*} c
 * @return: {*}
 */
var q = curry(function _q(a, b, c) {
    b(a(c));
});

//const reduce = (accFn, start, xs) => xs.reduce(accFn, start);
/**
 * @description:
 * @type: {function}
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

var second = constant(identity);

/**
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
 * @description:
 * @type: {function}
 * @param: {function} a
 * @param: {function} b
 * @return: {*}
 */
var u = curry(function _u(a, b) {
    return b(a(a)(b));
});

/**
 * @description:
 * @type: {function}
 * @param: {function} a
 * @param: {*} b
 * @return: {*}
 */
var w = curry(function _w(a, b) {
    return a(b)(b);
});

/**
 * when :: Function -> (Function -> (a -> b))
 * @description: Similar to ifElse, but no 'elseFunc' argument. Instead, if the application
 * of the predicate to the data returns truthy, the transform is applied to
 * the data. Otherwise, the data is returned without invoking the transform.
 * @param: {function} predicate
 * @param: {function} transform
 * @param: {*} data
 * @return: {*}
 */
var when = curry(function _when(predicate, transform, data) {
    if (predicate(data)) return transform(data);
    return data;
});

/**
 * @description:
 * @type: {function}
 * @param: {function} predicate
 * @param: {function} transform
 * @param: {*} data
 * @return: {*}
 */
var whenNot = curry(function _whenNot(predicate, transform, data) {
    if (!predicate(data)) return transform(data);
    return data;
});

/**
 * @description:
 * @type: {@see fixedPoint}
 */
var y = fixedPoint;






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

export { all, any, c, compose, constant, curry, curryN, curryRight, filtering, filterReducer, first, fixedPoint, fork, identity,
          ifElse, ifThisThenThat, kestrel, m, mapped, mapping, mapReducer, pipe, o, q, reduce, second, sequence, u, w, when, whenNot, y };