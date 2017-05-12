/**
 * @description:
 * @param: {*} item
 * @return: {@see _just}
 */
function Just(item) {
    return Object.create(_just, {
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
 * @return: {@see _just}
 */
Just.of = function _of(item) {
    return Just(item);
};

/**
 * @description:
 * @type {{
 * map: {function} _just._map,
 * apply: {function} _just._apply,
 * flatMap: {function} _just._flatMap,
 * mjoin: {function} _just._mjoin,
 * of: {function} _just._of,
 * toString: {function} _just._toString
 * }}
 */
var _just = {
    /**
     * @description:
     * @return: {@see _just}
     */
    map: function _map() {
        return this;
    },
    /**
     * @description:
     * @param: {monad} ma
     * @return: {monad}
     */
    apply: function _apply(ma) {
        return ma.map(this.value);
    },
    /**
     * @description:
     * @return: {@see _just}
     */
    flatMap: function _flatMap() {
        return this;
    },
    /**
     * @description:
     * @return: {@see _just}
     */
    mjoin: function _mjoin() {
        return this;
    },
    /**
     * @description:
     * @param: {*} item
     * @return: {@see _just}
     */
    of: function _of(item) {
        return Just.of(item);
    },
    /**
     * @description:
     * @return: {string}
     */
    toString: function _toString() {
        return `Just(${this.value})`;
    }
};

export { Just, _just };