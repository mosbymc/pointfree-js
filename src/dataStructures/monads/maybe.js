import { identity } from '../../combinators';
import { apply, chain, mjoin, disjunctionEqualMaker, maybeFactoryHelper, pointMaker, stringMaker,
    get, emptyGet, orElse, emptyOrElse, getOrElse, emptyGetOrElse, valueOf, sharedMaybeFns } from '../dataStructureHelpers';

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {just|nothing} - b
 */
function fromNullable(x) {
    return null != x ? Just(x) : Nothing();
}

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just|nothing} - b
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
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just} - b
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
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Maybe.is = f => just.isPrototypeOf(f) || nothing.isPrototypeOf(f);

/**
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just} - b
 */
Maybe.Just = Maybe.of;

/**
 * @sig
 * @description d
 * @return {nothing} - a
 */
Maybe.Nothing = () => Maybe();

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Maybe.isJust = m => just.isPrototypeOf(m);

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Maybe.isNothing = m => nothing.isPrototypeOf(m);

/**
 * @sig
 * @description d
 * @param {*} x - a
 * @return {just|nothing} - b
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
 * @return {just} - b
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
 * @sig
 * @description d
 * @param {*} val - a
 * @return {just} - b
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
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Just.is = f => just.isPrototypeOf(f);

/**
 * @sig
 * @description d
 * @return {nothing} - a
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
 * @sig
 * @description d
 * @return {nothing} - a
 */
Nothing.of = Nothing;

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Nothing.is = f => nothing.isPrototypeOf(f);

//TODO: Using this.of in order to create a new instance of a Maybe container (functor/monad) will
//TODO: not work as it is implemented here in terms of creating a new maybe container with the
//TODO: proper values for the '.isJust' and '.isNothing' fields. The problem is that the '.of'
//TODO: function property will create a new maybe instance with whatever value it receives as
//TODO: as argument and treat the new maybe container instance as a 'Just', regardless of the
//TODO: actual underlying value. As 'null' and 'undefined' underlying values are traditionally
//TODO: treated as 'Nothing' maybe values, this will cause a problem during mapping/flat-mapping/etc.

var just = {
    get value() {
        return this._value;
    },
    map: sharedMaybeFns.justMap,
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
    get: get,
    getOrElse: getOrElse,
    orElse: orElse,
    of: pointMaker(Just),
    valueOf: valueOf,
    toString: stringMaker('Just'),
    factory: Maybe
};

just.chain = chain;
just.mjoin = mjoin;
just.apply = apply;

/**
 * @description:
 * @return:
 */
just.equals = disjunctionEqualMaker(just, 'isJust');

var nothing = {
    get value() {
        return this._value;
    },
    map: sharedMaybeFns.nothingMapMaker(Nothing),
    bimap: sharedMaybeFns.nothingBimapMaker(Nothing),
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
nothing.equals = disjunctionEqualMaker(nothing, 'isNothing');

nothing.chain = chain;
nothing.mjoin = mjoin;
nothing.apply = apply;

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