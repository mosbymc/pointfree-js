function identity(item) {
    return Object.create(_identity, {
        _value: {
            value: item
        }
    });
}
identity.of = function _of(item) {
    return identity(item);
};

var _identity = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return identity(fn(this.value));
    },
    apply: function _apply(ma) {
        return this.map(ma.value);
    },
    flatMap: function _flatMap(fn) {
        return fn(this.value);
    },
    join: function _join() {
        return this.value;
    },
    of: function _of(item) {
        return identity.of(item);
    },
    toString: function _toString() {
        return `Identity(${this.value})`;
    }
};

export { identity, _identity };