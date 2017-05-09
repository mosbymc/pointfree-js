function Identity(item) {
    return Object.create(_identity, {
        _value: {
            value: item
        }
    });
}
Identity.of = function _of(item) {
    return Identity(item);
};

var _identity = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return Identity(fn(this.value));
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
    of: function _of(item) {
        return Identity.of(item);
    },
    toString: function _toString() {
        return `Identity(${this.value})`;
    }
};

export { Identity, _identity };