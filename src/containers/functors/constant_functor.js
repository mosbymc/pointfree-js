/**
 * @description:
 * @param: {*} item
 * @return: {@see constant_functor}
 */
function Constant(item) {
    return Object.create(constant_functor, {
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
 * @return: {@see constant_functor}
 */
Constant.of = function _of(item) {
    return Constant(item);
};

/**
 * @description:
 * @type {{
 * map: {function} constant_functor._map,
 * apply: {function} constant_functor._apply,
 * flatMap: {function} constant_functor._flatMap,
 * mjoin: {function} constant_functor._mjoin,
 * of: {function} constant_functor._of,
 * toString: {function} constant_functor._toString
 * }}
 */
var constant_functor = {
    get value() {
        return this._value;
    },
    /**
     * @description:
     * @return: {@see constant_functor}
     */
    map: _map,
    /**
     * @description:
     * @param: {*} item
     * @return: {@see constant_functor}
     */
    of: _of,
    /**
     * @description:
     * @param: {functor} ma
     * @return: {boolean}
     */
    equals: _equals,
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
    factory: Constant
};

function _map() {
    return this.of(this.value);
}

function _of(item) {
    return Constant.of(item);
}

function _equals(ma) {
    return Object.getPrototypeOf(this).isPrototypeOf(ma) && this.value === ma.value;
}

function _valueOf() {
    return this.value;
}

function _toString() {
    return `Constant(${this.value})`;
}

constant_functor.constructor = constant_functor.factory;

export { Constant, constant_functor };