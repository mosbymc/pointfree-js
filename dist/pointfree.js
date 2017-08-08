(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @sig
 * @description d
 * @param {Array} fns - One or more comma separated function arguments
 * @return {function} - a
 */
function all() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
    }

    return function _all() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return fns.every(function _testAll(fn) {
            return fn.apply(undefined, args);
        });
    };
}

/**
 * @sig
 * @description d
 * @param {Array} fns - One or more comma separated function arguments
 * @return {function} - a
 */
function any() {
    for (var _len3 = arguments.length, fns = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        fns[_key3] = arguments[_key3];
    }

    return function _any() {
        for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
        }

        return fns.some(function _testAny(fn) {
            return fn.apply(undefined, args);
        });
    };
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} x
 * @param {*} y - a
 * @param {*} z - b
 * @return {*} - c
 */
var c = curry(function _c(x, y, z) {
    console.log(x, y, z);
    return x(y)(z);
});

var rev = function rev() {
    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
    }

    return args.reverse();
};

/**
 * @sig compose :: (b -> c) -> (a -> b) -> (a -> c)
 * @description d
 * @type {function}
 * @note: @see {@link pipe}
 * @param {Array} fns - a
 * @return {*} - b
 */
function compose() {
    for (var _len6 = arguments.length, fns = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        fns[_key6] = arguments[_key6];
    }

    fns = fns.reverse();
    return pipe.apply(undefined, _toConsumableArray(fns));
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} exp1 - a
 * @param {function} exp2 - b
 * @param {function} cond - c
 * @return {*} - d
 */
var condition = curry(function (exp1, exp2, cond) {
    return cond(exp1, exp2);
});

var notFn = condition(constant(function (x) {
    return x;
}), function (x) {
    return x;
});

var n = function _n(x, y, z) {
    return function _n_() {
        console.log(x, y, z);
        x ? y.apply(undefined, arguments) : z.apply(undefined, arguments);
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
function curryN(context, arity, fn) {
    var received = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];

    if (fn.orig && fn.orig !== fn) return curryN(context, arity, fn.orig, received);
    function _curryN() {
        for (var _len7 = arguments.length, rest = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            rest[_key7] = arguments[_key7];
        }

        var combined = received.concat(rest);
        if (arity > combined.length) return curryN(context, arity, fn, combined);
        return fn.call.apply(fn, [context].concat(_toConsumableArray(combined.slice(0, arity))));
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
    return curryN(this, fn.length, function _wrapper() {
        for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            args[_key8] = arguments[_key8];
        }

        return fn.call.apply(fn, [this].concat(_toConsumableArray(args.reverse())));
    });
}

/**
 * @sig
 * @description d
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
 * @param {function} join - a
 * @param {function} fn1 - b
 * @param {function} fn2 - c
 * @return {function} - d
 */
var fork = curry(function (join, fn1, fn2) {
    return function () {
        return join(fn1.apply(undefined, arguments), fn2.apply(undefined, arguments));
    };
});

/**
 * @sig Identity :: a -> a
 * @description Identity function; takes any item and returns same item when invoked
 * @param {*} item - Any value of any type
 * @return {*} - returns item
 */
var identity = function identity(item) {
    return item;
};

/**
 * @sig ifElse :: Function -> ( Function -> ( Function -> (a -> b) ) )
 * @description Takes a predicate function that is applied to the data; If a truthy value
 * is returned from the application, the provided ifFunc argument will be
 * invoked, passing the data as an argument, otherwise the elseFunc is
 * invoked with the data as an argument.
 * @type {function}
 * @param {function} predicate - a
 * @param {function} ifFunc - b
 * @param {function} elseFunc - c
 * @param {*} data - d
 * @return {*} - returns the result of invoking the ifFunc or elseFunc
 * on the data
 */
var ifElse = curry(function (predicate, ifFunc, elseFunc, data) {
    return predicate(data) ? ifFunc(data) : elseFunc(data);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} predicate - a
 * @param {function} ifFunc - b
 * @param {*} ifArg - c
 * @param {*} thatArg - d
 * @return {*} - e
 */
var ifThisThenThat = curry(function (predicate, ifFunc, ifArg, thatArg) {
    return predicate(ifArg) ? ifFunc(thatArg) : thatArg;
});

/**
 * @sig kestrel :: a -> () -> a
 * @description d
 * @type {function}
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
var m = function m(a) {
    return a(a);
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} a - a
 * @param {function} b - b
 * @return {*} - c
 */
var o = curry(function (a, b) {
    return b(a(b));
});

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
function pipe(fn) {
    for (var _len9 = arguments.length, fns = Array(_len9 > 1 ? _len9 - 1 : 0), _key9 = 1; _key9 < _len9; _key9++) {
        fns[_key9 - 1] = arguments[_key9];
    }

    return function _pipe() {
        return fns.reduce(function pipeReduce(item, f) {
            return f(item);
        }, fn.apply(undefined, arguments));
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
var q = curry(function (a, b, c) {
    return b(a(c));
});

//const reduce = (accFn, start, xs) => xs.reduce(accFn, start);
/**
 * @sig
 * @description d
 * @type {function}
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
 * @type {function}
 * @return {*} - a
 */
var second = constant(identity);

/**
 * @sig
 * @description d
 * @param {Array} fns - a
 * @return {function} - b
 */
function sequence(fns) {
    return function _sequence() {
        for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
            args[_key10] = arguments[_key10];
        }

        fns.forEach(function fSequence(fn) {
            fn.apply(undefined, args);
        });
    };
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} x - a
 * @param {function} f = b
 * @return {*} - c
 */
var t = curry(function (x, f) {
    return f(x);
});

/**
 * @sig
 * @description d
 * @refer {t}
 * @note @see {@link t}
 */
var thrush = t;

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} a - a
 * @param {function} b - b
 * @return {*} - c
 */
var u = curry(function (a, b) {
    return b(a(a)(b));
});

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
 * @type {function}
 * @param {number} depth - a
 * @param {function} fn - b
 * @return {function|*} - c
 */
var uncurryN = curry(function uncurryN(depth, fn) {
    console.log(depth, fn);
    return curryN(this, depth, function _uncurryN() {
        for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
            args[_key11] = arguments[_key11];
        }

        console.log(args);
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
 * @type {function}
 * @param {function} a - a
 * @param {*} b - b
 * @return {*} - c
 */
var w = curry(function (a, b) {
    return a(b)(b);
});

/**
 * @sig when :: Function -> (Function -> (a -> b))
 * @description Similar to ifElse, but no 'elseFunc' argument. Instead, if the application
 * of the predicate to the data returns truthy, the transform is applied to
 * the data. Otherwise, the data is returned without invoking the transform.
 * @type {function}
 * @param {function} predicate - a
 * @param {function} transform - b
 * @param {*} data - c
 * @return {*} - d
 */
var when = curry(function (predicate, transform, data) {
    return predicate(data) ? transform(data) : data;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} predicate - a
 * @param {function} transform - b
 * @param {*} data - c
 * @return {*} - d
 */
var whenNot = curry(function (predicate, transform, data) {
    return !predicate(data) ? transform(data) : data;
});

/**
 * @sig
 * @description d
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
    function _applyWhenReady() {
        for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
            args[_key12] = arguments[_key12];
        }

        values = values.concat(args);
        return _applyWhenReady;
    }

    _applyWhenReady.apply = function _apply() {
        return fn.apply(undefined, _toConsumableArray(values));
    };

    _applyWhenReady.leftApply = _applyWhenReady.apply;

    _applyWhenReady.rightApply = function _rightApply() {
        console.log(values);
        return fn.apply(undefined, _toConsumableArray(values.reverse()));
    };

    return _applyWhenReady;
}

exports.all = all;
exports.any = any;
exports.applyWhenReady = applyWhenReady;
exports.c = c;
exports.compose = compose;
exports.constant = constant;
exports.curry = curry;
exports.curryN = curryN;
exports.curryRight = curryRight;
exports.first = first;
exports.fixedPoint = fixedPoint;
exports.fork = fork;
exports.identity = identity;
exports.ifElse = ifElse;
exports.ifThisThenThat = ifThisThenThat;
exports.kestrel = kestrel;
exports.m = m;
exports.pipe = pipe;
exports.o = o;
exports.q = q;
exports.reduce = reduce;
exports.rev = rev;
exports.second = second;
exports.sequence = sequence;
exports.t = t;
exports.thrush = thrush;
exports.u = u;
exports.uncurry = uncurry;
exports.uncurryN = uncurryN;
exports.w = w;
exports.when = when;
exports.whenNot = whenNot;
exports.y = y;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * @sig
 * @description d
 * @return {*} - a
 */
function get() {
    return this.value;
}

/**
 * @sig
 * @description d
 * @return {string} - b
 */
function emptyGet() {
    throw new Error('Cannot extract a null value.');
}

/**
 * @sig
 * @description d
 * @param {function} f - a
 * @return {*} - b
 */
function orElse(f) {
    return this.value;
}

/**
 * @sig
 * @description d
 * @param {function} f - a
 * @return {*} - b
 */
function emptyOrElse(f) {
    return f();
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {*} - b
 */
function getOrElse(x) {
    return this.value;
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {*} - b
 */
function emptyGetOrElse(x) {
    return x;
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {*} - b
 */
function apply(ma) {
    return ma.map(this.value);
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
function chain(fn) {
    var val = fn(this.value);
    return Object.getPrototypeOf(this).isPrototypeOf(val) ? val : this.of(val);
}

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @param {string} prop - b
 * @return {function} - c
 */
function disjunctionEqualMaker(type, prop) {
    return function _disjunctionEquals(a) {
        return Object.getPrototypeOf(type).isPrototypeOf(a) && a[prop] && this.value === a.value;
    };
}

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
function equalMaker(type) {
    return function _equal(a) {
        return Object.getPrototypeOf(type).isPrototypeOf(a) && this.value === a.value;
    };
}

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
var lifter = function lifter(type) {
    return function (fn) {
        return function () {
            return type.of(fn.apply(undefined, arguments));
        };
    };
};

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
var maybeFactoryHelper = function maybeFactoryHelper(type) {
    return function (val) {
        return type(val);
    };
};

/**
 * @sig
 * @description d
 * @return {*} - a
 */
function mjoin() {
    return this.value;
}

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
var pointMaker = function pointMaker(type) {
    return function (val) {
        return type.of(val);
    };
};

/**
 * @sig
 * @description d
 * @param {string} typeString - a
 * @return {function} - b
 */
function stringMaker(typeString) {
    return function _toString() {
        return typeString + '(' + this.value + ')';
    };
}

/**
 * @sig
 * @description d
 * @return {*} - a
 */
function valueOf() {
    return this.value;
}

//==========================================================================================================//
//==========================================================================================================//
//================================        Shared Maybe Functionality        ================================//
//==========================================================================================================//
//==========================================================================================================//
function justMap(fn) {
    return this.of(fn(this.value));
}

function nothingMapMaker(factory) {
    return function nothingMap(fn) {
        return factory(this.value);
    };
}

function justBimap(f, g) {
    return this.of(f(this.value));
}

function nothingBimapMaker(factory) {
    return function nothingBimap(f, g) {
        return factory(g(this.value));
    };
}

var sharedMaybeFns = {
    justMap: justMap,
    nothingMapMaker: nothingMapMaker,
    justBimap: justBimap,
    nothingBimapMaker: nothingBimapMaker
};

//==========================================================================================================//
//==========================================================================================================//
//================================        Shared Either Functionality        ===============================//
//==========================================================================================================//
//==========================================================================================================//
/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
function rightMap(fn) {
    return this.of(fn(this.value));
}

/**
 * @sig
 * @description d
 * @param {function} factory - a
 * @return {function} - b
 */
function leftMapMaker(factory) {
    return function leftMap(fn) {
        return factory(this.value);
    };
}

/**
 * @sig
 * @description d
 * @param {function} f - a
 * @param {function} g - b
 * @return {*} - c
 */
function rightBiMap(f, g) {
    return this.of(f(this.value));
}

/**
 * @sig
 * @description d
 * @param {function} factory - a
 * @return {function} - b
 */
function leftBimapMaker(factory) {
    return function leftBimap(f, g) {
        return factory(g(this.value));
    };
}

var sharedEitherFns = {
    rightMap: rightMap,
    leftMapMaker: leftMapMaker,
    rightBiMap: rightBiMap,
    leftBimapMaker: leftBimapMaker
};

exports.apply = apply;
exports.chain = chain;
exports.disjunctionEqualMaker = disjunctionEqualMaker;
exports.equalMaker = equalMaker;
exports.lifter = lifter;
exports.maybeFactoryHelper = maybeFactoryHelper;
exports.mjoin = mjoin;
exports.pointMaker = pointMaker;
exports.stringMaker = stringMaker;
exports.valueOf = valueOf;
exports.get = get;
exports.emptyGet = emptyGet;
exports.orElse = orElse;
exports.emptyOrElse = emptyOrElse;
exports.getOrElse = getOrElse;
exports.emptyGetOrElse = emptyGetOrElse;
exports.sharedMaybeFns = sharedMaybeFns;
exports.sharedEitherFns = sharedEitherFns;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constant_functor = exports.Constant = undefined;

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {constant_functor} - b
 */
function Constant(item) {
  return Object.create(constant_functor, {
    _value: {
      value: item,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {constant_functor} - b
 */
Constant.of = function (x) {
  return Constant(x);
};

/**
 * @sig
 * @description d
 * @param {function} f - a
 * @return {boolean} - b
 */
Constant.is = function (f) {
  return constant_functor.isPrototypeOf(f);
};

/**
 * @description d
 * @typedef {Object}
 * @property {function} value
 * @property {function} map
 * @property {function} get
 * @property {function} orElse
 * @property {function} getOrElse
 * @property {function} valueOf
 * @property {function} of
 * @property {function} toString
 * @property {function} factory
 */
var constant_functor = {
  get value() {
    return this._value;
  },
  /**
   * @sig
   * @description d
   * @return {constant_functor} - a
   */
  map: function _map() {
    return this.of(this.value);
  },
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  get: _containerHelpers.get,
  /**
   * @sig
   * @description d
   * @param {function} f - a
   * @return {*} - b
   */
  orElse: _containerHelpers.orElse,
  /**
   * @sig
   * @description d
   * @param {*} x - a
   * @return {*} - b
   */
  getOrElse: _containerHelpers.getOrElse,
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  valueOf: _containerHelpers.valueOf,
  /**
   * @sig
   * @description d
   * @param {*} item - a
   * @return {constant_functor} - b
   */
  of: (0, _containerHelpers.pointMaker)(Constant),
  /**
   * @sig
   * @description d
   * @return {string} - a
   */
  toString: (0, _containerHelpers.stringMaker)('Constant'),
  factory: Constant
};

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
constant_functor.equals = (0, _containerHelpers.equalMaker)(constant_functor);

/**
 * @sig
 * @description Since the constant functor does not represent a disjunction, the Constant's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {constant_functor} - c
 */
constant_functor.bimap = constant_functor.map;

/**
 * @description: sigh.... awesome spec ya got there fantasy-land. Yup, good thing you guys understand
 * JS and aren't treating it like a static, strongly-typed, class-based language with inheritance...
 * cause, ya know... that would be ridiculous if we were going around pretending there is such a thing
 * as constructors in the traditional OOP sense of the word in JS, or that JS has some form of inheritance.
 *
 * What's that? Put a constructor property on a functor that references the function used to create an
 * object that delegates to said functor? Okay.... but why would we call it a 'constructor'? Oh, that's
 * right, you wrote a spec for a language you don't understand rather than trying to understand it and
 * then writing the spec. Apparently your preferred approach is to bury your head in the sand and pretend
 * that JS has classes like the rest of the idiots.
 *
 * Thanks for your contribution to the continual misunderstanding, misapplication, reproach, and frustration
 * of JS developers; thanks for making the world of JavaScript a spec which has become the standard and as
 * such enforces poor practices, poor design, and mental hurdles.
 */
constant_functor.constructor = constant_functor.factory;

exports.Constant = Constant;
exports.constant_functor = constant_functor;

},{"../containerHelpers":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.left_functor = exports.right_functor = exports.Right = exports.Left = exports.Either = undefined;

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {left_functor|right_functor} - b
 */
function fromNullable(x) {
  return null != x ? Right(x) : Left(x);
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @param {string} fork - b
 * @return {left_functor|right_functor} - c
 */
function Either(val, fork) {
  return 'right' === fork ? Object.create(right_functor, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    },
    isRight: {
      value: true
    },
    isLeft: {
      value: false
    }
  }) : Object.create(left_functor, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    },
    isRight: {
      value: false
    },
    isLeft: {
      value: true
    }
  });
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {right_functor} - b
 */
Either.of = function (x) {
  return Either(x, 'right');
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Either.is = function (f) {
  return Left.is(f) || Right.is(f);
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Either.isRight = function (f) {
  return f.isRight;
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Either.isLeft = function (f) {
  return f.isLeft;
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {right_functor} - b
 */
Either.Right = function (x) {
  return Either(x, 'right');
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {left_functor} - b
 */
Either.Left = function (x) {
  return Either(x);
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {left_functor|right_functor} - b
 */
Either.fromNullable = fromNullable;

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {left_functor} - b
 */
function Left(val) {
  return Object.create(left_functor, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    },
    isRight: {
      value: false,
      writable: false,
      configurable: false
    },
    isLeft: {
      value: true,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {left_functor} - b
 */
Left.of = function (x) {
  return Left(x);
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Left.is = function (f) {
  return left_functor.isPrototypeOf(f);
};

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {right_functor} - b
 */
function Right(val) {
  return Object.create(right_functor, {
    _value: {
      value: val,
      writable: false,
      configurable: false
    },
    isRight: {
      value: true,
      writable: false,
      configurable: false
    },
    isLeft: {
      value: false,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @sig
 * @description d
 * @param {Object} x - a
 * @return {boolean} - b
 */
Right.is = function (x) {
  return right_functor.isPrototypeOf(x);
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {right_functor} - b
 */
Right.of = function (x) {
  return Right(x);
};

var right_functor = {
  get value() {
    return this._value;
  },
  /**
   * @description d
   * @param {function|undefined} fn - a
   * @return {right_functor} - b
   */
  map: _containerHelpers.sharedEitherFns.rightMap,
  /**
   * @sig
   * @description d
   * @param {function} f - a
   * @param {function} g - b
   * @return {right_functor} - c
   */
  bimap: _containerHelpers.sharedEitherFns.rightBiMap,
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  get: _containerHelpers.get,
  /**
   * @sig
   * @description d
   * @param {*} x - a
   * @return {*} - b
   */
  getOrElse: _containerHelpers.getOrElse,
  /**
   * @sig
   * @description d
   * @param {function} f - a
   * @return {right_functor} - b
   */
  orElse: _containerHelpers.orElse,
  of: (0, _containerHelpers.pointMaker)(Right),
  valueOf: _containerHelpers.valueOf,
  toString: (0, _containerHelpers.stringMaker)('Right'),
  factory: Either
};

/**
 * @description
 * @return
 */
right_functor.equals = (0, _containerHelpers.disjunctionEqualMaker)(right_functor, 'isRight');

var left_functor = {
  get value() {
    return this._value;
  },
  /**
   * @description d
   * @return {left_functor} - b
   */
  map: _containerHelpers.sharedEitherFns.leftMapMaker(Left),
  /**
   * @sig
   * @description d
   * @param {function} f - a
   * @param {function} g - b
   * @return {left_functor} - c
   */
  bimap: _containerHelpers.sharedEitherFns.leftBimapMaker(Left),
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  get: _containerHelpers.emptyGet,
  /**
   * @sig
   * @description d
   * @param {*} x - a
   * @return {*} - b
   */
  getOrElse: _containerHelpers.emptyGetOrElse,
  /**
   * @sig
   * @description d
   * @param {function} f - a
   * @return {*} - b
   */
  orElse: _containerHelpers.emptyOrElse,
  of: (0, _containerHelpers.pointMaker)(Right),
  valueOf: _containerHelpers.valueOf,
  toString: (0, _containerHelpers.stringMaker)('Left'),
  factory: Either
};

/**
 * @sig
 * @description d
 * @return {boolean} - a
 */
left_functor.equals = (0, _containerHelpers.disjunctionEqualMaker)(left_functor, 'isLeft');

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
right_functor.constructor = right_functor.factory;
left_functor.constructor = left_functor.factory;

exports.Either = Either;
exports.Left = Left;
exports.Right = Right;
exports.right_functor = right_functor;
exports.left_functor = left_functor;

},{"../containerHelpers":2}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.functors = undefined;

var _constant_functor = require('./constant_functor');

var _either_functor = require('./either_functor');

var _future_functor = require('./future_functor');

var _identity_functor = require('./identity_functor');

var _io_functor = require('./io_functor');

var _list_functor = require('./list_functor');

var _maybe_functor = require('./maybe_functor');

var _validation_functor = require('./validation_functor');

var _containerHelpers = require('../containerHelpers');

var _pointlessContainers = require('../../pointlessContainers');

var mapToConstant = (0, _pointlessContainers.toContainerType)(_constant_functor.Constant),
    mapToEither = (0, _pointlessContainers.toContainerType)(_either_functor.Either),
    mapToFuture = (0, _pointlessContainers.toContainerType)(_future_functor.Future),
    mapToIdentity = (0, _pointlessContainers.toContainerType)(_identity_functor.Identity),
    mapToIo = (0, _pointlessContainers.toContainerType)(_io_functor.Io),
    mapToLeft = (0, _pointlessContainers.toContainerType)(_either_functor.Left),
    mapToList = (0, _pointlessContainers.toContainerType)(_list_functor.List),
    mapToMaybe = (0, _pointlessContainers.toContainerType)(_maybe_functor.Maybe),
    mapToRight = (0, _pointlessContainers.toContainerType)(_either_functor.Right),
    mapToValidation = (0, _pointlessContainers.toContainerType)(_validation_functor.Validation);

function toConstant() {
    return this.mapToConstant();
}
function toEither() {
    return this.mapToEither();
}
function toFuture() {
    return this.mapToFuture();
}
function toIdentity() {
    return this.mapToIdentity();
}
function toIo() {
    return this.mapToIo();
}
function toLeft() {
    return this.mapToLeft();
}
function toList() {
    return this.mapToList();
}
function toMaybe() {
    return this.mapToMaybe();
}
function toRight() {
    return this.mapToRight();
}
function toValidation() {
    return this.mapToValidation();
}

//Natural Transformations (nt):
//.fold(f) -> f = functor type factory
//nt(x)mapWith(fn) === nt(x.mapWith(fn))

_constant_functor.constant_functor.mapToEither = mapToEither;
_constant_functor.constant_functor.mapToFuture = mapToFuture;
_constant_functor.constant_functor.mapToIdentity = mapToIdentity;
_constant_functor.constant_functor.mapToIo = mapToIo;
_constant_functor.constant_functor.mapToLeft = mapToLeft;
_constant_functor.constant_functor.mapToList = mapToList;
_constant_functor.constant_functor.mapToMaybe = mapToMaybe;
_constant_functor.constant_functor.mapToRight = mapToRight;
_constant_functor.constant_functor.mapToValidation = mapToValidation;
_constant_functor.constant_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_future_functor.future_functor.mapToConstant = mapToConstant;
_future_functor.future_functor.mapToEither = mapToEither;
_future_functor.future_functor.mapToIdentity = mapToIdentity;
_future_functor.future_functor.mapToIo = mapToIo;
_future_functor.future_functor.mapToLeft = mapToLeft;
_future_functor.future_functor.mapToList = mapToList;
_future_functor.future_functor.mapToMaybe = mapToMaybe;
_future_functor.future_functor.mapToRight = mapToRight;
_future_functor.future_functor.mapToValidation = mapToValidation;
_future_functor.future_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_identity_functor.identity_functor.mapToConstant = mapToConstant;
_identity_functor.identity_functor.mapToEither = mapToEither;
_identity_functor.identity_functor.mapToFuture = mapToFuture;
_identity_functor.identity_functor.mapToIo = mapToIo;
_identity_functor.identity_functor.mapToLeft = mapToLeft;
_identity_functor.identity_functor.mapToList = mapToList;
_identity_functor.identity_functor.mapToMaybe = mapToMaybe;
_identity_functor.identity_functor.mapToRight = mapToRight;
_identity_functor.identity_functor.mapToValidation = mapToValidation;
_identity_functor.identity_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_io_functor.io_functor.mapToConstant = mapToConstant;
_io_functor.io_functor.mapToEither = mapToEither;
_io_functor.io_functor.mapToFuture = mapToFuture;
_io_functor.io_functor.mapToIdentity = mapToIdentity;
_io_functor.io_functor.mapToLeft = mapToLeft;
_io_functor.io_functor.mapToList = mapToList;
_io_functor.io_functor.mapToMaybe = mapToMaybe;
_io_functor.io_functor.mapToRight = mapToRight;
_io_functor.io_functor.mapToValidation = mapToValidation;
_io_functor.io_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_maybe_functor.just_functor.mapToConstant = mapToConstant;
_maybe_functor.just_functor.mapToEither = mapToEither;
_maybe_functor.just_functor.mapToFuture = mapToFuture;
_maybe_functor.just_functor.mapToIdentity = mapToIdentity;
_maybe_functor.just_functor.mapToIo = mapToIo;
_maybe_functor.just_functor.mapToList = mapToList;
_maybe_functor.just_functor.mapToValidation = mapToValidation;
_maybe_functor.just_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_either_functor.left_functor.mapToConstant = mapToConstant;
_either_functor.left_functor.mapToFuture = mapToFuture;
_either_functor.left_functor.mapToIdentity = mapToIdentity;
_either_functor.left_functor.mapToIo = mapToIo;
_either_functor.left_functor.mapToList = mapToList;
_either_functor.left_functor.mapToMaybe = mapToMaybe;
_either_functor.left_functor.mapToValidation = mapToValidation;
_either_functor.left_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_list_functor.list_core.mapToConstant = mapToConstant;
_list_functor.list_core.mapToEither = mapToEither;
_list_functor.list_core.mapToFuture = mapToFuture;
_list_functor.list_core.mapToIdentity = mapToIdentity;
_list_functor.list_core.mapToIo = mapToIo;
_list_functor.list_core.mapToLeft = mapToLeft;
_list_functor.list_core.mapToMaybe = mapToMaybe;
_list_functor.list_core.mapToRight = mapToRight;
_list_functor.list_core.mapToValidation = mapToValidation;

_maybe_functor.nothing_functor.mapToConstant = mapToConstant;
_maybe_functor.nothing_functor.mapToEither = mapToEither;
_maybe_functor.nothing_functor.mapToFuture = mapToFuture;
_maybe_functor.nothing_functor.mapToIdentity = mapToIdentity;
_maybe_functor.nothing_functor.mapToIo = mapToIo;
_maybe_functor.nothing_functor.mapToLeft = mapToLeft;
_maybe_functor.nothing_functor.mapToList = mapToList;
_maybe_functor.nothing_functor.mapToRight = mapToRight;
_maybe_functor.nothing_functor.mapToValidation = mapToValidation;
_maybe_functor.nothing_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_either_functor.right_functor.mapToConstant = mapToConstant;
_either_functor.right_functor.mapToFuture = mapToFuture;
_either_functor.right_functor.mapToIdentity = mapToIdentity;
_either_functor.right_functor.mapToIo = mapToIo;
_either_functor.right_functor.mapToList = mapToList;
_either_functor.right_functor.mapToMaybe = mapToMaybe;
_either_functor.right_functor.mapToValidation = mapToValidation;
_either_functor.right_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_validation_functor.validation_functor.mapToConstant = mapToConstant;
_validation_functor.validation_functor.mapToEither = mapToEither;
_validation_functor.validation_functor.mapToFuture = mapToFuture;
_validation_functor.validation_functor.mapToIdentity = mapToIdentity;
_validation_functor.validation_functor.mapToIo = mapToIo;
_validation_functor.validation_functor.mapToLeft = mapToLeft;
_validation_functor.validation_functor.mapToList = mapToList;
_validation_functor.validation_functor.mapToMaybe = mapToMaybe;
_validation_functor.validation_functor.mapToRight = mapToRight;
_validation_functor.validation_functor[Symbol.iterator] = _pointlessContainers.containerIterator;

_constant_functor.Constant.lift = (0, _containerHelpers.lifter)(_constant_functor.Constant);
_either_functor.Either.lift = (0, _containerHelpers.lifter)(_either_functor.Either);
_future_functor.Future.lift = (0, _containerHelpers.lifter)(_future_functor.Future);
_identity_functor.Identity.lift = (0, _containerHelpers.lifter)(_identity_functor.Identity);
_io_functor.Io.lift = (0, _containerHelpers.lifter)(_io_functor.Io);
_maybe_functor.Just.lift = (0, _containerHelpers.lifter)(_maybe_functor.Just);
_either_functor.Left.lift = (0, _containerHelpers.lifter)(_either_functor.Left);
_list_functor.List.lift = (0, _containerHelpers.lifter)(_list_functor.List);
_maybe_functor.Maybe.lift = (0, _containerHelpers.lifter)(_maybe_functor.Maybe);
_maybe_functor.Nothing.lift = (0, _containerHelpers.lifter)(_maybe_functor.Nothing);
_either_functor.Right.lift = (0, _containerHelpers.lifter)(_either_functor.Right);
_validation_functor.Validation.lift = (0, _containerHelpers.lifter)(_validation_functor.Validation);

var functors = {
    Constant: _constant_functor.Constant,
    Either: _either_functor.Either,
    Future: _future_functor.Future,
    Identity: _identity_functor.Identity,
    Io: _io_functor.Io,
    Just: _maybe_functor.Just,
    Left: _either_functor.Left,
    List: _list_functor.List,
    Maybe: _maybe_functor.Maybe,
    Nothing: _maybe_functor.Nothing,
    Right: _either_functor.Right,
    Validation: _validation_functor.Validation
};

Object.defineProperties(_constant_functor.constant_functor, {
    toEither: {
        get: toEither
    }
});

exports.functors = functors;

},{"../../pointlessContainers":30,"../containerHelpers":2,"./constant_functor":3,"./either_functor":4,"./future_functor":6,"./identity_functor":7,"./io_functor":8,"./list_functor":9,"./maybe_functor":10,"./validation_functor":11}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.future_functor = exports.Future = undefined;

var _functionalHelpers = require('../../functionalHelpers');

var _helpers = require('../../helpers');

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {function} reject - a
 * @param {function} resolve - b
 * @return {function} - c
 */
function safeFork(reject, resolve) {
    return function _safeFork(val) {
        try {
            return resolve(val);
        } catch (ex) {
            reject(ex);
        }
    };
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {future_functor} - b
 */
function Future(fn) {
    return Object.create(future_functor, {
        _value: {
            value: (0, _functionalHelpers.once)(fn),
            writable: false,
            configurable: false
        },
        _fork: {
            value: (0, _functionalHelpers.once)(fn),
            writable: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Future.is = function (f) {
    return future_functor.isPrototypeOf(f);
};

/**
 * @sig
 * @description d
 * @param {function|*} val - a
 * @return {future_functor} - b
 */
Future.of = function (val) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(val)) ? Future(val) : Future(function (_, resolve) {
        return safeFork(_functionalHelpers.noop, resolve(val));
    });
};

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {future_functor} - b
 */
Future.reject = function (val) {
    return Future(function (reject, resolve) {
        return reject(val);
    });
};

/**
 * @sig
 * @description d
 * @param {function} val - a
 * @return {future_functor} - b
 */
Future.unit = function (val) {
    return Future(val).complete();
};

/**
 * @sig
 * @description d
 * @return {future_functor} - a
 */
Future.empty = function () {
    return Future(_functionalHelpers.noop);
};

var future_functor = {
    /**
     * @sig
     * @description d
     * @return {*} - a
     */
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        var _this = this;

        return this.of(function (reject, resolve) {
            return _this.fork(function (a) {
                return reject(a);
            }, function (b) {
                return resolve(fn(b));
            });
        });
    },
    fork: function _fork(reject, resolve) {
        this._fork(reject, resolve);
    },
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && ma.value === this.value;
    },
    of: (0, _containerHelpers.pointMaker)(Future),
    valueOf: _containerHelpers.valueOf,
    toString: function _toString() {
        console.log(this.value, this.value.name, this.value === _functionalHelpers.once);
        return 'Future(' + this.value.name + ')';
    },
    factory: Future
};

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
future_functor.constructor = future_functor.factory;

exports.Future = Future;
exports.future_functor = future_functor;

},{"../../functionalHelpers":26,"../../helpers":27,"../containerHelpers":2}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.identity_functor = exports.Identity = undefined;

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {identity_functor} - b
 */
function Identity(item) {
  return Object.create(identity_functor, {
    _value: {
      value: item,
      writable: false,
      configurable: false
    }
  });
}

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {identity_functor} - b
 */
Identity.of = function (x) {
  return Identity(x);
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Identity.is = function (f) {
  return identity_functor.isPrototypeOf(f);
};

var identity_functor = {
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  get value() {
    return this._value;
  },
  /**
   * @sig
   * @description d
   * @param {function} fn - a
   * @return {identity_functor} - b
   */
  map: function _map(fn) {
    return this.of(fn(this.value));
  },
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  get: _containerHelpers.get,
  /**
   * @sig
   * @description d
   * @param {function} f - a
   * @return {*} - b
   */
  orElse: _containerHelpers.orElse,
  /**
   * @sig
   * @description d
   * @param {*} x - a
   * @return {*} - b
   */
  getOrElse: _containerHelpers.getOrElse,
  /**
   * @sig
   * @description d
   * @param {*} item - a
   * @return {identity_functor} - b
   */
  of: (0, _containerHelpers.pointMaker)(Identity),
  /**
   * @sig
   * @description d
   * @return {*} - a
   */
  valueOf: _containerHelpers.valueOf,
  /**
   * @sig
   * @description d
   * @return {string} - a
   */
  toString: (0, _containerHelpers.stringMaker)('Identity'),
  /**
   * @sig
   * @description d
   * @return {Identity} - a
   */
  factory: Identity
};

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
identity_functor.equals = (0, _containerHelpers.equalMaker)(identity_functor);

/**
 * @sig
 * @description Since the constant functor does not represent a disjunction, the Identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {identity_functor} - c
 */
identity_functor.bimap = identity_functor.map;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "you're too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
identity_functor.constructor = identity_functor.factory;

exports.Identity = Identity;
exports.identity_functor = identity_functor;

},{"../containerHelpers":2}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.io_functor = exports.Io = undefined;

var _combinators = require('../../combinators');

var _functionalHelpers = require('../../functionalHelpers');

var _helpers = require('../../helpers');

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {function} item - a
 * @return {io_functor} - b
 */
function Io(item) {
    return Object.create(io_functor, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        },
        run: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {function|*} item - a
 * @return {io_functor} - b
 */
Io.of = function (item) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(item)) ? Io(item) : Io((0, _combinators.constant)(item));
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Io.is = function (f) {
    return io_functor.isPrototypeOf(f);
};

/**
* @description d
* @typedef {Object}
*/
var io_functor = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.chain(function (a) {
            return Io.of(fn(a));
        });
    },
    runIo: function _runIo() {
        return this.run.apply(this, arguments);
    },
    of: (0, _containerHelpers.pointMaker)(Io),
    valueOf: _containerHelpers.valueOf,
    toString: (0, _containerHelpers.stringMaker)('Io'),
    factory: Io
};

/**
 * @description:
 * @return:
 */
io_functor.equals = (0, _containerHelpers.equalMaker)(io_functor);

/**
 * @description: Since the constant functor does not represent a disjunction, the Io's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type: {{function}}
 * @param: {function} f
 * @param: {function} g
 * @return: {@see io_functor}
 */
io_functor.bimap = io_functor.map;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
io_functor.constructor = io_functor.factory;

exports.Io = Io;
exports.io_functor = io_functor;

},{"../../combinators":1,"../../functionalHelpers":26,"../../helpers":27,"../containerHelpers":2}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ordered_list_functor = exports.list_functor = exports.list_core = exports.List = undefined;

var _list_iterators = require('../list_iterators');

var _helpers = require('../../helpers');

var _functionalHelpers = require('../../functionalHelpers');

var _combinators = require('../../combinators');

var _decorators = require('../../decorators');

var _list_helpers = require('../list_helpers');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @description: Object that contains the core functionality of a List; both the m_list and ordered_m_list
 * objects delegate to this object for all functionality besides orderBy/orderByDescending
 * and thenBy/thenByDescending respectively. Getter/setters are present for state-manipulation
 * at the consumer-object level, as well as to provide default values for a consumer-level
 * object at creation if not specified.
 * @typedef {Object}
 * @property {function} value
 * @property {function} append
 * @property {function} copyWithin
 * @property {function} concat
 * @property {function} distinct
 * @property {function} except
 * @property {function} fill
 * @property {function} filter
 * @property {function} groupBy
 * @property {function} groupByDescending
 * @property {function} groupJoin
 * @property {function} intersect
 * @property {function} intersperse
 * @property {function} join
 * @property {function} map
 * @property {function} ofType
 * @property {function} prepend
 * @property {function} reverse
 * @property {function} skip
 * @property {function} skipWhile
 * @property {function} take
 * @property {function} takeWhile
 * @property {function} union
 * @property {function} zip
 * @property {function} all
 * @property {function} any
 * @property {function} contains
 * @property {function} count
 * @property {function} equals
 * @property {function} findIndex
 * @property {function} findLastIndex
 * @property {function} first
 * @property {function} foldLeft
 * @property {function} foldr
 * @property {function} isEmpty
 * @property {function} last
 * @property {function} reduceRight
 * @property {function} toArray
 * @property {function} toEvaluatedList
 * @property {function} toMap
 * @property {function} toSet
 * @property {function} toString
 * @property {function} valueOf
 * @property {function} factory
 * @property {function} of
 * @property {Symbol.iterator}
 */
var list_core = _defineProperty({
    //Using getters for these properties because there's a chance the setting and/or getting
    //functionality could change; this will allow for a consistent interface while the
    //logic beneath changes
    /**
     * @sig
     * @description Getter for the underlying source object of the List
     * @return {*} - a
     */
    get value() {
        return this._value;
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {number} index - a
     * @param {number} start - b
     * @param {number} end - c
     * @return {list_functor} - d
     */
    copyWithin: function _copyWithin(index, start, end) {
        return this.of(this, (0, _list_iterators.copyWithin)(index, start, end, this));
    },

    /**
     * @sig
     * @description Concatenates two or more lists by appending the "method's" List argument(s) to the
     * List's value. This function is a deferred execution call that returns
     * a new queryable object delegator instance that contains all the requisite
     * information on how to perform the operation.
     * @protected
     * @param {Array | *} ys - a
     * @return {list_functor} - b
     */
    concat: function _concat() {
        for (var _len = arguments.length, ys = Array(_len), _key = 0; _key < _len; _key++) {
            ys[_key] = arguments[_key];
        }

        return this.of(this, (0, _list_iterators.concat)(this, ys, ys.length));
    },

    /**
     * @sig (a -> boolean) -> List<b>
     * @description d
     * @protected
     * @param {function} comparer - a
     * @return {list_functor} - b
     */
    distinct: function _distinct(comparer) {
        return this.of(this, (0, _list_iterators.distinct)(this, comparer));
    },

    /**
     * @sig
     * @description Produces a List that contains the objectSet difference between the queryable object
     * and the List that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * equality comparer.
     * @protected
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    except: function _except(xs, comparer) {
        return this.of(this, (0, _list_iterators.except)(this, xs, comparer));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {number} value - a
     * @param {number} start - b
     * @param {number} end - c
     * @return {list_functor} - d
     */
    fill: function _fill(value, start, end) {
        return this.of(this, (0, _list_iterators.fill)(value, start, end, this));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {list_functor} - b
     */
    filter: function _filter(predicate) {
        return this.of(this, (0, _list_iterators.filter)(this, predicate));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.ascending }];
        return this.of(this, (0, _list_iterators.groupBy)(this, groupObj, createGroupedListDelegate));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    groupByDescending: function _groupByDescending(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.descending }];
        return this.of(this, (0, _list_iterators.groupBy)(this, groupObj, createGroupedListDelegate));
    },

    /**
     * @sig
     * @description Correlates the items in two lists based on the equality of a key and groups
     * all items that share the same key. A comparer function may be provided to
     * the function that determines the equality/inequality of the items in each
     * List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @protected
     * @param {list_core | Array} ys - a
     * @param {function} xSelector - b
     * @param {function} ySelector - c
     * @param {function} projector - d
     * @param {function} comparer - e
     * @return {list_functor} - f
     */
    groupJoin: function _groupJoin(ys, xSelector, ySelector, projector, comparer) {
        return this.of(this, (0, _list_iterators.groupJoin)(this, ys, xSelector, ySelector, projector, createGroupedListDelegate, comparer));
    },

    /**
     * @sig
     * @description Produces the objectSet intersection of the List object's value and the List
     * that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @protected
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    intersect: function _intersect(xs, comparer) {
        return this.of(this, (0, _list_iterators.intersect)(this, xs, comparer));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {*} val - a
     * @return {list_functor} - b
     */
    intersperse: function _intersperse(val) {
        return this.of(this, (0, _list_iterators.intersperse)(this, val));
    },

    /**
     * @sig
     * @description Correlates the items in two lists based on the equality of items in each
     * List. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @protected
     * @param {Array|List} ys - a
     * @param {function} xSelector - b
     * @param {function} ySelector - c
     * @param {function} projector - d
     * @param {function} comparer - e
     * @return {list_functor} - f
     */
    join: function _join(ys, xSelector, ySelector, projector, comparer) {
        return this.of(this, (0, _list_iterators.join)(this, ys, xSelector, ySelector, projector, comparer));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} mapFunc - a
     * @return {list_functor} - b
     */
    map: function _map(mapFunc) {
        return this.of(this, (0, _list_iterators.map)(this, mapFunc));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {string|Object} type - a
     * @returns {list_functor} - b
     */
    ofType: function _ofType(type) {
        return this.of(this, (0, _list_iterators.ofType)(this, type));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {Array|generator} xs - a
     * @return {list_functor} - b
     */
    prepend: function _prepend(xs) {
        return this.of(this, (0, _list_iterators.prepend)(this, xs));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {list_functor} - a
     */
    reverse: function _reverse() {
        return this.of(this, (0, _list_iterators.reverse)(this));
    },

    /**
     * @sig
     * @description Skips over a specified number of items in the source and returns the
     * remaining items. If no amount is specified, an empty list_functor is returned;
     * Otherwise, a list_functor containing the items collected from the source is
     * returned.
     * @protected
     * @param {number} amt - The number of items in the source to skip before
     * returning the remainder.
     * @return {list_functor} - a
     */
    skip: function _skip(amt) {
        return this.skipWhile((0, _list_helpers.taker_skipper)(amt));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {list_functor} - b
     */
    skipWhile: function _skipWhile() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return this.of(this, (0, _list_iterators.skipWhile)(this, predicate));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {number} amt - a
     * @return {list_functor} - b
     */
    take: function _take(amt) {
        return this.takeWhile((0, _list_helpers.taker_skipper)(amt));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {list_functor} - b
     */
    takeWhile: function _takeWhile() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return this.of(this, (0, _list_iterators.takeWhile)(this, predicate));
    },

    /**
     * @sig
     * @description Produces the objectSet union of two lists by selecting each unique item in both
     * lists. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @protected
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {list_functor} - c
     */
    union: function _union(xs, comparer) {
        return this.of(this, (0, _list_iterators.union)(this, xs, comparer));
    },

    /**
     * @sig
     * @description Produces a List of the items in the queryable object and the List passed as
     * a function argument. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @protected
     * @param {function} selector - a
     * @param {Array|generator} xs - b
     * @return {list_functor} - c
     */
    zip: function _zip(selector, xs) {
        return this.of(this, (0, _list_iterators.zip)(this, xs, selector));
    },

    /**
     * @sig (a -> Boolean) -> [a] -> Boolean
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {boolean} - b
     */
    all: function _all() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return (0, _list_iterators.all)(this, predicate);
    },

    /**
     * @sig: (a -> Boolean) -> [a] -> Boolean
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {boolean} - b
     */
    any: function _any() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return (0, _list_iterators.any)(this, predicate);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {Number} -  b
     */
    count: function _count(predicate) {
        return (0, _list_iterators.count)(this, predicate);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {list_core} f - a
     * @param {function} comparer - b
     * @return {boolean} - c
     */
    equals: function _equals(f, comparer) {
        return Object.getPrototypeOf(this).isPrototypeOf(f) && (0, _list_iterators.equals)(this, f, comparer);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} comparer - a
     * @return {Number} - b
     */
    findIndex: function _findIndex(comparer) {
        return (0, _list_iterators.findIndex)(this, comparer);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} comparer - a
     * @return {Number} - b
     */
    findLastIndex: function _findLastIndex(comparer) {
        return (0, _list_iterators.findLastIndex)(this, comparer);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {*} - b
     */
    first: function _first() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return (0, _list_iterators.first)(this, predicate);
    },

    /**
     * @sig (a -> b -> c) -> a -> [b] -> a
     * @description d
     * @protected
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    foldl: function _foldl(fn, acc) {
        return (0, _list_iterators.foldLeft)(this, fn, acc);
    },

    /**
     * @sig (a -> a -> a) -> [a] -> a
     * @description d
     * @protected
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    foldr: function _foldr(fn, acc) {
        return (0, _list_iterators.foldRight)(this, fn, acc);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {boolean} - a
     */
    isEmpty: function _isEmpty() {
        return 0 === this.data.length;
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} predicate - a
     * @return {*} - b
     */
    last: function _last() {
        var predicate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _functionalHelpers.defaultPredicate;

        return (0, _list_iterators.last)(this, predicate);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    reduceRight: function _reduceRight(fn, acc) {
        return (0, _list_iterators.reduceRight)(this, fn, acc);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {Array} - a
     */
    toArray: function _toArray() {
        return Array.from(this);
    },

    /**
     * @sig
     * @description Evaluates the current List instance and returns a new List
     * instance with the evaluated data as its source. This is used when the
     * initial List's data must be iterated more than once as it will cause
     * the evaluation to happen each item it is iterated. Rather the pulling the
     * initial data through the List's 'pipeline' every time, this property will
     * allow you to evaluate the List's data and store it in a new List that can
     * be iterated many times without needing to re-evaluate. It is effectively
     * a syntactical shortcut for: List.from(listInstance.data)
     * @protected
     * @return {list_functor} - a
     */
    toEvaluatedList: function _toEvaluatedList() {
        return List.from(this.data /* the .data property is a getter function that forces evaluation */);
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {Map} - a
     */
    toMap: function _toMap() {
        return new Map(this.data.map(function _map(val, idx) {
            return [idx, val];
        }));
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {Set} - a
     */
    toSet: function _toSet() {
        return new Set(this);
    },

    /**
     * @sig
     * @description Returns a string representation of an instance of a List
     * delegator object. This function does not cause evaluation of the source,
     * but this also means the returned value only reflects the underlying
     * data, not the evaluated data.
     * @protected
     * @return {string} - a
     */
    toString: function _toString() {
        //console.log(this.value);
        //console.log(list_core.isPrototypeOf(this.value), this.value.toString(), this.value);

        /*if (list_core.isPrototypeOf(this.value) || (Array.isArray(this.value) && this.value.length === 5)) {
            console.log(list_core.isPrototypeOf(this.value));
            console.log(this);
            console.log(this.value);
              if (list_core.isPrototypeOf(this.value)) {
                console.log(this.value.toString());
            }
        }*/
        var val = list_core.isPrototypeOf(this.value) ? this.value.toString() : this.value;
        return 'List(' + val + ')';
        //return list_core.isPrototypeOf(this.value) ? this.value.toString() : `List(${this.value})`;
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {*} - a
     */
    valueOf: function _valueOf() {
        return this.value;
    },

    /**
     * @sig
     * @description d
     * @protected
     * @return {list_functor} - a
     */
    factory: List,

    /**
     * @sig
     * @description d
     * @protected
     * @param {*} xs - a
     * @param {generator} [iterator] - b
     * @param {Array} [sortObj] - c
     * @param {string} [key] - d
     * @return {list_functor} - e
     */
    of: function _of(xs, iterator, sortObj, key) {
        return createListDelegateInstance(xs, iterator, sortObj, key);
    }

}, Symbol.iterator, regeneratorRuntime.mark(function _iterator() {
    var data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator2, _step, item;

    return regeneratorRuntime.wrap(function _iterator$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    data = Array.from(this.value);
                    _iteratorNormalCompletion = true;
                    _didIteratorError = false;
                    _iteratorError = undefined;
                    _context.prev = 4;
                    _iterator2 = data[Symbol.iterator]();

                case 6:
                    if (_iteratorNormalCompletion = (_step = _iterator2.next()).done) {
                        _context.next = 13;
                        break;
                    }

                    item = _step.value;
                    _context.next = 10;
                    return item;

                case 10:
                    _iteratorNormalCompletion = true;
                    _context.next = 6;
                    break;

                case 13:
                    _context.next = 19;
                    break;

                case 15:
                    _context.prev = 15;
                    _context.t0 = _context['catch'](4);
                    _didIteratorError = true;
                    _iteratorError = _context.t0;

                case 19:
                    _context.prev = 19;
                    _context.prev = 20;

                    if (!_iteratorNormalCompletion && _iterator2.return) {
                        _iterator2.return();
                    }

                case 22:
                    _context.prev = 22;

                    if (!_didIteratorError) {
                        _context.next = 25;
                        break;
                    }

                    throw _iteratorError;

                case 25:
                    return _context.finish(22);

                case 26:
                    return _context.finish(19);

                case 27:
                case 'end':
                    return _context.stop();
            }
        }
    }, _iterator, this, [[4, 15, 19, 27], [20,, 22, 26]]);
}));

list_core.append = list_core.concat;

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the list_core object, also exposes .orderBy and .orderByDescending
 * functions. These functions allow a consumer to sort a List's data by
 * a given key.
 * @typedef {Object}
 * @property {function} sortBy
 * @property {function} sortByDescending
 * @property {function} contains
 */
var list_functor = Object.create(list_core, {
    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list_functor} - c
     */
    sortBy: {
        value: function _orderBy(keySelector) {
            var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.defaultPredicate;

            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.ascending }];
            return this.of(this, (0, _list_iterators.sortBy)(this, sortObj), sortObj);
        }
    },
    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list_functor} - c
     */
    sortByDescending: {
        value: function _orderByDescending(keySelector) {
            var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.defaultPredicate;

            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.descending }];
            return this.of(this, (0, _list_iterators.sortBy)(this, sortObj), sortObj);
        }
    },
    /**
     * @sig
     * @description d
     * @protected
     * @param {*} val - a
     * @param {function} comparer - b
     * @return {boolean} - c
     */
    contains: {
        value: function _contains(val, comparer) {
            return (0, _list_iterators.contains)(this, val, comparer);
        }
    }
});

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the queryable_core object, also exposes .thenBy and .thenByDescending
 * functions. These functions allow a consumer to sort more on than a single column.
 * @typedef {Object}
 * @property {function} sortBy
 * @property {function} sortByDescending
 * @property {function} contains
 */
var ordered_list_functor = Object.create(list_core, {
    _appliedSorts: {
        value: []
    },
    //In these two functions, feeding the call to "orderBy" with the .value property of the List delegate
    //rather than the delegate itself, effectively excludes the previous call to the orderBy/orderByDescending
    //since the iterator exists on the delegate, not on its value. Each subsequent call to thenBy/thenByDescending
    //will continue to exclude the previous call's iterator... effectively what we're doing is ignoring all the
    //prior calls made to orderBy/orderByDescending/thenBy/thenByDescending and calling it once but with an array
    //of the the requested sorts.
    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list_functor} - c
     */
    thenBy: {
        value: function _thenBy(keySelector) {
            var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.defaultPredicate;

            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.ascending });
            return this.of(this.value, (0, _list_iterators.sortBy)(this, sortObj), sortObj);
        }
    },
    /**
     * @sig
     * @description d
     * @protected
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list_functor} - c
     */
    thenByDescending: {
        value: function thenByDescending(keySelector) {
            var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.defaultPredicate;

            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.descending });
            return this.of(this.value, (0, _list_iterators.sortBy)(this, sortObj), sortObj);
        }
    },
    /**
     * @sig
     * @description Performs the same functionality as list_core#contains, but utilizes
     * a binary searching algorithm rather than a sequential search. If this function is called
     * an a non-ordered List, it will internally delegate to list_core#contains instead. This
     * function should not be called on a sorted List for look for a value that is not the
     * primary field on which the List's data is sorted on as an incorrect result will likely
     * be returned.
     * @protected
     * @param {*} val - The value that should be searched for
     * @param {function} comparer - The function used to compare values in the List to
     * the 'val' parameter
     * @return {boolean} - Returns true if the List contains the searched for value, false
     * otherwise.
     */
    contains: {
        value: function _contains(val, comparer) {
            return (0, _list_iterators.binarySearch)((0, _combinators.when)((0, _decorators.not)(_functionalHelpers.isArray), Array.from, this.value), val, comparer);
        }
    }
});

//TODO: monad
//TODO: functor
//TODO: monoid
//TODO: semigroup
//TODO: decorator
//TODO: combinator
//TODO: transducer
//TODO: JunctionalS
//TODO: JunctorS
//TODO: lanoitcunf
//TODO: rotcnuf
//TODO: danom
//TODO: dionom
//TODO: puorgimes
//TODO: rotaroced
//TODO: rotanibmoc
//TODO: recudsnart
//TODO: tpircSavaJ
//TODO: Junctional FavaScript
//TODO: Algebraic Data Structures
//TODO: ADS

//TODO: JavaScript
//TODO: JS
//TODO: EcmaScript
//TODO: es-20FP
//TODO: functional
//TODO: functional programming
//TODO: FP
//TODO: Lambda
//TODO: Lambda calculus
//TODO: category theory
//TODO: higher order (functions)
//TODO: first class functions
//TODO: lazy (evaluation)
//TODO: deferred execution
//TODO: pure
//TODO: composable
//TODO: referential transparency
//TODO: pointfree/pointless

//TODO: Pointfree Functional programming - PF-FP
//TODO: pointfree-js pfjs

//TODO: Algebraic JavaScript - AJS
//TODO: Functional JavaScript - FJS
//TODO: Deferred Laziness
//TODO: First-class Laziness
//TODO: Algebraic Laziness

/**
 * @sig
 * @description Creates a new list_functor object delegate instance; list_functor type is determined by
 * the parameters passed to the function. If only the 'source' parameter is provided, a
 * 'basic' list_functor delegate object instance is created. If the source and iterator parameters
 * are passed as arguments, a 'basic' list_functor delegate object instance is created and the
 * iterator provided is used as the new instance object's iterator rather than the default
 * list_functor iterator. If the source, iterator, and sortObj parameters are passed as arguments,
 * an ordered_list_functor delegate object instance is created. The provided iterator is set on
 * the instance object to be used in lieu of the default iterator and the ._appliedSorts
 * field is set as the 'sortObj' parameter. If all four of the function's arguments are
 * provided (source, iterator, sortObj, and key), then a list_functor delegate object instance
 * is created, setting the iterator for the object instance as the provided iterator, the
 * ._appliedSorts field as the sortObj argument, and the ._key field as the 'key' parameter's
 * value.
 *
 * The switch case inside the function only handles a subset of the possible bit flag values.
 * Technically there could be as many as eight different scenarios to check, not including the
 * default case. However, in practice, the only values received from the 'createBitMask' function
 * will be odd. Thus, only odd values (plus the default case which covers a value of zero) need
 * to be handled. A case of zero arises when only the 'source' argument is provided.
 *
 * @param {*} source - The value to be used as the underlying source of the list_functor functor; may be
 * anything javascript object that has an iterator.
 * @param {generator} iterator - A generator function that is to be used on the new list_functor delegate
 * object instance's iterator.
 * @param {Array} sortObj - An array of the sort(s) (field and direction} to be used when the
 * instance is evaluated.
 * @param {string} key - A string that denotes what value the new list_functor delegate object instance
 * was grouped on.
 * @return {list_core}
 */
var createListDelegateInstance = (0, _list_helpers.createListCreator)(list_functor, ordered_list_functor, list_functor);

/**
 * @sig
 * @description d
 * @param {*} source - a
 * @return {list_functor} - b
 */
var listFromNonGen = function listFromNonGen(source) {
    return createListDelegateInstance(source && source[Symbol.iterator] ? source : (0, _functionalHelpers.wrap)(source));
};

/**
 * @sig
 * @description d
 * @param {generator} source - a
 * @return {list_functor} - b
 */
var listFromGen = function listFromGen(source) {
    return createListDelegateInstance((0, _functionalHelpers.invoke)(source));
};

/**
 * @sig
 * @description Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @param {*} source - Any type, any value; used as the underlying source of the List
 * @return {list_functor} - A new List instance with the value provided as the underlying source.
 */
//TODO: should I exclude strings from being used as a source directly, or allow it because
//TODO: they have an iterator?
function List(source) {
    return (0, _combinators.ifElse)((0, _functionalHelpers.delegatesFrom)(_helpers.generatorProto), listFromGen, listFromNonGen, source);
}

/**
 * @sig
 * @description Convenience function for listCreate a new List instance; internally calls List.
 * @static
 * @see List
 * @param {*} source - Any type, any value; used as the underlying source of the List
 * @return {list_functor} - A new List instance with the value provided as the underlying source.
 */
List.from = function (source) {
    return List(source);
};

/**
 * @sig
 * @description Alias for List.from
 * @static
 * @see List.from
 * @param {*}
 * @return {list_functor} - a
 */
List.of = List.from;

//TODO: implement this so that a consumer can initiate a List as ordered
List.ordered = function (source, selector) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.defaultPredicate;
    return createListDelegateInstance(source, null, [{ keySelector: selector, comparer: comparer, direction: _helpers.sortDirection.ascending }]);
};

/**
 * @sig
 * @description d
 * @static
 * @see List
 * @return {list_functor} - a
 */
List.empty = function () {
    return createListDelegateInstance([], null, [{ keySelector: _combinators.identity, comparer: _functionalHelpers.defaultPredicate, direction: _helpers.sortDirection.ascending }]);
};

/**
 * @sig
 * @description d
 * @static
 * @see List
 * @param {*} val - a
 * @return {list_functor} - b
 */
List.just = function (val) {
    return createListDelegateInstance([val], null, [{ keySelector: _combinators.identity, comparer: _functionalHelpers.defaultPredicate, direction: _helpers.sortDirection.ascending }]);
};

/**
 * @sig
 * @description d
 * @static
 * @see List
 * @param {function|generator} fn - a
 * @param {*} seed - b
 * @return {list_functor} - c
 */
List.unfold = function (fn, seed) {
    return createListDelegateInstance((0, _list_iterators.unfold)(fn)(seed));
};

/**
 * @sig
 * @description d
 * @static
 * @see List
 * @param {*} f - a
 * @return {boolean} - b
 */
List.is = function (f) {
    return list_core.isPrototypeOf(f);
};

/**
 * @sig
 * @description Generates a new list with the specified item repeated the specified number of times. Because
 * this generates a list with the same item repeated n times, the resulting List is trivially
 * sorted. Thus, a sorted List is returned rather than an unsorted list.
 * @static
 * @see List
 * @param {*} item - a
 * @param {number} count - b
 * @return {ordered_list_functor} - c
 */
List.repeat = function _repeat(item, count) {
    return createListDelegateInstance([], (0, _list_iterators.repeat)(item, count), [{ keySelector: _functionalHelpers.noop, comparer: _functionalHelpers.noop, direction: _helpers.sortDirection.descending }]);
};

/**
 * @sig
 * @summary Extension function that allows new functionality to be applied to
 * the queryable object
 * @static
 * @see List
 * @param {string} prop - The name of the new property that should exist on the List; must be unique
 * @param {function} fn - A function that defines the new List functionality and
 * will be called when this new List property is invoked.
 * @return {List} - a
 *
 * @description The fn parameter must be a non-generator function that takes one or more
 * arguments. If this new List function should be an immediately evaluated
 * function (like: foldl, any, reverse, etc.), it merely needs the accept one or more
 * arguments and know how to iterate the source. In the case of an immediately evaluated
 * function, the return type can be any javascript type. The first argument is always the
 * previous List instance that must be iterated. Additional arguments may be specified
 * if desired.
 *
 * If the function's evaluation should be deferred it needs to work a bit differently.
 * In this case, the function should accept one or more arguments, the first and only
 * required argument being the underlying source of the List object. This underlying
 * source can be anything with an iterator (generator, array, map, set, another list, etc.).
 * Any additional arguments that the function needs should be specified in the signature.
 * The return value of the function should be a generator that knows how to iterate the
 * underlying source. If the generator should operate like most List functions, i.e.
 * take a single item, process it, and then yield it out before asking for the next, a
 * for-of loop is the preferred method for employment. However, if the generator needs
 * all of the underlying data upfront (like orderBy and groupBy), Array.from is the
 * preferred method. Array.from will 'force' all the underlying List instances
 * to evaluate their data before it is handed over in full to the generator. The generator
 * can then act with full knowledge of the data and perform whatever operation is needed
 * before ultimately yielding out a single item at a time. If your extension function
 * needs to yield out all items at once, then that function is not a lazy evaluation
 * function and should be constructed like the immediately evaluated functions described
 * above.
 */
List.extend = function _extend(prop, fn) {
    if (!(prop in list_functor) && !(prop in ordered_list_functor)) {
        list_core[prop] = function _extension() {
            for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
            }

            return createListDelegateInstance(this, fn.apply(undefined, [this].concat(args)));
        };
    }
    return List;
};

function createGroupedListDelegate(source, key) {
    return createListDelegateInstance(source, undefined, undefined, key);
}

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
list_core.constructor = list_core.factory;
list_core.fold = list_core.foldl;
list_core.reduce = list_core.foldl;

/**
 * @sig
 * @description Since the constant functor does not represent a disjunction, the List's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @protected
 * @param {function} f - a
 * @param {function} g - b
 * @return {list_core} - c
 */
list_core.bimap = list_core.map;

exports.List = List;
exports.list_core = list_core;
exports.list_functor = list_functor;
exports.ordered_list_functor = ordered_list_functor;

},{"../../combinators":1,"../../decorators":24,"../../functionalHelpers":26,"../../helpers":27,"../list_helpers":12,"../list_iterators":13}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nothing_functor = exports.just_functor = exports.Nothing = exports.Just = exports.Maybe = undefined;

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {just_functor|nothing_functor} - b
 */
function fromNullable(x) {
    return null != x ? Just(x) : Nothing();
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor|nothing_functor} - b
 */
function Maybe(val) {
    return null == val ? Object.create(nothing_functor, {
        _value: {
            value: null
        },
        isJust: {
            value: false
        },
        isNothing: {
            value: true
        }
    }) : Object.create(just_functor, {
        _value: {
            value: val
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor} - b
 */
Maybe.of = function _of(val) {
    return Object.create(just_functor, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Maybe.is = function (f) {
    return just_functor.isPrototypeOf(f) || nothing_functor.isPrototypeOf(f);
};

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor} - b
 */
Maybe.Just = Maybe.of;

/**
 * @sig
 * @description d
 * @return {nothing_functor} - a
 */
Maybe.Nothing = function () {
    return Maybe();
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Maybe.isJust = function (m) {
    return just_functor.isPrototypeOf(m);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Maybe.isNothing = function (m) {
    return nothing_functor.isPrototypeOf(m);
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {just_functor|nothing_functor} - b
 */
Maybe.fromNullable = fromNullable;

//TODO: determine if there is any purpose in splitting a maybe into two types... if those sub-types
//TODO: are not exposed, what benefit is derived from them? And if they are exposed (Just being Identity,
//TODO: and Nothing being Constant(null)), then the maybe container has a direct dependency on the Identity
//TODO: and Constant containers. This becomes an issue due to circular dependencies.
/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor} - b
 */
function Just(val) {
    return Object.create(just_functor, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor} - b
 */
Just.of = function _of(val) {
    return Object.create(just_functor, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Just.is = function (f) {
    return just_functor.isPrototypeOf(f);
};

/**
 * @sig
 * @description d
 * @return {nothing_functor} - a
 */
function Nothing() {
    return Object.create(nothing_functor, {
        _value: {
            value: null,
            writable: false,
            configurable: false
        },
        isJust: {
            value: false
        },
        isNothing: {
            value: true
        }
    });
}

/**
 * @sig
 * @description d
 * @return {nothing_functor} - a
 */
Nothing.of = Nothing;

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Nothing.is = function (f) {
    return nothing_functor.isPrototypeOf(f);
};

//TODO: Using this.of in order to create a new instance of a Maybe container (functor/monad) will
//TODO: not work as it is implemented here in terms of creating a new maybe container with the
//TODO: proper values for the '.isJust' and '.isNothing' fields. The problem is that the '.of'
//TODO: function property will create a new maybe instance with whatever value it receives as
//TODO: as argument and treat the new maybe container instance as a 'Just', regardless of the
//TODO: actual underlying value. As 'null' and 'undefined' underlying values are traditionally
//TODO: treated as 'Nothing' maybe values, this will cause a problem during mapping/flat-mapping/etc.

var just_functor = {
    get value() {
        return this._value;
    },
    map: _containerHelpers.sharedMaybeFns.justMap,
    bimap: _containerHelpers.sharedMaybeFns.justBimap,
    get: _containerHelpers.get,
    getOrElse: _containerHelpers.getOrElse,
    orElse: _containerHelpers.orElse,
    of: (0, _containerHelpers.pointMaker)(Just),
    valueOf: _containerHelpers.valueOf,
    toString: (0, _containerHelpers.stringMaker)('Just'),
    factory: Maybe
};

/**
 * @description:
 * @return:
 */
just_functor.equals = (0, _containerHelpers.disjunctionEqualMaker)(just_functor, 'isJust');

var nothing_functor = {
    get value() {
        return this._value;
    },
    map: _containerHelpers.sharedMaybeFns.nothingMapMaker(Nothing),
    bimap: _containerHelpers.sharedMaybeFns.nothingBimapMaker(Nothing),
    get: _containerHelpers.emptyGet,
    getOrElse: _containerHelpers.emptyGetOrElse,
    orElse: _containerHelpers.emptyOrElse,
    of: (0, _containerHelpers.pointMaker)(Just),
    valueOf: _containerHelpers.valueOf,
    toString: function _toString() {
        return 'Nothing()';
    },
    factory: Maybe
};

/**
 * @description:
 * @return:
 */
nothing_functor.equals = (0, _containerHelpers.disjunctionEqualMaker)(nothing_functor, 'isNothing');

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
//maybe_functor.constructor = maybe_functor.factory;
just_functor.constructor = just_functor.factory;
nothing_functor.constructor = nothing_functor.factory;

exports.Maybe = Maybe;
exports.Just = Just;
exports.Nothing = Nothing;
exports.just_functor = just_functor;
exports.nothing_functor = nothing_functor;

},{"../containerHelpers":2}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validation_functor = exports.Validation = undefined;

var _containerHelpers = require('../containerHelpers');

function Validation(val) {
    return Object.create(validation_functor, {
        _value: {
            value: val
        }
    });
}

Validation.of = function _of(val) {
    return Validation(val);
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Validation.is = function (f) {
    return validation_functor.isPrototypeOf(f);
};

var validation_functor = {
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    of: (0, _containerHelpers.pointMaker)(Validation),
    valueOf: _containerHelpers.valueOf,
    toString: (0, _containerHelpers.stringMaker)('Validation'),
    factory: Validation
};

/**
 * @sig
 * @description d
 * @return {boolean} - a
 */
validation_functor.equals = (0, _containerHelpers.equalMaker)(validation_functor);

/**
 * @sig
 * @description Since the constant functor does not represent a disjunction, the Validation's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {validation_functor} - c
 */
validation_functor.bimap = validation_functor.map;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
validation_functor.constructor = validation_functor.factory;

exports.Validation = Validation;
exports.validation_functor = validation_functor;

},{"../containerHelpers":2}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.taker_skipper = exports.createListCreator = undefined;

var _functionalHelpers = require('../functionalHelpers');

var _helpers = require('../helpers');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @sig
 * @description This factory producing function is used by both the list functor and the
 * list monad when creating a new list object. Based on the parameters passed, the factory
 * function will create a new object that delegates to the appropriate type with whatever
 * additional fields it needs, i.e. ._value, .data, [Symbol.iterator], etc.
 * @param {object} baseListType - a
 * @param {object} sortedListType - b
 * @param {object} groupedListType - c
 * @return {function} - d
 */
function createListCreator(baseListType, sortedListType, groupedListType) {
    return function createListDelegateInstance(source, iterator, sortObj, key) {
        switch (createBitMask((0, _functionalHelpers.delegatesTo)(iterator, _helpers.generatorProto), (0, _functionalHelpers.isArray)(sortObj), (0, _functionalHelpers.isString)(key))) {
            /**
             * @description: case 1 = An iterator has been passed, but nothing else. Create a
             * basic list type object instance and set the iterator as the version provided.
             */
            case 1:
                return Object.create(baseListType, _defineProperty({
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    }
                }, Symbol.iterator, {
                    value: iterator
                }));
            /**
             * @description: case 2 = Only a sort object was passed in. The list is presumed to be either
             * trivially sorted via List.just or List.empty, or was initialized as an ordered list. Create
             * an ordered list type object instance, setting the _appliedSorts field as the sortObj param.
             */
            case 2:
                return Object.create(sortedListType, {
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    },
                    _appliedSorts: {
                        value: sortObj,
                        writable: false,
                        configurable: false
                    }
                });
            /**
             * @description: case 3 = Both an iterator and a sort object were passed in. The consumer
             * invoked the sortBy/sortByDescending or thenBy/thenByDescending function properties. Create
             * an ordered list type object instance, setting the iterator to the version provided (if any) and
             * the _appliedSorts field as the sortObj param.
             */
            case 3:
                return Object.create(sortedListType, _defineProperty({
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    },
                    _appliedSorts: {
                        value: sortObj,
                        writable: false,
                        configurable: false
                    }
                }, Symbol.iterator, {
                    value: iterator
                }));
            /**
             * @description: case 4 = An iterator, sort object, and a key were passed as arguments.
             * Create a grouped list type and set the iterator as the version provided, the ._appliedSorts
             * field as the sortObj param, and the ._key field as the key string argument.
             */
            case 4:
                return Object.create(groupedListType, {
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    },
                    _key: {
                        value: key,
                        writable: false,
                        configurable: false
                    },
                    key: {
                        get: function _getKey() {
                            return this._key;
                        }
                    }
                });
            /**
             * @description: default = Nothing beyond the 'source' param was passed to this
             * function; results in a bitwise value of 00. Create a 'basic' list object type
             * instance.
             */
            default:
                return Object.create(baseListType, {
                    _value: {
                        value: source,
                        writable: false,
                        configurable: false
                    },
                    data: {
                        get: function _getData() {
                            return Array.from(this);
                        }
                    }
                });
        }
    };

    function createBitMask() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return args.reduce(function _reduce(curr, next, idx) {
            return curr |= next << idx;
        }, args[0]);
    }
}

function taker_skipper(amt) {
    var count = -1;
    return function _skipAmt() {
        return ++count < amt;
    };
}

exports.createListCreator = createListCreator;
exports.taker_skipper = taker_skipper;

},{"../functionalHelpers":26,"../helpers":27}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unfold = exports.foldRight = exports.repeat = exports.findLastIndex = exports.findIndex = exports.fill = exports.copyWithin = exports.reverse = exports.skipWhile = exports.takeWhile = exports.equals = exports.binarySearch = exports.ofType = exports.distinct = exports.reduceRight = exports.foldLeft = exports.count = exports.last = exports.first = exports.contains = exports.intersperse = exports.filter = exports.zip = exports.join = exports.groupJoin = exports.concat = exports.prepend = exports.sortBy = exports.groupBy = exports.chain = exports.map = exports.union = exports.intersect = exports.except = exports.any = exports.all = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _functionalHelpers = require('../functionalHelpers');

var _decorators = require('../decorators');

var _combinators = require('../combinators');

var _helpers = require('../helpers');

var _sortHelpers = require('./sortHelpers');

var toArray = (0, _combinators.when)((0, _decorators.not)(_functionalHelpers.isArray), Array.from);

/**
 * @sig 
 * @description -
 * @param {Array|generator} xs - some stuff
 * @param {Array|generator} ys - some other stuff
 * @return {generator} - some other other stuff
 */
function prepend(xs, ys) {
    return regeneratorRuntime.mark(function addFront() {
        var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, y, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, x;

        return regeneratorRuntime.wrap(function addFront$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 3;
                        _iterator = ys[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 12;
                            break;
                        }

                        y = _step.value;
                        _context.next = 9;
                        return y;

                    case 9:
                        _iteratorNormalCompletion = true;
                        _context.next = 5;
                        break;

                    case 12:
                        _context.next = 18;
                        break;

                    case 14:
                        _context.prev = 14;
                        _context.t0 = _context['catch'](3);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 18:
                        _context.prev = 18;
                        _context.prev = 19;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 21:
                        _context.prev = 21;

                        if (!_didIteratorError) {
                            _context.next = 24;
                            break;
                        }

                        throw _iteratorError;

                    case 24:
                        return _context.finish(21);

                    case 25:
                        return _context.finish(18);

                    case 26:
                        _iteratorNormalCompletion2 = true;
                        _didIteratorError2 = false;
                        _iteratorError2 = undefined;
                        _context.prev = 29;
                        _iterator2 = xs[Symbol.iterator]();

                    case 31:
                        if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                            _context.next = 38;
                            break;
                        }

                        x = _step2.value;
                        _context.next = 35;
                        return x;

                    case 35:
                        _iteratorNormalCompletion2 = true;
                        _context.next = 31;
                        break;

                    case 38:
                        _context.next = 44;
                        break;

                    case 40:
                        _context.prev = 40;
                        _context.t1 = _context['catch'](29);
                        _didIteratorError2 = true;
                        _iteratorError2 = _context.t1;

                    case 44:
                        _context.prev = 44;
                        _context.prev = 45;

                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }

                    case 47:
                        _context.prev = 47;

                        if (!_didIteratorError2) {
                            _context.next = 50;
                            break;
                        }

                        throw _iteratorError2;

                    case 50:
                        return _context.finish(47);

                    case 51:
                        return _context.finish(44);

                    case 52:
                    case 'end':
                        return _context.stop();
                }
            }
        }, addFront, this, [[3, 14, 18, 26], [19,, 21, 25], [29, 40, 44, 52], [45,, 47, 51]]);
    });
}

/**
 * @sig:
 * @description description
 * @param {Array|generator} xs - x
 * @param {Array|generator} yss - y
 * @param {number} argsCount - z
 * @return {generator} - a
 */
function concat(xs, yss, argsCount) {
    return regeneratorRuntime.mark(function concatIterator() {
        var _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, x, ys, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, y, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _ys, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, _y;

        return regeneratorRuntime.wrap(function concatIterator$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _iteratorNormalCompletion3 = true;
                        _didIteratorError3 = false;
                        _iteratorError3 = undefined;
                        _context2.prev = 3;
                        _iterator3 = xs[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                            _context2.next = 12;
                            break;
                        }

                        x = _step3.value;
                        _context2.next = 9;
                        return x;

                    case 9:
                        _iteratorNormalCompletion3 = true;
                        _context2.next = 5;
                        break;

                    case 12:
                        _context2.next = 18;
                        break;

                    case 14:
                        _context2.prev = 14;
                        _context2.t0 = _context2['catch'](3);
                        _didIteratorError3 = true;
                        _iteratorError3 = _context2.t0;

                    case 18:
                        _context2.prev = 18;
                        _context2.prev = 19;

                        if (!_iteratorNormalCompletion3 && _iterator3.return) {
                            _iterator3.return();
                        }

                    case 21:
                        _context2.prev = 21;

                        if (!_didIteratorError3) {
                            _context2.next = 24;
                            break;
                        }

                        throw _iteratorError3;

                    case 24:
                        return _context2.finish(21);

                    case 25:
                        return _context2.finish(18);

                    case 26:
                        if (!(1 === argsCount)) {
                            _context2.next = 56;
                            break;
                        }

                        ys = yss[0];
                        _iteratorNormalCompletion4 = true;
                        _didIteratorError4 = false;
                        _iteratorError4 = undefined;
                        _context2.prev = 31;
                        _iterator4 = ys[Symbol.iterator]();

                    case 33:
                        if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                            _context2.next = 40;
                            break;
                        }

                        y = _step4.value;
                        _context2.next = 37;
                        return y;

                    case 37:
                        _iteratorNormalCompletion4 = true;
                        _context2.next = 33;
                        break;

                    case 40:
                        _context2.next = 46;
                        break;

                    case 42:
                        _context2.prev = 42;
                        _context2.t1 = _context2['catch'](31);
                        _didIteratorError4 = true;
                        _iteratorError4 = _context2.t1;

                    case 46:
                        _context2.prev = 46;
                        _context2.prev = 47;

                        if (!_iteratorNormalCompletion4 && _iterator4.return) {
                            _iterator4.return();
                        }

                    case 49:
                        _context2.prev = 49;

                        if (!_didIteratorError4) {
                            _context2.next = 52;
                            break;
                        }

                        throw _iteratorError4;

                    case 52:
                        return _context2.finish(49);

                    case 53:
                        return _context2.finish(46);

                    case 54:
                        _context2.next = 106;
                        break;

                    case 56:
                        _iteratorNormalCompletion5 = true;
                        _didIteratorError5 = false;
                        _iteratorError5 = undefined;
                        _context2.prev = 59;
                        _iterator5 = yss[Symbol.iterator]();

                    case 61:
                        if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                            _context2.next = 92;
                            break;
                        }

                        _ys = _step5.value;
                        _iteratorNormalCompletion6 = true;
                        _didIteratorError6 = false;
                        _iteratorError6 = undefined;
                        _context2.prev = 66;
                        _iterator6 = _ys[Symbol.iterator]();

                    case 68:
                        if (_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done) {
                            _context2.next = 75;
                            break;
                        }

                        _y = _step6.value;
                        _context2.next = 72;
                        return _y;

                    case 72:
                        _iteratorNormalCompletion6 = true;
                        _context2.next = 68;
                        break;

                    case 75:
                        _context2.next = 81;
                        break;

                    case 77:
                        _context2.prev = 77;
                        _context2.t2 = _context2['catch'](66);
                        _didIteratorError6 = true;
                        _iteratorError6 = _context2.t2;

                    case 81:
                        _context2.prev = 81;
                        _context2.prev = 82;

                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }

                    case 84:
                        _context2.prev = 84;

                        if (!_didIteratorError6) {
                            _context2.next = 87;
                            break;
                        }

                        throw _iteratorError6;

                    case 87:
                        return _context2.finish(84);

                    case 88:
                        return _context2.finish(81);

                    case 89:
                        _iteratorNormalCompletion5 = true;
                        _context2.next = 61;
                        break;

                    case 92:
                        _context2.next = 98;
                        break;

                    case 94:
                        _context2.prev = 94;
                        _context2.t3 = _context2['catch'](59);
                        _didIteratorError5 = true;
                        _iteratorError5 = _context2.t3;

                    case 98:
                        _context2.prev = 98;
                        _context2.prev = 99;

                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                            _iterator5.return();
                        }

                    case 101:
                        _context2.prev = 101;

                        if (!_didIteratorError5) {
                            _context2.next = 104;
                            break;
                        }

                        throw _iteratorError5;

                    case 104:
                        return _context2.finish(101);

                    case 105:
                        return _context2.finish(98);

                    case 106:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, concatIterator, this, [[3, 14, 18, 26], [19,, 21, 25], [31, 42, 46, 54], [47,, 49, 53], [59, 94, 98, 106], [66, 77, 81, 89], [82,, 84, 88], [99,, 101, 105]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - x
 * @param {Array|generator} ys - y
 * @param {function} comparer - z
 * @return {generator} - a
 */
function except(xs, ys) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.strictEquals;

    ys = toArray(ys);
    return regeneratorRuntime.mark(function exceptIterator() {
        var _this = this;

        var _iteratorNormalCompletion7, _didIteratorError7, _iteratorError7, _loop, _iterator7, _step7;

        return regeneratorRuntime.wrap(function exceptIterator$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _iteratorNormalCompletion7 = true;
                        _didIteratorError7 = false;
                        _iteratorError7 = undefined;
                        _context4.prev = 3;
                        _loop = regeneratorRuntime.mark(function _loop() {
                            var x;
                            return regeneratorRuntime.wrap(function _loop$(_context3) {
                                while (1) {
                                    switch (_context3.prev = _context3.next) {
                                        case 0:
                                            x = _step7.value;

                                            if (ys.some(function _comparer(y) {
                                                return comparer(x, y);
                                            })) {
                                                _context3.next = 4;
                                                break;
                                            }

                                            _context3.next = 4;
                                            return x;

                                        case 4:
                                        case 'end':
                                            return _context3.stop();
                                    }
                                }
                            }, _loop, _this);
                        });
                        _iterator7 = xs[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done) {
                            _context4.next = 11;
                            break;
                        }

                        return _context4.delegateYield(_loop(), 't0', 8);

                    case 8:
                        _iteratorNormalCompletion7 = true;
                        _context4.next = 6;
                        break;

                    case 11:
                        _context4.next = 17;
                        break;

                    case 13:
                        _context4.prev = 13;
                        _context4.t1 = _context4['catch'](3);
                        _didIteratorError7 = true;
                        _iteratorError7 = _context4.t1;

                    case 17:
                        _context4.prev = 17;
                        _context4.prev = 18;

                        if (!_iteratorNormalCompletion7 && _iterator7.return) {
                            _iterator7.return();
                        }

                    case 20:
                        _context4.prev = 20;

                        if (!_didIteratorError7) {
                            _context4.next = 23;
                            break;
                        }

                        throw _iteratorError7;

                    case 23:
                        return _context4.finish(20);

                    case 24:
                        return _context4.finish(17);

                    case 25:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, exceptIterator, this, [[3, 13, 17, 25], [18,, 20, 24]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {Array|generator} ys - b
 * @param {function} xSelector - c
 * @param {function} ySelector - d
 * @param {function} projector - e
 * @param {function} listFactory - f
 * @param {function} comparer - g
 * @return {generator} - h
 */
function groupJoin(xs, ys, xSelector, ySelector, projector, listFactory) {
    var comparer = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : _functionalHelpers.strictEquals;

    return regeneratorRuntime.mark(function groupJoinIterator() {
        var groupObj, groupedY, _iteratorNormalCompletion8, _didIteratorError8, _iteratorError8, _iterator8, _step8, _x3, grp, _iteratorNormalCompletion9, _didIteratorError9, _iteratorError9, _iterator9, _step9, yGroup;

        return regeneratorRuntime.wrap(function groupJoinIterator$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        groupObj = [{ keySelector: ySelector, comparer: comparer, direction: _helpers.sortDirection.ascending }];
                        groupedY = nestLists(groupData(toArray(ys), groupObj), 0, null, listFactory);
                        _iteratorNormalCompletion8 = true;
                        _didIteratorError8 = false;
                        _iteratorError8 = undefined;
                        _context5.prev = 5;
                        _iterator8 = xs[Symbol.iterator]();

                    case 7:
                        if (_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done) {
                            _context5.next = 42;
                            break;
                        }

                        _x3 = _step8.value;
                        grp = void 0;
                        _iteratorNormalCompletion9 = true;
                        _didIteratorError9 = false;
                        _iteratorError9 = undefined;
                        _context5.prev = 13;
                        _iterator9 = groupedY[Symbol.iterator]();

                    case 15:
                        if (_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done) {
                            _context5.next = 23;
                            break;
                        }

                        yGroup = _step9.value;

                        if (!comparer(xSelector(_x3), yGroup.key)) {
                            _context5.next = 20;
                            break;
                        }

                        grp = yGroup;
                        return _context5.abrupt('break', 23);

                    case 20:
                        _iteratorNormalCompletion9 = true;
                        _context5.next = 15;
                        break;

                    case 23:
                        _context5.next = 29;
                        break;

                    case 25:
                        _context5.prev = 25;
                        _context5.t0 = _context5['catch'](13);
                        _didIteratorError9 = true;
                        _iteratorError9 = _context5.t0;

                    case 29:
                        _context5.prev = 29;
                        _context5.prev = 30;

                        if (!_iteratorNormalCompletion9 && _iterator9.return) {
                            _iterator9.return();
                        }

                    case 32:
                        _context5.prev = 32;

                        if (!_didIteratorError9) {
                            _context5.next = 35;
                            break;
                        }

                        throw _iteratorError9;

                    case 35:
                        return _context5.finish(32);

                    case 36:
                        return _context5.finish(29);

                    case 37:
                        _context5.next = 39;
                        return projector(_x3, grp || listFactory([]));

                    case 39:
                        _iteratorNormalCompletion8 = true;
                        _context5.next = 7;
                        break;

                    case 42:
                        _context5.next = 48;
                        break;

                    case 44:
                        _context5.prev = 44;
                        _context5.t1 = _context5['catch'](5);
                        _didIteratorError8 = true;
                        _iteratorError8 = _context5.t1;

                    case 48:
                        _context5.prev = 48;
                        _context5.prev = 49;

                        if (!_iteratorNormalCompletion8 && _iterator8.return) {
                            _iterator8.return();
                        }

                    case 51:
                        _context5.prev = 51;

                        if (!_didIteratorError8) {
                            _context5.next = 54;
                            break;
                        }

                        throw _iteratorError8;

                    case 54:
                        return _context5.finish(51);

                    case 55:
                        return _context5.finish(48);

                    case 56:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, groupJoinIterator, this, [[5, 44, 48, 56], [13, 25, 29, 37], [30,, 32, 36], [49,, 51, 55]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {Array|generator} ys - b
 * @param {function} comparer - c
 * @return {generator} - d
 */
function intersect(xs, ys) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.strictEquals;

    return regeneratorRuntime.mark(function intersectIterator() {
        var _this2 = this;

        var _iteratorNormalCompletion10, _didIteratorError10, _iteratorError10, _loop2, _iterator10, _step10;

        return regeneratorRuntime.wrap(function intersectIterator$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        ys = toArray(ys);
                        _iteratorNormalCompletion10 = true;
                        _didIteratorError10 = false;
                        _iteratorError10 = undefined;
                        _context7.prev = 4;
                        _loop2 = regeneratorRuntime.mark(function _loop2() {
                            var x;
                            return regeneratorRuntime.wrap(function _loop2$(_context6) {
                                while (1) {
                                    switch (_context6.prev = _context6.next) {
                                        case 0:
                                            x = _step10.value;

                                            if (!(!(0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Undefined, x) && ys.some(function _checkEquivalency(it) {
                                                return comparer(x, it);
                                            }))) {
                                                _context6.next = 4;
                                                break;
                                            }

                                            _context6.next = 4;
                                            return x;

                                        case 4:
                                        case 'end':
                                            return _context6.stop();
                                    }
                                }
                            }, _loop2, _this2);
                        });
                        _iterator10 = xs[Symbol.iterator]();

                    case 7:
                        if (_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done) {
                            _context7.next = 12;
                            break;
                        }

                        return _context7.delegateYield(_loop2(), 't0', 9);

                    case 9:
                        _iteratorNormalCompletion10 = true;
                        _context7.next = 7;
                        break;

                    case 12:
                        _context7.next = 18;
                        break;

                    case 14:
                        _context7.prev = 14;
                        _context7.t1 = _context7['catch'](4);
                        _didIteratorError10 = true;
                        _iteratorError10 = _context7.t1;

                    case 18:
                        _context7.prev = 18;
                        _context7.prev = 19;

                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }

                    case 21:
                        _context7.prev = 21;

                        if (!_didIteratorError10) {
                            _context7.next = 24;
                            break;
                        }

                        throw _iteratorError10;

                    case 24:
                        return _context7.finish(21);

                    case 25:
                        return _context7.finish(18);

                    case 26:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, intersectIterator, this, [[4, 14, 18, 26], [19,, 21, 25]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {*} val - b
 * @return {generator} - c
 */
function intersperse(xs, val) {
    return regeneratorRuntime.mark(function intersperseIterator() {
        var it, next;
        return regeneratorRuntime.wrap(function intersperseIterator$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        it = xs[Symbol.iterator](), next = it.next();

                    case 1:
                        if (next.done) {
                            _context8.next = 10;
                            break;
                        }

                        _context8.next = 4;
                        return next.value;

                    case 4:
                        next = it.next();

                        if (next.done) {
                            _context8.next = 8;
                            break;
                        }

                        _context8.next = 8;
                        return val;

                    case 8:
                        _context8.next = 1;
                        break;

                    case 10:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, intersperseIterator, this);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {Array|generator} ys - b
 * @param {function} xSelector - c
 * @param {function} ySelector - d
 * @param {function} projector - e
 * @param {function} comparer - f
 * @return {generator} - g
 */
function join(xs, ys, xSelector, ySelector, projector) {
    var comparer = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : _functionalHelpers.strictEquals;

    return regeneratorRuntime.mark(function joinIterator() {
        var _iteratorNormalCompletion11, _didIteratorError11, _iteratorError11, _iterator11, _step11, _x6, _iteratorNormalCompletion12, _didIteratorError12, _iteratorError12, _iterator12, _step12, y;

        return regeneratorRuntime.wrap(function joinIterator$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        ys = toArray(ys);
                        _iteratorNormalCompletion11 = true;
                        _didIteratorError11 = false;
                        _iteratorError11 = undefined;
                        _context9.prev = 4;
                        _iterator11 = xs[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done) {
                            _context9.next = 38;
                            break;
                        }

                        _x6 = _step11.value;
                        _iteratorNormalCompletion12 = true;
                        _didIteratorError12 = false;
                        _iteratorError12 = undefined;
                        _context9.prev = 11;
                        _iterator12 = ys[Symbol.iterator]();

                    case 13:
                        if (_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done) {
                            _context9.next = 21;
                            break;
                        }

                        y = _step12.value;

                        if (!comparer(xSelector(_x6), ySelector(y))) {
                            _context9.next = 18;
                            break;
                        }

                        _context9.next = 18;
                        return projector(_x6, y);

                    case 18:
                        _iteratorNormalCompletion12 = true;
                        _context9.next = 13;
                        break;

                    case 21:
                        _context9.next = 27;
                        break;

                    case 23:
                        _context9.prev = 23;
                        _context9.t0 = _context9['catch'](11);
                        _didIteratorError12 = true;
                        _iteratorError12 = _context9.t0;

                    case 27:
                        _context9.prev = 27;
                        _context9.prev = 28;

                        if (!_iteratorNormalCompletion12 && _iterator12.return) {
                            _iterator12.return();
                        }

                    case 30:
                        _context9.prev = 30;

                        if (!_didIteratorError12) {
                            _context9.next = 33;
                            break;
                        }

                        throw _iteratorError12;

                    case 33:
                        return _context9.finish(30);

                    case 34:
                        return _context9.finish(27);

                    case 35:
                        _iteratorNormalCompletion11 = true;
                        _context9.next = 6;
                        break;

                    case 38:
                        _context9.next = 44;
                        break;

                    case 40:
                        _context9.prev = 40;
                        _context9.t1 = _context9['catch'](4);
                        _didIteratorError11 = true;
                        _iteratorError11 = _context9.t1;

                    case 44:
                        _context9.prev = 44;
                        _context9.prev = 45;

                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
                            _iterator11.return();
                        }

                    case 47:
                        _context9.prev = 47;

                        if (!_didIteratorError11) {
                            _context9.next = 50;
                            break;
                        }

                        throw _iteratorError11;

                    case 50:
                        return _context9.finish(47);

                    case 51:
                        return _context9.finish(44);

                    case 52:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, joinIterator, this, [[4, 40, 44, 52], [11, 23, 27, 35], [28,, 30, 34], [45,, 47, 51]]);
    });
}

/**
 * @sig
 * @description
 * @param {Array|generator} xs - a
 * @param {Array|generator} ys - b
 * @param {function} comparer - c
 * @return {generator} - d
 */
function union(xs, ys) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.strictEquals;

    return regeneratorRuntime.mark(function unionIterator() {
        var isInCache, _iteratorNormalCompletion13, _didIteratorError13, _iteratorError13, _iterator13, _step13, _x8, _iteratorNormalCompletion14, _didIteratorError14, _iteratorError14, _iterator14, _step14, y;

        return regeneratorRuntime.wrap(function unionIterator$(_context10) {
            while (1) {
                switch (_context10.prev = _context10.next) {
                    case 0:
                        isInCache = (0, _helpers.cacher)(comparer);
                        _iteratorNormalCompletion13 = true;
                        _didIteratorError13 = false;
                        _iteratorError13 = undefined;
                        _context10.prev = 4;
                        _iterator13 = xs[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done) {
                            _context10.next = 14;
                            break;
                        }

                        _x8 = _step13.value;

                        if (isInCache(_x8)) {
                            _context10.next = 11;
                            break;
                        }

                        _context10.next = 11;
                        return _x8;

                    case 11:
                        _iteratorNormalCompletion13 = true;
                        _context10.next = 6;
                        break;

                    case 14:
                        _context10.next = 20;
                        break;

                    case 16:
                        _context10.prev = 16;
                        _context10.t0 = _context10['catch'](4);
                        _didIteratorError13 = true;
                        _iteratorError13 = _context10.t0;

                    case 20:
                        _context10.prev = 20;
                        _context10.prev = 21;

                        if (!_iteratorNormalCompletion13 && _iterator13.return) {
                            _iterator13.return();
                        }

                    case 23:
                        _context10.prev = 23;

                        if (!_didIteratorError13) {
                            _context10.next = 26;
                            break;
                        }

                        throw _iteratorError13;

                    case 26:
                        return _context10.finish(23);

                    case 27:
                        return _context10.finish(20);

                    case 28:
                        _iteratorNormalCompletion14 = true;
                        _didIteratorError14 = false;
                        _iteratorError14 = undefined;
                        _context10.prev = 31;
                        _iterator14 = toArray(ys)[Symbol.iterator]();

                    case 33:
                        if (_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done) {
                            _context10.next = 41;
                            break;
                        }

                        y = _step14.value;

                        if (isInCache(y)) {
                            _context10.next = 38;
                            break;
                        }

                        _context10.next = 38;
                        return y;

                    case 38:
                        _iteratorNormalCompletion14 = true;
                        _context10.next = 33;
                        break;

                    case 41:
                        _context10.next = 47;
                        break;

                    case 43:
                        _context10.prev = 43;
                        _context10.t1 = _context10['catch'](31);
                        _didIteratorError14 = true;
                        _iteratorError14 = _context10.t1;

                    case 47:
                        _context10.prev = 47;
                        _context10.prev = 48;

                        if (!_iteratorNormalCompletion14 && _iterator14.return) {
                            _iterator14.return();
                        }

                    case 50:
                        _context10.prev = 50;

                        if (!_didIteratorError14) {
                            _context10.next = 53;
                            break;
                        }

                        throw _iteratorError14;

                    case 53:
                        return _context10.finish(50);

                    case 54:
                        return _context10.finish(47);

                    case 55:
                    case 'end':
                        return _context10.stop();
                }
            }
        }, unionIterator, this, [[4, 16, 20, 28], [21,, 23, 27], [31, 43, 47, 55], [48,, 50, 54]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {Array|generator} ys - b
 * @param {function} selector - c
 * @return {generator} - d
 */
function zip(xs, ys, selector) {
    return regeneratorRuntime.mark(function zipIterator() {
        var idx, yArr, _iteratorNormalCompletion15, _didIteratorError15, _iteratorError15, _iterator15, _step15, _x9;

        return regeneratorRuntime.wrap(function zipIterator$(_context11) {
            while (1) {
                switch (_context11.prev = _context11.next) {
                    case 0:
                        idx = 0;
                        yArr = toArray(ys);
                        _iteratorNormalCompletion15 = true;
                        _didIteratorError15 = false;
                        _iteratorError15 = undefined;
                        _context11.prev = 5;
                        _iterator15 = xs[Symbol.iterator]();

                    case 7:
                        if (_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done) {
                            _context11.next = 17;
                            break;
                        }

                        _x9 = _step15.value;

                        if (!(idx >= yArr.length || !yArr.length)) {
                            _context11.next = 11;
                            break;
                        }

                        return _context11.abrupt('return');

                    case 11:
                        _context11.next = 13;
                        return selector(_x9, yArr[idx]);

                    case 13:
                        ++idx;

                    case 14:
                        _iteratorNormalCompletion15 = true;
                        _context11.next = 7;
                        break;

                    case 17:
                        _context11.next = 23;
                        break;

                    case 19:
                        _context11.prev = 19;
                        _context11.t0 = _context11['catch'](5);
                        _didIteratorError15 = true;
                        _iteratorError15 = _context11.t0;

                    case 23:
                        _context11.prev = 23;
                        _context11.prev = 24;

                        if (!_iteratorNormalCompletion15 && _iterator15.return) {
                            _iterator15.return();
                        }

                    case 26:
                        _context11.prev = 26;

                        if (!_didIteratorError15) {
                            _context11.next = 29;
                            break;
                        }

                        throw _iteratorError15;

                    case 29:
                        return _context11.finish(26);

                    case 30:
                        return _context11.finish(23);

                    case 31:
                    case 'end':
                        return _context11.stop();
                }
            }
        }, zipIterator, this, [[5, 19, 23, 31], [24,, 26, 30]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {boolean} - c
 */
function all(xs, predicate) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(predicate)) && toArray(xs).every(predicate);
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {boolean} - c
 */
function any(xs, predicate) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(predicate)) ? toArray(xs).some(predicate) : 0 < toArray(xs).length;
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {*} val - b
 * @param {function} comparer - c
 * @return {*} - d
 */
function contains(xs, val, comparer) {
    //TODO: see if there is any real performance increase by just using .includes when a comparer hasn't been passed
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Undefined, (0, _functionalHelpers.type)(comparer)) ? toArray(xs).includes(val) : toArray(xs).some(function (x) {
        return comparer(x, val);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {*} val - b
 * @param {function} comparer - c
 * @return {boolean} - d
 */
function binarySearch(xs, val, comparer) {
    return binarySearchRec(xs, 0, xs.length - 1, val, comparer);
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {number} left - b
 * @param {number} right - c
 * @param {*} val - d
 * @param {function} comparer - e
 * @return {boolean} - f
 */
function binarySearchRec(xs, left, right, val, comparer) {
    if (left > right) return false;
    var mid = Math.floor((left + right) / 2),
        res = comparer(val, xs[mid]);
    if (0 === res) return true;
    if (0 < res) return binarySearchRec(xs, mid + 1, right, val, comparer);
    return binarySearchRec(xs, left, mid - 1, val, comparer);
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {Number} - c
 */
function count(xs, predicate) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Undefined, (0, _functionalHelpers.type)(predicate)) ? toArray(xs).length : toArray(xs).filter(predicate).length;
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {*} - c
 */
function first(xs, predicate) {
    return (0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(predicate)) ? toArray(xs).find(predicate) : toArray(xs)[0];
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} fn - b
 * @param {*} initial - c
 * @return {*} - d
 */
function foldLeft(xs, fn) {
    var initial = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    return toArray(xs).reduce(fn, initial);
}

/**
 * @sig
 * @description d
 * @param {Array} arr - a
 * @param {function} op - b
 * @param {*} acc - c
 * @return {*} - d
 */
function foldRight(arr, op, acc) {
    var list = toArray(arr),
        len = list.length,
        res = acc || list[--len];
    while (0 < len) {
        res = op(list[--len], res, len, list);
    }
    return res;
}

/**
 * @sig
 * @description s
 * @param {Array|generator} xs - a
 * @param {function} fn - b
 * @param {*} initial - c
 * @return {*} - d
 */
function reduceRight(xs, fn, initial) {
    return null == initial ? toArray(xs).reduceRight(fn) : toArray(xs).reduceRight(fn, initial);
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {*} - c
 */
function last(xs, predicate) {
    if ((0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(predicate))) return toArray(xs).filter(predicate).slice(-1)[0];
    return toArray(xs).slice(-1)[0];
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} comparer - b
 * @return {generator} - c
 */
function distinct(xs) {
    var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.strictEquals;

    var cached = (0, _helpers.cacher)(comparer);

    return regeneratorRuntime.mark(function distinctIterator() {
        var _iteratorNormalCompletion16, _didIteratorError16, _iteratorError16, _iterator16, _step16, _x12;

        return regeneratorRuntime.wrap(function distinctIterator$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _iteratorNormalCompletion16 = true;
                        _didIteratorError16 = false;
                        _iteratorError16 = undefined;
                        _context12.prev = 3;
                        _iterator16 = xs[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done) {
                            _context12.next = 13;
                            break;
                        }

                        _x12 = _step16.value;

                        if (cached(_x12)) {
                            _context12.next = 10;
                            break;
                        }

                        _context12.next = 10;
                        return _x12;

                    case 10:
                        _iteratorNormalCompletion16 = true;
                        _context12.next = 5;
                        break;

                    case 13:
                        _context12.next = 19;
                        break;

                    case 15:
                        _context12.prev = 15;
                        _context12.t0 = _context12['catch'](3);
                        _didIteratorError16 = true;
                        _iteratorError16 = _context12.t0;

                    case 19:
                        _context12.prev = 19;
                        _context12.prev = 20;

                        if (!_iteratorNormalCompletion16 && _iterator16.return) {
                            _iterator16.return();
                        }

                    case 22:
                        _context12.prev = 22;

                        if (!_didIteratorError16) {
                            _context12.next = 25;
                            break;
                        }

                        throw _iteratorError16;

                    case 25:
                        return _context12.finish(22);

                    case 26:
                        return _context12.finish(19);

                    case 27:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, distinctIterator, this, [[3, 15, 19, 27], [20,, 22, 26]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {string} dataType - b
 * @return {generator} - c
 */
function ofType(xs, dataType) {
    return regeneratorRuntime.mark(function ofTypeIterator() {
        var _checkTypeKeys, _checkItemKeys, _iteratorNormalCompletion17, _didIteratorError17, _iteratorError17, _iterator17, _step17, _x13, _iteratorNormalCompletion18, _didIteratorError18, _iteratorError18, _iterator18, _step18, _x14, _iteratorNormalCompletion19, _didIteratorError19, _iteratorError19, _iterator19, _step19, _x15, _iteratorNormalCompletion20, _didIteratorError20, _iteratorError20, _iterator20, _step20, objItem, _iteratorNormalCompletion21, _didIteratorError21, _iteratorError21, _iterator21, _step21, _x16;

        return regeneratorRuntime.wrap(function ofTypeIterator$(_context13) {
            while (1) {
                switch (_context13.prev = _context13.next) {
                    case 0:
                        _checkItemKeys = function _checkItemKeys(key) {
                            return key in dataType;
                        };

                        _checkTypeKeys = function _checkTypeKeys(key) {
                            return key in objItem;
                        };

                        if (!(dataType in _helpers.typeName)) {
                            _context13.next = 32;
                            break;
                        }

                        _iteratorNormalCompletion17 = true;
                        _didIteratorError17 = false;
                        _iteratorError17 = undefined;
                        _context13.prev = 6;
                        _iterator17 = xs[Symbol.iterator]();

                    case 8:
                        if (_iteratorNormalCompletion17 = (_step17 = _iterator17.next()).done) {
                            _context13.next = 16;
                            break;
                        }

                        _x13 = _step17.value;

                        if (!(_helpers.typeName[dataType] === (typeof _x13 === 'undefined' ? 'undefined' : _typeof(_x13)))) {
                            _context13.next = 13;
                            break;
                        }

                        _context13.next = 13;
                        return _x13;

                    case 13:
                        _iteratorNormalCompletion17 = true;
                        _context13.next = 8;
                        break;

                    case 16:
                        _context13.next = 22;
                        break;

                    case 18:
                        _context13.prev = 18;
                        _context13.t0 = _context13['catch'](6);
                        _didIteratorError17 = true;
                        _iteratorError17 = _context13.t0;

                    case 22:
                        _context13.prev = 22;
                        _context13.prev = 23;

                        if (!_iteratorNormalCompletion17 && _iterator17.return) {
                            _iterator17.return();
                        }

                    case 25:
                        _context13.prev = 25;

                        if (!_didIteratorError17) {
                            _context13.next = 28;
                            break;
                        }

                        throw _iteratorError17;

                    case 28:
                        return _context13.finish(25);

                    case 29:
                        return _context13.finish(22);

                    case 30:
                        _context13.next = 153;
                        break;

                    case 32:
                        if (!(0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Function, (0, _functionalHelpers.type)(dataType))) {
                            _context13.next = 62;
                            break;
                        }

                        _iteratorNormalCompletion18 = true;
                        _didIteratorError18 = false;
                        _iteratorError18 = undefined;
                        _context13.prev = 36;
                        _iterator18 = xs[Symbol.iterator]();

                    case 38:
                        if (_iteratorNormalCompletion18 = (_step18 = _iterator18.next()).done) {
                            _context13.next = 46;
                            break;
                        }

                        _x14 = _step18.value;

                        if (!(_x14 === dataType)) {
                            _context13.next = 43;
                            break;
                        }

                        _context13.next = 43;
                        return _x14;

                    case 43:
                        _iteratorNormalCompletion18 = true;
                        _context13.next = 38;
                        break;

                    case 46:
                        _context13.next = 52;
                        break;

                    case 48:
                        _context13.prev = 48;
                        _context13.t1 = _context13['catch'](36);
                        _didIteratorError18 = true;
                        _iteratorError18 = _context13.t1;

                    case 52:
                        _context13.prev = 52;
                        _context13.prev = 53;

                        if (!_iteratorNormalCompletion18 && _iterator18.return) {
                            _iterator18.return();
                        }

                    case 55:
                        _context13.prev = 55;

                        if (!_didIteratorError18) {
                            _context13.next = 58;
                            break;
                        }

                        throw _iteratorError18;

                    case 58:
                        return _context13.finish(55);

                    case 59:
                        return _context13.finish(52);

                    case 60:
                        _context13.next = 153;
                        break;

                    case 62:
                        if (!(null === dataType)) {
                            _context13.next = 92;
                            break;
                        }

                        _iteratorNormalCompletion19 = true;
                        _didIteratorError19 = false;
                        _iteratorError19 = undefined;
                        _context13.prev = 66;
                        _iterator19 = xs[Symbol.iterator]();

                    case 68:
                        if (_iteratorNormalCompletion19 = (_step19 = _iterator19.next()).done) {
                            _context13.next = 76;
                            break;
                        }

                        _x15 = _step19.value;

                        if (!(dataType === _x15)) {
                            _context13.next = 73;
                            break;
                        }

                        _context13.next = 73;
                        return _x15;

                    case 73:
                        _iteratorNormalCompletion19 = true;
                        _context13.next = 68;
                        break;

                    case 76:
                        _context13.next = 82;
                        break;

                    case 78:
                        _context13.prev = 78;
                        _context13.t2 = _context13['catch'](66);
                        _didIteratorError19 = true;
                        _iteratorError19 = _context13.t2;

                    case 82:
                        _context13.prev = 82;
                        _context13.prev = 83;

                        if (!_iteratorNormalCompletion19 && _iterator19.return) {
                            _iterator19.return();
                        }

                    case 85:
                        _context13.prev = 85;

                        if (!_didIteratorError19) {
                            _context13.next = 88;
                            break;
                        }

                        throw _iteratorError19;

                    case 88:
                        return _context13.finish(85);

                    case 89:
                        return _context13.finish(82);

                    case 90:
                        _context13.next = 153;
                        break;

                    case 92:
                        if (!((0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Object, (0, _functionalHelpers.type)(dataType)) && !(0, _functionalHelpers.isArray)(dataType))) {
                            _context13.next = 127;
                            break;
                        }

                        _iteratorNormalCompletion20 = true;
                        _didIteratorError20 = false;
                        _iteratorError20 = undefined;
                        _context13.prev = 96;
                        _iterator20 = xs[Symbol.iterator]();

                    case 98:
                        if (_iteratorNormalCompletion20 = (_step20 = _iterator20.next()).done) {
                            _context13.next = 111;
                            break;
                        }

                        objItem = _step20.value;

                        if (!dataType.isPrototypeOf(objItem)) {
                            _context13.next = 105;
                            break;
                        }

                        _context13.next = 103;
                        return objItem;

                    case 103:
                        _context13.next = 108;
                        break;

                    case 105:
                        if (!((0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Object, (0, _functionalHelpers.type)(objItem)) && null !== objItem && Object.keys(dataType).every(_checkTypeKeys) && Object.keys(objItem).every(_checkItemKeys))) {
                            _context13.next = 108;
                            break;
                        }

                        _context13.next = 108;
                        return objItem;

                    case 108:
                        _iteratorNormalCompletion20 = true;
                        _context13.next = 98;
                        break;

                    case 111:
                        _context13.next = 117;
                        break;

                    case 113:
                        _context13.prev = 113;
                        _context13.t3 = _context13['catch'](96);
                        _didIteratorError20 = true;
                        _iteratorError20 = _context13.t3;

                    case 117:
                        _context13.prev = 117;
                        _context13.prev = 118;

                        if (!_iteratorNormalCompletion20 && _iterator20.return) {
                            _iterator20.return();
                        }

                    case 120:
                        _context13.prev = 120;

                        if (!_didIteratorError20) {
                            _context13.next = 123;
                            break;
                        }

                        throw _iteratorError20;

                    case 123:
                        return _context13.finish(120);

                    case 124:
                        return _context13.finish(117);

                    case 125:
                        _context13.next = 153;
                        break;

                    case 127:
                        _iteratorNormalCompletion21 = true;
                        _didIteratorError21 = false;
                        _iteratorError21 = undefined;
                        _context13.prev = 130;
                        _iterator21 = xs[Symbol.iterator]();

                    case 132:
                        if (_iteratorNormalCompletion21 = (_step21 = _iterator21.next()).done) {
                            _context13.next = 139;
                            break;
                        }

                        _x16 = _step21.value;
                        _context13.next = 136;
                        return _x16;

                    case 136:
                        _iteratorNormalCompletion21 = true;
                        _context13.next = 132;
                        break;

                    case 139:
                        _context13.next = 145;
                        break;

                    case 141:
                        _context13.prev = 141;
                        _context13.t4 = _context13['catch'](130);
                        _didIteratorError21 = true;
                        _iteratorError21 = _context13.t4;

                    case 145:
                        _context13.prev = 145;
                        _context13.prev = 146;

                        if (!_iteratorNormalCompletion21 && _iterator21.return) {
                            _iterator21.return();
                        }

                    case 148:
                        _context13.prev = 148;

                        if (!_didIteratorError21) {
                            _context13.next = 151;
                            break;
                        }

                        throw _iteratorError21;

                    case 151:
                        return _context13.finish(148);

                    case 152:
                        return _context13.finish(145);

                    case 153:
                    case 'end':
                        return _context13.stop();
                }
            }
        }, ofTypeIterator, this, [[6, 18, 22, 30], [23,, 25, 29], [36, 48, 52, 60], [53,, 55, 59], [66, 78, 82, 90], [83,, 85, 89], [96, 113, 117, 125], [118,, 120, 124], [130, 141, 145, 153], [146,, 148, 152]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {generator} - c
 */
function filter(xs, predicate) {
    return regeneratorRuntime.mark(function filterIterator() {
        var _iteratorNormalCompletion22, _didIteratorError22, _iteratorError22, _iterator22, _step22, _x17;

        return regeneratorRuntime.wrap(function filterIterator$(_context14) {
            while (1) {
                switch (_context14.prev = _context14.next) {
                    case 0:
                        _iteratorNormalCompletion22 = true;
                        _didIteratorError22 = false;
                        _iteratorError22 = undefined;
                        _context14.prev = 3;
                        _iterator22 = xs[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion22 = (_step22 = _iterator22.next()).done) {
                            _context14.next = 13;
                            break;
                        }

                        _x17 = _step22.value;

                        if (!(false !== predicate(_x17))) {
                            _context14.next = 10;
                            break;
                        }

                        _context14.next = 10;
                        return _x17;

                    case 10:
                        _iteratorNormalCompletion22 = true;
                        _context14.next = 5;
                        break;

                    case 13:
                        _context14.next = 19;
                        break;

                    case 15:
                        _context14.prev = 15;
                        _context14.t0 = _context14['catch'](3);
                        _didIteratorError22 = true;
                        _iteratorError22 = _context14.t0;

                    case 19:
                        _context14.prev = 19;
                        _context14.prev = 20;

                        if (!_iteratorNormalCompletion22 && _iterator22.return) {
                            _iterator22.return();
                        }

                    case 22:
                        _context14.prev = 22;

                        if (!_didIteratorError22) {
                            _context14.next = 25;
                            break;
                        }

                        throw _iteratorError22;

                    case 25:
                        return _context14.finish(22);

                    case 26:
                        return _context14.finish(19);

                    case 27:
                    case 'end':
                        return _context14.stop();
                }
            }
        }, filterIterator, this, [[3, 15, 19, 27], [20,, 22, 26]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @return {generator} - b
 */
function deepFlatten(xs) {
    return regeneratorRuntime.mark(function iterator() {
        var unyieldedData, res, _iteratorNormalCompletion23, _didIteratorError23, _iteratorError23, _iterator23, _step23, _x18;

        return regeneratorRuntime.wrap(function iterator$(_context15) {
            while (1) {
                switch (_context15.prev = _context15.next) {
                    case 0:
                        unyieldedData = [];
                        _iteratorNormalCompletion23 = true;
                        _didIteratorError23 = false;
                        _iteratorError23 = undefined;
                        _context15.prev = 4;
                        _iterator23 = xs[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion23 = (_step23 = _iterator23.next()).done) {
                            _context15.next = 20;
                            break;
                        }

                        _x18 = _step23.value;

                        res = flatteningFunc(_x18);

                        if ((0, _functionalHelpers.isArray)(res)) unyieldedData = unyieldedData.concat(Array.prototype.concat.apply([], res));

                        if (!unyieldedData.length) {
                            _context15.next = 15;
                            break;
                        }

                        _context15.next = 13;
                        return unyieldedData.shift();

                    case 13:
                        _context15.next = 17;
                        break;

                    case 15:
                        _context15.next = 17;
                        return res;

                    case 17:
                        _iteratorNormalCompletion23 = true;
                        _context15.next = 6;
                        break;

                    case 20:
                        _context15.next = 26;
                        break;

                    case 22:
                        _context15.prev = 22;
                        _context15.t0 = _context15['catch'](4);
                        _didIteratorError23 = true;
                        _iteratorError23 = _context15.t0;

                    case 26:
                        _context15.prev = 26;
                        _context15.prev = 27;

                        if (!_iteratorNormalCompletion23 && _iterator23.return) {
                            _iterator23.return();
                        }

                    case 29:
                        _context15.prev = 29;

                        if (!_didIteratorError23) {
                            _context15.next = 32;
                            break;
                        }

                        throw _iteratorError23;

                    case 32:
                        return _context15.finish(29);

                    case 33:
                        return _context15.finish(26);

                    case 34:
                        if (!unyieldedData.length) {
                            _context15.next = 39;
                            break;
                        }

                        _context15.next = 37;
                        return unyieldedData.shift();

                    case 37:
                        _context15.next = 34;
                        break;

                    case 39:
                    case 'end':
                        return _context15.stop();
                }
            }
        }, iterator, this, [[4, 22, 26, 34], [27,, 29, 33]]);
    });
}

/**
 * @sig
 * @description d
 * @param {*} data - a
 * @return {*} b
 */
function flatteningFunc(data) {
    return (0, _combinators.ifElse)(_functionalHelpers.isArray, mapData, (0, _combinators.when)(_functionalHelpers.isObject, (0, _combinators.when)(objectContainsOnlyArrays, getObjectKeysAsArray)), data);
}

/**
 * @sig
 * @description d
 * @param {*} data - a
 * @return {*} - b
 */
function mapData(data) {
    return Array.prototype.concat.apply([], data.map(function flattenArray(item) {
        return flatteningFunc(item);
    }));
}

/**
 * @sig
 * @description d
 * @param {*} data - a
 * @return {Array} - b
 */
function getObjectKeysAsArray(data) {
    return Object.keys(data).map(function _flattenKeys(key) {
        return flatteningFunc(data[key]);
    });
}

/**
 * @sig
 * @description d
 * @param {*} data - a
 * @return {boolean} - b
 */
function objectContainsOnlyArrays(data) {
    return Object.keys(data).every(function _isMadeOfArrays(key) {
        return (0, _functionalHelpers.isArray)(data[key]);
    });
}

/**
 * @sig
 * @description d
 * @param {*} xs - a
 * @param {function} fn - b
 * @return {generator} - c
 */
function chain(xs, fn) {
    return regeneratorRuntime.mark(function flatMapIterator() {
        var res, _iteratorNormalCompletion24, _didIteratorError24, _iteratorError24, _iterator24, _step24, _x19;

        return regeneratorRuntime.wrap(function flatMapIterator$(_context16) {
            while (1) {
                switch (_context16.prev = _context16.next) {
                    case 0:
                        _iteratorNormalCompletion24 = true;
                        _didIteratorError24 = false;
                        _iteratorError24 = undefined;
                        _context16.prev = 3;
                        _iterator24 = xs[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion24 = (_step24 = _iterator24.next()).done) {
                            _context16.next = 13;
                            break;
                        }

                        _x19 = _step24.value;

                        res = fn(_x19);
                        _context16.next = 10;
                        return Object.getPrototypeOf(xs).isPrototypeOf(res) ? res.value : res;

                    case 10:
                        _iteratorNormalCompletion24 = true;
                        _context16.next = 5;
                        break;

                    case 13:
                        _context16.next = 19;
                        break;

                    case 15:
                        _context16.prev = 15;
                        _context16.t0 = _context16['catch'](3);
                        _didIteratorError24 = true;
                        _iteratorError24 = _context16.t0;

                    case 19:
                        _context16.prev = 19;
                        _context16.prev = 20;

                        if (!_iteratorNormalCompletion24 && _iterator24.return) {
                            _iterator24.return();
                        }

                    case 22:
                        _context16.prev = 22;

                        if (!_didIteratorError24) {
                            _context16.next = 25;
                            break;
                        }

                        throw _iteratorError24;

                    case 25:
                        return _context16.finish(22);

                    case 26:
                        return _context16.finish(19);

                    case 27:
                    case 'end':
                        return _context16.stop();
                }
            }
        }, flatMapIterator, this, [[3, 15, 19, 27], [20,, 22, 26]]);
    });
}

/*
 function flatMap1(source, fn) {
    return function *flatMap1Iterator() {
        var results = [];
        for (let item of source) {
            var res = fn(item);
            if (res.length) {
                results = results.concat(res);
                yield results.shift();
            }
            else if (undefined !== res) {
                if (isArray(res)) {
                    yield res.shift();
                    results = results.concat(res);
                }
            }
            else yield res;
        }

        while (results.length) yield results.shift();
    };
 }
 */

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @return {generator} - b
 */
function flatten(xs) {
    return regeneratorRuntime.mark(function flattenIterator() {
        var unyieldedData, _iteratorNormalCompletion25, _didIteratorError25, _iteratorError25, _iterator25, _step25, _x20;

        return regeneratorRuntime.wrap(function flattenIterator$(_context17) {
            while (1) {
                switch (_context17.prev = _context17.next) {
                    case 0:
                        unyieldedData = [];
                        _iteratorNormalCompletion25 = true;
                        _didIteratorError25 = false;
                        _iteratorError25 = undefined;
                        _context17.prev = 4;
                        _iterator25 = xs[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion25 = (_step25 = _iterator25.next()).done) {
                            _context17.next = 19;
                            break;
                        }

                        _x20 = _step25.value;

                        if ((0, _functionalHelpers.isArray)(_x20)) unyieldedData = unyieldedData.concat(_x20);

                        if (!unyieldedData.length) {
                            _context17.next = 14;
                            break;
                        }

                        _context17.next = 12;
                        return unyieldedData.shift();

                    case 12:
                        _context17.next = 16;
                        break;

                    case 14:
                        _context17.next = 16;
                        return _x20;

                    case 16:
                        _iteratorNormalCompletion25 = true;
                        _context17.next = 6;
                        break;

                    case 19:
                        _context17.next = 25;
                        break;

                    case 21:
                        _context17.prev = 21;
                        _context17.t0 = _context17['catch'](4);
                        _didIteratorError25 = true;
                        _iteratorError25 = _context17.t0;

                    case 25:
                        _context17.prev = 25;
                        _context17.prev = 26;

                        if (!_iteratorNormalCompletion25 && _iterator25.return) {
                            _iterator25.return();
                        }

                    case 28:
                        _context17.prev = 28;

                        if (!_didIteratorError25) {
                            _context17.next = 31;
                            break;
                        }

                        throw _iteratorError25;

                    case 31:
                        return _context17.finish(28);

                    case 32:
                        return _context17.finish(25);

                    case 33:
                        if (!unyieldedData.length) {
                            _context17.next = 38;
                            break;
                        }

                        _context17.next = 36;
                        return unyieldedData.shift();

                    case 36:
                        _context17.next = 33;
                        break;

                    case 38:
                    case 'end':
                        return _context17.stop();
                }
            }
        }, flattenIterator, this, [[4, 21, 25, 33], [26,, 28, 32]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {object} groupObject - b
 * @param {function} queryableConstructor - c
 * @return {generator} - d
 */
function groupBy(xs, groupObject, queryableConstructor) {
    return regeneratorRuntime.mark(function groupByIterator() {
        var groupedData, _iteratorNormalCompletion26, _didIteratorError26, _iteratorError26, _iterator26, _step26, _x21;

        return regeneratorRuntime.wrap(function groupByIterator$(_context18) {
            while (1) {
                switch (_context18.prev = _context18.next) {
                    case 0:
                        //gather all data from the iterable before grouping
                        groupedData = nestLists(groupData(toArray(xs), groupObject), 0, null, queryableConstructor);
                        _iteratorNormalCompletion26 = true;
                        _didIteratorError26 = false;
                        _iteratorError26 = undefined;
                        _context18.prev = 4;
                        _iterator26 = groupedData[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion26 = (_step26 = _iterator26.next()).done) {
                            _context18.next = 13;
                            break;
                        }

                        _x21 = _step26.value;
                        _context18.next = 10;
                        return _x21;

                    case 10:
                        _iteratorNormalCompletion26 = true;
                        _context18.next = 6;
                        break;

                    case 13:
                        _context18.next = 19;
                        break;

                    case 15:
                        _context18.prev = 15;
                        _context18.t0 = _context18['catch'](4);
                        _didIteratorError26 = true;
                        _iteratorError26 = _context18.t0;

                    case 19:
                        _context18.prev = 19;
                        _context18.prev = 20;

                        if (!_iteratorNormalCompletion26 && _iterator26.return) {
                            _iterator26.return();
                        }

                    case 22:
                        _context18.prev = 22;

                        if (!_didIteratorError26) {
                            _context18.next = 25;
                            break;
                        }

                        throw _iteratorError26;

                    case 25:
                        return _context18.finish(22);

                    case 26:
                        return _context18.finish(19);

                    case 27:
                    case 'end':
                        return _context18.stop();
                }
            }
        }, groupByIterator, this, [[4, 15, 19, 27], [20,, 22, 26]]);
    });
}

/**
 * @sig
 * @description d
 * @param {*} data - a
 * @param {number} depth - b
 * @param {string} key - c
 * @param {function} queryableConstructor - d
 * @return {Array} - e
 */
function nestLists(data, depth, key, queryableConstructor) {
    if ((0, _functionalHelpers.isArray)(data)) {
        data = data.map(function _createLists(item) {
            if (null != item.key) return nestLists(item, depth + 1, item.key, queryableConstructor);
            return item;
        });
    }
    if (0 !== depth) {
        data = queryableConstructor(data, null, null, key);
    }
    return data;
}

/**
 * @sig
 * @description d
 * @param {*} xs - a
 * @param {object} groupObject - b
 * @return {Array} - c
 */
function groupData(xs, groupObject) {
    var sortedData = (0, _sortHelpers.sortData)(xs, groupObject),
        retData = [];
    sortedData.forEach(function _groupSortedData(item) {
        var grp = retData;
        groupObject.forEach(function _createGroupsByFields(group) {
            grp = findGroup(grp, group.keySelector(item));
        });
        grp.push(item);
    });

    return retData;
}

/**
 * @sig
 * @description d
 * @param {Array} arr - a
 * @param {string} field - b
 * @return {Array} - c
 */
function findGroup(arr, field) {
    var grp;
    if (arr.some(function _findGroup(group) {
        if (group.key === field) {
            grp = group;
            return true;
        }
    })) return grp;else {
        grp = [];
        grp.key = field;
        //objectSet(field, 'key', grp);
        arr.push(grp);
        return grp;
    }
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} fn - b
 * @return {generator} - c
 */
function map(xs, fn) {
    return regeneratorRuntime.mark(function mapIterator() {
        var _iteratorNormalCompletion27, _didIteratorError27, _iteratorError27, _iterator27, _step27, _x22, res;

        return regeneratorRuntime.wrap(function mapIterator$(_context19) {
            while (1) {
                switch (_context19.prev = _context19.next) {
                    case 0:
                        _iteratorNormalCompletion27 = true;
                        _didIteratorError27 = false;
                        _iteratorError27 = undefined;
                        _context19.prev = 3;
                        _iterator27 = xs[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion27 = (_step27 = _iterator27.next()).done) {
                            _context19.next = 14;
                            break;
                        }

                        _x22 = _step27.value;
                        res = fn(_x22);

                        if ((0, _functionalHelpers.strictEquals)(_helpers.javaScriptTypes.Undefined, (0, _functionalHelpers.type)(res))) {
                            _context19.next = 11;
                            break;
                        }

                        _context19.next = 11;
                        return res;

                    case 11:
                        _iteratorNormalCompletion27 = true;
                        _context19.next = 5;
                        break;

                    case 14:
                        _context19.next = 20;
                        break;

                    case 16:
                        _context19.prev = 16;
                        _context19.t0 = _context19['catch'](3);
                        _didIteratorError27 = true;
                        _iteratorError27 = _context19.t0;

                    case 20:
                        _context19.prev = 20;
                        _context19.prev = 21;

                        if (!_iteratorNormalCompletion27 && _iterator27.return) {
                            _iterator27.return();
                        }

                    case 23:
                        _context19.prev = 23;

                        if (!_didIteratorError27) {
                            _context19.next = 26;
                            break;
                        }

                        throw _iteratorError27;

                    case 26:
                        return _context19.finish(23);

                    case 27:
                        return _context19.finish(20);

                    case 28:
                    case 'end':
                        return _context19.stop();
                }
            }
        }, mapIterator, this, [[3, 16, 20, 28], [21,, 23, 27]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {Array} orderObject - b
 * @return {generator} - d
 */
function sortBy(xs, orderObject) {
    return regeneratorRuntime.mark(function orderByIterator() {
        var x_s, _iteratorNormalCompletion28, _didIteratorError28, _iteratorError28, _iterator28, _step28, _x23;

        return regeneratorRuntime.wrap(function orderByIterator$(_context20) {
            while (1) {
                switch (_context20.prev = _context20.next) {
                    case 0:
                        //gather all data from the xs before sorting
                        x_s = (0, _sortHelpers.sortData)(toArray(xs), orderObject);
                        _iteratorNormalCompletion28 = true;
                        _didIteratorError28 = false;
                        _iteratorError28 = undefined;
                        _context20.prev = 4;
                        _iterator28 = x_s[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion28 = (_step28 = _iterator28.next()).done) {
                            _context20.next = 13;
                            break;
                        }

                        _x23 = _step28.value;
                        _context20.next = 10;
                        return _x23;

                    case 10:
                        _iteratorNormalCompletion28 = true;
                        _context20.next = 6;
                        break;

                    case 13:
                        _context20.next = 19;
                        break;

                    case 15:
                        _context20.prev = 15;
                        _context20.t0 = _context20['catch'](4);
                        _didIteratorError28 = true;
                        _iteratorError28 = _context20.t0;

                    case 19:
                        _context20.prev = 19;
                        _context20.prev = 20;

                        if (!_iteratorNormalCompletion28 && _iterator28.return) {
                            _iterator28.return();
                        }

                    case 22:
                        _context20.prev = 22;

                        if (!_didIteratorError28) {
                            _context20.next = 25;
                            break;
                        }

                        throw _iteratorError28;

                    case 25:
                        return _context20.finish(22);

                    case 26:
                        return _context20.finish(19);

                    case 27:
                    case 'end':
                        return _context20.stop();
                }
            }
        }, orderByIterator, this, [[4, 15, 19, 27], [20,, 22, 26]]);
    });
}

/**
 * @sig
 * @description d
 * @param {list_core} xs - a
 * @param {list_core} ys - b
 * @param {function} comparer - c
 * @return {boolean} - d
 */
function equals(xs, ys) {
    var comparer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _functionalHelpers.strictEquals;

    var x_s = xs.data,
        y_s = ys.data;

    return x_s.length === y_s.length && x_s.every(function _checkEquality(x, idx) {
        return comparer(x, y_s[idx]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {generator} - c
 */
function takeWhile(xs, predicate) {
    return regeneratorRuntime.mark(function takeWhileIterator() {
        var _iteratorNormalCompletion29, _didIteratorError29, _iteratorError29, _iterator29, _step29, _x25;

        return regeneratorRuntime.wrap(function takeWhileIterator$(_context21) {
            while (1) {
                switch (_context21.prev = _context21.next) {
                    case 0:
                        _iteratorNormalCompletion29 = true;
                        _didIteratorError29 = false;
                        _iteratorError29 = undefined;
                        _context21.prev = 3;
                        _iterator29 = xs[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion29 = (_step29 = _iterator29.next()).done) {
                            _context21.next = 16;
                            break;
                        }

                        _x25 = _step29.value;

                        if (!predicate(_x25)) {
                            _context21.next = 12;
                            break;
                        }

                        _context21.next = 10;
                        return _x25;

                    case 10:
                        _context21.next = 13;
                        break;

                    case 12:
                        return _context21.abrupt('break', 16);

                    case 13:
                        _iteratorNormalCompletion29 = true;
                        _context21.next = 5;
                        break;

                    case 16:
                        _context21.next = 22;
                        break;

                    case 18:
                        _context21.prev = 18;
                        _context21.t0 = _context21['catch'](3);
                        _didIteratorError29 = true;
                        _iteratorError29 = _context21.t0;

                    case 22:
                        _context21.prev = 22;
                        _context21.prev = 23;

                        if (!_iteratorNormalCompletion29 && _iterator29.return) {
                            _iterator29.return();
                        }

                    case 25:
                        _context21.prev = 25;

                        if (!_didIteratorError29) {
                            _context21.next = 28;
                            break;
                        }

                        throw _iteratorError29;

                    case 28:
                        return _context21.finish(25);

                    case 29:
                        return _context21.finish(22);

                    case 30:
                    case 'end':
                        return _context21.stop();
                }
            }
        }, takeWhileIterator, this, [[3, 18, 22, 30], [23,, 25, 29]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} predicate - b
 * @return {generator} - c
 */
function skipWhile(xs, predicate) {
    return regeneratorRuntime.mark(function skipWhileIterator() {
        var hasFailed, _iteratorNormalCompletion30, _didIteratorError30, _iteratorError30, _iterator30, _step30, _x26;

        return regeneratorRuntime.wrap(function skipWhileIterator$(_context22) {
            while (1) {
                switch (_context22.prev = _context22.next) {
                    case 0:
                        hasFailed = false;
                        _iteratorNormalCompletion30 = true;
                        _didIteratorError30 = false;
                        _iteratorError30 = undefined;
                        _context22.prev = 4;
                        _iterator30 = xs[Symbol.iterator]();

                    case 6:
                        if (_iteratorNormalCompletion30 = (_step30 = _iterator30.next()).done) {
                            _context22.next = 20;
                            break;
                        }

                        _x26 = _step30.value;

                        if (hasFailed) {
                            _context22.next = 15;
                            break;
                        }

                        if (predicate(_x26)) {
                            _context22.next = 13;
                            break;
                        }

                        hasFailed = true;
                        _context22.next = 13;
                        return _x26;

                    case 13:
                        _context22.next = 17;
                        break;

                    case 15:
                        _context22.next = 17;
                        return _x26;

                    case 17:
                        _iteratorNormalCompletion30 = true;
                        _context22.next = 6;
                        break;

                    case 20:
                        _context22.next = 26;
                        break;

                    case 22:
                        _context22.prev = 22;
                        _context22.t0 = _context22['catch'](4);
                        _didIteratorError30 = true;
                        _iteratorError30 = _context22.t0;

                    case 26:
                        _context22.prev = 26;
                        _context22.prev = 27;

                        if (!_iteratorNormalCompletion30 && _iterator30.return) {
                            _iterator30.return();
                        }

                    case 29:
                        _context22.prev = 29;

                        if (!_didIteratorError30) {
                            _context22.next = 32;
                            break;
                        }

                        throw _iteratorError30;

                    case 32:
                        return _context22.finish(29);

                    case 33:
                        return _context22.finish(26);

                    case 34:
                    case 'end':
                        return _context22.stop();
                }
            }
        }, skipWhileIterator, this, [[4, 22, 26, 34], [27,, 29, 33]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @return {generator} - b
 */
function reverse(xs) {
    return regeneratorRuntime.mark(function reverseIterator() {
        var _iteratorNormalCompletion31, _didIteratorError31, _iteratorError31, _iterator31, _step31, _x27;

        return regeneratorRuntime.wrap(function reverseIterator$(_context23) {
            while (1) {
                switch (_context23.prev = _context23.next) {
                    case 0:
                        _iteratorNormalCompletion31 = true;
                        _didIteratorError31 = false;
                        _iteratorError31 = undefined;
                        _context23.prev = 3;
                        _iterator31 = toArray(xs).reverse()[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion31 = (_step31 = _iterator31.next()).done) {
                            _context23.next = 12;
                            break;
                        }

                        _x27 = _step31.value;
                        _context23.next = 9;
                        return _x27;

                    case 9:
                        _iteratorNormalCompletion31 = true;
                        _context23.next = 5;
                        break;

                    case 12:
                        _context23.next = 18;
                        break;

                    case 14:
                        _context23.prev = 14;
                        _context23.t0 = _context23['catch'](3);
                        _didIteratorError31 = true;
                        _iteratorError31 = _context23.t0;

                    case 18:
                        _context23.prev = 18;
                        _context23.prev = 19;

                        if (!_iteratorNormalCompletion31 && _iterator31.return) {
                            _iterator31.return();
                        }

                    case 21:
                        _context23.prev = 21;

                        if (!_didIteratorError31) {
                            _context23.next = 24;
                            break;
                        }

                        throw _iteratorError31;

                    case 24:
                        return _context23.finish(21);

                    case 25:
                        return _context23.finish(18);

                    case 26:
                    case 'end':
                        return _context23.stop();
                }
            }
        }, reverseIterator, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    });
}

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @param {number} count - b
 * @return {generator} - c
 */
function repeat(item, count) {
    return regeneratorRuntime.mark(function repeatIterator() {
        var i;
        return regeneratorRuntime.wrap(function repeatIterator$(_context24) {
            while (1) {
                switch (_context24.prev = _context24.next) {
                    case 0:
                        i = 0;

                    case 1:
                        if (!(i < count)) {
                            _context24.next = 7;
                            break;
                        }

                        _context24.next = 4;
                        return item;

                    case 4:
                        ++i;
                        _context24.next = 1;
                        break;

                    case 7:
                    case 'end':
                        return _context24.stop();
                }
            }
        }, repeatIterator, this);
    });
}

/**
 * @sig
 * @description d
 * @param {number} idx - a
 * @param {number} start - b
 * @param {number} end - c
 * @param {list_core} xs - d
 * @returns {generator} - e
 */
function copyWithin(idx, start, end, xs) {
    return regeneratorRuntime.mark(function copyWithinIterator() {
        var _iteratorNormalCompletion32, _didIteratorError32, _iteratorError32, _iterator32, _step32, _x28;

        return regeneratorRuntime.wrap(function copyWithinIterator$(_context25) {
            while (1) {
                switch (_context25.prev = _context25.next) {
                    case 0:
                        _iteratorNormalCompletion32 = true;
                        _didIteratorError32 = false;
                        _iteratorError32 = undefined;
                        _context25.prev = 3;
                        _iterator32 = toArray(xs).copyWithin(idx, start, end)[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion32 = (_step32 = _iterator32.next()).done) {
                            _context25.next = 12;
                            break;
                        }

                        _x28 = _step32.value;
                        _context25.next = 9;
                        return _x28;

                    case 9:
                        _iteratorNormalCompletion32 = true;
                        _context25.next = 5;
                        break;

                    case 12:
                        _context25.next = 18;
                        break;

                    case 14:
                        _context25.prev = 14;
                        _context25.t0 = _context25['catch'](3);
                        _didIteratorError32 = true;
                        _iteratorError32 = _context25.t0;

                    case 18:
                        _context25.prev = 18;
                        _context25.prev = 19;

                        if (!_iteratorNormalCompletion32 && _iterator32.return) {
                            _iterator32.return();
                        }

                    case 21:
                        _context25.prev = 21;

                        if (!_didIteratorError32) {
                            _context25.next = 24;
                            break;
                        }

                        throw _iteratorError32;

                    case 24:
                        return _context25.finish(21);

                    case 25:
                        return _context25.finish(18);

                    case 26:
                    case 'end':
                        return _context25.stop();
                }
            }
        }, copyWithinIterator, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    });
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @param {number} start - b
 * @param {number} end - c
 * @param {Array} xs - d
 * @return {generator} - e
 */
function fill(val, start, end, xs) {
    return regeneratorRuntime.mark(function fillIterator() {
        var _iteratorNormalCompletion33, _didIteratorError33, _iteratorError33, _iterator33, _step33, _x29;

        return regeneratorRuntime.wrap(function fillIterator$(_context26) {
            while (1) {
                switch (_context26.prev = _context26.next) {
                    case 0:
                        _iteratorNormalCompletion33 = true;
                        _didIteratorError33 = false;
                        _iteratorError33 = undefined;
                        _context26.prev = 3;
                        _iterator33 = toArray(xs).fill(val, start, end)[Symbol.iterator]();

                    case 5:
                        if (_iteratorNormalCompletion33 = (_step33 = _iterator33.next()).done) {
                            _context26.next = 12;
                            break;
                        }

                        _x29 = _step33.value;
                        _context26.next = 9;
                        return _x29;

                    case 9:
                        _iteratorNormalCompletion33 = true;
                        _context26.next = 5;
                        break;

                    case 12:
                        _context26.next = 18;
                        break;

                    case 14:
                        _context26.prev = 14;
                        _context26.t0 = _context26['catch'](3);
                        _didIteratorError33 = true;
                        _iteratorError33 = _context26.t0;

                    case 18:
                        _context26.prev = 18;
                        _context26.prev = 19;

                        if (!_iteratorNormalCompletion33 && _iterator33.return) {
                            _iterator33.return();
                        }

                    case 21:
                        _context26.prev = 21;

                        if (!_didIteratorError33) {
                            _context26.next = 24;
                            break;
                        }

                        throw _iteratorError33;

                    case 24:
                        return _context26.finish(21);

                    case 25:
                        return _context26.finish(18);

                    case 26:
                    case 'end':
                        return _context26.stop();
                }
            }
        }, fillIterator, this, [[3, 14, 18, 26], [19,, 21, 25]]);
    });
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} comparer - b
 * @return {Number} - c
 */
function findIndex(xs) {
    var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.strictEquals;

    return toArray(xs).findIndex(comparer);
}

/**
 * @sig
 * @description d
 * @param {Array|generator} xs - a
 * @param {function} comparer - b
 * @return {Number} - c
 */
function findLastIndex(xs) {
    var comparer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _functionalHelpers.strictEquals;

    return toArray(xs).length - toArray(xs).reverse().findIndex(comparer);
}

var unfold = _decorators.unfoldWith;

exports.all = all;
exports.any = any;
exports.except = except;
exports.intersect = intersect;
exports.union = union;
exports.map = map;
exports.chain = chain;
exports.groupBy = groupBy;
exports.sortBy = sortBy;
exports.prepend = prepend;
exports.concat = concat;
exports.groupJoin = groupJoin;
exports.join = join;
exports.zip = zip;
exports.filter = filter;
exports.intersperse = intersperse;
exports.contains = contains;
exports.first = first;
exports.last = last;
exports.count = count;
exports.foldLeft = foldLeft;
exports.reduceRight = reduceRight;
exports.distinct = distinct;
exports.ofType = ofType;
exports.binarySearch = binarySearch;
exports.equals = equals;
exports.takeWhile = takeWhile;
exports.skipWhile = skipWhile;
exports.reverse = reverse;
exports.copyWithin = copyWithin;
exports.fill = fill;
exports.findIndex = findIndex;
exports.findLastIndex = findLastIndex;
exports.repeat = repeat;
exports.foldRight = foldRight;
exports.unfold = unfold;

},{"../combinators":1,"../decorators":24,"../functionalHelpers":26,"../helpers":27,"./sortHelpers":23}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.constant_monad = exports.Constant = undefined;

var _constant_functor = require('../functors/constant_functor');

var _containerHelpers = require('../containerHelpers');

function Constant(val) {
    return Object.create(constant_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {constant_monad} - b
 */
Constant.of = function _of(item) {
    return Constant(item);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Constant.is = function (m) {
    return constant_monad.isPrototypeOf(m);
};

var constant_monad = Object.create(_constant_functor.constant_functor, {
    chain: {
        value: function _chain() {
            return this;
        }
    },
    fold: {
        value: function _fold(f) {
            return f(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.of(this.value);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return this.of(this.value);
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Constant),
        writable: false,
        configurable: false
    },
    factory: {
        value: Constant
    }
});

constant_monad.mjoin = _containerHelpers.mjoin;
constant_monad.apply = _containerHelpers.apply;

constant_monad.ap = constant_monad.apply;
constant_monad.fmap = constant_monad.chain;
constant_monad.flapMap = constant_monad.chain;
constant_monad.bind = constant_monad.chain;
constant_monad.reduce = constant_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
constant_monad.constructor = constant_monad.factory;

exports.Constant = Constant;
exports.constant_monad = constant_monad;

},{"../containerHelpers":2,"../functors/constant_functor":3}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.left_monad = exports.right_monad = exports.Right = exports.Left = exports.Either = undefined;

var _either_functor = require('../functors/either_functor');

var _combinators = require('../../combinators');

var _containerHelpers = require('../containerHelpers');

function Either(val, fork) {
    return 'right' === fork ? Object.create(right_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isRight: {
            value: true,
            writable: false,
            configurable: false
        },
        isLeft: {
            value: false,
            writable: false,
            configurable: false
        }
    }) : Object.create(left_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isRight: {
            value: false,
            writable: false,
            configurable: false
        },
        isLeft: {
            value: true,
            writable: false,
            configurable: false
        }
    });
}

Either.of = function _of(val) {
    return Either(val, 'right');
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Either.is = function (m) {
    return left_monad.isPrototypeOf(m) || right_monad.isPrototypeOf(m);
};

Either.Left = function _left(val) {
    return Either(val);
};

Either.Right = function _right(val) {
    return Either(val, 'right');
};

Either.isLeft = function _isLeft(ma) {
    return ma.isLeft;
};

Either.isRight = function _isRight(ma) {
    return ma.isRight;
};

function Left(val) {
    return Either(val);
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {left_monad} - b
 */
Left.of = function (val) {
    return Left(val);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Left.is = function (m) {
    return left_monad.isPrototypeOf(m);
};

function Right(val) {
    return Either(val, 'right');
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {right_monad} - b
 */
Right.of = function (val) {
    return Right(val);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Right.is = function (m) {
    return right_monad.isPrototypeOf(m);
};

var right_monad = Object.create(_either_functor.right_functor, {
    map: {
        value: _containerHelpers.sharedEitherFns.rightMap
    },
    bimap: {
        value: _containerHelpers.sharedEitherFns.rightBiMap
    },
    fold: {
        value: function _fold(fn) {
            return fn(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(_combinators.identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f, g) {
            return f(this.value).map(this.of);
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Right),
        writable: false,
        configurable: false
    },
    factory: {
        value: Either
    }
});

right_monad.chain = _containerHelpers.chain;
right_monad.mjoin = _containerHelpers.mjoin;
right_monad.apply = _containerHelpers.apply;

var left_monad = Object.create(_either_functor.left_functor, {
    map: {
        value: _containerHelpers.sharedEitherFns.leftMapMaker(Left)
    },
    bimap: {
        value: _containerHelpers.sharedEitherFns.leftBimapMaker(Left)
    },
    fold: {
        value: function _fold(fn) {
            return fn(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(_combinators.identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return a.of(Left(this.value));
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Right),
        writable: false,
        configurable: false
    },
    factory: {
        value: Either
    }
});

left_monad.chain = _containerHelpers.chain;
left_monad.mjoin = _containerHelpers.mjoin;
left_monad.apply = _containerHelpers.apply;

right_monad.ap = right_monad.apply;
left_monad.ap = left_monad.apply;
right_monad.flatMap = right_monad.chain;
left_monad.flatMap = left_monad.chain;
right_monad.bind = right_monad.chain;
left_monad.bind = left_monad.chain;
right_monad.reduce = right_monad.fold;
left_monad.reduce = left_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
right_monad.constructor = right_monad.factory;
left_monad.constructor = left_monad.factory;

exports.Either = Either;
exports.Left = Left;
exports.Right = Right;
exports.right_monad = right_monad;
exports.left_monad = left_monad;

},{"../../combinators":1,"../containerHelpers":2,"../functors/either_functor":4}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.future_monad = exports.Future = undefined;

var _future_functor = require('../functors/future_functor');

var _functionalHelpers = require('../../functionalHelpers');

var _containerHelpers = require('../containerHelpers');

function safeFork(reject, resolve) {
    return function _safeFork(val) {
        try {
            return resolve(val);
        } catch (ex) {
            reject(ex);
        }
    };
}

function Future(f) {
    return Object.create(future_monad, {
        _value: {
            value: f,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {function|*} val - a
 * @return {future_functor} - b
 */
Future.of = function _of(val) {
    return 'function' === typeof val ? Future(val) : Future(function (_, resolve) {
        return safeFork(_functionalHelpers.noop, resolve(val));
    });
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Future.is = function (m) {
    return future_monad.isPrototypeOf(m);
};

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {future_functor} - b
 */
Future.reject = function _reject(val) {
    return Future(function (reject, resolve) {
        return reject(val);
    });
};

Future.unit = function _unit(val) {
    return Future(val).complete();
};

var future_monad = Object.create(_future_functor.future_functor, {
    chain: {
        //TODO: probably need to compose here, not actually map over the value; this is a temporary fill-in until
        //TODO: I have time to finish working on the Future
        value: function _chain(fn) {
            var _this = this;

            return this.of(function (reject, resolve) {
                var cancel = void 0,
                    outerFork = _this._fork(function (a) {
                    return reject(a);
                }, function (b) {
                    cancel = fn(b).fork(reject, resolve);
                });
                return cancel ? cancel : (cancel = outerFork, function (x) {
                    return cancel();
                });
            });
        }
    },
    fold: {
        value: function _fold(f, g) {
            var _this2 = this;

            return this.of(function (reject, resolve) {
                return _this2.fork(function (a) {
                    return resolve(f(a));
                }, function (b) {
                    return resolve(g(b));
                });
            });
        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return this.fold(function _reductioAdAbsurdum(xs, x) {
                fn(x).map(function _map(x) {
                    return function _map_(y) {
                        return y.concat([x]);
                    };
                }).ap(xs);
                return fa(this.empty);
            });
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Future),
        writable: false,
        configurable: false
    },
    factory: {
        value: Future
    }
});

future_monad.mjoin = _containerHelpers.mjoin;
future_monad.apply = _containerHelpers.apply;

future_monad.ap = future_monad.apply;
future_monad.fmap = future_monad.chain;
future_monad.flapMap = future_monad.chain;
future_monad.bind = future_monad.chain;
future_monad.reduce = future_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
future_monad.constructor = future_monad.factory;

exports.Future = Future;
exports.future_monad = future_monad;

},{"../../functionalHelpers":26,"../containerHelpers":2,"../functors/future_functor":6}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.identity_monad = exports.Identity = undefined;

var _identity_functor = require('../functors/identity_functor');

var _helpers = require('../../helpers');

var _combinators = require('../../combinators');

var _containerHelpers = require('../containerHelpers');

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {identity_monad} - b
 */
function Identity(item) {
    return Object.create(identity_monad, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {identity_monad} - b
 */
Identity.of = function _of(item) {
    return Identity(item);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Identity.is = function (m) {
    return identity_monad.isPrototypeOf(m);
};

/**
 * @sig
 * @description d
 * @return {identity_monad} - a
 */
Identity.empty = function _empty() {
    return this.of(Object.create(_helpers.emptyObject));
};

var identity_monad = Object.create(_identity_functor.identity_functor, {
    fold: {
        value: function _fold(fn) {
            return fn(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(_combinators.identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return f(this.value).map(this.of);
        }
    },
    empty: {
        value: function _empty() {
            return this.of(Object.create(_helpers.emptyObject));
        }
    },
    isEmpty: {
        get: function _getIsEmpty() {
            return _helpers.emptyObject.isPrototypeOf(this.value);
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Identity),
        writable: false,
        configurable: false
    },
    factory: {
        value: Identity
    }
});

identity_monad.chain = _containerHelpers.chain;
identity_monad.mjoin = _containerHelpers.mjoin;
identity_monad.apply = _containerHelpers.apply;

identity_monad.ap = identity_monad.apply;
identity_monad.fmap = identity_monad.chain;
identity_monad.flapMap = identity_monad.chain;
identity_monad.bind = identity_monad.chain;
identity_monad.reduce = identity_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
identity_monad.constructor = identity_monad.factory;

exports.Identity = Identity;
exports.identity_monad = identity_monad;

},{"../../combinators":1,"../../helpers":27,"../containerHelpers":2,"../functors/identity_functor":7}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.io_monad = exports.Io = undefined;

var _io_functor = require('../functors/io_functor');

var _combinators = require('../../combinators');

var _containerHelpers = require('../containerHelpers');

function Io(val) {
    return Object.create(io_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

Io.of = function _of(val) {
    return 'function' === typeof val ? Io(val) : Io(function _wrapper() {
        return val;
    });
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Io.is = function (m) {
    return io_monad.isPrototypeOf(m);
};

var io_monad = Object.create(_io_functor.io_functor, {
    fold: {
        value: function _fold(fn, x) {
            return fn(this.value, x);
        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return this.fold(function _reductioAdAbsurdum(xs, x) {
                fn(x).map(function _map(x) {
                    return function _map_(y) {
                        return y.concat([x]);
                    };
                }).ap(xs);
                return fa(this.empty);
            });
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Io),
        writable: false,
        configurable: false
    },
    factory: {
        value: Io
    }
});

io_monad.chain = _containerHelpers.chain;
io_monad.mjoin = _containerHelpers.mjoin;
io_monad.apply = _containerHelpers.apply;

io_monad.ap = io_monad.apply;
io_monad.fmap = io_monad.chain;
io_monad.flapMap = io_monad.chain;
io_monad.bind = io_monad.chain;
io_monad.reduce = io_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
io_monad.constructor = io_monad.factory;

exports.Io = Io;
exports.io_monad = io_monad;

},{"../../combinators":1,"../containerHelpers":2,"../functors/io_functor":8}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ordered_list_monad = exports.list_monad = exports.List = undefined;

var _list_functor = require('../functors/list_functor');

var _helpers = require('../../helpers');

var _list_iterators = require('../list_iterators');

var _functionalHelpers = require('../../functionalHelpers');

var _combinators = require('../../combinators');

var _list_helpers = require('../list_helpers');

/**
 * @sig
 * @description d
 * @param {*} source - a
 * @return {list_monad} - b
 */
var listFromNonGen = function listFromNonGen(source) {
    return createListDelegateInstance(source && source[Symbol.iterator] ? source : (0, _functionalHelpers.wrap)(source));
};

/**
 * @sig
 * @description d
 * @param {generator} source - a
 * @return {list_monad} - b
 */
var listFromGen = function listFromGen(source) {
    return createListDelegateInstance((0, _functionalHelpers.invoke)(source));
};

/**
 * @sig
 * @description Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @param {*} source - Any type, any value; used as the underlying source of the List
 * @return {list_monad} - A new List instance with the value provided as the underlying source.
 */
//TODO: should I exclude strings from being used as a source directly, or allow it because
//TODO: they have an iterator?
function List(source) {
    return (0, _combinators.ifElse)((0, _functionalHelpers.delegatesFrom)(_helpers.generatorProto), listFromGen, listFromNonGen, source);
}

/**
 * @sig
 * @description Convenience function for create a new List instance; internally calls List.
 * @see List
 * @param {*} source - Any type, any value; used as the underlying source of the List
 * @return {list_monad} - A new List instance with the value provided as the underlying source.
 */
List.from = function (source) {
    return List(source);
};

/**
 * @sig
 * @description Alias for List.from
 * @see List.from
 * @type {function}
 * @param {*} - a
 * @return {list_monad} - b
 */
List.of = List.from;

//TODO: implement this so that a consumer can initiate a List as ordered
List.ordered = function (source) {
    return source;
};

/**
 * @sig
 * @description d
 * @return {list_monad} - a
 */
List.empty = function () {
    return List([]);
};

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {list_monad} - b
 */
List.just = function (val) {
    return List([val]);
};

/**
 * @sig
 * @description d
 * @param {function|generator} fn - a
 * @param {*} seed - b
 * @return {list_monad} - c
 */
List.unfold = function (fn, seed) {
    return createListDelegateInstance((0, _list_iterators.unfold)(fn)(seed));
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
List.is = function (m) {
    return list_monad.isPrototypeOf(m) || ordered_list_monad.isPrototypeOf(m);
};

/**
 * @sig
 * @description Generates a new list with the specified item repeated the specified number of times. Because
 * this generates a list with the same item repeated n times, the resulting List is trivially
 * sorted. Thus, a sorted List is returned rather than an unsorted list.
 * @param {*} item - a
 * @param {number} count - b
 * @return {ordered_list_monad} - c
 */
List.repeat = function _repeat(item, count) {
    return createListDelegateInstance([], (0, _list_iterators.repeat)(item, count), [{ keySelector: _functionalHelpers.noop, comparer: _functionalHelpers.noop, direction: _helpers.sortDirection.descending }]);
};

/**
 * @sig
 * @summary Extension function that allows new functionality to be applied to
 * the queryable object
 * @param {string} propName - The name of the new property that should exist on the List; must be unique
 * @param {function} fn - A function that defines the new List functionality and
 * will be called when this new List property is invoked.
 * @return {List} - a
 *
 * @description The fn parameter must be a non-generator function that takes one or more
 * arguments. If this new List function should be an immediately evaluated
 * function (like: take, any, reverse, etc.), it merely needs the accept one or more
 * arguments and know how to iterate the source. In the case of an immediately evaluated
 * function, the return type can be any javascript type. The first argument is always the
 * previous List instance that must be iterated. Additional arguments may be specified
 * if desired.
 *
 * If the function's evaluation should be deferred it needs to work a bit differently.
 * In this case, the function should accept one or more arguments, the first and only
 * required argument being the underlying source of the List object. This underlying
 * source can be anything with an iterator (generator, array, map, set, another queryable).
 * Any additional arguments that the function needs should be specified in the signature.
 * The return value of the function should be a generator that knows how to iterate the
 * underlying source. If the generator should operate like most List functions, i.e.
 * take a single item, process it, and then yield it out before asking for the next, a
 * for-of loop is the preferred method for employment. However, if the generator needs
 * all of the underlying data upfront (like orderBy and groupBy), Array.from is the
 * preferred method. Array.from will 'force' all the underlying List instances
 * to evaluate their data before it is handed over in full to the generator. The generator
 * can then act with full knowledge of the data and perform whatever operation is needed
 * before ultimately yielding out a single item at a time. If your extension function
 * needs to yield out all items at once, then that function is not a lazy evaluation
 * function and should be constructed like the immediately evaluated functions described
 * above.
 */
List.extend = function _extend(propName, fn) {
    if (!(propName in _list_functor.list_functor) && !(propName in _list_functor.ordered_list_functor)) {
        //TODO: this should probably be changed, other wise I am altering the applicative list_functor in
        //TODO: addition to the monadic list_functor. I'll also need to recreate the 'toEvaluatedList' function
        //TODO: since using it on a monadic list_functor would result in a list_a, not a list_m.
        _list_functor.list_core[propName] = function _extension() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return createListDelegateInstance(this, fn.apply(undefined, [this].concat(args)));
        };
    }
    return List;
};

var list_monad = Object.create(_list_functor.list_functor, {
    chain: {
        /**
         * @sig
         * @description d
         * @param {function} fn - a
         * @return {list_monad} - b
         */
        value: function _chain(fn) {
            return this.of((0, _list_iterators.chain)(this, fn));
        }
    },
    groupBy: {
        value: function _groupBy(keySelector, comparer) {
            var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.ascending }];
            return this.of(this, (0, _list_iterators.groupBy)(this, groupObj, createGroupedListDelegate));
        }
    },
    groupByDescending: {
        value: function _groupByDescending(keySelector, comparer) {
            var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.descending }];
            return this.of(this, (0, _list_iterators.groupBy)(this, groupObj, createGroupedListDelegate));
        }
    },
    groupJoin: {
        value: function _groupJoin(ys, xSelector, ySelector, projector, comparer) {
            return this.of(this, (0, _list_iterators.groupJoin)(this, ys, xSelector, ySelector, projector, createGroupedListDelegate, comparer));
        }
    },
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    fold: {
        value: function _fold(fn, x) {
            return fn(this.value, x);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(p, _combinators.identity);
        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return this.value.reduce(function _reduce(xs, x) {
                fn(x).map(function (x) {
                    return function (y) {
                        return y.concat([x]);
                    };
                }).apply(xs);
            }, fa.of(List.of()));

            /*
            return this.fold(function _reductioAdAbsurdum(xs, x) {
                fn(x).map(function _map(x) {
                    return function _map_(y) {
                        return y.concat([x]);
                    };
                }).ap(xs);
                return fa(this.empty);
            });*/

            //TODO: this exists inside the traverse function. Function should take a typeRep + fn
            /*
             var xs = this;
             function go(idx, n) {
                 switch (n) {
                     case 0: return of(typeRep, []);
                     case 2: return lift2(pair, f(xs[idx]), f(xs[idx + 1]));
                     default:
                         var m = Math.floor(n / 4) * 2;
                         return lift2(concat_, go(idx, m), go(idx + m, n - m));
                }
             }
             return this.length % 2 === 1 ?
                 lift2(concat_, map(Array$of, f(this[0])), go(1, this.length - 1)) :
                 go(0, this.length);
             */
        }
    },
    /**
     * @sig
     * @description Applies a function contained in another functor to the source
     * of this List object instance's underlying source. A new List object instance
     * is returned.
     * @param {Object} ma - a
     * @return {list_monad} - b
     */
    apply: {
        value: function _apply(ma) {
            return this.map(ma.value);
        }
    },
    of: {
        value: function _of(val, iterator, sortObj) {
            return createListDelegateInstance(val, iterator, sortObj);
        }
    },
    factory: {
        value: List
    }
});

list_monad.ap = list_monad.apply;
list_monad.fmap = list_monad.chain;
list_monad.flapMap = list_monad.chain;
list_monad.bind = list_monad.chain;

var ordered_list_monad = Object.create(_list_functor.ordered_list_functor, {
    /**
     * @description:
     * @param: {function} fn
     * @return: {@see m_list}
     */
    chain: {
        value: function _chain(fn) {
            return this.of((0, _list_iterators.chain)(this, fn));
        }
    },
    groupBy: {
        value: function _groupBy(keySelector, comparer) {
            var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.ascending }];
            return this.of(this, (0, _list_iterators.groupBy)(this, groupObj, createGroupedListDelegate));
        }
    },
    groupByDescending: {
        value: function _groupByDescending(keySelector, comparer) {
            var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: _helpers.sortDirection.descending }];
            return this.of(this, (0, _list_iterators.groupBy)(this, groupObj, createGroupedListDelegate));
        }
    },
    groupJoin: {
        value: function _groupJoin(ys, xSelector, ySelector, projector, comparer) {
            return this.of(this, (0, _list_iterators.groupJoin)(this, ys, xSelector, ySelector, projector, createGroupedListDelegate, comparer));
        }
    },
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    fold: {
        value: function _fold(fn, x) {
            return fn(this.value, x);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(p, _combinators.identity);
        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return this.reduce(function (ys, x) {
                return fn(x).map(function (x) {
                    return function (y) {
                        return y.concat([x]);
                    };
                }).apply(ys);
            }, fa.of(this.empty));
        }
    },
    apply: {
        value: function _apply(ma) {
            return this.map(ma.value);
        }
    },
    of: {
        value: function _of(val, iterator, sortObj) {
            return createListDelegateInstance(val, iterator, sortObj);
        }
    },
    factory: {
        value: List
    }
});

ordered_list_monad.ap = ordered_list_monad.apply;
ordered_list_monad.fmap = ordered_list_monad.chain;
ordered_list_monad.flapMap = ordered_list_monad.chain;
ordered_list_monad.bind = ordered_list_monad.chain;
//ordered_list_monad.reduce = ordered_list_monad.fold;

function createGroupedListDelegate(source, key) {
    return createListDelegateInstance(source, undefined, undefined, key);
}
var createListDelegateInstance = (0, _list_helpers.createListCreator)(list_monad, ordered_list_monad, list_monad);

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "you're too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
list_monad.constructor = list_monad.factory;
ordered_list_monad.constructor = ordered_list_monad.factory;

exports.List = List;
exports.list_monad = list_monad;
exports.ordered_list_monad = ordered_list_monad;

},{"../../combinators":1,"../../functionalHelpers":26,"../../helpers":27,"../functors/list_functor":9,"../list_helpers":12,"../list_iterators":13}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nothing_monad = exports.just_monad = exports.Nothing = exports.Just = exports.Maybe = undefined;

var _maybe_functor = require('../functors/maybe_functor');

var _combinators = require('../../combinators');

var _containerHelpers = require('../containerHelpers');

function Maybe(item) {
    return null == item ? Object.create(nothing_monad, {
        _value: {
            value: null,
            writable: false,
            configurable: false
        },
        isJust: {
            value: false
        },
        isNothing: {
            value: true
        }
    }) : Object.create(just_monad, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {*} item - a
 * @return {just_monad} - b
 */
Maybe.of = function _of(item) {
    return Object.create(just_monad, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Maybe.is = function (m) {
    return just_monad.isPrototypeOf(m) || nothing_monad.isPrototypeOf(m);
};

Maybe.Just = function _just(item) {
    return Maybe.of(item);
};

Maybe.Nothing = function _nothing() {
    return Object.create(nothing_monad, {
        _value: {
            value: null,
            writable: false,
            configurable: false
        },
        isJust: {
            value: false
        },
        isNothing: {
            value: true
        }
    });
};

var Just = Maybe.Just;

Just.of = Just;

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Just.is = function (m) {
    return just_monad.isPrototypeOf(m);
};

var Nothing = Maybe.Nothing;

Nothing.of = Nothing;

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Nothing.is = function (m) {
    return nothing_monad.isPrototypeOf(m);
};

var just_monad = Object.create(_maybe_functor.just_functor, {
    map: {
        value: _containerHelpers.sharedMaybeFns.justMap
    },
    bimap: {
        value: _containerHelpers.sharedMaybeFns.justBimap
    },
    fold: {
        value: function _fold(fn) {
            return fn(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(_combinators.identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f, g) {
            return f(this.value).map(this.of);
        }
    },
    nothing: {
        value: function _nothing() {
            return Nothing();
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Maybe),
        writable: false,
        configurable: false
    },
    factory: {
        value: Maybe
    }
});

just_monad.chain = _containerHelpers.chain;
just_monad.mjoin = _containerHelpers.mjoin;
just_monad.apply = _containerHelpers.apply;

var nothing_monad = Object.create(_maybe_functor.nothing_functor, {
    map: {
        value: _containerHelpers.sharedMaybeFns.nothingMapMaker(Nothing)
    },
    bimap: {
        value: _containerHelpers.sharedMaybeFns.nothingBimapMaker(Nothing)
    },
    fold: {
        value: function _fold(fn) {
            return Nothing();
        }
    },
    sequence: {
        value: function _sequence(a) {
            return this.traverse(_combinators.identity, a);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return a.of(Maybe.Nothing());
        }
    },
    nothing: {
        value: function _nothing() {
            return Nothing();
        }
    },
    of: {
        value: (0, _containerHelpers.pointMaker)(Maybe),
        writable: false,
        configurable: false
    },
    factory: {
        value: Maybe
    }
});

nothing_monad.chain = _containerHelpers.chain;
nothing_monad.mjoin = _containerHelpers.mjoin;
nothing_monad.apply = _containerHelpers.apply;

just_monad.ap = just_monad.apply;
just_monad.fmap = just_monad.chain;
just_monad.flapMap = just_monad.chain;
just_monad.bind = just_monad.chain;
just_monad.reduce = just_monad.fold;

nothing_monad.ap = nothing_monad.apply;
nothing_monad.fmap = nothing_monad.chain;
nothing_monad.flapMap = nothing_monad.chain;
nothing_monad.bind = nothing_monad.chain;
nothing_monad.reduce = nothing_monad.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
just_monad.constructor = just_monad.factory;
nothing_monad.constructor = nothing_monad.factory;

exports.Maybe = Maybe;
exports.Just = Just;
exports.Nothing = Nothing;
exports.just_monad = just_monad;
exports.nothing_monad = nothing_monad;

},{"../../combinators":1,"../containerHelpers":2,"../functors/maybe_functor":10}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.monads = undefined;

var _constant_monad = require('./constant_monad');

var _either_monad = require('./either_monad');

var _future_monad = require('./future_monad');

var _identity_monad = require('./identity_monad');

var _io_monad = require('./io_monad');

var _list_monad = require('./list_monad');

var _maybe_monad = require('./maybe_monad');

var _validation_monad = require('./validation_monad');

var _containerHelpers = require('../containerHelpers');

var _pointlessContainers = require('../../pointlessContainers');

/*
    - Semigroup:
        > a.concat(b).concat(c) is equivalent to a.concat(b.concat(c)) (associativity)

    - Monoid:
        > A value that implements the Monoid specification must also implement the Semigroup specification.
        > m.concat(M.empty()) is equivalent to m (right identity)
        > M.empty().concat(m) is equivalent to m (left identity)

    - Functor:
        > u.map(a => a) is equivalent to u (identity)
        > u.map(x => f(g(x))) is equivalent to u.map(g).map(f) (composition)

    - Apply:
        > A value that implements the Apply specification must also implement the Functor specification.
        > v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a) (composition)

    - Applicative:
        > A value that implements the Applicative specification must also implement the Apply specification.
        > v.ap(A.of(x => x)) is equivalent to v (identity)
        > A.of(x).ap(A.of(f)) is equivalent to A.of(f(x)) (homomorphism)
        > A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)

    - Foldable:
        > u.reduce is equivalent to u.reduce((acc, x) => acc.concat([x]), []).reduce

    - Traversable:
        > A value that implements the Traversable specification must also implement the Functor and Foldable specifications.
        > t(u.traverse(F, x => x)) is equivalent to u.traverse(G, t) for any t such that t(a).map(f) is equivalent to t(a.map(f)) (naturality)
        > u.traverse(F, F.of) is equivalent to F.of(u) for any Applicative F (identity)
        > u.traverse(Compose, x => new Compose(x)) === new Compose(u.traverse(F, x => x).map(x => x.traverse(G, x => x)))
                for Compose defined below and any Applicatives F and G (composition)

    - Chain:
        > A value that implements the Chain specification must also implement the Apply specification.
        > m.chain(f).chain(g) is equivalent to m.chain(x => f(x).chain(g)) (associativity)

    - ChainRec:
        > A value that implements the ChainRec specification must also implement the Chain specification.
        > M.chainRec((next, done, v) => p(v) ? d(v).map(done) : n(v).map(next), i) is equivalent to (function step(v) { return p(v) ? d(v) : n(v).chain(step); }(i)) (equivalence)
        > Stack usage of M.chainRec(f, i) must be at most a constant multiple of the stack usage of f itself.

    - Monad:
        > A value that implements the Monad specification must also implement the Applicative and Chain specifications.
        > M.of(a).chain(f) is equivalent to f(a) (left identity)
        > m.chain(M.of) is equivalent to m (right identity)

    - Extend:
        > A value that implements the Extend specification must also implement the Functor specification.
        > w.extend(g).extend(f) is equivalent to w.extend(_w => f(_w.extend(g)))

    - Comonad:
        > A value that implements the Comonad specification must also implement the Extend specification.
        > w.extend(_w => _w.extract()) is equivalent to w (left identity)
        > w.extend(f).extract() is equivalent to f(w) (right identity)

    - Bifunctor:
        > A value that implements the Bifunctor specification must also implement the Functor specification.
        > p.bimap(a => a, b => b) is equivalent to p (identity)
        > p.bimap(a => f(g(a)), b => h(i(b)) is equivalent to p.bimap(g, i).bimap(f, h) (composition)

    - Profunctor:
        > A value that implements the Profunctor specification must also implement the Functor specification.
        > p.promap(a => a, b => b) is equivalent to p (identity)
        > p.promap(a => f(g(a)), b => h(i(b))) is equivalent to p.promap(f, i).promap(g, h) (composition)
 */

var mapToConstant = (0, _pointlessContainers.toContainerType)(_constant_monad.Constant),
    mapToEither = (0, _pointlessContainers.toContainerType)(_either_monad.Either),
    mapToFuture = (0, _pointlessContainers.toContainerType)(_future_monad.Future),
    mapToIdentity = (0, _pointlessContainers.toContainerType)(_identity_monad.Identity),
    mapToIo = (0, _pointlessContainers.toContainerType)(_io_monad.Io),
    mapToLeft = (0, _pointlessContainers.toContainerType)(_either_monad.Left),
    mapToList = (0, _pointlessContainers.toContainerType)(_list_monad.List),
    mapToMaybe = (0, _pointlessContainers.toContainerType)(_maybe_monad.Maybe),
    mapToRight = (0, _pointlessContainers.toContainerType)(_either_monad.Right),
    mapToValidation = (0, _pointlessContainers.toContainerType)(_validation_monad.Validation);

_constant_monad.constant_monad.mapToEither = mapToEither;
_constant_monad.constant_monad.mapToFuture = mapToFuture;
_constant_monad.constant_monad.mapToIdentity = mapToIdentity;
_constant_monad.constant_monad.mapToIo = mapToIo;
_constant_monad.constant_monad.mapToLeft = mapToLeft;
_constant_monad.constant_monad.mapToList = mapToList;
_constant_monad.constant_monad.mapToMaybe = mapToMaybe;
_constant_monad.constant_monad.mapToRight = mapToRight;
_constant_monad.constant_monad.mapToValidation = mapToValidation;
_constant_monad.constant_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_future_monad.future_monad.mapToConstant = mapToConstant;
_future_monad.future_monad.mapToEither = mapToEither;
_future_monad.future_monad.mapToIdentity = mapToIdentity;
_future_monad.future_monad.mapToIo = mapToIo;
_future_monad.future_monad.mapToLeft = mapToLeft;
_future_monad.future_monad.mapToList = mapToList;
_future_monad.future_monad.mapToMaybe = mapToMaybe;
_future_monad.future_monad.mapToRight = mapToRight;
_future_monad.future_monad.mapToValidation = mapToValidation;
_future_monad.future_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_identity_monad.identity_monad.mapToConstant = mapToConstant;
_identity_monad.identity_monad.mapToEither = mapToEither;
_identity_monad.identity_monad.mapToFuture = mapToFuture;
_identity_monad.identity_monad.mapToIo = mapToIo;
_identity_monad.identity_monad.mapToLeft = mapToLeft;
_identity_monad.identity_monad.mapToList = mapToList;
_identity_monad.identity_monad.mapToMaybe = mapToMaybe;
_identity_monad.identity_monad.mapToRight = mapToRight;
_identity_monad.identity_monad.mapToValidation = mapToValidation;
_identity_monad.identity_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_io_monad.io_monad.mapToConstant = mapToConstant;
_io_monad.io_monad.mapToEither = mapToEither;
_io_monad.io_monad.mapToFuture = mapToFuture;
_io_monad.io_monad.mapToIdentity = mapToIdentity;
_io_monad.io_monad.mapToLeft = mapToLeft;
_io_monad.io_monad.mapToList = mapToList;
_io_monad.io_monad.mapToMaybe = mapToMaybe;
_io_monad.io_monad.mapToRight = mapToRight;
_io_monad.io_monad.mapToValidation = mapToValidation;
_io_monad.io_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_either_monad.left_monad.mapToConstant = mapToConstant;
_either_monad.left_monad.mapToFuture = mapToFuture;
_either_monad.left_monad.mapToIdentity = mapToIdentity;
_either_monad.left_monad.mapToIo = mapToIo;
_either_monad.left_monad.mapToList = mapToList;
_either_monad.left_monad.mapToMaybe = mapToMaybe;
_either_monad.left_monad.mapToValidation = mapToValidation;
_either_monad.left_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_maybe_monad.just_monad.mapToConstant = mapToConstant;
_maybe_monad.just_monad.mapToEither = mapToEither;
_maybe_monad.just_monad.mapToFuture = mapToFuture;
_maybe_monad.just_monad.mapToIdentity = mapToIdentity;
_maybe_monad.just_monad.mapToIo = mapToIo;
_maybe_monad.just_monad.mapToList = mapToList;
_maybe_monad.just_monad.mapToValidation = mapToValidation;
_maybe_monad.just_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_list_monad.list_monad.mapToConstant = mapToConstant;
_list_monad.list_monad.mapToEither = mapToEither;
_list_monad.list_monad.mapToFuture = mapToFuture;
_list_monad.list_monad.mapToIdentity = mapToIdentity;
_list_monad.list_monad.mapToIo = mapToIo;
_list_monad.list_monad.mapToLeft = mapToLeft;
_list_monad.list_monad.mapToMaybe = mapToMaybe;
_list_monad.list_monad.mapToRight = mapToRight;
_list_monad.list_monad.mapToValidation = mapToValidation;

_list_monad.ordered_list_monad.mapToConstant = mapToConstant;
_list_monad.ordered_list_monad.mapToEither = mapToEither;
_list_monad.ordered_list_monad.mapToFuture = mapToFuture;
_list_monad.ordered_list_monad.mapToIdentity = mapToIdentity;
_list_monad.ordered_list_monad.mapToIo = mapToIo;
_list_monad.ordered_list_monad.mapToLeft = mapToLeft;
_list_monad.ordered_list_monad.mapToMaybe = mapToMaybe;
_list_monad.ordered_list_monad.mapToRight = mapToRight;
_list_monad.ordered_list_monad.mapToValidation = mapToValidation;

_maybe_monad.nothing_monad.mapToConstant = mapToConstant;
_maybe_monad.nothing_monad.mapToEither = mapToEither;
_maybe_monad.nothing_monad.mapToFuture = mapToFuture;
_maybe_monad.nothing_monad.mapToIdentity = mapToIdentity;
_maybe_monad.nothing_monad.mapToIo = mapToIo;
_maybe_monad.nothing_monad.mapToLeft = mapToLeft;
_maybe_monad.nothing_monad.mapToList = mapToList;
_maybe_monad.nothing_monad.mapToRight = mapToRight;
_maybe_monad.nothing_monad.mapToValidation = mapToValidation;
_maybe_monad.nothing_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_either_monad.right_monad.mapToConstant = mapToConstant;
_either_monad.right_monad.mapToFuture = mapToFuture;
_either_monad.right_monad.mapToIdentity = mapToIdentity;
_either_monad.right_monad.mapToIo = mapToIo;
_either_monad.right_monad.mapToList = mapToList;
_either_monad.right_monad.mapToMaybe = mapToMaybe;
_either_monad.right_monad.mapToValidation = mapToValidation;
_either_monad.right_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_validation_monad.validation_monad.mapToConstant = mapToConstant;
_validation_monad.validation_monad.mapToEither = mapToEither;
_validation_monad.validation_monad.mapToFuture = mapToFuture;
_validation_monad.validation_monad.mapToIdentity = mapToIdentity;
_validation_monad.validation_monad.mapToIo = mapToIo;
_validation_monad.validation_monad.mapToLeft = mapToLeft;
_validation_monad.validation_monad.mapToList = mapToList;
_validation_monad.validation_monad.mapToMaybe = mapToMaybe;
_validation_monad.validation_monad.mapToRight = mapToRight;
_validation_monad.validation_monad[Symbol.iterator] = _pointlessContainers.containerIterator;

_constant_monad.Constant.lift = (0, _containerHelpers.lifter)(_constant_monad.Constant);
_either_monad.Either.lift = (0, _containerHelpers.lifter)(_either_monad.Either);
_future_monad.Future.lift = (0, _containerHelpers.lifter)(_future_monad.Future);
_identity_monad.Identity.lift = (0, _containerHelpers.lifter)(_identity_monad.Identity);
_io_monad.Io.lift = (0, _containerHelpers.lifter)(_io_monad.Io);
_maybe_monad.Just.lift = (0, _containerHelpers.lifter)(_maybe_monad.Just);
_either_monad.Left.lift = (0, _containerHelpers.lifter)(_either_monad.Left);
_list_monad.List.lift = (0, _containerHelpers.lifter)(_list_monad.List);
_maybe_monad.Maybe.lift = (0, _containerHelpers.lifter)(_maybe_monad.Maybe);
_maybe_monad.Nothing.lift = (0, _containerHelpers.lifter)(_maybe_monad.Nothing);
_either_monad.Right.lift = (0, _containerHelpers.lifter)(_either_monad.Right);
_validation_monad.Validation.lift = (0, _containerHelpers.lifter)(_validation_monad.Validation);

var monads = {
    Constant: _constant_monad.Constant,
    Either: _either_monad.Either,
    Future: _future_monad.Future,
    Identity: _identity_monad.Identity,
    Io: _io_monad.Io,
    Just: _maybe_monad.Just,
    Left: _either_monad.Left,
    List: _list_monad.List,
    Maybe: _maybe_monad.Maybe,
    Nothing: _maybe_monad.Nothing,
    Right: _either_monad.Right,
    Validation: _validation_monad.Validation
};

exports.monads = monads;

},{"../../pointlessContainers":30,"../containerHelpers":2,"./constant_monad":14,"./either_monad":15,"./future_monad":16,"./identity_monad":17,"./io_monad":18,"./list_monad":19,"./maybe_monad":20,"./validation_monad":22}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validation_monad = exports.Validation = undefined;

var _validation_functor = require('../functors/validation_functor');

var _containerHelpers = require('../containerHelpers');

function Validation(val) {
    return Object.create(validation_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

Validation.of = function _of(val) {
    return Validation(val);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Validation.is = function (m) {
    return validation_monad.isPrototypeOf(m);
};

var validation_monad = Object.create(_validation_functor.validation_functor, {
    of: {
        value: (0, _containerHelpers.pointMaker)(Validation),
        writable: false,
        configurable: false
    },
    factory: {
        value: Validation
    }
});

validation_monad.chain = _containerHelpers.chain;
validation_monad.mjoin = _containerHelpers.mjoin;
validation_monad.apply = _containerHelpers.apply;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
validation_monad.constructor = validation_monad.factory;

exports.Validation = Validation;
exports.validation_monad = validation_monad;

},{"../containerHelpers":2,"../functors/validation_functor":11}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.quickSort = exports.sortData = undefined;

var _helpers = require('../helpers');

/**
 * @sig
 * @description d
 * @param {Array} data - a
 * @param {Object} sortObject - b
 * @return {Array} - Returns an array sorted on 'n' fields in either ascending or descending
 * order for each field as specified in the 'sortObject' parameter
 */
function sortData(data, sortObject) {
    var sortedData = data;
    sortObject.forEach(function _sortItems(sort, index) {
        var comparer = sortObject.comparer && 'function' === typeof sort.comparer ? sort.comparer : _helpers.sortComparer;
        if (0 === index) sortedData = 5001 > data.length ? insertionSort(data, sort.keySelector, comparer, sort.direction) : mergeSort(data, sort.keySelector, comparer, sort.direction);
        //if (index === 0) sortedData = quickSort(data, sort.direction, sort.keySelector, comparer);
        else {
                var sortedSubData = [],
                    itemsToSort = [],
                    prevKeySelector = sortObject[index - 1].keySelector;
                sortedData.forEach(function _sortData(item, idx) {
                    //TODO: re-examine this logic; I think it is in reverse order
                    if (!itemsToSort.length || 0 === comparer(prevKeySelector(itemsToSort[0]), prevKeySelector(item), sort.direction)) itemsToSort.push(item);else {
                        //TODO: see if there's a realistic way that length === 1 || 2 could be combined into one statement
                        if (1 === itemsToSort.length) sortedSubData = sortedSubData.concat(itemsToSort);
                        //else if (itemsToSort.length === 2) {
                        //sortedSubData = -1 < comparer(sort.keySelector(itemsToSort[0]), sort.keySelector(itemsToSort[1]), sort.direction) ?
                        //sortedSubData.concat(itemsToSort) : sortedSubData.concat(itemsToSort.reverse());
                        /*if (sortDirection.descending === sort.ascending)
                            sortedSubData = -1 < comparer(sort.keySelector(itemsToSort[0]), sort.keySelector(itemsToSort[1]), sort.direction) ?
                                sortedSubData.concat(itemsToSort) : sortedSubData.concat(itemsToSort.reverse());
                        else sortedSubData = 1 > comparer(sort.keySelector(itemsToSort[0]), sort.keySelector(itemsToSort[1]), sort.direction) ?
                            sortedSubData.concat(itemsToSort) : sortedSubData.concat(itemsToSort.reverse());
                        */
                        //}
                        else {
                                sortedSubData = sortedSubData.concat(5001 > itemsToSort.length ? insertionSort(itemsToSort, sort.keySelector, comparer, sort.direction) : mergeSort(itemsToSort, sort.keySelector, comparer, sort.direction));
                                //sortedSubData = sortedSubData.concat(quickSort(itemsToSort, sort.direction, sort.keySelector, comparer));
                            }
                        itemsToSort.length = 0;
                        itemsToSort[0] = item;
                    }
                    if (idx === sortedData.length - 1) {
                        sortedSubData = sortedSubData.concat(5001 > itemsToSort.length ? insertionSort(itemsToSort, sort.keySelector, comparer, sort.direction) : mergeSort(itemsToSort, sort.keySelector, comparer, sort.direction));
                    }
                });
                sortedData = sortedSubData;
            }
    });
    return sortedData;
}

/**
 * @sig
 * @description d
 * @param {Array} data - a
 * @param {function} keySelector - b
 * @param {function} comparer - c
 * @param {string} direction - d
 * @return {Array} - e
 */
function mergeSort(data, keySelector, comparer, direction) {
    if (2 > data.length) return data;
    var middle = parseInt(data.length / 2);
    return merge(mergeSort(data.slice(0, middle), keySelector, comparer, direction), mergeSort(data.slice(middle), keySelector, comparer, direction), keySelector, comparer, direction);
}

/**
 * @sig
 * @description d
 * @param {Array} left - a
 * @param {Array} right - b
 * @param {function} keySelector - c
 * @param {function} comparer - d
 * @param {string} direction - e
 * @return {Array} - f
 */
function merge(left, right, keySelector, comparer, direction) {
    if (!left.length) return right;
    if (!right.length) return left;

    if (-1 < comparer(keySelector(left[0]), keySelector(right[0]), direction)) return [(0, _helpers.deepClone)(left[0])].concat(merge(left.slice(1, left.length), right, keySelector, comparer, direction));
    return [(0, _helpers.deepClone)(right[0])].concat(merge(left, right.slice(1, right.length), keySelector, comparer, direction));
}

/**
 * @sig
 * @description d
 * @param {Array} source - a
 * @param {string} dir - b
 * @param {function} keySelector - c
 * @param {function} keyComparer - d
 * @return {Array} - Returns a sort array
 */
function quickSort(source, dir, keySelector, keyComparer) {
    var i = 0,
        copy = [];

    while (i < source.length) {
        copy[i] = source[i];
        ++i;
    }
    qSort(copy, 0, source.length - 1, dir, keySelector, keyComparer);
    return copy;
}

/**
 * @sig
 * @description d
 * @param {Array} data - a
 * @param {number} left - b
 * @param {number} right - c
 * @param {string} dir - d
 * @param {function} keySelector - f
 * @param {function} keyComparer - g
 * @return {Array} - h
 */
function qSort(data, left, right, dir, keySelector, keyComparer) {
    do {
        var i = left,
            j = right,
            itemIdx = i + (j - i >> 1);

        do {
            while (i < data.length && 0 < keyComparer(keySelector, itemIdx, i, data, dir)) {
                ++i;
            }while (0 <= j && 0 > keyComparer(keySelector, itemIdx, j, data, dir)) {
                --j;
            }if (i > j) break;
            if (i < j) {
                var tmp = data[i];
                data[i] = data[j];
                data[j] = tmp;
            }
            ++i;
            --j;
        } while (i <= j);

        if (j - left <= right - i) {
            if (left < j) qSort(data, left, j, dir, keySelector, keyComparer);
            left = i;
        } else {
            if (i < right) qSort(data, i, right, dir, keySelector, keyComparer);
            right = j;
        }
    } while (left < right);
}

/**
 * @sig
 * @description d
 * @param {Array} source - a
 * @param {function} keySelector - b
 * @param {function} keyComparer - c
 * @param {string} direction - d
 * @return {Array} - e
 */
function insertionSort(source, keySelector, keyComparer, direction) {
    var i = 0,
        cop = [];

    while (i < source.length) {
        cop[i] = source[i];
        ++i;
    }
    iSort(cop, keySelector, keyComparer, direction);
    return cop;
}

/**
 * @sig
 * @description d
 * @param {Array} source - a
 * @param {function} keySelector - b
 * @param {function} keyComparer - c
 * @param {string} direction - d
 * @return {Array} e
 */
function iSort(source, keySelector, keyComparer, direction) {
    var i, j, item, val;
    for (i = 1; i < source.length; ++i) {
        item = source[i];
        val = keySelector(source[i]);
        j = i - 1;
        while (0 <= j && 0 > keyComparer(keySelector(source[j]), val, direction)) {
            source[j + 1] = source[j];
            --j;
        }
        source[j + 1] = item;
    }
}

exports.sortData = sortData;
exports.quickSort = quickSort;

},{"../helpers":27}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.voidFn = exports.unfoldWith = exports.unfold = exports.unary = exports.tryCatch = exports.ternary = exports.tap = exports.safe = exports.rightApply = exports.repeat = exports.once = exports.not = exports.maybe = exports.leftApply = exports.hyloWith = exports.guard = exports.bindFunction = exports.binary = exports.before = exports.apply = exports.after = undefined;

var _combinators = require('./combinators');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {function} decoration - b
 * @param {*} args - c
 * @return {*} - d
 */
var after = (0, _combinators.curryN)(undefined, 3, function _after(fn, decoration) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
    }

    var ret = fn.apply(undefined, args);
    decoration.apply(undefined, args);
    return ret;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
var apply = function apply(fn) {
    return function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return function () {
            return fn.apply(undefined, args);
        };
    };
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {function} decoration - b
 * @param {*} args - c
 * @return {*} - d
 */
var before = (0, _combinators.curryN)(undefined, 3, function _before(fn, decoration) {
    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
    }

    decoration.apply(undefined, args);
    return fn.apply(undefined, args);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {*} args - b
 * @return {function} - c
 */
var binary = function binary(fn) {
    for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
    }

    return _combinators.curryN.apply(undefined, [undefined, 2, fn].concat(args));
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {object} context - a
 * @param {function} fn - b
 * @return {function} - c
 */
var bindFunction = (0, _combinators.curry)(function _bindFunction(context, fn) {
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
function guard() {
    for (var _len5 = arguments.length, fns = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        fns[_key5] = arguments[_key5];
    }

    return function waitForArgs() {
        for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
        }

        if (fns.slice(1).every(function _functionRunner(fn) {
            return fn.apply(undefined, args);
        })) return fns[0].apply(fns, args);
    };
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @return {function} - b
 */
var leftApply = function leftApply(fn) {
    return function () {
        return fn.apply(undefined, arguments);
    };
};

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
var maybe = function maybe(fn) {
    return function () {
        for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
        }

        return 1 <= args.length && args.every(function _testNull(val) {
            return null != val;
        }) ? fn.call.apply(fn, [undefined].concat(args)) : null;
    };
};

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
var not = function not(fn) {
    return function () {
        return !fn.apply(undefined, arguments);
    };
};

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @returns {function} - b
 */
function once(fn) {
    var invoked = false;
    return function _once() {
        if (!invoked) {
            invoked = true;
            return fn.apply(undefined, arguments);
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
var repeat = (0, _combinators.curry)(function _repeat(num, fn) {
    return 0 < num ? (_repeat(num - 1, fn), fn(num)) : undefined;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
var rightApply = function rightApply(fn) {
    return function () {
        for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            args[_key8] = arguments[_key8];
        }

        return fn.apply(undefined, _toConsumableArray(args.reverse()));
    };
};

//TODO: need to add a try/catch function here, and see about renaming the existing 'safe' function
//TODO: as that seems more along the lines of a try/catch function, rather than a 'maybe' function.
/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function safe(fn) {
    return function _safe() {
        for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
            args[_key9] = arguments[_key9];
        }

        if (!args.length || args.includes(null) || args.includes(undefined)) return;
        return fn.apply(undefined, args);
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
var tap = (0, _combinators.curry)(function _tap(fn, arg) {
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
var ternary = function ternary(fn) {
    for (var _len10 = arguments.length, args = Array(_len10 > 1 ? _len10 - 1 : 0), _key10 = 1; _key10 < _len10; _key10++) {
        args[_key10 - 1] = arguments[_key10];
    }

    return _combinators.curryN.apply(undefined, [undefined, 3, fn].concat(args));
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} catcher - a
 * @param {function} tryer - b
 * @return {function} - c
 */
var tryCatch = (0, _combinators.curry)(function _tryCatch(catcher, tryer) {
    return (0, _combinators.curryN)(this, tryer.length, function _tryCatch_() {
        for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
            args[_key11] = arguments[_key11];
        }

        try {
            return tryer.apply(undefined, args);
        } catch (e) {
            return catcher.apply(undefined, [e].concat(args));
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
var unary = function unary(fn, arg) {
    return undefined === arg ? (0, _combinators.curryN)(undefined, 1, fn) : fn(arg);
};

/**
 * @sig
 * @description d
 * @param {*} seed - a
 * @return {function} - b
 */
function unfold(seed) {
    return regeneratorRuntime.mark(function _unfold(fn) {
        return regeneratorRuntime.wrap(function _unfold$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _unfold, this);
    });
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function unfoldWith(fn) {
    return regeneratorRuntime.mark(function _unfold(value) {
        var _fn, next, element, done;

        return regeneratorRuntime.wrap(function _unfold$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _fn = fn(value), next = _fn.next, element = _fn.element, done = _fn.done;

                        if (done) {
                            _context2.next = 5;
                            break;
                        }

                        _context2.next = 4;
                        return element;

                    case 4:
                        return _context2.delegateYield(_unfold(next), 't0', 5);

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _unfold, this);
    });
}

/**
 * @sig
 * @description d
 * @param cata - a
 * @param ana - b
 * @param seed - c
 * @return {*} - d
 */
var hyloWith = (0, _combinators.curry)(function _hylo(cata, ana, seed) {
    var _ana = ana(seed),
        n = _ana.next,
        acc = _ana.element,
        done = _ana.done;

    var _ana2 = ana(n),
        next = _ana2.next,
        element = _ana2.element; // not a monoid

    while (!done) {
        acc = cata(acc, element);

        var _ana3 = ana(next);

        next = _ana3.next;
        element = _ana3.element;
        done = _ana3.done;
    }
    return acc;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
var voidFn = function voidFn(fn) {
    return function () {
        return void fn.apply(undefined, arguments);
    };
};

/*
 var c = leftApply(leftApply, rightApply);

 var getWith = c(getWith);
 */

exports.after = after;
exports.apply = apply;
exports.before = before;
exports.binary = binary;
exports.bindFunction = bindFunction;
exports.guard = guard;
exports.hyloWith = hyloWith;
exports.leftApply = leftApply;
exports.maybe = maybe;
exports.not = not;
exports.once = once;
exports.repeat = repeat;
exports.rightApply = rightApply;
exports.safe = safe;
exports.tap = tap;
exports.ternary = ternary;
exports.tryCatch = tryCatch;
exports.unary = unary;
exports.unfold = unfold;
exports.unfoldWith = unfoldWith;
exports.voidFn = voidFn;

},{"./combinators":1}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidation = exports.isRight = exports.isNothing = exports.isMonad = exports.isMaybe = exports.isList = exports.isLeft = exports.isJust = exports.isIo = exports.isIdentity = exports.isFunctor = exports.isFuture = exports.isEither = exports.isConstant = undefined;

var _functors = require('./containers/functors/functors');

var _monads = require('./containers/monads/monads');

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isConstant(fa) {
  return fa.factory === _functors.functors.Constant || fa.factory === _monads.monads.Constant;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isEither(fa) {
  return fa.factory === _functors.functors.Either || fa.factory === _monads.monads.Either;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isFunctor(fa) {
  return !!(fa && fa.factory && fa.factory === _functors.functors[fa.factory.name]);
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isFuture(fa) {
  return fa.factory === _functors.functors.Future || fa.factory === _monads.monads.Future;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isIdentity(fa) {
  return fa.factory === _functors.functors.Identity || fa.factory === _monads.monads.Identity;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isIo(fa) {
  return fa.factory === _functors.functors.Io || fa.factory === _monads.monads.Io;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isJust(fa) {
  return !!(fa.isJust && (fa.factory === _functors.functors.Maybe || fa.factory === _monads.monads.Maybe));
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isLeft(fa) {
  return !!(fa.isLeft && (fa.factory === _functors.functors.Either || fa.factory === _monads.monads.Either));
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isList(fa) {
  return fa.factory === _functors.functors.List || fa.factory === _monads.monads.List;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isMaybe(fa) {
  return !!(fa.isNothing && (fa.factory === _functors.functors.Maybe || fa.factory === _monads.monads.Maybe) || fa.isJust && (fa.factory === _functors.functors.Maybe || fa.factory === _monads.monads.Maybe));
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
function isMonad(ma) {
  return !!(ma && ma.factory && ma.factory === _monads.monads[ma.factory.name]);
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isNothing(fa) {
  return !!fa.isNothing;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isRight(fa) {
  return !!fa.isRight;
}

/**
 * @sig
 * @description d
 * @param {*} fa - a
 * @return {boolean} - b
 */
function isValidation(fa) {
  return fa.factory === _functors.functors.Validation || fa.factory === _monads.monads.Validation;
}

exports.isConstant = isConstant;
exports.isEither = isEither;
exports.isFuture = isFuture;
exports.isFunctor = isFunctor;
exports.isIdentity = isIdentity;
exports.isIo = isIo;
exports.isJust = isJust;
exports.isLeft = isLeft;
exports.isList = isList;
exports.isMaybe = isMaybe;
exports.isMonad = isMonad;
exports.isNothing = isNothing;
exports.isRight = isRight;
exports.isValidation = isValidation;

},{"./containers/functors/functors":5,"./containers/monads/monads":21}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrap = exports.type = exports.truthy = exports.subtract = exports.strictNotEqual = exports.strictEquals = exports.setSet = exports.set = exports.reverse = exports.or = exports.once = exports.objectSet = exports.nth = exports.noop = exports.notEqual = exports.negate = exports.multiply = exports.modulus = exports.mapSet = exports.lessThanOrEqual = exports.lessThan = exports.isUndefined = exports.isSymbol = exports.isString = exports.isSomething = exports.isNumber = exports.isNull = exports.isNothing = exports.isObject = exports.isFunction = exports.isBoolean = exports.isArray = exports.invoke = exports.inObject = exports.has = exports.greaterThanOrEqual = exports.greaterThan = exports.getWith = exports.flip = exports.falsey = exports.equals = exports.either = exports.divide = exports.delegatesTo = exports.delegatesFrom = exports.defaultPredicate = exports.concat = exports.both = exports.arraySet = exports.and = exports.adjust = exports.add = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _helpers = require('./helpers');

var _combinators = require('./combinators');

/**
 * @sig
 * @description Updates the value stored in a single specified index of an array. The function
 * argument should be some form of a unary projector. The 'projector' function will receive
 * the value stored in the existing array at the specified 'idx' argument location. A new array
 * is returned and the original array remains unchanged.
 * @type {function}
 * @param {function} fn - A function that can operate on a single point of data from the array
 * and a value to be used as an update for the same index in the new array.
 * @param {number} idx - A number representing the zero-based offset of the array; idx determines
 * what value will be passed as the unary argument to the operator function and what index in the
 * newly created array will be altered. If the value is less than zero, the function will use the
 * 'idx' argument value as an offset from the last element in the array.
 * @param {Array} List - The List to update.
 * @return {Array} - Returns a new array identical to the original array except where the new,
 * computed value is inserted
 */
var adjust = (0, _combinators.curry)(function _adjust(fn, idx, list) {
  if (idx >= list.length || idx < -list.length) {
    return list;
  }
  var _idx = 0 > idx ? list.length + idx : idx,
      _list = list.map(_combinators.identity);
  _list[_idx] = fn(list[_idx]);
  return _list;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var add = (0, _combinators.curry)(function (x, y) {
  return x + y;
});

/**
 * @sig and :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description d
 * @type {function}
 * @param {*} a - a
 * @param {*} b - b
 * @return {boolean} - c
 */
var and = (0, _combinators.curry)(function (a, b) {
  return !!(a && b);
});

/**
 * @sig
 * @description Updates the value at a specified index of an array by first creating a shallow copy
 * of the array and then updating its value at the specified index.
 * @type {function}
 * @note @see {@link adjust}
 * @param {number} idx - The index of the array to which the alternate value will be set.
 * @param {*} x - The value to be used to update the array at the index specified.
 * @param {Array} List - The List on which to perform the update.
 * @returns {Array} - Returns a new array with the value at the specified index being
 * set to the value of the 'x' argument.
 */
var arraySet = (0, _combinators.curry)(function _arraySet(idx, x, list) {
  return adjust((0, _combinators.constant)(x), idx, list);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {boolean} - c
 */
var both = (0, _combinators.curry)(function _both(f, g) {
  return !!(f() && g());
});

/**
 * @sig
 * @description d
 * @param {Array} first - a
 * @return {function} - b
 */
var concat = function concat(first) {
  return function () {
    for (var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++) {
      rest[_key] = arguments[_key];
    }

    return null == rest || !rest.length ? first : rest.reduce(function _concatStrings(cur, next) {
      return cur.concat(next);
    }, first);
  };
};

/**
 * @sig
 * @description d
 * @type {function}
 * @return {boolean} - a
 */
var defaultPredicate = (0, _combinators.constant)(true);

/**
 * @sig
 * @description d
 * @type {function}
 * @param {object} delegate - a
 * @param {object} delegator - b
 * @return {boolean} - c
 */
var delegatesFrom = (0, _combinators.curry)(function (delegate, delegator) {
  return delegate.isPrototypeOf(delegator);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {object} delegator - a
 * @param {object} delegate - b
 * @return {boolean} - c
 */
var delegatesTo = (0, _combinators.curry)(function (delegator, delegate) {
  return delegate.isPrototypeOf(delegator);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var divide = (0, _combinators.curry)(function (x, y) {
  return x / y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {boolean} - c
 */
var either = (0, _combinators.curry)(function _either(f, g) {
  return !!(f() || g());
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var equals = (0, _combinators.curry)(function (x, y) {
  return x == y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @see flip
 * @param {*} x - a
 * @return {boolean} - b
 */
var falsey = flip;

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var flip = function flip(x) {
  return !x;
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {object} obj - b
 * @return {*} - c
 */
var getWith = (0, _combinators.curry)(function (prop, obj) {
  return obj[prop];
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number | string} x - a
 * @param {number | string} y - b
 * @return {boolean} - c
 */
var greaterThan = (0, _combinators.curry)(function (x, y) {
  return x > y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var greaterThanOrEqual = (0, _combinators.curry)(function (x, y) {
  return x >= y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {object} obj - b
 * @return {boolean} - c
 */
var has = (0, _combinators.curry)(function _has(prop, obj) {
  return obj.hasOwnProperty(prop);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} key - a
 * @param {object} obj - b
 * @return {boolean} - c
 */
var inObject = (0, _combinators.curry)(function _inObject(prop, obj) {
  return prop in obj;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {*} - b
 */
var invoke = function invoke(fn) {
  return fn();
};

/**
 * @sig isArray :: a -> Boolean
 * @description d
 * @param {*} data - a
 * @return {boolean} - b
 */
var isArray = function isArray(data) {
  return Array.isArray(data);
};

/**
 * @sig
 * @description d
 * @param {boolean} bool - a
 * @return {boolean} - b
 */
var isBoolean = function isBoolean(bool) {
  return _helpers.javaScriptTypes.Boolean === type(bool);
};

/**
 * @sig isFunction :: a -> Boolean
 * @description d
 * @param {function} fn - a
 * @return {boolean} - b
 */
var isFunction = function isFunction(fn) {
  return _helpers.javaScriptTypes.Function === type(fn);
};

/**
 * @sig isObject :: a -> Boolean
 * @description d
 * @param {*} item - a
 * @return {boolean} - b
 */
var isObject = function isObject(item) {
  return _helpers.javaScriptTypes.Object === type(item) && null !== item;
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var isNothing = function isNothing(x) {
  return null == x;
};

/**
 * @sig
 * @description d
 * @param {*} n - a
 * @return {string|boolean} - b
 */
var isNull = function isNull(n) {
  return type(n) && null === n;
};

/**
 * @sig
 * @description d
 * @param {number} num - a
 * @return {boolean} - b
 */
var isNumber = function isNumber(num) {
  return _helpers.javaScriptTypes.Number == type(num);
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var isSomething = function isSomething(x) {
  return null != x;
};

/**
 * @sig
 * @description d
 * @param {string} str - a
 * @return {boolean} - b
 */
var isString = function isString(str) {
  return _helpers.javaScriptTypes.String === type(str);
};

/**
 * @sig
 * @description d
 * @param {Symbol} sym - a
 * @return {boolean} - b
 */
var isSymbol = function isSymbol(sym) {
  return _helpers.javaScriptTypes.Symbol === type(sym);
};

/**
 * @sig
 * @description d
 * @param {*} u - a
 * @return {boolean} - b
 */
var isUndefined = function isUndefined(u) {
  return _helpers.javaScriptTypes.Undefined === type(u);
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var lessThan = (0, _combinators.curry)(function (x, y) {
  return x < y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var lessThanOrEqual = (0, _combinators.curry)(function (x, y) {
  return x <= y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} key - a
 * @param {*} val - b
 * @param {Map} map - c
 * @return {Map} - d
 */
var mapSet = (0, _combinators.curry)(function _mapSet(key, val, map) {
  map.set(key, val);
  return map;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var modulus = (0, _combinators.curry)(function (x, y) {
  return x % y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var multiply = (0, _combinators.curry)(function (x, y) {
  return x * y;
});

/**
 * @sig
 * @description d
 * @param {number} x - a
 * @return {number} - b
 */
var negate = function negate(x) {
  return -x;
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} - a
 * @param {*} - b
 * @return {boolean} - c
 */
var notEqual = (0, _combinators.curry)(function (x, y) {
  return x != y;
});

/**
 * @sig
 * @description No-op function; used as default function in some cases when argument is optional
 * and consumer does not provide.
 * @returns {undefined} - a
 */
function noop() {}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} offset - a
 * @param {Array} List - b
 * @return {*} - c
 */
var nth = (0, _combinators.curry)(function nth(offset, list) {
  var idx = 0 > offset ? list.length + offset : offset;
  return 'string' === typeof list ? list.charAt(idx) : list[idx];
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {*} val - b
 * @param {object} obj - c
 * @return {object} - d
 */
var objectSet = (0, _combinators.curry)(function _objectSet(prop, val, obj) {
  var result = (0, _helpers.shallowClone)(obj);
  result[prop] = val;
  return result;
});

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function once(fn) {
  var invoked = false;
  return function _once() {
    if (!invoked) {
      invoked = true;
      fn.apply(undefined, arguments);
    }
  };
}

/**
 * @sig or :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description d
 * @type {function}
 * @param {*} a - a
 * @param {*} b - b
 * @return {boolean} - c
 */
var or = (0, _combinators.curry)(function (a, b) {
  return !!(a || b);
});

/**
 * @sig
 * @description d
 * @param {Array|String} xs - a
 * @return {Array|String} - b
 */
var reverse = function reverse(xs) {
  return isArray(xs) ? xs.slice(0).reverse() : xs.split('').reverse().join('');
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {*} val - b
 * @param {object} obj - c
 * @return {object} - d
 */
var set = (0, _combinators.curry)(function _set(prop, val, obj) {
  obj[prop] = val;
  return obj;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} val - a
 * @param {Set} set - b
 * @return {Set} - c
 */
var setSet = (0, _combinators.curry)(function _setSet(val, set) {
  set.add(val);
  return set;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var strictEquals = (0, _combinators.curry)(function (x, y) {
  return x === y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var strictNotEqual = (0, _combinators.curry)(function (x, y) {
  return x !== y;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var subtract = (0, _combinators.curry)(function (x, y) {
  return x - y;
});

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var truthy = function truthy(x) {
  return flip(falsey(x));
};

/**
 * @sig
 * @description d
 * @param {*} a - a
 * @return {string} - b
 */
var type = function type(a) {
  return typeof a === 'undefined' ? 'undefined' : _typeof(a);
};

/**
 * @sig wrap :: a -> [a]
 * @description Takes any value of any type and returns an array containing
 * the value passed as its only item
 * @param {*} data - Any value, any type
 * @return {Array} - Returns an array of any value, any type
 */
var wrap = function wrap(data) {
  return [data];
};

function reverse2() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  if (1 === args.length) {
    if ('string' === typeof args[0]) return args[0].split('').reverse().join();
    return args;
  }
  return args.reverse();
}

exports.add = add;
exports.adjust = adjust;
exports.and = and;
exports.arraySet = arraySet;
exports.both = both;
exports.concat = concat;
exports.defaultPredicate = defaultPredicate;
exports.delegatesFrom = delegatesFrom;
exports.delegatesTo = delegatesTo;
exports.divide = divide;
exports.either = either;
exports.equals = equals;
exports.falsey = falsey;
exports.flip = flip;
exports.getWith = getWith;
exports.greaterThan = greaterThan;
exports.greaterThanOrEqual = greaterThanOrEqual;
exports.has = has;
exports.inObject = inObject;
exports.invoke = invoke;
exports.isArray = isArray;
exports.isBoolean = isBoolean;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isNothing = isNothing;
exports.isNull = isNull;
exports.isNumber = isNumber;
exports.isSomething = isSomething;
exports.isString = isString;
exports.isSymbol = isSymbol;
exports.isUndefined = isUndefined;
exports.lessThan = lessThan;
exports.lessThanOrEqual = lessThanOrEqual;
exports.mapSet = mapSet;
exports.modulus = modulus;
exports.multiply = multiply;
exports.negate = negate;
exports.notEqual = notEqual;
exports.noop = noop;
exports.nth = nth;
exports.objectSet = objectSet;
exports.once = once;
exports.or = or;
exports.reverse = reverse;
exports.set = set;
exports.setSet = setSet;
exports.strictEquals = strictEquals;
exports.strictNotEqual = strictNotEqual;
exports.subtract = subtract;
exports.truthy = truthy;
exports.type = type;
exports.wrap = wrap;

},{"./combinators":1,"./helpers":27}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @description - Prototype of a generator; used to detect if a function
 * argument is a generator or a regular function.
 * @typedef {Object}
 */
var generatorProto = Object.getPrototypeOf(regeneratorRuntime.mark(function _generator() {
    return regeneratorRuntime.wrap(function _generator$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                case 'end':
                    return _context.stop();
            }
        }
    }, _generator, this);
}));

/**
 * @description d
 * @typedef {Object}
 * @property {string} Function
 * @property {string} Object
 * @property {string} Boolean
 * @property {string} Number
 * @property {string} Symbol
 * @property {string} String
 * @property {string} Undefined
 */
var javaScriptTypes = {
    Function: 'function',
    Object: 'object',
    Boolean: 'boolean',
    Number: 'number',
    Symbol: 'symbol',
    String: 'string',
    Undefined: 'undefined'
};

var typeName = {
    'boolean': _typeof(true),
    'function': typeof Function === 'undefined' ? 'undefined' : _typeof(Function),
    'number': _typeof(0),
    'object': _typeof({ a: 1 }),
    'string': _typeof(''),
    'symbol': _typeof(Symbol.iterator),
    'undefined': _typeof(void 0)
};

/**
 * @description d
 */
var collectionTypes = {
    'Generator': [generatorProto],
    'Array': [Array.prototype, Int16Array.prototype, Int8Array.prototype, Int32Array.prototype, Float32Array.prototype, Float64Array.prototype, Uint16Array.prototype, Uint32Array.prototype, Uint8Array.prototype, Uint8ClampedArray.prototype],
    'ArrayBuffer': [ArrayBuffer.prototype],
    'Map': [Map.prototype],
    'WeakMap': [WeakMap.prototype],
    'Set': [Set.prototype],
    'WeakSet': [WeakSet.prototype]
};

/**
 * @description d
 */
var observableStatus = {
    inactive: 0,
    active: 1,
    paused: 2,
    complete: 3
};

/**
 * @description d
 */
var sortDirection = {
    ascending: 1,
    descending: 2
};

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @param {*} y - b
 * @param {string} dir - c
 * @return {number} - d
 */
function sortComparer(x, y, dir) {
    var t = x > y ? 1 : x === y ? 0 : -1;
    return sortDirection.descending === dir ? t : -t;
}

/**
 * @sig
 * @description d
 * @param {function} comparer - a
 * @return {function} - b
 */
/*function cacheChecker(item) {
 console.log(((undefined !== item && items.some(function _checkEquality(it) {
 return comparer(it, item);
 }) && true) || !(items[items.length] = item)));

 return ((undefined !== item && items.some(function _checkEquality(it) {
 return comparer(it, item);
 }) && true) || !(items[items.length] = item));
 }*/

function cacher(comparer) {
    var items = [];
    function cacheChecker(item) {
        if (undefined === item || items.some(function _checkEquality(it) {
            return comparer(it, item);
        })) {
            return true;
        }
        items[items.length] = item;
        return false;
    }

    cacheChecker.contains = function _contains(item) {
        return items.some(function _checkEquality(it) {
            return comparer(it, item);
        });
    };

    return cacheChecker;
}

/**
 * @sig
 * @description d
 * @param {Generator|Array|Map|Set} collection - a
 * @param {function} comparer - b
 * @return {{contains, getValue}} - c
 */
function genericCacher(collection, comparer) {
    function createCacheChequer() {
        switch (createBitMask.apply(undefined, _toConsumableArray(buildTypeBits(collection)))) {
            case 1:
                collection = Array.from(collection);
            case 2:
                //The collection's type is some kind of an array (@see collectionTypes). We
                //can use the .some and .find to determine if the cache already holds the
                //value we're looking for or return the value respectively.
                return {
                    contains: function _contains(item) {
                        return collection.some(function _checkEquality(it) {
                            return comparer(it, item);
                        });
                    },
                    getValue: function _getValue(value) {
                        return collection.find(function _findKey(key) {
                            return comparer(key, value);
                        });
                    }
                };
                break;
            case 4:
                //TODO: find out if an ArrayBuffer can be interacted with directly at all, and
                //TODO: remove this case if it cannot, or implement this case if it can.
                break;
            case 8: //Map
            case 16: //WeakMap
            case 32: //Set
            case 64:
                //WeakSet
                //Here, the type of the collection is a Map, WeakMap, Set, or WeakSet; we can use
                //the native functionality to find the result of the cache contains the item we
                //are looking for.
                return {
                    contains: function _contains(item) {
                        return collection.values().some(function _checkEquality(it) {
                            return comparer(it, item);
                        });
                    },
                    getValue: function _getValue(value) {
                        return collection.values().find(function _findKey(key) {
                            return comparer(key, value);
                        });
                    }
                };
                break;
            case 128:
                //The collection's type is a generator. We need to turn it into an array
                //and recursively call the 'createCacheChequer' function with the array
                //that was created from the generator.
                collection = Array.from(collection);
                //return createCacheChequer(Array.from(collection));
                break;
            default:
        }
    }

    function buildTypeBits(arrayType) {
        return Object.keys(collectionTypes).map(function _buildBits(key) {
            return collectionTypes[key].some(function _findDelegate(delegate) {
                return delegate.isPrototypeOf(arrayType);
            });
        });
    }

    function createBitMask() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return args.reduce(function _reduce(curr, next, idx) {
            return curr |= next << idx;
        }, args[0]);
    }

    return createCacheChequer();
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @param {function} keyMaker - b
 * @return {function} - c
 */
function memoizer(fn, keyMaker) {
    var lookup = new Map();
    return function _memoized() {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
        }

        var key = javaScriptTypes.Function === (typeof keyMaker === 'undefined' ? 'undefined' : _typeof(keyMaker)) ? keyMaker.apply(undefined, args) : args;
        return lookup[key] || (lookup[key] = fn.apply(undefined, args));
    };
}

/**
 * @sig
 * @description d
 * @param {*} obj - a
 * @return {*} - b
 */
function deepClone(obj) {
    var uniqueObjects = new Set();

    return objectCloner(obj);

    /**
     * @sig
     * @description d
     * @param {*} obj - a
     * @return {*} - b
     */
    function objectCloner(obj) {
        //if the 'obj' parameter is a primitive type, just return it; there's no way/need to copy
        if (null == obj || 'object' !== (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) && 'function' !== typeof obj) return obj;

        //if we've already seen this 'object' before, we don't want to get caught
        //in an infinite loop; just return the 'object'. Otherwise, add it to the
        //set of viewed 'objects'
        if (uniqueObjects.has(obj)) return obj;
        uniqueObjects.add(obj);

        //if the obj parameter is a function, invoke the functionClone function and return its return...
        if ('function' === typeof obj) return functionClone(obj);

        var ret = Object.create(Object.getPrototypeOf(obj));
        //...else, reduce over the obj parameter's own keys after creating a new object that has its
        //prototype delegating to the same object that the obj's prototype delegating to. This functionality
        //will work for an array as well.
        Object.getOwnPropertyNames(obj).reduce(_reducePropNames.bind(ret), '');

        return ret;

        //this is the function used in the reduce and is bound to the context of the return (cloned) object
        function _reducePropNames(prev, curr) {
            return this[curr] = objectCloner(obj[curr]), this;
        }
    }
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @param {Object} cxt - b
 * @return {function} - c
 */
function functionClone(fn) {
    var cxt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    var clone = function _clone() {
        return fn.apply(undefined, arguments);
    }.bind(cxt);

    Object.defineProperties(clone, {
        'length': {
            value: fn.length,
            enumerable: false
        },
        'prototype': {
            value: Object.create(fn.prototype)
        },
        'name': {
            writable: true
        }
    });

    Object.getOwnPropertyNames(fn).reduce(function _reducePropName(prev, curr) {
        if ('length' !== curr && 'prototype' !== curr) return clone[curr] = deepClone(fn[curr]), clone;
        return clone;
    }, '');

    return clone;
}

/**
 * @sig
 * @description d
 * @param {Array} arr - a
 * @return {Array} - b
 */
function deepCopy(arr) {
    var length = arr.length,
        newArr = new arr.constructor(length),
        index = -1;
    while (++index < length) {
        newArr[index] = deepClone(arr[index]);
    }
    return newArr;
}

/**
 * @sig
 * @description d
 * @param {object} obj - a
 * @return {object} - b
 */
function shallowClone(obj) {
    var clone = {};
    for (var p in obj) {
        clone[p] = obj[p];
    }
    return clone;
}

var emptyObject = {};

/**
 * @sig
 * @description d
 * @param {number} len - a
 * @param {function} fn - b
 * @return {function} - c
 */
/*var alterFunctionLength = curry(function _alterFunctionLength(len, fn) {
    return Object.defineProperty(
        fn,
        'length', {
            value: len
        }
    );
});
*/

exports.javaScriptTypes = javaScriptTypes;
exports.sortDirection = sortDirection;
exports.observableStatus = observableStatus;
exports.sortComparer = sortComparer;
exports.cacher = cacher;
exports.memoizer = memoizer;
exports.deepClone = deepClone;
exports.deepCopy = deepCopy;
exports.shallowClone = shallowClone;
exports.generatorProto = generatorProto;
exports.emptyObject = emptyObject;
exports.typeName = typeName;

},{}],28:[function(require,module,exports){
'use strict';

var _observable = require('./streams/observable');

var _monads = require('./containers/monads/monads');

var _functors = require('./containers/functors/functors');

var _combinators = require('./combinators');

var combinators = _interopRequireWildcard(_combinators);

var _decorators = require('./decorators');

var decorators = _interopRequireWildcard(_decorators);

var _functionalContainerHelpers = require('./functionalContainerHelpers');

var functionalContainerHelpers = _interopRequireWildcard(_functionalContainerHelpers);

var _lenses = require('./lenses');

var lenses = _interopRequireWildcard(_lenses);

var _helpers = require('./helpers');

var helpers = _interopRequireWildcard(_helpers);

var _pointlessContainers = require('./pointlessContainers');

var pointlessContainers = _interopRequireWildcard(_pointlessContainers);

var _transducers = require('./transducers');

var transducers = _interopRequireWildcard(_transducers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

window.observable = _observable.observable || {};
window.monads = _monads.monads;
window.functors = _functors.functors;
window.combinators = combinators;
window.decorators = decorators;
window.functionalContainerHelpers = functionalContainerHelpers;
window.lenses = lenses;
window.helpers = helpers;
window.pointlessContainer = pointlessContainers;
window.transducers = transducers;

},{"./combinators":1,"./containers/functors/functors":5,"./containers/monads/monads":21,"./decorators":24,"./functionalContainerHelpers":25,"./helpers":27,"./lenses":29,"./pointlessContainers":30,"./streams/observable":31,"./transducers":50}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.unifiedLens = exports.lensPath = exports.makeLenses = exports.prismPath = exports.lens = exports.set = exports.put = exports.over = exports.view = exports.objectLens = exports.arrayLens = undefined;

var _functionalHelpers = require('./functionalHelpers');

var _combinators = require('./combinators');

var _helpers = require('./helpers');

var _maybe_monad = require('./containers/monads/maybe_monad');

var _identity_monad = require('./containers/monads/identity_monad');

var _constant_monad = require('./containers/monads/constant_monad');

var _pointlessContainers = require('./pointlessContainers');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @sig
 * @description d
 * @type {function}
 * @param {number} idx - a
 * @param {function} f - b
 * @param {Array} xs - c
 * @return {Array} - c
 */
var arrayLens = (0, _combinators.curry)(function _arrayLens(idx, f, xs) {
    return (0, _pointlessContainers.mapWith)(function _mapWith(val) {
        return (0, _functionalHelpers.arraySet)(idx, val, xs);
    }, f(xs[idx]));
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {function} f - b
 * @param {Object} xs - c
 * @return {Object} - c
 */
var objectLens = (0, _combinators.curry)(function _objectLens(prop, f, xs) {
    return (0, _pointlessContainers.mapWith)(function _map(rep) {
        return (0, _functionalHelpers.objectSet)(prop, rep, xs);
    }, f(xs[prop]));
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {string} prop - a
 * @param {function} f - b
 * @param {Array|Object} xs - c
 * @return {*} - d
 */
var unifiedLens = (0, _combinators.curry)(function _unifiedLens(prop, f, xs) {
    return (0, _pointlessContainers.mapWith)(function _mapWith(value) {
        if (Array.isArray(xs)) return (0, _functionalHelpers.arraySet)(prop, value, xs);else if (Set.prototype.isPrototypeOf(xs)) return (0, _functionalHelpers.mapSet)(prop, value, xs);
        return (0, _functionalHelpers.objectSet)(prop, value, xs);
    }, f(xs[prop]));
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} lens - a
 * @param {Object} target - b
 * @return {*} - c
 */
var view = (0, _combinators.curry)(function _view(lens, target) {
    return lens(_constant_monad.Constant)(target).value;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} lens - a
 * @param {function} mapFn - b
 * @param {Object} target - c
 * @return {*} - d
 */
var over = (0, _combinators.curry)(function _over(lens, mapFn, target) {
    return lens(function _lens(y) {
        return (0, _identity_monad.Identity)(mapFn(y));
    })(target).value;
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} lens - a
 * @param {*} val - b
 * @param {*} target - c
 * @return {*} - d
 */
var put = (0, _combinators.curry)(function _put(lens, val, target) {
    return over(lens, (0, _combinators.kestrel)(val), target);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} lens - a
 * @param {*} val - b
 * @param {Object} targetData - c
 * @return {*} - c
 */
var set = (0, _combinators.curry)(function (lens, val, targetData) {
    return over(lens, (0, _combinators.kestrel)(val), targetData);
});

/**
 * @sig
 * @description d
 * @param {Array} paths - a
 * @return {*} - b
 */
function makeLenses() {
    for (var _len = arguments.length, paths = Array(_len), _key = 0; _key < _len; _key++) {
        paths[_key] = arguments[_key];
    }

    return paths.reduce(function _pathReduce(cur, next) {
        var ol = objectLens(next);
        return put(ol, ol, cur);
    }, { num: arrayLens });
}

/**
 * @sig
 * @description d
 * @param {Array} paths - a
 * @return {function} - b
 */
function improvedLensPath() {
    var innerLensDef = (0, _combinators.curry)(function _innerLensDef(prop, fn, xs) {
        return (0, _pointlessContainers.mapWith)(function _map(rep) {
            return (0, _functionalHelpers.objectSet)(prop, rep, xs);
        }, fn(xs[prop]));
    });

    for (var _len2 = arguments.length, paths = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        paths[_key2] = arguments[_key2];
    }

    return _combinators.compose.apply(undefined, _toConsumableArray(paths.map(function _pathsMap(p) {
        innerLensDef(p);
    })));
}

/**
 * @sig
 * @description d
 * @param {Array} path - a
 * @return {*} - b
 */
function lensPath() {
    for (var _len3 = arguments.length, path = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        path[_key3] = arguments[_key3];
    }

    return _combinators.compose.apply(undefined, _toConsumableArray(path.map(function _pathMap(p) {
        return 'string' === typeof p ? objectLens(p) : arrayLens(p);
    })));
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {Array|String} path - a
 * @param {Object} obj - b
 * @return {*} - c
 */
var prismPath = (0, _combinators.curry)(function _prismPath(path, obj) {
    path = (0, _combinators.when)(not(_functionalHelpers.isArray), split('.'), path);
    var val = obj,
        idx = 0;
    while (idx < path.length) {
        if (null == val) return _maybe_monad.Maybe.Nothing();
        val = val[path[idx]];
        ++idx;
    }
    return (0, _maybe_monad.Maybe)(val);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} getter - a
 * @param {function} setter - b
 * @param {String} key - c
 * @param {function} f - d
 * @param {Array} xs - e
 * @return {*} - f
 */
var lens = (0, _combinators.curry)(function _lens(getter, setter, key, f, xs) {
    return (0, _pointlessContainers.mapWith)(function (replace) {
        return setter(key, replace, xs);
    }, f(getter(key, xs)));
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} getter - a
 * @param {function} setter - b
 * @param {String} key - c
 * @param {function} f - d
 * @param {Array} xs - e
 * @param {*} - f
 * @return {*} - g
 */
var prism = (0, _combinators.curry)(function _prism(getter, setter, key, f, xs) {
    return (0, _pointlessContainers.mapWith)(function (replace) {
        return setter(key, replace, xs);
    }, (0, _maybe_monad.Maybe)(f(getter(key, xs))));
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {String} delimiter - a
 * @param {String} string - b
 * @return {Array} - c
 */
var split = (0, _combinators.curry)(function _split(delimiter, string) {
    return string.split(delimiter);
});

exports.arrayLens = arrayLens;
exports.objectLens = objectLens;
exports.view = view;
exports.over = over;
exports.put = put;
exports.set = set;
exports.lens = lens;
exports.prismPath = prismPath;
exports.makeLenses = makeLenses;
exports.lensPath = lensPath;
exports.unifiedLens = unifiedLens;

},{"./combinators":1,"./containers/monads/constant_monad":14,"./containers/monads/identity_monad":17,"./containers/monads/maybe_monad":20,"./functionalHelpers":26,"./helpers":27,"./pointlessContainers":30}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.except = exports.intersect = exports.filter = exports.mcompose = exports.bind = exports.chain = exports.containerIterator = exports.toContainerType = exports.pluckWith = exports.mjoin = exports.liftN = exports.lift4 = exports.lift3 = exports.lift2 = exports.flatMapWith = exports.flatMap = exports.mapWith = exports.map = exports.fmap = exports.ap = exports.apply = undefined;

var _combinators = require('./combinators');

var _functionalHelpers = require('./functionalHelpers');

//TODO: I need to figure out how to structure this lib. I'd like to have several different types of containers...
//TODO: ...specifically, functors (pointed), monads, and maybe one other type. In addition, each container type
//TODO: would have several implementations: maybe, option, constant, identity, future_functor, io, etc. It would make sense
//TODO: to let the "higher" level containers delegate to the "lower" level implementations since they share all the
//TODO: functionality of the "lower" containers and add to them. In addition, a lot of the containers will have the
//TODO: same mapWith, flatMapWith, chain, apply, etc functionality; it would be nice to share this functionality as well.
//TODO: Finally, I'd like to have each container in a category be capable of converting their underlying value to
//TODO: another container of the same category without the use of 'apply', more in the manner of 'toContainerX'.
//TODO: However, this means that each container in a given category has a dependency on all the other containers in
//TODO: the same category. This, more than the rest, makes structuring this lib difficult. I'd like to, at the very
//TODO: least, split each container category up so that they can be imported (and preferably downloaded) individually.
//TODO: But the more separation between containers, the more they have to 'import' each other.

/**
 * @sig
 * @description d
 * @type {function}
 * @param {Object} ma - a
 * @param {Object} mb - b
 * @return {Object} - c
 */
var apply = (0, _combinators.curry)(function _apply(ma, mb) {
    return mb.apply(ma);
});

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @param {Object} mb - b
 * @return {Object} - c
 */
var ap = apply;

/**
 * @sig
 * @description d
 * @type {function}
 * @param {Object} m - a
 * @param {function} fn :: (a) -> Monad b - b
 * @return {Object} - c
 */
var flatMap = (0, _combinators.curry)(function _flatMap(m, fn) {
    return m.flatMap(fn);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {Object} m - b
 * @return {Object} - c
 */
var flatMapWith = (0, _combinators.curry)(function _flatMapWith(fn, m) {
    return m.flatMap(fn);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {Object} m - a
 * @param {function} fn :: (a) -> b
 * @return {Object} - b
 */
var map = (0, _combinators.curry)(function _map(m, fn) {
    return m.map(fn);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} fn - a
 * @param {Object} m - b
 * @return {Object} - c
 */
var mapWith = (0, _combinators.curry)(function _map(fn, m) {
    return m.map(fn);
});

/**
 * @sig
 * @description d
 */
var pluckWith = (0, _combinators.compose)(mapWith, _functionalHelpers.getWith);

/**
 * @sig
 * @description d
 * @type {function}
 * @see mapWith
 * @param {function} fn - a
 * @param {Object} m - b
 * @return {*} c
 */
var fmap = mapWith;

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {Object} m - b
 * @return {*} - c
 */
var chain = (0, _combinators.curry)(function _chain(f, m) {
    return m.map(f).join(); // or compose(join, mapWith(f))(m)
});

/**
 * @sig
 * @description d
 */
var bind = chain;

/**
 * @sig
 * @description d
 * @param {function} f - a
 * @param {function} g - b
 * @return {function} - c
 */
var mcompose = function _mcompose(f, g) {
    return (0, _combinators.compose)(chain(f), g);
};

/**
 * @sig
 * @description d
 * @type {function}
 * @param {*} val - a
 * @param {Object} fa - b
 * @return {Object} - c
 */
var put = (0, _combinators.curry)(function _put(val, fa) {
    return fa.put(val);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {Object} m1 - b
 * @param {Object} m2 - c
 * @return {Object} - c
 */
var lift2 = (0, _combinators.curry)(function _lift2(f, m1, m2) {
    return m1.map(f).apply(m2);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {Object} m1 - b
 * @param {Object} m2 - c
 * @param {Object} m3 - d
 * @return {Object} - e
 */
var lift3 = (0, _combinators.curry)(function _lift3(f, m1, m2, m3) {
    return lift2(f, m1, m2).apply(m3);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {Object} m1 - b
 * @param {Object} m2 - c
 * @param {Object} m3 - d
 * @param {Object} m4 - e
 * @return {Object} - f
 */
var lift4 = (0, _combinators.curry)(function _lift4(f, m1, m2, m3, m4) {
    return lift3(f, m1, m2, m3).apply(m4);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {Object} ...ms - b
 * @return {Object} - c
 */
var liftN = (0, _combinators.curry)(function _liftN(f) {
    for (var _len = arguments.length, ms = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        ms[_key - 1] = arguments[_key];
    }

    return ms.slice(1).reduce(function _apply(curM, nextM) {
        return curM.apply(nextM);
    }, ms.shift().map(f));
});

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function mjoin(ma) {
    return ma.join();
}

/**
 * @sig
 * @description d
 * @param {Object} type - a
 * @return {function} - b
 */
function toContainerType(type) {
    return function toType() {
        var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _combinators.identity;

        return type.of(fn(this.value));
    };
}

/**
 * @sig
 * @description d
 * @return {Object} - a
 */
function containerIterator() {
    var first = true,
        val = this.value;
    return {
        next: function _next() {
            if (first) {
                first = false;
                return {
                    done: false,
                    value: val
                };
            }
            return {
                done: true
            };
        }
    };
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toList(ma) {
    return List(mjoin(ma));
}

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toMaybe(ma) {}
//return Maybe(mjoin(ma));


/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toFuture(ma) {}
//return Future(mjoin(ma));


/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toIdentity(ma) {}
//return Identity(mjoin(ma));


/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {Object} - b
 */
function toJust(ma) {}
//return Just(mjoin(ma));


//===========================================================================================//
//===========================================================================================//
//=======================           CONTAINER TRANSFORMERS            =======================//
//===========================================================================================//
//===========================================================================================//

function _toIdentity() {
    //return Identity.from(this.value);
}

function _toJust() {
    //return Just.from(this.value);
}

function _toList() {
    //return List.from(this.value);
}

function _toMaybe() {}
//return Maybe.from(this.value);


//===========================================================================================//
//===========================================================================================//
//============================           LIST HELPERS            ============================//
//===========================================================================================//
//===========================================================================================//

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} predicate - a
 * @param {Array} xs - b
 * @return {Array} - c
 */
var filter = (0, _combinators.curry)(function _filter(predicate, xs) {
    xs.filter(predicate);
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {Array} xs - a
 * @param {function} comparer - b
 * @param {Array} ys - c
 * @return {Array} - d
 */
var intersect = (0, _combinators.curry)(function _intersect(xs, comparer, ys) {
    return ys.intersect(xs, comparer);
});

/**
 * @sig
 * @description d
 * @param {Array} xs - a
 * @param {function} comparer - b
 * @param {Array} - c
 * @return {*} - d
 */
var except = (0, _combinators.curry)(function _except(xs, comparer, ys) {
    return ys.except(xs, comparer);
});

exports.apply = apply;
exports.ap = ap;
exports.fmap = fmap;
exports.map = map;
exports.mapWith = mapWith;
exports.flatMap = flatMap;
exports.flatMapWith = flatMapWith;
exports.lift2 = lift2;
exports.lift3 = lift3;
exports.lift4 = lift4;
exports.liftN = liftN;
exports.mjoin = mjoin;
exports.pluckWith = pluckWith;
exports.toContainerType = toContainerType;
exports.containerIterator = containerIterator;
exports.chain = chain;
exports.bind = bind;
exports.mcompose = mcompose;
exports.filter = filter;
exports.intersect = intersect;
exports.except = except;

},{"./combinators":1,"./functionalHelpers":26}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.observable = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _helpers = require('../helpers');

var _subscriber = require('./subscribers/subscriber');

var _operators = require('./streamOperators/operators');

var _functionalHelpers = require('../functionalHelpers');

var _combinators = require('../combinators');

//TODO: I thinking about implementing an 'observable watcher' functionality. the concept would be
//TODO: that you have an observable that is registered to watch one or more other observables. When
//TODO: the complete or error, the watcher will be notified in its .next handler. To do this, I'd
//TODO: need to assign each observable a unique id, and allow an observable watching to register a
//TODO: unique handler per watched observable if so desired.
var observable = {
    get source() {
        return this._source;
    },
    set source(src) {
        this._source = src;
    },
    get operator() {
        return this._operator;
    },
    set operator(op) {
        this._operator = op;
    },
    setSource: function _setSource(src) {
        this.source = src;
        return this;
    },
    setOperator: function _setOperator(op) {
        this.operator = op;
        return this;
    },
    /**
     * @sig
     * @description d
     * @param {function} fn - a
     * @return {observable} - b
     */
    map: function _map(fn) {
        if (_operators.mapOperator.isPrototypeOf(this.operator)) return this.lift.call(this.source, Object.create(_operators.mapOperator).init((0, _combinators.compose)(fn, this.operator.transform)));
        return this.lift(Object.create(_operators.mapOperator).init(fn));
    },
    /**
     * @sig
     * @description d
     * @param {function} fn - a
     * @return {observable} - b
     */
    chain: function _deepMap(fn) {
        return this.lift(Object.create(_operators.chainOperator).init(fn));
    },
    /**
     * @sig
     * @description d
     * @param {function} predicate - a
     * @return {observable} - b
     */
    filter: function _filter(predicate) {
        if (_operators.filterOperator.isPrototypeOf(this.operator)) return this.lift.call(this.source, Object.create(_operators.filterOperator).init((0, _functionalHelpers.and)(predicate, this.operator.predicate)));
        return this.lift(Object.create(_operators.filterOperator).init(predicate));
    },
    /**
     * @sig
     * @description d
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @param {number} bufferAmt - c
     * @return {observable} - d
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var bufferAmt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        return this.lift(Object.create(_operators.groupByOperator).init(keySelector, comparer, bufferAmt));
    },
    /**
     * @sig
     * @description d
     * @param {Array} observables - a
     * @return {observable} - b
     */
    merge: function _merge() {
        for (var _len = arguments.length, observables = Array(_len), _key = 0; _key < _len; _key++) {
            observables[_key] = arguments[_key];
        }

        if (_operators.mergeOperator.isPrototypeOf(this.operator)) return this.lift.call(this.source, Object.create(_operators.mergeOperator).init([this].concat(observables, this.operator.observables)));
        return this.lift(Object.create(_operators.mergeOperator).init([this].concat(observables)));
    },
    /**
     * @sig
     * @description d
     * @param {Number} count - a
     * @return {observable} - b
     */
    itemBuffer: function _itemBuffer(count) {
        return this.lift(Object.create(_operators.itemBufferOperator).init(count));
    },
    /**
     * @sig
     * @description d
     * @param {Number} amt - a
     * @return {observable} - b
     */
    timeBuffer: function _timeBuffer(amt) {
        return this.lift(Object.create(_operators.timeBufferOperator).init(amt));
    },
    /**
     * @sig
     * @description d
     * @param {Number} amt - a
     * @return {*|observable} - b
     */
    debounce: function _debounce(amt) {
        return this.lift(Object.create(_operators.debounceOperator).init(amt));
    },
    /**
     * @sig
     * @description d
     * @param {function} operator - a
     * @return {observable} - b
     */
    lift: function lift(operator) {
        return Object.create(observable).setSource(this).setOperator(operator);
    },
    /**
     * @sig
     * @description d
     * @param {*} src - a
     * @param {string} evt - b
     * @return {observable} - c
     */
    fromEvent: function _fromEvent(src, evt) {
        var o = Object.create(observable);
        o.source = src;
        o.event = evt;
        o.subscribe = function _subscribe(subscriber) {
            var source = this.source,
                event = this.event;

            function eventHandler(e) {
                return subscriber.next(e);
            }

            function unSub() {
                subscriber.status = _helpers.observableStatus.complete;
                return source.removeEventListener(event, eventHandler);
            }
            source.addEventListener(event, eventHandler);
            subscriber.unsubscribe = unSub;
            return subscriber;
        };
        return o;
    },
    /**
     * @sig
     * @description d
     * @param {Array} list - a
     * @param {Number} startingIdx - b
     * @return {observable} - c
     */
    fromList: function _fromList(list) {
        var startingIdx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        var o = Object.create(observable);
        o.source = list;
        o.idx = startingIdx;
        o.subscribe = function _subscribe(subscriber) {
            function unSub() {
                this.status = _helpers.observableStatus.complete;
            }

            var runner = function _runner() {
                if (subscriber.status !== _helpers.observableStatus.paused && subscriber.status !== _helpers.observableStatus.complete && this.idx < this.source.length) {
                    Promise.resolve(this.source[this.idx++]).then(function _resolve(val) {
                        subscriber.next(val);
                        runner();
                    });
                } else {
                    var d = subscriber;
                    while (d.subscriber.subscriber) {
                        d = d.subscriber;
                    }d.unsubscribe();
                }
            }.bind(this);

            Promise.resolve().then(function _callRunner() {
                runner();
            });

            subscriber.unsubscribe = unSub;
            return subscriber;

            /*
            var runner = (function _runner() {
                if (subscriber.status !== observableStatus.paused && subscriber.status !== observableStatus.complete && this.idx < this.source.length) {
                    for (let item of source) {
                        Promise.resolve(item)
                            .then(function _resolve(val) {
                                subscriber.next(val);
                                runner();
                            });
                    }
                }
                else {
                    //TODO: don't think I need to do this 'recursive' unsubscribe here since the
                    //TODO: unsubscribe function is itself recursive
                    var d = subscriber;
                    while (d.subscriber.subscriber) d = d.subscriber;
                    d.unsubscribe();
                }
            }).bind(this);
              Promise.resolve()
                .then(function _callRunner() {
                    runner();
                });
            */

            /*
            Promise.resolve()
                .then(function _callRunner() {
                    ((function _runner() {
                        if (subscriber.status !== observableStatus.paused && subscriber.status !== observableStatus.complete &&
                            this.idx < this.source.length) {
                            for (let item of source) {
                                Promise.resolve(item)
                                    .then(function _resolve(val) {
                                        subscriber.next(val);
                                        _runner();
                                    });
                            }
                        }
                        else {
                            //TODO: don't think I need to do this 'recursive' unsubscribe here since the
                            //TODO: unsubscribe function is itself recursive
                            var d = subscriber;
                            while (d.subscriber.subscriber) d = d.subscriber;
                            d.unsubscribe();
                        }
                    }).bind(this))();
                });
            */

            //subscriber.unsubscribe = unSub;
            //return subscriber;
        };
        return o;
    },
    fromArray: function _fromArray(arr) {
        var startingIdx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    },
    /**
     * @sig
     * @description Creates a new observable from a generator function
     * @param {*} src - a
     * @return {observable} - b
     */
    fromGenerator: function _fromGenerator(src) {
        var o = Object.create(observable);
        o.source = src;
        o.subscribe = function _subscribe(subscriber_next, error, complete) {
            var it = this.source();
            (function _runner() {
                if ('object' !== (typeof subscriber_next === 'undefined' ? 'undefined' : _typeof(subscriber_next)) || subscriber_next.status !== _helpers.observableStatus.paused && subscriber_next.status !== _helpers.observableStatus.complete) {
                    Promise.resolve(it.next()).then(function _then(val) {
                        if (!val.done) {
                            if ('function' === typeof subscriber_next) subscriber_next(val.value);else subscriber_next.next(val.value);
                            _runner();
                        }
                    });
                } else if ('function' !== typeof subscriber_next) {
                    this.unsubscribe();
                } else complete();
            }).bind(this)();
        };
        return o;
    },
    /**
     * @sig
     * @description d
     * @param {*} src - a
     * @return {observable} - Returns a new observable
     */
    from: function _from(src) {
        if (_helpers.generatorProto.isPrototypeOf(src)) return this.fromGenerator(src);
        return this.fromList(src[Symbol.iterator] ? src : (0, _functionalHelpers.wrap)(src));
    },
    /**
     * @sig
     * @description Creates a new subscriber for this observable. Takes three function handlers;
     * a 'next' handler that receives each item after having passed through the lower
     * level subscribers, an 'error' handler that is called if an exception is thrown
     * while the stream is active, and a complete handler that is called whenever the
     * stream is done.
     * @param {function} next - A function handler
     * @param {function} error - A function handler
     * @param {function} complete - A function handler
     * @return {subscriber} - a
     */
    subscribe: function _subscribe(next, error, complete) {
        var s = Object.create(_subscriber.subscriber).initialize(next, error, complete);
        if (this.operator) this.operator.subscribe(s, this.source);
        return s;
    },
    /**
     * @sig
     * @description d
     * @param {function} next - a
     * @return {*} - b
     */
    onValue: function _onValue(next) {
        var s = Object.create(_subscriber.subscriber).initialize(next, _functionalHelpers.noop, _functionalHelpers.noop);
        if (this.operator) this.operator.subscriber(s, this.source);
        return s;
    }
};

exports.observable = observable;

},{"../combinators":1,"../functionalHelpers":26,"../helpers":27,"./streamOperators/operators":39,"./subscribers/subscriber":48}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainOperator = undefined;

var _chainSubscriber = require('../subscribers/chainSubscriber');

var chainOperator = {
    get transform() {
        return this._transform;
    },
    set transform(fn) {
        this._transform = fn;
    },
    init: function _init(projectionFunc) {
        this.transform = projectionFunc;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_chainSubscriber.chainSubscriber).init(subscriber, this.transform));
    }
};

exports.chainOperator = chainOperator;

},{"../subscribers/chainSubscriber":41}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debounceOperator = undefined;

var _debounceSubscriber = require('../subscribers/debounceSubscriber');

var debounceOperator = {
    init: function _init(amt) {
        this.interval = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_debounceSubscriber.debounceSubscriber).init(subscriber, this.interval));
    }
};

exports.debounceOperator = debounceOperator;

},{"../subscribers/debounceSubscriber":42}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filterOperator = undefined;

var _filterSubscriber = require('../subscribers/filterSubscriber');

var filterOperator = {
    get predicate() {
        return this._predicate;
    },
    set predicate(fn) {
        this._predicate = fn;
    },
    init: function _init(predicate) {
        this.predicate = predicate;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_filterSubscriber.filterSubscriber).init(subscriber, this.predicate));
    }
};

exports.filterOperator = filterOperator;

},{"../subscribers/filterSubscriber":43}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupByOperator = undefined;

var _groupBySubscriber = require('../subscribers/groupBySubscriber');

var groupByOperator = {
    get keySelector() {
        return this._keySelector;
    },
    set keySelector(ks) {
        this._keySelector = ks;
    },
    get comparer() {
        return this._comparer;
    },
    set comparer(c) {
        this._comparer = c;
    },
    get bufferAmount() {
        return this._bufferAmount || 0;
    },
    set bufferAmount(amt) {
        this._bufferAmount = amt;
    },
    init: function _init(keySelector, comparer, bufferAmount) {
        this.keySelector = keySelector;
        this.comparer = comparer;
        this.bufferAmount = bufferAmount;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_groupBySubscriber.groupBySubscriber).init(subscriber, this.keySelector, this.comparer, this.bufferAmount));
    }
};

exports.groupByOperator = groupByOperator;

},{"../subscribers/groupBySubscriber":44}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.itemBufferOperator = undefined;

var _itemBufferSubscriber = require('../subscribers/itemBufferSubscriber');

var itemBufferOperator = {
    init: function _init(amt) {
        this.count = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_itemBufferSubscriber.itemBufferSubscriber).init(subscriber, this.count));
    }
};

exports.itemBufferOperator = itemBufferOperator;

},{"../subscribers/itemBufferSubscriber":45}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapOperator = undefined;

var _mapSubscriber = require('../subscribers/mapSubscriber');

var mapOperator = {
    get transform() {
        return this._transform;
    },
    set transform(fn) {
        this._transform = fn;
    },
    init: function _init(projectionFunc) {
        this.transform = projectionFunc;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_mapSubscriber.mapSubscriber).init(subscriber, this.transform));
    }
};

exports.mapOperator = mapOperator;

},{"../subscribers/mapSubscriber":46}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeOperator = undefined;

var _mergeSubscriber = require('../subscribers/mergeSubscriber');

var mergeOperator = {
    get observables() {
        return this._observables || [];
    },
    set observables(arr) {
        this._observables = arr;
    },
    init: function _init(observables) {
        this.observables = observables;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_mergeSubscriber.mergeSubscriber).init(subscriber, this.observables));
    }
};

exports.mergeOperator = mergeOperator;

},{"../subscribers/mergeSubscriber":47}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeBufferOperator = exports.mergeOperator = exports.mapOperator = exports.itemBufferOperator = exports.groupByOperator = exports.filterOperator = exports.chainOperator = exports.debounceOperator = undefined;

var _debounceOperator = require('./debounceOperator');

var _chainOperator = require('./chainOperator');

var _filterOperator = require('./filterOperator');

var _groupByOperator = require('./groupByOperator');

var _itemBufferOperator = require('./itemBufferOperator');

var _mapOperator = require('./mapOperator');

var _mergeOperator = require('./mergeOperator');

var _timeBufferOperator = require('./timeBufferOperator');

exports.debounceOperator = _debounceOperator.debounceOperator;
exports.chainOperator = _chainOperator.chainOperator;
exports.filterOperator = _filterOperator.filterOperator;
exports.groupByOperator = _groupByOperator.groupByOperator;
exports.itemBufferOperator = _itemBufferOperator.itemBufferOperator;
exports.mapOperator = _mapOperator.mapOperator;
exports.mergeOperator = _mergeOperator.mergeOperator;
exports.timeBufferOperator = _timeBufferOperator.timeBufferOperator;

},{"./chainOperator":32,"./debounceOperator":33,"./filterOperator":34,"./groupByOperator":35,"./itemBufferOperator":36,"./mapOperator":37,"./mergeOperator":38,"./timeBufferOperator":40}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.timeBufferOperator = undefined;

var _timeBufferSubscriber = require('../subscribers/timeBufferSubscriber');

var timeBufferOperator = {
    init: function _init(amt) {
        this.interval = amt;
        return this;
    },
    subscribe: function _subscribe(subscriber, source) {
        return source.subscribe(Object.create(_timeBufferSubscriber.timeBufferSubscriber).init(subscriber, this.interval));
    }
};

exports.timeBufferOperator = timeBufferOperator;

},{"../subscribers/timeBufferSubscriber":49}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.chainSubscriber = undefined;

var _subscriber = require('./subscriber');

var chainSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            var mappedResult;
            try {
                mappedResult = recursiveMap(item);
            } catch (err) {
                this.subscriber.error(err);
                return;
            }
            this.subscriber.next(mappedResult);
            //Promise.resolve(mappedResult).then(this.then);

            function recursiveMap(item) {
                if (isArray(item)) {
                    var res = [];
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = item[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var it = _step.value;

                            res = res.concat(recursiveMap(it));
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator.return) {
                                _iterator.return();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    return res;
                }
                return this.transform(item, this.count++);
            }
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, transform) {
            this.initialize(subscriber);
            this.transform = transform;
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.chainSubscriber = chainSubscriber;

},{"./subscriber":48}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debounceSubscriber = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _subscriber = require('./subscriber');

var _helpers = require('../../helpers');

var debounceSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            if (null != this.id) this.tearDownTimeout();
            this.lastItem = item;
            this.lastTick = Date.now();
            this.id = setTimeout(this.getTimeoutFunc.bind(this), this.interval, item);
        }
    },
    init: {
        value: function _init(subscriber, interval) {
            this.initialize(subscriber);
            this.lastTick = null;
            this.lastItem = undefined;
            this.interval = interval;
            this.id = null;
            return this;
        }
    },
    getTimeoutFunc: {
        get: function _getTimeoutFunc() {
            return function timeoutFunc(item) {
                var thisTick = Date.now();
                if (this.lastTick <= thisTick - this.interval) {
                    var tmp = this.lastItem;
                    this.lastItem = undefined;
                    this.lastTick = thisTick;
                    this.subscriber.next(tmp);
                } else {
                    this.lastTick = thisTick;
                    this.lastItem = item;
                }
            };
        }
    },
    cleanUp: {
        value: function _cleanUp() {
            this.tearDownTimeout();
            this.lastTick = undefined;
            this.lastItem = undefined;
        }
    },
    tearDownTimeout: {
        value: function _tearDownTimeout() {
            if (this.id && _helpers.javaScriptTypes.Number === _typeof(this.id)) {
                clearTimeout(this.id);
                this.id = null;
            }
        }
    }
});

exports.debounceSubscriber = debounceSubscriber;

},{"../../helpers":27,"./subscriber":48}],43:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filterSubscriber = undefined;

var _subscriber = require('./subscriber');

var filterSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            try {
                if (this.predicate(item, this.count++)) this.subscriber.next(item);
                //Promise.resolve(item).then(this.then);
            } catch (err) {
                this.subscriber.error(err);
            }
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, predicate) {
            this.initialize(subscriber);
            this.predicate = predicate;
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.filterSubscriber = filterSubscriber;

},{"./subscriber":48}],44:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.groupBySubscriber = undefined;

var _subscriber = require('./subscriber');

var _sortHelpers = require('../../containers/sortHelpers');

var groupBySubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            if (this.buffer.length + 1 >= this.bufferAmount) {
                try {
                    var res = groupData(this.buffer, [{ keySelector: this.keySelector, comparer: this.comparer, direction: 'desc' }]);
                    this.subscriber.next(res);
                    this.buffer.length = 0;
                } catch (ex) {
                    this.subscriber.error(ex);
                }
            } else this.buffer[this.buffer.length] = item;
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, keySelector, comparer, bufferAmount) {
            this.initialize(subscriber);
            this.keySelector = keySelector;
            this.comparer = comparer;
            this.bufferAmount = bufferAmount;
            this.buffer = [];
            return this;
        },
        writable: false,
        configurable: false
    }
});

function groupData(data, groupObject) {
    var sortedData = (0, _sortHelpers.sortData)(data, groupObject),
        retData = [];

    sortedData.forEach(function _groupSortedData(item) {
        var grp = retData;
        groupObject.forEach(function _createGroupsByFields(group) {
            grp = findGroup(grp, group.keySelector(item));
        });
        grp[grp.length] = item;
    });

    return retData;
}

function findGroup(arr, field) {
    var grp;
    if (arr.some(function _findGroup(group) {
        if (group.key === field) {
            grp = group;
            return true;
        }
    })) return grp;else {
        grp = [];
        grp.key = field;
        arr.push(grp);
        return grp;
    }
}

exports.groupBySubscriber = groupBySubscriber;

},{"../../containers/sortHelpers":23,"./subscriber":48}],45:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.itemBufferSubscriber = undefined;

var _subscriber = require('./subscriber');

var itemBufferSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(val) {
            this.buffer[this.buffer.length] = val;
            if (this.buffer.length >= this.count) {
                this.subscriber.next(this.buffer.map(function _mapBuffer(item) {
                    return item;
                }));
                this.buffer.length = 0;
            }
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, count) {
            this.initialize(subscriber);
            this.buffer = [];
            this.count = count;
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.itemBufferSubscriber = itemBufferSubscriber;

},{"./subscriber":48}],46:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapSubscriber = undefined;

var _subscriber = require('./subscriber');

var mapSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            var res;
            try {
                res = this.transform(item, this.count++);
            } catch (err) {
                this.subscriber.error(err);
                return;
            }
            this.subscriber.next(res);
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, transform) {
            this.initialize(subscriber);
            this.transform = transform;
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.mapSubscriber = mapSubscriber;

},{"./subscriber":48}],47:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mergeSubscriber = undefined;

var _subscriber = require('./subscriber');

var mergeSubscriber = Object.create(_subscriber.subscriber, {
    next: {
        value: function _next(item) {
            if (this.transform) {
                var res;
                try {
                    res = this.transform(item, this.count++);
                } catch (err) {
                    this.subscriber.error(err);
                    return;
                }
                //Promise.resolve(res).then(this.then);
                this.subscriber.next(res);
            } else this.subscriber.next(item);
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, observables, transform) {
            this.transform = transform;
            observables.forEach(function _subscribeToEach(observable) {
                observable.subscribe(this);
            }, this);
            this.initialize(subscriber);
            return this;
        },
        writable: false,
        configurable: false
    }
});

exports.mergeSubscriber = mergeSubscriber;

},{"./subscriber":48}],48:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.subscriber = undefined;

var _helpers = require('../../helpers');

/**
 * @type {
 *  {
 *      status, status,
 *      count, count,
 *      removeSubscriber: subscriber._removeSubscriber,
 *      removeSubscription: subscriber._removeSubscription,
 *      removeSubscriptions: subscriber._removeSubscriptions,
 *      next: subscriber._next,
 *      error: subscriber._error,
 *      complete: subscriber._complete,
 *      initialize: subscriber._initialize,
 *      onError: subscriber._onError,
 *      onComplete: subscriber._onComplete,
 *      unsubscribe: subscriber._unsubscribe
 *    }
 *  }
 *  @description:
 */
var subscriber = {
    get status() {
        return this._status || _helpers.observableStatus.inactive;
    },
    set status(status) {
        this._status = Object.keys(_helpers.observableStatus).map(function _statusValues(status) {
            return _helpers.observableStatus[status];
        }).includes(status) ? status : _helpers.observableStatus.inactive;
    },
    get count() {
        return this._count || 0;
    },
    set count(cnt) {
        this._count = cnt || 0;
    },
    /**
     * @sig
     * @description d
     * @return {subscriber} - a
     */
    removeSubscriber: function _removeSubscriber() {
        this.subscriber = null;
        return this;
    },
    /**
     * @sig
     * @description d
     * @param {Object} subscription - a
     * @return {subscription} - b
     */
    removeSubscription: function _removeSubscription(subscription) {
        if (this.subscriptions.length) {
            this.subscriptions = this.subscriptions.filter(function _findSubscriber(sub) {
                return sub !== subscription;
            });
        }
    },
    /**
     * @sig
     * @description d
     * @return {subscriber} - a
     */
    removeSubscriptions: function _removeSubscriptions() {
        this.subscriptions.length = 0;
        return this;
    },
    /**
     * @sig
     * @description d
     * @param {*} item - a
     * @return {subscriber} - b
     */
    next: function _next(item) {
        this.subscriber.next(item);
        return this;
        //Promise.resolve(item).then(this.then);
    },
    error: function _error(err) {
        this.status = _helpers.observableStatus.complete;
        this.subscriber.error(err);
    },
    complete: function _complete() {
        this.status = _helpers.observableStatus.complete;
        if (this.subscriber && _helpers.observableStatus.complete !== this.subscriber.status) this.subscriber.complete();
    },
    initialize: function _initialize(next, error, complete) {
        this.status = _helpers.observableStatus.active;
        this.count = 0;
        this.subscriptions = [];
        this.then = function _then(val) {
            return this.subscriber.next(val);
        }.bind(this);

        if (subscriber.isPrototypeOf(next)) {
            this.subscriber = next;
            next.subscriptions = next.subscriptions ? next.subscriptions.concat(this) : [].concat(this);
            return this;
        }
        this.subscriber = {
            next: next,
            error: error,
            complete: complete
        };
        return this;
    },
    onError: function _onError(error) {
        this.subscriber.error = error;
        return this;
    },
    onComplete: function _onComplete(complete) {
        this.subscriber.complete = complete;
        return this;
    },
    unsubscribe: function _unsubscribe() {
        if (_helpers.observableStatus.complete === this.status) return;
        this.complete();
        if (this.subscriber && subscriber.isPrototypeOf(this.subscriber)) {
            var sub = this.subscriber;
            this.subscriber = null;
            sub.unsubscribe();
        }

        while (this.subscriptions.length) {
            var subscription = this.subscriptions.shift();
            if (subscription.cleanUp) subscription.cleanUp();
            subscription.unsubscribe();
        }
    }
};

exports.subscriber = subscriber;

},{"../../helpers":27}],49:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.timeBufferSubscriber = undefined;

var _subscriber = require('./subscriber');

var timeBufferSubscriber = Object.create(_subscriber.subscriber, {
    id: {
        get: function _getId() {
            return this._id || 0;
        },
        set: function _setId(val) {
            this._id = val;
        }
    },
    next: {
        value: function _next(val) {
            this.buffer[this.buffer.length] = val;
        },
        writable: false,
        configurable: false
    },
    init: {
        value: function _init(subscriber, interval) {
            this.initialize(subscriber);
            this.buffer = [];
            this.now = Date.now;

            function _interval() {
                if (this.buffer.length) {
                    //the map is needed here because, due to the asychronous nature of subscribers and the subsequent
                    //clearing of the buffer, the subscriber#next argument would be nullified before it had a chance
                    //to act on it.
                    this.subscriber.next(this.buffer.map(function _mapBuffer(item) {
                        return item;
                    }));
                    this.buffer.length = 0;
                }
            }

            this.id = setInterval(_interval.bind(this), interval);
            return this;
        },
        writable: false,
        configurable: false
    },
    cleanUp: {
        value: function _cleanUp() {
            clearInterval(this.id);
            this.buffer.length = 0;
        },
        writable: false,
        configurable: false
    }
});

exports.timeBufferSubscriber = timeBufferSubscriber;

},{"./subscriber":48}],50:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.taking = exports.dropping = exports.reduce = exports.transduce = exports.mapped = exports.filterReducer = exports.mapReducer = exports.filtering = exports.mapping = undefined;

var _combinators = require('./combinators');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @return {*} - b
 */
var mapping = (0, _combinators.curry)(function _mapping(mapFn, reduceFn, result, input) {
    return reduceFn(result, mapFn(input));
});

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} predicate - a
 * @param {function} reduceFn - b
 * @param {*} result - c
 * @param {Array} input - d
 * @return {*} - d
 */
var filtering = (0, _combinators.curry)(function _filtering2(predicate, reduceFn, result, input) {
    return predicate(input) ? reduceFn(result, input) : result;
});

/**
 * @sig
 * @description d
 * @param {function} mapFn - a
 * @return {function} - b
 */
function mapReducer(mapFn) {
    return function _mapReducer(result, input) {
        return result.concat(mapFn(input));
    };
}

/**
 * @sig
 * @description d
 * @param {function} predicate - a
 * @return {function} - b
 */
function filterReducer(predicate) {
    return function _filterReducer(result, input) {
        return predicate(input) ? result.concat(input) : result;
    };
}

/**
 * @sig
 * @description d
 * @type {function}
 * @param {function} f - a
 * @param {*} x - b
 * @return {*} - c
 */
var mapped = (0, _combinators.curry)(function _mapped(f, x) {
    return identity(map((0, _combinators.compose)(function _mCompose(x) {
        return x.value;
    }, f), x));
});

/**
 * @sig
 * @description d
 * @param {function} xform - a
 * @param {function} reducing - b
 * @param {*} initial - c
 * @param {*} input - d
 * @return {*} - e
 */
var transduce = function transduce(xform, reducing, initial, input) {
    return input.reduce(xform(reducing), initial);
};

/**
 * @sig
 * @description d
 * @param {*} txf - a
 * @param {*} acc - b
 * @param {*} xs - c
 * @return {*} - d
 */
var reduce = function reduce(txf, acc, xs) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = xs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            var next = txf(acc, item); //we could also pass an index or xs, but K.I.S.S.
            acc = next && next[reduce.stopper] || next; // {[reduce.stopper]:value} or just a value
            if (next[reduce.stopper]) {
                break;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return acc;
};

Object.defineProperty(reduce, 'stopper', {
    enumerable: false,
    configurable: false,
    writable: false,
    value: Symbol('stop reducing') //no possible computation could come up with this by accident
});

/**
 * @sig
 * @description d
 * @param {number} skips - a
 * @return {function} - b
 */
function dropping(skips) {
    return function _dropping2(reducingFunc) {
        return function _dropping2_(acc, item) {
            return 0 <= --skips ? acc : reducingFunc(acc, item);
        };
    };
}

/*
var taking = allows => reducerFn => (acc, item) => {
    let result = reducerFn(acc, item);
    return 0 < --allows ? result : { [reduce.stopper]: result };
};
*/

/**
 * @sig
 * @description d
 * @param {*} allows - a
 * @return {function} - b
 */
var taking = function taking(allows) {
    return function (reducerFn) {
        var _allows = allows;
        return function (acc, item) {
            return 0 < --_allows ? reducerFn(acc, item) : _defineProperty({}, reduce.stopper, reducerFn(acc, item));
        };
    };
};

//var map = curry((mapFn, redFn) => (xs, x) => redFn(xs, mapFn(x)));
//var inc = reduce(map(add(1), concat), []);

//var filter = curry((predFn, redFn) => (xs, x) => predFn(x) ? redFn(xs, x) : xs);
//var greaterThanOne = reduce(filter(x => 1 < x, concat), []);

//var transduce2 = curry((xForm, f, init, coll) => reduce(xForm(f), init, coll));
//console.log(transduce2(map(add(1)), concat, [], [1, 2, 3, 4]));

exports.mapping = mapping;
exports.filtering = filtering;
exports.mapReducer = mapReducer;
exports.filterReducer = filterReducer;
exports.mapped = mapped;
exports.transduce = transduce;
exports.reduce = reduce;
exports.dropping = dropping;
exports.taking = taking;

},{"./combinators":1}]},{},[28]);
