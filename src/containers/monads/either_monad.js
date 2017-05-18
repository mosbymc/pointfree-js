import { _either_f } from '../functors/either_functor';

function Either(val, fork) {
    return Object.create(_either_m, {
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
    Either(val, 'right');
}

var _either_m = Object.create(_either_f, {
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
    apply: {
        value: function _apply(ma) {
            return this.map(ma.value);
        }
    },
    of: {
        value: function _of(val) {
            return Right(val);
        }
    }
});

_either_m.ap = _either_m.apply;
_either_m.bind = _either_m.chain;

export { Either, Left, Right, _either_m };