import { identity, constant } from '../../combinators';
import { stringMaker, valueOf } from '../data_structure_util';

/**
 * @signature
 * @description Returns an either functor based on a loose equals null comparison. If
 * the argument passed to the function loose equals null, a left is returned; other wise,
 * a right.
 * @private
 * @param {*} [x] - Any value that should be placed inside an either functor.
 * @return {dataStructures.lazy_right|dataStructures.lazy_left} - Either a left or a right functor
 */
function fromNullable(x) {
    return null != x ? LazyRight(x) : LazyRight();
}

function returnMe() {
    return this;
}


/**
 * @signature - :: * -> dataStructures.lazy_right|dataStructures.nothing
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.lazy_right|dataStructures.lazy_left} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.just|dataStructures.lazy_left}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace LazyEither
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
 * value of the {@link dataStructures.lazy_right|dataStructures.lazy_left}
 * @param {string} fork - A string indicating a left or right disjunction
 * @return {dataStructures.lazy_right|dataStructures.lazy_left} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_right|dataStructures.lazy_left}.
 */
function LazyEither(val, fork) {
    let fn = constant(val);
    return 'right' === fork ?
        Object.create(lazy_right, {
            _value: {
                value: fn
            },
            _source: {
                value: fn,
                writable: false,
                configurable: false
            }
        }) :
        Object.create(lazy_left, {
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
 * @signature * -> {@link dataStructures.lazy_right}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.lazy_right} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.lazy_right}
 * @memberOf dataStructures.LazyEither
 * @static
 * @function of
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.lazy_right}.
 * @return {dataStructures.lazy_right} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_right}.
 */
LazyEither.of = function _of(val) {
    return Object.create(lazy_right, {
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
 * {@link dataStructures.just|dataStructures.lazy_left}'s factory function as dataStructures.Maybe#is
 * @memberOf dataStructures.LazyEither
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.just|dataStructures.lazy_left} delegate.
 */
LazyEither.is = f => LazyRight.is(f) || LazyLeft.is(f);

/**
 * @signature
 * @description Alias for {@link dataStructures.LazyEither.of}
 * @memberOf dataStructures.LazyEither
 * @function Just
 * @param {*} val - a
 * @return {just} - {@link dataStructures.lazy_right}
 */
LazyEither.Right = LazyEither.of;

/**
 * @signature
 * @description Creates and returns a new {@link dataStructures.lazy_left} data structure
 * @memberOf dataStructures.LazyEither
 * @function LazyRight
 * @param {*} val - a
 * @return {dataStructures.lazy_left} A new {@link dataStructures.lazy_left}
 */
LazyEither.Left = (val) => LazyEither(val);

LazyEither.empty = () => LazyEither();

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'just' data structure.
 * @memberOf dataStructures.LazyEither
 * @function is
 * @param {Object} [m] - a
 * @return {boolean} - b
 */
LazyEither.isRight = m => m.isRight;

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'nothing' monad.
 * @memberOf dataStructures.LazyEither
 * @function is
 * @param {Object} [m] - a
 * @return {boolean} - b
 */
LazyEither.isLeft = m => m.isLeft;

/**
 * @signature * -> dataStructures.lazy_right|dataStructures.lazy_left
 * @description Takes any value and returns a 'nothing' data structure is the value
 * loose equals null; other wise returns a 'just' data structure.
 * @memberOf dataStructures.LazyEither
 * @function is
 * @param {*} [x] - a
 * @return {dataStructures.lazy_right|dataStructures.lazy_left} - b
 */
LazyEither.fromNullable = fromNullable;

LazyEither.lift = function lift(fn) {
    return function _args(...args) {
        return LazyEither.of(fn(...args));
    };
};

//TODO: determine if there is any purpose in splitting a maybe into two types... if those sub-types
//TODO: are not exposed, what benefit is derived from them? And if they are exposed (Just being Identity,
//TODO: and Nothing being Constant(null)), then the maybe container has a direct dependency on the Identity
//TODO: and Constant containers. This becomes an issue due to circular dependencies.
/**
 * @signature - :: * -> dataStructures.lazy_right
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.lazy_right} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.lazy_right}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace LazyRight
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.lazy_right}.
 * @return {dataStructures.lazy_right} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_right}.
 */
function LazyRight(val) {
    var fn = constant(val);
    return Object.create(lazy_right, {
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
 * @signature * -> {@link dataStructures.lazy_right}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.lazy_right} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.LazyRight}
 * @memberOf dataStructures.LazyRight
 * @static
 * @function of
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.lazy_right}.
 * @return {dataStructures.lazy_right} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_right}.
 */
LazyRight.of = LazyRight;

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.lazy_right} delegate or not. Available on the
 * {@link dataStructures.lazy_right}'s factory function as dataStructures.Right#is
 * @memberOf dataStructures.LazyRight
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.lazy_right} delegate.
 */
LazyRight.is = f => lazy_right.isPrototypeOf(f);

/**
 * @signature - :: * -> dataStructures.lazy_left
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.lazy_left} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.lazy_left}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace LazyLeft
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} val - a
 * @return {dataStructures.lazy_left} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_left}.
 */
function LazyLeft(val) {
    return Object.create(lazy_left, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @signature * -> {@link dataStructures.lazy_left}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.lazy_left} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.LazyLeft}
 * @memberOf dataStructures.LazyLeft
 * @static
 * @function of
 * @return {dataStructures.lazy_left} - Returns a new object that delegates to the
 * {@link dataStructures.lazy_left}.
 */
LazyLeft.of = LazyLeft;

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.lazy_left} delegate or not. Available on the
 * {@link left}'s factory function as dataStructures.LazyRight#is
 * @memberOf dataStructures.LazyLeft
 * @function is
 * @param {*} [n] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.lazy_left} delegate.
 */
LazyLeft.is = n => lazy_left.isPrototypeOf(n);

//TODO: Using this.of in order to create a new instance of a Maybe container (functor/monad) will
//TODO: not work as it is implemented here in terms of creating a new maybe container with the
//TODO: proper values for the '.isJust' and '.isNothing' fields. The problem is that the '.of'
//TODO: function property will create a new maybe instance with whatever value it receives as
//TODO: as argument and treat the new maybe container instance as a 'Just', regardless of the
//TODO: actual underlying value. As 'null' and 'undefined' underlying values are traditionally
//TODO: treated as 'Nothing' maybe values, this will cause a problem during mapping/flat-mapping/etc.


var next_right = fn => Object.create(lazy_right, {
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

var next_left = fn => Object.create(lazy_left, {
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
 * @typedef {Object} lazy_right
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
 * @namespace lazy_right
 * @description This is the delegate object that specifies the behavior of the just monad. All
 * operations that may be performed on an just monad 'instance' delegate to this object. Just
 * monad 'instances' are created by the {@link dataStructures.LazyLeft|dataStructures.LazyRight} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an right monad delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var lazy_right = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an right delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of a right delegator,
     * see {@link dataStructures.lazy_right#map} and {@link dataStructures.lazy_right#bimap}. To
     * retrieve the underlying value of a right delegator, see {@link dataStructures.lazy_right#get},
     * {@link dataStructures.lazy_right#orElse}, {@link dataStructures.lazy_right#getOrElse},
     * and {@link dataStructures.lazy_right#valueOf}.
     * @memberOf dataStructures.lazy_right
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
    isRight: true,
    isLeft: false,
    isEmpty: false,
    /**
     * @signature () -> {@link dataStructures.lazy_right}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link dataStructures.lazy_right}
     * delegator instance.
     * @memberOf dataStructures.lazy_right
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.lazy_right}.
     * @return {dataStructures.lazy_right} Returns a new {@link dataStructures.lazy_right}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: function _map(fn) {
        return next_right(() => fn(this.value));
    },
    chain: function _chain(fn) {
        return next_right(() => {
            let val = fn(this.value);
            return Object.getPrototypeOf(this).isPrototypeOf(val) ? val.value : val;
        });
    },
    mjoin: function _mjoin() {
        return next_right(() => Object.getPrototypeOf(this).isPrototypeOf(this.value) ? this.value.value : this.value);
    },
    apply: function _apply(ma) {
        return ma.map(this.value);
    },
    /**
     * @signature (* -> *) -> (* -> *) -> dataStructures.lazy_right<T>
     * @description Acts as a map for the disjunction between a just and a nothing monad. If the
     * monad is a just, the first mapping function parameter is used to map over the underlying value
     * and a new just is returned, 'wrapping' the return value of the function. If the monad is a nothing,
     * the second mapping function is invoked with a 'null' valued argument and a new nothing monad is
     * returned.
     * @memberOf dataStructures.lazy_right
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link dataStructures.lazy_right} delegator.
     * @param {function} g - A function that will be used to map over a null value if this is a
     * nothing monad.
     * @return {dataStructures.lazy_right} - Returns a new {@link dataStructures.lazy_right} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: function _map(f, g) {
        return next_right(() => f(this.value));
    },
    contramap: function contramap(fn) {
        return next_right(() => (...args) => this.value(fn(...args)));
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
     * @memberOf dataStructures.lazy_right
     * @instance
     * @function
     * @param {Object} ma - The other monad to check for equality with 'this' monad.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: function _equals(ma) {
        return !!(ma && ma.isRight && Object.getPrototypeOf(this).isPrototypeOf(ma));
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.lazy_right
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
     * underlying value
     * @memberOf dataStructures.lazy_right
     * @instance
     * @function
     * @return {string} Returns a string representation of the just
     * and its underlying value.
     */
    toString: stringMaker('Right'),
    get [Symbol.toStringTag]() {
        return 'Right';
    },
    /**
     * @signature * -> {@link dataStructures.lazy_right}
     * @description Factory function used to create a new object that delegates to
     * the {@link dataStructures.lazy_right} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link dataStructures.lazy_right}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf dataStructures.lazy_right
     * @instance
     * @function
     * @see dataStructures.LazyEither
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link dataStructures.lazy_right}.
     * @return {dataStructures.lazy_right} - Returns a new identity functor delegator
     */
    factory: LazyEither,
    [Symbol.iterator]: function *_iterator() {
        yield this.value;
    }
};

/**
 * @typedef {Object} lazy_left
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
 * @namespace lazy_left
 * @description This is the delegate object that specifies the behavior of the nothing monad. All
 * operations that may be performed on an nothing monad 'instance' delegate to this object. Nothing
 * monad 'instances' are created by the {@link dataStructures.LazyRight|dataStructures.LazyEither} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an nothing monad delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var lazy_left = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of a nothing monad delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an identity_functor delegator,
     * see {@link dataStructures.lazy_left#map} and {@link dataStructures.lazy_left#bimap}.
     * To retrieve the underlying value of an nothing monad delegator, see {@link dataStructures.lazy_left#get},
     * {@link dataStructures.lazy_left#orElse}, {@link dataStructures.lazy_left#getOrElse},
     * and {@link dataStructures.lazy_left#valueOf}.
     * @memberOf dataStructures.lazy_left
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    value: null,
    /**
     *
     */
    isRight: false,
    /**
     *
     */
    isLeft: true,
    isEmpty: true,
    /**
     * @signature () -> {@link dataStructures.lazy_left}
     * @description Takes a function that is applied to the underlying value of the
     * monad, the result of which is used to create a new {@link dataStructures.lazy_left}
     * delegator instance.
     * @memberOf dataStructures.lazy_left
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.lazy_left}.
     * @return {dataStructures.lazy_left} Returns a new {@link dataStructures.lazy_left}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: returnMe,
    /**
     * @signature (* -> *) -> (* -> *) -> dataStructures.nothing<T>
     * @description Since the nothing monad does not represent a disjunction, the Maybe's
     * bimap function property behaves just as its map function property. It is merely here as a
     * convenience so that swapping out monads does not break an application that is
     * relying on its existence.
     * @memberOf dataStructures.lazy_left
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link dataStructures.lazy_left} delegator.
     * @param {function} [g] - An optional function that is simply ignored on the {@link dataStructures.lazy_left}
     * since there is no disjunction present.
     * @return {dataStructures.lazy_left} - Returns a new {@link dataStructures.lazy_left} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: function _map(f, g) {
        return next_left(() => g(this.value));
    },
    chain: returnMe,
    mjoin: returnMe,
    apply: returnMe,
    fold: returnMe,
    sequence: function _sequence(p) {
        return this.traverse(p, p.of);
    },
    traverse: function _traverse(a, f) {
        return a.of(LazyEither.Left());
    },
    /**
     * @signature * -> boolean
     * @description Determines if 'this' left functor is equal to another monad. Equality
     * is defined as:
     * 1) The other monad shares the same delegate object as 'this' nothing monad
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.lazy_left
     * @instance
     * @function
     * @param {Object} ma - The other monad to check for equality with 'this' monad.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: LazyLeft.is,
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current monad 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.lazy_left
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current monad 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the monad and its
     * underlying value
     * @memberOf dataStructures.lazy_left
     * @instance
     * @function
     * @return {string} Returns a string representation of the nothing
     * and its underlying value.
     */
    toString: function _toString() {
        return 'Left()';
    },
    get [Symbol.toStringTag]() {
        return 'Left';
    },
    /**
     * @signature * -> {@link dataStructures.lazy_left}
     * @description Factory function used to create a new object that delegates to
     * the {@link dataStructures.lazy_left} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link dataStructures.lazy_left}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf dataStructures.lazy_left
     * @instance
     * @function
     * @see dataStructures.LazyEither
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link dataStructures.lazy_left}.
     * @return {dataStructures.lazy_left} - Returns a new nothing monad delegator
     */
    factory: LazyEither,
    [Symbol.iterator]: function *_iterator() {
        yield this.value;
    }
};

lazy_right.ap = lazy_right.apply;
lazy_right.fmap = lazy_right.chain;
lazy_right.flapMap = lazy_right.chain;
lazy_right.bind = lazy_right.chain;
lazy_right.reduce = lazy_right.fold;

lazy_left.ap = lazy_left.apply;
lazy_left.fmap = lazy_left.chain;
lazy_left.flapMap = lazy_left.chain;
lazy_left.bind = lazy_left.chain;
lazy_left.reduce = lazy_left.fold;

lazy_right.constructor = lazy_right.factory;
lazy_left.constructor = lazy_left.factory;

export { LazyEither, LazyLeft, LazyRight, lazy_right, lazy_left };