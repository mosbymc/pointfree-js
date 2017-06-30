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
        })
    /*return Object.create(either_functor, {
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
    bimap: function _bimap(f, g) {
        return this.isRight ? Right(f(this.value)) : Left(g(this.value));
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
    factory: Either
};

var right_functor = {
    get value() {
        return this._value;
    },
    /**
     * @description:
     * @param: {function|undefined} fn
     * @return: {@see either_functor}
     */
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    bimap: function _bimap(f, g) {
        return this.of(f(this.value));
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
        return Right(val);
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
        return `Right(${val})`;
    },
    factory: Either
};

var left_functor = {
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
    bimap: function _bimap(f, g) {
        return this.of(g(this.value));
    },
    /**
     * @description:
     * @param: {functor} ma
     * @return: {boolean}
     */
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && this.isLeft && ma.isLeft && this.value === ma.value;
    },
    /**
     *
     * @param val
     */
    of: function _of(val) {
        return Right(val);
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
    factory: Either
};

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
either_functor.constructor = either_functor.factory;
right_functor.constructor = right_functor.factory;
left_functor.constructor = left_functor.factory;



export { Either, Left, Right, right_functor, left_functor };