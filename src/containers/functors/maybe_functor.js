import { disjunctionEqualMaker, maybeFactoryHelper, pointMaker, stringMaker,
        get, emptyGet, orElse, emptyOrElse, getOrElse, emptyGetOrElse, valueOf, sharedMaybeFns } from '../containerHelpers';

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {just_functor|nothing_functor} - b
 */
function fromNullable(x) {
    return null != x ? Just(x) : Nothing();
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor|nothing_functor} - b
 */
function Maybe(val) {
    return null == val ?
        Object.create(nothing_functor, {
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
        Object.create(just_functor, {
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
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor} - b
 */
Maybe.of = function _of(val) {
    return Object.create(just_functor, {
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
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Maybe.is = f => just_functor.isPrototypeOf(f) || nothing_functor.isPrototypeOf(f);

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor} - b
 */
Maybe.Just = Maybe.of;

/**
 * @sig
 * @description d
 * @return {nothing_functor} - a
 */
Maybe.Nothing = () => Maybe();

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Maybe.isJust = m => just_functor.isPrototypeOf(m);

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Maybe.isNothing = m => nothing_functor.isPrototypeOf(m);

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {just_functor|nothing_functor} - b
 */
Maybe.fromNullable = fromNullable;

//TODO: determine if there is any purpose in splitting a maybe into two types... if those sub-types
//TODO: are not exposed, what benefit is derived from them? And if they are exposed (Just being Identity,
//TODO: and Nothing being Constant(null)), then the maybe container has a direct dependency on the Identity
//TODO: and Constant containers. This becomes an issue due to circular dependencies.
/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor} - b
 */
function Just(val) {
    return Object.create(just_functor, {
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
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just_functor} - b
 */
Just.of = function _of(val) {
    return Object.create(just_functor, {
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
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Just.is = f => just_functor.isPrototypeOf(f);

/**
 * @sig
 * @description d
 * @return {nothing_functor} - a
 */
function Nothing() {
    return Object.create(nothing_functor, {
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
 * @sig
 * @description d
 * @return {nothing_functor} - a
 */
Nothing.of = Nothing;

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Nothing.is = f => nothing_functor.isPrototypeOf(f);

//TODO: Using this.of in order to create a new instance of a Maybe container (functor/monad) will
//TODO: not work as it is implemented here in terms of creating a new maybe container with the
//TODO: proper values for the '.isJust' and '.isNothing' fields. The problem is that the '.of'
//TODO: function property will create a new maybe instance with whatever value it receives as
//TODO: as argument and treat the new maybe container instance as a 'Just', regardless of the
//TODO: actual underlying value. As 'null' and 'undefined' underlying values are traditionally
//TODO: treated as 'Nothing' maybe values, this will cause a problem during mapping/flat-mapping/etc.

var just_functor = {
    get value() {
        return this._value;
    },
    map: sharedMaybeFns.justMap,
    bimap: sharedMaybeFns.justBimap,
    get: get,
    getOrElse: getOrElse,
    orElse: orElse,
    of: pointMaker(Just),
    valueOf: valueOf,
    toString: stringMaker('Just'),
    factory: Maybe
};

/**
 * @description:
 * @return:
 */
just_functor.equals = disjunctionEqualMaker(just_functor, 'isJust');

var nothing_functor = {
    get value() {
        return this._value;
    },
    map: sharedMaybeFns.nothingMapMaker(Nothing),
    bimap: sharedMaybeFns.nothingBimapMaker(Nothing),
    get: emptyGet,
    getOrElse: emptyGetOrElse,
    orElse: emptyOrElse,
    of: pointMaker(Just),
    valueOf: valueOf,
    toString: function _toString() {
        return 'Nothing()';
    },
    factory: Maybe
};

/**
 * @description:
 * @return:
 */
nothing_functor.equals = disjunctionEqualMaker(nothing_functor, 'isNothing');


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
just_functor.constructor = just_functor.factory;
nothing_functor.constructor = nothing_functor.factory;

export { Maybe, Just, Nothing, just_functor, nothing_functor };