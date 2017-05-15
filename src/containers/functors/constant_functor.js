/**
 * @description:
 * @param: {*} item
 * @return: {@see _constant_f}
 */
function Constant(item) {
    return Object.create(_constant_f, {
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
 * @return: {@see _constant_f}
 */
Constant.of = function _of(item) {
    return Constant(item);
};

/**
 * @description:
 * @type {{
 * map: {function} _constant_f._map,
 * apply: {function} _constant_f._apply,
 * flatMap: {function} _constant_f._flatMap,
 * mjoin: {function} _constant_f._mjoin,
 * of: {function} _constant_f._of,
 * toString: {function} _constant_f._toString
 * }}
 */
var _constant_f = {
    get value() {
        return this._value;
    },
    /**
     * @description:
     * @return: {@see _constant_f}
     */
    map: function _map() {
        return Constant.of(this.value)
    },
    /**
     * @description:
     * @return: {@see _constant_f}
     */
    flatMap: function _flatMap() {
        return Constant.of(this.value);
    },
    /**
     * @description:
     * @param: {*} item
     * @return: {@see _constant_f}
     */
    of: function _of(item) {
        return Constant.of(item);
    },
    /**
     * @description:
     * @return: {string}
     */
    toString: function _toString() {
        return `Constant(${this.value})`;
    }
};

export { Constant, _constant_f };