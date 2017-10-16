import { identity } from '../combinators';
import { monad_apply, chain, mjoin, disjunctionEqualMaker, maybeFactoryHelper, stringMaker, valueOf, sharedMaybeFns } from './data_structure_util';

/**
 * @signature
 * @description Returns an either functor based on a loose equals null comparison. If
 * the argument passed to the function loose equals null, a left is returned; other wise,
 * a right.
 * @private
 * @param {*} x - Any value that should be placed inside an either functor.
 * @return {dataStructures.just|dataStructures.nothing} - Either a left or a right functor
 */
function fromNullable(x) {
    return null != x ? Just(x) : Nothing();
}

var returnNothing = () => nothing;


/**
 * @signature - :: * -> dataStructures.just|dataStructures.nothing
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.just|dataStructures.nothing} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.just|dataStructures.nothing}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Maybe
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} isJust
 * @property {function} isNothing
 * @property {function} Just
 * @property {function} Nothing
 * @property {function} fromNullable
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.just|dataStructures.nothing}.
 * @return {dataStructures.just|dataStructures.nothing} - Returns a new object that delegates to the
 * {@link dataStructures.just|dataStructures.nothing}.
 */
function Maybe(val) {
    return null == val ?
        nothing :
        Object.create(just, {
            _value: { value: val },
            isJust: { value: true },
            isNothing: { value: false }
        });
}

/**
 * @signature * -> {@link dataStructures.just}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.just} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.just}
 * @memberOf dataStructures.Maybe
 * @static
 * @function of
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.just}.
 * @return {dataStructures.just} - Returns a new object that delegates to the
 * {@link dataStructures.just}.
 */
Maybe.of = function _of(val) {
    return Object.create(just, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
};

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.just|dataStructures.just} delegate or not. Available on the
 * {@link dataStructures.just|dataStructures.nothing}'s factory function as dataStructures.Maybe#is
 * @memberOf dataStructures.Maybe
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.just|dataStructures.nothing} delegate.
 */
Maybe.is = f => just.isPrototypeOf(f) || nothing === f;

/**
 * @signature
 * @description Alias for {@link dataStructures.Maybe.of}
 * @memberOf dataStructures.Maybe
 * @function Just
 * @param {*} val - a
 * @return {just} - {@link dataStructures.just}
 */
Maybe.Just = Maybe.of;

/**
 * @signature
 * @description Creates and returns a new {@link dataStructures.nothing} monad
 * @memberOf dataStructures.Maybe
 * @function Nothing
 * @return {dataStructures.nothing} A new {@link dataStructures.nothing}
 */
Maybe.Nothing = () => Maybe();

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'just' monad.
 * @memberOf dataStructures.Maybe
 * @function is
 * @param {Object} [m] - a
 * @return {boolean} - b
 */
Maybe.isJust = m => just.isPrototypeOf(m);

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'nothing' monad.
 * @memberOf dataStructures.Maybe
 * @function is
 * @param {Object} [m] - a
 * @return {boolean} - b
 */
Maybe.isNothing = m => nothing === m;

/**
 * @signature * -> dataStructures.left|dataStructures.right
 * @description Takes any value and returns a 'nothing' monad is the value
 * loose equals null; other wise returns a 'just' monad.
 * @memberOf dataStructures.Maybe
 * @function is
 * @param {*} [x] - a
 * @return {dataStructures.left|dataStructures.right} - b
 */
Maybe.fromNullable = fromNullable;

//TODO: determine if there is any purpose in splitting a maybe into two types... if those sub-types
//TODO: are not exposed, what benefit is derived from them? And if they are exposed (Just being Identity,
//TODO: and Nothing being Constant(null)), then the maybe container has a direct dependency on the Identity
//TODO: and Constant containers. This becomes an issue due to circular dependencies.
/**
 * @signature - :: * -> dataStructures.just
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.just} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.just}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Just
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.just}.
 * @return {dataStructures.just} - Returns a new object that delegates to the
 * {@link dataStructures.just}.
 */
function Just(val) {
    return Object.create(just, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
}

/**
 * @signature * -> {@link dataStructures.just}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.just} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.Just}
 * @memberOf dataStructures.Just
 * @static
 * @function of
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.just}.
 * @return {dataStructures.just} - Returns a new object that delegates to the
 * {@link dataStructures.just}.
 */
Just.of = function _of(val) {
    return Object.create(just, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
};

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.just} delegate or not. Available on the
 * {@link dataStructures.just}'s factory function as dataStructures.Right#is
 * @memberOf dataStructures.Just
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.just} delegate.
 */
Just.is = f => just.isPrototypeOf(f);

/**
 * @signature - :: * -> dataStructures.nothing
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.nothing} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.nothing}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Nothing
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @return {dataStructures.nothing} - Returns a new object that delegates to the
 * {@link dataStructures.nothing}.
 */
var Nothing = returnNothing;

/**
 * @signature * -> {@link dataStructures.nothing}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.nothing} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.Nothing}
 * @memberOf dataStructures.Nothing
 * @static
 * @function of
 * @return {dataStructures.nothing} - Returns a new object that delegates to the
 * {@link dataStructures.nothing}.
 */
Nothing.of = Nothing;

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.nothing} delegate or not. Available on the
 * {@link left}'s factory function as dataStructures.Nothing#is
 * @memberOf dataStructures.Nothing
 * @function is
 * @param {*} [n] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.nothing} delegate.
 */
Nothing.is = n => nothing === n;

//TODO: Using this.of in order to create a new instance of a Maybe container (functor/monad) will
//TODO: not work as it is implemented here in terms of creating a new maybe container with the
//TODO: proper values for the '.isJust' and '.isNothing' fields. The problem is that the '.of'
//TODO: function property will create a new maybe instance with whatever value it receives as
//TODO: as argument and treat the new maybe container instance as a 'Just', regardless of the
//TODO: actual underlying value. As 'null' and 'undefined' underlying values are traditionally
//TODO: treated as 'Nothing' maybe values, this will cause a problem during mapping/flat-mapping/etc.

/**
 * @typedef {Object} just
 * @property {function} value - returns the underlying value of the the monad
 * @property {function} map - maps a single function over the underlying value of the monad
 * @property {function} bimap
 * @property {function} extract
 * @property {function} valueOf - returns the underlying value of the monad; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the just monad and its underlying value
 * @property {function} factory - a reference to the just factory function
 * @property {function} [Symbol.Iterator] - Iterator for the just monad
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace just
 * @description This is the delegate object that specifies the behavior of the just monad. All
 * operations that may be performed on an just monad 'instance' delegate to this object. Just
 * monad 'instances' are created by the {@link dataStructures.Just|dataStructures.Nothing} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an right monad delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var just = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an right delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of a right delegator,
     * see {@link dataStructures.just#map} and {@link dataStructures.just#bimap}. To
     * retrieve the underlying value of a right delegator, see {@link dataStructures.just#get},
     * {@link dataStructures.just#orElse}, {@link dataStructures.just#getOrElse},
     * and {@link dataStructures.just#valueOf}.
     * @memberOf dataStructures.just
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    get extract() {
        return this.value;
    },
    /**
     * @signature () -> {@link dataStructures.just}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link dataStructures.just}
     * delegator instance.
     * @memberOf dataStructures.just
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.just}.
     * @return {dataStructures.just} Returns a new {@link dataStructures.just}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: sharedMaybeFns.justMap,
    chain: chain,
    mjoin: mjoin,
    apply: monad_apply,
    /**
     * @signature (* -> *) -> (* -> *) -> dataStructures.just<T>
     * @description Acts as a map for the disjunction between a just and a nothing monad. If the
     * monad is a just, the first mapping function parameter is used to map over the underlying value
     * and a new just is returned, 'wrapping' the return value of the function. If the monad is a nothing,
     * the second mapping function is invoked with a 'null' valued argument and a new nothing monad is
     * returned.
     * @memberOf dataStructures.just
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link dataStructures.just} delegator.
     * @param {function} g - A function that will be used to map over a null value if this is a
     * nothing monad.
     * @return {dataStructures.just} - Returns a new {@link dataStructures.just} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: sharedMaybeFns.justBimap,
    fold: function _fold(fn, acc) {
        return fn(acc, this.value);
    },
    sequence: function _sequence(p) {
        return this.traverse(identity, p);
    },
    traverse: function _traverse(a, f) {
        return f(this.value).map(this.factory.of);
    },
    nothing: function _nothing() {
        return Nothing();
    },
    /**
     * @signature * -> boolean
     * @description Determines if 'this' just monad is equal to another monad. Equality
     * is defined as:
     * 1) The other functor shares the same delegate object as 'this' just monad
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.just
     * @instance
     * @function
     * @param {Object} ma - The other monad to check for equality with 'this' monad.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: disjunctionEqualMaker('isJust'),
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.just
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
     * underlying value
     * @memberOf dataStructures.just
     * @instance
     * @function
     * @return {string} Returns a string representation of the just
     * and its underlying value.
     */
    toString: stringMaker('Just'),
    get [Symbol.toStringTag]() {
        return 'Just';
    },
    /**
     * @signature * -> {@link dataStructures.just}
     * @description Factory function used to create a new object that delegates to
     * the {@link dataStructures.just} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link dataStructures.just}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf dataStructures.just
     * @instance
     * @function
     * @see dataStructures.Maybe
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link dataStructures.just}.
     * @return {dataStructures.just} - Returns a new identity functor delegator
     */
    factory: Maybe
};

/**
 * @typedef {Object} nothing
 * @property {function} value - returns the underlying value of the the monad
 * @property {function} map - maps a single function over the underlying value of the monad
 * @property {function} bimap
 * @property {function} extract
 * @property {function} valueOf - returns the underlying value of the monad; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the nothing monad and its underlying value
 * @property {function} factory - a reference to the nothing factory function
 * @property {function} [Symbol.Iterator] - Iterator for the nothing
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace nothing
 * @description This is the delegate object that specifies the behavior of the nothing monad. All
 * operations that may be performed on an nothing monad 'instance' delegate to this object. Nothing
 * monad 'instances' are created by the {@link dataStructures.Nothing|dataStructures.Maybe} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an nothing monad delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var nothing = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of a nothing monad delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an identity_functor delegator,
     * see {@link dataStructures.nothing#map} and {@link dataStructures.nothing#bimap}.
     * To retrieve the underlying value of an nothing monad delegator, see {@link dataStructures.nothing#get},
     * {@link dataStructures.nothing#orElse}, {@link dataStructures.nothing#getOrElse},
     * and {@link dataStructures.nothing#valueOf}.
     * @memberOf dataStructures.nothing
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    value: null,
    /**
     *
     */
    isJust: false,
    /**
     *
     */
    isNothing: true,
    /**
     * @signature () -> {@link dataStructures.nothing}
     * @description Takes a function that is applied to the underlying value of the
     * monad, the result of which is used to create a new {@link dataStructures.nothing}
     * delegator instance.
     * @memberOf dataStructures.nothing
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.nothing}.
     * @return {dataStructures.nothing} Returns a new {@link dataStructures.nothing}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: returnNothing,
    /**
     * @signature (* -> *) -> (* -> *) -> dataStructures.nothing<T>
     * @description Since the nothing monad does not represent a disjunction, the Maybe's
     * bimap function property behaves just as its map function property. It is merely here as a
     * convenience so that swapping out monads does not break an application that is
     * relying on its existence.
     * @memberOf dataStructures.nothing
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link dataStructures.nothing} delegator.
     * @param {function} [g] - An optional function that is simply ignored on the {@link dataStructures.nothing}
     * since there is no disjunction present.
     * @return {dataStructures.nothing} - Returns a new {@link dataStructures.nothing} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: returnNothing,
    chain: returnNothing,
    mjoin: returnNothing,
    apply: monad_apply,
    fold: function _fold(fn) {
        return Nothing();
    },
    sequence: function _sequence(p) {
        return this.traverse(p, p.of);
    },
    traverse: function _traverse(a, f) {
        return a.of(Maybe.Nothing());
    },
    nothing: returnNothing,
    /**
     * @signature * -> boolean
     * @description Determines if 'this' left functor is equal to another monad. Equality
     * is defined as:
     * 1) The other monad shares the same delegate object as 'this' nothing monad
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.nothing
     * @instance
     * @function
     * @param {Object} ma - The other monad to check for equality with 'this' monad.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: Nothing.is,
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.nothing
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
     * underlying value
     * @memberOf dataStructures.nothing
     * @instance
     * @function
     * @return {string} Returns a string representation of the nothing
     * and its underlying value.
     */
    toString: function _toString() {
        return 'Nothing()';
    },
    get [Symbol.toStringTag]() {
        return 'Nothing';
    },
    /**
     * @signature * -> {@link dataStructures.nothing}
     * @description Factory function used to create a new object that delegates to
     * the {@link dataStructures.nothing} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link dataStructures.nothing}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf dataStructures.nothing
     * @instance
     * @function
     * @see dataStructures.Maybe
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link dataStructures.nothing}.
     * @return {dataStructures.nothing} - Returns a new nothing monad delegator
     */
    factory: Maybe
};

just.ap = just.apply;
just.fmap = just.chain;
just.flapMap = just.chain;
just.bind = just.chain;
just.reduce = just.fold;

nothing.ap = nothing.apply;
nothing.fmap = nothing.chain;
nothing.flapMap = nothing.chain;
nothing.bind = nothing.chain;
nothing.reduce = nothing.fold;

just.constructor = just.factory;
nothing.constructor = nothing.factory;

export { Maybe, Just, Nothing, just, nothing };