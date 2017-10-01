import { groupFactoryCreator, additionGroupFactory, multiplicationGroupFactory, andGroupFactory, orGroupFactory, stringMonoidFactory,
        subtractionMonoidFactory, xorMonoidFactory, functionMonoidFactory, divisionSemigroupFactory } from '../../../src/dataStructures/groups';

describe('Test groups, monoids, and semigroups', function _testGroupCommaMonoidsCommaAndSemigroups() {
    describe('Test groups', function _testGroups() {
        describe('Test additiveGroup', function _testAdditiveGroup() {
            it('should perform addition using valueOf', function _testValueOf() {
                var a1 = additionGroupFactory(5),
                    a2 = additionGroupFactory(7),
                    res = a1 + a2;

                res.should.eql(12);
            });

            it('should return a string representation of the group', function _testToString() {
                additionGroupFactory(10).toString().should.eql('Add(10)');
            });

            it('should perform an inverse concatenation', function _testInverseConcat() {
                var a1 = additionGroupFactory(5),
                    a2 = additionGroupFactory(7),
                    res = a1.inverseConcat(a2);

                res.extract().should.eql(-2);
            });

            it('should return itself if inverseConcat is invoked with a different type', function _testInverseConcatWithDifferentType() {
                var a = additionGroupFactory(5),
                    res = a.inverseConcat(10);

                res.should.eql(a);
            });
        });

        describe('Test multiplicativeGroup', function _testMultiplicativeGroup() {
            it('should multiply two values during concatenation', function _testConcat() {
                var m1 = multiplicationGroupFactory(10),
                    m2 = multiplicationGroupFactory(3),
                    res = m1.concat(m2);

                res.extract().should.eql(30);
            });
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

    describe('Test user-defined groups', function _testUserDefinedGroup() {
        describe('Test object delegation monoid', function _testMonoidWithObjectDelegation() {
            var obj = { };

            it('should concatenate two monoids objects that share the same prototype delegation chain', function _testObjectConcatenation() {
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

                var res = o1.concat(o2);
                Object.getPrototypeOf(o1).isPrototypeOf(res).should.be.true;
                res.extract().age.extract().should.eql(71);
                res.extract().name.extract().should.eql('MarkMike');
            });
        });

        describe('Test object key delegation monoid', function _testMonoidWithObjectKeys() {
            var obj = {
                age: 0,
                name: ''
            };

            it('should concatenate two monoids objects that share the same keys', function _testObjectConcatenation() {
                function objectConcat(x, y) {
                    return {
                        name: x.name.concat(y.name),
                        age: x.age.concat(y.age)
                    };
                }
                var objectSemigroupFactory = groupFactoryCreator(objectConcat, obj, null, 'Obj');
                var o1 = objectSemigroupFactory({
                        name: stringMonoidFactory('Mark'),
                        age: additionGroupFactory(32)
                    }),
                    o2 = objectSemigroupFactory({
                        name: stringMonoidFactory('Mike'),
                        age: additionGroupFactory(39),
                        address: '123 Easy Street'
                    });

                var res = o1.concat(o2);
                Object.getPrototypeOf(o1).isPrototypeOf(res).should.be.true;
                res.extract().age.extract().should.eql(71);
                res.extract().name.extract().should.eql('MarkMike');
            });

            it('should return an identity monoid if the object does not share the same shape', function _testIdentityReturn() {
                function objectConcat(x, y) {
                    return {
                        name: x.name.concat(y.name),
                        age: x.age.concat(y.age)
                    };
                }
                var objectMonoidFactory = groupFactoryCreator(objectConcat, obj, null, 'Obj'),
                    res = objectMonoidFactory({});

                res.isEmpty.should.be.true;
                res.extract().should.eql(obj);
            });
        });
    });
});