import { maybe_functor } from '../functors/maybe_functor';

function Maybe(item) {
    return Object.create(maybe_monad, {
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
 * @return: {@see maybe_monad}
 */
Maybe.of = function _of(item) {
    return Object.create(maybe_monad, {
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

var maybe_monad = Object.create(maybe_functor, {
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

maybe_monad.ap = maybe_monad.apply;
maybe_monad.bind = maybe_monad.chain;
maybe_functor.reduce = maybe_functor.fold;

export { Maybe, maybe_monad };