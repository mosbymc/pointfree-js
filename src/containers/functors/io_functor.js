import { compose } from '../../functionalHelpers';

function Io(item) {
    return Object.create(_io_f, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        }
    })
}
Io.of = function _of(item) {
    if ('function' !== typeof item) return Io(function _anon() { return item; });
    return Io(item);
};

var _io_f = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.of(compose(fn, this.value));
    },
    flatMap: function _flatMap(fn) {
        return _io_f.isPrototypeOf(this.value) ? this.value.map(fn) : this.of(compose(fn, this.value));
    },
    of: function _of(item) {
        return Io.of(item);
    },
    toString: function _toString() {
        return `Io(${this.value})`;
    }
};

export { Io, _io_f };