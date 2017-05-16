import { _io_f } from '../functors/io_functor';

function Io(val) {
    return Object.create(_io_m, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

Io.of = function _of(val) {
    return 'function' === typeof val ? Io(val) : Io(function _wrapper() { return val; });
};

var _io_m = Object.create(_io_f, {
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    apply: {
        value: function _apply(ma) {
            return ma.map(this.value);
        }
    },
    of: {
        value: function _of(val) {
            return Io.of(val);
        }
    }
});

_io_m.ap =_io_m.apply;

export { Io, _io_m };