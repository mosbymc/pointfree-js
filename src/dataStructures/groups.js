//TODO: Abelian Groups:
//TODO: - addition
//TODO: - multiplication
//TODO: - AND
//TODO: - OR
//TODO:
//TODO:
//TODO: Groups:
//TODO:
//TODO:
//TODO: Monoids:
//TODO: - string
//TODO: - subtraction
//TODO: - XOR
//TODO:
//TODO:
//TODO: Semigroups:
//TODO: - division

var baseGroupObject = {
    /**
     * @description d
     * @return {*} Returns whatever the underlying value of the current monoid is.
     */
    get value() {
        return this._value;
    },
    /**
     * @signature valueOf :: () -> *
     * @description Returns the underlying value of the current monoid. Used natively in
     * javascript during operations such as addition.
     * @return {*} Returns the underlying value of the monoid.
     */
    valueOf: function _valueOf() {
        return this.value;
    },
    /**
     * @signature toString :: () -> String
     * @description Returns a string representation of the current monoid and its
     * underlying value. If the 'type' param was set upon creation of this specific
     * monoid factory, the type name will be included in the returned string. Otherwise,
     * simply 'Monoid' will be used.
     * @return {string} Returns a string
     */
    toString: function _toString() {
        return `${type}(${this.value})`;
    },
    /**
     * @description Allows the monoid to be iterated, regardless of what the underlying value is.
     * @return {Object} Returns an object with the value of the monoid as well as a 'done'
     * property that indicates if iteration is complete.
     */
    [Symbol.iterator]: function _iterator() {
        let first = true,
            val = this.value;
        return {
            next: function _next() {
                if (first) {
                    first = false;
                    return { done: false, value: val };
                }
                return { done: true };
            }
        };
    }
};

/**
 * @signature
 * @description d
 * @param {function} concatFn - A
 * @param {*} [identity] - B
 * @param {function} [inverseFn] - C
 * @param {String} [type] - D
 * @return {function} - E
 */
function groupFactoryCreator(concatFn, identity, inverseFn, type) {
    switch (createBitMask(!!concatFn, identity, !!inverseFn)) {
        case 1:
            return semigroupFactory(concatFn, type);
        case 3: return monoidFactory(concatFn, identity, type);
        case 7: return groupFactory(concatFn, identity, inverseFn, type);
    }

    /**
     * @signature [...a] -> Number
     * @description creates a bit mask value based on truthy/falsey arguments passed to the function
     * @param {boolean} args - Zero or more arguments. All arguments are treated as booleans, so truthy,
     * and falsey values will work.
     * @return {number} Returns an integer that represents the bit mask value of the boolean arguments.
     */
    function createBitMask(...args) {
        return args.reduce(function _reduce(curr, next, idx) {
            return curr |= next << idx;
        }, args[0]);
    }
}

function semigroupFactory(concatFn) {
    function semigroupFactory(val) {
        return Object.create(baseGroupObject, {
            _value: {
                value: val,
                writable: false,
                configurable: false
            },
            concat: {
                value: function _concat(g) {
                    return Object.getPrototypeOf(this) === Object.getPrototypeOf(g) ? this.factory(concatFn(this, g)) : this;
                }
            },
            concatAll: {
                value: function _concatAll(...g) {
                    return this.factory(g.reduce(function _reduce(curr, next) {
                        return curr.concat(next);
                    }, this));
                }
            },
            factory: {
                value: semigroupFactory
            }
        });
    }

    return semigroupFactory;
}

function monoidFactory(concatFn, identity) {
    function monoidFactory(val) {
        return Object.create(semigroupFactory(val), {
            isEmpty: {
                value: this.value === identity
            },
            factory: {
                value: monoidFactory
            }
        });
    }

    monoidFactory.empty = monoidFactory(identity);
    return monoidFactory;
}

function groupFactory(concatFn, identity, inverseFn) {
    function groupFactory(val) {
        return Object.create(monoidFactory(val), {
            inverseConcat: {
                value: inverseFn
            },
            factory: {
                value: groupFactory
            }
        });
    }

    groupFactory.empty = groupFactory(identity);
    return groupFactory;
}

function concatFuncWrapper(g) {
    return Object.getPrototypeOf(this) === Object.getPrototypeOf(g) ? this.factory(this.concat(this, g)) : this;
}

var additionGroupFactory = groupFactoryCreator((x, y) => x + y, 0, x => -x, 'Add'),
    multiplicationGroupFactory = groupFactoryCreator((x, y) => x * y, 1, x => 1/x, 'Multiplication'),
    andGroupFactory = groupFactoryCreator((x, y) => x && y, true, x => !x, 'AND'),
    orGroupFactory = groupFactoryCreator((x, y) => x || y, false, x => !x, 'OR');

var stringMonoidFactory = groupFactoryCreator((x, y) => x.concat(y), '', null, 'String'),
    subtractionMonoidFactory = groupFactoryCreator((x, y) => x - y, 0, null, 'Subtraction'),
    xorMonoidFactory = groupFactoryCreator((x, y) => x !==y, false, null, 'XOR');

var divisionSemigroupFactory = groupFactoryCreator((x, y) => x / y, null, null, 'Division');

/**
 * @signature () -> * -> String -> ()
 * @description d
 * @param {function} concatFn - A function that know how to concat two values of this monoid's type
 * @param {*} identity - Any value that can/should be used as the identity element for this monoid's type
 * @param {String} [type] - An optional string value that is used during the toString operation to represent
 * this monoid.
 * @return {monoidFactory} Returns a factory function that creates monoids of the specified type.
 */
function monoidTypeFactory(concatFn, identity, type = 'Monoid') {
    /**
     * @signature * -> monoid<*>
     * @description Accepts a value within the domain of the monoid and returns a monoid with
     * the same value.
     * @param {*} val - Any javascript value that exists within the domain of this monoid
     * @return {monoid} Returns a new monoid
     */
    function monoidFactory(val) {
        return Object.create(monoid, {
            _value: {
                value: val,
                writable: false,
                configurable: false
            }
        });
    }

    /**
     * @description d
     * @typedef {Object}
     * @property {*} value
     * @property {function} concat
     * @property {function} concatAll
     * @property {boolean} isEmpty
     * @property {boolean} isIdentity
     * @property {function} valueOf
     * @property {function} toString
     * @property {Symbol.iterator}
     * @kind {Object}
     */
    var monoid = {
        /**
         * @description d
         * @return {*} Returns whatever the underlying value of the current monoid is.
         */
        get value() {
            return this._value;
        },
        /**
         * @signature
         * @description Accepts a single monoid of the same domain and concatenates it with
         * the current monoid, returning a new monoid in the process.
         * @param {monoid} m - A monoid
         * @return {monoid} Returns a monoid that is the concatenation of the previous two.
         */
        concat: function _concat(m) {
            return monoidFactory(concatFn(this.value, m.value));
        },
        /**
         * @signature
         * @description Accepts one or more monoid and performs a concatenation operation
         * on all of them before returning the result.
         * @param {monoid} m - One or more monoids that should be concatenated with the
         * current monoid.
         * @return {monoid} Returns a new monoid that is the concatenation of all the monoids.
         */
        concatAll: function _concatAll(...m) {
            return monoidFactory(m.reduce(function _reduce(curr, next) {
                return curr.concat(next);
            }, this));
        },
        /**
         * @description Returns a boolean indicating if the current monoid is empty within
         * its domain.
         * @return {boolean} Returns a boolean indicating emptiness.
         */
        get isEmpty() {
            return this.value === identity;
        },
        /**
         * @description Returns a boolean indicating if the current monoid is an identity within
         * its domain.
         * @alias isEmpty
         * @return {boolean} Returns a boolean indicating identity.
         */
        get isIdentity() {
            return this.value === identity;
        },
        /**
         * @signature valueOf :: () -> *
         * @description Returns the underlying value of the current monoid. Used natively in
         * javascript during operations such as addition.
         * @return {*} Returns the underlying value of the monoid.
         */
        valueOf: function _valueOf() {
            return this.value;
        },
        /**
         * @signature toString :: () -> String
         * @description Returns a string representation of the current monoid and its
         * underlying value. If the 'type' param was set upon creation of this specific
         * monoid factory, the type name will be included in the returned string. Otherwise,
         * simply 'Monoid' will be used.
         * @return {string} Returns a string
         */
        toString: function _toString() {
            return `${type}(${this.value})`;
        },
        /**
         * @description Allows the monoid to be iterated, regardless of what the underlying value is.
         * @return {Object} Returns an object with the value of the monoid as well as a 'done'
         * property that indicates if iteration is complete.
         */
        [Symbol.iterator]: function _iterator() {
            let first = true,
                val = this.value;
            return {
                next: function _next() {
                    if (first) {
                        first = false;
                        return { done: false, value: val };
                    }
                    return { done: true };
                }
            };
        }
    };

    monoidFactory.empty = Object.create(monoid, {
        _value: {
            value: identity,
            writable: false,
            configurable: false
        }
    });

    monoidFactory.identity = monoidFactory.empty;
    monoidFactory.unit = monoidFactory.empty;

    return monoidFactory;
}

export { monoidTypeFactory, additionGroupFactory, multiplicationGroupFactory, andGroupFactory, orGroupFactory,
        stringMonoidFactory, subtractionMonoidFactory, xorMonoidFactory, divisionSemigroupFactory };