import { equalMaker, pointMaker, stringMaker, valueOf } from '../dataStructureHelpers';

function Validation(val) {
    return Object.create(validation_functor, {
        _value: {
            value: val
        }
    });
}

Validation.of = function _of(val) {
    return Validation(val);
};

/**
 * @sig
 * @description d
 * @param {Object} f - a
 * @return {boolean} - b
 */
Validation.is = f => validation_functor.isPrototypeOf(f);

var validation_functor = {
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    of: pointMaker(Validation),
    valueOf: valueOf,
    toString: stringMaker('Validation'),
    factory: Validation
};

/**
 * @sig
 * @description d
 * @return {boolean} - a
 */
validation_functor.equals = equalMaker(validation_functor);

/**
 * @sig
 * @description Since the constant functor does not represent a disjunction, the Validation's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {validation_functor} - c
 */
validation_functor.bimap = validation_functor.map;

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
validation_functor.constructor = validation_functor.factory;


export { Validation, validation_functor };