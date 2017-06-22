import { identity } from '../combinators';

/**
 * @description: Takes a function that can perform the desired type of concatenation and an optional
 * string that describes the type of monoid that is being created. The 'type' parameter is used in
 * the .toString() functionality only for representing the created monoid's type. The function returns
 * a new function, that, when invoked, will return a monoid with the concatenation function originally
 * provided as the means of concatenation. The resulting monoid adheres to the FantasyLand spec.
 * @param: {function} concatFn
 * @param: {string} type
 * @returns {_monoid}
 */
function groupFactory(concatFn, inverseFn, e, type) {
    //TODO: I need to figure out a way to create a new group type instance that enables
    //TODO: me to set the 'prev' field on, or just after creation. Ideally, the consumer
    //TODO: would not have access to this operation
    function _internalGroupCreator(x, prev) {
        return Object.create(group, {
            _value: {
                value: x
            },
            _prev: {
                value: prev
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
                value: e === x
            },
            toString: {
                value: function _toString() {
                    return `${type}(${toString.call(this)})`;
                }
            }
        });
    }

    /**
     * @description:
     * @param: {*} x - The initial value of the new semigroup/monoid
     * @return: {Object}
     */
    function _group(x) {
        return Object.create(group, {
            _value: {
                value: x
            },
            _prev: {
                value: null
            },
            /**
             * @description:
             * @param: {*} other
             * @return:
             */
            concat: {
                value: _concat
            },
            /**
             * @description:
             * @param: {Array} others
             * @return:
             */
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
                value: e === x
            },
            /**
             * @description:
             * @return: {string}
             */
            toString: {
                value: function _toString() {
                    return `${type}(${toString.call(this)})`;
                }
            }
        });
    }

    /**
     * @description:
     * @return: {string}
     */
    function toString() {
        if (this.isEmpty) return 'identity';
        if (Object.is(-0, this.value)) return '-0';
        return this._value.toString();
    }

    function _concat(other) {
        return this.isEmpty ? _internalGroupCreator(other._value, other._value)
            : other.isEmpty ? _internalGroupCreator(this._value, other._value) :
                _internalGroupCreator(concatFn(other._value, this._value), other._value);
    }

    function _concatAll(...others) {
        return others.filter(function _filterEmpty(m) {
            return !m.isEmpty;
        }).reduce(function _concatAll(curr, next) {
            return curr.concat(next);
        }, this);
    }

    function _inverseConcat(other) {
        var invertedOther = other.isEmpty ? e : inverseFn(other.value);
        return this.isEmpty ? _internalGroupCreator(invertedOther, invertedOther)
            : other.isEmpty ? _internalGroupCreator(this._value, this._value) :
                _internalGroupCreator(concatFn(invertedOther, this._value), invertedOther);
    }

    function _inverseConcatAll(...others) {

    }

    function _undo() {
        if (null != this.previous && e != this.previous) {
            var invertedPrev = inverseFn(this.previous);
            return _internalGroupCreator(concatFn(invertedPrev, this._value), invertedPrev);
            //return concatFn.call(this, _group(inverseFn(this.value)));
        }
        return _group(this.value);
    }

    /**
     * @description:
     * @return: {Object}
     */
    _group.empty = function _empty() {
        return _group(e);
    };

    return _group;
}


var group = {
    get value() {
        return this.isEmpty ? undefined : this._value;
    },
    _prev: null,
    get previous() {
        return this._prev;
    },
    set previous(val) {
        this._prev = val;
    },
    get isEmpty() {
        return this.value === identity;
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