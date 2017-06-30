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
    map: _map,
    /**
     * @description:
     * @param: {functor} ma
     * @return: {boolean}
     */
    equals: _equals,
    /**
     * @description:
     * @param: {*} item
     * @return: {@see identity_functor}
     */
    of: _of,
    /**
     * @description:
     * @return: {*}
     */
    valueOf: _valueOf,
    /**
     * @description:
     * @return: {string}
     */
    toString: _toString,
    factory: Identity
};

function _map(fn) {
    return this.of(fn(this.value));
}

function _equals(ma) {
    return Object.getPrototypeOf(this).isPrototypeOf(ma) && this.value === ma.value;
}

function _of(item) {
    return Identity.of(item);
}

function _valueOf() {
    return this.value;
}

function _toString() {
    return `Identity(${this.value})`;
}


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