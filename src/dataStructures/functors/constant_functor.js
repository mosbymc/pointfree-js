import { equalMaker, pointMaker, stringMaker, valueOf, get, orElse, getOrElse } from '../dataStructureHelpers';

/** @module constant_functor */

/**
 * @signature - :: * -> {@link constant_functor}
 * @description Factory function used to create a new object that delegates to
 * the {@link constant_functor} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link constant_functor}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Constant
 * @memberOf constant_functor
 * @property {function} of
 * @property {function} is
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link constant_functor}.
 * @return {constant_functor} - Returns a new object that delegates to the
 * {@link constant_functor}.
 */
function Constant(val) {
    return Object.create(constant_functor, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @signature * -> {@link constant_functor}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link constant_functor} object delegator instance.
 * Because the constant functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link constant_functor.Constant}
 * @memberOf constant_functor.Constant
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link constant_functor}.
 * @return {constant_functor} - Returns a new object that delegates to the
 * {@link constant_functor}.
 */
Constant.of = x => Constant(x);

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link constant_functor} delegate or not. Available on the
 * identity_functor's factory function as Identity.is.
 * @memberOf constant_functor.Constant
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link constant_functor} delegate.
 */
Constant.is = f => constant_functor.isPrototypeOf(f);

/**
 * @typedef {Object} constant_functor
 * @property {function} value - returns the underlying value of the the functor
 * @property {function} map - maps a single function over the underlying value of the functor
 * @property {function} get - returns the underlying value of the functor
 * @property {function} orElse - returns the underlying value of the functor
 * @property {function} getOrElse - returns the underlying value of the functor
 * @property {function} of - creates a new identity_functor delegate with the value provided
 * @property {function} valueOf - returns the underlying value of the functor; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity functor and its underlying value
 * @property {function} factory - a reference to the identity_functor factory function
 * @kind {Object}
 * @namespace constant_functor
 * @description This is the delegate object that specifies the behavior of the identity functor. All
 * operations that may be performed on an identity functor 'instance' delegate to this object. Constant
 * functor 'instances' are created by the {@link constant_functor.Constant} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
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