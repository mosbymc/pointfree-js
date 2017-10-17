import { identity, constant } from '../../combinators';
import { stringMaker, valueOf } from '../data_structure_util';

/**
 * @signature
 * @description Returns an either functor based on a loose equals null comparison. If
 * the argument passed to the function loose equals null, a left is returned; other wise,
 * a right.
 * @private
 * @param {*} [x] - Any value that should be placed inside an either functor.
 * @return {dataStructures.lazy_just|dataStructures.lazy_nothing} - Either a left or a right functor
 */
function fromNullable(x) {
    return null != x ? LazyJust(x) : LazyNothing();
}

var returnNothing = () => lazy_nothing;


/**
 * @signature - :: * -> dataStructures.lazy_just|dataStructures.nothing
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.lazy_just|dataStructures.lazy_nothing} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.just|dataStructures.lazy_nothing}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace LazyMaybe
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
 * value of the {@link dataStructures.lazy_just|dataStructures.lazy_nothing}.
 * @return {dataStructures.lazy_just|dataStructures.lazy_nothing} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_just|dataStructures.lazy_nothing}.
 */
function LazyMaybe(val) {
    let fn = constant(val);
    return null == val ?
        lazy_nothing :
        Object.create(lazy_just, {
            _value: {
                value: fn
            },
            _source: {
                value: fn,
                writable: false,
                configurable: false
            }
        });
}

/**
 * @signature * -> {@link dataStructures.lazy_just}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.lazy_just} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.lazy_just}
 * @memberOf dataStructures.LazyMaybe
 * @static
 * @function of
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.lazy_just}.
 * @return {dataStructures.lazy_just} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_just}.
 */
LazyMaybe.of = function _of(val) {
    return Object.create(lazy_just, {
        _value: {
            value: constant(val),
            writable: false,
            configurable: false
        },
        _source: {
            value: constant(val),
            writable: false,
            configurable: false
        }
    });
};

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.just|dataStructures.just} delegate or not. Available on the
 * {@link dataStructures.just|dataStructures.lazy_nothing}'s factory function as dataStructures.Maybe#is
 * @memberOf dataStructures.LazyMaybe
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.just|dataStructures.lazy_nothing} delegate.
 */
LazyMaybe.is = f => lazy_just.isPrototypeOf(f) || lazy_nothing === f;

/**
 * @signature
 * @description Alias for {@link dataStructures.LazyMaybe.of}
 * @memberOf dataStructures.LazyMaybe
 * @function Just
 * @param {*} val - a
 * @return {just} - {@link dataStructures.lazy_just}
 */
LazyMaybe.Just = LazyMaybe.of;

/**
 * @signature
 * @description Creates and returns a new {@link dataStructures.lazy_nothing} data structure
 * @memberOf dataStructures.LazyMaybe
 * @function LazyNothing
 * @return {dataStructures.lazy_nothing} A new {@link dataStructures.lazy_nothing}
 */
LazyMaybe.Nothing = () => LazyMaybe();

LazyMaybe.empty = () => returnNothing();

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'just' data structure.
 * @memberOf dataStructures.LazyMaybe
 * @function is
 * @param {Object} [m] - a
 * @return {boolean} - b
 */
LazyMaybe.isJust = m => lazy_just.isPrototypeOf(m);

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'nothing' monad.
 * @memberOf dataStructures.LazyMaybe
 * @function is
 * @param {Object} [m] - a
 * @return {boolean} - b
 */
LazyMaybe.isNothing = m => lazy_nothing === m;

/**
 * @signature * -> dataStructures.lazy_just|dataStructures.lazy_nothing
 * @description Takes any value and returns a 'nothing' data structure is the value
 * loose equals null; other wise returns a 'just' data structure.
 * @memberOf dataStructures.LazyMaybe
 * @function is
 * @param {*} [x] - a
 * @return {dataStructures.lazy_just|dataStructures.lazy_nothing} - b
 */
LazyMaybe.fromNullable = fromNullable;

LazyMaybe.lift = function lift(fn) {
    return function _args(...args) {
        return LazyMaybe.of(fn(...args));
    };
};

//TODO: determine if there is any purpose in splitting a maybe into two types... if those sub-types
//TODO: are not exposed, what benefit is derived from them? And if they are exposed (Just being Identity,
//TODO: and Nothing being Constant(null)), then the maybe container has a direct dependency on the Identity
//TODO: and Constant containers. This becomes an issue due to circular dependencies.
/**
 * @signature - :: * -> dataStructures.lazy_just
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.lazy_just} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.lazy_just}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace LazyJust
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.lazy_just}.
 * @return {dataStructures.lazy_just} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_just}.
 */
function LazyJust(val) {
    var fn = constant(val);
    return Object.create(lazy_just, {
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
 * @signature * -> {@link dataStructures.lazy_just}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.lazy_just} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.LazyJust}
 * @memberOf dataStructures.LazyJust
 * @static
 * @function of
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.lazy_just}.
 * @return {dataStructures.lazy_just} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_just}.
 */
LazyJust.of = function _of(val) {
    var fn = constant(val);
    return Object.create(lazy_just, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        _source: {
            value: fn,
            writable: false,
            configurable: false
        }
    });
};

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.lazy_just} delegate or not. Available on the
 * {@link dataStructures.lazy_just}'s factory function as dataStructures.Right#is
 * @memberOf dataStructures.LazyJust
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.lazy_just} delegate.
 */
LazyJust.is = f => lazy_just.isPrototypeOf(f);

/**
 * @signature - :: * -> dataStructures.lazy_nothing
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.lazy_nothing} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.lazy_nothing}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace LazyNothing
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @return {dataStructures.lazy_nothing} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_nothing}.
 */
var LazyNothing = returnNothing;

/**
 * @signature * -> {@link dataStructures.lazy_nothing}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.lazy_nothing} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.LazyNothing}
 * @memberOf dataStructures.LazyNothing
 * @static
 * @function of
 * @return {dataStructures.lazy_nothing} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_nothing}.
 */
LazyNothing.of = LazyNothing;

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.lazy_nothing} delegate or not. Available on the
 * {@link left}'s factory function as dataStructures.LazyNothing#is
 * @memberOf dataStructures.LazyNothing
 * @function is
 * @param {*} [n] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.lazy_nothing} delegate.
 */
LazyNothing.is = n => lazy_nothing === n;

//TODO: Using this.of in order to create a new instance of a Maybe container (functor/monad) will
//TODO: not work as it is implemented here in terms of creating a new maybe container with the
//TODO: proper values for the '.isJust' and '.isNothing' fields. The problem is that the '.of'
//TODO: function property will create a new maybe instance with whatever value it receives as
//TODO: as argument and treat the new maybe container instance as a 'Just', regardless of the
//TODO: actual underlying value. As 'null' and 'undefined' underlying values are traditionally
//TODO: treated as 'Nothing' maybe values, this will cause a problem during mapping/flat-mapping/etc.


var next = fn => Object.create(lazy_just, {
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
 * @typedef {Object} lazy_just
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
 * @memberOf dataStructures
 * @namespace lazy_just
 * @description This is the delegate object that specifies the behavior of the just monad. All
 * operations that may be performed on an just monad 'instance' delegate to this object. Just
 * monad 'instances' are created by the {@link dataStructures.LazyJust|dataStructures.LazyNothing} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an right monad delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var lazy_just = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an right delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of a right delegator,
     * see {@link dataStructures.lazy_just#map} and {@link dataStructures.lazy_just#bimap}. To
     * retrieve the underlying value of a right delegator, see {@link dataStructures.lazy_just#get},
     * {@link dataStructures.lazy_just#orElse}, {@link dataStructures.lazy_just#getOrElse},
     * and {@link dataStructures.lazy_just#valueOf}.
     * @memberOf dataStructures.lazy_just
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
    isJust: true,
    isNothing: false,
    isEmpty: false,
    /**
     * @signature () -> {@link dataStructures.lazy_just}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link dataStructures.lazy_just}
     * delegator instance.
     * @memberOf dataStructures.lazy_just
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.lazy_just}.
     * @return {dataStructures.lazy_just} Returns a new {@link dataStructures.lazy_just}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: function _map(fn) {
        return next(() => fn(this.value));
    },
    chain: function _chain(fn) {
        return next(() => {
            let val = fn(this.value);
            return Object.getPrototypeOf(this).isPrototypeOf(val) ? val.value : val;
        });
    },
    mjoin: function _mjoin() {
        return next(() => Object.getPrototypeOf(this).isPrototypeOf(this.value) ? this.value.value : this.value);
    },
    apply: function _apply(ma) {
        return ma.map(this.value);
    },
    /**
     * @signature (* -> *) -> (* -> *) -> dataStructures.lazy_just<T>
     * @description Acts as a map for the disjunction between a just and a nothing monad. If the
     * monad is a just, the first mapping function parameter is used to map over the underlying value
     * and a new just is returned, 'wrapping' the return value of the function. If the monad is a nothing,
     * the second mapping function is invoked with a 'null' valued argument and a new nothing monad is
     * returned.
     * @memberOf dataStructures.lazy_just
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link dataStructures.lazy_just} delegator.
     * @param {function} g - A function that will be used to map over a null value if this is a
     * nothing monad.
     * @return {dataStructures.lazy_just} - Returns a new {@link dataStructures.lazy_just} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: function _map(f, g) {
        return next(() => f(this.value));
    },
    contramap: function contramap(fn) {
        return next(() => (...args) => this.value(fn(...args)));
    },
    fold: function _fold(fn, acc) {
        return fn(acc, this.value);
    },
    sequence: function _sequence(p) {
        return this.traverse(identity, p);
    },
    traverse: function _traverse(a, f) {
        return f(this.value).map(this.factory.of);
    },
    /**
     * @signature * -> boolean
     * @description Determines if 'this' just monad is equal to another monad. Equality
     * is defined as:
     * 1) The other functor shares the same delegate object as 'this' just monad
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.lazy_just
     * @instance
     * @function
     * @param {Object} ma - The other monad to check for equality with 'this' monad.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: function _equals(ma) {
        return !!(ma && ma.isJust && Object.getPrototypeOf(this).isPrototypeOf(ma));
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.lazy_just
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
     * underlying value
     * @memberOf dataStructures.lazy_just
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
     * @signature * -> {@link dataStructures.lazy_just}
     * @description Factory function used to create a new object that delegates to
     * the {@link dataStructures.lazy_just} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link dataStructures.lazy_just}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf dataStructures.lazy_just
     * @instance
     * @function
     * @see dataStructures.LazyMaybe
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link dataStructures.lazy_just}.
     * @return {dataStructures.lazy_just} - Returns a new identity functor delegator
     */
    factory: LazyMaybe,
    [Symbol.iterator]: function *_iterator() {
        yield this.value;
    }
};

/**
 * @typedef {Object} lazy_nothing
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
 * @memberOf dataStructures
 * @namespace lazy_nothing
 * @description This is the delegate object that specifies the behavior of the nothing monad. All
 * operations that may be performed on an nothing monad 'instance' delegate to this object. Nothing
 * monad 'instances' are created by the {@link dataStructures.LazyNothing|dataStructures.LazyMaybe} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an nothing monad delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var lazy_nothing = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of a nothing monad delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an identity_functor delegator,
     * see {@link dataStructures.lazy_nothing#map} and {@link dataStructures.lazy_nothing#bimap}.
     * To retrieve the underlying value of an nothing monad delegator, see {@link dataStructures.lazy_nothing#get},
     * {@link dataStructures.lazy_nothing#orElse}, {@link dataStructures.lazy_nothing#getOrElse},
     * and {@link dataStructures.lazy_nothing#valueOf}.
     * @memberOf dataStructures.lazy_nothing
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
    isEmpty: true,
    /**
     * @signature () -> {@link dataStructures.lazy_nothing}
     * @description Takes a function that is applied to the underlying value of the
     * monad, the result of which is used to create a new {@link dataStructures.lazy_nothing}
     * delegator instance.
     * @memberOf dataStructures.lazy_nothing
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.lazy_nothing}.
     * @return {dataStructures.lazy_nothing} Returns a new {@link dataStructures.lazy_nothing}
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
     * @memberOf dataStructures.lazy_nothing
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link dataStructures.lazy_nothing} delegator.
     * @param {function} [g] - An optional function that is simply ignored on the {@link dataStructures.lazy_nothing}
     * since there is no disjunction present.
     * @return {dataStructures.lazy_nothing} - Returns a new {@link dataStructures.lazy_nothing} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: returnNothing,
    chain: returnNothing,
    mjoin: returnNothing,
    apply: returnNothing,
    fold: returnNothing,
    sequence: function _sequence(p) {
        return this.traverse(p, p.of);
    },
    traverse: function _traverse(a, f) {
        return a.of(LazyMaybe.Nothing());
    },
    /**
     * @signature * -> boolean
     * @description Determines if 'this' left functor is equal to another monad. Equality
     * is defined as:
     * 1) The other monad shares the same delegate object as 'this' nothing monad
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.lazy_nothing
     * @instance
     * @function
     * @param {Object} ma - The other monad to check for equality with 'this' monad.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: LazyNothing.is,
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.lazy_nothing
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
     * underlying value
     * @memberOf dataStructures.lazy_nothing
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
     * @signature * -> {@link dataStructures.lazy_nothing}
     * @description Factory function used to create a new object that delegates to
     * the {@link dataStructures.lazy_nothing} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link dataStructures.lazy_nothing}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf dataStructures.lazy_nothing
     * @instance
     * @function
     * @see dataStructures.LazyMaybe
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link dataStructures.lazy_nothing}.
     * @return {dataStructures.lazy_nothing} - Returns a new nothing monad delegator
     */
    factory: LazyMaybe,
    [Symbol.iterator]: function *_iterator() {
        yield this.value;
    }
};

lazy_just.ap = lazy_just.apply;
lazy_just.fmap = lazy_just.chain;
lazy_just.flapMap = lazy_just.chain;
lazy_just.bind = lazy_just.chain;
lazy_just.reduce = lazy_just.fold;

lazy_nothing.ap = lazy_nothing.apply;
lazy_nothing.fmap = lazy_nothing.chain;
lazy_nothing.flapMap = lazy_nothing.chain;
lazy_nothing.bind = lazy_nothing.chain;
lazy_nothing.reduce = lazy_nothing.fold;

lazy_just.constructor = lazy_just.factory;
lazy_nothing.constructor = lazy_nothing.factory;

export { LazyMaybe, LazyJust, LazyNothing, lazy_just, lazy_nothing };