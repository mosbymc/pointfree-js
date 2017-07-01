import { equalMaker, pointMaker, stringMaker, valueOf } from '../containerHelpers';

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
Constant.of = x => Constant(x);

Constant.is = f => constant_functor.isPrototypeOf(f);

/**
 * @description:
 * @type {{
 * map: {function} _map,
 * apply: {function} _apply,
 * flatMapWith: {function} _flatMap,
 * mjoin: {function} _mjoin,
 * of: {function} _of,
 * toString: {function} _toString
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
    map: function _map() {
        return this.of(this.value);
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
    factory: Constant
};

/**
 * @description:
 * @param: {functor} ma
 * @return: {boolean}
 */
constant_functor.equals = equalMaker(constant_functor);

/**
 * @description:
 * @param: {*} item
 * @return: {@see constant_functor}
 */
constant_functor.of = pointMaker(Constant);

/**
 * @description:
 * @return: {*}
 */
constant_functor.valueOf = valueOf;

/**
 * @description:
 * @return: {string}
 */
constant_functor.toString = stringMaker('Constant');

constant_functor.constructor = constant_functor.factory;

export { Constant, constant_functor };