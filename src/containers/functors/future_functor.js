import { noop, once } from '../../functionalHelpers';

/**
 * @description:
 * @param: {function} fn
 * @return: {@see future_functor}
 */
function Future(fn) {
    return Object.create(future_functor, {
        _value: {
            value: once(fn),
            writable: false,
            configurable: false
        },
        _fork: {
            value: once(fn),
            writable: false
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

/**
 * @description:
 * @param: {function} val
 * @return: {*}
 */
Future.unit = function _unit(val) {
    var f = Future(val);
    return f.complete();
};

/**
 * @description:
 * @return: {@see future_functor}
 */
Future.empty = function _empty() {
    return Future(noop);
};

var future_functor = {
    /**
     * @description:
     * @return: {@see future_functor}
     */
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        //TODO: replace 'reject' function with noop?
        return this.of((function _mapFunc(reject, resolve) {
            return this._fork(function _rej(err) {
                    reject(err);
                },
                function _res(val) {
                    resolve(fn(val));
                });
        }).bind(this));
    },
    fork: function _fork(reject, resolve) {
        this._fork(reject, resolve);
    },
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma);
    },
    of: function _of(val) {
        return Future.of(val);
    },
    /**
     * @description:
     * @return: {*}
     */
    valueOf: function _valueOf() {
        return this.value;
    },
    /**
     * @description:
     * @return: {string}
     */
    toString: function _toString() {
        return `Future(${this.value})`;
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

export { Future, future_functor };