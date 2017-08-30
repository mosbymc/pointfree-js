import { apply, mjoin, pointMaker, equalMaker, stringMaker, valueOf, get, orElse, getOrElse } from '../data_structure_util';

/**
 * @signature - :: * -> {@link monads.constant}
 * @description Factory function used to create a new object that delegates to
 * the {@link monads.constant} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link monads.constant}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Constant
 * @memberOf monads
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link monads.constant}.
 * @return {monads.constant} - Returns a new object that delegates to the
 * {@link monads.constant}.
 */
function Constant(val) {
    return Object.create(constant, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @signature * -> {@link monads.constant}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link monads.constant} object delegator instance.
 * Because the constant functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link monads.Constant}
 * @memberOf monads.Constant
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link monads.constant}.
 * @return {monads.constant} - Returns a new object that delegates to the
 * {@link monads.constant}.
 */
Constant.of = x => Constant(x);

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link monads.constant} delegate or not. Available on the
 * identity_functor's factory function as Identity.is.
 * @memberOf monads.Constant
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link monads.constant} delegate.
 */
Constant.is = f => constant.isPrototypeOf(f);

/**
 * @typedef {Object} constant
 * @property {function} value - returns the underlying value of the the functor
 * @property {function} map - maps a single function over the underlying value of the functor
 * @property {function} bimap
 * @property {function} get - returns the underlying value of the functor
 * @property {function} orElse - returns the underlying value of the functor
 * @property {function} getOrElse - returns the underlying value of the functor
 * @property {function} of - creates a new constant delegate with the value provided
 * @property {function} valueOf - returns the underlying value of the functor; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity functor and its underlying value
 * @property {function} factory - a reference to the constant factory function
 * @property {function} [Symbol.Iterator] - Iterator for the constant
 * @kind {Object}
 * @memberOf monads
 * @namespace constant
 * @description This is the delegate object that specifies the behavior of the identity functor. All
 * operations that may be performed on an identity functor 'instance' delegate to this object. Constant
 * functor 'instances' are created by the {@link monads.Constant} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var constant = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an constant delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an identity_functor delegator,
     * see {@link monads.constant#map} and {@link monads.constant#bimap}.
     * To retrieve the underlying value of an identity_functor delegator, see {@link monads.constant#get},
     * {@link monads.constant#orElse}, {@link monads.constant#getOrElse},
     * and {@link monads.constant#valueOf}.
     * @memberOf monads.constant
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    /**
     * @signature () -> {@link monads.constant}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link monads.constant}
     * delegator instance.
     * @memberOf monads.constant
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link monads.constant}.
     * @return {monads.constant} Returns a new {@link monads.constant}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: function _map(fn) {
        return this.of(this.value);
    },
    chain: function _chain() {
        return this;
    },
    fold: function _fold(f) {
        return f(this.value);
    },
    sequence: function _sequence(p) {
        return this.of(this.value);
    },
    traverse: function _traverse(a, f) {
        return this.of(this.value);
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'.
     * @memberOf monads.constant
     * @instance
     * @function
     * @return {*} - Returns the underlying value of the current functor 'instance'.
     */
    get: get,
    /**
     * @signature () -> *
     * @description Takes an optional function parameter as a default to be invoked and
     * returned in cases where the current functor 'instance\'s' underlying value is not
     * 'mappable'. Because the identity_functor does not support disjunctions, the
     * parameter is entirely optional and will always be ignored. Whatever the actual
     * underlying value is, it will always be returned.
     * @memberOf monads.constant
     * @instance
     * @function
     * @param {function} [f] - An optional function argument which is invoked and the result
     * returned in cases where the underlying value is not 'mappable'.
     * @return {*} - b
     */
    orElse: orElse,
    /**
     * @signature * -> *
     * @description Takes an optional parameter of any value as a default return value in
     * cases where the current functor 'instance\'s' underlying value is not 'mappable'.
     * Because the identity_functor does not support disjunctions, the parameter is entirely
     * optional and will always be ignored. Whatever the actual underlying value is, it will
     * always be returned.
     * @memberOf monads.constant
     * @instance
     * @function
     * @param {*} [x] - a
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    getOrElse: getOrElse,
    /**
     * @signature * -> {@link monads.constant}
     * @description Factory function used to create a new object that delegates to
     * the {@link monads.constant} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link monads.constant}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf monads.constant
     * @instance
     * @function
     * @param {*} item - The value that should be set as the underlying
     * value of the {@link monads.constant}.
     * @return {monads.constant} Returns a new {@link monads.constant} delegator object
     * via the {@link monads.Constant#of} function.
     */
    of: pointMaker(Constant),
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf monads.constant
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the functor and its
     * underlying value
     * @memberOf monads.constant
     * @instance
     * @function
     * @return {string} Returns a string representation of the constant
     * and its underlying value.
     */
    toString: stringMaker('Constant'),
    /**
     * @signature * -> {@link monads.constant}
     * @description Factory function used to create a new object that delegates to
     * the {@link monads.constant} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link monads.constant}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf monads.constant
     * @instance
     * @function
     * @see monads.Constant
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link monads.constant}.
     * @return {monads.constant} - Returns a new identity functor delegator
     */
    factory: Constant
};

/**
 * @signature * -> boolean
 * @description Determines if 'this' identity functor is equal to another functor. Equality
 * is defined as:
 * 1) The other functor shares the same delegate object as 'this' identity functor
 * 2) Both underlying values are strictly equal to each other
 * @memberOf monads.constant
 * @instance
 * @function
 * @param {Object} ma - The other functor to check for equality with 'this' functor.
 * @return {boolean} - Returns a boolean indicating equality
 */
constant.equals = equalMaker(constant);

/**
 * @signature (* -> *) -> (* -> *) -> monads.constant<T>
 * @description Since the constant functor does not represent a disjunction, the Identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out monads/monads does not break an application that is
 * relying on its existence.
 * @memberOf monads.constant
 * @instance
 * @function
 * @param {function} f - A function that will be used to map over the underlying data of the
 * {@link monads.constant} delegator.
 * @param {function} [g] - An optional function that is simply ignored on the {@link monads.constant}
 * since there is no disjunction present.
 * @return {monads.constant} - Returns a new {@link monads.constant} delegator after applying
 * the mapping function to the underlying data.
 */
constant.bimap = constant.map;

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
constant.constructor = constant.factory;

constant.mjoin = mjoin;
constant.apply = apply;

constant.ap =constant.apply;
constant.fmap = constant.chain;
constant.flapMap = constant.chain;
constant.bind = constant.chain;
constant.reduce = constant.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
constant.constructor = constant.factory;


export { Constant, constant };