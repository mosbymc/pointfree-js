import { identity_functor } from '../functors/identity_functor';
import { emptyObject } from '../../helpers';
import { identity } from '../../combinators';
import { apply, chain, mjoin, pointMaker } from '../containerHelpers';

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

/**
 * @description:
 * @param: {monad} m
 * @return: {boolean}
 */
Identity.is = m => identity_monad.isPrototypeOf(m);

/**
 * @description:
 * @return: {@see identity_monad}
 */
Identity.empty = function _empty() {
    return this.of(Object.create(emptyObject));
};

var identity_monad = Object.create(identity_functor, {
    fold: {
        value: function _fold(fn) {
            return fn(this.value);
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.traverse(identity, p);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return f(this.value).map(this.of);
        }
    },
    empty: {
        value: function _empty() {
            return this.of(Object.create(emptyObject));
        }
    },
    isEmpty: {
        get: function _getIsEmpty() {
            return emptyObject.isPrototypeOf(this.value);
        }
    },
    of: {
        value: pointMaker(Identity),
        writable: false,
        configurable: false
    },
    factory: {
        value: Identity
    }
});

identity_monad.chain = chain;
identity_monad.mjoin = mjoin;
identity_monad.apply = apply;

identity_monad.ap = identity_monad.apply;
identity_monad.fmap = identity_monad.chain;
identity_monad.flapMap = identity_monad.chain;
identity_monad.bind = identity_monad.chain;
identity_monad.reduce = identity_monad.fold;


//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
identity_monad.constructor = identity_monad.factory;

export { Identity, identity_monad };