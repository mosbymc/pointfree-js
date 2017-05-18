import { _maybe_f } from '../functors/maybe_functor';

function Maybe(item) {
    return Object.create(_maybe_m, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @description:
 * @param: {*} item
 * @return: {@see _maybe_m}
 */
Maybe.of = function _of(item) {
    return Maybe(item);
};

var _maybe_m = Object.create(_maybe_f, {
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    chain: {
        value: function _chain(fn) {
            return fn(this.value);
        }
    },
    /**
     * @description:
     * @param: {monad} ma
     * @return: {monad}
     */
    apply: {
        value: function _apply(ma) {
            return this.map(ma.value);
        }
    },
    of: {
        value: function _of(val) {
            return Maybe.of(val);
        }
    }
});

_maybe_m.ap = _maybe_m.apply;
_maybe_m.bind = _maybe_m.chain;

export { Maybe, _maybe_m };