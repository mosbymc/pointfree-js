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

_constant_m.ap =_constant_m.apply;
_constant_m.bind = _constant_m.chain;
_constant_m.reduce = _constant_m.fold;

export { Constant, _constant_m };