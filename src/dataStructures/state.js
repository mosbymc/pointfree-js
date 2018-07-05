import { equals, stringMaker, valueOf } from './data_structure_util';
import { constant } from '../combinators';

/**
 * @description d
 * @namespace State
 * @memberOf dataStructures
 * @property {function} of
 * @property {function} is
 * @param {function} st - a
 * @return {dataStructures.state} - b
 */
function State(st) {
    //var t = tuple(val);
    return Object.create(state, {
        _value: {
            value: st,
            writable: false,
            configurable: false
        },
        run: {
            value: st,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @description d
 * @memberOf dataStructures.State
 * @param {*} a - a
 * @return {dataStructures.state} - b
 */
State.of = function _of(a) {
    return 'function' === typeof a ? State(a) : State(b => tuple(a, b));
};

/**
 * @description d
 * @memberOf dataStructures.State
 * @param {Object} fa - a
 * @return {boolean} - b
 */
State.is = function _is(fa) {
    return state.isPrototypeOf(fa);
};

/**
 * @description d
 * @namespace state
 * @memberOf dataStructures
 */
var state = {
    /**
     * @signature
     * @description d
     * @return {*} - a
     */
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return State(function _stateMap(x) {
            let [val, st] = this._value(x);
            return [fn(val), st];
        });
    },
    chain: function _chain(fn) {
        return State(function _stateChain(x) {
            let res = this._value(x);
            return Object.getPrototypeOf(this).isPrototypeOf(res) ? fn(res.runState(1)) : this.factory.of(res);
        });
    },
    put: function _put(val) {

    },
    changeState: function _changeState(val) {

    },
    /**
     * @signature
     * @description d
     * @param {*} item - a
     * @return {dataStructures.state} - b
     */
    of: pointMaker(State),
    /**
     * @signature
     * @description d
     * @return {*} - a
     */
    valueOf: valueOf,
    /**
     * @signature
     * @description d
     * @return {string} - a
     */
    toString: stringMaker('State'),
    get [Symbol.toStringTag]() {
        return 'State';
    },
    factory: State
};

function tuple(a, b) {
    return {
        first: a,
        second: b
    };
}

export { State, state };