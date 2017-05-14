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

export { Maybe, _maybe_m };