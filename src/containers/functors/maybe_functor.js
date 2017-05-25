/**
 * @description:
 * @param: {*} val
 * @return: {@see _maybe_f}
 */
function Maybe(val) {
    return Object.create(_maybe_f, {
        _value: {
            value: null == val ? null : val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: null != val
        },
        isNothing: {
            value: null == val
        }
    });
}

/**
 * @description:
 * @param: {*} val
 * @return: {@see _maybe_f}
 */
Maybe.of = function _of(val) {
    return Object.create(_maybe_f, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
};

/**
 * @description:
 * @param {*} val
 * @return: {@see _maybe_f}
 * @type {function}
 */
Maybe.Just = Maybe.of;

/**
 * @description:
 * @return: {@see _maybe_f}
 */
Maybe.Nothing =  function _nothing() {
    return Maybe();
};
//Maybe.Just = Just;
//Maybe.Nothing = Nothing;
Maybe.isJust = function _isJust(m) {
    return _maybe_f.isPrototypeOf(m) && null != m.value;
};
Maybe.isNothing = function _isNothing(m) {
    return _maybe_f.isPrototypeOf(m) && null == m.value;
};

//TODO: determine if there is any purpose in splitting a maybe into two types... if those sub-types
//TODO: are not exposed, what benefit is derived from them? And if they are exposed (Just being Identity,
//TODO: and Nothing being Constant(null)), then the maybe container has a direct dependency on the Identity
//TODO: and Constant containers. This becomes an issue due to circular dependencies.
/*
function Just(val) {
    return null == val ? Nothing() :
        Object.create(_just_f, {
            _value: {
                value: val,
                writable: false,
                configurable: false
            }
        });
}

Just.of = function _of(val) {
    return Object.create(_just_f, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
};

function Nothing() {
    return Object.create(_nothing_f, {
        _value: {
            value: null,
            writable: false,
            configurable: false
        }
    });
}

Nothing.of = Nothing;
*/

function Just(val) {
    return Maybe.of(val);
}

Just.of = function _of(val) {
    return Just(val);
};

function Nothing() {
    return Maybe();
}

Nothing.of = function _of() {
    return Nothing();
};

//TODO: Using this.of in order to create a new instance of a Maybe container (functor/monad) will
//TODO: not work as it is implemented here in terms of creating a new maybe container with the
//TODO: proper values for the '.isJust' and '.isNothing' fields. The problem is that the '.of'
//TODO: function property will create a new maybe instance with whatever value it receives as
//TODO: as argument and treat the new maybe container instance as a 'Just', regardless of the
//TODO: actual underlying value. As 'null' and 'undefined' underlying values are traditionally
//TODO: treated as 'Nothing' maybe values, this will cause a problem during mapping/flat-mapping/etc.
var _maybe_f = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        //return this.of(fn(this.value));
        return null == this.value ? this.nothing() : this.of(fn(this.value));
    },
    flatMap: function _flatMap(fn) {
        //return _maybe_f.isPrototypeOf(this.value) ? this.value.map(fn) : this.of(fn(this.value));
        if (Object.getPrototypeOf(this).isPrototypeOf(this.value)) return this.value.map(fn);
        if (null != this.value) return this.of(fn(this.value));
        return this.nothing();
    },
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && this.value === ma.value;
    },
    of: function _of(val) {
        return Maybe.of(val);
    },
    nothing: function _nothing() {
        return Maybe();
    },
    /**
     * @description:
     * @return: {*}
     */
    valueOf: function _valueOf() {
        return this.value;
    },
    toString: function _toString() {
        //return `Maybe(${this.value})`;
        return null == this.value ? `Nothing()` : `Just(${this.value})`;
    },
    constructor: Maybe
};

/*
var _just_f = Object.create(_maybe_f, {
    isJust: {
        value: true
    },
    isNothing: {
        value: false
    },
    value: {
        get: function _getValue() {
            return this._value;
        }
    },
    map: {
        value: function _map(fn) {
            return Just(fn(this.value));
        }
    },
    flatMap: {
        value: function _flatMap(fn) {
            return _maybe_f.isPrototypeOf(this.value) ? this.value.map(fn) : Just(fn(this.value));
        }
    },
    of: {
        value: function _of(val) {
            return Just.of(val);
        }
    },
    toString: {
        value: function _toString() {
            return `Maybe.Just(${this.value})`;
        }
    }
});

var _nothing_f = Object.create(_maybe_f, {
    isJust: {
        value: false
    },
    isNothing: {
        value: true
    },
    value: {
        value: function _getValue() {
            return this._value;
        }
    },
    map: {
        value: function _map() {
            return Nothing();
        }
    },
    flatMap: {
        value: function _flatMap(fn) {
            return _maybe_f.isPrototypeOf(this.value) ? this.value.map(fn) : Nothing();
        }
    },
    of: {
        value: function _of() {
            return Nothing.of();
        }
    },
    toString: {
        value: function _toString() {
            return `Maybe.Nothing()`;
        }
    }
});
*/

export { Maybe, Just, Nothing, _maybe_f };