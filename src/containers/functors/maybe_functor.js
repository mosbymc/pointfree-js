function Maybe(val) {
    return Object.create(_maybe_f, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

Maybe.of = function _of(val) {
    return Maybe(val);
};

var _maybe_f = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    flatMap: function _flatMap(fn) {
        return _maybe_f.isPrototypeOf(this.value) ? this.value.map(fn) : this.of(fn(this.value));
    },
    of: function _of(val) {
        return Maybe.of(val);
    },
    toString: function _toString() {
        return `Maybe${this.value}`;
    }
};

export { Maybe, _maybe_f };