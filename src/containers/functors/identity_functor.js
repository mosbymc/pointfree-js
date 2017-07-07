import { equalMaker, pointMaker, stringMaker, valueOf, get, orElse, getOrElse } from '../containerHelpers';

/**
 * @description:
 * @param: {*} item
 * @return: {@see identity_functor}
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
 * @description:
 * @param: {*} item
 * @return: {@see identity_functor}
 */
Identity.of = x => Identity(x);

/**
 * @description:
 * @param: {functor} f
 * @return: {boolean}
 */
Identity.is = f => identity_functor.isPrototypeOf(f);

var identity_functor = {
    /**
     * @description:
     * @return: {@see identity_functor}
     */
    get value() {
        return this._value;
    },
    /**
     * @description:
     * @param: {function} fn
     * @return: {@see identity_functor}
     */
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    /**
     * @type:
     * @description:
     * @return: {*}
     */
    get: get,
    /**
     * @type:
     * @description:
     * @param: {function} f
     * @return: {*}
     */
    orElse: orElse,
    /**
     * @type:
     * @description:
     * @param: {*} x
     * @return: {*}
     */
    getOrElse: getOrElse,
    /**
     * @description:
     * @param: {*} item
     * @return: {@see identity_functor}
     */
    of: pointMaker(Identity),
    /**
     * @description:
     * @return: {*}
     */
    valueOf: valueOf,
    /**
     * @description:
     * @return: {string}
     */
    toString: stringMaker('Identity'),
    /**
     * @description:
     * @return:
     */
    factory: Identity
};

/**
 * @description:
 * @param: {functor} ma
 * @return: {boolean}
 */
identity_functor.equals = equalMaker(identity_functor);


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