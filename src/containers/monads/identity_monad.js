import { identity_functor } from '../functors/identity_functor';
import { emptyObject } from '../../helpers';

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
 * @return {@see identity_monad}
 */
Identity.empty = function _empty() {
    return this.of(Object.create(emptyObject));
};

var identity_monad = Object.create(identity_functor, {
    mjoin: {
        value: function _mjoin() {
            //return identity_monad.isPrototypeOf(this.value) ? this.value : this;
            return this.value;
        }
    },
    flatMap: {
        value: function _flatMap(fn) {
            return identity_monad.isPrototypeOf(this.value) ? this.value.map(fn) :
                this.of(fn(this.value));
        }
    },
    fold: {
        value: function _fold(fn) {
            return fn(this.value);
        }
    },
    foldMap: {
        value: function _foldMap(fn, empty) {

        }
    },
    traverse: {
        value: function _traverse(fa, fn) {
            return this.fold(function _fold(ys, x) {
                return fn(x).map(function _map(x) {
                    return function _map_(y) {
                        return y.concat([x]).ap(ys), fa(this.empty);
                    };
                });
            });
            /*return this.fold(function _reductioAdAbsurdum(xs, x) {
                fn(x).mapWith(function _map(x) {
                    return function _map_(y) {
                        return y.concat([x]);
                    };
                }).ap(xs);
                return fa(this.empty);
            });*/
        }
    },
    /**
     * @description:
     * @param: {monad} ma
     * @return: {monad}
     */
    apply: {
        value: //ma => ma.mapWith(this.value)
            function _apply(ma) {
            //console.log(Object.getPrototypeOf(ma), ma.mapWith);
            //return this.flatMap(function _apply(f) { return ma.mapWith(f); });
            return ma.map(this.value);
        }
    },
    of: {
        value: function _of(val) {
            return Identity.of(val);
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
    factory: {
        value: Identity
    }
});

identity_monad.ap = identity_monad.apply;
identity_monad.fmap = identity_monad.flatMap;
identity_monad.chain = identity_monad.flatMap;
identity_monad.bind = identity_monad.flatMap;
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