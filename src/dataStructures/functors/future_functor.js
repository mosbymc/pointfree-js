import { noop, once, type, strictEquals } from '../../functionalHelpers';
import { javaScriptTypes } from '../../helpers';
import { pointMaker, valueOf } from '../dataStructureHelpers';

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
 * @return {future_functor} - b
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
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Future.is = f => future_functor.isPrototypeOf(f);

/**
 * @sig
 * @description d
 * @param {function|*} val - a
 * @return {future_functor} - b
 */
Future.of = val => strictEquals(javaScriptTypes.Function, type(val)) ?
    Future(val) : Future((_, resolve) => safeFork(noop, resolve(val)));

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {future_functor} - b
 */
Future.reject = val => Future((reject, resolve) => reject(val));

/**
 * @sig
 * @description d
 * @param {function} val - a
 * @return {future_functor} - b
 */
Future.unit = val => Future(val).complete();

/**
 * @sig
 * @description d
 * @return {future_functor} - a
 */
Future.empty = () => Future(noop);

var future_functor = {
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