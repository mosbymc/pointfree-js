import { io_functor } from '../functors/io_functor';

function Io(val) {
    return Object.create(io_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

Io.of = function _of(val) {
    return 'function' === typeof val ? Io(val) : Io(function _wrapper() { return val; });
};

var io_monad = Object.create(io_functor, {
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
    apply: {
        value: function _apply(ma) {
            return ma.map(this.value);
        }
    },
    of: {
        value: function _of(val) {
            return Io.of(val);
        }
    },
    constructor: {
        value: Io
    }
});

io_monad.ap =io_monad.apply;
io_monad.bind = io_monad.chain;
io_monad.reduce = io_monad.fold;

export { Io, io_monad };