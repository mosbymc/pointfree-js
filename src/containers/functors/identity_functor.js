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
Identity.of = function _of(item) {
    return Identity(item);
};

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
     * @description:
     * @param: {function} fn
     * @return: {@see identity_functor}
     */
    flatMap: function _flatMap(fn) {
        return identity_functor.isPrototypeOf(this.value) ? this.value.map(fn) : this.of(fn(this.value));
    },
    /**
     * @description:
     * @param: {functor} ma
     * @return: {boolean}
     */
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && this.value === ma.value;
    },
    /**
     * @description:
     * @param: {*} item
     * @return: {@see identity_functor}
     */
    of: function _of(item) {
        return Identity.of(item);
    },
    /**
     * @description:
     * @return: {*}
     */
    valueOf: function _valueOf() {
        return this.value;
    },
    /**
     * @description:
     * @return: {string}
     */
    toString: function _toString() {
        return `Identity(${this.value})`;
    },
    constructor: Identity
};

export { Identity, identity_functor };