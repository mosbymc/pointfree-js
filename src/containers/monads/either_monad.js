import { right_functor, left_functor } from '../functors/either_functor';
import { identity } from '../../combinators';
import { apply, chain, mjoin, pointMaker, sharedEitherFns } from '../containerHelpers';

function Either(val, fork) {
    return 'right' === fork ?
        Object.create(right_monad, {
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
        }) :
        Object.create(left_monad, {
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

Either.of = function _of(val) {
    return Either(val, 'right');
};

/**
 * @description:
 * @param: {monad} m
 * @return: {boolean}
 */
Either.is = m => left_monad.isPrototypeOf(m) || right_monad.isPrototypeOf(m);

Either.Left = function _left(val) {
    return Either(val);
};

Either.Right = function _right(val) {
    return Either(val, 'right');
};

Either.isLeft = function _isLeft(ma) {
    return ma.isLeft;
};

Either.isRight = function _isRight(ma) {
    return ma.isRight;
};

function Left(val) {
    return Either(val);
}

/**
 * @description:
 * @param: {*} val
 * @return: {@see left_monad}
 */
Left.of = val => Left(val);

/**
 * @description:
 * @param: {monad} m
 * @return: {boolean}
 */
Left.is = m => left_monad.isPrototypeOf(m);

function Right(val) {
    return Either(val, 'right');
}

/**
 * @description:
 * @param: {*} val
 * @return: {@see right_monad}
 */
Right.of = val => Right(val);

/**
 * @description:
 * @param: {monad} m
 * @return: {boolean}
 */
Right.is = m => right_monad.isPrototypeOf(m);


var right_monad = Object.create(right_functor, {
    map: {
        value: sharedEitherFns.rightMap
    },
    bimap: {
        value: sharedEitherFns.rightBiMap
    },
    fold: {
        value: function _fold(fn) {
            return fn(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f, g) {
            return f(this.value).map(this.of);
        }
    },
    of: {
        value: pointMaker(Right),
        writable: false,
        configurable: false
    },
    factory: {
        value: Either
    }
});

right_monad.chain = chain;
right_monad.mjoin = mjoin;
right_monad.apply = apply;


var left_monad = Object.create(left_functor, {
    map: {
        value: sharedEitherFns.leftMapMaker(Left)
    },
    bimap: {
        value: sharedEitherFns.leftBimapMaker(Left)
    },
    fold: {
        value: function _fold(fn) {
            return fn(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return a.of(Left(this.value));
        }
    },
    of: {
        value: pointMaker(Right),
        writable: false,
        configurable: false
    },
    factory: {
        value: Either
    }
});

left_monad.chain = chain;
left_monad.mjoin = mjoin;
left_monad.apply = apply;



right_monad.ap = right_monad.apply;
left_monad.ap = left_monad.apply;
right_monad.flatMap = right_monad.chain;
left_monad.flatMap = left_monad.chain;
right_monad.bind = right_monad.chain;
left_monad.bind = left_monad.chain;
right_monad.reduce = right_monad.fold;
left_monad.reduce = left_monad.fold;



//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
right_monad.constructor = right_monad.factory;
left_monad.constructor = left_monad.factory;


export { Either, Left, Right, right_monad, left_monad };