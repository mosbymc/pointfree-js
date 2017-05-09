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
    map: function _map() {
        return this;
    },
    apply: function _apply(ma) {
        return ma.map(this.value);
    },
    flatMap: this.map,
    mjoin: this.map,
    of: function _of(item) {
        return Just.of(item);
    },
    toString: function _toString() {
        return `Just(${this.value})`;
    }
};

export { Just, _just };