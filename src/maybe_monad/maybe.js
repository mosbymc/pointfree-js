function Maybe(item) {
    /*return Object.create(_maybe, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        },
        value: {
            get: function _getValue() {
                return this._value;
            }
        }
    });*/
    return null == item ?
        Object.create(_nothing, {
            _value: {
                value: item,
                writable: false,
                configurable: false
            },
            value: {
                get: function _getValue() {
                    return this._value;
                }
            }
        }) :
        Object.create(_just, {
            _value: {
                value: item,
                writable: false,
                configurable: false
            },
            value: {
                get: function _getValue() {
                    return this._value;
                }
            }
        });
}

/**
 *
 * @param item
 * @returns {*}
 */
Maybe.of = function _of(item) {
    return Maybe(item);
};

Maybe.Just = function _justASomething(val) {
    return Maybe(val);
};

Maybe.Nothing = function _notASomething() {
    return Maybe();
};

var _maybe = {
    get isJust() {
        return _just.isPrototypeOf(this);
    },
    get isNothing() {
        return _nothing.isPrototypeOf(this);
    },
    isEmpty: function _isEmpty() {
        return null == this.value;
    },
    map: function _map(fn) {
        return this.isEmpty() ? Maybe(this.value) : Maybe(fn(this.value));
    },
    apply: function _apply(ma) {
        return this.isEmpty() ? this : ma.map(this.value);
    },
    flatMap: function _flatMap(fn) {
        return this.isEmpty() ? this.value : fn(this.value);
    },
    mjoin: function _mjoin() {
        if (this.isEmpty()) return Maybe.empty();
        return Maybe.isPrototypeOf(this.value) ? this.value : Maybe(this.value);
    },
    concat: function _concat(ma) {
        return ma.isNothing ? this : this.of(this.value.concat(ma.value));
    },
    equals: function _equals(ma) {
      //TODO: going to need to refactor this equality check because it won't work as implemented
        return _maybe.isPrototypeOf(ma) && ma.value === this.value;
    },
    valueEquals: function _valueEquals(ma) {
        return ma.value === this.value;
    },
    of: function _of(item) {
        return Maybe.of(item);
    },
    toString: function _toString() {
        return `Maybe(${this.value})`;
    }
};

_maybe.chain = _maybe.flatMap;
_maybe.bind = _maybe.flatMap;

function Just(item) {
    return Object.create(_just, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}

Just.of = function _of(item) {
    return Just(item);
};

var _just = {
    get value() {
        return this._value;
    },
    get isJust() {
        return true;
    },
    get isNothing() {
        return false;
    },
    map: function _map(fn) {
        return Just(fn(this.value));
    },
    apply: function _apply(ma) {
        return this.map(ma.value);
    },
    flatMap: function _flatMap(fn) {
        return fn(this.value);
    },
    mjoin: function _mjoin() {
        return this.value;
    },
    concat: function _concat(ma) {
        return ma.isNothing ? this : this.of(this.value.concat(ma.value));
    },
    equals: function _equals(ma) {
        return _just.isPrototypeOf(ma) && ma.value === this.value;
    },
    valueEquals: function _valueEquals(ma) {
        return ma.value === this.value;
    },
    of: function _of(item) {
        return Just.of(item);
    },
    toString: function _toString() {
        return `Maybe.Just(${this.value})`;
    }
};

function Nothing() {
    return Object.create(_nothing, {
        _value: {
            value: null,
            writable: false,
            configurable: false
        },
        value: {
            get: function _getValue() {
                return this._value;
            }
        }
    });
}

var _nothing = {
    get isJust() {
        return false;
    },
    get isNothing() {
        return true;
    },
    map: function _map() {
        return Nothing();
    },
    flatMap: function _flatMap() {
        return Nothing();
    },
    apply: function _apply() {
        return Nothing();
    },
    mjoin: function _mjoin() {
        return this.value;
    },
    concat: function _concat(ma) {
        return ma;
    },
    equals: function _equals(ma) {
        return _nothing.isPrototypeOf(ma);
    },
    valueEquals: function _valueEquals(ma) {
        return this.equals(ma);
    },
    of: function _of() {
        return Nothing();
    },
    toString: function _toString() {
        return 'Maybe.Nothing()';
    }
};


export { Maybe, _maybe, Just, _just, Nothing, _nothing };