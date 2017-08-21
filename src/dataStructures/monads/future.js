import { noop, once, type, strictEquals } from '../../functionalHelpers';
import { apply, mjoin, pointMaker, valueOf } from '../dataStructureHelpers';
import { javaScriptTypes } from '../../helpers';

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
        }
        catch(ex) {
            reject(ex);
        }
    };
}

/**
 * @sig
 * @description d
 * @param {function} fn - a
 * @return {future} - b
 */
function Future(fn) {
    return Object.create(future, {
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
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Future.is = f => future.isPrototypeOf(f);

/**
 * @sig
 * @description d
 * @param {function|*} val - a
 * @return {future} - b
 */
Future.of = val => strictEquals(javaScriptTypes.Function, type(val)) ?
    Future(val) : Future((_, resolve) => safeFork(noop, resolve(val)));

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {future} - b
 */
Future.reject = val => Future((reject, resolve) => reject(val));

/**
 * @sig
 * @description d
 * @param {function} val - a
 * @return {future} - b
 */
Future.unit = val => Future(val).complete();

/**
 * @sig
 * @description d
 * @return {future} - a
 */
Future.empty = () => Future(noop);

var future = {
    /**
     * @sig
     * @description d
     * @return {*} - a
     */
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.of((reject, resolve) =>
            this.fork(a => reject(a), b => resolve(fn(b))));
    },
    //TODO: probably need to compose here, not actually map over the value; this is a temporary fill-in until
    //TODO: I have time to finish working on the Future
    chain: function _chain(fn) {
        return this.of((reject, resolve) =>
        {
            let cancel,
                outerFork = this._fork(a => reject(a), b => {
                    cancel = fn(b).fork(reject, resolve);
                });
            return cancel ? cancel : (cancel = outerFork, x => cancel());
        });
    },
    fold: function _fold(f, g) {
        return this.of((reject, resolve) =>
            this.fork(a => resolve(f(a)), b => resolve(g(b))));
    },
    traverse: function _traverse(fa, fn) {
        return this.fold(function _reductioAdAbsurdum(xs, x) {
            fn(x).map(function _map(x) {
                return function _map_(y) {
                    return y.concat([x]);
                };
            }).ap(xs);
            return fa(this.empty);
        });
    },
    fork: function _fork(reject, resolve) {
        this._fork(reject, resolve);
    },
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && ma.value === this.value;
    },
    of: pointMaker(Future),
    valueOf: valueOf,
    toString: function _toString() {
        console.log(this.value, this.value.name, this.value === once);
        return `Future(${this.value.name})`;
    },
    factory: Future
};

future.mjoin = mjoin;
future.apply = apply;
future.ap = future.apply;
future.fmap = future.chain;
future.flapMap = future.chain;
future.bind = future.chain;
future.reduce = future.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
future.constructor = future.factory;

export { Future, future };