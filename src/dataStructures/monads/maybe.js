import { identity } from '../../combinators';
import { apply, chain, mjoin, disjunctionEqualMaker, maybeFactoryHelper, pointMaker, stringMaker,
    get, emptyGet, orElse, emptyOrElse, getOrElse, emptyGetOrElse, valueOf, sharedMaybeFns } from '../dataStructureHelpers';

/**
 * @signature
 * @description Returns an either functor based on a loose equals null comparison. If
 * the argument passed to the function loose equals null, a left is returned; other wise,
 * a right.
 * @private
 * @param {*} x - Any value that should be placed inside an either functor.
 * @return {monads.just|monads.nothing} - Either a left or a right functor
 */
function fromNullable(x) {
    return null != x ? Just(x) : Nothing();
}

/**
 * @signature - :: * -> monads.just|monads.nothing
 * @description Factory function used to create a new object that delegates to
 * the {@link monads.just|monads.nothing} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link monads.just|monads.nothing}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Maybe
 * @memberOf monads
 * @property {function} of
 * @property {function} is
 * @property {function} isJust
 * @property {function} isNothing
 * @property {function} Just
 * @property {function} Nothing
 * @property {function} fromNullable
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link monads.just|monads.nothing}.
 * @return {monads.just|monads.nothing} - Returns a new object that delegates to the
 * {@link monads.just|monads.nothing}.
 */
function Maybe(val) {
    return null == val ?
        Object.create(nothing, {
            _value: {
                value: null
            },
            isJust: {
                value: false
            },
            isNothing: {
                value: true
            }
        }) :
        Object.create(just, {
            _value: {
                value: val
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
 * @signature * -> {@link monads.just}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link monads.just} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link monads.just}
 * @memberOf monads.Maybe
 * @static
 * @function of
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link monads.just}.
 * @return {monads.just} - Returns a new object that delegates to the
 * {@link monads.just}.
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
 * {@link monads.just|monads.just} delegate or not. Available on the
 * {@link monads.just|monads.nothing}'s factory function as monads.Maybe#is
 * @memberOf monads.Maybe
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link monads.just|monads.nothing} delegate.
 */
Maybe.is = f => just.isPrototypeOf(f) || nothing.isPrototypeOf(f);

/**
 * @signature
 * @description Alias for {@link monads.Maybe.of}
 * @memberOf monads.Maybe
 * @function Just
 * @param {*} val - a
 * @return {just} - {@link monads.just}
 */
Maybe.Just = Maybe.of;

/**
 * @signature
 * @description Creates and returns a new {@link monads.nothing} monad
 * @memberOf monads.Maybe
 * @function Nothing
 * @return {monads.nothing} A new {@link monads.nothing}
 */
Maybe.Nothing = () => Maybe();

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'just' monad.
 * @memberOf monads.Maybe
 * @function is
 * @param {Object} [m] - a
 * @return {boolean} - b
 */
Maybe.isJust = m => just.isPrototypeOf(m);

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'nothing' monad.
 * @memberOf monads.Maybe
 * @function is
 * @param {Object} [m] - a
 * @return {boolean} - b
 */
Maybe.isNothing = m => nothing.isPrototypeOf(m);

/**
 * @signature * -> monads.left|monads.right
 * @description Takes any value and returns a 'nothing' monad is the value
 * loose equals null; other wise returns a 'just' monad.
 * @memberOf monads.Maybe
 * @function is
 * @param {*} [x] - a
 * @return {monads.left|monads.right} - b
 */
Maybe.fromNullable = fromNullable;

//TODO: determine if there is any purpose in splitting a maybe into two types... if those sub-types
//TODO: are not exposed, what benefit is derived from them? And if they are exposed (Just being Identity,
//TODO: and Nothing being Constant(null)), then the maybe container has a direct dependency on the Identity
//TODO: and Constant containers. This becomes an issue due to circular dependencies.
/**
 * @signature - :: * -> monads.just
 * @description Factory function used to create a new object that delegates to
 * the {@link monads.just} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link monads.just}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Just
 * @memberOf monads
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link monads.just}.
 * @return {monads.just} - Returns a new object that delegates to the
 * {@link monads.just}.
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
 * @signature * -> {@link monads.just}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link monads.just} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link monads.Just}
 * @memberOf monads.Just
 * @static
 * @function of
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link monads.just}.
 * @return {monads.just} - Returns a new object that delegates to the
 * {@link monads.just}.
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
 * {@link monads.just} delegate or not. Available on the
 * {@link monads.just}'s factory function as monads.Right#is
 * @memberOf monads.Just
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link monads.just} delegate.
 */
Just.is = f => just.isPrototypeOf(f);

/**
 * @signature - :: * -> monads.nothing
 * @description Factory function used to create a new object that delegates to
 * the {@link monads.nothing} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link monads.nothing}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Nothing
 * @memberOf monads
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @return {monads.nothing} - Returns a new object that delegates to the
 * {@link monads.nothing}.
 */
function Nothing() {
    return Object.create(nothing, {
        _value: {
            value: null,
            writable: false,
            configurable: false
        },
        isJust: {
            value: false
        },
        isNothing: {
            value: true
        }
    });
}

/**
 * @signature * -> {@link monads.nothing}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link monads.nothing} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link monads.Nothing}
 * @memberOf monads.Nothing
 * @static
 * @function of
 * @return {monads.nothing} - Returns a new object that delegates to the
 * {@link monads.nothing}.
 */
Nothing.of = Nothing;

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link monads.nothing} delegate or not. Available on the
 * {@link left}'s factory function as monads.Nothing#is
 * @memberOf monads.Nothing
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link monads.nothing} delegate.
 */
Nothing.is = f => nothing.isPrototypeOf(f);

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
 * @property {function} get - returns the underlying value of the monad
 * @property {function} orElse - returns the underlying value of the monad
 * @property {function} getOrElse - returns the underlying value of the monad
 * @property {function} of - creates a new right delegate with the value provided
 * @property {function} valueOf - returns the underlying value of the monad; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the just monad and its underlying value
 * @property {function} factory - a reference to the just factory function
 * @property {function} [Symbol.Iterator] - Iterator for the just monad
 * @kind {Object}
 * @memberOf monads
 * @namespace just
 * @description This is the delegate object that specifies the behavior of the just monad. All
 * operations that may be performed on an just monad 'instance' delegate to this object. Just
 * monad 'instances' are created by the {@link monads.Just|monads.Nothing} factory function via Object.create,
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
     * see {@link monads.just#map} and {@link monads.just#bimap}. To
     * retrieve the underlying value of a right delegator, see {@link monads.just#get},
     * {@link monads.just#orElse}, {@link monads.just#getOrElse},
     * and {@link monads.just#valueOf}.
     * @memberOf monads.just
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    /**
     * @signature () -> {@link monads.just}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link monads.just}
     * delegator instance.
     * @memberOf monads.just
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link monads.just}.
     * @return {monads.just} Returns a new {@link monads.just}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: sharedMaybeFns.justMap,
    chain: chain,
    mjoin: mjoin,
    apply: apply,
    /**
     * @signature (* -> *) -> (* -> *) -> monads.just<T>
     * @description Acts as a map for the disjunction between a just and a nothing monad. If the
     * monad is a just, the first mapping function parameter is used to map over the underlying value
     * and a new just is returned, 'wrapping' the return value of the function. If the monad is a nothing,
     * the second mapping function is invoked with a 'null' valued argument and a new nothing monad is
     * returned.
     * @memberOf monads.just
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link monads.just} delegator.
     * @param {function} g - A function that will be used to map over a null value if this is a
     * nothing monad.
     * @return {monads.just} - Returns a new {@link monads.just} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: sharedMaybeFns.justBimap,
    fold: function _fold(fn) {
        return fn(this.value);
    },
    sequence: function _sequence(p) {
        return this.traverse(identity, p);
    },
    traverse: function _traverse(a, f, g) {
        return f(this.value).map(this.of);
    },
    nothing: function _nothing() {
        return Nothing();
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'.
     * @memberOf monads.just
     * @instance
     * @function
     * @return {*} - Returns the underlying value of the current monad 'instance'.
     */
    get: get,
    /**
     * @signature * -> *
     * @description Takes an optional parameter of any value as a default return value in
     * cases where the current functor 'instance\'s' underlying value is not 'mappable'.
     * Because the identity_functor does not support disjunctions, the parameter is entirely
     * optional and will always be ignored. Whatever the actual underlying value is, it will
     * always be returned.
     * @memberOf monads.just
     * @instance
     * @function
     * @param {*} [x] - a
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    getOrElse: getOrElse,
    /**
     * @signature () -> *
     * @description Takes an optional function parameter as a default to be invoked and
     * returned in cases where the current functor 'instance\'s' underlying value is not
     * 'mappable'. Because the identity_functor does not support disjunctions, the
     * parameter is entirely optional and will always be ignored. Whatever the actual
     * underlying value is, it will always be returned.
     * @memberOf monads.just
     * @instance
     * @function
     * @param {function} [f] - An optional function argument which is invoked and the result
     * returned in cases where the underlying value is not 'mappable'.
     * @return {*} - b
     */
    orElse: orElse,
    /**
     * @signature * -> {@link monads.just}
     * @description Factory function used to create a new object that delegates to
     * the {@link monads.just} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link monads.just}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf monads.just
     * @instance
     * @function
     * @param {*} item - The value that should be set as the underlying
     * value of the {@link monads.just}.
     * @return {monads.just} Returns a new {@link monads.just} delegator object
     * via the {@link monads.Maybe#of} function.
     */
    of: pointMaker(Just),
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf monads.just
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
     * underlying value
     * @memberOf monads.just
     * @instance
     * @function
     * @return {string} Returns a string representation of the just
     * and its underlying value.
     */
    toString: stringMaker('Just'),
    /**
     * @signature * -> {@link monads.just}
     * @description Factory function used to create a new object that delegates to
     * the {@link monads.just} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link monads.just}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf monads.just
     * @instance
     * @function
     * @see monads.Maybe
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link monads.just}.
     * @return {monads.just} - Returns a new identity functor delegator
     */
    factory: Maybe
};

/**
 * @signature * -> boolean
 * @description Determines if 'this' just monad is equal to another monad. Equality
 * is defined as:
 * 1) The other functor shares the same delegate object as 'this' just monad
 * 2) Both underlying values are strictly equal to each other
 * @memberOf monads.just
 * @instance
 * @function
 * @param {Object} ma - The other monad to check for equality with 'this' monad.
 * @return {boolean} - Returns a boolean indicating equality
 */
just.equals = disjunctionEqualMaker(just, 'isJust');

/**
 * @typedef {Object} nothing
 * @property {function} value - returns the underlying value of the the monad
 * @property {function} map - maps a single function over the underlying value of the monad
 * @property {function} bimap
 * @property {function} get - returns the underlying value of the monad
 * @property {function} orElse - returns the underlying value of the monad
 * @property {function} getOrElse - returns the underlying value of the monad
 * @property {function} of - creates a new nothing delegate with the value provided
 * @property {function} valueOf - returns the underlying value of the monad; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the nothing monad and its underlying value
 * @property {function} factory - a reference to the nothing factory function
 * @property {function} [Symbol.Iterator] - Iterator for the nothing
 * @kind {Object}
 * @memberOf monads
 * @namespace nothing
 * @description This is the delegate object that specifies the behavior of the nothing monad. All
 * operations that may be performed on an nothing monad 'instance' delegate to this object. Nothing
 * monad 'instances' are created by the {@link monads.Nothing|monads.Maybe} factory function via Object.create,
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
     * see {@link monads.nothing#map} and {@link monads.nothing#bimap}.
     * To retrieve the underlying value of an nothing monad delegator, see {@link monads.nothing#get},
     * {@link monads.nothing#orElse}, {@link monads.nothing#getOrElse},
     * and {@link monads.nothing#valueOf}.
     * @memberOf monads.nothing
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    /**
     * @signature () -> {@link monads.nothing}
     * @description Takes a function that is applied to the underlying value of the
     * monad, the result of which is used to create a new {@link monads.nothing}
     * delegator instance.
     * @memberOf monads.nothing
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link monads.nothing}.
     * @return {monads.nothing} Returns a new {@link monads.nothing}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: sharedMaybeFns.nothingMapMaker(Nothing),
    /**
     * @signature (* -> *) -> (* -> *) -> monads.nothing<T>
     * @description Since the nothing monad does not represent a disjunction, the Maybe's
     * bimap function property behaves just as its map function property. It is merely here as a
     * convenience so that swapping out monads does not break an application that is
     * relying on its existence.
     * @memberOf monads.nothing
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link monads.nothing} delegator.
     * @param {function} [g] - An optional function that is simply ignored on the {@link monads.nothing}
     * since there is no disjunction present.
     * @return {monads.nothing} - Returns a new {@link monads.nothing} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: sharedMaybeFns.nothingBimapMaker(Nothing),
    chain: chain,
    mjoin: mjoin,
    apply: apply,
    fold: function _fold(fn) {
        return Nothing();
    },
    sequence: function _sequence(a) {
        return this.traverse(identity, a);
    },
    traverse: function _traverse(a, f) {
        return a.of(Maybe.Nothing());
    },
    nothing: function _nothing() {
        return Nothing();
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'.
     * @memberOf monads.nothing
     * @instance
     * @function
     * @return {*} - Returns the underlying value of the current monad 'instance'.
     */
    get: emptyGet,
    /**
     * @signature * -> *
     * @description Takes an optional parameter of any value as a default return value in
     * cases where the current monad 'instance\'s' underlying value is not 'mappable'.
     * Because the left does not support disjunctions, the parameter is entirely
     * optional and will always be ignored. Whatever the actual underlying value is, it will
     * always be returned.
     * @memberOf monads.nothing
     * @instance
     * @function
     * @param {*} [x] - a
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    getOrElse: emptyGetOrElse,
    /**
     * @signature () -> *
     * @description Takes an optional function parameter as a default to be invoked and
     * returned in cases where the current monad 'instance\'s' underlying value is not
     * 'mappable'. Because the nothing monad does not support disjunctions, the
     * parameter is entirely optional and will always be ignored. Whatever the actual
     * underlying value is, it will always be returned.
     * @memberOf monads.nothing
     * @instance
     * @function
     * @param {function} [f] - An optional function argument which is invoked and the result
     * returned in cases where the underlying value is not 'mappable'.
     * @return {*} - b
     */
    orElse: emptyOrElse,
    /**
     * @signature * -> {@link monads.nothing}
     * @description Factory function used to create a new object that delegates to
     * the {@link monads.nothing} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link monads.nothing}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf monads.nothing
     * @instance
     * @function
     * @param {*} item - The value that should be set as the underlying
     * value of the {@link monads.nothing}.
     * @return {monads.nothing} Returns a new {@link monads.nothing} delegator object
     * via the {@link monads.Maybe#of} function.
     */
    of: pointMaker(Just),
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf monads.nothing
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
     * underlying value
     * @memberOf monads.nothing
     * @instance
     * @function
     * @return {string} Returns a string representation of the nothing
     * and its underlying value.
     */
    toString: function _toString() {
        return 'Nothing()';
    },
    /**
     * @signature * -> {@link monads.nothing}
     * @description Factory function used to create a new object that delegates to
     * the {@link monads.nothing} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link monads.nothing}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf monads.nothing
     * @instance
     * @function
     * @see monads.Maybe
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link monads.nothing}.
     * @return {monads.nothing} - Returns a new nothing monad delegator
     */
    factory: Maybe
};

/**
 * @signature * -> boolean
 * @description Determines if 'this' left functor is equal to another monad. Equality
 * is defined as:
 * 1) The other monad shares the same delegate object as 'this' nothing monad
 * 2) Both underlying values are strictly equal to each other
 * @memberOf monads.nothing
 * @instance
 * @function
 * @param {Object} ma - The other monad to check for equality with 'this' monad.
 * @return {boolean} - Returns a boolean indicating equality
 */
nothing.equals = disjunctionEqualMaker(nothing, 'isNothing');

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

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
//maybe_functor.constructor = maybe_functor.factory;
just.constructor = just.factory;
nothing.constructor = nothing.factory;

export { Maybe, Just, Nothing, just, nothing };