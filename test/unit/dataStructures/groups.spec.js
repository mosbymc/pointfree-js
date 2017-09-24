import { groupFactoryCreator, additionGroupFactory, multiplicationGroupFactory, andGroupFactory, orGroupFactory, stringMonoidFactory,
        subtractionMonoidFactory, xorMonoidFactory, functionMonoidFactory, divisionSemigroupFactory } from '../../../src/dataStructures/groups';

describe('Test groups, monoids, and semigroups', function _testGroupCommaMonoidsCommaAndSemigroups() {
    describe('Test groups', function _testGroups() {
        describe('Test additiveGroup', function _testAdditiveGroup() {

        });
    });

    describe('Test monoids', function _testMonoids() {
        describe('Test functionMonoid', function _testFunctionMonoid() {
            it('should return a function monoid object', function _testFunctionMonoidCreation() {
                var f = functionMonoidFactory(x => x * x);
                f.isEmpty.should.exist;
                f.isEmpty.should.be.a('boolean');
                f.factory.should.exist;
                f.factory.should.be.a('function');
                f.value.should.exist;
                f.value.should.be.a('function');
                f.toString.should.exist;
                f.toString.should.be.a('function');
                f.valueOf.should.exist;
                f.valueOf.should.be.a('function');
                f.concat.should.exist;
                f.concat.should.be.a('function');
                f.concatAll.should.exist;
                f.concatAll.should.be.a('function');
                f.extract.should.exist;
                f.extract.should.be.a('function');
                f[Symbol.iterator].should.exist;
            });

            it('should allow concatenation of two function monoids via function composition', function _testFunctionMonoidConcatenation() {
                var f1 = functionMonoidFactory(x => x * x),
                    f2 = functionMonoidFactory(x => Math.pow(x, x));

                var res = f1.concat(f2);
                Object.getPrototypeOf(f1).isPrototypeOf(res).should.be.true;
                res.extract()(2).should.eql(16);
            });

            it('should allow concatenation of multiple function monads at one time', function _testFunctionMonoidConcatAll() {
                var f1 = functionMonoidFactory(x => x * x),
                    f2 = functionMonoidFactory(x => Math.pow(x, x)),
                    f3 = functionMonoidFactory(x => x + 15),
                    res = f1.concatAll(f2, f3);

                Object.getPrototypeOf(f1).isPrototypeOf(res).should.be.true;
                res.extract()(2).should.eql(2);
            });

            it('should iterate the function monoid', function _testFunctionMonoidIterator() {
                var pow = x => Math.pow(x, x),
                    f = functionMonoidFactory(pow);

                for (let fn of f) fn.should.eql(pow);
            });

            it('should pick the identity value when the type of the value is not a function', function _testFunctionMonoidIdentity() {
                var f = functionMonoidFactory({});

                expect('function' === typeof f.extract()).to.be.true;
                f.isEmpty.should.be.true;
                f.extract()(1).should.eql(1);
                f.extract().should.eql(functionMonoidFactory.empty.extract());
            });

            it('should return itself when trying to concat with a different type', function _testFunctionMonoidConcatWithDifferentType() {
                var f = functionMonoidFactory(x => x),
                    res = f.concat({});

                res.should.eql(f);
                expect(res === f).to.be.true;
            });
        });
    });

    describe('Test groups', function _testGroups() {

    });

    describe('Test user-defined semigroup', function _testUserDefinedSemigroup() {
        describe('Test object delegation semigroup', function _testSemiGroupWithObjectDelegation() {
            var obj = { };

            it('should concatenate two semigroups objects that share the same prototype delegation chain', function _testObjectConcatenation() {
                function objectConcat(x, y) {
                    return Object.create(obj, {
                        name: {
                            value: x.name.concat(y.name)
                        },
                        age: {
                            value: x.age.concat(y.age)
                        }
                    });
                }
                var objectSemigroupFactory = groupFactoryCreator(objectConcat, obj, null, 'Obj');
                var o1 = objectSemigroupFactory(Object.create(obj, {
                    name: {
                        value: stringMonoidFactory('Mark')
                    },
                    age: {
                        value: additionGroupFactory(32)
                    }
                })),
                    o2 = objectSemigroupFactory(Object.create(obj, {
                        name: {
                            value: stringMonoidFactory('Mike')
                        },
                        age: {
                            value: additionGroupFactory(39)
                        },
                        address: {
                            value: '123 Easy Street'
                        }
                    }));

                console.log(o1.age);
                var res = o1.concat(o2);
                //Object.getPrototypeOf(o1).isPrototypeOf(res).should.be.true;
                //console.log(o1);
                //res.age.extract().should.eql(69);
            });
        });
    });
});