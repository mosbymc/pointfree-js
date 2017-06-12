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
    flapMap: {
        //TODO: probably need to compose here, not actually mapWith over the value; this is a temporary fill-in until
        //TODO: I have time to finish working on the Future
        value: function _flatMap(fn) {
            return this.of((function _chainFn(reject, resolve) {
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
    factory: {
        value: Future
    }
});

future_monad.ap = future_monad.apply;
future_monad.fmap = future_monad.flapMap;
future_monad.chain = future_monad.flapMap;
future_monad.bind = future_monad.flapMap;
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


export { Future, future_monad };