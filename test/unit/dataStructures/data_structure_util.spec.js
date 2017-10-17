import { monad_apply, applyTransforms, chain, monadIterator, disjunctionEqualMaker, equals, lifter, maybeFactoryHelper,
    mjoin, stringMaker, valueOf, sharedMaybeFns, sharedEitherFns, applyFantasyLandSynonyms, chainRec } from '../../../src/dataStructures/data_structure_util';

function Identity(val) {
    return Object.create(identity, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

Identity.of = x => Identity(x);
Identity.lift = lifter(Identity);

var identity = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.factory.of(fn(this.value));
    },
    chain: chain,
    chainRec: chainRec,
    mjoin: mjoin,
    apply: function _apply(ma) {
        return ma.map(this.value);
    },
    fold: function _fold(fn, acc) {
        return fn(acc, this.value);
    },
    equals: equals,
    valueOf: valueOf,
    factory: Identity,
    toString: stringMaker('Identity')
};

function I(val) {
    return Object.create(i, {
        _value: {
            value: val,
            writable: false,
            configurable: false
        }
    });
}

I.of = x => I(x);
I.lift = lifter(I);

var i = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.factory.of(fn(this.value));
    },
    chain: chain,
    chainRec: chainRec,
    mjoin: mjoin,
    apply: function _apply(ma) {
        return ma.map(this.value);
    },
    fold: function _fold(fn, acc) {
        return fn(acc, this.value);
    },
    equals: equals,
    valueOf: valueOf,
    factory: I,
    toString: stringMaker('I')
};

describe('Test data structure utils', function _testDataStructureUtils() {
    describe('Test monad_apply', function _testApply() {
        it('should map an object\'s function value over a functor\'s value and return the functor', function _testApply() {
            var list = [1, 2, 3, 4, 5],
                obj = {
                    value: function _map(num) { return num * num; }
                };

            var res = monad_apply.call(obj, list);
            res.should.be.an('array');
            res.should.eql([1, 4, 9, 16, 25]);
        });
    });

    describe('Test applyTransform', function _testApplyTransform() {
        //it('');
    });

    describe('Test chain', function _testChain() {
        it('should flatten a monad by one level', function _testChainWithNestedMonads() {
            function _identityReturningFunction(num) {
                return Identity(num * num);
            }

            var i = Identity(2),
                res = i.chain(_identityReturningFunction);

            identity.should.eql(Object.getPrototypeOf(res));
            res.toString().should.eql('Identity(4)');
        });

        it('should return a flattened monad that is already nested', function _testPrenestedMonad() {
            function _i(x) { return x; }

            var i = Identity(Identity(1)),
                res = i.chain(_i);

            identity.should.eql(Object.getPrototypeOf(res));
            res.toString().should.eql('Identity(1)');
        });

        it('should not flatten a monad by more than one level', function _testChainWithMultipleLevelsOfNesting() {
            function _multiLevel(x) {
                return Identity(Identity(x * 3));
            }

            var i = Identity(1),
                res = i.chain(_multiLevel);

            res.toString().should.eql('Identity(Identity(3))');
        });

        it('should not attempt to flatten when monad is already flat', function _testChainWithFlatMonad() {
            function _flat(x) { return x * x; }

            var i = Identity(5),
                res = i.chain(_flat);

            res.should.be.an('object');
            identity.should.eql(Object.getPrototypeOf(res));
            res.value.should.eql(25);
            res.toString().should.eql('Identity(25)');
        });
    });

    describe('Test mjoin', function _testMjoin() {
        it('should flatten a data structure by one level', function _testMjoinWithNestedDataStructures() {
            function _identityReturningFunction(num) {
                return Identity(num * num);
            }

            var i = Identity(2),
                res = i.map(_identityReturningFunction).mjoin();

            identity.should.eql(Object.getPrototypeOf(res));
            res.toString().should.eql('Identity(4)');
        });

        it('should not flatten a data structure by more than one level', function _testMjoinWithMultipleLevelsOfNesting() {
            function _multiLevel(x) {
                return Identity(Identity(x * 3));
            }

            var i = Identity(1),
                res = i.map(_multiLevel).mjoin();

            res.toString().should.eql('Identity(Identity(3))');
        });

        it('should not attempt to flatten a data structure when it is already flat', function _testMjoinWithFlatIdentity() {
            function _flat(x) { return x * x; }

            var i = Identity(5),
                res = i.map(_flat).mjoin();

            res.should.be.an('object');
            identity.should.eql(Object.getPrototypeOf(res));
            res.value.should.eql(25);
            res.toString().should.eql('Identity(25)');
        });
    });

    describe('Test lift', function _testList() {
        it('should lift a non-monad returning function into a monad returning function', function _testLift() {
            var lifted = (x, y) => x + y;

            var i = Identity.lift(lifted),
                res = i(10, 15);

            res.should.be.an('object');
            identity.should.eql(Object.getPrototypeOf(res));
            res.value.should.eql(25);
        });
    });

    describe('Test chainRec', function _testChainRec() {
        it('should recursively call the provided function until the final value is reached', function _testChainRec() {
            function _recursiveChain(next, done, value) {
                if (100 > value) return next(value + value);
                return done(value);
            }

            var i = Identity(1),
                res = i.chainRec(_recursiveChain);

            identity.should.eql(Object.getPrototypeOf(res));
            res.toString().should.eql('Identity(128)');
            res.value.should.eql(128);
        });
    });

    describe('Test equals', function _testEquals() {
        it('should not return true when the same data structure type has different values', function _testEqualsWithDifferentValues() {
            Identity(1).equals(Identity(2)).should.be.false;
            Identity(true).equals(Identity(false)).should.be.false;
            Identity(1).equals(Identity(true)).should.be.false;
            Identity({}).equals(Identity({})).should.be.false;
        });

        it('should not return true when different data structure types are compared', function _testEqualsWithDifferentTypes() {
            Identity(1).equals(I(1)).should.be.false;
            I(1).equals(Identity(1)).should.be.false;
            Identity(true).equals(I(true)).should.be.false;
            I(true).equals(Identity(true)).should.be.false;
        });

        it('should return false when both types and values are different', function _testEqualsWithDifferentTypesAndValues() {
            Identity(1).equals(I(2)).should.be.false;
            I(false).equals(Identity(true)).should.be.false;
        });

        it('should return true when types and values are the same', function _testEqualsWithSameTypesAndValues() {
            Identity(1).equals(Identity(1)).should.be.true;
            I(true).equals(I(true)).should.be.true;
        });

        it('should work with nested data structures', function _testEqualsWithNestedTypes() {
            Identity(Identity(1)).equals(Identity(1)).should.be.true;
            I(true).equals(I(I(false))).should.be.false;
        });
    });
});