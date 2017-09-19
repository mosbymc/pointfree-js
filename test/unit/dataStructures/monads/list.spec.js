import * as monads from '../../../../src/dataStructures/monads/monads';
import { list, ordered_list } from '../../../../src/dataStructures/monads/list';
import { testData } from '../../../testData';

var List = monads.List;

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

            list.isPrototypeOf(l1).should.be.true;
            list.isPrototypeOf(l2).should.be.true;
            list.isPrototypeOf(l3).should.be.true;
            list.isPrototypeOf(l4).should.be.true;
            list.isPrototypeOf(l5).should.be.true;
            list.isPrototypeOf(l6).should.be.true;
            list.isPrototypeOf(l7).should.be.true;
            list.isPrototypeOf(l8).should.be.true;

            expect([undefined]).to.eql(l1.value);
            expect([null]).to.eql(l2.value);
            expect([1]).to.eql(l3.value);
            expect(arr).to.eql(l4.value);
            expect([obj]).to.eql(l5.value);
            expect('object').to.eql(typeof l6.value);
            expect(['testing constant']).to.eql(l7.value);
            expect([false]).to.eql(l8.value);
        });

        it('should accept lists, generators, comma separated arguments, arrays as a source and result in the same value', function _testListDotFrom() {
            function *_genny() {
                var i = 1;
                while (6 > i) {
                    yield i;
                    ++i;
                }
            }

            List.from(1, 2, 3, 4, 5).data.should.eql([1, 2, 3, 4, 5]);
            List.from(1, 2, 3, 4, 5).data.should.eql(List.from([1, 2, 3, 4, 5]).data);
            List.from(1, 2, 3, 4, 5).data.should.eql(List.from(List([1, 2, 3, 4, 5])).data);
            List.from(1, 2, 3, 4, 5).data.should.eql(List.from(_genny).data);
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
                i8 = List.of(false),
                i9 = List.of(1, false, arr, obj, 'testing multiple args');

            list.isPrototypeOf(i1).should.be.true;
            list.isPrototypeOf(i2).should.be.true;
            list.isPrototypeOf(i3).should.be.true;
            list.isPrototypeOf(i4).should.be.true;
            list.isPrototypeOf(i5).should.be.true;
            list.isPrototypeOf(i6).should.be.true;
            list.isPrototypeOf(i7).should.be.true;
            list.isPrototypeOf(i8).should.be.true;
            list.isPrototypeOf(i9).should.be.true;

            expect([]).to.eql(i1.value);
            expect([null]).to.eql(i2.value);
            expect([1]).to.eql(i3.value);
            expect(arr).to.eql(i4.value);
            expect([obj]).to.eql(i5.value);
            expect('object').to.eql(typeof i6.value);
            expect(['testing constant']).to.eql(i7.value);
            expect([false]).to.eql(i8.value);
            [1, false, arr, obj, 'testing multiple args'].should.eql(i9.value);
        });

        it('should return an ordered list delegator', function _testOrderedListCreationFunctionProperties() {
            var l1 = List.empty,
                l2 = List.just(1),
                l3 = List.ordered([1, 2, 3, 4, 5], x => x);

            ordered_list.isPrototypeOf(l1).should.be.true;
            ordered_list.isPrototypeOf(l2).should.be.true;
            ordered_list.isPrototypeOf(l3).should.be.true;
        });

        it('should return a list from a generator source', function _testListFromGen() {
            function *gen() {
                var count = 0;
                while (5 >= count) {
                    yield count;
                    count++;
                }
            }

            List(gen)
                .data.should.eql([0, 1, 2, 3, 4, 5]);
        });

        it('should return correct response when checking if a type is an Identity', function _testListDotIs() {
            var l = List(2),
                m = monads.Maybe(2),
                c = monads.Constant(null),
                test1 = 2,
                test2 = { a: 1 },
                test3 = [1, 2, 3];

            List.is(l).should.be.true;
            List.is(m).should.be.false;
            List.is(c).should.be.false;
            List.is(test1).should.be.false;
            List.is(test2).should.be.false;
            List.is(test3).should.be.false;
        });

        it('should return a new List delegate with the same value repeated x times', function _testListDotRepeat() {
            List.repeat(1, 5)
                .data.should.eql([1, 1, 1, 1, 1]);
        });

        it('should create a new list via unfold', function _testUnfold() {
            function unfoldFn(val) {
                return { next: val * val, value: monads.Identity(val), done: 513 < val };
            }

            var last = 0;
            List.unfold(unfoldFn, 2).data.forEach(function _validateResult(item) {
                Object.getPrototypeOf(monads.Identity()).isPrototypeOf(item).should.be.true;
                item.value.should.be.at.least(last);
                last = item.value;
            });
        });

        it('should extend the List factory with new functionality', function _testListDotExtend() {
            function extension() {
                return function *_extension() {
                    yield true;
                }
            }
            var extensionSpy = sinon.spy(extension);

            List.extend('true', extensionSpy);
            var res = List([1]).true().data;

            res.should.be.an('array');
            res.should.have.lengthOf(1);
            res[0].should.be.true;
            extensionSpy.should.have.been.calledOnce;
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
                f = l.mapToFuture(),
                io = l.mapToIo(),
                i = l.mapToIdentity(),
                left = l.mapToLeft(),
                m = l.mapToMaybe(),
                r = l.mapToRight();

            c.should.be.an('object');
            Object.getPrototypeOf(c).should.eql(Object.getPrototypeOf(monads.Constant()));

            f.should.be.an('object');
            Object.getPrototypeOf(f).should.eql(Object.getPrototypeOf(monads.Future()));

            io.should.be.an('object');
            Object.getPrototypeOf(io).should.eql(Object.getPrototypeOf(monads.Io()));

            i.should.be.an('object');
            Object.getPrototypeOf(i).should.eql(Object.getPrototypeOf(monads.Identity()));

            left.should.be.an('object');
            Object.getPrototypeOf(left).should.eql(Object.getPrototypeOf(monads.Left()));

            m.should.be.an('object');
            Object.getPrototypeOf(m).should.eql(Object.getPrototypeOf(monads.Just(1)));

            r.should.be.an('object');
            Object.getPrototypeOf(r).should.eql(Object.getPrototypeOf(monads.Right()));
        });

        it('should allow "expected" functionality of concatenation for strings and mathematical operators for numbers', function _testListFunctorValueOf() {
            ('Hello my name is: ' + List('Mark').data).should.eql('Hello my name is: Mark');
        });

        it('should print the correct container type + value when .toString() is invoked', function _testListFunctorToString() {
            var c1 = List(1),
                c2 = List(null),
                c3 = List([1, 2, 3]),
                c4 = List(List(List(5)));

            c1.toString().should.eql('List(1)');
            c2.toString().should.eql('List()');
            c3.toString().should.eql('List(1,2,3)');
            c4.toString().should.eql('List(5)');
        });

        it('should have a .constructor property that points to the factory function', function _testListFunctorIsStupidViaFantasyLandSpecCompliance() {
            List(null).constructor.should.eql(List);
        });

        it('should apply a mutating function to the underlying value and return the new value unwrapped in a List when chain is called', function _testListDotChain() {
            var l1 = List([1, 2, 3, 4, 5]),
                l2 = List.from([false, false, true, false, true]),
                l3 = List(List([{ a: 1, b: 2 }, { a: 3, b: 4 }, { a: 5, b: 6 }, { a: 7, b: 8 }]));

            l1.chain(function _chain(val) {
                return List.of(5 * val);
            }).data.should.eql([5, 10, 15, 20, 25]);

            l2.chain(function _chain(val) {
                return List.of(!val);
            }).data.should.eql([true, true, false, true, false]);

            l3.chain(function _chain(val) {
                return val.a + val.b;
            }).data.should.eql([3, 7, 11, 15]);
        });
    });

    describe('List functor object unique fields tests', function _testListFunctorUniqueFields() {
        describe('Deferred execution list functions', function _testDeferredExecutionListFunctions() {
            function sortComparer(x, y, dir) {
                var t = x > y ? 1 : x === y ? 0 : -1;
                return 2 === dir ? t : -t;
            }

            it('should return two lists concatenated with the non-this list at the front', function _testAddFront() {
                var list = List.from([1, 2, 3, 4, 5]),
                    arr = [6, 7, 8, 9, 10];

                var addFrontIterator = list.prepend(arr),
                    res = addFrontIterator.data;

                res.should.be.an('array');
                res.should.have.lengthOf(10);
                res.should.eql([6, 7, 8, 9, 10, 1, 2, 3, 4, 5]);
            });

            it('should return a list of copied values', function _testCopyWithin() {
                var list = List.from([1, 2, 3, 4, 5]),
                    listRes = list.copyWithin(3, 0);

                listRes.data.should.eql([1, 2, 3, 1, 2]);
            });

            it('should return a single list after concatenating the current list with a new list', function _testConcat() {
                var list = List.from([1, 2, 3, 4, 5]),
                    arr = [6, 7, 8, 9, 10],
                    concatIterator = list.concat(arr),
                    res = concatIterator.data;

                res.should.be.an('array');
                res.should.have.lengthOf(10);
                res.should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            });

            it('should return a single list after concatenating multiple lists', function _testConcatWithMutlipleLists() {
                var list = List.from([1, 2, 3, 4, 5]),
                    arr1 = [6, 7, 8, 9, 10],
                    arr2 = [11, 12, 13, 14, 15],
                    arr3 = [16, 17, 18, 19, 20],
                    concatIterator = list.concat(arr1).concat(arr2).concat(arr3),
                    res = concatIterator.data;

                res.should.be.an('array');
                res.should.have.lengthOf(20);
                res.should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
            });

            it('should return a list of distinct values', function _testDistinct() {
                var list = List.from([1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2]),
                    listRes = list.distinct();

                listRes.data.should.eql([1, 2]);
            });

            it('should fill the list with a single value', function _testFill() {
                var list = List([1, 2, 3, 4, 5]),
                    listRes = list.fill(1);

                listRes.data.should.eql([1, 1, 1, 1, 1]);
            });

            it('should filter out values based on predicate', function _testFilter() {
                List([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
                    .filter(num => 0 !== num % 2)
                    .data.should.eql([1, 3, 5, 7, 9]);
            });

            it('should return the list except where the two intersect (numbers)', function _testExceptWithNumbers() {
                var list = List.from([1, 2, 3, 4, 5]),
                    arr = [2, 4, 6, 8, 10],
                    exceptList = list.except(arr),
                    res = exceptList.data;

                res.should.be.an('array');
                res.should.have.lengthOf(3);
                res.should.eql([1, 3, 5]);
            });

            it('should return the list except where the two intersect (strings)', function _testExceptWithStrings() {
                var list = List.from(['1', '2', '3', '4', '5']),
                    arr = ['2', '4', '6', '8', '10'],
                    exceptList = list.except(arr),
                    res = exceptList.data;

                res.should.be.an('array');
                res.should.have.lengthOf(3);
                res.should.eql(['1', '3', '5']);
            });

            it('should return the list except where the two intersect (objects)', function _testExceptWithObjects() {
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
                    return 'Phillip J.' !== item.FirstName && 'Hedonism' !== item.FirstName;
                });

                res.should.be.an('array');
                res.should.have.lengthOf(resStandard.length);
                res.should.eql(resStandard);
            });

            it('should return the list except where it intersects with the values yielded from a generator', function _testExceptWithAGenerator() {
                function *_genny() {
                    var i = 0;
                    while (10 > i) {
                        yield i;
                        i += 2;
                    }
                }

                var res = List([1, 2, 3, 4, 5])
                    .except(_genny).data;

            });

            it('should group the test data on last name', function _testGroupBy() {
                function selector(item) { return item.LastName; }
                function comparer(a, b) { return a === b; }

                var uniqueLastNames = [];
                testData.dataSource.data.forEach(function _findUniqueStates(item) {
                    if (!uniqueLastNames.some(function findDupe(it) {
                            return it === item.LastName;
                        }))
                        uniqueLastNames.push(item.LastName);
                });

                List(testData.dataSource.data)
                    .groupBy(selector, comparer)
                    .data.should.lengthOf(uniqueLastNames.length);
            });

            it('should group the test data on last name', function _testGroupByDescending() {
                function selector(item) { return item.LastName; }
                function comparer(a, b) { return a === b; }

                var uniqueLastNames = [];
                testData.dataSource.data.forEach(function _findUniqueStates(item) {
                    if (!uniqueLastNames.some(function findDupe(it) {
                            return it === item.LastName;
                        }))
                        uniqueLastNames.push(item.LastName);
                });

                List(testData.dataSource.data)
                    .groupByDescending(selector, comparer)
                    .data.should.lengthOf(uniqueLastNames.length);
            });

            it('should group items on last name after joining with another list', function _testGroupJoin() {
                var preViewed = {};
                var uniqueCities = testData.dataSource.data.filter(function _gatherUniqueCities(item) {
                    if (!(item.City in preViewed)) {
                        preViewed[item.City] = true;
                        return item.City;
                    }
                }).map(function _selectOnlyCities(item) {
                    return item.City;
                });

                function primitiveSelector(item) {
                    return item;
                }

                function citySelector(item) {
                    return item.City;
                }

                function cityProjector(a, b) {
                    //console.log(b.data);
                    return {
                        City: a.City,
                        People: b.data
                    };
                }

                List(testData.dataSource.data)
                    .groupJoin(uniqueCities, citySelector, primitiveSelector, cityProjector)
                    .data;
                /*
                var groupJoinIterable = groupJoin(uniqueCities, testData.dataSource.data, primitiveSelector, citySelector, cityProjector),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(uniqueCities.length);
                groupJoinRes.forEach(function _validateEntries(item) {
                    item.should.have.keys('City', 'People');
                    item.People.should.be.an('object');
                    item.People.data.forEach(function _ensurePeopleLiveInCity(person) {
                        item.City.should.eql(person.City);
                    });
                });
                */
            });

            it('should intersperse a value within the list', function _testIntersperse() {
                List([1, 2, 3, 4, 5])
                    .intersperse(1)
                    .data.should.eql([1, 1, 2, 1, 3, 1, 4, 1, 5]);
            });

            it('should return the list only where the two intersect (numbers)', function _testIntersectWithNumbers() {
                var list = List.from([1, 2, 3, 4, 5]),
                    arr = [2, 4, 6, 8, 10],
                    intersectList = list.intersect(arr),
                    res = intersectList.data;

                res.should.be.an('array');
                res.should.have.lengthOf(2);
                res.should.eql([2, 4]);
            });

            it('should return the list only where the two intersect (strings)', function _testIntersectWithStrings() {
                var list = List.from(['1', '2', '3', '4', '5']),
                    arr = ['2', '4', '6', '8', '10'],
                    intersectList = list.intersect(arr),
                    res = intersectList.data;

                res.should.be.an('array');
                res.should.have.lengthOf(2);
                res.should.eql(['2', '4']);
            });

            it('should return the list only where the two intersect (objects)', function _testIntersectWithObjects() {
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
                    return 'Phillip J.' === item.FirstName || 'Hedonism' === item.FirstName;
                });

                res.should.be.an('array');
                res.should.have.lengthOf(resStandard.length);
                res.should.eql(resStandard);
            });

            it('should join two arrays together', function _testJoin() {
                function selector(item) {
                    return item.FirstName;
                }

                function projector(a, b) {
                    return {
                        outerFirstName: a.FirstName,
                        innerFirstName: b.FirstName
                    }
                }

                var duplicateFirstNames = Array.prototype.concat.apply([], testData.dataSource.data.map(function _findDupes(item) {
                    return Array.prototype.concat.apply([], testData.dataSource.data.filter(function _innerDupes(it) {
                        return item.FirstName === it.FirstName;
                    }));
                }));

                List(testData.dataSource.data)
                    .listJoin(testData.dataSource.data, selector, selector, projector)
                    .data.should.have.lengthOf(duplicateFirstNames.length);
            });

            it('should filter values from a list that are not of the specified type', function _testOfType() {
                List([1, 2, '3', '4', false, true, Symbol.for('test'), null, undefined, { a: 1 }])
                    .ofType('number')
                    .data.should.eql([1, 2]);
            });

            it('should reverse the underlying data', function _testReverse() {
                List([1, 2, 3, 4, 5])
                    .reverse()
                    .data.should.eql([5, 4, 3, 2, 1]);
            });

            it('should skip the specified number of items', function _testSkip() {
                List([1, 2, 3, 4, 5])
                    .skip(3)
                    .data.should.eql([4, 5]);

                List([1, 2, 3, 4, 5])
                    .skip()
                    .data.should.eql([1, 2, 3, 4, 5]);
            });

            it('should skip values until the first time predicate returns false', function _testSkipWhile() {
                List([1, 2, 3, 4, 5])
                    .skipWhile(x => 1 === x % 2)
                    .data.should.eql([2, 3, 4, 5]);
            });

            it('should take the specified number of items', function _testTake() {
                List(testData.dataSource.data)
                    .take(15)
                    .data.should.have.lengthOf(15);
            });

            it('should take values until the first time the predicate returns false', function _testTakeWhile() {
                List([1, 2, 3, 4, 5])
                    .takeWhile(x => 0 !== x % 2)
                    .data.should.eql([1]);
            });

            it('should produce a set of unique items from both collections', function _testUnion() {
                List([1, 2, 3, 4, 5, 6])
                    .union([5, 6, 7, 8, 9, 10])
                    .data.should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            });

            it('should zip two lists together', function _testZip() {
                List(testData.dataSource.data)
                    .zip((function _selector(x, y) { return { x: x.FirstName, y: y }; }), [1, 2, 3, 4, 5, 6, 7])
                    .data.should.eql([
                    { x: 'Phillip J.', y: 1 },
                    { x: 'Hedonism', y: 2 },
                    { x: 'Hypnotoad', y: 3 },
                    { x: 'Robot', y: 4 },
                    { x: '9', y: 5 },
                    { x: 'Crushinator', y: 6 },
                    { x: 'Lrrr', y: 7 }
                ]);
            });

            it('should sort a list in ascending order', function _testSortBy() {
                List([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
                    .sortBy(x => x, sortComparer)
                    .data.should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            });

            it('should sort a list in descending order', function _testSortByDescending() {
                List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
                    .sortByDescending(x => x, sortComparer)
                    .data.should.eql([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
            });

            it('should sort a list in ascending order twice', function _testThenBy() {
                List([[10, 1], [10, 5], [10, 2], [9, 9], [9, 3], [8, 1], [9, 10], [8, 0], [7, 2], [7, 1]])
                    .sortBy(x => x[0], sortComparer)
                    .thenBy(x => x[1], sortComparer)
                    .data.should.eql([[7, 1], [7, 2], [8, 0], [8, 1], [9, 3], [9, 9], [9, 10], [10, 1], [10, 2], [10, 5]]);
            });

            it('should sort a list in ascending order and then descending order', function _testThenByDescending() {
                List([[10, 1], [10, 5], [10, 2], [9, 9], [9, 3], [8, 1], [9, 10], [8, 0], [7, 2], [7, 1]])
                    .sortBy(x => x[0], sortComparer)
                    .thenByDescending(x => x[1], sortComparer)
                    .data.should.eql([[7, 2], [7, 1], [8, 1], [8, 0], [9, 10], [9, 9], [9, 3], [10, 5], [10, 2], [10, 1]]);
            });

            it('should be mappable', function _testListMapability() {
                List([1, 2, 3, 4, 5])
                    .map(x => List(x * x))
                    .chain(x => x)
                    .data.should.eql([1, 4, 9, 16, 25]);
            });
        });

        describe('Immediately Evaluated list functions', function _testImmediatelyEvaluatedListFunctions() {
            it('should return true when the list contains the specified item and false other wise', function _testContains() {
                var list = List.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
                    res1 = list.contains(1),
                    res2 = list.contains(11);

                res1.should.be.true;
                res2.should.be.false;
            });

            it('should return a boolean indicating if all data in the list passes predicate', function _testAll() {
                List([1, 2, 3, 4, 5])
                    .all(x => 10 < x)
                    .should.be.false;

                List([1, 2, 3, 4, 5])
                    .all(x => 0 <= x)
                    .should.be.true;
            });

            it('should return a boolean indicating if any data in the list passes the predicate', function _testAny() {
                List([1, 2, 3, 4, 5])
                    .any(x => 4 < x)
                    .should.be.true;

                List([1, 2, 3, 4, 5])
                    .any(x => 6 < x)
                    .should.be.false;
            });

            it('should return the number of items contained in the list', function _testCount() {
                function *gen(data) {
                    for (let item of data)
                        yield item;
                }

                List([1, 2, 3, 4, 5])
                    .count()
                    .should.eql(5);

                List(gen([1, 2, 3, 4, 5]))
                    .count()
                    .should.eql(5);
            });

            it('should return a boolean indicating if two lists are equivalent', function _testEqual() {
                List([1, 2, 3, 4, 5])
                    .equals(List([1, 2, 3, 4, 5], (x, y) => x === y))
                    .should.be.true;
            });

            it('should return the index of the item', function _testFindIndex() {
                List([1, 2, 3, 4, 5])
                    .findIndex(x => 3 === x)
                    .should.eql(2);
            });

            it('should return the last index of the item', function _testFindLastIndex() {
                List([1, 1, 2, 2, 3, 3, 4, 5, 1])
                    .findLastIndex(x => 1 === x)
                    .should.eql(9);
            });

            it('should return the first item in the list that matches the predicate', function _testFirst() {
                List(testData.dataSource.data)
                    .first(x => 'New New York' === x.City)
                    .should.eql({
                    FirstName: 'Phillip J.',
                    LastName: 'Fry',
                    Phone: '999-999-9999',
                    Email: 'mmm@mmm.net',
                    Address: '999 Peachtree St.',
                    City: 'New New York',
                    State: 'NY',
                    Zip: '80808',
                    drillDownData:
                        [ { MechanicName: 'Headless Body of Agnew',
                            Make: 'Honda',
                            Model: 'Civic ES',
                            Year: '2003',
                            Doors: '3',
                            EngineType: '4 Cylinder',
                            EngineSize: 1.6 },
                            { MechanicName: 'Headless Body of Agnew',
                                Make: 'Acura',
                                Model: 'Integra',
                                Year: '1996',
                                Doors: '3',
                                EngineType: '4 Cylinder',
                                EngineSize: 1.8 },
                            { MechanicName: 'Joey Mousepad',
                                Make: 'BMW',
                                Model: 'Z4',
                                Year: '2003',
                                Doors: '1',
                                EngineType: '6 Cylinder',
                                EngineSize: 2.2 },
                            { MechanicName: 'Joey Mousepad',
                                Make: 'Nissan',
                                Model: 'Pathfinder',
                                Year: '2002',
                                Doors: '5',
                                EngineType: 'V6',
                                EngineSize: 3.5 } ] });

                List([1, 2, 3, 4, 5])
                    .first()
                    .should.eql(1);
            });

            it('should fold the list from the left', function _testFoldL() {
                List([1, 2, 3, 4, 5])
                    .foldl((acc, x) => acc / x, 1)
                    .should.eql(0.008333333333333333);
            });

            it('should fold the list from the right', function _testFoldR() {
                List([1, 2, 3, 4, 5])
                    .foldr((x, acc) => x / acc, 1)
                    .should.eql(1.875);
            });

            it('should return a boolean indicating if the list has no items', function _testIsEmpty() {
                List([1, 2, 3, 4])
                    .isEmpty().should.be.false;

                List.empty.isEmpty().should.be.true;
            });

            it('should return the last item in the list that matches the predicate', function _testLast() {
                List(testData.dataSource.data)
                    .last(x => 'New New York' === x.City)
                    .should.eql({
                    FirstName: 'Turanga',
                    LastName: 'Leela',
                    Phone: '999-999-9999',
                    Email: 'leela@turange.net',
                    Address: '9271 Some St.',
                    City: 'New New York',
                    State: 'NY',
                    Zip: '89898',
                    drillDownData:
                        [ { MechanicName: 'Clamps',
                            Make: 'Honda',
                            Model: 'Civic ES',
                            Year: '2003',
                            Doors: '3',
                            EngineType: '4 Cylinder',
                            EngineSize: 1.6 },
                            { MechanicName: 'Clamps',
                                Make: 'Acura',
                                Model: 'Integra',
                                Year: '1996',
                                Doors: '3',
                                EngineType: '4 Cylinder',
                                EngineSize: 1.8 },
                            { MechanicName: 'Joey Mousepad',
                                Make: 'BMW',
                                Model: 'Z4',
                                Year: '2003',
                                Doors: '1',
                                EngineType: '6 Cylinder',
                                EngineSize: 2.2 },
                            { MechanicName: 'Headless Body of Agnew',
                                Make: 'Nissan',
                                Model: 'Pathfinder',
                                Year: '2002',
                                Doors: '5',
                                EngineType: 'V6',
                                EngineSize: 3.5 } ] });

                List([1, 2, 3, 4, 5])
                    .last()
                    .should.eql(5);
            });

            it('should return a right-based reduction', function _testReduceRight() {
                List([1, 2, 3, 4, 5])
                    .reduceRight((acc, x) => acc / x)
                    .should.eql(0.20833333333333334);
            });

            it('should return the underlying data as an array', function _testToArray() {
                List([1, 2, 3, 4, 5])
                    .toArray()
                    .should.eql([1, 2, 3, 4, 5]);
            });

            it('should return a list that has evaluated its underlying data', function _testToEvaluatedList() {
                var mapperSpy = sinon.spy(x => x * 2),
                    filterSpy = sinon.spy(x => 4 < x);

                List([1, 2, 3, 4, 5])
                    .map(mapperSpy)
                    .filter(filterSpy)
                    .toEvaluatedList()
                    .toEvaluatedList();

                //The second call to #toEvaluatedList does not cause a re-evaluation
                //of the pipeline since the first invocation returned a List whose
                //underlying is simply an array - the pipeline is gone...
                mapperSpy.should.have.been.callCount(5);
                filterSpy.should.have.been.callCount(5);
            });

            //TODO: need to update this - chai is not comparing maps correctly
            it('should return the underlying data as a map', function _testToMap() {
                List([1, 2, 3, 4, 5])
                    .toMap()
                    .should.eql(new Map())
            });

            it('should return the underlying data as a set', function _testToSet() {
                List([1, 2, 3, 4, 5])
                    .toSet()
                    .should.eql(new Set([1, 2, 3, 4, 5]));
            });

            describe('Test contains', function _testContains() {
                var containsComparer = (x, y) => x > y ? 1 : x === y ? 0 : -1,
                    sortComparer = (x, y) => x > y;
                it('should run a binary search on an ordered list', function _testContainsOnAnOrderedList() {
                    var containsComparerSpy = sinon.spy(containsComparer);

                    List([1, 3, 8, 15, 21, 22, 37, 86, 112, 114, 118, 190, 257, 299, 315, 899])
                        .sortBy(x => x, sortComparer)
                        .contains(21, containsComparerSpy)
                        .should.be.true;

                    containsComparerSpy.should.have.been.callCount(4);
                });

                it('should return false on a binary search when the list does not contain the specified value', function _testContainsOnAnOrderedListWithoutSearchValue() {
                    var containsComparerSpy = sinon.spy(containsComparer);

                    List([1, 3, 8, 15, 21, 22, 37, 86, 112, 114, 118, 190, 257, 299, 315, 899])
                        .sortBy(x => x, sortComparer)
                        .contains(23, containsComparerSpy)
                        .should.be.false;

                    containsComparerSpy.should.have.been.callCount(4);
                });

                it('should run a brute force search on an unordered list that contains the specified value', function _testContainsOnAnUnorderedList() {
                    var spyComparer = sinon.spy((x, y) => x === y);

                    List([1, 3, 8, 15, 21, 22, 37, 86, 112, 114, 118, 190, 257, 299, 315, 899])
                        .contains(22, spyComparer)
                        .should.be.true;

                    spyComparer.should.have.been.callCount(6);
                });

                it('should run a brute force search on an unordered list that does not contain the specified value', function _testContainsOnAnUnorderedList() {
                    var spyComparer = sinon.spy((x, y) => x === y);

                    List([1, 3, 8, 15, 21, 22, 37, 86, 112, 114, 118, 190, 257, 299, 315, 899])
                        .contains(14, spyComparer)
                        .should.be.false;

                    spyComparer.should.have.been.callCount(16);
                });
            });
        });
    });

    describe('tmp', function _tmp() {
        function noop() {}

        it('should do stuff', function _doStuff(done) {
            var count = 0;

            function _TO1(cb) {
                setTimeout(function _to() {
                    ++count;
                    count.should.eql(1);
                    cb(null, count);
                }, 250);
            }

            function _TO2(cb) {
                setTimeout(function _to() {
                    ++count;
                    count.should.eql(2);
                    cb(null, count);
                    done();
                }, 300);
            }

            List([ _TO1, _TO2])
                .traverse(monads.Future.of,
                        fn => monads.Future((reject, result) => fn((err, res) => err ? reject(err) : result(res))))
                .fork(noop, noop);
        });

        it('should traverse a list of identity', function _testListDotTraverseWithIdentity() {
            var i = List([1, 2, 3])
                .traverse(monads.Identity.of, val => monads.Identity(val * val));

            var initial = 1;
            Object.getPrototypeOf(monads.Identity()).isPrototypeOf(i).should.be.true;
            Object.getPrototypeOf(List()).isPrototypeOf(i.value).should.be.true;
            i.value.data.forEach(function _verifyResult(val) {
                val.should.eql(initial * initial);
                ++initial;
            });
        });
    });
});