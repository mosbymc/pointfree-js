import { either_functor } from '../functors/either_functor';

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
    traverse: {
        value: function _traverse(fa, fn) {
            return this.isRight ? this.fold(function _reductioAdAbsurdum(xs, x) {
                fn(x).map(function _map(x) {
                    return function _map_(y) {
                        return y.concat([x]);
                    };
                }).ap(xs);
                return fa(this.empty);
            }) : this.value;
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
    constructor: {
        value: Either
    }
});

either_monad.ap = either_monad.apply;
either_monad.bind = either_monad.chain;
either_monad.reduce = either_monad.fold;

export { Either, Left, Right, either_monad };