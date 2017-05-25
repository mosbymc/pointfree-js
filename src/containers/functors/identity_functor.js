/**
 * @description:
 * @param: {*} item
 * @return: {@see _identity_f}
 */
function Identity(item) {
    return Object.create(_identity_f, {
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
 * @return: {@see _identity_f}
 */
Identity.of = function _of(item) {
    return Identity(item);
};

var _identity_f = {
    /**
     * @description:
     * @return: {@see _identity_f}
     */
    get value() {
        return this._value;
    },
    /**
     * @description:
     * @param: {function} fn
     * @return: {@see _identity_f}
     */
    map: function _map(fn) {
        return this.of(fn(this.value));
    },
    /**
     * @description:
     * @param: {function} fn
     * @return: {@see _identity_f}
     */
    flatMap: function _flatMap(fn) {
        return _identity_f.isPrototypeOf(this.value) ? this.value.map(fn) : this.of(fn(this.value));
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
     * @return: {@see _identity_f}
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

export { Identity, _identity_f };