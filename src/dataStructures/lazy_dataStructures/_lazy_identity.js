import { nil, javaScriptTypes } from '../../helpers';
import { type, strictEquals } from '../../functionalHelpers';
import { not } from '../../decorators';
import { constant, when } from '../../combinators';
import { equals, stringMaker, valueOf, extendMaker } from '../data_structure_util';

/**
 * @signature - :: * -> {@link dataStructures.lazy_identity}
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.lazy_identity} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.lazy_identity}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace LazyIdentity
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.lazy_identity}.
 * @return {dataStructures.lazy_identity} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_identity}.
 */
function LazyIdentity(val) {
    let fn = constant(val);
    return Object.create(lazy_identity, {
        _value: {
            value: fn,
            writable: false,
            configurable: false
        },
        _source: {
            value: fn,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @signature * -> {@link dataStructures.lazy_identity}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.lazy_identity} object delegator instance.
 * Because the identity monad does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.LazyIdentity}
 * @memberOf dataStructures.LazyIdentity
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link dataStructures.lazy_identity}.
 * @return {dataStructures.lazy_identity} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_identity}.
 */
LazyIdentity.of = x => LazyIdentity(x);

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.lazy_identity} delegate or not. Available on the
 * identity's factory function as Identity.is.
 * @memberOf dataStructures.LazyIdentity
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.lazy_identity} delegate.
 */
LazyIdentity.is = f => lazy_identity.isPrototypeOf(f);

/**
 * @signature () -> {@link dataStructures.lazy_identity}
 * @description Creates and returns an 'empty' identity monad.
 * @memberOf dataStructures.LazyIdentity
 * @return {dataStructures.lazy_identity} - Returns a new identity monad.
 */
LazyIdentity.empty = () => LazyIdentity(Object.create(nil));

LazyIdentity.lift = function lift(fn) {
    return function _args(...args) {
        return LazyIdentity.of(fn(...args));
    };
};

var next = fn => Object.create(lazy_identity, {
    _value: {
        value: fn,
        writable: false,
        configurable: false
    },
    _source: {
        value: fn,
        writable: false,
        configurable: false
    }
});

 /**
 * @typedef {Object} dataStructures.lazy_identity
 * @property {function} value - returns the underlying value of the the monad
 * @property {function} map - maps a single function over the underlying value of the monad
 * @property {function} chain - returns a new identity monad
 * @property {function} mjoin - returns a new identity monad
 * @property {function} monad_apply - returns a new instance of whatever monad type's underlying value this
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
 * @memberOf dataStructures
 * @namespace lazy_identity
 * @description This is the delegate object that specifies the behavior of the identity monad. All
 * operations that may be performed on an identity monad 'instance' delegate to this object. Identity
 * monad 'instances' are created by the {@link dataStructures.LazyIdentity} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity monad delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var lazy_identity = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an identity delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an identity delegator,
     * see {@link dataStructures.lazy_identity#map} and {@link dataStructures.lazy_identity#bimap}.
     * To retrieve the underlying value of an identity delegator.
     * and {@link dataStructures.lazy_identity#valueOf}.
     * @memberOf dataStructures.lazy_identity
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._source();
    },
    get source() {
        return this._source;
    },
    get extract() {
        return this.source();
    },
    /**
     * @signature () -> {@link dataStructures.lazy_identity}
     * @description Takes a function that is applied to the underlying value of the
     * monad, the result of which is used to create a new {@link dataStructures.lazy_identity}
     * delegator instance.
     * @memberOf dataStructures.lazy_identity
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.lazy_identity}.
     * @return {dataStructures.lazy_identity} Returns a new {@link dataStructures.lazy_identity}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: function _map(fn) {
        return next(() => fn(this.value));
    },
    /**
     * @signature () -> {@link dataStructures.lazy_identity}
     * @description Accepts a mapping function as an argument, applies the function to the
     * underlying value. If the mapping function returns an identity monad, chain will 'flatten'
     * the nested identities by one level. If the mapping function does not return an identity
     * monad, chain will just return an identity monad that 'wraps' whatever the return value
     * of the mapping function is. However, if the mapping function does not return a monad of
     * the same type, then chain is probably not the functionality you should use. See
     * {@link dataStructures.lazy_identity#map} instead.
     * @memberOf dataStructures.lazy_identity
     * @instance
     * @function chain
     * @param {function} fn - A mapping function that returns a monad of the same type
     * @return {Object} Returns a new identity monad that 'wraps' the return value of the
     * mapping function after flattening it by one level.
     */
    chain: function _chain(fn) {
        return next(() => {
            let val = fn(this.value);
            return Object.getPrototypeOf(this).isPrototypeOf(val) ? val.value : val;
        });
    },
    /**
     * @signature () -> {@link dataStructures.lazy_identity}
     * @description Returns a new identity monad. If the current identity monad is nested, mjoin
     * will flatten it by one level. Very similar to {@link dataStructures.lazy_identity#chain} except no
     * mapping function is accepted or run.
     * @memberOf dataStructures.lazy_identity
     * @instance
     * @function mjoin
     * @return {Object} Returns a new identity monad after flattening the nested monads by one level.
     */
    mjoin: function _mjoin() {
        return next(() => Object.getPrototypeOf(this).isPrototypeOf(this.value) ? this.value.value : this.value);
    },
    /**
     * @signature Object -> Object
     * @description Accepts any monad object with a mapping function and invokes that object's mapping
     * function on the identity's underlying value. In order for this function to execute properly and
     * not throw, the identity's underlying value must be a function that can be used as a mapping function
     * on the monad object supplied as the argument.
     * @memberOf dataStructures.lazy_identity
     * @instance
     * @function apply
     * @param {Object} ma - Any object with a map function - i.e. a monad.
     * @return {Object} Returns an instance of the monad object provide as an argument.
     */
    apply: function _apply(ma) {
        return ma.map(this.value);
    },
    /**
     * @signature () -> *
     * @description Accepts a function that is used to map over the identity's underlying value
     * and returns the returns value of the function without 're-wrapping' it in a new identity
     * monad instance.
     * @memberOf dataStructures.lazy_identity
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
     * @signature
     * @description Returns a monad of the type passed as an argument that 'wraps'
     * and identity monad that 'wraps' the current identity monad's underlying value.
     * @memberOf dataStructures.lazy_identity
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
     * of any type. Then the {@link dataStructures.LazyIdentity.of} function is used to map over the returned monad. Essentially
     * creating a new object of type: monad<Identity<T>>, where 'monad' is the type of monad the mapping
     * function returns.
     * @memberOf dataStructures.lazy_identity
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
     * @signature (b -> a) -> lazy_identity
     * @description This property will only function correctly if the underlying value of the
     * current identity monad is a function type. Accepts a function argument and returns a new
     * identity monad with the composition of the function argument and the underlying function
     * value as the new underlying. The supplied function argument is executed first in the
     * composition, so its signature must be (b -> a) so that the value it passes as an argument
     * to the previous underlying function will be of the expected type.
     * @memberOf dataStructures.lazy_identity
     * @instance
     * @function contramap
     * @param {function} fn - A function that should be composed with the current identity's
     * underling function.
     * @return {dataStructures.lazy_identity} Returns a new identity monad.
     */
    contramap: function contramap(fn) {
        return next(() => (...args) => this.value(fn(...args)));
    },
    /**
     * @signature () -> boolean
     * @description Returns a boolean indicating if the monad is 'empty'
     * @memberOf dataStructures.lazy_identity
     * @instance
     * @function isEmpty
     * @return {boolean} Returns a boolean indicating if the monad is 'empty'
     */
    isEmpty: false,
    /**
     * @signature (identity<A> -> B) -> identity<B>
     * @description Takes a function that operates on the current identity monad and returns
     * any value, invokes that function, passing the current identity monad as the only argument,
     * and then returns a new identity monad that wraps the return value of the provided function.
     * @param {function} fn - A function that can operate on an identity monad
     * @return {dataStructures.LazyIdentity<T>} Returns a new identity monad that wraps the return value of the
     * function that was provided as an argument.
     */
    extend: extendMaker(LazyIdentity),
     /**
      * @signature * -> boolean
      * @description Determines if 'this' identity object is equal to another data structure. Equality
      * is defined as:
      * 1) The other data structure shares the same delegate object as 'this' data structure
      * 2) Both underlying values are strictly equal to each other
      * @memberOf dataStructures.lazy_identity
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
     * @memberOf dataStructures.lazy_identity
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
     * underlying value
     * @memberOf dataStructures.lazy_identity
     * @instance
     * @function
     * @return {string} Returns a string representation of the identity
     * and its underlying value.
     */
    toString: stringMaker('LazyIdentity'),
    /**
     * @signature * -> {@link dataStructures.lazy_identity}
     * @description Factory function used to create a new object that delegates to
     * the {@link dataStructures.lazy_identity} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link dataStructures.lazy_identity}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf dataStructures.lazy_identity
     * @instance
     * @function
     * @see LazyIdentity
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link dataStructures.lazy_identity}.
     * @return {dataStructures.lazy_identity} - Returns a new lazy_identity delegator object
     */
    factory: LazyIdentity,
     [Symbol.iterator]: function *_iterator() {
        yield this.value;
     }
};

/**
 * @signature (* -> *) -> (* -> *) -> lazy_identity<T>
 * @description Since the constant monad does not represent a disjunction, the Identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out monads/monads does not break an application that is
 * relying on its existence.
 * @memberOf dataStructures.lazy_identity
 * @instance
 * @function bimap
 * @param {function} f - A function that will be used to map over the underlying data of the
 * {@link dataStructures.lazy_identity} delegator.
 * @param {function} [g] - An optional function that is simply ignored on the {@link dataStructures.lazy_identity}
 * since there is no disjunction present.
 * @return {dataStructures.lazy_identity<T>} - Returns a new {@link dataStructures.lazy_identity} delegator after applying
 * the mapping function to the underlying data.
 */
lazy_identity.bimap = lazy_identity.map;

/**
 * @signature () -> *
 * @description Alias for {@link dataStructures.lazy_identity#fold}
 * @memberOf dataStructures.lazy_identity
 * @instance
 * @function reduce
 * @see dataStructures.lazy_identity#fold
 * @param {function} fn - Any mapping function that should be applied to the underlying value
 * of the identity monad.
 * @return {*} Returns the return value of the mapping function provided as an argument.
 */
lazy_identity.reduce = lazy_identity.fold;

lazy_identity.constructor = lazy_identity.factory;

export { LazyIdentity, lazy_identity };