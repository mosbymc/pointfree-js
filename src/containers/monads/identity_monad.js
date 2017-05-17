import { _identity_f } from '../functors/identity_functor';

/**
 * @description:
 * @param: {*} item
 * @return: {@see _identity_m}
 */
function Identity(item) {
    return Object.create(_identity_m, {
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
 * @return: {@see _identity_m}
 */
Identity.of = function _of(item) {
    return Identity(item);
};

var _identity_m = Object.create(_identity_f, {
    mjoin: {
        value: function _mjoin() {
            return this.value;
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
            return this.map(ma.value);
        }
    },
    of: {
        value: function _of(val) {
            return Identity.of(val);
        }
    }
});

_identity_m.ap = _identity_m.apply;
_identity_m.bind = _identity_m.chain;

export { Identity, _identity_m };