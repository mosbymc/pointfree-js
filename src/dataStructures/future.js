import { once, type, strictEquals } from '../functionalHelpers';
import { ifElse, constant, identity } from '../combinators';
import { join, valueOf, traverse } from './data_structure_util';
import { javaScriptTypes } from '../helpers';

/**
 * @signature
 * @description d
 * @private
 * @param {function} reject - a
 * @param {function} resolve - b
 * @return {function} - c
 */
function safeFork(reject, resolve) {
    return function _safeFork(val) {
        try {
            //this._value = resolve(val);
            //return this._value;
            return resolve(val);
        }
        catch(ex) {
            reject(ex);
        }
    };
}

/**
 * @signature - :: * -> {@link dataStructures.future}
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.future} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.future}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Future
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} fn - The value that should be set as the underlying
 * value of the {@link dataStructures.future}.
 * @return {dataStructures.future} - Returns a new object that delegates to the
 * {@link dataStructures.future}.
 */
function Future(fn) {
    return Object.create(future, {
        _source: {
            value: fn,
            writable: false,
            configurable: false
        },
        _fork: {
            value: fn,
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
Future.is = f => future.isPrototypeOf(f);

/**
 * @signature * -> {@link dataStructures.future}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.future} object delegator instance.
 * Because the future monad 'runs' off of functions, if the value passed to
 * {@link dataStructures.future#of} is a function, it is not wrapped in a function. If it
 * is any other type, it is wrapped in a function that will be invoked on fork.
 * @memberOf dataStructures.Future
 * @static
 * @function of
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.future}.
 * @return {dataStructures.future} - Returns a new object that delegates to the
 * {@link dataStructures.future}.
 */
/*Future.of = function _of(val) {
    if ('function' !== typeof val) return Future((_, resolve) => safeFork(noop, resolve(val)));
    return Future(val);
};*/
//TODO: Figure out which is the correct method of handeling Future.of...
//TODO: Either everything passed (including functions) is wrapped in a function and then a future
//TODO: is created from the wrapped value, or only non-function values are wrapped
//Future.of = val => ifElse(constant(strictEquals(javaScriptTypes.Function, type(val))), Future, futureFunctionize, val);
Future.of = val => Future((_, resolve) => safeFork(identity, resolve(val)));

Future.all = function _all(futures) {
    return Future((reject, resolve) => {
        let results = [],
            count = 0,
            complete = false;
        futures.forEach((future, i) => {
            future.fork(err => {
                if (!complete) {
                    complete = true;
                    reject(err);
                }
            }, res => {
                results[i] = res;
                count += 1;
                if (futures.length === count)
                    safeFork.call(this, reject, resolve)(results);
            });
        });
    });
};

var futureFunctionize = val => Future((_, resolve) => safeFork(identity, resolve(val)));

/**
 * @description Similar to {@link dataStructures.future#of} except it will wrap any value
 * passed as the argument, regardless if it is a function or not.
 * @memberOf dataStructures.future
 * @static
 * @function wrap
 * @param {*} val - The value that should be wrapped in a function and set as the
 * underlying value of the {@link dataStructures.future}
 * @return {dataStructures.future} Returns a new object that delegates to the {@link dataStructures.future}
 */
Future.wrap = val => futureFunctionize(val);

/**
 * @signature
 * @description d
 * @memberOf dataStructures.Future
 * @static
 * @function reject
 * @param {*} val - a
 * @return {future} - b
 */
Future.reject = val => Future((reject, resolve) => reject(val));

/**
 * @signature
 * @description d
 * @memberOf dataStructures.Future
 * @static
 * @function unit
 * @param {function} val - a
 * @return {future} - b
 */
Future.unit = val => Future(val).complete();

/**
 * @signature
 * @description Takes any value (function or otherwise) and a delay time in
 * milliseconds, and returns a new {@link dataStructures.future} that will fork in the amount
 * of time given as the delay.
 * @param {*} val - Any JavaScript value; {@link dataStructures.Future#of} is called under the
 * covers, so it need not be a function.
 * @param {number} delay - The amount of time in milliseconds the forking operation
 * should be delayed
 * @return {dataStructures.future} Returns a new future
 */
Future.delay = function _delay(val, delay) {
    var f = Future.of(fn);
    setTimeout(function _timeout() {
        f.fork();
    }, delay);
    return f;
};

/**
 * @signature () -> {@link dataStructures.future}
 * @description Creates and returns an 'empty' identity monad.
 * @return {dataStructures.future} - Returns a new identity monad.
 */
Future.empty = () => Future(identity);

/**
 * @typedef {Object} future
 * @property {function} value - returns the underlying value of the the monad
 * @property {function} map - maps a single function over the underlying value of the monad
 * @property {function} bimap
 * @property {function} extract
 * @property {function} valueOf - returns the underlying value of the monad; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the future monad and its underlying value
 * @property {function} factory - a reference to the future factory function
 * @property {function} [Symbol.Iterator] - Iterator for the future monad
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace future
 * @description This is the delegate object that specifies the behavior of the identity functor. All
 * operations that may be performed on an future monad 'instance' delegate to this object. Future
 * functor 'instances' are created by the {@link dataStructures.Future} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var future = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an future delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an future delegator,
     * see {@link dataStructures.future#map} and {@link dataStructures.future#bimap}.
     * To retrieve the underlying value of an future delegator, see {@link dataStructures.future#get},
     * {@link dataStructures.future#orElse}, {@link dataStructures.future#getOrElse},
     * and {@link dataStructures.future#valueOf}.
     * @memberOf dataStructures.future
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    get source() {
        return this._source;
    },
    /**
     * @signature
     * @description d
     * @memberOf dataStructures.future
     * @instance
     * @function
     * @return {*} - a
     */
    get extract() {
        return this._source;
        /*
        if (!this.isComplete) {
            this.fork(x => x, x => x);
            return this.value;
        }
        return this.source();
        */
    },
    /**
     * @signature () -> {@link dataStructures.future}
     * @description Takes a function that is applied to the underlying value of the
     * monad, the result of which is used to create a new {@link dataStructures.future}
     * delegator instance.
     * @memberOf dataStructures.future
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.future}.
     * @return {dataStructures.future} Returns a new {@link dataStructures.future}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: function _map(fn) {
        return this.factory((reject, resolve) => this.fork(err => reject(err), res => resolve(fn(res))));
    },
    //TODO: probably need to compose here, not actually map over the value; this is a temporary fill-in until
    //TODO: I have time to finish working on the Future
    chain: function _chain(fn) {
        return this.factory((reject, resolve) => this.fork(err => reject(err), res => fn(res).fork(reject, resolve)));
        /*
        return this.of((reject, resolve) =>
        {
            let cancel,
                outerFork = this._fork(a => reject(a), b => {
                    cancel = fn(b).fork(reject, resolve);
                });
            return cancel ? cancel : (cancel = outerFork, x => cancel());
        });
        */
    },
    mjoin: function _mjoin() {
        return this.chain(x => x);
    },
    apply: function _apply(ma) {
        return Future((reject, result) => {
            let appFn, value,
                rej = once(reject),
                resolveWhenComplete = safeFork(rej, function _result() {
                    if (115 === value) {
                        console.log(null != appFn && null != value);
                        console.log(result);
                        console.log(appFn);
                    }
                    else {
                        console.log(null != appFn && null != value);
                        console.log(result);
                        console.log(value.toString());
                        console.log(appFn);
                        //console.log(ma);
                    }
                    if (null != appFn && null != value) return result(appFn(value));
                });

            console.log(this.source);
            this.fork(rej, function _thisForkApplied(val) {
                if (115 !== val) {
                    console.log(val);
                    console.log(val.data);
                }
                value = val;
                resolveWhenComplete();
            });

            ma.fork(rej, function _otherForkApplied(fn) {
                appFn = fn;
                console.log(fn);
                resolveWhenComplete();
            });
        });

        return this.factory((reject, resolve) => {
            let rej = once(reject),
                val, mapper,
                rejected = false;

            var cur = this.fork(rej, guardResolve(function _gr(x) {
                mapper = x;
            }));

            var other = ma.fork(rej, guardResolve(function _gr(x) {
                val = x;
            }));

            function guardResolve(setter) {
                return function _guardResolve(x) {
                    if (rejected) return;

                    setter(x);
                    if (mapper && val) {
                        return resolve(mapper(val));
                    }
                    return x;
                };
            }

            return [cur, other];
        });

        /*
        return Future((reject, result) => {
            let appFn, value,
            rej = once(reject),
            resolveWhenComplete = safeFork(rej, function _result() {
                if (null != appFn && null != value) return res(applyFn(value));
            });
            this.fork(rej, function _thisForkApplied(fn) {
                appFn = fn;
                resolveWhenComplete();
            });

            ma.fork(rej, function _otherForkApplied(val) {
                value = val;
                resolveWhenComplete();
            });
        });
         */

        /*
        Future.prototype.ap = function(m) {
            var self = this;

          return new Future(function(rej, res) {
            var applyFn, val;
            var doReject = once(rej);

            var resolveIfDone = jail(doReject, function() {
              if (applyFn != null && val != null) {
                return res(applyFn(val));
              }
            });

            self._fork(doReject, function(fn) {
              applyFn = fn;
              resolveIfDone();
            });

            m._fork(doReject, function(v) {
              val = v;
              resolveIfDone();
            });

          });

          function jail(handler, f){
              return function(a){
                try{
                  return f(a);
                } catch(err) {
                  handler(err);
                }
              };
            }

        };
         */
    },
    fold: function _fold(f, g) {
        return this.factory((reject, resolve) =>
            this.fork(err => resolve(f(err)), res => resolve(g(res))));
    },
    traverse: traverse,
    bimap: function _bimap(f, g) {
        return this.factory((reject, resolve) => this._fork(safeFork(reject, err => reject(g(err))), safeFork(reject, res => resolve(f(res)))));
    },
    isEmpty: function _isEmpty() {
        return this._fork === identity;
    },
    fork: function _fork(reject, resolve) {
        if (console.error === reject && console.log === resolve) {

        }
        return this._fork(reject, safeFork.call(this, reject, resolve));
    },
    /**
     * @signature * -> boolean
     * @description Determines if 'this' future monad is equal to another monad. Equality
     * is defined as:
     * 1) The other monad shares the same delegate object as 'this' future monad
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.future
     * @instance
     * @function
     * @param {Object} ma - The other monad to check for equality with 'this' monad.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && ma.source === this.source;
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.future
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
     * underlying value
     * @memberOf dataStructures.future
     * @instance
     * @function
     * @return {string} Returns a string representation of the future
     * and its underlying value.
     */
    toString: function _toString() {
        return `Future(${this.source.name})`;
    },
    get [Symbol.toStringTag]() {
        return 'Future';
    },
    /**
     * @signature * -> {@link dataStructures.future}
     * @description Factory function used to create a new object that delegates to
     * the {@link dataStructures.future} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link dataStructures.future}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf dataStructures.future
     * @instance
     * @function
     * @see dataStructures.Future
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link dataStructures.future}.
     * @return {dataStructures.future} - Returns a new future monad delegator
     */
    factory: Future
};

future.mjoin = join;
future.ap = future.apply;
future.fmap = future.chain;
future.flapMap = future.chain;
future.bind = future.chain;
future.reduce = future.fold;
future.constructor = future.factory;

export { Future, future };