function Maybe(val) {
    return Object.create(_maybe_f, {
        _value: {
            value: null == val ? null : val,
            writable: false,
            configurable: false
        }
    });
}

Maybe.of = function _of(val) {
    return Object.create(_maybe_f, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
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

var _maybe_f = {
    isJust: function _isJust() {
        return null != this.value;
    },
    isNothing: function _isNothing() {
        return null == this.value;
    },
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        //return this.of(fn(this.value));
        return null == this.value ? this.of(null) : this.of(fn(this.value));
    },
    flatMap: function _flatMap(fn) {
        //return _maybe_f.isPrototypeOf(this.value) ? this.value.map(fn) : this.of(fn(this.value));
        if (Object.getPrototypeOf(this).isPrototypeOf(this.value)) return this.value.map(fn);
        if (null != this.value) return this.of(fn(this.value));
        return this.of(null);
    },
    of: function _of(val) {
        return Maybe.of(val);
    },
    toString: function _toString() {
        //return `Maybe(${this.value})`;
        return null == this.value ? `Nothing()` : `Just(${this.value})`;
    }
};

var _just_f = Object.create(_maybe_f, {
    isJust: {
        value: true
    },
    isNothing: {
        value: false
    },
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return Just(fn(this.value));
    },
    flatMap: function _flatMap(fn) {
        return _maybe_f.isPrototypeOf(this.value) ? this.value.map(fn) : Just(fn(this.value));
    },
    of: function _of(val) {
        return Just.of(val);
    },
    toString: function _toString() {
        return `Maybe.Just(${this.value})`;
    }
});

var _nothing_f = Object.create(_maybe_f, {
    isJust: {
        value: false
    },
    isNothing: {
        value: true
    },
    get value() {
        return this._value;
    },
    map: function _map() {
        return Nothing();
    },
    flatMap: function _flatMap(fn) {
        return _maybe_f.isPrototypeOf(this.value) ? this.value.map(fn) : Nothing();
    },
    of: function _of() {
        return Nothing();
    },
    toString: function _toString() {
        return `Maybe.Nothing()`;
    }
});

export { Maybe, _maybe_f };