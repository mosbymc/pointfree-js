import { identity } from '../combinators';
import { binary, rightApply } from '../decorators';

var e = binary(rightApply(identity));
console.log(e(1)(2));

/**
 * @description: Takes a function that can perform the desired type of concatenation and an optional
 * string that describes the type of group that is being created. The 'type' parameter is used in
 * the .toString() functionality only for representing the created group's type. The function returns
 * a new function, that, when invoked, will return a group with the concatenation function originally
 * provided as the means of concatenation. The resulting group adheres to the FantasyLand spec for monoids
 * and in addition allows for inverse concat operations to be performed, thus making the resulting data
 * structure a group, not a semigroup or monoid.
 * @param: {function} concatFn
 * @param: {function} inverseFn
 * @param: {*} e
 * @param: {string} type
 * @return: {@see group}
 */
function groupFactory(concatFn, inverseFn, identity, type) {
    /**
     * @description:
     * @param: {*} x
     * @param: {*} prev
     * @return: {@see group}
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
            inverseFn: {
                value: inverseFn,
                writable: true
            }
        });
    }

    /**
     * @description:
     * @param: {*} x - The initial value of the new semigroup/monoid
     * @return: {@see group}
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
            inverseFn: {
                value: inverseFn,
                writable: true
            }
        });
    }

    /**
     * @description:
     * @return: {string}
     */
    function toString() {
        return (Object.is(-0, this.value)) ? '-0' :
            this.isEmpty ? 'nil' : this.value.toString();
    }

    /**
     * @description:
     * @param: {*} x
     * @return: {@see group}
     * @private
     */
    function _concat(x) {
        if (x.isEmpty || !Object.getPrototypeOf(this).isPrototypeOf(x)) return this;
        return _internalGroupCreator(this.concatFn(this.value, x.value), x.value);
    }

    /**
     * @description:
     * @param: {Array} others
     * @return: {@see group}
     * @private
     */
    function _concatAll(...xs) {
        return xs.filter(x => !x.isEmpty && this.factory === x.factory && this.inverseConcat === x.inverseConcat, this)
            .reduce((curr, next) => _internalGroupCreator(curr.concatFn(curr.value, next.value), next.value), this);
    }

    /**
     * @description:
     * @param: {*} x
     * @return: {@see group}
     * @private
     */
    function _inverseConcat(x) {
        if (x.isEmpty || !Object.getPrototypeOf(this).isPrototypeOf(x)) return this;
        var inverseX = inverseFn(x.value);
        return _internalGroupCreator(this.concatFn(this.value, inverseX), inverseX);
    }

    /**
     * @description:
     * @param: {Array} xs
     * @return: {@see group}
     * @private
     */
    function _inverseConcatAll(...xs) {
        return xs.filter(x => !x.isEmpty && Object.getPrototypeOf(this).isPrototypeOf(x), this)
            .reduce((curr, next) => {
                var inverseVal = inverseFn(next.value);
                return _internalGroupCreator(curr.concatFn(curr.value, inverseVal), inverseVal);
            }, this);
    }

    /**
     * @description:
     * @return: {@see group}
     * @private
     */
    function _undo() {
        if (null != this.previous && identity != this.previous) {
            var invertedPrev = this.inverseFn(this.previous);
            return _internalGroupCreator(this.concatFn(this.value, invertedPrev), invertedPrev);
        }
        return _group(this.value);
    }

    /**
     * @description:
     * @return: {@see group}
     */
    _group.identity = function _identity() {
        var g = _group(identity);
        g.concatFn = e;
        return g;
    };

    /**
     * @description:
     * @return: {@see group}
     */
    _group.empty = _group.identity;

    return _group;
}

/**
 *
 * @type {{value, previous, valueOf: group._valueOf}}
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