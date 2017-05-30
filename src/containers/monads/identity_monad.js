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
    chain: {
        value: function _chain(fn) {
            return fn(this.value);
        }
    },
    fold: {
        value: function _fold(fn, x) {
            return fn(this.value, x);
        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return this.fold(function _reductioAdAbsurdum(xs, x) {
                fn(x).map(function _map(x) {
                    return function _map_(y) {
                        return y.concat([x]);
                    };
                }).ap(xs);
                return fa(this.empty);
            });
        }
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
            return Identity.of(val);
        }
    },
    constructor: {
        value: Identity
    }
});

_identity_m.ap = _identity_m.apply;
_identity_m.bind = _identity_m.chain;
_identity_m.reduce = _identity_m.fold;

export { Identity, _identity_m };