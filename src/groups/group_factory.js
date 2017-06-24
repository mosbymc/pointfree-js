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
function groupFactory(concatFn, inverseFn, e, type) {
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
                value: e === x,
                writable: false,
                configurable: false
            },
            toString: {
                value: function _toString() {
                    return `${type || 'Group'}(${toString.call(this)})`;
                }
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
                value: e === x,
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
            }
        });
    }

    /**
     * @description:
     * @return: {string}
     */
    function toString() {
        return (Object.is(-0, this.value)) ? '-0' : this.value.toString();
    }

    /**
     * @description:
     * @param: {*} other
     * @return: {@see group}
     * @private
     */
    function _concat(other) {
        if (!Object.getPrototypeOf(this).isPrototypeOf(other)) return this;
        return this.isEmpty ? _internalGroupCreator(other._value, other._value)
            : other.isEmpty ? _internalGroupCreator(this._value, other._value) :
                _internalGroupCreator(concatFn(this._value, other._value), other._value);
    }

    /**
     * @description:
     * @param: {Array} others
     * @return: {@see group}
     * @private
     */
    function _concatAll(...others) {
        return others.filter(function _filterEmpty(g) {
            return !g.isEmpty && this.factory === g.factory && this.inverseConcat === g.inverseConcat;
        }, this).reduce(function _concatAll(curr, next) {
            return _internalGroupCreator(concatFn(curr.value, next.value), next.value);
        }, this);
    }

    /**
     * @description:
     * @param: {*} other
     * @return: {@see group}
     * @private
     */
    function _inverseConcat(other) {
        if (!Object.getPrototypeOf(this).isPrototypeOf(other)) return this;
        var invertedOther = other.isEmpty ? e : inverseFn(other.value);
        return _concat.call(this, _group(invertedOther));
    }

    /**
     * @description:
     * @param: {Array} others
     * @return: {@see group}
     * @private
     */
    function _inverseConcatAll(...others) {
        return others.filter(function _filterEmpty(g) {
            return !g.isEmpty && Object.getPrototypeOf(this).isPrototypeOf(g);
        }, this).reduce(function _concatAll(curr, next) {
            var invertedOther = inverseFn(next.value);
            return _internalGroupCreator(concatFn(curr.value, invertedOther), invertedOther);
        }, this);
    }

    /**
     * @description:
     * @return: {@see group}
     * @private
     */
    function _undo() {
        if (null != this.previous && e != this.previous) {
            var invertedPrev = inverseFn(this.previous);
            return _internalGroupCreator(concatFn(this._value, invertedPrev), invertedPrev);
        }
        return _group(this.value);
    }

    /**
     * @description:
     * @return: {@see group}
     */
    _group.identity = function _identity() {
        return _group(e);
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