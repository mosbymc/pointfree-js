import { equalMaker, pointMaker, stringMaker, valueOf, get, orElse, getOrElse } from '../containerHelpers';

/**
 * @sig
 * @description d
 * @param {*} [item] - a
 * @return {constant_functor} - b
 */
function Constant(item) {
    return Object.create(constant_functor, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {*} [x] - a
 * @return {constant_functor} - b
 */
Constant.of = x => Constant(x);

/**
 * @sig
 * @description d
 * @param {function} [f] - a
 * @return {boolean} - b
 */
Constant.is = f => constant_functor.isPrototypeOf(f);

/**
 * @description d
 * @typedef {Object}
 * @property {function} value
 * @property {function} map
 * @property {function} get
 * @property {function} orElse
 * @property {function} getOrElse
 * @property {function} valueOf
 * @property {function} of
 * @property {function} toString
 * @property {function} factory
 */
var constant_functor = {
    get value() {
        return this._value;
    },
    /**
     * @sig
     * @description d
     * @return {constant_functor} - a
     */
    map: function _map() {
        return this.of(this.value);
    },
    /**
     * @sig
     * @description d
     * @return {*} - a
     */
    get: get,
    /**
     * @sig
     * @description d
     * @param {function} f - a
     * @return {*} - b
     */
    orElse: orElse,
    /**
     * @sig
     * @description d
     * @param {*} x - a
     * @return {*} - b
     */
    getOrElse: getOrElse,
    /**
     * @sig
     * @description d
     * @return {*} - a
     */
    valueOf: valueOf,
    /**
     * @sig
     * @description d
     * @param {*} item - a
     * @return {constant_functor} - b
     */
    of: pointMaker(Constant),
    /**
     * @sig
     * @description d
     * @return {string} - a
     */
    toString: stringMaker('Constant'),
    factory: Constant
};

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
constant_functor.equals = equalMaker(constant_functor);

/**
 * @sig
 * @description Since the constant functor does not represent a disjunction, the Constant's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {constant_functor} - c
 */
constant_functor.bimap = constant_functor.map;

/**
 * @description: sigh.... awesome spec ya got there fantasy-land. Yup, good thing you guys understand
 * JS and aren't treating it like a static, strongly-typed, class-based language with inheritance...
 * cause, ya know... that would be ridiculous if we were going around pretending there is such a thing
 * as constructors in the traditional OOP sense of the word in JS, or that JS has some form of inheritance.
 *
 * What's that? Put a constructor property on a functor that references the function used to create an
 * object that delegates to said functor? Okay.... but why would we call it a 'constructor'? Oh, that's
 * right, you wrote a spec for a language you don't understand rather than trying to understand it and
 * then writing the spec. Apparently your preferred approach is to bury your head in the sand and pretend
 * that JS has classes like the rest of the idiots.
 *
 * Thanks for your contribution to the continual misunderstanding, misapplication, reproach, and frustration
 * of JS developers; thanks for making the world of JavaScript a spec which has become the standard and as
 * such enforces poor practices, poor design, and mental hurdles.
 */
constant_functor.constructor = constant_functor.factory;

export { Constant, constant_functor };