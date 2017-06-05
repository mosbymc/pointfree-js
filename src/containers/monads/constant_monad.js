import { constant_functor } from '../functors/constant_functor';

function Constant(val) {
    return Object.create(constant_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @description:
 * @param: {*} item
 * @return: {@see constant_monad}
 */
Constant.of = function _of(item) {
    return Constant(item);
};

var constant_monad = Object.create(constant_functor, {
    mjoin: {
        value: function _mjoin() {
            return this;
        }
    },
    chain: {
        value: function _chain(fn) {
            return fn(this.value);
        }
    },
    fold: {
        value: function _fold() {
            return this.value;
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
            return Constant.of(val);
        }
    },
    constructor: {
        value: Constant
    }
});

constant_monad.ap =constant_monad.apply;
constant_monad.bind = constant_monad.chain;
constant_monad.reduce = constant_monad.fold;

export { Constant, constant_monad };