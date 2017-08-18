import { validation_functor } from '../functors/validation_functor';
import { apply, chain, mjoin, pointMaker } from '../dataStructureHelpers';

function Validation(val) {
    return Object.create(validation_monad, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

Validation.of = function _of(val) {
    return Validation(val);
};

/**
 * @sig
 * @description d
 * @param {Object} m - a
 * @return {boolean} - b
 */
Validation.is = m => validation_monad.isPrototypeOf(m);

var validation_monad = Object.create(validation_functor, {
    of: {
        value: pointMaker(Validation),
        writable: false,
        configurable: false
    },
    factory: {
        value: Validation
    }
});

validation_monad.chain = chain;
validation_monad.mjoin = mjoin;
validation_monad.apply = apply;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
validation_monad.constructor = validation_monad.factory;


export { Validation, validation_monad };