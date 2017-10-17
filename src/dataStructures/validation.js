import { monad_apply, chain, mjoin, equals, stringMaker, valueOf } from './data_structure_util';

/**
 * @description d
 * @namespace Validation
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @param {*} val - a
 * @return {dataStructures.validation} - b
 */
function Validation(val) {
    return Object.create(validation, {
        _value: {
            value: val
        }
    });
}

/**
 * @description d
 * @memberOf dataStructures.Validation
 * @param {*} val - a
 * @return {dataStructures.validation} - b
 */
Validation.of = function _of(val) {
    return Validation(val);
};

/**
 * @signature
 * @description d
 * @memberOf dataStructures.Validation
 * @param {Object} f - a
 * @return {boolean} - b
 */
Validation.is = f => validation.isPrototypeOf(f);

/**
 * @description d
 * @namespace validation
 * @memberOf dataStructures
 */
var validation = {
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    valueOf: valueOf,
    equals: equals,
    toString: stringMaker('Validation'),
    get [Symbol.toStringTag]() {
        return 'Validation';
    },
    factory: Validation
};

/**
 * @signature
 * @description Since the constant functor does not represent a disjunction, the Validation's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @memberOf dataStructures.validation
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {validation} - c
 */
validation.bimap = validation.map;

validation.chain = chain;
validation.mjoin = mjoin;
validation.apply = monad_apply;
validation.constructor = validation.factory;

export { Validation, validation };