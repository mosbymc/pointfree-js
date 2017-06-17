import { either_functor } from '../functors/either_functor';
import { identity } from '../../combinators';

function Either(val, fork) {
    return Object.create(either_monad, {
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
    });
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

var either_monad = Object.create(either_functor, {
    map: {
        value: function _map(fn) {
            return this.isRight ? Right(fn(this.value)) : Left(this.value);
        }
    },
    flatMap: {
        value: function _flatMap(fn) {
            if (Object.getPrototypeOf(this).isPrototypeOf(this.value)) return this.value.map(fn);
            if (this.isRight) return Right(fn(this.value));
            return Left(this.value);
        }
    },
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    chain: {
        value: function _chain(fn) {
            return this.isRight ? fn(this.value) : this.value;
        }
    },
    fold: {
        value: function _fold(fn, x) {
            return this.isRight ? fn(this.value, x) : this.value;
        }
    },
    sequence: {
        value: function _sequence(a) {
            return this.traverse(identity, a);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return this.isRight ? f(this.value).map(Either.of) : a.of(Either.Left(this.value));
        }
    },
    apply: {
        value: function _apply(ma) {
            return this.map(ma.value);
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

either_monad.ap = either_monad.apply;
either_monad.bind = either_monad.chain;
either_monad.reduce = either_monad.fold;



//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
either_monad.constructor = either_monad.factory;


export { Either, Left, Right, either_monad };