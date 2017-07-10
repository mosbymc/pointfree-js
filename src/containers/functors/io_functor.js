import { compose, constant } from '../../combinators';
import { equalMaker, pointMaker, stringMaker, valueOf } from '../containerHelpers';

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
        },
        run: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @description:
 * @param: {function|*} item
 * @return: {@see io_functor}
 */
Io.of = function _of(item) {
    return 'function' === typeof item ? Io(item) : Io(constant(item));
};

/**
 * @description:
 * @param: {functor} f
 * @return: {boolean}
 */
Io.is = f => io_functor.isPrototypeOf(f);

 /**
 * @description:
 * @type {{
 * value,
 * map: {function} io_functor._map,
 * of: {function} io_functor._of,
 * toString: {function} io_functor._toString
 * }}
 */
var io_functor = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.chain(a => Io.of(fn(a)));
    },
    runIo: function _runIo(...args) {
        return this.run(...args);
    },
    of: pointMaker(Io),
    valueOf: valueOf,
    toString: stringMaker('Io'),
    factory: Io
};

/**
 * @description:
 * @return:
 */
io_functor.equals = equalMaker(io_functor);

/**
 * @description: Since the constant functor does not represent a disjunction, the Io's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @type: {{function}}
 * @param: {function} f
 * @param: {function} g
 * @return: {@see io_functor}
 */
io_functor.bimap = io_functor.map;




//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
io_functor.constructor = io_functor.factory;

export { Io, io_functor };