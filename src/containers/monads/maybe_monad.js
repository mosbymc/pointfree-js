import { maybe_functor } from '../functors/maybe_functor';
import { identity } from '../../combinators';

function Maybe(item) {
    return Object.create(maybe_monad, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        },
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
    flatMap: {
        value: function _flatMap(fn) {
            //return maybe_functor.isPrototypeOf(this.value) ? this.value.mapWith(fn) : this.of(fn(this.value));
            if (Object.getPrototypeOf(this).isPrototypeOf(this.value)) return this.value.map(fn);
            if (null != this.value) return this.of(fn(this.value));
            return this.nothing();
        }
    },
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    fold: {
        value: function _fold(fn, x) {
            return !this.isNothing ? fn(this.value, x) : this.of();
        }
    },
    sequence: {
        value: function _sequence(a) {
            return this.traverse(identity, a);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return this.isNothing ? a.of(Maybe.Nothing) : f(this.value).map(Maybe.of);
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
    factory: {
        value: Maybe
    }
});

maybe_monad.ap = maybe_monad.apply;
maybe_monad.fmap = maybe_monad.flatMap;
maybe_monad.chain = maybe_monad.flatMap;
maybe_monad.bind = maybe_monad.flapMap;
maybe_functor.reduce = maybe_functor.fold;



//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
maybe_monad.constructor = maybe_monad.factory;


export { Maybe, maybe_monad };