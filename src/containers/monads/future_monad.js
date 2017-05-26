import { _future_f } from '../functors/future_functor';

function Future(f) {
    return Object.create(_future_m, {
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
 * @return: {@see _future_f}
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
 * @return: {@see _future_f}
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

var _future_m = Object.create(_future_f, {
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    chain: {
        value: function _chain(fn) {
            return Future(next => this.value(function _next(a) {
                return next(fn(a));
            }));
        }
    },
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

_future_m.ap = _future_m.apply;
_future_m.bind = _future_m.chain;
_future_m.reduce = _future_m.fold;

export { Future, _future_m };