import { apply, chain, chainRec, contramap, extend, dimap, join, equals, stringMaker, valueOf } from './data_structure_util';

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
 * Because the identity data structure does not require any specific context for
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
 * @description Creates and returns an 'empty' identity data structure.
 * @return {dataStructures.identity} - Returns a new identity.
 */
Identity.empty = () => Identity();

/**
 * @typedef {Object} identity
 * @property {function} extract - returns the underlying value of the identity
 * @property {function} map - maps a single function over the underlying value of the identity
 * @property {function} chain - returns a new identity data structure
 * @property {function} join - returns a new identity data structure
 * @property {function} apply - returns a new instance of whatever data structure type's underlying value this
 * identity's underlying function value should be mapped over.
 * @property {function} bimap - returns a new identity data structure
 * @property {function} contramap - maps over the input of a contravariant identity
 * @property {function} dimap - maps over the input and output of a contravariant identity
 * @property {function} fold - Applies a function to the identity's underlying value and returns the result
 * @property {function} sequence - returns a new identity data structure
 * @property {function} traverse - returns a new identity data structure
 * @property {function} isEmpty - Returns a boolean indicating if the identity is 'empty'
 * @property {function} mapToConstant - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.constant}
 * @property {function} mapToEither - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.Either}
 * @property {function} mapToLeft - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.left}
 * @property {function} mapToRight - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.right}
 * @property {function} mapToFuture - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.future}
 * @property {function} mapToIo - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.io}
 * @property {function} mapToList - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.list}
 * @property {function} mapToMaybe - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.Maybe}
 * @property {function} mapToJust - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.just}
 * @property {function} mapToNothing - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.nothing}
 * @property {function} mapToValidation - Accepts an optional function to map over the underlying data and converts the output into a {@link dataStructures.validation}
 * @property {function} valueOf - returns the underlying value of the identity; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity data structure and its underlying value
 * @property {function} factory - a reference to the identity factory function
 * @property {function} [Symbol.Iterator] - Iterator for the identity
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace identity
 * @description This is the delegate object that specifies the behavior of the identity data structure. All
 * operations that may be performed on an identity 'instance' delegate to this object. Identity
 * monad 'instances' are created by the {@link dataStructures.Identity} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity delegator object beyond the ._value property.
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
     * as a function, you merely need to reference as a non-function property.
     * @example Identity(10).extract // => 10
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
     * @description Takes a function as an argument and applies that function to the underlying value
     * of the identity. A new identity instance that holds the result of the application as its underlying
     * value is created and returned.
     * @memberOf dataStructures.identity
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.identity}.
     * @return {dataStructures.identity} Returns a new {@link dataStructures.identity}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     *
     * @example Identity(10).map(x => x * x)    // => Identity(100)
     */
    map: function _map(fn) {
        return Identity.of(fn(this.value));
    },
    /**
     * @signature () -> {@link dataStructures.identity}
     * @description Accepts a mapping function as an argument, applies the function to the
     * underlying value. If the mapping function returns an identity data structure, chain will 'flatten'
     * the nested identities by one level. If the mapping function does not return an identity,
     * chain will just return an identity data structure that 'wraps' whatever the return value
     * of the mapping function is. However, if the mapping function does not return a data structure  of
     * the same type, then chain is probably not the functionality you should use. See
     * {@link dataStructures.identity#map} instead.
     *
     * Alias: bind, flatMap
     * @memberOf dataStructures.identity
     * @instance
     * @function chain
     * @param {function} fn - A mapping function that returns a data structure of the same type
     * @return {Object} Returns a new identity data structure that 'wraps' the return value of the
     * mapping function after flattening it by one level.
     *
     * @example
     * Identity(10).chain(x => Identity(x * x))    // => Identity(100)
     * Identity(10).chain(x => x * x)              // => Identity(100)
     * Identity(10).chain(x => Just(x * x))        // => Identity(Just(100))
     */
    chain: chain,
    chainRec: chainRec,
    /**
     * @signature () -> {@link dataStructures.identity}
     * @description Returns a new identity data structure. If the current identity is nested, join
     * will flatten it by one level. Very similar to {@link dataStructures.identity#chain} except no
     * mapping function is accepted or run.
     * @memberOf dataStructures.identity
     * @instance
     * @function mjoin
     * @return {Object} Returns a new identity after flattening the nested data structures by one level.
     *
     * @example
     * Identity(Identity(10)).join()   // => Identity(10)
     * Identity(Just(10)).join()       // => Identity(Just(10))
     * Identity(10).join()             // => Identity(10)
     */
    join: join,
    /**
     * @signature Object -> Object
     * @description Accepts any applicative object with a mapping function and invokes that object's mapping
     * function on the identity's underlying value. In order for this function to execute properly and
     * not throw, the identity's underlying value must be a function that can be used as a mapping function
     * on the data structure supplied as the argument.
     *
     * Alias: ap
     * @memberOf dataStructures.identity
     * @instance
     * @function apply
     * @param {Object} ma - Any data structure with a map function - i.e. a functor.
     * @return {Object} Returns an instance of the data structure object provide as an argument.
     *
     * @example Identity(10).apply(Identity(x => x + 10))  // => Identity(20)
     */
    apply: apply,
    /**
     * @signature () -> *
     * @description Accepts a function that is used to map over the identity's underlying value
     * and returns the value of the function without 're-wrapping' it in a new identity
     * instance.
     *
     * Alias: reduce
     * @memberOf dataStructures.identity
     * @instance
     * @function fold
     * @param {function} fn - Any mapping function that should be applied to the underlying value
     * of the identity.
     * @param {*} acc - An JavaScript value that should be used as an accumulator.
     * @return {*} Returns the return value of the mapping function provided as an argument.
     *
     * @example Identity(10).fold((acc, x) => x + acc, 5)   // => 15
     */
    fold: function _fold(fn, acc) {
        return fn(acc, this.value);
    },
    /**
     * @signature identity -> M<identity<T>>
     * @description Returns a data structure of the type passed as an argument that 'wraps'
     * and identity object that 'wraps' the current identity's underlying value.
     * @memberOf dataStructures.identity
     * @instance
     * @function sequence
     * @param {Object} p - Any pointed data structure with a '#of' function property
     * @return {Object} Returns a data structure of the type passed as an argument that 'wraps'
     * an identity that 'wraps' the current identity's underlying value.
     */
    sequence: function _sequence(p) {
        return this.traverse(p, p.of);
    },
    /**
     * @signature Object -> () -> Object
     * @description Accepts a pointed data structure with a '#of' function property and a mapping function. The mapping
     * function is applied to the identity's underlying value. The mapping function should return a data structure
     * of any type. Then the {@link dataStructures.Identity.of} function is used to map over the returned data structure. Essentially
     * creating a new object of type: M<Identity<T>>, where 'M' is the type of data structure the mapping
     * function returns.
     * @memberOf dataStructures.identity
     * @instance
     * @function traverse
     * @param {Object} a - A pointed data structure with a '#of' function property. Used only in cases
     * where the mapping function cannot be run.
     * @param {function} f - A mapping function that should be applied to the identity's underlying value.
     * @return {Object} Returns a new identity that wraps the mapping function's returned data structure type.
     *
     * @example Identity(10).traverse(Just, x => Just(x * x))   // => Just(Identity(100))
     */
    traverse: function _traverse(a, f) {
        return f(this.value).map(this.factory.of);
    },
    /**
     * @signature (b -> a) -> dataStructures.Identity
     * @description This property is for contravariant identity data structures and will not function
     * correctly if the underlying value is anything other than a function. Contramap accepts a
     * function argument and returns a new identity with the composition of the function argument and
     * the underlying function value as the new underlying. The supplied function argument is executed
     * first in the composition, so its signature must be (b -> a) so that the value it passes as an
     * argument to the previous underlying function will be of the expected type.
     * @memberOf dataStructures.identity
     * @instance
     * @function contramap
     * @param {function} fn - A function that should be composed with the current identity's
     * underlying function.
     * @return {dataStructures.identity} Returns a new identity data structure.
     *
     * @example Identity(5).apply(Identity(x => x * x).contramap(x => x + 10))      // => Identity(225)
     */
    contramap: contramap,

    /**
     * @signature dimap :: (b -> a) -> (d -> c) -> identity<c>
     * @description Like {@link dataStructures.identity#contramap}, dimap is for use on contravariant
     * identity instances, and thus, requires that the identity instance dimap is invoked on has an
     * underlying function value. Dimap accepts two arguments, both of them functions. The first argument
     * is used to map over the input the current contravariant identity, while the second argument maps
     * over the output. Dimap is like contramap, but with an additional mapping thrown in after it has run.
     * Thus, dimap can be derived from contramap and map: i.dimap(f, g) === i.contramap(f).map(g)
     * @memberOf dataStructures.identity
     * @instance
     * @function dimap
     * @param {function} f - f
     * @param {function} g - g
     * @return {dataStructures.identity} l
     *
     * @example Identity(5).apply(Identity(x => x * x).dimap(x => x + 10, x => x / 5))  // => Identity(45)
     */
    dimap: dimap,
    /**
     * @signature () -> boolean
     * @description Returns a boolean indicating if the identity is 'empty'. Because there is
     * no innate 'empty' value for an identity data structure, isEmpty will always return false.
     * @memberOf dataStructures.identity
     * @instance
     * @function isEmpty
     * @return {boolean} Returns a boolean indicating if the identity instance is 'empty'.
     *
     * @example
     * Identity(10).isEmpty()  // => false
     * Identity().isEmpty()    // => false
     */
    isEmpty: function _isEmpty() {
        return false;
    },
    /**
     * @signature (identity<A> -> B) -> identity<B>
     * @description Takes a function that operates on the current identity and returns
     * any value, invokes that function, passing the current identity as the only argument,
     * and then returns a new identity that wraps the return value of the provided function.
     * @param {function} fn - A function that can operate on an identity data structure
     * @return {Identity<T>} Returns a new identity that wraps the return value of the
     * function that was provided as an argument.
     */
    extend: extend,
    /**
     * @signature * -> boolean
     * @description Determines if 'this' identity is equal to another data structure. Equality
     * is defined as:
     * 1) The other data structure shares the same delegate object as 'this' identity
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.identity
     * @instance
     * @function
     * @param {Object} ma - The other data structure to check for equality with 'this' identity.
     * @return {boolean} - Returns a boolean indicating equality
     *
     * @example
     * Identity(10).equals(Identity(10))    // => true
     * Identity(10).equals(Identity(1))     // => false
     * Identity(10).equals(Just(10))        // => false
     */
    equals: equals,
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current identity 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.identity
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     *
     * @example
     * 5 + Identity(10)     // => 15
     * 'Hello my name is: ' + Identity('Identity')  // => 'Hello my name is : Identity'
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the identity and its
     * underlying value
     * @memberOf dataStructures.identity
     * @instance
     * @function
     * @return {string} Returns a string representation of the identity
     * and its underlying value.
     *
     * @example
     * Identity(10).toString()      // => 'Identity(10)'
     * Identity(Identity(true))     // => 'Identity(Identity(true))'
     */
    toString: stringMaker('Identity'),
    /**
     * @description Used only when Object's .toString function property is invoked on an instance
     * of the identity data structure, this will affect the returned 'class' value. Rather than
     * receiving '[object Object]' (which would normally be the case), this will cause the same
     * invocation to return '[object Identity]'.
     * @memberOf dataStructures.identity
     * @instance
     * @returns {string} Returns a string representation of the identity's 'class'.
     *
     * @example Object.prototype.toString.call(Identity(10))    // => '[object Identity]'
     */
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
     * @return {dataStructures.identity} - Returns a new identity object
     */
    factory: Identity
};

/**
 * @signature (* -> *) -> (* -> *) -> dataStructures.identity<T>
 * @description Since the identity data structure does not represent a disjunction, the identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out data structure does not break an application that is
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
 *
 * @example Identity(10).bimap(x => x + 10, x => x - 10)    // => Identity(20)
 */
identity.bimap = identity.map;

/**
 * @signature Object -> Object
 * @description Alias for {@link dataStructures.identity#apply}
 * @memberOf dataStructures.identity
 * @instance
 * @function ap
 * @ignore
 * @see dataStructures.identity#apply
 * @param {Object} ma - Any object with a map function - i.e. a monad.
 * @return {Object} Returns an instance of the data structure object provide as an argument.
 */
identity.ap = identity.apply;

/**
 * @signature () -> {@link dataStructures.identity}
 * @description Alias for {@link dataStructures.identity#chain}
 * @memberOf dataStructures.identity
 * @instance
 * @function fmap
 * @ignore
 * @see dataStructures.identity#chain
 * @param {function} fn - A mapping function that returns a data structure of the same type
 * @return {Object} Returns a new identity that 'wraps' the return value of the
 * mapping function after flattening it by one level.
 */
identity.fmap = identity.chain;

/**
 * @signature () -> {@link dataStructures.identity}
 * @description Alias for {@link dataStructures.identity#chain}
 * @memberOf dataStructures.identity
 * @instance
 * @function flatMap
 * @ignore
 * @see dataStructures.identity#chain
 * @param {function} fn - A mapping function that returns a data structure of the same type
 * @return {Object} Returns a new identity that 'wraps' the return value of the
 * mapping function after flattening it by one level.
 */
identity.flapMap = identity.chain;

/**
 * @signature () -> {@link dataStructures.identity}
 * @description Alias for {@link dataStructures.identity#chain}
 * @memberOf dataStructures.identity
 * @instance
 * @function bind
 * @ignore
 * @see dataStructures.identity#chain
 * @param {function} fn - A mapping function that returns a data structure of the same type
 * @return {Object} Returns a new identity that 'wraps' the return value of the
 * mapping function after flattening it by one level.
 */
identity.bind = identity.chain;

/**
 * @signature () -> *
 * @description Alias for {@link dataStructures.identity#fold}
 * @memberOf dataStructures.identity
 * @instance
 * @function reduce
 * @ignore
 * @see dataStructures.identity#fold
 * @param {function} fn - Any mapping function that should be applied to the underlying value
 * of the identity data structure.
 * @return {*} Returns the return value of the mapping function provided as an argument.
 */
identity.reduce = identity.fold;

identity.constructor = identity.factory;

export { Identity, identity };
