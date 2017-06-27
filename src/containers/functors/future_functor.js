import { noop, once } from '../../functionalHelpers';

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

/**
 * @description:
 * @param: {function} val
 * @return: {*}
 */
Future.unit = function _unit(val) {
    return Future(val).complete();
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
        return this.of((reject, resolve) =>
            this.fork(a => reject(a), b => resolve(fn(b))));
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