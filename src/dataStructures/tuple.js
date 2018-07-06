var positions = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

function Tuple(...args) {
    var t = Object.create(tuple, {
        _source: {
            value: args,
            writable: false,
            configurable: false
        }
    });

    args.forEach(function _setAccessorProps(arg, idx) {
        Object.defineProperty(t, positions[idx], {
            value: arg,
            writable: false,
            configurable: false
        });
    });

    return t;
}

var tuple = {
    toArray: function _toArray() {
        return this._source;
    },
    equals: function _equals(t) {
        return Object.getPrototypeOf(t).isPrototypeOf(this) && t._source.length === this._source.length &&
            t._source.every((item, idx) => this._source[idx] === item);
    },
    toString: function _toString() {
        return `Tuple(${this._source.join(',')})`;
    }
};