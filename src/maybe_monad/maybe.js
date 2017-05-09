function Maybe(item) {
    return Object.create(_maybe, {
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
Maybe.of = function _of(item) {
    return Maybe(item);
};

var _maybe = {
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
    of: function _of(item) {
        return Maybe.of(item);
    },
    toString: function _toString() {
        return `Maybe(${this.value})`;
    }
};


export { Maybe, _maybe };