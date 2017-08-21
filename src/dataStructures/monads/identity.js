import { emptyObject } from '../../helpers';
import { apply, chain, mjoin, equalMaker, pointMaker, stringMaker, valueOf, get, orElse, getOrElse } from '../dataStructureHelpers';

/**
 * @signature - :: * -> {@link monads.identity}
 * @description Factory function used to create a new object that delegates to
 * the {@link monads.identity} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link monads.identity}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Identity
 * @memberOf monads
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link monads.identity}.
 * @return {monads.identity} - Returns a new object that delegates to the
 * {@link monads.identity}.
 */
function Identity(val) {
    return Object.create(identity, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @signature * -> {@link monads.identity}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link monads.identity} object delegator instance.
 * Because the identity functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link Identity}
 * @memberOf monads.Identity
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link monads.identity}.
 * @return {monads.identity} - Returns a new object that delegates to the
 * {@link monads.identity}.
 */
Identity.of = x => Identity(x);

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link monads.identity} delegate or not. Available on the
 * identity's factory function as Identity.is.
 * @memberOf monads.Identity
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link monads.identity} delegate.
 */
Identity.is = f => identity.isPrototypeOf(f);

/**
 * @sig
 * @description d
 * @return {identity} - a
 */
Identity.empty = function _empty() {
    return this.of(Object.create(emptyObject));
};

/**
 * @typedef {Object} identity
 * @property {function} value - returns the underlying value of the the functor
 * @property {function} map - maps a single function over the underlying value of the functor
 * @property {function} bimap
 * @property {function} get - returns the underlying value of the functor
 * @property {function} orElse - returns the underlying value of the functor
 * @property {function} getOrElse - returns the underlying value of the functor
 * @property {function} of - creates a new identity delegate with the value provided
 * @property {function} valueOf - returns the underlying value of the functor; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity functor and its underlying value
 * @property {function} factory - a reference to the identity factory function
 * @property {function} [Symbol.Iterator] - Iterator for the identity
 * @kind {Object}
 * @memberOf monads
 * @namespace identity
 * @description This is the delegate object that specifies the behavior of the identity functor. All
 * operations that may be performed on an identity functor 'instance' delegate to this object. Identity
 * functor 'instances' are created by the {@link monads.Identity} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var identity = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an identity delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an identity delegator,
     * see {@link monads.identity#map} and {@link monads.identity#bimap}.
     * To retrieve the underlying value of an identity delegator, see {@link monads.identity#get},
     * {@link monads.identity#orElse}, {@link monads.identity#getOrElse},
     * and {@link monads.identity#valueOf}.
     * @memberOf monads.identity
     * @instance
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    /**
     * @signature () -> {@link monads.identity}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link monads.identity}
     * delegator instance.
     * @memberOf monads.identity
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link monads.identity}.
     * @return {monads.identity} Returns a new {@link monads.identity}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    fold: function _fold(fn) {
        return fn(this.value);
    },
    sequence: function _sequence(p) {
        return this.traverse(x => x, p);
    },
    traverse: function _traverse(a, f) {
        return f(this.value).map(this.of);
    },
    empty: function _empty() {
        return this.of(Object.create(emptyObject));
    },
    isEmpty: function _getIsEmpty() {
        return emptyObject.isPrototypeOf(this.value);
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'.
     * @memberOf monads.identity
     * @instance
     * @function
     * @return {*} - Returns the underlying value of the current functor 'instance'.
     */
    get: get,
    /**
     * @signature () -> *
     * @description Takes an optional function parameter as a default to be invoked and
     * returned in cases where the current functor 'instance\'s' underlying value is not
     * 'mappable'. Because the identity does not support disjunctions, the
     * parameter is entirely optional and will always be ignored. Whatever the actual
     * underlying value is, it will always be returned.
     * @memberOf monads.identity
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
     * Because the identity does not support disjunctions, the parameter is entirely
     * optional and will always be ignored. Whatever the actual underlying value is, it will
     * always be returned.
     * @memberOf monads.identity
     * @instance
     * @function
     * @param {*} [x] - a
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    getOrElse: getOrElse,
    /**
     * @signature * -> {@link monads.identity}
     * @description Factory function used to create a new object that delegates to
     * the {@link monads.identity} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link monads.identity}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf monads.identity
     * @instance
     * @function
     * @param {*} item - The value that should be set as the underlying
     * value of the {@link monads.identity}.
     * @return {monads.identity} Returns a new {@link monads.identity} delegator object
     * via the {@link monads.Identity#of} function.
     */
    of: pointMaker(Identity),
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf monads.identity
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the functor and its
     * underlying value
     * @memberOf monads.identity
     * @instance
     * @function
     * @return {string} Returns a string representation of the identity
     * and its underlying value.
     */
    toString: stringMaker('Identity'),
    /**
     * @signature * -> {@link monads.identity}
     * @description Factory function used to create a new object that delegates to
     * the {@link monads.identity} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link monads.identity}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf monads.identity
     * @instance
     * @function
     * @see monads.Identity
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link monads.identity}.
     * @return {monads.identity} - Returns a new identity functor delegator
     */
    factory: Identity
};

/**
 * @signature * -> boolean
 * @description Determines if 'this' identity functor is equal to another functor. Equality
 * is defined as:
 * 1) The other functor shares the same delegate object as 'this' identity functor
 * 2) Both underlying values are strictly equal to each other
 * @memberOf monads.identity
 * @instance
 * @function
 * @param {Object} ma - The other functor to check for equality with 'this' functor.
 * @return {boolean} - Returns a boolean indicating equality
 */
identity.equals = equalMaker(identity);

/**
 * @signature (* -> *) -> (* -> *) -> monads.identity<T>
 * @description Since the constant functor does not represent a disjunction, the Identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out monads/monads does not break an application that is
 * relying on its existence.
 * @memberOf monads.identity
 * @instance
 * @function
 * @param {function} f - A function that will be used to map over the underlying data of the
 * {@link monads.identity} delegator.
 * @param {function} [g] - An optional function that is simply ignored on the {@link monads.identity}
 * since there is no disjunction present.
 * @return {monads.identity} - Returns a new {@link monads.identity} delegator after applying
 * the mapping function to the underlying data.
 */
identity.bimap = identity.map;

identity.chain = chain;
identity.mjoin = mjoin;
identity.apply = apply;

identity.ap = identity.apply;
identity.fmap = identity.chain;
identity.flapMap = identity.chain;
identity.bind = identity.chain;
identity.reduce = identity.fold;


//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "you're too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
identity.constructor = identity.factory;

export { Identity, identity };