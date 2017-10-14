import { monad_apply, chain, contramap, mjoin, equals, stringMaker, valueOf, extendMaker } from './data_structure_util';

/**
 * @signature - :: * -> {@link dataStructures.identity}
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.identity} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.identity}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Identity
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.identity}.
 * @return {dataStructures.identity} - Returns a new object that delegates to the
 * {@link dataStructures.identity}.
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
 * @signature * -> {@link dataStructures.identity}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.identity} object delegator instance.
 * Because the identity monad does not require any specific context for
 * its value, this can be viewed as an alias for {@link Identity}
 * @memberOf dataStructures.Identity
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link dataStructures.identity}.
 * @return {dataStructures.identity} - Returns a new object that delegates to the
 * {@link dataStructures.identity}.
 */
Identity.of = x => Identity(x);

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.identity} delegate or not. Available on the
 * identity's factory function as Identity.is.
 * @memberOf dataStructures.Identity
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.identity} delegate.
 */
Identity.is = f => identity.isPrototypeOf(f);

/**
 * @signature () -> {@link dataStructures.identity}
 * @description Creates and returns an 'empty' identity monad.
 * @return {dataStructures.identity} - Returns a new identity monad.
 */
Identity.empty = () => Identity();

/**
 * @typedef {Object} identity
 * @property {function} value - returns the underlying value of the the monad
 * @property {function} extract - returns the underlying value of the identity
 * @property {function} map - maps a single function over the underlying value of the monad
 * @property {function} chain - returns a new identity monad
 * @property {function} mjoin - returns a new identity monad
 * @property {function} apply - returns a new instance of whatever monad type's underlying value this
 * identity's underlying function value should be mapped over.
 * @property {function} bimap - returns a new identity monad
 * @property {function} fold - Applies a function to the identity's underlying value and returns the result
 * @property {function} sequence - returns a new identity monad
 * @property {function} traverse - returns a new identity monad
 * @property {function} isEmpty - Returns a boolean indicating if the identity monad is 'empty'
 * @property {function} valueOf - returns the underlying value of the monad; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity monad and its underlying value
 * @property {function} factory - a reference to the identity factory function
 * @property {function} [Symbol.Iterator] - Iterator for the identity
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace identity
 * @description This is the delegate object that specifies the behavior of the identity monad. All
 * operations that may be performed on an identity monad 'instance' delegate to this object. Identity
 * monad 'instances' are created by the {@link dataStructures.Identity} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity monad delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var identity = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an identity delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an identity delegator,
     * see {@link dataStructures.identity#map} and {@link dataStructures.identity#bimap}.
     * To retrieve the underlying value of an identity delegator, see {@link dataStructures.identity#extract}
     * and {@link dataStructures.identity#valueOf}.
     * @memberOf dataStructures.identity
     * @instance
     * @private
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of an identity delegator. This is a getter function
     * and thus works differently than the fantasy-land specification; rather than invoking identity#extract
     * as a function, you merely need to reference as a non-function property. This makes infinitely more
     * sense to me, especially if the underlying is a function... who wants to: identity.extract()(x, y, z)?
     * @memberOf dataStructures.identity
     * @instance
     * @private
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get extract() {
        return this.value;
    },
    /**
     * @signature () -> {@link dataStructures.identity}
     * @description Takes a function that is applied to the underlying value of the
     * monad, the result of which is used to create a new {@link dataStructures.identity}
     * delegator instance.
     * @memberOf dataStructures.identity
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.identity}.
     * @return {dataStructures.identity} Returns a new {@link dataStructures.identity}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: function _map(fn) {
        return Identity.of(fn(this.value));
    },
    /**
     * @signature () -> {@link dataStructures.identity}
     * @description Accepts a mapping function as an argument, applies the function to the
     * underlying value. If the mapping function returns an identity monad, chain will 'flatten'
     * the nested identities by one level. If the mapping function does not return an identity
     * monad, chain will just return an identity monad that 'wraps' whatever the return value
     * of the mapping function is. However, if the mapping function does not return a monad of
     * the same type, then chain is probably not the functionality you should use. See
     * {@link dataStructures.identity#map} instead.
     * @memberOf dataStructures.identity
     * @instance
     * @function chain
     * @param {function} fn - A mapping function that returns a monad of the same type
     * @return {Object} Returns a new identity monad that 'wraps' the return value of the
     * mapping function after flattening it by one level.
     */
    chain: chain,
    /**
     * @signature () -> {@link dataStructures.identity}
     * @description Returns a new identity monad. If the current identity monad is nested, mjoin
     * will flatten it by one level. Very similar to {@link dataStructures.identity#chain} except no
     * mapping function is accepted or run.
     * @memberOf dataStructures.identity
     * @instance
     * @function mjoin
     * @return {Object} Returns a new identity monad after flattening the nested monads by one level.
     */
    mjoin: mjoin,
    /**
     * @signature Object -> Object
     * @description Accepts any monad object with a mapping function and invokes that object's mapping
     * function on the identity's underlying value. In order for this function to execute properly and
     * not throw, the identity's underlying value must be a function that can be used as a mapping function
     * on the monad object supplied as the argument.
     * @memberOf dataStructures.identity
     * @instance
     * @function apply
     * @param {Object} ma - Any object with a map function - i.e. a monad.
     * @return {Object} Returns an instance of the monad object provide as an argument.
     */
    apply: monad_apply,
    /**
     * @signature () -> *
     * @description Accepts a function that is used to map over the identity's underlying value
     * and returns the returns value of the function without 're-wrapping' it in a new identity
     * monad instance.
     * @memberOf dataStructures.identity
     * @instance
     * @function fold
     * @param {function} fn - Any mapping function that should be applied to the underlying value
     * of the identity monad.
     * @param {*} acc - An JavaScript value that should be used as an accumulator.
     * @return {*} Returns the return value of the mapping function provided as an argument.
     */
    fold: function _fold(fn, acc) {
        return fn(acc, this.value);
    },
    /**
     * @signature monad -> monad<monad<T>>
     * @description Returns a monad of the type passed as an argument that 'wraps'
     * and identity monad that 'wraps' the current identity monad's underlying value.
     * @memberOf dataStructures.identity
     * @instance
     * @function sequence
     * @param {Object} p - Any pointed monad with a '#of' function property
     * @return {Object} Returns a monad of the type passed as an argument that 'wraps'
     * and identity monad that 'wraps' the current identity monad's underlying value.
     */
    sequence: function _sequence(p) {
        return this.traverse(p, p.of);
    },
    /**
     * @signature Object -> () -> Object
     * @description Accepts a pointed monad with a '#of' function property and a mapping function. The mapping
     * function is applied to the identity monad's underlying value. The mapping function should return a monad
     * of any type. Then the {@link dataStructures.Identity.of} function is used to map over the returned monad. Essentially
     * creating a new object of type: monad<Identity<T>>, where 'monad' is the type of monad the mapping
     * function returns.
     * @memberOf dataStructures.identity
     * @instance
     * @function traverse
     * @param {Object} a - A pointed monad with a '#of' function property. Used only in cases
     * where the mapping function cannot be run.
     * @param {function} f - A mapping function that should be applied to the identity's underlying value.
     * @return {Object} Returns a new identity monad that wraps the mapping function's returned monad type.
     */
    traverse: function _traverse(a, f) {
        return f(this.value).map(this.factory.of);
    },
    /**
     * @signature (b -> a) -> dataStructures.Identity
     * @description This property will only function correctly if the underlying value of the
     * current identity is a function. Contramap accepts a function argument and returns a new
     * identity with the composition of the function argument and the underlying function
     * value as the new underlying. The supplied function argument is executed first in the
     * composition, so its signature must be (b -> a) so that the value it passes as an argument
     * to the previous underlying function will be of the expected type.
     * @memberOf dataStructures.identity
     * @instance
     * @function contramap
     * @param {function} fn - A function that should be composed with the current identity's
     * underlying function.
     * @return {dataStructures.identity} Returns a new identity data structure.
     */
    contramap: contramap,
    /**
     * @signature () -> boolean
     * @description Returns a boolean indicating if the identity is 'empty'. Because there is
     * no innate 'empty' value for an identity data structure, isEmpty will always return false.
     * @memberOf dataStructures.identity
     * @instance
     * @function isEmpty
     * @return {boolean} Returns a boolean indicating if the identity instance is 'empty'.
     */
    isEmpty: function _isEmpty() {
        return false;
    },
    /**
     * @signature (identity<A> -> B) -> identity<B>
     * @description Takes a function that operates on the current identity monad and returns
     * any value, invokes that function, passing the current identity monad as the only argument,
     * and then returns a new identity monad that wraps the return value of the provided function.
     * @param {function} fn - A function that can operate on an identity monad
     * @return {Identity<T>} Returns a new identity monad that wraps the return value of the
     * function that was provided as an argument.
     */
    extend: extendMaker(Identity),
    /**
     * @signature * -> boolean
     * @description Determines if 'this' identity monad is equal to another monad. Equality
     * is defined as:
     * 1) The other monad shares the same delegate object as 'this' identity monad
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.identity
     * @instance
     * @function
     * @param {Object} ma - The other monad to check for equality with 'this' monad.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: equals,
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.identity
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
     * underlying value
     * @memberOf dataStructures.identity
     * @instance
     * @function
     * @return {string} Returns a string representation of the identity
     * and its underlying value.
     */
    toString: stringMaker('Identity'),
    get [Symbol.toStringTag]() {
        return 'Identity';
    },
    /**
     * @signature * -> {@link dataStructures.identity}
     * @description Factory function used to create a new object that delegates to
     * the {@link dataStructures.identity} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link dataStructures.identity}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf dataStructures.identity
     * @instance
     * @function
     * @see dataStructures.Identity
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link dataStructures.identity}.
     * @return {dataStructures.identity} - Returns a new identity monad delegator
     */
    factory: Identity
};

/**
 * @signature (* -> *) -> (* -> *) -> dataStructures.identity<T>
 * @description Since the constant monad does not represent a disjunction, the Identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out monads/monads does not break an application that is
 * relying on its existence.
 * @memberOf dataStructures.identity
 * @instance
 * @function bimap
 * @param {function} f - A function that will be used to map over the underlying data of the
 * {@link dataStructures.identity} delegator.
 * @param {function} [g] - An optional function that is simply ignored on the {@link dataStructures.identity}
 * since there is no disjunction present.
 * @return {dataStructures.identity<T>} - Returns a new {@link dataStructures.identity} delegator after applying
 * the mapping function to the underlying data.
 */
identity.bimap = identity.map;

/**
 * @signature Object -> Object
 * @description Alias for {@link dataStructures.identity#apply}
 * @memberOf dataStructures.identity
 * @instance
 * @function ap
 * @see dataStructures.identity#apply
 * @param {Object} ma - Any object with a map function - i.e. a monad.
 * @return {Object} Returns an instance of the monad object provide as an argument.
 */
identity.ap = identity.apply;

/**
 * @signature () -> {@link dataStructures.identity}
 * @description Alias for {@link dataStructures.identity#chain}
 * @memberOf dataStructures.identity
 * @instance
 * @function fmap
 * @see dataStructures.identity#chain
 * @param {function} fn - A mapping function that returns a monad of the same type
 * @return {Object} Returns a new identity monad that 'wraps' the return value of the
 * mapping function after flattening it by one level.
 */
identity.fmap = identity.chain;

/**
 * @signature () -> {@link dataStructures.identity}
 * @description Alias for {@link dataStructures.identity#chain}
 * @memberOf dataStructures.identity
 * @instance
 * @function flatMap
 * @see dataStructures.identity#chain
 * @param {function} fn - A mapping function that returns a monad of the same type
 * @return {Object} Returns a new identity monad that 'wraps' the return value of the
 * mapping function after flattening it by one level.
 */
identity.flapMap = identity.chain;

/**
 * @signature () -> {@link dataStructures.identity}
 * @description Alias for {@link dataStructures.identity#chain}
 * @memberOf dataStructures.identity
 * @instance
 * @function bind
 * @see dataStructures.identity#chain
 * @param {function} fn - A mapping function that returns a monad of the same type
 * @return {Object} Returns a new identity monad that 'wraps' the return value of the
 * mapping function after flattening it by one level.
 */
identity.bind = identity.chain;

/**
 * @signature () -> *
 * @description Alias for {@link dataStructures.identity#fold}
 * @memberOf dataStructures.identity
 * @instance
 * @function reduce
 * @see dataStructures.identity#fold
 * @param {function} fn - Any mapping function that should be applied to the underlying value
 * of the identity monad.
 * @return {*} Returns the return value of the mapping function provided as an argument.
 */
identity.reduce = identity.fold;

identity.constructor = identity.factory;

export { Identity, identity };