import { monad_apply, chain, contramap, mjoin, equals, pointMaker, stringMaker,
        valueOf, extendMaker } from '../data_structure_util';

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
 * Because the identity monad does not require any specific context for
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
 * @signature () -> {@link monads.identity}
 * @description Creates and returns an 'empty' identity monad.
 * @return {monads.identity} - Returns a new identity monad.
 */
Identity.empty = () => Identity();

/**
 * @typedef {Object} identity
 * @property {function} value - returns the underlying value of the the monad
 * @property {function} map - maps a single function over the underlying value of the monad
 * @property {function} chain - returns a new identity monad
 * @property {function} mjoin - returns a new identity monad
 * @property {function} apply - returns a new instance of whatever monad type's underlying value this
 * identity's underlying function value should be mapped over.
 * @property {function} bimap - returns a new identity monad
 * @property {function} fold - Applies a function to the identity's underlying value and returns the result
 * @property {function} sequence - returns a new identity monad
 * @property {function} traverse - returns a new identity monad
 * @property {function} empty - Creates a new, 'empty' identity monad
 * @property {function} isEmpty - Returns a boolean indicating if the identity monad is 'empty'
 * @property {function} get - returns the underlying value of the monad
 * @property {function} orElse - returns the underlying value of the monad
 * @property {function} getOrElse - returns the underlying value of the monad
 * @property {function} of - creates a new identity delegate with the value provided
 * @property {function} valueOf - returns the underlying value of the monad; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity monad and its underlying value
 * @property {function} factory - a reference to the identity factory function
 * @property {function} [Symbol.Iterator] - Iterator for the identity
 * @kind {Object}
 * @memberOf monads
 * @namespace identity
 * @description This is the delegate object that specifies the behavior of the identity monad. All
 * operations that may be performed on an identity monad 'instance' delegate to this object. Identity
 * monad 'instances' are created by the {@link monads.Identity} factory function via Object.create,
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
     * see {@link monads.identity#map} and {@link monads.identity#bimap}.
     * To retrieve the underlying value of an identity delegator, see {@link monads.identity#extract}
     * and {@link monads.identity#valueOf}.
     * @memberOf monads.identity
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
     * @memberOf monads.identity
     * @instance
     * @private
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get extract() {
        return this.value;
    },
    /**
     * @signature () -> {@link monads.identity}
     * @description Takes a function that is applied to the underlying value of the
     * monad, the result of which is used to create a new {@link monads.identity}
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
    /**
     * @signature () -> {@link monads.identity}
     * @description Accepts a mapping function as an argument, applies the function to the
     * underlying value. If the mapping function returns an identity monad, chain will 'flatten'
     * the nested identities by one level. If the mapping function does not return an identity
     * monad, chain will just return an identity monad that 'wraps' whatever the return value
     * of the mapping function is. However, if the mapping function does not return a monad of
     * the same type, then chain is probably not the functionality you should use. See
     * {@link monads.identity#map} instead.
     * @memberOf monads.identity
     * @instance
     * @function chain
     * @param {function} fn - A mapping function that returns a monad of the same type
     * @return {Object} Returns a new identity monad that 'wraps' the return value of the
     * mapping function after flattening it by one level.
     */
    chain: chain,
    /**
     * @signature () -> {@link monads.identity}
     * @description Returns a new identity monad. If the current identity monad is nested, mjoin
     * will flatten it by one level. Very similar to {@link monads.identity#chain} except no
     * mapping function is accepted or run.
     * @memberOf monads.identity
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
     * @memberOf monads.identity
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
     * @memberOf monads.identity
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
     * @memberOf monads.identity
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
     * of any type. Then the {@link monads.Identity.of} function is used to map over the returned monad. Essentially
     * creating a new object of type: monad<Identity<T>>, where 'monad' is the type of monad the mapping
     * function returns.
     * @memberOf monads.identity
     * @instance
     * @function traverse
     * @param {Object} a - A pointed monad with a '#of' function property. Used only in cases
     * where the mapping function cannot be run.
     * @param {function} f - A mapping function that should be applied to the identity's underlying value.
     * @return {Object} Returns a new identity monad that wraps the mapping function's returned monad type.
     */
    traverse: function _traverse(a, f) {
        return f(this.value).map(this.of);
    },
    /**
     * @signature (b -> a) -> monads.Identity
     * @description This property will only function correctly if the underlying value of the
     * current identity monad is a function type. Accepts a function argument and returns a new
     * identity monad with the composition of the function argument and the underlying function
     * value as the new underlying. The supplied function argument is executed first in the
     * composition, so its signature must be (b -> a) so that the value it passes as an argument
     * to the previous underlying function will be of the expected type.
     * @memberOf monads.identity
     * @instance
     * @function contramap
     * @param {function} fn - A function that should be composed with the current identity's
     * underling function.
     * @return {monads.identity} Returns a new identity monad.
     */
    contramap: contramap,
    /**
     * @signature () -> {@link monads.identity}
     * @description Creates and returns a new, 'empty' identity monad.
     * @memberOf monads.identity
     * @instance
     * @function empty
     * @return {monads.identity} Creates and returns a new, 'empty' identity monad.
     */
    empty: Identity.empty,
    /**
     * @signature () -> boolean
     * @description Returns a boolean indicating if the monad is 'empty'
     * @memberOf monads.identity
     * @instance
     * @function isEmpty
     * @return {boolean} Returns a boolean indicating if the monad is 'empty'
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
     * @signature * -> boolean
     * @description Determines if 'this' identity monad is equal to another monad. Equality
     * is defined as:
     * 1) The other monad shares the same delegate object as 'this' identity monad
     * 2) Both underlying values are strictly equal to each other
     * @memberOf monads.identity
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
     * @memberOf monads.identity
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
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
     * @return {monads.identity} - Returns a new identity monad delegator
     */
    factory: Identity
};

/**
 * @signature (* -> *) -> (* -> *) -> monads.identity<T>
 * @description Since the constant monad does not represent a disjunction, the Identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out monads/monads does not break an application that is
 * relying on its existence.
 * @memberOf monads.identity
 * @instance
 * @function bimap
 * @param {function} f - A function that will be used to map over the underlying data of the
 * {@link monads.identity} delegator.
 * @param {function} [g] - An optional function that is simply ignored on the {@link monads.identity}
 * since there is no disjunction present.
 * @return {monads.identity<T>} - Returns a new {@link monads.identity} delegator after applying
 * the mapping function to the underlying data.
 */
identity.bimap = identity.map;

/**
 * @signature Object -> Object
 * @description Alias for {@link monads.identity#apply}
 * @memberOf monads.identity
 * @instance
 * @function ap
 * @see monads.identity#apply
 * @param {Object} ma - Any object with a map function - i.e. a monad.
 * @return {Object} Returns an instance of the monad object provide as an argument.
 */
identity.ap = identity.apply;

/**
 * @signature () -> {@link monads.identity}
 * @description Alias for {@link monads.identity#chain}
 * @memberOf monads.identity
 * @instance
 * @function fmap
 * @see monads.identity#chain
 * @param {function} fn - A mapping function that returns a monad of the same type
 * @return {Object} Returns a new identity monad that 'wraps' the return value of the
 * mapping function after flattening it by one level.
 */
identity.fmap = identity.chain;

/**
 * @signature () -> {@link monads.identity}
 * @description Alias for {@link monads.identity#chain}
 * @memberOf monads.identity
 * @instance
 * @function flatMap
 * @see monads.identity#chain
 * @param {function} fn - A mapping function that returns a monad of the same type
 * @return {Object} Returns a new identity monad that 'wraps' the return value of the
 * mapping function after flattening it by one level.
 */
identity.flapMap = identity.chain;

/**
 * @signature () -> {@link monads.identity}
 * @description Alias for {@link monads.identity#chain}
 * @memberOf monads.identity
 * @instance
 * @function bind
 * @see monads.identity#chain
 * @param {function} fn - A mapping function that returns a monad of the same type
 * @return {Object} Returns a new identity monad that 'wraps' the return value of the
 * mapping function after flattening it by one level.
 */
identity.bind = identity.chain;

/**
 * @signature () -> *
 * @description Alias for {@link monads.identity#fold}
 * @memberOf monads.identity
 * @instance
 * @function reduce
 * @see monads.identity#fold
 * @param {function} fn - Any mapping function that should be applied to the underlying value
 * of the identity monad.
 * @return {*} Returns the return value of the mapping function provided as an argument.
 */
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