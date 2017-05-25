import { noop, once } from '../../functionalHelpers';

/**
 * @description:
 * @param: {function} fn
 * @return: {@see _future_f}
 */
function Future(fn) {
    return Object.create(_future_f, {
        _value: {
            value: fn,
            writable: false,
            configurable: false
        }
    });
}

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

/**
 * @description:
 * @param: {function} val
 * @return: {*}
 */
Future.unit = function _unit(val) {
    var f = Future(val);
    return f.complete();
};

var _future_f = {
    /**
     * @description:
     * @return: {@see _future_f}
     */
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        //TODO: replace 'reject' function with noop?
        return this.of((reject, resolve) => {
            return this.value(function _rej(err) {
                reject(err);
            },
            function _res(val) {
                resolve(val);
            });
        });
    },
    //TODO: probably need to compose here, not actually map over the value; this is a temporary fill-in until
    //TODO: I have time to finish working on the Future
    flatMap: function _flatMap(fn) {
        return _future_f.isPrototypeOf(this.value) ? this.value.map(fn) :
            this.of(fn(this.value));
    },
    fork: function _fork(reject, resolve) {
        this.value(reject, resolve);
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
    toString: function _toString() {
        return `Future(${this.value})`;
    },
    constructor: Future
};

export { Future, _future_f };