import { equalMaker, pointMaker, stringMaker, valueOf, get, orElse, getOrElse } from '../containerHelpers';

/**
 * @sig
 * @description d
 * @param {*} [item] - a
 * @return {identity_functor} - b
 */
function Identity(item) {
    return Object.create(identity_functor, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @sig
 * @description d
 * @param {*} [x] - a
 * @return {identity_functor} - b
 */
Identity.of = x => Identity(x);

/**
 * @sig
 * @description d
 * @param {Object} [f] - a
 * @return {boolean} - b
 */
Identity.is = f => identity_functor.isPrototypeOf(f);

var identity_functor = {
    /**
     * @sig
     * @description d
     * @return {*} - a
     */
    get value() {
        return this._value;
    },
    /**
     * @sig
     * @description d
     * @param {function} fn - a
     * @return {identity_functor} - b
     */
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    /**
     * @sig
     * @description d
     * @return {*} - a
     */
    get: get,
    /**
     * @sig
     * @description d
     * @param {function} f - a
     * @return {*} - b
     */
    orElse: orElse,
    /**
     * @sig
     * @description d
     * @param {*} x - a
     * @return {*} - b
     */
    getOrElse: getOrElse,
    /**
     * @sig
     * @description d
     * @param {*} item - a
     * @return {identity_functor} - b
     */
    of: pointMaker(Identity),
    /**
     * @sig
     * @description d
     * @return {*} - a
     */
    valueOf: valueOf,
    /**
     * @sig
     * @description d
     * @return {string} - a
     */
    toString: stringMaker('Identity'),
    /**
     * @sig
     * @description d
     * @return {Identity} - a
     */
    factory: Identity
};

/**
 * @sig
 * @description d
 * @param {Object} ma - a
 * @return {boolean} - b
 */
identity_functor.equals = equalMaker(identity_functor);

/**
 * @sig
 * @description Since the constant functor does not represent a disjunction, the Identity's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type {function}
 * @param {function} f - a
 * @param {function} g - b
 * @return {identity_functor} - c
 */
identity_functor.bimap = identity_functor.map;


//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "you're too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
identity_functor.constructor = identity_functor.factory;


export { Identity, identity_functor };