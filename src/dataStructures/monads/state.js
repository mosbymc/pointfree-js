import { equalMaker, pointMaker, stringMaker, valueOf, get, orElse, getOrElse } from '../data_structure_util';
import { constant } from '../../combinators';

function State(val) {
    var t = tuple(val);
    return Object.create(state, {
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
    return state.isPrototypeOf(fa);
};

var state = {
    /**
     * @sig
     * @description d
     * @return {identity_functor} - a
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
     * @sig
     * @description d
     * @return {*} - a
     */
    get: get,
    /**
     * @sig
     * @description d
     * @param {function} f - a
     * @return {*} - b
     */
    orElse: orElse,
    /**
     * @sig
     * @description d
     * @param {*} x - a
     * @return {*} - b
     */
    getOrElse: getOrElse,
    /**
     * @sig
     * @description d
     * @param {*} item - a
     * @return {identity_functor} - b
     */
    of: pointMaker(State),
    /**
     * @sig
     * @description d
     * @return {*} - a
     */
    valueOf: valueOf,
    /**
     * @sig
     * @description d
     * @return {string} - a
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

export { State, state };