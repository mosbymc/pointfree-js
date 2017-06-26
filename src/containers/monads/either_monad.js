import { right_functor, left_functor } from '../functors/either_functor';
import { identity } from '../../combinators';

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

    /*return Object.create(either_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isRight: {
            value: 'right' === fork,
            writable: false,
            configurable: false
        },
        isLeft: {
            value: 'right' !== fork,
            writable: false,
            configurable: false
        }
    });*/
}

Either.of = function _of(val) {
    return Either(val, 'right');
};

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

function Right(val) {
    return Either(val, 'right');
}


var right_monad = Object.create(right_functor, {
    chain: {
        value: function _chain(fn) {
            var val = fn(this.value);
            return right_monad.isPrototypeOf(val) ? val : this.of(val);
        }
    },
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    fold: {
        value: function _fold(fn, acc) {
            return fn(acc, this.value);
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
    /**
     * @description:
     * @param: {monad} ma
     * @return: {monad}
     */
    apply: {
        value: function _apply(ma) {
            return ma.map(this.value);
        }
    },
    of: {
        value: function _of(val) {
            return Right(val);
        }
    },
    factory: {
        value: Either
    }
});


var left_monad = Object.create(left_functor, {
    chain: {
        value: function _chain(fn) {
            return Left(this.value);
        }
    },
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    fold: {
        value: function _fold(fn, acc) {
            return fn(acc, this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return a.of(this.of(this.value));
        }
    },
    /**
     * @description:
     * @param: {monad} ma
     * @return: {monad}
     */
    apply: {
        value: function _apply(ma) {
            return ma.map(this.value);
        }
    },
    of: {
        value: function _of(val) {
            return Left(val);
        }
    },
    factory: {
        value: Either
    }
});



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