import { apply, applyTransforms, chain, monadIterator, disjunctionEqualMaker, equalMaker, lifter, maybeFactoryHelper,
    mjoin, pointMaker, stringMaker, valueOf, get, emptyGet, orElse, emptyOrElse, getOrElse, emptyGetOrElse, sharedMaybeFns,
    sharedEitherFns, applyFantasyLandSynonyms, chainRec } from '../../../src/dataStructures/data_structure_util';

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
        console.log(this.value);
        return this.of(fn(this.value));
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
    get: get,
    orElse: orElse,
    getOrElse: getOrElse,
    of: pointMaker(Identity),
    valueOf: valueOf,
    toString: stringMaker('Identity')
};
identity.equals = equalMaker(identity);

describe('Test data structure utils', function _testDataStructureUtils() {
    describe('Test apply', function _testApply() {
        it('should map an object\'s function value over a functor\'s value and return the functor', function _testApply() {
            var list = [1, 2, 3, 4, 5],
                obj = {
                    value: function _map(num) { return num * num; }
                };

            var res = apply.call(obj, list);
            res.should.be.an('array');
            res.should.eql([1, 4, 9, 16, 25]);
        });
    });

    describe('Test applyTransform', function _testApplyTransform() {
        it('');
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

    describe('Test get', function _testGet() {
        it('should return the underlying value of a monad', function _testGet() {
            Identity(1).get().should.eql(1);
        });
    });

    describe('Test empty get', function _testEmptyGet() {
        it('should throw an exception', function _testEmptyGet(done) {
            try {
                emptyGet();
            }
            catch (ex) {
                done();
            }
        });
    });

    describe('Test orElse', function _testOrElse() {
        it('should return the underlying value', function _testOrElse() {
            var i = Identity(10),
                res = i.orElse(x => x * x);

            res.should.be.a('number');
            res.should.eql(10);
        });
    });

    describe('Test emptyOrElse', function _testEmptyOrElse() {
        it('should execute the default function', function _testEmptyOrElse() {
            function _x() { return 15; }

            var res = emptyOrElse(_x);

            res.should.be.a('number');
            res.should.eql(15);
        });
    });

    describe('Test getOrElse', function _testGetOrElse() {
        it('should return the underlying value', function _testGetOrElse() {
            var i = Identity(10),
                res = i.getOrElse(1);

            res.should.be.a('number');
            res.should.eql(10);
        });
    });

    describe('Test emptyGetOrElse', function _testEmptyGetOrElse() {
        it('should return the default value', function _testEmptyGetOrElse() {
            emptyGetOrElse(10).should.eql(10);
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
});