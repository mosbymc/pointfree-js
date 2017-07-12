import { disjunctionEqualMaker, maybeFactoryHelper, pointMaker, stringMaker, valueOf, sharedMaybeFns } from '../containerHelpers';

/**
 * @type:
 * @description:
 * @param: {*} val
 * @return: {@see just_functor|@see nothing_functor}
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
 * @description:
 * @param: {*} val
 * @return: {@see maybe_functor}
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
 * @description:
 * @param: {functor} f
 * @return: {boolean}
 */
Maybe.is = f => just_functor.isPrototypeOf(f) || nothing_functor.isPrototypeOf(f);

/**
 * @description:
 * @param {*} val
 * @return: {@see maybe_functor}
 * @type {function}
 */
Maybe.Just = Maybe.of;

/**
 * @description:
 * @return: {@see maybe_functor}
 */
Maybe.Nothing =  () => Maybe();

/**
 * @type:
 * @description:
 * @param: {functor} m
 * @return: {boolean}
 */
Maybe.isJust = m => just_functor.isPrototypeOf(m);

/**
 * @type:
 * @description:
 * @param: {functor} m
 * @return: {boolean}
 */
Maybe.isNothing = m => nothing_functor.isPrototypeOf(m);

/**
 * @type:
 * @description:
 */
var maybeCreator = maybeFactoryHelper(Maybe);

var maybeOf = {
    of: function _of(val) {
        return Maybe(val);
    }
};

//TODO: determine if there is any purpose in splitting a maybe into two types... if those sub-types
//TODO: are not exposed, what benefit is derived from them? And if they are exposed (Just being Identity,
//TODO: and Nothing being Constant(null)), then the maybe container has a direct dependency on the Identity
//TODO: and Constant containers. This becomes an issue due to circular dependencies.
/**
 * @type:
 * @description:
 * @param: {*} val
 * @return: {@see just_functor}
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
 * @type:
 * @description:
 * @param: {*} val
 * @return: {@see just_functor}
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
 * @type:
 * @description:
 * @param: {functor} f
 * @return: {boolean}
 */
Just.is = f => just_functor.isPrototypeOf(f);

/**
 * @type:
 * @description:
 * @return: {@see nothing_functor}
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
 * @type:
 * @description:
 * @return: {@see nothing_functor}
 */
Nothing.of = Nothing;

/**
 * @type:
 * @description:
 * @param: {functor} f
 * @return: {boolean}
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
    getOrElse: function _getOrElse(x) {
        return this.value;
    },
    orElse: function _orElse(f) {
        return this;
    },
    of: pointMaker(Just),
    valueOf: valueOf,
    toString: stringMaker('Just'),
    factory: Just
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
    getOrElse: function _getOrElse(x) {
        return x;
    },
    orElse: function _orElse(f) {
        return f();
    },
    of: pointMaker(Just),
    valueOf: valueOf,
    toString: function _toString() {
        return `Nothing()`;
    },
    factory: Nothing
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