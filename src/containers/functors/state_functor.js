import { equalMaker, pointMaker, stringMaker, valueOf, get, orElse, getOrElse } from '../containerHelpers';
import { constant } from '../../combinators';

function State(val) {
    var t = tuple(val);
    return Object.create(state_functor, {
        _value: {
            value: t,
            writable: false,
            configurable: false
        },
        run: {
            value: t,
            writable: false,
            configurable: false
        }
    });
}

State.of = function _of(a) {
    return 'function' === typeof a ? State(a) : State(b => tuple(a, b));
};

State.is = function _is(fa) {
    return state_functor.isPrototypeOf(fa);
};

var state_functor = {
    /**
     * @description:
     * @return: {@see identity_functor}
     */
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return State();
    },
    put: function _put(val) {

    },
    changeState: function _changeState(val) {

    },
    /**
     * @type:
     * @description:
     * @return: {*}
     */
    get: get,
    /**
     * @type:
     * @description:
     * @param: {function} f
     * @return: {*}
     */
    orElse: orElse,
    /**
     * @type:
     * @description:
     * @param: {*} x
     * @return: {*}
     */
    getOrElse: getOrElse,
    /**
     * @description:
     * @param: {*} item
     * @return: {@see identity_functor}
     */
    of: pointMaker(State),
    /**
     * @description:
     * @return: {*}
     */
    valueOf: valueOf,
    /**
     * @description:
     * @return: {string}
     */
    toString: stringMaker('State'),
    factory: State
};

function tuple(a, b) {
    return {
        first: a,
        second: b
    };
}

export { State, state_functor };