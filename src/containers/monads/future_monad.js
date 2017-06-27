import { future_functor } from '../functors/future_functor';

function safeFork(reject, resolve) {
    return function _safeFork(val) {
        try {
            return resolve(val);
        }
        catch(ex) {
            reject(ex);
        }
    }
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
 * @description:
 * @param: {function|*} val
 * @return: {@see future_functor}
 */
Future.of = function _of(val) {
    return 'function' === typeof val ? Future(val) :
        Future((reject, resolve) => safeFork(reject, resolve(val)));
};

/**
 * @description:
 * @param: {*} val
 * @return: {@see future_functor}
 */
Future.reject = function _reject(val) {
    return Future((reject, resolve) => reject(val));
};

Future.unit = function _unit(val) {
    return Future(val).complete();
};

var future_monad = Object.create(future_functor, {
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    chain: {
        //TODO: probably need to compose here, not actually map over the value; this is a temporary fill-in until
        //TODO: I have time to finish working on the Future
        value: function _chain(fn) {
            return this.of((reject, resolve) =>
            {
                let cancel,
                    outerFork = this._fork(a => reject(a), b => {
                        cancel = fn(b).fork(reject, resolve);
                    });
                return cancel ? cancel : (cancel = outerFork, x => cancel());
            });
        }
    },
    fold: {
        value: function _fold(f, g) {
            return this.of((reject, resolve) =>
                this.fork(a => resolve(f(a)), b => resolve(g(b))));
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


export { Future, future_monad };