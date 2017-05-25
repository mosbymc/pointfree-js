import { compose } from '../../functionalHelpers';

/**
 * @description:
 * @param: {function} item
 * @return: {@see _io_f}
 */
function Io(item) {
    return Object.create(_io_f, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        }
    })
}

/**
 * @description:
 * @param: {function|*} item
 * @return: {@see _io_f}
 */
Io.of = function _of(item) {
    return 'function' === typeof item ? Io(item) : Io(function _anon() { return item; });
};

/**
 * @description:
 * @type {{
 * value,
 * map: {function} _io_f._map,
 * flatMap: {function} _io_f._flatMap,
 * of: {function} _io_f._of,
 * toString: {function} _io_f._toString
 * }}
 */
var _io_f = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.of(compose(fn, this.value));
    },
    flatMap: function _flatMap(fn) {
        return _io_f.isPrototypeOf(this.value) ? this.value.map(fn) : this.of(compose(fn, this.value));
    },
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && this.value === ma.value;
    },
    of: function _of(item) {
        return Io.of(item);
    },
    /**
     * @description:
     * @return: {*}
     */
    valueOf: function _valueOf() {
        return this.value;
    },
    toString: function _toString() {
        return `Io(${this.value})`;
    },
    constructor: Io
};

export { Io, _io_f };