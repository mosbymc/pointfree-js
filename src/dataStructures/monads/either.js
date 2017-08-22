import { identity } from '../../combinators';
import { disjunctionEqualMaker, stringMaker, valueOf, apply, chain, mjoin, pointMaker,
    get, emptyGet, orElse, emptyOrElse, getOrElse, emptyGetOrElse, sharedEitherFns } from '../dataStructureHelpers';

/**
 * @signature
 * @description Returns an either functor based on a loose equals null comparison. If
 * the argument passed to the function loose equals null, a left is returned; other wise,
 * a right.
 * @param {*} x - Any value that should be placed inside an either functor.
 * @return {monads.left|monads.right} - Either a left or a right functor
 */
function fromNullable(x) {
    return null != x ? Right(x) : Left(x);
}

/**
 * @signature - :: * -> monads.left|monads.right
 * @description Factory function used to create a new object that delegates to
 * the {@link monads.left|monads.right} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link monads.left|monads.right}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Either
 * @memberOf monads
 * @property {function} of
 * @property {function} is
 * @property {function} isRight
 * @property {function} isLeft
 * @property {function} Right
 * @property {function} Left
 * @property {function} fromNullable
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link monads.left|monads.right}.
 * @param {string} [fork] - Specifies if the either should be a left or a right. If no value
 * is provided, the result is created as a left.
 * @return {monads.left|monads.right} - Returns a new object that delegates to the
 * {@link monads.left|monads.right}.
 */
function Either(val, fork) {
    return 'right' === fork ?
        Object.create(right, {
            _value: {
                value: val,
                writable: false,
                configurable: false
            },
            isRight: {
                value: true
            },
            isLeft: {
                value: false
            }
        }) :
        Object.create(left, {
            _value: {
                value: val,
                writable: false,
                configurable: false
            },
            isRight: {
                value: false
            },
            isLeft: {
                value: true
            }
        });
}
//left|monads.right

/**
 * @signature * -> {@link monads.right}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link monads.right} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link monads.Right}
 * @memberOf monads.Either
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link monads.right}.
 * @return {monads.right} - Returns a new object that delegates to the
 * {@link monads.right}.
 */
Either.of = x => Either(x, 'right');

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link monads.left|monads.right} delegate or not. Available on the
 * {@link left|monads.right}'s factory function as monads.Either#is
 * @memberOf monads.Either
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link monads.left|monads.right} delegate.
 */
Either.is = f => Left.is(f) || Right.is(f);

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'right' functor.
 * @memberOf monads.Either
 * @function is
 * @param {Object} [f] - a
 * @return {boolean} - b
 */
Either.isRight = f => f.isRight;

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'left' functor.
 * @memberOf monads.Either
 * @function is
 * @param {Object} [f] - a
 * @return {boolean} - b
 */
Either.isLeft = f => f.isLeft;

/**
 * @signature * -> monads.right
 * @description Takes any value and creates a 'right' functor. Shorthand function
 * for Either(*, right)
 * @memberOf monads.Either
 * @function is
 * @param {*} x - a
 * @return {monads.right} - b
 */
Either.Right = x => Either(x, 'right');

/**
 * @signature * -> monads.left
 * @description Takes any value and creates a 'left' functor. Shorthand function
 * for Either(*, 'left')
 * @memberOf monads.Either
 * @function is
 * @param {*} [x] - a
 * @return {monads.left} - b
 */
Either.Left = x => Either(x);

/**
 * @signature * -> functor.left|monads.right
 * @description Takes any value and returns a 'left' functor is the value
 * loose equals null; other wise returns a 'right' functor.
 * @memberOf monads.Either
 * @function is
 * @param {*} [x] - a
 * @return {monads.left|monads.right} - b
 */
Either.fromNullable = fromNullable;

/**
 * @signature - :: * -> monads.left
 * @description Factory function used to create a new object that delegates to
 * the {@link monads.left} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link monads.left}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Left
 * @memberOf monads
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link monads.left}.
 * @return {monads.left} - Returns a new object that delegates to the
 * {@link monads.left}.
 */
function Left(val) {
    return Object.create(left, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isRight: {
            value: false,
            writable: false,
            configurable: false
        },
        isLeft: {
            value: true,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @signature * -> {@link monads.left}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link monads.left} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link monads.Left}
 * @memberOf monads.Left
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link monads.left}.
 * @return {monads.left} - Returns a new object that delegates to the
 * {@link monads.left}.
 */
Left.of = x => Left(x);

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link monads.left} delegate or not. Available on the
 * {@link left}'s factory function as monads.Left#is
 * @memberOf monads.Left
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link monads.left} delegate.
 */
Left.is = f => left.isPrototypeOf(f);

/**
 * @signature - :: * -> monads.right
 * @description Factory function used to create a new object that delegates to
 * the {@link monads.right} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link monads.right}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Right
 * @memberOf monads
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link monads.right}.
 * @return {monads.right} - Returns a new object that delegates to the
 * {@link monads.right}.
 */
function Right(val) {
    return Object.create(right, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isRight: {
            value: true,
            writable: false,
            configurable: false
        },
        isLeft: {
            value: false,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link monads.right} delegate or not. Available on the
 * {@link monads.right}'s factory function as monads.Right#is
 * @memberOf monads.Right
 * @function is
 * @param {*} [x] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link monads.right} delegate.
 */
Right.is = x => right.isPrototypeOf(x);

/**
 * @signature * -> {@link monads.right}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link monads.right} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link monads.Right}
 * @memberOf monads.Right
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link monads.right}.
 * @return {monads.right} - Returns a new object that delegates to the
 * {@link monads.right}.
 */
Right.of = x => Right(x);

/**
 * @typedef {Object} right
 * @property {function} value - returns the underlying value of the the functor
 * @property {function} map - maps a single function over the underlying value of the functor
 * @property {function} bimap
 * @property {function} get - returns the underlying value of the functor
 * @property {function} orElse - returns the underlying value of the functor
 * @property {function} getOrElse - returns the underlying value of the functor
 * @property {function} of - creates a new right delegate with the value provided
 * @property {function} valueOf - returns the underlying value of the functor; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity functor and its underlying value
 * @property {function} factory - a reference to the right factory function
 * @property {function} [Symbol.Iterator] - Iterator for the right
 * @kind {Object}
 * @memberOf monads
 * @namespace right
 * @description This is the delegate object that specifies the behavior of the right functor. All
 * operations that may be performed on an right functor 'instance' delegate to this object. Right
 * functor 'instances' are created by the {@link monads.Either|monads.Right} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an right functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var right = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an right delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of a right delegator,
     * see {@link monads.right#map} and {@link monads.right#bimap}. To
     * retrieve the underlying value of a right delegator, see {@link monads.right#get},
     * {@link monads.right#orElse}, {@link monads.right#getOrElse},
     * and {@link monads.right#valueOf}.
     * @memberOf monads.right
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    /**
     * @signature () -> {@link monads.right}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link monads.right}
     * delegator instance.
     * @memberOf monads.right
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link monads.right}.
     * @return {monads.right} Returns a new {@link monads.right}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: sharedEitherFns.rightMap,
    /**
     * @signature (* -> *) -> (* -> *) -> monads.right<T>
     * @description Since the constant functor does not represent a disjunction, the Identity's
     * bimap function property behaves just as its map function property. It is merely here as a
     * convenience so that swapping out monads/monads does not break an application that is
     * relying on its existence.
     * @memberOf monads.right
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link monads.right} delegator.
     * @param {function} [g] - An optional function that is simply ignored on the {@link monads.right}
     * since there is no disjunction present.
     * @return {monads.right} - Returns a new {@link monads.right} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: sharedEitherFns.rightBiMap,
    fold: function _fold(fn) {
        return fn(this.value);
    },
    sequence: function _sequence(p) {
        return this.traverse(identity, p);
    },
    traverse: function _traverse(a, f, g) {
        return f(this.value).map(this.of);
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'.
     * @memberOf monads.right
     * @instance
     * @function
     * @return {*} - Returns the underlying value of the current functor 'instance'.
     */
    get: get,
    /**
     * @signature * -> *
     * @description Takes an optional parameter of any value as a default return value in
     * cases where the current functor 'instance\'s' underlying value is not 'mappable'.
     * Because the identity_functor does not support disjunctions, the parameter is entirely
     * optional and will always be ignored. Whatever the actual underlying value is, it will
     * always be returned.
     * @memberOf monads.right
     * @instance
     * @function
     * @param {*} [x] - a
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    getOrElse: getOrElse,
    /**
     * @signature () -> *
     * @description Takes an optional function parameter as a default to be invoked and
     * returned in cases where the current functor 'instance\'s' underlying value is not
     * 'mappable'. Because the identity_functor does not support disjunctions, the
     * parameter is entirely optional and will always be ignored. Whatever the actual
     * underlying value is, it will always be returned.
     * @memberOf monads.right
     * @instance
     * @function
     * @param {function} [f] - An optional function argument which is invoked and the result
     * returned in cases where the underlying value is not 'mappable'.
     * @return {*} - b
     */
    orElse: orElse,
    /**
     * @signature * -> {@link monads.right}
     * @description Factory function used to create a new object that delegates to
     * the {@link monads.right} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link monads.right}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf monads.right
     * @instance
     * @function
     * @param {*} item - The value that should be set as the underlying
     * value of the {@link monads.right}.
     * @return {monads.right} Returns a new {@link monads.right} delegator object
     * via the {@link monads.Either#of} function.
     */
    of: pointMaker(Right),
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf monads.right
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the functor and its
     * underlying value
     * @memberOf monads.right
     * @instance
     * @function
     * @return {string} Returns a string representation of the right
     * and its underlying value.
     */
    toString: stringMaker('Right'),
    /**
     * @signature * -> {@link monads.right}
     * @description Factory function used to create a new object that delegates to
     * the {@link monads.right} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link monads.right}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf monads.right
     * @instance
     * @function
     * @see monads.Either
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link monads.right}.
     * @return {monads.right} - Returns a new identity functor delegator
     */
    factory: Either
};

/**
 * @signature * -> boolean
 * @description Determines if 'this' right functor is equal to another functor. Equality
 * is defined as:
 * 1) The other functor shares the same delegate object as 'this' identity functor
 * 2) Both underlying values are strictly equal to each other
 * @memberOf monads.right
 * @instance
 * @function
 * @param {Object} ma - The other functor to check for equality with 'this' functor.
 * @return {boolean} - Returns a boolean indicating equality
 */
right.equals = disjunctionEqualMaker(right, 'isRight');

/**
 * @typedef {Object} left
 * @property {function} value - returns the underlying value of the the functor
 * @property {function} map - maps a single function over the underlying value of the functor
 * @property {function} bimap
 * @property {function} get - returns the underlying value of the functor
 * @property {function} orElse - returns the underlying value of the functor
 * @property {function} getOrElse - returns the underlying value of the functor
 * @property {function} of - creates a new left delegate with the value provided
 * @property {function} valueOf - returns the underlying value of the functor; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity functor and its underlying value
 * @property {function} factory - a reference to the left factory function
 * @property {function} [Symbol.Iterator] - Iterator for the left
 * @kind {Object}
 * @memberOf monads
 * @namespace left
 * @description This is the delegate object that specifies the behavior of the left functor. All
 * operations that may be performed on an left functor 'instance' delegate to this object. Left
 * functor 'instances' are created by the {@link monads.Either|monads.Left} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var left = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an identity_functor delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an identity_functor delegator,
     * see {@link monads.left#map} and {@link monads.left#bimap}.
     * To retrieve the underlying value of an identity_functor delegator, see {@link monads.left#get},
     * {@link monads.left#orElse}, {@link monads.left#getOrElse},
     * and {@link monads.left#valueOf}.
     * @memberOf monads.left
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    /**
     * @signature () -> {@link monads.left}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link monads.left}
     * delegator instance.
     * @memberOf monads.left
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link monads.left}.
     * @return {monads.left} Returns a new {@link monads.left}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: sharedEitherFns.leftMapMaker(Left),
    /**
     * @signature (* -> *) -> (* -> *) -> monads.left<T>
     * @description Since the constant functor does not represent a disjunction, the Identity's
     * bimap function property behaves just as its map function property. It is merely here as a
     * convenience so that swapping out monads/monads does not break an application that is
     * relying on its existence.
     * @memberOf monads.left
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link monads.left} delegator.
     * @param {function} [g] - An optional function that is simply ignored on the {@link monads.left}
     * since there is no disjunction present.
     * @return {monads.left} - Returns a new {@link monads.left} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: sharedEitherFns.leftBimapMaker(Left),
    fold: function _fold(fn) {
        return fn(this.value);
    },
    sequence: function _sequence(p) {
        return this.traverse(identity, p);
    },
    traverse: function _traverse(a, f) {
        return a.of(Left(this.value));
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'.
     * @memberOf monads.left
     * @instance
     * @function
     * @return {*} - Returns the underlying value of the current functor 'instance'.
     */
    get: emptyGet,
    /**
     * @signature * -> *
     * @description Takes an optional parameter of any value as a default return value in
     * cases where the current functor 'instance\'s' underlying value is not 'mappable'.
     * Because the left does not support disjunctions, the parameter is entirely
     * optional and will always be ignored. Whatever the actual underlying value is, it will
     * always be returned.
     * @memberOf monads.left
     * @instance
     * @function
     * @param {*} [x] - a
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    getOrElse: emptyGetOrElse,
    /**
     * @signature () -> *
     * @description Takes an optional function parameter as a default to be invoked and
     * returned in cases where the current functor 'instance\'s' underlying value is not
     * 'mappable'. Because the identity_functor does not support disjunctions, the
     * parameter is entirely optional and will always be ignored. Whatever the actual
     * underlying value is, it will always be returned.
     * @memberOf monads.left
     * @instance
     * @function
     * @param {function} [f] - An optional function argument which is invoked and the result
     * returned in cases where the underlying value is not 'mappable'.
     * @return {*} - b
     */
    orElse: emptyOrElse,
    /**
     * @signature * -> {@link monads.left}
     * @description Factory function used to create a new object that delegates to
     * the {@link monads.left} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link monads.left}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf monads.left
     * @instance
     * @function
     * @param {*} item - The value that should be set as the underlying
     * value of the {@link monads.left}.
     * @return {monads.left} Returns a new {@link monads.left} delegator object
     * via the {@link monads.Either#of} function.
     */
    of: pointMaker(Right),
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf monads.left
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the functor and its
     * underlying value
     * @memberOf monads.left
     * @instance
     * @function
     * @return {string} Returns a string representation of the left
     * and its underlying value.
     */
    toString: stringMaker('Left'),
    /**
     * @signature * -> {@link monads.left}
     * @description Factory function used to create a new object that delegates to
     * the {@link monads.left} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link monads.left}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf monads.left
     * @instance
     * @function
     * @see monads.Either
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link monads.left}.
     * @return {monads.left} - Returns a new identity functor delegator
     */
    factory: Either
};

/**
 * @signature * -> boolean
 * @description Determines if 'this' left functor is equal to another functor. Equality
 * is defined as:
 * 1) The other functor shares the same delegate object as 'this' identity functor
 * 2) Both underlying values are strictly equal to each other
 * @memberOf monads.left
 * @instance
 * @function
 * @param {Object} ma - The other functor to check for equality with 'this' functor.
 * @return {boolean} - Returns a boolean indicating equality
 */
left.equals = disjunctionEqualMaker(left, 'isLeft');


//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
right.constructor = right.factory;
left.constructor = left.factory;
right.chain = chain;
right.mjoin = mjoin;
right.apply = apply;

left.chain = chain;
left.mjoin = mjoin;
left.apply = apply;

right.ap = right.apply;
left.ap = left.apply;
right.flatMap = right.chain;
left.flatMap = left.chain;
right.bind = right.chain;
left.bind = left.chain;
right.reduce = right.fold;
left.reduce = left.fold;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
right.constructor = right.factory;
left.constructor = left.factory;


export { Either, Left, Right, right, left };