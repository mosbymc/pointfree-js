import { disjunctionEqualMaker, pointMaker, stringMaker, valueOf,
        get, emptyGet, orElse, emptyOrElse, getOrElse, emptyGetOrElse, sharedEitherFns } from '../containerHelpers';

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {left_functor|right_functor} - b
 */
function fromNullable(x) {
    return null != x ? Right(x) : Left(x);
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @param {string} fork - b
 * @return {left_functor|right_functor} - c
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

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {right_functor} - b
 */
Either.of = x => Either(x, 'right');

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Either.is = f => Left.is(f) || Right.is(f);

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Either.isRight = f => f.isRight;

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Either.isLeft = f => f.isLeft;

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {right_functor} - b
 */
Either.Right = x => Either(x, 'right');

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {left_functor} - b
 */
Either.Left = x => Either(x);

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {left_functor|right_functor} - b
 */
Either.fromNullable = fromNullable;

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {left_functor} - b
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
 * @sig
 * @description d
 * @param {*} x - a
 * @return {left_functor} - b
 */
Left.of = x => Left(x);

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Left.is = f => left_functor.isPrototypeOf(f);

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {right_functor} - b
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
 * @sig
 * @description d
 * @param {Object} x - a
 * @return {boolean} - b
 */
Right.is = x => right_functor.isPrototypeOf(x);

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {right_functor} - b
 */
Right.of = x => Right(x);

var right_functor = {
    get value() {
        return this._value;
    },
    /**
     * @description d
     * @param {function|undefined} fn - a
     * @return {right_functor} - b
     */
    map: sharedEitherFns.rightMap,
    /**
     * @sig
     * @description d
     * @param {function} f - a
     * @param {function} g - b
     * @return {right_functor} - c
     */
    bimap: sharedEitherFns.rightBiMap,
    /**
     * @sig
     * @description d
     * @return {*} - a
     */
    get: get,
    /**
     * @sig
     * @description d
     * @param {*} x - a
     * @return {*} - b
     */
    getOrElse: getOrElse,
    /**
     * @sig
     * @description d
     * @param {function} f - a
     * @return {right_functor} - b
     */
    orElse: orElse,
    of: pointMaker(Right),
    valueOf: valueOf,
    toString: stringMaker('Right'),
    factory: Either
};

/**
 * @description
 * @return
 */
right_functor.equals = disjunctionEqualMaker(right_functor, 'isRight');

var left_functor = {
    get value() {
        return this._value;
    },
    /**
     * @description d
     * @return {left_functor} - b
     */
    map: sharedEitherFns.leftMapMaker(Left),
    /**
     * @sig
     * @description d
     * @param {function} f - a
     * @param {function} g - b
     * @return {left_functor} - c
     */
    bimap: sharedEitherFns.leftBimapMaker(Left),
    /**
     * @sig
     * @description d
     * @return {*} - a
     */
    get: emptyGet,
    /**
     * @sig
     * @description d
     * @param {*} x - a
     * @return {*} - b
     */
    getOrElse: emptyGetOrElse,
    /**
     * @sig
     * @description d
     * @param {function} f - a
     * @return {*} - b
     */
    orElse: emptyOrElse,
    of: pointMaker(Right),
    valueOf: valueOf,
    toString: stringMaker('Left'),
    factory: Either
};

/**
 * @sig
 * @description d
 * @return {boolean} - a
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