import { constant_functor } from '../functors/constant_functor';
import { apply, mjoin, pointMaker } from '../containerHelpers';

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

/**
 * @description:
 * @param: {monad} m
 * @return: {boolean}
 */
Constant.is = m => constant_monad.isPrototypeOf(m);

var constant_monad = Object.create(constant_functor, {
    chain: {
        value: function _chain() {
            return this;
        }
    },
    fold: {
        value: function _fold() {
            return this.value;
        }
    },
    sequence: {
        value: function _sequence(p) {
            return this.of(this.value);
        }
    },
    traverse: {
        value: function _traverse(a, f) {
            return this.of(this.value);
        }
    },
    factory: {
        value: Constant
    }
});

constant_monad.mjoin = mjoin;
constant_monad.apply = apply;
constant_monad.of = pointMaker(Constant);

constant_monad.ap =constant_monad.apply;
constant_monad.fmap = constant_monad.chain;
constant_monad.flapMap = constant_monad.chain;
constant_monad.bind = constant_monad.chain;
constant_monad.reduce = constant_monad.fold;




//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
constant_monad.constructor = constant_monad.factory;


export { Constant, constant_monad };