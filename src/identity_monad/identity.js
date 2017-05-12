/**
 * @description:
 * @param: {*} item
 * @return: {@see _identity}
 */
function Identity(item) {
    return Object.create(_identity, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        },
        value: {
            get: function _getValue() {
                return this._value;
            }
        }
    });
}

/**
 * @description:
 * @param: {*} item
 * @return: {@see _identity}
 */
Identity.of = function _of(item) {
    return Identity(item);
};

var _identity = {
    /**
     * @description:
     * @return: {@see _identity}
     */
    get value() {
        return this._value;
    },
    /**
     * @description:
     * @param: {function} fn
     * @return: {@see _identity}
     */
    map: function _map(fn) {
        return Identity(fn(this.value));
    },
    /**
     * @description:
     * @param: {monad} ma
     * @return: {monad}
     */
    apply: function _apply(ma) {
        return this.map(ma.value);
    },
    /**
     * @description:
     * @param: {function} fn
     * @return: {*}
     */
    flatMap: function _flatMap(fn) {
        return fn(this.value);
    },
    /**
     * @description:
     * @return: {*}
     */
    mjoin: function _mjoin() {
        return this.value;
    },
    /**
     * @description:
     * @param: {*} item
     * @return: {@see _identity}
     */
    of: function _of(item) {
        return Identity.of(item);
    },
    /**
     * @description:
     * @return: {string}
     */
    toString: function _toString() {
        return `Identity(${this.value})`;
    }
};

export { Identity, _identity };