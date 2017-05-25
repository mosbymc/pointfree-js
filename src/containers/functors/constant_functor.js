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
        return this.of(this.value)
    },
    /**
     * @description:
     * @return: {@see _constant_f}
     */
    flatMap: function _flatMap() {
        return this.of(this.value);
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
     * @param: {functor} ma
     * @return: {boolean}
     */
    equals: function _equals(ma) {
        return Object.getPrototypeOf(this).isPrototypeOf(ma) && this.value === ma.value;
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
        return `Constant(${this.value})`;
    },
    /**
     * @description: sigh.... awesome spec ya got there fantasy-land. Yup, good thing you guys understand
     * JS and aren't treating it like a static, strongly-typed, class-based language with inheritance...
     * cause, ya know... that would be ridiculous if we were going around pretending there is such a thing
     * as constructors in the traditional OOP sense of the word in JS, or that JS has some form of inheritance.
     *
     * What's that? Put a constructor property on a functor that references the function used to create an
     * object that delegates to said functor? Okay.... but why would we call it a 'constructor'? Oh, that's
     * right, you wrote a spec for a language you don't understand rather than trying to understand it and
     * then writing the spec. Apparently your preferred approach is to bury your head in the sand and pretend
     * that JS has classes like the rest of the idiots.
     *
     * Thanks for your contribution to the continual misunderstanding, misapplication, reproach, and frustration
     * of JS developers; thanks for making the world of JavaScript a spec which has become the standard and as
     * such enforces poor practices, poor design, and mental hurdles.
     */
    constructor: Constant
};

export { Constant, _constant_f };