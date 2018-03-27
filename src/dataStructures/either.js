import { apply, disjunctionEqualMaker, stringMaker, valueOf, chain, join, sharedEitherFns } from './data_structure_util';

/**
 * @signature
 * @description Returns an either functor based on a loose equals null comparison. If
 * the argument passed to the function loose equals null, a left is returned; other wise,
 * a right.
 * @private
 * @param {*} x - Any value that should be placed inside an either functor.
 * @return {dataStructures.left|dataStructures.right} - Either a left or a right functor
 */
function fromNullable(x) {
    return null != x ? Right(x) : Left(x);
}

/**
 * @signature - :: * -> dataStructures.left|dataStructures.right
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.left|dataStructures.right} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.left|dataStructures.right}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Either
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} isRight
 * @property {function} isLeft
 * @property {function} Right
 * @property {function} Left
 * @property {function} fromNullable
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.left|dataStructures.right}.
 * @param {string} [fork] - Specifies if the either should be a left or a right. If no value
 * is provided, the result is created as a left.
 * @return {dataStructures.left|dataStructures.right} - Returns a new object that delegates to the
 * {@link dataStructures.left|dataStructures.right}.
 */
function Either(val, fork) {
    return 'right' === fork ?
        Object.create(right, {
            _value: {
                value: val,
                writable: false,
                configurable: false
            }
        }) :
        Object.create(left, {
            _value: {
                value: val,
                writable: false,
                configurable: false
            }
        });
}

/**
 * @signature * -> {@link dataStructures.right}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.right} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.Right}
 * @memberOf dataStructures.Either
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link dataStructures.right}.
 * @return {dataStructures.right} - Returns a new object that delegates to the
 * {@link dataStructures.right}.
 */
Either.of = x => Either(x, 'right');

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.left|dataStructures.right} delegate or not. Available on the
 * {@link left|dataStructures.right}'s factory function as dataStructures.Either#is
 * @memberOf dataStructures.Either
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.left|dataStructures.right} delegate.
 */
Either.is = f => Left.is(f) || Right.is(f);

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'right' monad.
 * @memberOf dataStructures.Either
 * @function is
 * @param {Object} [f] - a
 * @return {boolean} - b
 */
Either.isRight = f => f.isRight;

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'left' monad.
 * @memberOf dataStructures.Either
 * @function is
 * @param {Object} [f] - a
 * @return {boolean} - b
 */
Either.isLeft = f => f.isLeft;

/**
 * @signature * -> dataStructures.right
 * @description Takes any value and creates a 'right' functor. Shorthand function
 * for Either(*, right)
 * @memberOf dataStructures.Either
 * @function is
 * @param {*} x - a
 * @return {dataStructures.right} - b
 */
Either.Right = x => Either(x, 'right');

/**
 * @signature * -> dataStructures.left
 * @description Takes any value and creates a 'left' functor. Shorthand function
 * for Either(*, 'left')
 * @memberOf dataStructures.Either
 * @function is
 * @param {*} [x] - a
 * @return {dataStructures.left} - b
 */
Either.Left = x => Either(x);

/**
 * @signature * -> dataStructures.left|dataStructures.right
 * @description Takes any value and returns a 'left' monad is the value
 * loose equals null; other wise returns a 'right' monad.
 * @memberOf dataStructures.Either
 * @function is
 * @param {*} [x] - a
 * @return {dataStructures.left|dataStructures.right} - b
 */
Either.fromNullable = fromNullable;

/**
 * @signature - :: * -> dataStructures.left
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.left} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.left}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Left
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.left}.
 * @return {dataStructures.left} - Returns a new object that delegates to the
 * {@link dataStructures.left}.
 */
function Left(val) {
    return Object.create(left, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @signature * -> {@link dataStructures.left}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.left} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.Left}
 * @memberOf dataStructures.Left
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link dataStructures.left}.
 * @return {dataStructures.left} - Returns a new object that delegates to the
 * {@link dataStructures.left}.
 */
Left.of = x => Left(x);

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.left} delegate or not. Available on the
 * {@link left}'s factory function as dataStructures.Left#is
 * @memberOf dataStructures.Left
 * @function is
 * @param {*} [f] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.left} delegate.
 */
Left.is = f => left.isPrototypeOf(f);

/**
 * @signature - :: * -> dataStructures.right
 * @description Factory function used to create a new object that delegates to
 * the {@link dataStructures.right} object. Any single value may be provided as an argument
 * which will be used to set the underlying value of the new {@link dataStructures.right}
 * delegator. If no argument is provided, the underlying value will be 'undefined'.
 * @namespace Right
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @property {function} lift
 * @param {*} [val] - The value that should be set as the underlying
 * value of the {@link dataStructures.right}.
 * @return {dataStructures.right} - Returns a new object that delegates to the
 * {@link dataStructures.right}.
 */
function Right(val) {
    return Object.create(right, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @signature * -> boolean
 * @description Convenience function for determining if a value is an
 * {@link dataStructures.right} delegate or not. Available on the
 * {@link dataStructures.right}'s factory function as dataStructures.Right#is
 * @memberOf dataStructures.Right
 * @function is
 * @param {*} [x] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.right} delegate.
 */
Right.is = x => right.isPrototypeOf(x);

/**
 * @signature * -> {@link dataStructures.right}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.right} object delegator instance.
 * Because the either functor does not require any specific context for
 * its value, this can be viewed as an alias for {@link dataStructures.Right}
 * @memberOf dataStructures.Right
 * @static
 * @function of
 * @param {*} [x] - The value that should be set as the underlying
 * value of the {@link dataStructures.right}.
 * @return {dataStructures.right} - Returns a new object that delegates to the
 * {@link dataStructures.right}.
 */
Right.of = x => Right(x);

/**
 * @typedef {Object} right
 * @property {function} value - returns the underlying value of the the functor
 * @property {function} map - maps a single function over the underlying value of the functor
 * @property {function} bimap
 * @property {function} extract
 * @property {function} valueOf - returns the underlying value of the functor; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the identity functor and its underlying value
 * @property {function} factory - a reference to the right factory function
 * @property {function} [Symbol.Iterator] - Iterator for the right
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace right
 * @description This is the delegate object that specifies the behavior of the right functor. All
 * operations that may be performed on an right functor 'instance' delegate to this object. Right
 * functor 'instances' are created by the {@link dataStructures.Either|dataStructures.Right} factory function via Object.create,
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
     * see {@link dataStructures.right#map} and {@link dataStructures.right#bimap}. To
     * retrieve the underlying value of a right delegator, see {@link dataStructures.right#get},
     * {@link dataStructures.right#orElse}, {@link dataStructures.right#getOrElse},
     * and {@link dataStructures.right#valueOf}.
     * @memberOf dataStructures.right
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
    isRight: true,
    isLeft: false,
    /**
     * @signature () -> {@link dataStructures.right}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link dataStructures.right}
     * delegator instance.
     * @memberOf dataStructures.right
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.right}.
     * @return {dataStructures.right} Returns a new {@link dataStructures.right}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: sharedEitherFns.rightMap,
    /**
     * @signature (* -> *) -> (* -> *) -> dataStructures.right<T>
     * @description Since the constant functor does not represent a disjunction, the Identity's
     * bimap function property behaves just as its map function property. It is merely here as a
     * convenience so that swapping out monads/monads does not break an application that is
     * relying on its existence.
     * @memberOf dataStructures.right
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link dataStructures.right} delegator.
     * @param {function} [g] - An optional function that is simply ignored on the {@link dataStructures.right}
     * since there is no disjunction present.
     * @return {dataStructures.right} - Returns a new {@link dataStructures.right} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: sharedEitherFns.rightBiMap,
    /**
     * @signature () -> *
     * @description Accepts a function that is used to map over the identity's underlying value
     * and returns the returns value of the function without 're-wrapping' it in a new identity
     * monad instance.
     * @memberOf dataStructures.right
     * @instance
     * @function fold
     * @param {function} f - Any mapping function that should be applied to the underlying value
     * of the identity monad.
     * @param {function} g - An JavaScript value that should be used as an accumulator.
     * @return {*} Returns the return value of the mapping function provided as an argument.
     */
    fold: function _fold(f, g) {
        return g(this.value);
    },
    /**
     * @signature monad -> monad<monad<T>>
     * @description Returns a monad of the type passed as an argument that 'wraps'
     * and identity monad that 'wraps' the current identity monad's underlying value.
     * @memberOf dataStructures.right
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
     * of any type. Then the {@link dataStructures.Identity.of} function is used to map over the returned monad. Essentially
     * creating a new object of type: monad<Identity<T>>, where 'monad' is the type of monad the mapping
     * function returns.
     * @memberOf dataStructures.right
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
    apply: apply,
    /**
     * @signature * -> boolean
     * @description Determines if 'this' right functor is equal to another functor. Equality
     * is defined as:
     * 1) The other functor shares the same delegate object as 'this' identity functor
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.right
     * @instance
     * @function
     * @param {Object} ma - The other functor to check for equality with 'this' functor.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: disjunctionEqualMaker('isRight'),
    isEmpty: function _isEmpty() {
        return false;
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.right
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the functor and its
     * underlying value
     * @memberOf dataStructures.right
     * @instance
     * @function
     * @return {string} Returns a string representation of the right
     * and its underlying value.
     */
    toString: stringMaker('Right'),
    get [Symbol.toStringTag]() {
        return 'Right';
    },
    /**
     * @signature * -> {@link dataStructures.right}
     * @description Factory function used to create a new object that delegates to
     * the {@link dataStructures.right} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link dataStructures.right}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf dataStructures.right
     * @instance
     * @function
     * @see dataStructures.Either
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link dataStructures.right}.
     * @return {dataStructures.right} - Returns a new identity functor delegator
     */
    factory: Either
};

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
 * @memberOf dataStructures
 * @namespace left
 * @description This is the delegate object that specifies the behavior of the left functor. All
 * operations that may be performed on an left functor 'instance' delegate to this object. Left
 * functor 'instances' are created by the {@link dataStructures.Either|dataStructures.Left} factory function via Object.create,
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
     * see {@link dataStructures.left#map} and {@link dataStructures.left#bimap}.
     * To retrieve the underlying value of an identity_functor delegator, see {@link dataStructures.left#get},
     * {@link dataStructures.left#orElse}, {@link dataStructures.left#getOrElse},
     * and {@link dataStructures.left#valueOf}.
     * @memberOf dataStructures.left
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
    isRight: false,
    isLeft: true,
    /**
     * @signature () -> {@link dataStructures.left}
     * @description Takes a function that is applied to the underlying value of the
     * functor, the result of which is used to create a new {@link dataStructures.left}
     * delegator instance.
     * @memberOf dataStructures.left
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.left}.
     * @return {dataStructures.left} Returns a new {@link dataStructures.left}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     */
    map: sharedEitherFns.leftMapMaker(Left),
    /**
     * @signature (* -> *) -> (* -> *) -> dataStructures.left<T>
     * @description Since the constant functor does not represent a disjunction, the Identity's
     * bimap function property behaves just as its map function property. It is merely here as a
     * convenience so that swapping out monads/monads does not break an application that is
     * relying on its existence.
     * @memberOf dataStructures.left
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link dataStructures.left} delegator.
     * @param {function} [g] - An optional function that is simply ignored on the {@link dataStructures.left}
     * since there is no disjunction present.
     * @return {dataStructures.left} - Returns a new {@link dataStructures.left} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: sharedEitherFns.leftBimapMaker(Left),
    /**
     * @signature () -> *
     * @description Accepts a function that is used to map over the identity's underlying value
     * and returns the returns value of the function without 're-wrapping' it in a new identity
     * monad instance.
     * @memberOf dataStructures.left
     * @instance
     * @function fold
     * @param {function} f - Any mapping function that should be applied to the underlying value
     * of the identity monad.
     * @param {function} g - An JavaScript value that should be used as an accumulator.
     * @return {*} Returns the return value of the mapping function provided as an argument.
     */
    fold: function _fold(f, g) {
        return f(this.value);
    },
    /**
     * @signature monad -> monad<monad<T>>
     * @description Returns a monad of the type passed as an argument that 'wraps'
     * and identity monad that 'wraps' the current identity monad's underlying value.
     * @memberOf dataStructures.left
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
     * of any type. Then the {@link dataStructures.Identity.of} function is used to map over the returned monad. Essentially
     * creating a new object of type: monad<Identity<T>>, where 'monad' is the type of monad the mapping
     * function returns.
     * @memberOf dataStructures.left
     * @instance
     * @function traverse
     * @param {Object} a - A pointed monad with a '#of' function property. Used only in cases
     * where the mapping function cannot be run.
     * @param {function} f - A mapping function that should be applied to the identity's underlying value.
     * @return {Object} Returns a new identity monad that wraps the mapping function's returned monad type.
     */
    traverse: function _traverse(a, f) {
        return f(this.value).map(Left);
    },
    apply: function _apply(m) {
        return this;
    },
    /**
     * @signature * -> boolean
     * @description Determines if 'this' left functor is equal to another functor. Equality
     * is defined as:
     * 1) The other functor shares the same delegate object as 'this' identity functor
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.left
     * @instance
     * @function
     * @param {Object} ma - The other functor to check for equality with 'this' functor.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: disjunctionEqualMaker('isLeft'),
    isEmpty: function _isEmpty() {
        return true;
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current functor 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.left
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current functor 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the functor and its
     * underlying value
     * @memberOf dataStructures.left
     * @instance
     * @function
     * @return {string} Returns a string representation of the left
     * and its underlying value.
     */
    toString: stringMaker('Left'),
    get [Symbol.toStringTag]() {
        return 'Left';
    },
    /**
     * @signature * -> {@link dataStructures.left}
     * @description Factory function used to create a new object that delegates to
     * the {@link dataStructures.left} object. Any single value may be provided as an argument
     * which will be used to set the underlying value of the new {@link dataStructures.left}
     * delegator. If no argument is provided, the underlying value will be 'undefined'.
     * @memberOf dataStructures.left
     * @instance
     * @function
     * @see dataStructures.Either
     * @param {*} val - The value that should be set as the underlying
     * value of the {@link dataStructures.left}.
     * @return {dataStructures.left} - Returns a new identity functor delegator
     */
    factory: Either
};

right.chain = chain;
right.mjoin = join;

left.chain = chain;
left.mjoin = join;

right.ap = right.apply;
left.ap = left.apply;
right.flatMap = right.chain;
left.flatMap = left.chain;
right.bind = right.chain;
left.bind = left.chain;
right.reduce = right.fold;
left.reduce = left.fold;

right.constructor = right.factory;
left.constructor = left.factory;


export { Either, Left, Right, right, left };