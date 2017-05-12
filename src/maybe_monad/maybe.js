/**
 * @description:
 * @param: {*} item
 * @return {@see _maybe}
 */
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
 * @description:
 * @param: {*} item
 * @return: {@see _maybe}
 */
Maybe.of = function _of(item) {
    return Maybe(item);
};

/**
 * @description:
 * @param: {*} val
 * @return: {@see _maybe}
 */
Maybe.Just = function _justASomething(val) {
    return Maybe(val);
};

/**
 * @description:
 * @return: {@see _maybe}
 */
Maybe.Nothing = function _notASomething() {
    return Maybe();
};

/**
 * @description:
 * @type {{
 * isJust: {boolean} isJust,
 * isNothing: {boolean} isNothing,
 * isEmpty: {function} _maybe._isEmpty,
 * map: {function} _maybe._map,
 * apply: {function} _maybe._apply,
 * flatMap: {function} _maybe._flatMap,
 * mjoin: {function} _maybe._mjoin,
 * concat: {function} _maybe._concat,
 * equals: {function} _maybe._equals,
 * of: {function} _maybe._of,
 * toString: {function} _maybe._toString
 * }}
 * @private
 */
var _maybe = {
    /**
     * @description:
     * @return: {boolean}
     */
    get isJust() {
        return _just.isPrototypeOf(this);
    },
    /**
     * @description:
     * @return: {boolean}
     */
    get isNothing() {
        return _nothing.isPrototypeOf(this);
    },
    /**
     * @description:
     * @return: {boolean}
     */
    isEmpty: function _isEmpty() {
        return null == this.value;
    },
    /**
     * @description:
     * @param: {function} fn
     * @return: {@see _maybe}
     */
    map: function _map(fn) {
        return this.isEmpty() ? Maybe(this.value) : Maybe(fn(this.value));
    },
    /**
     * @description:
     * @param: {monad} ma
     * @return: {@see _maybe}
     */
    apply: function _apply(ma) {
        return this.isEmpty() ? this : ma.map(this.value);
    },
    /**
     * @description:
     * @param: {function} fn
     * @return: {*}
     */
    flatMap: function _flatMap(fn) {
        return this.isEmpty() ? this.value : fn(this.value);
    },
    /**
     * @description:
     * @return: {@see _maybe}
     */
    mjoin: function _mjoin() {
        if (this.isEmpty()) return Maybe.empty();
        return Maybe.isPrototypeOf(this.value) ? this.value : Maybe(this.value);
    },
    /**
     * @description:
     * @param: {monad} ma
     * @return: {_maybe}
     */
    concat: function _concat(ma) {
        return ma.isNothing ? this : this.of(this.value.concat(ma.value));
    },
    /**
     * @description:
     * @param: {monad} ma
     * @return: {boolean}
     */
    equals: function _equals(ma) {
      //TODO: going to need to refactor this equality check because it won't work as implemented
        return _maybe.isPrototypeOf(ma) && ma.value === this.value;
    },
    /**
     * @description:
     * @param: {*} item
     * @return: {@see _maybe}
     */
    of: function _of(item) {
        return Maybe.of(item);
    },
    /**
     * @description:
     * @return: {string}
     */
    toString: function _toString() {
        return `Maybe(${this.value})`;
    }
};

_maybe.chain = _maybe.flatMap;
_maybe.bind = _maybe.flatMap;

/**
 * @description:
 * @param: {*} item
 * @return: {@see _just}
 */
function Just(item) {
    return Object.create(_just, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @description:
 * @param: {*} item
 * @return: {@see _just}
 */
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

/**
 * @description:
 * @return: {@see _nothing}
 */
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

/**
 * @description:
 * @return: {@see _nothing}
 */
Nothing.of = function _of() {
    return Nothing();
};

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