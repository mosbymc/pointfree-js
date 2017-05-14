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
    }
};

export { Maybe, _maybe_f };