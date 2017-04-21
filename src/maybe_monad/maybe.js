function maybe(item) {
    return Object.create(_maybe, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}
maybe.of = function _of(item) {
    return maybe(item);
};

var _maybe = {
    isEmpty: function _isEmpty() {
        return null == this.value;
    },
    map: function _map(fn) {
        return this.isEmpty() ? maybe(this.value) : maybe(fn(this.value));
    },
    apply: function _apply(ma) {
        return this.isEmpty() ? this : ma.map(this.value);
    },
    flatMap: function _flatMap(fn) {
        return this.isEmpty() ? this.value : fn(this.value);
    },
    join: function _join() {
        if (this.isEmpty()) return maybe.empty();
        return maybe.isPrototypeOf(this.value) ? this.value : maybe(this.value);
    },
    of: function _of(item) {
        return maybe.of(item);
    },
    toString: function _toString() {
        return `Maybe(${this.value})`;
    }
};


export { maybe, _maybe };