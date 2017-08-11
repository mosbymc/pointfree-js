import { identity } from '../src/combinators';
import { binary, rightApply } from '../src/decorators';

var e = binary(rightApply(identity));

/**
 * @sig
 * @description Takes a function that can perform the desired type of concatenation and an optional
 * string that describes the type of group that is being created. The 'type' parameter is used in
 * the .toString() functionality only for representing the created group's type. The function returns
 * a new function, that, when invoked, will return a group with the concatenation function originally
 * provided as the means of concatenation. The resulting group adheres to the FantasyLand spec for monoids
 * and in addition allows for inverse concat operations to be performed, thus making the resulting data
 * structure a group, not a semigroup or monoid.
 * @param {function} concatFn - a
 * @param {function} inverseConcatFn - b
 * @param {function} invertFn - c
 * @param {*} identity - d
 * @param {string} type - e
 * @return {group} - f
 */
function groupFactory(concatFn, inverseConcatFn, invertFn, identity, type) {
    /**
     * @sig
     * @description d
     * @param {*} x - a
     * @param {*} prev - b
     * @return {group} - c
     * @private
     */
    function _internalGroupCreator(x, prev) {
        return Object.create(group, {
            _value: {
                value: x,
                writable: false,
                configurable: false
            },
            _prev: {
                value: prev,
                writable: false,
                configurable: false
            },
            concat: {
                value: _concat
            },
            concatAll: {
                value: _concatAll
            },
            inverseConcat: {
                value: _inverseConcat
            },
            inverseConcatAll: {
                value: _inverseConcatAll
            },
            undo: {
                value: _undo
            },
            factory: {
                value: _group
            },
            constructor: {
                value: _group
            },
            isEmpty: {
                value: identity === x,
                writable: false,
                configurable: false
            },
            toString: {
                value: function _toString() {
                    return `${type || 'Group'}(${toString.call(this)})`;
                }
            },
            concatFn: {
                get: function _getConcatFn() {
                    return this._concatFn ? this._concatFn.bind(this) : concatFn.bind(this);
                },
                set: function _setConcatFn(fn) {
                    this._concatFn = fn.bind(this);
                }
            },
            inverseConcatFn: {
                get: function _getInverseConcatFn() {
                    return this._inverseConcatFn ? this._inverseConcatFn.bind(this) : inverseConcatFn.bind(this);
                },
                set: function _setInverseConcatFn(fn) {
                    this._inverseConcatFn = fn.bind(this);
                }
            },
            invertFn: {
                value: invertFn,
                writable: true
            }
        });
    }

    /**
     * @sig
     * @description d
     * @param {*} x - The initial value of the new semigroup/monoid
     * @return {group} - a
     */
    function _group(x) {
        return Object.create(group, {
            _value: {
                value: x,
                writable: false,
                configurable: false
            },
            _prev: {
                value: null,
                writable: false,
                configurable: false
            },
            /**
             * @description:
             * @param: {*} other
             * @return: {@see group}
             */
            concat: {
                value: _concat
            },
            /**
             * @description:
             * @param: {Array} others
             * @return: {@see group}
             */
            concatAll: {
                value: _concatAll
            },
            /**
             * @description:
             * @param: {*} other
             * @return: {@see group}
             */
            inverseConcat: {
                value: _inverseConcat
            },
            /**
             * @description:
             * @param: {*, *, ...} others
             * @return: {@see group}
             */
            inverseConcatAll: {
                value: _inverseConcatAll
            },
            /**
             * @description:
             * @return: {@see group}
             */
            undo: {
                value: _undo
            },
            /**
             * @description:
             */
            factory: {
                value: _group
            },
            constructor: {
                value: _group
            },
            /**
             * @description:
             */
            isEmpty: {
                value: identity === x,
                writable: false,
                configurable: false
            },
            /**
             * @description:
             * @return: {string}
             */
            toString: {
                value: function _toString() {
                    return `${type}(${toString.call(this)})`;
                }
            },
            concatFn: {
                get: function _getConcatFn() {
                    return this._concatFn ? this._concatFn.bind(this) : concatFn.bind(this);
                },
                set: function _setConcatFn(fn) {
                    this._concatFn = fn.bind(this);
                }
            },
            inverseConcatFn: {
                get: function _getInverseConcatFn() {
                    return this._inverseConcatFn ? this._inverseConcatFn.bind(this) : inverseConcatFn.bind(this);
                },
                set: function _setInverseConcatFn(fn) {
                    this._inverseConcatFn = fn.bind(this);
                }
            },
            invertFn: {
                value: invertFn,
                writable: true
            }
        });
    }

    /**
     * @sig
     * @description d
     * @return {string} - a
     */
    function toString() {
        return (Object.is(-0, this.value)) ? '-0' :
            this.isEmpty ? 'nil' : this.value.toString();
    }

    /**
     * @sig
     * @description d
     * @param {*} x - a
     * @return {group} - b
     * @private
     */
    function _concat(x) {
        if (x.isEmpty || !Object.getPrototypeOf(this).isPrototypeOf(x)) return this;
        return _internalGroupCreator(this.concatFn(this.value, x.value), x.value);
    }

    /**
     * @sig
     * @description d
     * @param {Array} xs - a
     * @return {group} - b
     * @private
     */
    function _concatAll(...xs) {
        return xs.filter(x => !x.isEmpty && this.factory === x.factory && this.inverseConcat === x.inverseConcat, this)
            .reduce((curr, next) => _internalGroupCreator(curr.concatFn(curr.value, next.value), next.value), this);
    }

    /**
     * @sig
     * @description d
     * @param {*} x - a
     * @return {group} - b
     * @private
     */
    function _inverseConcat(x) {
        if (x.isEmpty || !Object.getPrototypeOf(this).isPrototypeOf(x)) return this;
        return _internalGroupCreator(this.inverseConcatFn(this.value, x.value), invertFn(x.value));
    }

    /**
     * @sig
     * @description d
     * @param {Array} xs - a
     * @return {group} - b
     * @private
     */
    function _inverseConcatAll(...xs) {
        return xs.filter(x => !x.isEmpty && Object.getPrototypeOf(this).isPrototypeOf(x), this)
            .reduce((curr, next) => _internalGroupCreator(curr.inverseConcatFn(curr.value, next.value), invertFn(next.value)), this);
    }

    /**
     * @sig
     * @description d
     * @return {group} - a
     * @private
     */
    function _undo() {
        if (null != this.previous && identity != this.previous) {
            var invertedPrev = invertFn(this.previous);
            return _internalGroupCreator(this.concatFn(this.value, invertedPrev), invertedPrev);
        }
        return _group(this.value);
    }

    /**
     * @sig
     * @description d
     * @return {group} - a
     */
    _group.identity = function _identity() {
        var g = _group(identity);
        g.concatFn = e;
        return g;
    };

    /**
     * @sig
     * @description d
     * @return {group} - a
     */
    _group.empty = _group.identity;

    /**
     * @sig
     * @description d
     * @return {group} - a
     */
    _group.unit = _group.identity;

    return _group;
}

/**
 * @description
 * @typedef {Object}
 * @property {function} value
 * @property {function} previous
 * @property {function} valueOf
 */
var group = {
    get value() {
        return this._value;
    },
    get previous() {
        return this._prev;
    },
    valueOf: function _valueOf() {
        return this._value;
    }
};

// p1 = { name: first('Nico'), isPaid: all2(true), points: sum(10), friends: ['Franklin'] },
//  p2 = { name: first('Nico'), isPaid: all2(false), points: sum(2), friends: ['Gatsby'] };

function structure(obj) {
    return {
        obj,
        concat: function _concat(other) {
            var newStructure = {};
            Object.getOwnPropertyNames(obj).map(function _map(key) {
                return {
                    key: key,
                    value: null != obj[key].concat(other.obj[key]).x ? obj[key].concat(other.obj[key]).x : obj[key].concat(other.obj[key])
                };
            }).forEach(function _map(item) {
                newStructure[item.key] = item.value;
            });
            return structure(newStructure);
        },
        toString: function _toString() {
            return `structure(${obj})`;
        }
    };
}

export { groupFactory };