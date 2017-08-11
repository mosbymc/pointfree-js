var emptyObj = Object.create({});

/**
 * @sig
 * @description Takes a function that can perform the desired type of concatenation and an optional
 * string that describes the type of monoid that is being created. The 'type' parameter is used in
 * the .toString() functionality only for representing the created monoid's type. The function returns
 * a new function, that, when invoked, will return a monoid with the concatenation function originally
 * provided as the means of concatenation. The resulting monoid adheres to the FantasyLand spec.
 * @param {function} concatFn - a
 * @param {string} type - b
 * @param {*} identity - c
 * @return {_monoid} - d
 */
function monoidFactory(concatFn, type, identity) {
    /**
     * @sig
     * @description d
     * @param {*} x - The initial value of the new semigroup/monoid
     * @return {Object} - a
     */
    function _monoid(x) {
        return Object.create({}, {
            _value: {
                value: x
            },
            /**
             * @description:
             * @return:
             */
            value: {
                get: function _getValue() {
                    return this.isEmpty ? undefined : this._value;
                }
            },
            /**
             * @description:
             * @param: {*} other
             * @return:
             */
            concat: {
                value: function _concat(other) {
                    return this.isEmpty ? _monoid(other._value)
                        : other.isEmpty ? _monoid(this._value) : concatFn.call(this, other);
                }
            },
            /**
             * @description:
             * @param: {Array} others
             * @return:
             */
            concatAll: {
                value: function _concatAll(...others) {
                    return others.filter(function _filterEmpty(m) {
                        return !m.isEmpty;
                    }).reduce(function _concatAll(curr, next) {
                        return curr.concat(next);
                    }, this);
                }
            },
            /**
             * @description:
             */
            factory: {
                value: _monoid
            },
            constructor: {
                value: _monoid
            },
            /**
             * @description:
             */
            isEmpty: {
                value: emptyObj.isPrototypeOf(x)
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
     * @sig
     * @description d
     * @return {string} - a
     */
    function toString() {
        if (this.isEmpty) return 'empty';
        if (Object.is(-0, this.value)) return '-0';
        return this.value.toString();
    }

    /**
     * @sig
     * @description d
     * @return {Object} - a
     */
    _monoid.empty = function _empty() {
        return _monoid(Object.create(emptyObj));
    };

    return _monoid;
}

/*
function monadMonoid(concatFn, m) {
    Object.defineProperties(m, {
        isEmpty: {
            get: function _getIsEmpty() {
                return null == this.value;
            }
        },
        concat: {
            value: function _concat(other) {
                return this.isEmpty ? _monoid(other._value)
                    : other.isEmpty ? _monoid(this._value) : concatFn.call(this, other);
            }
        },
        concatAll: {
            value: function _concatAll(...others) {
                return others.filter(function _filterEmpty(m) {
                    return !m.isEmpty;
                }).reduce(function _concatAll(curr, next) {
                    return curr.concat(next);
                }, this);
            }
        }
    });
}

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

var monoid = {
    get value() {
        return this.isEmpty ? undefined : this._value;
    },
    concatAll: function _concatAll(...others) {
        return others.filter(function _filterEmpty(m) {
            return !m.isEmpty;
        }).reduce(function _concatAll(curr, next) {
            return curr.concat(next);
        }, this);
    },
    toString: function _toString() {
        return `${type}(${toString.call(this)})`;
    }
};
*/

export { monoidFactory };