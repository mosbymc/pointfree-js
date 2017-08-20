import { disjunctionEqualMaker, pointMaker, stringMaker, valueOf,
        get, emptyGet, orElse, emptyOrElse, getOrElse, emptyGetOrElse, sharedEitherFns } from '../dataStructureHelpers';

/**
 * @signature
 * @description Returns an either functor based on a loose equals null comparison. If
 * the argument passed to the function loose equals null, a left is returned; other wise,
 * a right.
 * @param {*} x - Any value that should be placed inside an either functor.
 * @return {functors.left_functor|functors.right_functor} - Either a left or a right functor
 */
function fromNullable(x) {
    return null != x ? Right(x) : Left(x);
}

/**
 * @signature - :: * -> functors.left_functor|functors.right_functor
 * @description Factory function used to create a new object that delegates to
 * the {@link functors.left_functor|functors.right_functor} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link functors.left_functor|functors.right_functor}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Either
 * @memberOf functors
 * @property {function} of
 * @property {function} is
 * @property {function} isRight
 * @property {function} isLeft
 * @property {function} Right
 * @property {function} Left
 * @property {function} fromNullable
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link functors.left_functor|functors.right_functor}.
 * @param {string} [fork] - Specifies if the either should be a left or a right. If no value
 * is provided, the result is created as a left.
 * @return {functors.left_functor|functors.right_functor} - Returns a new object that delegates to the
 * {@link functors.left_functor|functors.right_functor}.
 */
function Either(val, fork) {
    return 'right' === fork ?
        Object.create(right_functor, {
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
        Object.create(left_functor, {
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
//left_functor|functors.right_functor

/**
 * @signature * -> {@link functors.right_functor}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link functors.right_functor} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link functors.Right}
 * @memberOf functors.Either
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link functors.right_functor}.
 * @return {functors.right_functor} - Returns a new object that delegates to the
 * {@link functors.right_functor}.
 */
Either.of = x => Either(x, 'right');

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link functors.left_functor|functors.right_functor} delegate or not. Available on the
 * {@link left_functor|functors.right_functor}'s factory function as functors.Either#is
 * @memberOf functors.Either
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link functors.left_functor|functors.right_functor} delegate.
 */
Either.is = f => Left.is(f) || Right.is(f);

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'right' functor.
 * @memberOf functors.Either
 * @function is
 * @param {Object} [f] - a
 * @return {boolean} - b
 */
Either.isRight = f => f.isRight;

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'left' functor.
 * @memberOf functors.Either
 * @function is
 * @param {Object} [f] - a
 * @return {boolean} - b
 */
Either.isLeft = f => f.isLeft;

/**
 * @signature * -> functors.right_functor
 * @description Takes any value and creates a 'right' functor. Shorthand function
 * for Either(*, right)
 * @memberOf functors.Either
 * @function is
 * @param {*} x - a
 * @return {functors.right_functor} - b
 */
Either.Right = x => Either(x, 'right');

/**
 * @signature * -> functors.left_functor
 * @description Takes any value and creates a 'left' functor. Shorthand function
 * for Either(*, 'left')
 * @memberOf functors.Either
 * @function is
 * @param {*} [x] - a
 * @return {functors.left_functor} - b
 */
Either.Left = x => Either(x);

/**
 * @signature * -> functor.left_functor|functors.right_functor
 * @description Takes any value and returns a 'left' functor is the value
 * loose equals null; other wise returns a 'right' functor.
 * @memberOf functors.Either
 * @function is
 * @param {*} [x] - a
 * @return {functors.left_functor|functors.right_functor} - b
 */
Either.fromNullable = fromNullable;

/**
 * @signature - :: * -> functors.left_functor
 * @description Factory function used to create a new object that delegates to
 * the {@link functors.left_functor} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link functors.left_functor}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Left
 * @memberOf functors
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link functors.left_functor}.
 * @return {functors.left_functor} - Returns a new object that delegates to the
 * {@link functors.left_functor}.
 */
function Left(val) {
    return Object.create(left_functor, {
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
 * @signature * -> {@link functors.left_functor}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link functors.left_functor} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link functors.Left}
 * @memberOf functors.Left
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link functors.left_functor}.
 * @return {functors.left_functor} - Returns a new object that delegates to the
 * {@link functors.left_functor}.
 */
Left.of = x => Left(x);

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link functors.left_functor} delegate or not. Available on the
 * {@link left_functor}'s factory function as functors.Left#is
 * @memberOf functors.Left
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link functors.left_functor} delegate.
 */
Left.is = f => left_functor.isPrototypeOf(f);

/**
 * @signature - :: * -> functors.right_functor
 * @description Factory function used to create a new object that delegates to
 * the {@link functors.right_functor} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link functors.right_functor}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Right
 * @memberOf functors
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link functors.right_functor}.
 * @return {functors.right_functor} - Returns a new object that delegates to the
 * {@link functors.right_functor}.
 */
function Right(val) {
    return Object.create(right_functor, {
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
 * {@link functors.right_functor} delegate or not. Available on the
 * {@link functors.right_functor}'s factory function as functors.Right#is
 * @memberOf functors.Right
 * @function is
 * @param {*} [x] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link functors.right_functor} delegate.
 */
Right.is = x => right_functor.isPrototypeOf(x);

/**
 * @signature * -> {@link functors.right_functor}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link functors.right_functor} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link functors.Right}
 * @memberOf functors.Right
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link functors.right_functor}.
 * @return {functors.right_functor} - Returns a new object that delegates to the
 * {@link functors.right_functor}.
 */
Right.of = x => Right(x);

/**
 * @typedef {Object} right_functor
 * @property {function} value - returns the underlying value of the the functor
 * @property {function} map - maps a single function over the underlying value of the functor
 * @property {function} bimap
 * @property {function} get - returns the underlying value of the functor
 * @property {function} orElse - returns the underlying value of the functor
 * @property {function} getOrElse - returns the underlying value of the functor
 * @property {function} of - creates a new right_functor delegate with the value provided
 * @property {function} valueOf - returns the underlying value of the functor; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity functor and its underlying value
 * @property {function} factory - a reference to the right_functor factory function
 * @property {function} [Symbol.Iterator] - Iterator for the right_functor
 * @kind {Object}
 * @memberOf functors
 * @namespace right_functor
 * @description This is the delegate object that specifies the behavior of the right functor. All
 * operations that may be performed on an right functor 'instance' delegate to this object. Right
 * functor 'instances' are created by the {@link functors.Either|functors.Right} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an right functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var right_functor = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an right_functor delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of a right_functor delegator,
     * see {@link functors.right_functor#map} and {@link functors.right_functor#bimap}. To
     * retrieve the underlying value of a right_functor delegator, see {@link functors.right_functor#get},
     * {@link functors.right_functor#orElse}, {@link functors.right_functor#getOrElse},
     * and {@link functors.right_functor#valueOf}.
     * @memberOf functors.right_functor
     * @instance
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    /**
     * @signature () -> {@link functors.right_functor}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link functors.right_functor}
     * delegator instance.
     * @memberOf functors.right_functor
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link functors.right_functor}.
     * @return {functors.right_functor} Returns a new {@link functors.right_functor}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: sharedEitherFns.rightMap,
    /**
     * @signature (* -> *) -> (* -> *) -> functors.right_functor<T>
     * @description Since the constant functor does not represent a disjunction, the Identity's
     * bimap function property behaves just as its map function property. It is merely here as a
     * convenience so that swapping out functors/monads does not break an application that is
     * relying on its existence.
     * @memberOf functors.right_functor
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link functors.right_functor} delegator.
     * @param {function} [g] - An optional function that is simply ignored on the {@link functors.right_functor}
     * since there is no disjunction present.
     * @return {functors.right_functor} - Returns a new {@link functors.right_functor} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: sharedEitherFns.rightBiMap,
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'.
     * @memberOf functors.right_functor
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
     * @memberOf functors.right_functor
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
     * @memberOf functors.right_functor
     * @instance
     * @function
     * @param {function} [f] - An optional function argument which is invoked and the result
     * returned in cases where the underlying value is not 'mappable'.
     * @return {*} - b
     */
    orElse: orElse,
    /**
     * @signature * -> {@link functors.right_functor}
     * @description Factory function used to create a new object that delegates to
     * the {@link functors.right_functor} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link functors.right_functor}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf functors.right_functor
     * @instance
     * @function
     * @param {*} item - The value that should be set as the underlying
     * value of the {@link functors.right_functor}.
     * @return {functors.right_functor} Returns a new {@link functors.right_functor} delegator object
     * via the {@link functors.Either#of} function.
     */
    of: pointMaker(Right),
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf functors.right_functor
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the functor and its
     * underlying value
     * @memberOf functors.right_functor
     * @instance
     * @function
     * @return {string} Returns a string representation of the right_functor
     * and its underlying value.
     */
    toString: stringMaker('Right'),
    /**
     * @signature * -> {@link functors.right_functor}
     * @description Factory function used to create a new object that delegates to
     * the {@link functors.right_functor} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link functors.right_functor}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf functors.right_functor
     * @instance
     * @function
     * @see functors.Either
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link functors.right_functor}.
     * @return {functors.right_functor} - Returns a new identity functor delegator
     */
    factory: Either
};

/**
 * @signature * -> boolean
 * @description Determines if 'this' right functor is equal to another functor. Equality
 * is defined as:
 * 1) The other functor shares the same delegate object as 'this' identity functor
 * 2) Both underlying values are strictly equal to each other
 * @memberOf functors.right_functor
 * @instance
 * @function
 * @param {Object} ma - The other functor to check for equality with 'this' functor.
 * @return {boolean} - Returns a boolean indicating equality
 */
right_functor.equals = disjunctionEqualMaker(right_functor, 'isRight');

/**
 * @typedef {Object} left_functor
 * @property {function} value - returns the underlying value of the the functor
 * @property {function} map - maps a single function over the underlying value of the functor
 * @property {function} bimap
 * @property {function} get - returns the underlying value of the functor
 * @property {function} orElse - returns the underlying value of the functor
 * @property {function} getOrElse - returns the underlying value of the functor
 * @property {function} of - creates a new left_functor delegate with the value provided
 * @property {function} valueOf - returns the underlying value of the functor; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity functor and its underlying value
 * @property {function} factory - a reference to the left_functor factory function
 * @property {function} [Symbol.Iterator] - Iterator for the left_functor
 * @kind {Object}
 * @memberOf functors
 * @namespace left_functor
 * @description This is the delegate object that specifies the behavior of the left functor. All
 * operations that may be performed on an left functor 'instance' delegate to this object. Left
 * functor 'instances' are created by the {@link functors.Either|functors.Left} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an identity functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var left_functor = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of an identity_functor delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an identity_functor delegator,
     * see {@link functors.left_functor#map} and {@link functors.left_functor#bimap}.
     * To retrieve the underlying value of an identity_functor delegator, see {@link functors.left_functor#get},
     * {@link functors.left_functor#orElse}, {@link functors.left_functor#getOrElse},
     * and {@link functors.left_functor#valueOf}.
     * @memberOf functors.left_functor
     * @instance
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },
    /**
     * @signature () -> {@link functors.left_functor}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link functors.left_functor}
     * delegator instance.
     * @memberOf functors.left_functor
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link functors.left_functor}.
     * @return {functors.left_functor} Returns a new {@link functors.left_functor}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: sharedEitherFns.leftMapMaker(Left),
    /**
     * @signature (* -> *) -> (* -> *) -> functors.left_functor<T>
     * @description Since the constant functor does not represent a disjunction, the Identity's
     * bimap function property behaves just as its map function property. It is merely here as a
     * convenience so that swapping out functors/monads does not break an application that is
     * relying on its existence.
     * @memberOf functors.left_functor
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link functors.left_functor} delegator.
     * @param {function} [g] - An optional function that is simply ignored on the {@link functors.left_functor}
     * since there is no disjunction present.
     * @return {functors.left_functor} - Returns a new {@link functors.left_functor} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: sharedEitherFns.leftBimapMaker(Left),
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'.
     * @memberOf functors.left_functor
     * @instance
     * @function
     * @return {*} - Returns the underlying value of the current functor 'instance'.
     */
    get: emptyGet,
    /**
     * @signature * -> *
     * @description Takes an optional parameter of any value as a default return value in
     * cases where the current functor 'instance\'s' underlying value is not 'mappable'.
     * Because the left_functor does not support disjunctions, the parameter is entirely
     * optional and will always be ignored. Whatever the actual underlying value is, it will
     * always be returned.
     * @memberOf functors.left_functor
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
     * @memberOf functors.left_functor
     * @instance
     * @function
     * @param {function} [f] - An optional function argument which is invoked and the result
     * returned in cases where the underlying value is not 'mappable'.
     * @return {*} - b
     */
    orElse: emptyOrElse,
    /**
     * @signature * -> {@link functors.left_functor}
     * @description Factory function used to create a new object that delegates to
     * the {@link functors.left_functor} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link functors.left_functor}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf functors.left_functor
     * @instance
     * @function
     * @param {*} item - The value that should be set as the underlying
     * value of the {@link functors.left_functor}.
     * @return {functors.left_functor} Returns a new {@link functors.left_functor} delegator object
     * via the {@link functors.Either#of} function.
     */
    of: pointMaker(Right),
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf functors.left_functor
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the functor and its
     * underlying value
     * @memberOf functors.left_functor
     * @instance
     * @function
     * @return {string} Returns a string representation of the left_functor
     * and its underlying value.
     */
    toString: stringMaker('Left'),
    /**
     * @signature * -> {@link functors.left_functor}
     * @description Factory function used to create a new object that delegates to
     * the {@link functors.left_functor} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link functors.left_functor}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf functors.left_functor
     * @instance
     * @function
     * @see functors.Either
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link functors.left_functor}.
     * @return {functors.left_functor} - Returns a new identity functor delegator
     */
    factory: Either
};

/**
 * @signature * -> boolean
 * @description Determines if 'this' left functor is equal to another functor. Equality
 * is defined as:
 * 1) The other functor shares the same delegate object as 'this' identity functor
 * 2) Both underlying values are strictly equal to each other
 * @memberOf functors.left_functor
 * @instance
 * @function
 * @param {Object} ma - The other functor to check for equality with 'this' functor.
 * @return {boolean} - Returns a boolean indicating equality
 */
left_functor.equals = disjunctionEqualMaker(left_functor, 'isLeft');


//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
right_functor.constructor = right_functor.factory;
left_functor.constructor = left_functor.factory;


export { Either, Left, Right, right_functor, left_functor };