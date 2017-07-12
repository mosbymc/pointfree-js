import { disjunctionEqualMaker, pointMaker, stringMaker, valueOf, get, orElse, getOrElse, sharedEitherFns } from '../containerHelpers';

/**
 * @type:
 * @description:
 * @param: {*} val
 * @param: {string} fork
 * @return: {@see left_functor|@see right_functor}
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
 * @type:
 * @description:
 * @param: {*} x
 * @return: {@see right_functor}
 */
Either.of = x => Either(x, 'right');

/**
 * @type:
 * @description:
 * @param: {functor} f
 * @return: {boolean}
 */
Either.is = f => Left.is(f) || Right.is(f);

/**
 * @type:
 * @description:
 * @param: {functor} f
 * @return: {boolean}
 */
Either.isRight = f => f.isRight;

/**
 * @type:
 * @description:
 * @param: {functor} f
 * @return: {boolean}
 */
Either.isLeft = f => f.isLeft;

/**
 * @type:
 * @description:
 * @param: {*} x
 * @return: {@see right_functor}
 */
Either.Right = x => Either(x, 'right');

/**
 * @type:
 * @description:
 * @param: {*} x
 * @return: {@see left_functor}
 */
Either.Left = x => Either(x);

/**
 * @type:
 * @description:
 * @param: {*} val
 * @return: {@see left_functor}
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
 * @type:
 * @description:
 * @param: {*} x
 * @return: {@see left_functor}
 */
Left.of = x => Left(x);

/**
 * @type:
 * @description:
 * @param: {functor} f
 * @return: {boolean}
 */
Left.is = f => left_functor.isPrototypeOf(f);

/**
 * @type:
 * @description:
 * @param: {*} val
 * @return: {@see right_functor}
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
 * @type:
 * @description:
 * @param: {functor} x
 * @return: {boolean}
 */
Right.is = x => right_functor.isPrototypeOf(x);

/**
 * @type:
 * @description:
 * @param: {*} x
 * @return: {@see right_functor}
 */
Right.of = x => Right(x);

var right_functor = {
    get value() {
        return this._value;
    },
    /**
     * @description:
     * @param: {function|undefined} fn
     * @return: {@see either_functor}
     */
    map: sharedEitherFns.rightMap,
    /**
     * @type:
     * @description:
     * @param: {function} f
     * @param: {function} g
     * @return: {@see right_functor}
     */
    bimap: sharedEitherFns.rightBiMap,
    /**
     * @type:
     * @description:
     * @return: {*}
     */
    get: get,
    /**
     * @type:
     * @description:
     * @param: {*} x
     * @return: {*}
     */
    getOrElse: getOrElse,
    /**
     * @type:
     * @description:
     * @param: {function} f
     * @return: {@see right_functor}
     */
    orElse: orElse,
    of: pointMaker(Right),
    valueOf: valueOf,
    toString: stringMaker('Right'),
    factory: Either
};

/**
 * @description:
 * @return:
 */
right_functor.equals = disjunctionEqualMaker(right_functor, 'isRight');

var left_functor = {
    get value() {
        return this._value;
    },
    /**
     * @description:
     * @return: {@see either_functor}
     */
    map: sharedEitherFns.leftMapMaker(Left),
    /**
     * @description:
     * @param: {function} f
     * @param: {function} g
     * @return: {@see left_functor}
     */
    bimap: sharedEitherFns.leftBimapMaker(Left),
    /**
     * @type:
     * @description:
     * @param: {*} x
     * @return: {*}
     */
    getOrElse: function _getOrElse(x) {
        return x;
    },
    /**
     * @type:
     * @description:
     * @param: {function} f
     * @return: {*}
     */
    orElse: function _orElse(f) {
        return f();
    },
    of: pointMaker(Right),
    valueOf: valueOf,
    toString: stringMaker('Left'),
    factory: Either
};

/**
 * @description:
 * @return:
 */
left_functor.equals = disjunctionEqualMaker(left_functor, 'isLeft');

function fromNullable(x) {
    return null != x ? Right(x) : Left(x);
}



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