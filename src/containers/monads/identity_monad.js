import { identity_functor } from '../functors/identity_functor';

/**
 * @description:
 * @param: {*} item
 * @return: {@see identity_monad}
 */
function Identity(item) {
    return Object.create(identity_monad, {
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
 * @return: {@see identity_monad}
 */
Identity.of = function _of(item) {
    return Identity(item);
};

var identity_monad = Object.create(identity_functor, {
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

identity_monad.ap = identity_monad.apply;
identity_monad.bind = identity_monad.chain;
identity_monad.reduce = identity_monad.fold;

export { Identity, identity_monad };