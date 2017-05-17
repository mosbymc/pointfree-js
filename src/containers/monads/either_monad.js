import { _either_f } from '../functors/either_functor';

function Either(val) {

}

Either.of = function _of(val) {

};

Either.Left = function _left(val) {

};

Either.Right = function _right(val) {

};

Either.isLeft = function _isLeft(ma) {
    return ma.isLeft;
};

Either.isRight = function _isRight(ma) {
    return ma.isRight;
};

function Left(val) {

}

function Right(val) {

}

var _either_m = Object.create(_either_f, {
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
            return Left(val);
        }
    }
});

_either_m.ap = _either_m.apply;
_either_m.bind = _either_m.chain;

export { Either, Left, Right, _either_m };