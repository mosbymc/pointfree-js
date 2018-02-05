import { join, equals, stringMaker, valueOf } from './data_structure_util';

function returnMe() {
    return this;
}

/**
 * @signature - :: * -> {@link dataStructures.constant}
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.constant} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.constant}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Constant
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.constant}.
 * @return {dataStructures.constant} - Returns a new object that delegates to the
 * {@link dataStructures.constant}.
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
 * @signature * -> {@link dataStructures.constant}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.constant} object delegator instance.
 * Because the constant functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.Constant}
 * @memberOf dataStructures.Constant
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link dataStructures.constant}.
 * @return {dataStructures.constant} - Returns a new object that delegates to the
 * {@link dataStructures.constant}.
 */
Constant.of = x => Constant(x);

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.constant} delegate or not. Available on the
 * identity_functor's factory function as Identity.is.
 * @memberOf dataStructures.Constant
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.constant} delegate.
 */
Constant.is = f => constant.isPrototypeOf(f);

/**
 * @typedef {Object} constant
 * @property {function} extract - returns the underlying value of the the functor
 * @property {function} map - maps a single function over the underlying value of the functor
 * @property {function} bimap
 * @property {function} contramap
 * @property {function} valueOf - returns the underlying value of the functor; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity functor and its underlying value
 * @property {function} factory - a reference to the constant factory function
 * @property {function} [Symbol.Iterator] - Iterator for the constant
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace constant
 * @description This is the delegate object that specifies the behavior of the identity functor. All
 * operations that may be performed on an identity functor 'instance' delegate to this object. Constant
 * functor 'instances' are created by the {@link dataStructures.Constant} factory function via Object.create,
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
     * see {@link dataStructures.constant#map} and {@link dataStructures.constant#bimap}.
     * To retrieve the underlying value of an identity_functor delegator, see {@link dataStructures.constant#get},
     * {@link dataStructures.constant#orElse}, {@link dataStructures.constant#getOrElse},
     * and {@link dataStructures.constant#valueOf}.
     * @memberOf dataStructures.constant
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of a constant delegator. This is a getter function
     * and thus works differently than the fantasy-land specification; rather than invoking constant#extract
     * as a function, you merely need to reference as a non-function property.
     * @example Constant(10).extract // => 10
     * @memberOf dataStructures.constant
     * @instance
     * @private
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get extract() {
        return this.value;
    },
    /**
     * @signature () -> {@link dataStructures.constant}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link dataStructures.constant}
     * delegator instance.
     * @memberOf dataStructures.constant
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.constant}.
     * @return {dataStructures.constant} Returns a new {@link dataStructures.constant}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: returnMe,
    chain: returnMe,
    join: returnMe,
    /**
     * @signature
     * @description d
     * @param {dataStructures.constant} con - Another constant data structure
     * @return {dataStructures.constant} Returns itself
     */
    concat: returnMe,
    fold: function _fold(f) {
        return f(this.value);
    },
    sequence: function _sequence(p) {
        return this.factory.of(this.value);
    },
    traverse: function _traverse(a, f) {
        return this.factory.of(this.value);
    },
    contramap: returnMe,
    dimap: returnMe,
    apply: returnMe,
    /**
     * @signature () -> boolean
     * @description Returns a boolean indicating if the constant is 'empty'. Because there is
     * no innate 'empty' value for a constant data structure, isEmpty will always return false.
     * @memberOf dataStructures.constant
     * @instance
     * @function isEmpty
     * @return {boolean} Returns a boolean indicating if the identity instance is 'empty'.
     *
     * @example
     * Constant(10).isEmpty()  // => false
     * Constant().isEmpty()    // => false
     */
    isEmpty: function _isEmpty() {
        return false;
    },
    /**
     * @signature * -> boolean
     * @description Determines if 'this' identity functor is equal to another functor. Equality
     * is defined as:
     * 1) The other functor shares the same delegate object as 'this' identity functor
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.constant
     * @instance
     * @function
     * @param {Object} ma - The other functor to check for equality with 'this' functor.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: equals,
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.constant
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the functor and its
     * underlying value
     * @memberOf dataStructures.constant
     * @instance
     * @function
     * @return {string} Returns a string representation of the constant
     * and its underlying value.
     */
    toString: stringMaker('Constant'),
    get [Symbol.toStringTag]() {
        return 'Constant';
    },
    /**
     * @signature * -> {@link dataStructures.constant}
     * @description Factory function used to create a new object that delegates to
     * the {@link dataStructures.constant} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link dataStructures.constant}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf dataStructures.constant
     * @instance
     * @function
     * @see dataStructures.Constant
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link dataStructures.constant}.
     * @return {dataStructures.constant} - Returns a new identity functor delegator
     */
    factory: Constant
};

/**
 * @signature (* -> *) -> (* -> *) -> dataStructures.constant<T>
 * @description Since the constant functor does not represent a disjunction, the Identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out monads/monads does not break an application that is
 * relying on its existence.
 * @memberOf dataStructures.constant
 * @instance
 * @function
 * @param {function} f - A function that will be used to map over the underlying data of the
 * {@link dataStructures.constant} delegator.
 * @param {function} [g] - An optional function that is simply ignored on the {@link dataStructures.constant}
 * since there is no disjunction present.
 * @return {dataStructures.constant} - Returns a new {@link dataStructures.constant} delegator after applying
 * the mapping function to the underlying data.
 */
constant.bimap = constant.map;

constant.ap = constant.apply;
constant.fmap = constant.chain;
constant.flapMap = constant.chain;
constant.bind = constant.chain;
constant.reduce = constant.fold;
constant.constructor = constant.factory;


export { Constant, constant };