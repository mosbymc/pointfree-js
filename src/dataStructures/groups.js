import { compose } from '../combinators';

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
    extract: function _extract() {
        return this.value;
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
    //console.log(createBitMask('function' === typeof concatFn, null != identity, 'function' === typeof inverseFn));

    switch (createBitMask('function' === typeof concatFn, null != identity, 'function' === typeof inverseFn)) {
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

function semigroupFactory(concatFn, type) {
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
            },
            /**
             * @signature toString :: () -> String
             * @description Returns a string representation of the current monoid and its
             * underlying value. If the 'type' param was set upon creation of this specific
             * monoid factory, the type name will be included in the returned string. Otherwise,
             * simply 'Monoid' will be used.
             * @return {string} Returns a string
             */
            toString: {
                value: function _toString() {
                    return `${type}(${this.value})`;
                }
            }
        });
    }

    return semigroupFactory;
}

function monoidFactory(concatFn, identity, type) {
    var sgFactory = semigroupFactory(concatFn, type);
    function monoidFactory(val) {
        return Object.create(sgFactory(typeValidator(val)), {
            isEmpty: {
                value: val === identity
            },
            factory: {
                value: monoidFactory
            }
        });

        function typeValidator(val) {
            return 'object' !== typeof identity ?
                typeof val === typeof identity ? val : identity :
                Object.getPrototypeOf(identity).isPrototypeOf(val) ||
                Object.keys(identity).every(key => key in val) && Object.keys(val).every(key => key in val) ? val : identity;
        }
    }

    monoidFactory.empty = monoidFactory(identity);
    return monoidFactory;
}

function groupFactory(concatFn, identity, inverseFn, type) {
    var mFactory = monoidFactory(concatFn, identity, type);
    function groupFactory(val) {
        return Object.create(mFactory(val), {
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

var additionGroupFactory = groupFactoryCreator((x, y) => x + y, 0, x => -x, 'Add'),
    multiplicationGroupFactory = groupFactoryCreator((x, y) => x * y, 1, x => 1/x, 'Multiplication'),
    andGroupFactory = groupFactoryCreator((x, y) => x && y, true, x => !x, 'AND'),
    orGroupFactory = groupFactoryCreator((x, y) => x || y, false, x => !x, 'OR');

var stringMonoidFactory = groupFactoryCreator((x, y) => x.concat(y), '', null, 'String'),
    subtractionMonoidFactory = groupFactoryCreator((x, y) => x - y, 0, null, 'Subtraction'),
    xorMonoidFactory = groupFactoryCreator((x, y) => x !==y, false, null, 'XOR'),
    functionMonoidFactory = groupFactoryCreator((x, y) => compose(x, y), x => x, null, 'Function');

var divisionSemigroupFactory = groupFactoryCreator((x, y) => x / y, null, null, 'Division');

export { additionGroupFactory, multiplicationGroupFactory, andGroupFactory, orGroupFactory,
        stringMonoidFactory, subtractionMonoidFactory, xorMonoidFactory, functionMonoidFactory, divisionSemigroupFactory };