import { just_functor, nothing_functor } from '../functors/maybe_functor';
import { identity } from '../../combinators';

function Maybe(item) {
    return null != item ? Maybe.Just(item) : Maybe.Nothing();
    /*return Object.create(maybe_monad, {
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
    });*/
}

/**
 * @description:
 * @param: {*} item
 * @return: {@see maybe_monad}
 */
Maybe.of = function _of(item) {
    return Object.create(just_monad, {
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

/**
 * @description:
 * @param: {monad} m
 * @return: {boolean}
 */
Maybe.is = m => just_monad.isPrototypeOf(m) || nothing_monad.isPrototypeOf(m);

Maybe.Just = function _just(item) {
    return Maybe.of(item);
};

Maybe.Nothing = function _nothing() {
    return Object.create(nothing_monad, {
        _value: {
            value: null,
            writable: false,
            configurable: false
        },
        isJust: {
            value: false
        },
        isNothing: {
            value: true
        }
    });
};

function Just(val) {
    return Object.create(just_monad, {
        _value: {
            value: val,
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
}

Just.of = Just;

/**
 * @description:
 * @param: {monad} m
 * @return: {boolean}
 */
Just.is = m => just_monad.isPrototypeOf(m);

function Nothing() {
    return Object.create(nothing_monad, {
        _value: {
            value: null,
            writable: false,
            configurable: false
        },
        isJust: {
            value: false
        },
        isNothing: {
            value: true
        }
    });
}

Nothing.of = Nothing;

/**
 * @description:
 * @param: {monad} m
 * @return: {boolean}
 */
Nothing.is = m => nothing_monad.isPrototypeOf(m);

/*
var maybe_monad = Object.create(maybe_functor, {
    flatMapWith: {
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
            return this.isNothing ? a.of(Maybe.Nothing) : f(this.value).map(this.of);
        }
    },
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
maybe_monad.fmap = maybe_monad.flatMapWith;
maybe_monad.chain = maybe_monad.flatMapWith;
maybe_monad.bind = maybe_monad.flapMap;
maybe_monad.reduce = maybe_monad.fold;*/

var just_monad = Object.create(just_functor, {
    chain: {
        value: function _chain(fn) {
            var val = fn(this.value);
            return just_monad.isPrototypeOf(val) ? val : this.of(val);
        }
    },
    mjoin: {
        value: function _mjoin() {
            return this.value;
        }
    },
    fold: {
        value: function _fold(fn, acc) {
            return fn(acc, this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f, g) {
            return f(this.value).map(this.of);
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
    nothing: {
        value: function _nothing() {
            return Nothing();
        }
    },
    of: {
        value: function _of(val) {
            if (null == val) return 'test';
            return Just.of(val);
        }
    },
    factory: {
        value: Maybe
    }
});

var nothing_monad = Object.create(nothing_functor, {
    chain: {
        value: function _chain() {
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
            return this.of();
        }
    },
    sequence: {
        value: function _sequence(a) {
            return this.traverse(identity, a);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return a.of(Maybe.Nothing());
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
            return Nothing();
        }
    },
    of: {
        value: function _of() {
            return Maybe.of();
        }
    },
    factory: {
        value: Maybe
    }
});


just_monad.ap = just_monad.apply;
just_monad.fmap = just_monad.chain;
just_monad.flapMap = just_monad.chain;
just_monad.bind = just_monad.chain;
just_monad.reduce = just_monad.fold;

nothing_monad.ap = nothing_monad.apply;
nothing_monad.fmap = nothing_monad.chain;
nothing_monad.flapMap = nothing_monad.chain;
nothing_monad.bind = nothing_monad.chain;
nothing_monad.reduce = nothing_monad.fold;



//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
just_monad.constructor = just_monad.factory;
nothing_monad.constructor = nothing_monad.factory;


export { Maybe, Just, Nothing, just_monad, nothing_monad };