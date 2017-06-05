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
    //TODO: probably need to compose here, not actually map over the value; this is a temporary fill-in until
    //TODO: I have time to finish working on the Future
    flatMap: function _flatMap(fn) {
        return future_functor.isPrototypeOf(this.value) ? this.value.map(fn) :
            this.of(fn(this.value));
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
    constructor: Future
};

export { Future, future_functor };