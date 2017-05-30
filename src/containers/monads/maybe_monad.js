import { _maybe_f } from '../functors/maybe_functor';

function Maybe(item) {
    return Object.create(_maybe_m, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        }
        ,
        isJust: {
            value: null != item
        },
        isNothing: {
            value: null == item
        }
    });
}

/**
 * @description:
 * @param: {*} item
 * @return: {@see _maybe_m}
 */
Maybe.of = function _of(item) {
    return Object.create(_maybe_m, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        },
        isJust: {
            value: true
        },
        isNothing: {
            value: false
        }
    });
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
    fold: {
        value: function _fold(fn, x) {
            return !this.isNothing ? fn(this.value, x) : this.of();
        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return !this.isNothing ? this.fold(function _reductioAdAbsurdum(xs, x) {
                fn(x).map(function _map(x) {
                    return function _map_(y) {
                        return y.concat([x]);
                    };
                }).ap(xs);
                return fa(this.empty);
            }) : this.of();
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
    nothing: {
        value: function _nothing() {
            return Maybe();
        }
    },
    of: {
        value: function _of(val) {
            return Maybe.of(val);
        }
    },
    constructor: {
        value: Maybe
    }
});

_maybe_m.ap = _maybe_m.apply;
_maybe_m.bind = _maybe_m.chain;
_maybe_f.reduce = _maybe_f.fold;

export { Maybe, _maybe_m };