import { equalMaker, pointMaker, stringMaker, valueOf, get, orElse, getOrElse } from '../dataStructureHelpers';

/** @module identity_functor */

/**
 * @signature - :: * -> {@link identity_functor}
 * @description Factory function used to create a new object that delegates to
 * the {@link identity_functor} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link identity_functor}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Identity
 * @property {function} of
 * @property {function} is
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link identity_functor}.
 * @return {identity_functor} - Returns a new object that delegates to the
 * {@link identity_functor}.
 */
function Identity(val) {
    return Object.create(identity_functor, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @signature * -> {@link identity_functor}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link identity_functor} object delegator instance.
 * Because the identity functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link Identity}
 * @memberOf identity_functor~Identity
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link identity_functor}.
 * @return {identity_functor} - Returns a new object that delegates to the
 * {@link identity_functor}.
 */
Identity.of = x => Identity(x);

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link identity_functor} delegate or not. Available on the
 * identity_functor's factory function as Identity.is.
 * @memberOf Identity
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link identity_functor} delegate.
 */
Identity.is = f => identity_functor.isPrototypeOf(f);

/**
 * @typedef {Object} identity_functor
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
 * @namespace identity_functor
 * @description This is the delegate object that specifies the behavior of the identity functor. All
 * operations that may be performed on an identity functor 'instance' delegate to this object. Identity
 * functor 'instances' are created by the {@link Identity} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var identity_functor = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an identity_functor delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an identity_functor delegator,
     * see {@link identity_functor#map} and {@link identity_functor#bimap}.
     * To retrieve the underlying value of an identity_functor delegator, see {@link identity_functor#get},
     * {@link identity_functor#orElse}, {@link identity_functor#getOrElse},
     * and {@link identity_functor#valueOf}.
     * @instance
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    /**
     * @signature () -> {@link identity_functor}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link identity_functor}
     * delegator instance.
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link identity_functor}.
     * @return {identity_functor} Returns a new {@link identity_functor}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'.
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
     * @instance
     * @function
     * @param {*} [x] - a
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    getOrElse: getOrElse,
    /**
     * @signature * -> {@link identity_functor}
     * @description Factory function used to create a new object that delegates to
     * the {@link identity_functor} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link identity_functor}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @instance
     * @function
     * @param {*} item - The value that should be set as the underlying
     * value of the {@link identity_functor}.
     * @return {identity_functor} Returns a new {@link identity_functor} delegator object
     * via the {@link Identity#of} function.
     */
    of: pointMaker(Identity),
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the functor and its
     * underlying value
     * @instance
     * @function
     * @return {string} Returns a string representation of the identity_functor
     * and its underlying value.
     */
    toString: stringMaker('Identity'),
    /**
     * @signature * -> {@link identity_functor}
     * @description Factory function used to create a new object that delegates to
     * the {@link identity_functor} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link identity_functor}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @instance
     * @function
     * @see Identity
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link identity_functor}.
     * @return {identity_functor} - Returns a new identity functor delegator
     */
    factory: Identity
};

/**
 * @signature * -> boolean
 * @description Determines if 'this' identity functor is equal to another functor. Equality
 * is defined as:
 * 1) The other functor shares the same delegate object as 'this' identity functor
 * 2) Both underlying values are strictly equal to each other
 * @instance
 * @function
 * @param {Object} ma - The other functor to check for equality with 'this' functor.
 * @return {boolean} - Returns a boolean indicating equality
 */
identity_functor.equals = equalMaker(identity_functor);

/**
 * @sig
 * @description Since the constant functor does not represent a disjunction, the Identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @instance
 * @function
 * @type {function}
 * @param {function} f - A function that will be used to map over the underlying data of the
 * {@link identity_functor} delegator.
 * @param {function} [g] - An optional function that is simply ignored on the {@link identity_functor}
 * since there is no disjunction present.
 * @return {identity_functor} - Returns a new {@link identity_functor} delegator after applying
 * the mapping function to the underlying data.
 */
identity_functor.bimap = identity_functor.map;


//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "you're too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
identity_functor.constructor = identity_functor.factory;


export { Identity, identity_functor };