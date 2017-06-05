import { compose } from '../../functionalHelpers';

/**
 * @description:
 * @param: {function} item
 * @return: {@see io_functor}
 */
function Io(item) {
    return Object.create(io_functor, {
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
 * @return: {@see io_functor}
 */
Io.of = function _of(item) {
    return 'function' === typeof item ? Io(item) : Io(function _anon() { return item; });
};

/**
 * @description:
 * @type {{
 * value,
 * map: {function} io_functor._map,
 * flatMap: {function} io_functor._flatMap,
 * of: {function} io_functor._of,
 * toString: {function} io_functor._toString
 * }}
 */
var io_functor = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.of(compose(fn, this.value));
    },
    flatMap: function _flatMap(fn) {
        return io_functor.isPrototypeOf(this.value) ? this.value.map(fn) : this.of(compose(fn, this.value));
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

export { Io, io_functor };