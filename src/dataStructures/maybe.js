import { identity } from '../combinators';
import { apply, chain, contramap, dimap, join, disjunctionEqualMaker, stringMaker, valueOf, sharedMaybeFns } from './data_structure_util';

/**
 * @signature
 * @description Returns a just or nothing data structure based on a loose equals null comparison. If
 * the argument passed to the function loose equals null, a nothing is returned; other wise,
 * a just.
 * @private
 * @param {*} x - Any value that should be placed inside a maybe type.
 * @return {dataStructures.just|dataStructures.nothing} - Either a just or a nothing
 */
function fromNullable(x) {
    return null != x ? Just(x) : Nothing();
}

var returnNothing = () => nothing;


/**
 * @signature - :: * -> dataStructures.just|dataStructures.nothing
 * @description Factory function used to create a new object that delegates to either
 * the {@link dataStructures.just} object or the {@link dataStructures.nothing}. Any 
 * single value may be provided as an argument which will be used to set the underlying 
 * value of the new {@link dataStructures.just|dataStructures.nothing} delegator. If no 
 * argument is provided, the underlying value will be 'undefined'.
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
            _value: { value: val }
        });
}

/**
 * @signature * -> {@link dataStructures.just}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.just} object delegator instance.
 * In the case of a Maybe, the 'correct' context simply means that a {@link dataStructures.just}
 * will be returned, even if null or undefined are given as the argument. This function can
 * be viewed as an alias for {@link dataStructures.Just}
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
 * @description Creates and returns a new {@link dataStructures.nothing} data structure
 * @memberOf dataStructures.Maybe
 * @function Nothing
 * @return {dataStructures.nothing} A new {@link dataStructures.nothing}
 */
Maybe.Nothing = () => Maybe();

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'just' data structure
 * @memberOf dataStructures.Maybe
 * @function is
 * @param {Object} [m] - a
 * @return {boolean} - b
 */
Maybe.isJust = m => just.isPrototypeOf(m);

/**
 * @signature Object -> boolean
 * @description Takes any object and returns a boolean indicating if the object is
 * a 'nothing' data structure
 * @memberOf dataStructures.Maybe
 * @function is
 * @param {Object} [m] - a
 * @return {boolean} - b
 */
Maybe.isNothing = m => nothing === m;

/**
 * @signature * -> dataStructures.left|dataStructures.right
 * @description Takes any value and returns a 'nothing' if the value
 * loose equals null; other wise returns a 'just'
 * @memberOf dataStructures.Maybe
 * @function is
 * @param {*} [x] - a
 * @return {dataStructures.left|dataStructures.right} - b
 */
Maybe.fromNullable = fromNullable;

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
        }
    });
}

/**
 * @signature * -> {@link dataStructures.just}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.just} object delegator instance.
 * Because the just data structure does not require any specific context for
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
function Nothing() {
    return nothing;
}

/**
 * @signature * -> {@link dataStructures.nothing}
 * @description Takes any value and places it in the correct context if it is
 * not already and creates a new {@link dataStructures.nothing} object delegator instance.
 * Because the nothing data structure does not require any specific context for
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
 * @description Convenience function for determining if a value is a {@link dataStructures.nothing}.
 * Available on the {@link left}'s factory function as dataStructures.Nothing#is
 * @memberOf dataStructures.Nothing
 * @function is
 * @param {*} [n] - Any value may be used as an argument to this function.
 * @return {boolean} Returns a boolean that indicates whether the
 * argument provided delegates to the {@link dataStructures.nothing} delegate.
 */
Nothing.is = n => nothing === n;

/**
 * @typedef {Object} just
 * @property {function} extract - returns the underlying value of the just
 * @property {function} map - maps a single function over the underlying value of the just
 * @property {function} chain
 * @property {function} join
 * @property {function} apply
 * @property {function} bimap
 * @property {function} contramap
 * @property {function} dimap
 * @property {function} fold
 * @property {function} sequence
 * @property {function} traverse
 * @property {function} isEmpty
 * @property {boolean} isJust
 * @property {boolean} isNothing
 * @property {function} valueOf - returns the underlying value of the just; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the just and its underlying value
 * @property {function} factory - a reference to the just factory function
 * @property {function} [Symbol.Iterator] - Iterator for the just
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace just
 * @description This is the delegate object that specifies the behavior of the just data structure. All
 * operations that may be performed on a just 'instance' delegate to this object. Just
 * 'instances' are created by the {@link dataStructures.Just|dataStructures.Nothing} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an just instance beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var just = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of a just instance. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of a just,
     * see {@link dataStructures.just#map} and {@link dataStructures.just#bimap}. To
     * retrieve the underlying value of a 'just', see {@link dataStructures.just#get},
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
    isJust: function _isJust() {
        return true;
    },
    isNothing: function _isNothing() {
        return false;
    },
    /**
     * @signature () -> {@link dataStructures.just}
     * @description Takes a function that is applied to the underlying value of the
     * 'just' instance, the result of which is used to create a new {@link dataStructures.just}
     * instance.
     * @memberOf dataStructures.just
     * @instance
     * @param {function} fn - A mapping function that can operate on the underlying
     * value of the {@link dataStructures.just}.
     * @return {dataStructures.just} Returns a new {@link dataStructures.just}
     * delegator whose underlying value is the result of the mapping operation
     * just performed.
     *
     * @example Just(10).map(x => x * x)    // => Just(100)
     */
    map: sharedMaybeFns.justMap,
    /**
     * @signature () -> {@link dataStructures.just}
     * @description Accepts a mapping function as an argument, applies the function to the
     * underlying value. If the mapping function returns a just data structure, chain will 'flatten'
     * the nested justs by one level. If the mapping function does not return a just,
     * chain will return a just data structure that 'wraps' whatever the return value
     * of the mapping function is. However, if the mapping function does not return a data structure  of
     * the same type, then chain is probably not the functionality you should use. See
     * {@link dataStructures.just#map} instead.
     *
     * Alias: bind, flatMap
     * @memberOf dataStructures.just
     * @instance
     * @function chain
     * @param {function} fn - A mapping function that returns a data structure of the same type
     * @return {Object} Returns a new identity data structure that 'wraps' the return value of the
     * mapping function after flattening it by one level.
     *
     * @example
     * Just(10).chain(x => Just(x * x))         // => Just(100)
     * Just(10).chain(x => x * x)               // => Just(100)
     * Just(10).chain(x => Identity(x * x))     // => Just(Identity(100))
     */
    chain: chain,
    /**
     * @signature () -> {@link dataStructures.just}
     * @description Returns a new just data structure. If the current just is nested, join
     * will flatten it by one level. Very similar to {@link dataStructures.just#chain} except no
     * mapping function is accepted or run.
     * @memberOf dataStructures.just
     * @instance
     * @function mjoin
     * @return {Object} Returns a new identity after flattening the nested data structures by one level.
     *
     * @example
     * Just(Just(10)).join()        // => Just(10)
     * Just(Identity(10)).join()    // => Just(Identity(10))
     * Just(10).join()              // => Identity(10)
     */
    mjoin: join,
    /**
     * @signature Object -> Object
     * @description Accepts any applicative object with a mapping function and invokes that object's mapping
     * function on the just's underlying value. In order for this function to execute properly and
     * not throw, the just's underlying value must be a function that can be used as a mapping function
     * on the data structure supplied as the argument.
     *
     * Alias: ap
     * @memberOf dataStructures.just
     * @instance
     * @function apply
     * @param {Object} ma - Any data structure with a map function - i.e. a functor.
     * @return {Object} Returns an instance of the data structure object provide as an argument.
     *
     * @example Just(x => x + 10).apply(Identity(10))  // => Identity(20)
     */
    apply: apply,
    /**
     * @signature (* -> *) -> (* -> *) -> dataStructures.just<T>
     * @description Acts as a map for the disjunction between just and nothing data structures. If the
     * data structure that bimap was invoked on is a just, the first mapping function parameter is used 
     * to map over the underlying value and a new just is returned, 'wrapping' the return value of the 
     * function. If the data structure is a nothing, the second mapping function is invoked with a 'null' 
     * valued argument and 'nothing' is returned.
     * @memberOf dataStructures.just
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link dataStructures.just} delegator.
     * @param {function} g - A function that will be used to map over a null value if this is a
     * 'nothing' instance.
     * @return {dataStructures.just} - Returns a new {@link dataStructures.just} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: sharedMaybeFns.justBimap,
    /**
     * @signature () -> *
     * @description Accepts a function that is used to map over the just's underlying value
     * and returns the value of the function without 're-wrapping' it in a new just
     * instance.
     *
     * Alias: reduce
     * @memberOf dataStructures.just
     * @instance
     * @function fold
     * @param {function} f - Any mapping function that should be applied to the underlying value
     * of the just.
     * @param {function} g - An JavaScript value that should be used as an accumulator.
     * @return {*} Returns the return value of the mapping function provided as an argument.
     *
     * @example Just(10).fold((acc, x) => x + acc, 5)   // => 15
     */
    fold: function _fold(f, g) {
        return f(this.value);
    },
    /**
     * @signature just -> M<just<T>>
     * @description Returns a data structure of the type passed as an argument that 'wraps'
     * and identity object that 'wraps' the current just's underlying value.
     * @memberOf dataStructures.just
     * @instance
     * @function sequence
     * @param {Object} p - Any pointed data structure with a '#of' function property
     * @return {Object} Returns a data structure of the type passed as an argument that 'wraps'
     * a just that 'wraps' the current just's underlying value.
     */
    sequence: function _sequence(p) {
        return this.traverse(identity, p);
    },
    /**
     * @signature Object -> () -> Object
     * @description Accepts a pointed data structure with a '#of' function property and a mapping function. The mapping
     * function is applied to the just's underlying value. The mapping function should return a data structure
     * of any type. Then the {@link dataStructures.Just.of} function is used to map over the returned data structure. Essentially
     * creating a new object of type: M<Just<T>>, where 'M' is the type of data structure the mapping
     * function returns.
     * @memberOf dataStructures.just
     * @instance
     * @function traverse
     * @param {Object} a - A pointed data structure with a '#of' function property. Used only in cases
     * where the mapping function cannot be run.
     * @param {function} f - A mapping function that should be applied to the just's underlying value.
     * @return {Object} Returns a new just that wraps the mapping function's returned data structure type.
     *
     * @example Just(10).traverse(Identity, x => Identity(x * x))   // => Identity(Just(100))
     */
    traverse: function _traverse(a, f) {
        return f(this.value).map(this.factory.of);
    },
    /**
     * @signature (b -> a) -> dataStructures.Just
     * @description This property is for contravariant just data structures and will not function
     * correctly if the underlying value is anything other than a function. Contramap accepts a
     * function argument and returns a new just with the composition of the function argument and
     * the underlying function value as the new underlying. The supplied function argument is executed
     * first in the composition, so its signature must be (b -> a) so that the value it passes as an
     * argument to the previous underlying function will be of the expected type.
     * @memberOf dataStructures.just
     * @instance
     * @function contramap
     * @param {function} fn - A function that should be composed with the current just's
     * underlying function.
     * @return {dataStructures.just} Returns a new just data structure.
     *
     * @example Just(x => x * x).contramap(x => x + 10).apply(Just(5))  // => Just(225)
     */
    contramap: contramap,
    /**
     * @signature dimap :: (b -> a) -> (d -> c) -> just<c>
     * @description Like {@link dataStructures.just#contramap}, dimap is for use on contravariant
     * identity instances, and thus, requires that the just instance dimap is invoked on has an
     * underlying function value. Dimap accepts two arguments, both of them functions. The first argument
     * is used to map over the input the current contravariant just, while the second argument maps
     * over the output. Dimap is like contramap, but with an additional mapping thrown in after it has run.
     * Thus, dimap can be derived from contramap and map: j.dimap(f, g) === i.contramap(f).map(g)
     * @memberOf dataStructures.just
     * @instance
     * @function dimap
     * @param {function} f - f
     * @param {function} g - g
     * @return {dataStructures.just} l
     *
     * @example Just(x => x * x).dimap(x => x + 10, x => x / 5).apply(Just(5))  // => Just(45)
     */
    dimap: dimap,
    /**
     * @signature * -> boolean
     * @description Determines if the current 'just' is equal to another data structure. Equality
     * is defined as:
     * 1) The other data structure shares the same delegate object as 'this'
     * 2) Both underlying values are strictly equal to each other
     * @memberOf dataStructures.just
     * @instance
     * @function
     * @param {Object} ma - The other data structure to check for equality with
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: disjunctionEqualMaker('isJust'),
    isEmpty: function _isEmpty() {
        return false;
    },
    extend: function _extend(fn) {
        return Maybe(fn(this));
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current just 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.just
     * @instance
     * @function
     * @return {*} Returns the underlying value of the current 'just' 'instance'.
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the 'just' and its underlying value
     * @memberOf dataStructures.just
     * @instance
     * @function
     * @return {string} Returns a string representation of the just and its underlying value.
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
     * @return {dataStructures.just|dataStructures.nothing} - Returns a new just or nothing data structure
     */
    factory: Maybe
};

/**
 * @typedef {Object} nothing
 * @property {function} extract - returns the underlying value of the 'nothing' data structure (always null)
 * @property {function} map - maps a single function over the underlying value of the 'nothing'
 * @property {function} chain
 * @property {function} join
 * @property {function} apply
 * @property {function} bimap
 * @property {function} contramap
 * @property {function} dimap
 * @property {function} fold
 * @property {function} sequence
 * @property {function} traverse
 * @property {function} isEmpty
 * @property {boolean} isJust
 * @property {boolean} isNothing
 * @property {function} valueOf - returns the underlying value of the 'nothing'; used during concatenation and coercion
 * @property {function} toString - returns a string representation of the 'nothing' and its underlying value
 * @property {function} factory - a reference to the 'nothing' factory function
 * @property {function} [Symbol.Iterator] - Iterator for the 'nothing'
 * @kind {Object}
 * @memberOf dataStructures
 * @namespace nothing
 * @description This is the delegate object that specifies the behavior of the 'nothing' data structure. All
 * operations that may be performed on a 'nothing' delegate to this object. Nothing 'instances' are created by 
 * the {@link dataStructures.Nothing|dataStructures.Maybe} factory function via Object.create, during which 
 * the underlying value is placed directly on the newly created object. No other properties exist directly on 
 * the 'nothing' data structure beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var nothing = {
    /**
     * @signature () -> *
     * @description Returns the underlying value of a 'nothing' data structure. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of a 'nothing', see {@link dataStructures.nothing#map} 
     * and {@link dataStructures.nothing#bimap}. To retrieve the underlying value of a
     * 'nothing', see {@link dataStructures.nothing#get}, {@link dataStructures.nothing#orElse}, 
     * {@link dataStructures.nothing#getOrElse}, and {@link dataStructures.nothing#valueOf}.
     * @memberOf dataStructures.nothing
     * @instance
     * @protected
     * @function
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    value: null,
    isJust: function _isJust() {
        return false;
    },
    isNothing: function _isNothing() {
        return true;
    },
    /**
     * @signature () -> {@link dataStructures.nothing}
     * @description Takes a single function as an argument and returns 'nothing'. A 'nothing' cannot
     * be mapped over, so the result of the mapping operation is to return 'nothing' while ignoring
     * the provided function argument.
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
     * @description Acts as a map for the disjunction between just and nothing data structures. If the
     * data structure that bimap was invoked on is a just, the first mapping function parameter is used 
     * to map over the underlying value and a new just is returned, 'wrapping' the return value of the 
     * function. If the data structure is a nothing, the second mapping function is invoked with a 'null' 
     * valued argument and 'nothing' is returned.
     * @memberOf dataStructures.nothing
     * @instance
     * @function
     * @param {function} f - A function that will be used to map over the underlying data of the
     * {@link dataStructures.just} delegator.
     * @param {function} g - A function that will be used to map over a null value if this is a
     * 'nothing' instance.
     * @return {dataStructures.just} - Returns a new {@link dataStructures.just} delegator after applying
     * the mapping function to the underlying data.
     */
    bimap: returnNothing,
    chain: returnNothing,
    mjoin: returnNothing,
    apply: returnNothing,
    fold: function _fold(f, g) {
        return Nothing();
    },
    sequence: function _sequence(p) {
        return this.traverse(p, p.of);
    },
    traverse: function _traverse(a, f) {
        return a.of(Maybe.Nothing());
    },
    nothing: returnNothing,
    extend: returnNothing,
    /**
     * @signature * -> boolean
     * @description Determines if 'this' nothing is equal to another data structure. Equality
     * is defined as:
     * 1) The other monad shares the same delegate object as 'this' nothing monad
     * 2) Both underlying values are strictly equal to each other
     * Since 'nothing' is a singleton, the actual operation is a strict equality comparison
     * between the both data structures; if they both point to the same place in memory, they
     * are equal.
     * @memberOf dataStructures.nothing
     * @instance
     * @function
     * @param {Object} ma - The other data structure to check for equality.
     * @return {boolean} - Returns a boolean indicating equality
     */
    equals: Nothing.is,
    isEmpty: function _isEmpty() {
        return true;
    },
    /**
     * @signature () -> *
     * @description Returns the underlying value of the current 'nothing' 'instance'. This
     * function property is not meant for explicit use. Rather, the JavaScript engine uses
     * this property during implicit coercion like addition and concatenation.
     * @memberOf dataStructures.nothing
     * @instance
     * @function
     * @return {*} Returns the underlying value of the 'nothing'
     */
    valueOf: valueOf,
    /**
     * @signature () -> string
     * @description Returns a string representation of the 'nothing' and its underlying value
     * @memberOf dataStructures.nothing
     * @instance
     * @function
     * @return {string} Returns a string representation of the 'nothing' and its underlying value.
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
     * @return {dataStructures.nothing} - Returns 'nothing'
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
