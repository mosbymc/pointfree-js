import { io_functor } from '../functors/io_functor';
import { compose } from '../../combinators';

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
    flatMap: {
        value: function _flatMap(fn) {
            return io_monad.isPrototypeOf(this.value) ? this.value.map(fn) : this.of(compose(fn, this.value));
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
    factory: {
        value: Io
    }
});

io_monad.ap =io_monad.apply;
io_monad.fmap = io_monad.flatMap;
io_monad.chain = io_monad.flatMap;
io_monad.bind = io_monad.flatMap;
io_monad.reduce = io_monad.fold;



//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
io_monad.constructor = io_monad.factory;


export { Io, io_monad };