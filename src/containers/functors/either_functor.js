function Either(val, fork) {
    return Object.create(either_functor, {
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

Left.of = function _of(val) {
    return Either(val);
};

function Right(val) {
    return Either.of(val);
}

Right.of = function _of(val) {
    return Either.of(val);
};

var either_functor = {
    get value() {
        return this._value;
    },
    /**
     * @description:
     * @param: {function|undefined} fn
     * @return: {@see either_functor}
     */
    map: function _map(fn) {
        return this.isRight ? Right(fn(this.value)) : Left(this.value);
    },
    /**
     * @description:
     * @param: {function|undefined} fn
     * @return: {@see either_functor}
     */
    flatMap: function _flatMap(fn) {
        if (Object.getPrototypeOf(this).isPrototypeOf(this.value)) return this.value.map(fn);
        if (this.isRight) return Right(fn(this.value));
        return Left(this.value);
    },
    /**
     * @description:
     * @param: {functor} ma
     * @return: {boolean}
     */
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) ?
            (this.isLeft && ma.isLeft && this.value === ma.value) || this.isRight && ma.isRight && this.value === ma.value : false;
    },
    of: function _of(val) {
        return Either.of(val);
    },
    /**
     * @description:
     * @return: {*}
     */
    valueOf: function _valueOf() {
        return this.value;
    },
    toString: function _toString() {
        var val = this.value && this.value.toString && 'function' === typeof this.value.toString ? this.value.toString() : JSON.stringify(this.value);
        return this.isLeft ? `Left(${val})` : `Right(${val})`;
    },
    constructor: Either
};

var right = {
    get value() {
        return this._value;
    },
    /**
     * @description:
     * @param: {function|undefined} fn
     * @return: {@see either_functor}
     */
    map: function _map(fn) {
        return this.isRight ? Right(fn(this.value)) : Left(this.value);
    },
    /**
     * @description:
     * @param: {function|undefined} fn
     * @return: {@see either_functor}
     */
    flatMap: function _flatMap(fn) {
        if (Object.getPrototypeOf(this).isPrototypeOf(this.value)) return this.value.map(fn);
        if (this.isRight) return Right(fn(this.value));
        return Left(this.value);
    },
    /**
     * @description:
     * @param: {functor} ma
     * @return: {boolean}
     */
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) ?
            (this.isLeft && ma.isLeft && this.value === ma.value) || this.isRight && ma.isRight && this.value === ma.value : false;
    },
    of: function _of(val) {
        return Either.of(val);
    },
    /**
     * @description:
     * @return: {*}
     */
    valueOf: function _valueOf() {
        return this.value;
    },
    toString: function _toString() {
        var val = this.value && this.value.toString && 'function' === typeof this.value.toString ? this.value.toString() : JSON.stringify(this.value);
        return this.isLeft ? `Left(${val})` : `Right(${val})`;
    },
    constructor: Either
};

var left = {
    get value() {
        return this._value;
    },
    /**
     * @description:
     * @return: {@see either_functor}
     */
    map: function _map() {
        return Left(this.value);
    },
    /**
     * @description:
     * @param: {function|undefined} fn
     * @return: {@see either_functor}
     */
    flatMap: function _flatMap(fn) {
        if (Object.getPrototypeOf(this).isPrototypeOf(this.value)) return this.value.map(fn);
        return Left(this.value);
    },
    /**
     * @description:
     * @param: {functor} ma
     * @return: {boolean}
     */
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && this.isLeft && ma.isLeft && this.value === ma.value;
    },
    of: function _of(val) {
        return Either.of(val);
    },
    /**
     * @description:
     * @return: {*}
     */
    valueOf: function _valueOf() {
        return this.value;
    },
    toString: function _toString() {
        var val = this.value && this.value.toString && 'function' === typeof this.value.toString ? this.value.toString() : JSON.stringify(this.value);
        return `Left(${val})`;
    },
    constructor: Either
};

function fromNullable(x) {
    return null != x ? Right(x) : Left(x);
}

export { Either, Left, Right, either_functor };