import { functors } from '../../../../src/containers/functors/functors';
import { list_functor, ordered_list_functor } from '../../../../src/containers/functors/list_functor';
import { testData } from '../../../testData';

var List = functors.List;

describe('List functor test', function _testListFunctor() {
    describe('List object factory tests', function _testListObjectFactory() {
        it('should return a new List functor regardless of data type', function _testListFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                l1 = List(),
                l2 = List(null),
                l3 = List(1),
                l4 = List(arr),
                l5 = List(obj),
                l6 = List(Symbol()),
                l7 = List('testing constant'),
                l8 = List(false);

            list_functor.isPrototypeOf(l1).should.be.true;
            list_functor.isPrototypeOf(l2).should.be.true;
            list_functor.isPrototypeOf(l3).should.be.true;
            list_functor.isPrototypeOf(l4).should.be.true;
            list_functor.isPrototypeOf(l5).should.be.true;
            list_functor.isPrototypeOf(l6).should.be.true;
            list_functor.isPrototypeOf(l7).should.be.true;
            list_functor.isPrototypeOf(l8).should.be.true;

            expect([undefined]).to.eql(l1.value);
            expect([null]).to.eql(l2.value);
            expect([1]).to.eql(l3.value);
            expect(arr).to.eql(l4.value);
            expect([obj]).to.eql(l5.value);
            expect('object').to.eql(typeof l6.value);
            expect('testing constant').to.eql(l7.value);
            expect([false]).to.eql(l8.value);
        });

        it('should return the same type/value when using the #of function', function _testListDotOf() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                i1 = List.of(),
                i2 = List.of(null),
                i3 = List.of(1),
                i4 = List.of(arr),
                i5 = List.of(obj),
                i6 = List.of(Symbol()),
                i7 = List.of('testing constant'),
                i8 = List.of(false);

            list_functor.isPrototypeOf(i1).should.be.true;
            list_functor.isPrototypeOf(i2).should.be.true;
            list_functor.isPrototypeOf(i3).should.be.true;
            list_functor.isPrototypeOf(i4).should.be.true;
            list_functor.isPrototypeOf(i5).should.be.true;
            list_functor.isPrototypeOf(i6).should.be.true;
            list_functor.isPrototypeOf(i7).should.be.true;
            list_functor.isPrototypeOf(i8).should.be.true;

            expect([undefined]).to.eql(i1.value);
            expect([null]).to.eql(i2.value);
            expect([1]).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect([obj]).to.eql(i5.value);
            expect('object').to.eql(typeof i6.value);
            expect('testing constant').to.eql(i7.value);
            expect([false]).to.eql(i8.value);
        });
    });

    describe('List functor object shared fields tests', function _testListFunctorSharedFields() {
        it('should not allow the ._value property to be updated', function _testWritePrevention() {
            var l = List(1),
                err1 = false,
                err2 = false;
            l.should.have.ownPropertyDescriptor('_value', { value: [1], writable: false, configurable: false, enumerable: false });

            try {
                l._value = 2;
            }
            catch(e) {
                err1 = true;
            }
            err1.should.be.true;

            try {
                l.value = 2;
            }
            catch(e) {
                err2 = true;
            }

            err2.should.be.true;
        });

        it('should return a new List functor instance with the mapped value', function _testListFunctorMap() {
            var l = List(1),
                d = l.map(function _t() { return 2; });

            l.value.should.not.eql(d.data);
            l.should.not.equal(d);
        });

        it('should return a new List functor instance with the same underlying value when flat mapping', function _testListFunctorFlatMap() {
            var l = List(1),
                d = l.flatMap(function _t() { return 2; });

            l.value.should.not.eql(d.data);
            l.should.not.equal(d);
        });

        it('should return a new List functor regardless of data type', function _testListFactoryObjectCreation() {
            var arr = [1, 2, 3],
                obj = { a: 1, b: 2 },
                l = List();

            var l1 = l.of(),
                l2 = l.of(null),
                l3 = l.of(1),
                l4 = l.of(arr),
                l5 = l.of(obj),
                l6 = l.of(Symbol()),
                l7 = l.of('testing constant'),
                l8 = l.of(false);

            expect(undefined).to.eql(l1.value);
            expect(null).to.eql(l2.value);
            expect(1).to.eql(l3.value);
            expect(arr).to.eql(l4.value);
            expect(obj).to.eql(l5.value);
            expect('symbol').to.eql(typeof l6.value);
            expect('testing constant').to.eql(l7.value);
            expect(false).to.eql(l8.value);
        });

        it('should transform an List functor to the other functor types', function _testListFunctorTransforms() {
            var l = List(1);
            var c = l.mapToConstant(),
                e = l.mapToEither(),
                f = l.mapToFuture(),
                io = l.mapToIo(),
                i = l.mapToIdentity(),
                left = l.mapToLeft(),
                m = l.mapToMaybe(),
                r = l.mapToRight();

            c.should.be.an('object');
            Object.getPrototypeOf(c).should.eql(Object.getPrototypeOf(functors.Constant()));

            e.should.be.an('object');
            Object.getPrototypeOf(e).should.eql(Object.getPrototypeOf(functors.Either()));

            f.should.be.an('object');
            Object.getPrototypeOf(f).should.eql(Object.getPrototypeOf(functors.Future()));

            io.should.be.an('object');
            Object.getPrototypeOf(io).should.eql(Object.getPrototypeOf(functors.Io()));

            i.should.be.an('object');
            Object.getPrototypeOf(i).should.eql(Object.getPrototypeOf(functors.Identity()));

            left.should.be.an('object');
            Object.getPrototypeOf(left).should.eql(Object.getPrototypeOf(functors.Left()));

            m.should.be.an('object');
            Object.getPrototypeOf(m).should.eql(Object.getPrototypeOf(functors.Maybe()));

            r.should.be.an('object');
            Object.getPrototypeOf(r).should.eql(Object.getPrototypeOf(functors.Right()));
        });

        it('should allow "expected" functionality of concatenation for strings and mathematical operators for numbers', function _testListFunctorValueOf() {
            ('Hello my name is: ' + List('Mark')).should.eql('Hello my name is: Mark');
        });

        it('should print the correct container type + value when .toString() is invoked', function _testListFunctorToString() {
            var c1 = List(1),
                c2 = List(null),
                c3 = List([1, 2, 3]),
                c4 = List(List(List(5)));

            c1.toString().should.eql('List(1)');
            c2.toString().should.eql('List()');
            c3.toString().should.eql('List(1,2,3)');
            c4.toString().should.eql('List(List(List(5)))');
        });

        it('should have a .constructor property that points to the factory function', function _testListFunctorIsStupidViaFantasyLandSpecCompliance() {
            List(null).constructor.should.eql(List);
        });
    });

    describe('List functor object unique fields tests', function _testListFunctorUniqueFields() {
        describe('Deferred execution list_functor functions', function _testDeferredExecutionListFunctions() {
            it('should return two lists concatenated with the non-this list_functor at the front', function _testAddFront() {
                var list = List.from([1, 2, 3, 4, 5]),
                    arr = [6, 7, 8, 9, 10];

                var addFrontIterator = list.addFront(arr),
                    res = addFrontIterator.data;

                res.should.be.an('array');
                res.should.have.lengthOf(10);
                res.should.eql([6, 7, 8, 9, 10, 1, 2, 3, 4, 5]);
            });

            it('should return a single list_functor after concatenating the current list_functor with a new list_functor', function _testConcat() {
                var list = List.from([1, 2, 3, 4, 5]),
                    arr = [6, 7, 8, 9, 10],
                    concatIterator = list.concat(arr),
                    res = concatIterator.data;

                    res.should.be.an('array');
                    res.should.have.lengthOf(10);
                    res.should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            });

            it('should return a single list_functor after concatenating multiple lists', function _testConcatWithMutlipleLists() {
                var list = List.from([1, 2, 3, 4, 5]),
                    arr1 = [6, 7, 8, 9, 10],
                    arr2 = [11, 12, 13, 14, 15],
                    arr3 = [16, 17, 18, 19, 20],
                    concatIterator = list.concat(arr1, arr2, arr3),
                    res = concatIterator.data;

                res.should.be.an('array');
                res.should.have.lengthOf(20);
                res.should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
            });

            it('should return the list_functor except where the two intersect (numbers)', function _testExceptWithNumbers() {
                var list = List.from([1, 2, 3, 4, 5]),
                    arr = [2, 4, 6, 8, 10],
                    exceptList = list.except(arr),
                    res = exceptList.data;

                res.should.be.an('array');
                res.should.have.lengthOf(3);
                res.should.eql([1, 3, 5]);
            });

            it('should return the list_functor except where the two intersect (strings)', function _testExceptWithStrings() {
                var list = List.from(['1', '2', '3', '4', '5']),
                    arr = ['2', '4', '6', '8', '10'],
                    exceptList = list.except(arr),
                    res = exceptList.data;

                res.should.be.an('array');
                res.should.have.lengthOf(3);
                res.should.eql(['1', '3', '5']);
            });

            it('should return the list_functor except where the two intersect (objects)', function _testExceptWithObjects() {
                function comparer(a, b) {
                    return a.FirstName === b.FirstName;
                }

                var list = List.from(testData.dataSource.data),
                    arr = [
                        {
                            FirstName: 'Phillip J.',
                            LastName: 'Fry',
                            Phone: '999-999-9999',
                            Email: 'mmm@mmm.net',
                            Address: '999 Peachtree St.',
                            City: 'New New York',
                            State: 'NY',
                            Zip: '80808',
                            drillDownData: []
                        },
                        {
                            FirstName: 'Hedonism',
                            LastName: 'Bot',
                            Phone: '888-999-9999',
                            Email: 'lll@lll.net',
                            Address: '777 Peachtree Rd.',
                            City: 'Newark',
                            State: 'NJ',
                            Zip: '30156',
                            drillDownData: []
                        }
                    ],
                    exceptList = list.except(arr, comparer),
                    res = exceptList.data;

                var resStandard = testData.dataSource.data.filter(function _filterVals(item) {
                    return item.FirstName !== 'Phillip J.' && item.FirstName !== 'Hedonism';
                });

                res.should.be.an('array');
                res.should.have.lengthOf(resStandard.length);
                res.should.eql(resStandard);
            });

            it('should return the list_functor only where the two intersect (numbers)', function _testIntersectWithNumbers() {
                var list = List.from([1, 2, 3, 4, 5]),
                    arr = [2, 4, 6, 8, 10],
                    intersectList = list.intersect(arr),
                    res = intersectList.data;

                res.should.be.an('array');
                res.should.have.lengthOf(2);
                res.should.eql([2, 4]);
            });

            it('should return the list_functor only where the two intersect (strings)', function _testIntersectWithStrings() {
                var list = List.from(['1', '2', '3', '4', '5']),
                    arr = ['2', '4', '6', '8', '10'],
                    intersectList = list.intersect(arr),
                    res = intersectList.data;

                res.should.be.an('array');
                res.should.have.lengthOf(2);
                res.should.eql(['2', '4']);
            });

            it('should return the list_functor only where the two intersect (objects)', function _testIntersectWithObjects() {
                function comparer(a, b) {
                    return a.FirstName === b.FirstName;
                }

                var list = List.from(testData.dataSource.data),
                    arr = [
                        {
                            FirstName: 'Phillip J.',
                            LastName: 'Fry',
                            Phone: '999-999-9999',
                            Email: 'mmm@mmm.net',
                            Address: '999 Peachtree St.',
                            City: 'New New York',
                            State: 'NY',
                            Zip: '80808',
                            drillDownData: []
                        },
                        {
                            FirstName: 'Hedonism',
                            LastName: 'Bot',
                            Phone: '888-999-9999',
                            Email: 'lll@lll.net',
                            Address: '777 Peachtree Rd.',
                            City: 'Newark',
                            State: 'NJ',
                            Zip: '30156',
                            drillDownData: []
                        }
                    ],
                    intersectList = list.intersect(arr, comparer),
                    res = intersectList.data;

                var resStandard = testData.dataSource.data.filter(function _filterVals(item) {
                    return item.FirstName === 'Phillip J.' || item.FirstName === 'Hedonism';
                });

                res.should.be.an('array');
                res.should.have.lengthOf(resStandard.length);
                res.should.eql(resStandard);
            });
        });

        describe('Immediately Evaluated list_functor functions', function _testImmediatelyEvaluatedListFunctions() {
            it('should return true when the list_functor contains the specified item and false other wise', function _testContains() {
                var list = List.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
                    res1 = list.contains(1),
                    res2 = list.contains(11);

                res1.should.be.true;
                res2.should.be.false;
            });
        });
    });
});