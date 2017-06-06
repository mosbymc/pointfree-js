import { future_functor } from '../functors/future_functor';

function Future(f) {
    return Object.create(future_monad, {
        _value: {
            value: f,
            writable: false,
            configurable: false
        }
    })
}

Future.of = function _of(a) {
    return 'function' === typeof a ? Future(a) :
        Future(function _wrapper() {
            return a;
        });
};

/**
 * @description:
 * @param: {function|*} val
 * @return: {@see future_functor}
 */
Future.of = function _of(val) {
    return 'function' === typeof val ? Future(val) :
        Future(function _runner(rej, res) {
            return res(val)
        });
};

/**
 * @description:
 * @param: {*} val
 * @return: {@see future_functor}
 */
Future.reject = function _reject(val) {
    return Future(function _future(reject) {
        reject(val);
    });
};

Future.unit = function _unit(val) {
    var f = Future(val);
    return f.complete();
};

var future_monad = Object.create(future_functor, {
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    chain: {
        value: function _chain(fn) {
            this.of((function _chainFn(reject, resolve) {
                return this._fork(function rej(a) {
                    return reject(a);
                },
                function res(b) {
                    return fn(b)._fork(reject, resolve);
                })
            }).bind(this));
        }
    },
    fold: {
        value: function _fold(f, g) {
            //return fn(this.value, x);
            return this.of(
                (function(reject, resolve) {
                    return this._fork(function _f1(a) {
                        return resolve(f(a));
                    },
                    function _f2(b) {
                        return resolve(g(b));
                    });
                }).bind(this)
            );
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
    apply: {
        value: function _apply(ma) {
            return this.map(ma.value);
        }
    },
    of: {
        value: function _of(val) {
            return Future.of(val);
        }
    },
    constructor: {
        value: Future
    }
});

future_monad.ap = future_monad.apply;
future_monad.bind = future_monad.chain;
future_monad.reduce = future_monad.fold;

export { Future, future_monad };