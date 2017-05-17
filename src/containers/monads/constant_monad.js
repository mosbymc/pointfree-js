import { _constant_f } from '../functors/constant_functor';

function Constant(val) {
    return Object.create(_constant_m, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

var _constant_m = Object.create(_constant_f, {
    mjoin: {
        value: function _mjoin() {
            return this;
        }
    },
    chain: function _chain(fn) {
        return fn(this.value);
    },
    /**
     * @description:
     * @param: {monad} ma
     * @return: {monad}
     */
    apply: {
        value: function _apply(ma) {
            return ma.map(this.value);
        }
    },
    of: {
        value: function _of(val) {
            return Constant.of(val);
        }
    }
});

_constant_m.ap =_constant_m.apply;
_constant_m.bind = _constant_m.chain;

export { Constant, _constant_m };