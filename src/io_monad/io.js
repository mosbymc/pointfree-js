import { compose } from '../functionalHelpers';

function Io(item) {
    return Object.create(_io, {
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
    })
}
Io.of = function _of(item) {
    if ('function' !== typeof item) return Io(function _anon() { return item; });
    return Io(item);
};

var _io = {
    map: function _map(fn) {
        return Io(compose(fn, this.value));
    },
    apply: function _apply(ma) {
        return ma.map(this.value);
    },
    flatMap: function _flatMap(fn) {
        return compose(fn, this.value);
    },
    mjoin: function _mjoin() {
        return Io.isPrototypeOf(this.value) ? this.value : Io(this.value);
    },
    of: function _of(item) {
        return Io.of(item);
    },
    toString: function _toString() {
        return `Io(${this.value})`;
    }
};

export { Io };