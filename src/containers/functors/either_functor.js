function Either(val, fork) {
    Object.create(_either_f, {
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

Either.isRight = function _isRight(ma) {
    return ma.isRight;
};

Either.isLeft = function _isLeft(ma) {
    return ma.isLeft;
};

function Left(val) {
    return Either(val);
}

function Right(val) {
    return Either.of(val);
}

var _either_f = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.isRight ? Right(fn(this.value)) : Left(this.value);
    },
    flatMap: function _flatMap(fn) {
        if (Object.getPrototypeOf(this).isPrototypeOf(this.value)) return this.value.map(fn);
        if (this.isRight) return Right(fn(this.value));
        return Left(this.value);
    },
    of: function _of(val) {
        return Either.of(val);
    },
    toString: function _toString() {
        return this.isLeft ? `Left(${this.value})` : `Right(${this.value})`;
    }
};

export { Either, Left, Right, _either_f };