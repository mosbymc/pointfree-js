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

            it('should perform an inverse concatenation', function _testInverseConcat() {
                var m1 = multiplicationGroupFactory(10),
                    m2 = multiplicationGroupFactory(2),
                    res = m1.inverseConcat(m2);

                res.extract().should.eql(5);
            });
        });

        describe('Test and group', function _testAndGroup() {
            it('should \'AND\' two groups and return the result', function _testAndGroupConcat() {
                let a1 = andGroupFactory(false),
                    a2 = andGroupFactory(true),
                    res1 = a1.concat(a1),
                    res2 = a1.concat(a2),
                    res3 = a2.concat(a1),
                    res4 = a2.concat(a2);

                res1.extract().should.be.false;
                res2.extract().should.be.false;
                res3.extract().should.be.false;
                res4.extract().should.be.true;
            });

            it('should perform an inverse concatenation', function _testInverseConcat() {
                let a1 = andGroupFactory(false),
                    a2 = andGroupFactory(true);

                a1.inverseConcat(a1).extract().should.be.false;
                a1.inverseConcat(a2).extract().should.be.false;
                a2.inverseConcat(a2).extract().should.be.false;
                a2.inverseConcat(a1).extract().should.be.true;
            });
        });

        describe('Test or group', function _testOrGroup() {
            it('should \'OR\' two groups and return the result', function _testOrGroupConcat() {
                let o1 = orGroupFactory(false),
                    o2 = orGroupFactory(true);

                o1.concat(o1).extract().should.be.false;
                o1.concat(o2).extract().should.be.true;
                o2.concat(o1).extract().should.be.true;
                o2.concat(o2).extract().should.be.true;
            });

            it('should perform an inverse concatenation', function _testInverseConcat() {
                let o1 = orGroupFactory(false),
                    o2 = orGroupFactory(true);

                o1.inverseConcat(o1).extract().should.be.true;
                o1.inverseConcat(o2).extract().should.be.false;
                o2.inverseConcat(o1).extract().should.be.true;
                o2.inverseConcat(o2).extract().should.be.true;
            });
        });
    });

    describe('Test monoids', function _testMonoids() {
        describe('Test function monoid', function _testFunctionMonoid() {
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

            it('should allow concatenation of multiple function monoids at one time', function _testFunctionMonoidConcatAll() {
                var f1 = functionMonoidFactory(x => x * x),
                    f2 = functionMonoidFactory(x => Math.pow(x, x)),
                    f3 = functionMonoidFactory(x => x + 15),
                    res = f1.concatAll(f2, f3);

                Object.getPrototypeOf(f1).isPrototypeOf(res).should.be.true;
                res.extract()(2).should.eql(6.843264508857752e+41);
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

        describe('Test subtraction monoid', function _testSubtractionMonoid() {
            it('should return a subtraction monoid object', function _testSubtractionMonoidCreation() {
                var s = subtractionMonoidFactory(5);
                s.isEmpty.should.exist;
                s.isEmpty.should.be.a('boolean');
                s.factory.should.exist;
                s.factory.should.be.a('function');
                s.value.should.exist;
                s.value.should.eql(5);
                s.toString.should.exist;
                s.toString.should.be.a('function');
                s.valueOf.should.exist;
                s.valueOf.should.be.a('function');
                s.concat.should.exist;
                s.concat.should.be.a('function');
                s.concatAll.should.exist;
                s.concatAll.should.be.a('function');
                s.extract.should.exist;
                s.extract.should.be.a('function');
                s[Symbol.iterator].should.exist;
            });

            it('should allow concatenation of two subtraction monoids', function _testSubtractionMonoidConcatenation() {
                var s1 = subtractionMonoidFactory(5),
                    s2 = subtractionMonoidFactory(6);

                var res = s1.concat(s2);
                Object.getPrototypeOf(s1).isPrototypeOf(res).should.be.true;
                res.extract().should.eql(-1);

                s2.concat(s1).extract().should.eql(1);
            });

            it('should allow concatenation of multiple subtraction monoids at one time', function _testSubtractionMonoidConcatAll() {
                var s1 = subtractionMonoidFactory(10),
                    s2 = subtractionMonoidFactory(2),
                    s3 = subtractionMonoidFactory(3),
                    res = s1.concatAll(s2, s3);

                Object.getPrototypeOf(s1).isPrototypeOf(res).should.be.true;
                res.extract().should.eql(5);
            });

            it('should iterate the subtraction monoid', function _testSubtractionMonoidIterator() {
                var s = subtractionMonoidFactory(5);

                for (let fn of s) fn.should.eql(5);
            });

            it('should pick the identity value when the type of the value is not a number', function _testSubtractionMonoidIdentity() {
                var s = subtractionMonoidFactory({});

                expect('number' === typeof s.extract()).to.be.true;
                s.isEmpty.should.be.true;
                s.extract().should.eql(0);
                s.extract().should.eql(subtractionMonoidFactory.empty.extract());
            });

            it('should return itself when trying to concat with a different type', function _testSubtractionMonoidConcatWithDifferentType() {
                var s = subtractionMonoidFactory(5),
                    res = s.concat({});

                res.should.eql(s);
                expect(res === s).to.be.true;
            });
        });

        describe('Test xor monoid', function _testXorMonoid() {
            it('should return a xor monoid object', function _testXorMonoidCreation() {
                var x = xorMonoidFactory(false);
                x.isEmpty.should.exist;
                x.isEmpty.should.be.a('boolean');
                x.factory.should.exist;
                x.factory.should.be.a('function');
                x.value.should.exist;
                x.value.should.be.false;
                x.toString.should.exist;
                x.toString.should.be.a('function');
                x.valueOf.should.exist;
                x.valueOf.should.be.a('function');
                x.concat.should.exist;
                x.concat.should.be.a('function');
                x.concatAll.should.exist;
                x.concatAll.should.be.a('function');
                x.extract.should.exist;
                x.extract.should.be.a('function');
                x[Symbol.iterator].should.exist;
            });

            it('should allow concatenation of two xor monoids', function _testXorMonoidConcatenation() {
                var x1 = xorMonoidFactory(false),
                    x2 = xorMonoidFactory(true);

                var res = x1.concat(x2);
                Object.getPrototypeOf(x1).isPrototypeOf(res).should.be.true;
                res.extract().should.be.true

                x2.concat(x1).extract().should.be.true;
                x1.concat(x1).extract().should.be.false;
                x2.concat(x2).extract().should.be.false;
            });

            it('should allow concatenation of multiple xor monoids at one time', function _testXorMonoidConcatAll() {
                var x1 = xorMonoidFactory(false),
                    x2 = xorMonoidFactory(true),
                    x3 = xorMonoidFactory(true),
                    res = x1.concatAll(x2, x3);

                Object.getPrototypeOf(x1).isPrototypeOf(res).should.be.true;
                res.extract().should.be.false;
            });

            it('should iterate the xor monoid', function _testXorMonoidIterator() {
                for (let x of xorMonoidFactory(false)) x.should.be.false;
            });

            it('should pick the identity value when the type of the value is not a number', function _testXorMonoidIdentity() {
                var x = xorMonoidFactory({});

                expect('boolean' === typeof x.extract()).to.be.true;
                x.isEmpty.should.be.true;
                x.extract().should.be.false;
                x.extract().should.eql(xorMonoidFactory.empty.extract());
            });

            it('should return itself when trying to concat with a different type', function _testXorMonoidConcatWithDifferentType() {
                var x = xorMonoidFactory(true),
                    res = x.concat({});

                res.should.eql(x);
                expect(res === x).to.be.true;
            });
        });
    });

    describe('Test semigroups', function _testSemigroups() {
        describe('Test division semigroup', function _testDivisionSemigroup() {
            it('should return a division semigroup object', function _testDivisionSemigroupCreation() {
                let d = divisionSemigroupFactory(5);;
                d.factory.should.exist;
                d.factory.should.be.a('function');
                d.value.should.exist;
                d.value.should.eql(5);
                d.toString.should.exist;
                d.toString.should.be.a('function');
                d.valueOf.should.exist;
                d.valueOf.should.be.a('function');
                d.concat.should.exist;
                d.concat.should.be.a('function');
                d.concatAll.should.exist;
                d.concatAll.should.be.a('function');
                d.extract.should.exist;
                d.extract.should.be.a('function');
                d[Symbol.iterator].should.exist;
            });

            it('should allow concatenation of two division semigroups', function _testDivisionSemigroupConcatenation() {
                var d1 = divisionSemigroupFactory(10),
                    d2 = divisionSemigroupFactory(2);

                var res = d1.concat(d2);
                Object.getPrototypeOf(d1).isPrototypeOf(res).should.be.true;
                res.extract().should.eql(5);

                d2.concat(d1).extract().should.eql(0.2);
            });

            it('should allow concatenation of multiple division semigroups at one time', function _testDivisionSemigroupConcatAll() {
                var d1 = divisionSemigroupFactory(10),
                    d2 = divisionSemigroupFactory(2),
                    d3 = divisionSemigroupFactory(3),
                    res = d1.concatAll(d2, d3);

                Object.getPrototypeOf(d1).isPrototypeOf(res).should.be.true;
                res.extract().should.eql(1.66666666666666667);
            });

            it('should iterate the division semigroup', function _testDivisionSemigroupIterator() {
                for (let d of divisionSemigroupFactory(5)) d.should.eql(5);
            });

            it('should return itself when trying to concat with a different type', function _testDivisionSemigroupConcatWithDifferentType() {
                let d = divisionSemigroupFactory(5),
                    res = d.concat({});

                res.should.eql(d);
                expect(res === d).to.be.true;
            });
        });
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
            var obj = { age: 0, name: '' };

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