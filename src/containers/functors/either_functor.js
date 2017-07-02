import { disjunctionEqualMaker, pointMaker, stringMaker, valueOf, sharedEitherFns } from '../containerHelpers';

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

Either.of = x => Either(x, 'right');

Either.is = f => Left.is(f) || Right.is(f);

Either.isRight = f => f.isRight;

Either.isLeft = f => f.isLeft;

Either.Right = x => Either(x, 'right');

Either.Left = x => Either(x);

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

Left.of = x => Left(x);

Left.is = f => left_functor.isPrototypeOf(f);

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

Right.is = x => right_functor.isPrototypeOf(x);

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
    bimap: sharedEitherFns.rightBiMap,
    factory: Either
};

/**
 * @description:
 * @return:
 */
right_functor.equals = disjunctionEqualMaker(right_functor, 'isRight');

/**
 * @description:
 * @return:
 */
right_functor.of = pointMaker(Right);

/**
 * @description:
 * @return:
 */
right_functor.valueOf = valueOf;

/**
 * @description:
 * @return:
 */
right_functor.toString = stringMaker('Right');

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
     * @description:
     * @param: {functor} ma
     * @return: {boolean}
     */
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && ma.isLeft && this.value === ma.value;
    },
    factory: Either
};

/**
 * @description:
 * @return:
 */
//left_functor.equals = disjunctionEqualMaker(left_functor, 'isLeft');

/**
 * @description:
 * @return:
 */
left_functor.of = pointMaker(Right);

/**
 * @description:
 * @return:
 */
left_functor.valueOf = valueOf;

/**
 * @description:
 * @return:
 */
left_functor.toString = stringMaker('Left');




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