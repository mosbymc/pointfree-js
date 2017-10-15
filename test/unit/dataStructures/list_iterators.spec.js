import { all, any, except, intersect, union, map, chain, groupBy, sortBy, prepend, prependAll, concat, concatAll, groupJoin, join, zip, filter, intersperse,
        contains, first, last, count, foldLeft, reduceRight, distinct, ofType, binarySearch, equals, takeWhile, skipWhile, reverse,
        copyWithin, fill, findIndex, findLastIndex, repeat, foldRight, unfold } from '../../../src/dataStructures/list_iterators';
import { list, ordered_list, createListDelegateInstance } from '../../../src/dataStructures/list';
import { cacher, sortDirection, typeNames } from '../../../src/helpers';
import { testData } from '../../testData';

describe('Test List Iterators', function _testListIterators() {
    describe('Test prepend...', function testAddFront() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        it('should return test data x 2', function testConcatSourceWithItself() {
            var addFrontIterable = prepend(testData.dataSource.data, testData.dataSource.data),
                addFrontRes = Array.from(addFrontIterable());

            addFrontRes.should.have.lengthOf(testData.dataSource.data.length * 2);
            addFrontRes.slice(0, testData.dataSource.data.length).should.eql(testData.dataSource.data);
            addFrontRes.slice(testData.dataSource.data.length).should.eql(testData.dataSource.data);
        });

        it('should concat sources of different value types', function testConcatWithDifferingValueTypes() {
            var addFrontIterable = prepend(testData.dataSource.data, [1, 2, 3, 4, 5]),
                addFrontRes = Array.from(addFrontIterable());

            addFrontRes.should.have.lengthOf(testData.dataSource.data.length + 5);
            addFrontRes.slice(5).should.eql(testData.dataSource.data);
            addFrontRes.slice(0, 5).should.eql([1, 2, 3, 4, 5]);
        });

        it('should return test data when second param is empty array', function testConcatWithSecondParameterAnEmptyArray() {
            var addFrontIterable = prepend(testData.dataSource.data, []),
                addFrontRes = Array.from(addFrontIterable());

            addFrontRes.should.have.lengthOf(testData.dataSource.data.length);
            addFrontRes.should.eql(testData.dataSource.data);
        });

        it('should return test data when first param is empty and second param is test data', function testConcatWithFirstParameterAnEmptyArray() {
            var addFrontIterable = prepend([], testData.dataSource.data),
                addFrontRes = Array.from(addFrontIterable());

            addFrontRes.should.have.lengthOf(testData.dataSource.data.length);
            addFrontRes.should.eql(testData.dataSource.data);
        });

        it('should return test data when first param is an empty generator', function testConcatWithFirstParameterAnEmptyGenerator() {
            var addFrontIterable = prepend(gen([]), testData.dataSource.data),
                addFrontRes = Array.from(addFrontIterable());

            addFrontRes.should.have.lengthOf(testData.dataSource.data.length);
            addFrontRes.should.eql(testData.dataSource.data);
        });

        it('should return test data when second param is an empty generator', function testConcatWithSecondParameterAnEmptyGenerator() {
            var addFrontIterable = prepend(testData.dataSource.data, gen([])),
                addFrontRes = Array.from(addFrontIterable());

            addFrontRes.should.have.lengthOf(testData.dataSource.data.length);
            addFrontRes.should.eql(testData.dataSource.data);
        });

        it('should return test data x 2 when fed two generators', function testConcatWithTwoGenerators() {
            var addFrontIterable = prepend(gen(testData.dataSource.data), gen(testData.dataSource.data)),
                addFrontRes = Array.from(addFrontIterable());

            addFrontRes.should.have.lengthOf(testData.dataSource.data.length * 2);
            addFrontRes.slice(0, testData.dataSource.data.length).should.eql(testData.dataSource.data);
            addFrontRes.slice(testData.dataSource.data.length).should.eql(testData.dataSource.data);
        });
    });

    describe('Test prependAll...', function _testPrependAll() {
        it('should prepend everything in the array to the iterable', function _testPrependAllWithArrays() {
            var prependIterator = prependAll([21, 22, 23, 24, 25], [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20]]),
                res = Array.from(prependIterator());

            res.should.be.an('array');
            res.should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]);
        });

        it('should prepend an array of generators to an array', function _testPrependAllWithGenerators() {
            function *gen() {
                var i = 0;
                while (6 > i) {
                    yield ++i;
                }
            }

            var prependIterator = prependAll([10], [gen, gen, gen]),
                res = Array.from(prependIterator());
            res.should.eql([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 10])
        });
    });

    describe('Test concat...', function testConcat() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        it('should return test data x 2', function testConcatSourceWithItself() {
            var concatIterable = concat(testData.dataSource.data, testData.dataSource.data),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length * 2);
            concatRes.slice(0, testData.dataSource.data.length).should.eql(testData.dataSource.data);
            concatRes.slice(testData.dataSource.data.length).should.eql(testData.dataSource.data);
        });

        it('should concat sources of different value types', function testConcatWithDifferingValueTypes() {
            var concatIterable = concat(testData.dataSource.data, [1, 2, 3, 4, 5]),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length + 5);
            concatRes.slice(0, testData.dataSource.data.length).should.eql(testData.dataSource.data);
            concatRes.slice(testData.dataSource.data.length).should.eql([1, 2, 3, 4, 5]);
        });

        it('should return test data when second param is empty array', function testConcatWithSecondParameterAnEmptyArray() {
            var concatIterable = concat(testData.dataSource.data, []),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length);
            concatRes.should.eql(testData.dataSource.data);
        });

        it('should return test data when first param is empty and second param is test data', function testConcatWithFirstParameterAnEmptyArray() {
            var concatIterable = concat([], testData.dataSource.data),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length);
            concatRes.should.eql(testData.dataSource.data);
        });

        it('should return test data when first param is an empty generator', function testConcatWithFirstParameterAnEmptyGenerator() {
            var concatIterable = concat(gen([]), testData.dataSource.data),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length);
            concatRes.should.eql(testData.dataSource.data);
        });

        it('should return test data when second param is an empty generator', function testConcatWithSecondParameterAnEmptyGenerator() {
            var concatIterable = concat(testData.dataSource.data, gen([])),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length);
            concatRes.should.eql(testData.dataSource.data);
        });

        it('should return test data x 2 when fed two generators', function testConcatWithTwoGenerators() {
            var concatIterable = concat(gen(testData.dataSource.data), gen(testData.dataSource.data)),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length * 2);
            concatRes.slice(0, testData.dataSource.data.length).should.eql(testData.dataSource.data);
            concatRes.slice(testData.dataSource.data.length).should.eql(testData.dataSource.data);
        });
    });

    describe('Test concatAll...', function _testConcatAll() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        it('should return test data x 2', function testConcatAllSourceWithItself() {
            var concatIterable = concatAll(testData.dataSource.data, [testData.dataSource.data]),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length * 2);
            concatRes.slice(0, testData.dataSource.data.length).should.eql(testData.dataSource.data);
            concatRes.slice(testData.dataSource.data.length).should.eql(testData.dataSource.data);
        });

        it('should return test data when second param is empty array', function testConcatAllWithSecondParameterAnEmptyArray() {
            var concatIterable = concatAll(testData.dataSource.data, []),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length);
            concatRes.should.eql(testData.dataSource.data);
        });

        it('should return test data when first param is empty and second param is test data', function testConcatAllWithFirstParameterAnEmptyArray() {
            var concatIterable = concatAll([], [testData.dataSource.data]),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length);
            concatRes.should.eql(testData.dataSource.data);
        });

        it('should return test data when first param is an empty generator', function testConcatAllWithFirstParameterAnEmptyGenerator() {
            var concatIterable = concatAll(gen([]), [testData.dataSource.data]),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length);
            concatRes.should.eql(testData.dataSource.data);
        });

        it('should return test data when second param is an empty generator', function testConcatAllWithSecondParameterAnEmptyGenerator() {
            var concatIterable = concatAll(testData.dataSource.data, [gen([])]),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length);
            concatRes.should.eql(testData.dataSource.data);
        });

        it('should return test data x 2 when fed two generators', function testConcatWithTwoGenerators() {
            var concatIterable = concat(gen(testData.dataSource.data), gen(testData.dataSource.data)),
                concatRes = Array.from(concatIterable());

            concatRes.should.have.lengthOf(testData.dataSource.data.length * 2);
            concatRes.slice(0, testData.dataSource.data.length).should.eql(testData.dataSource.data);
            concatRes.slice(testData.dataSource.data.length).should.eql(testData.dataSource.data);
        });
    });

    describe('Test except...', function testExcept() {
        function comparer(a, b) { return a.FirstName === b.FirstName; }

        var havePreviouslyViewed = cacher(comparer),
            uniqueFirstNames = testData.dataSource.data.filter(function findUniqueNames(item) {
                return !havePreviouslyViewed(item) && 'Mark' !== item.FirstName;
            });

        describe('... using default equality comparer', function testExceptWithDefaultComparer() {
            it('should return test data when correlated with an empty array', function testExceptWithEmptyArray() {
                var exceptIterable = except(testData.dataSource.data, []),
                    exceptRes = Array.from(exceptIterable());

                exceptRes.should.have.lengthOf(testData.dataSource.data.length);
                exceptRes.should.eql(testData.dataSource.data);
            });

            it('should return empty array when correlated with itself', function testExceptWithSameData() {
                var exceptIterable = except(testData.dataSource.data, testData.dataSource.data),
                    exceptRes = Array.from(exceptIterable());

                exceptRes.should.have.lengthOf(0);
            });

            it('should empty array when source is empty, regardless of collection', function testExceptWithEmptySource() {
                var exceptIterable1 = except([], []),
                    exceptIterable2 = except([], testData.dataSource.data),
                    exceptRes1 = Array.from(exceptIterable1()),
                    exceptRes2 = Array.from(exceptIterable2());

                exceptRes1.should.have.lengthOf(0);
                exceptRes2.should.have.lengthOf(0);
            });

            it('should return first half of test data when correlated with second half', function testExceptWithTestDataHalved() {
                var exceptIterable = except(testData.dataSource.data.slice(0, testData.dataSource.data.length / 2), testData.dataSource.data.slice(testData.dataSource.data.length / 2)),
                    exceptRes = Array.from(exceptIterable());

                exceptRes.should.have.lengthOf(testData.dataSource.data.length / 2);
                exceptRes.should.eql(testData.dataSource.data.slice(0, testData.dataSource.data.length / 2));
            });
        });

        describe('... using defined equality comparer', function testExceptWithDefinedEqualityComparer() {
            it('should return test data when correlated with empty array', function testExceptWithEmptyArray() {
                var exceptIterable = except(testData.dataSource.data, [], comparer),
                    exceptRes = Array.from(exceptIterable());

                exceptRes.should.have.lengthOf(testData.dataSource.data.length);
                exceptRes.should.eql(testData.dataSource.data);
            });

            it('should return empty array when correlated with itself', function testExceptWithSameData() {
                var exceptIterable = except(testData.dataSource.data, testData.dataSource.data, comparer),
                    exceptRes = Array.from(exceptIterable());

                exceptRes.should.have.lengthOf(0);
            });

            it('should return all items from first half of test data that don\'t have overlapping names in the second half', function testForUniqueNamesInFirstHalf() {
                var exceptIterable = except(testData.dataSource.data.slice(0, testData.dataSource.data.length / 2),  testData.dataSource.data.slice(testData.dataSource.data.length / 2), comparer),
                    exceptRes = Array.from(exceptIterable());

                exceptRes.should.have.lengthOf(uniqueFirstNames.length);
                exceptRes.should.eql(uniqueFirstNames);
            });
        });

        describe('... using generator as a parameter', function testExceptWithGeneratorAsParameter() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            it('should return test data when correlated with empty generator', function testExceptWithEmptyGenerator() {
                var exceptIterable = except(testData.dataSource.data, gen([])),
                    exceptRes = Array.from(exceptIterable());

                exceptRes.should.have.lengthOf(testData.dataSource.data.length);
                exceptRes.should.eql(testData.dataSource.data);
            });

            it('should return empty array when correlated with generator containing test data', function testExceptWithGeneratorContainingTestData() {
                var exceptIterable = except(testData.dataSource.data, gen(testData.dataSource.data)),
                    exceptRes = Array.from(exceptIterable());

                exceptRes.should.have.lengthOf(0);
            });

            it('should return empty array when both parameters are generators containing test data', function testExceptWithBothParametersAsGenerators() {
                var exceptIterable = except(gen(testData.dataSource.data), gen(testData.dataSource.data)),
                    exceptRes = Array.from(exceptIterable());

                exceptRes.should.have.lengthOf(0);
            });
        });
    });

    describe('Test groupJoin...', function testGroupJoin() {
        var factoryFn = createListDelegateInstance;
        var preViewed = {};
        var uniqueCities = testData.dataSource.data.filter(function _gatherUniqueCities(item) {
            if (!(item.City in preViewed)) {
                preViewed[item.City] = true;
                return item.City;
            }
        }).map(function _selectOnlyCities(item) {
            return item.City;
        });

        var uniqueStates = testData.dataSource.data.filter(function _gatherUniqueStates(item) {
            if (!(item.State in preViewed)) {
                preViewed[item.State] = true;
                return item.State;
            }
        }).map(function _selectOnlyStates(item) {
            return item.State;
        });

        function primitiveSelector(item) {
            return item;
        }

        function citySelector(item) {
            return item.City;
        }

        function stateSelector(item) {
            return item.State;
        }

        function cityProjector(a, b) {
            return {
                City: a,
                People: b
            };
        }

        function stateProjector(a, b) {
            return {
                State: a,
                People: b
            };
        }

        function cityComparer(a, b) {
            return a === b.City;
        }

        function stateComparer(a, b) {
            return a === b.State;
        }
        describe('...using default equality comparer', function testGroupJoinUsingDefaultComparer() {
            it('should return all items grouped by city', function testBasicGroupJoin() {
                var groupJoinIterable = groupJoin(uniqueCities, testData.dataSource.data, primitiveSelector, citySelector, cityProjector, factoryFn),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(uniqueCities.length);
                groupJoinRes.forEach(function _validateEntries(item) {
                    item.should.have.keys('City', 'People');
                    item.People.data.forEach(function _ensurePeopleLiveInCity(person) {
                        item.City.should.eql(person.City);
                    });
                });
            });

            it('should return all items grouped by state', function testBasicGroupJoin() {
                var groupJoinIterable = groupJoin(uniqueStates, testData.dataSource.data, primitiveSelector, stateSelector, stateProjector, factoryFn),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(uniqueStates.length);
                groupJoinRes.forEach(function _validateEntries(item) {
                    item.should.have.keys('State', 'People');
                    item.People.data.forEach(function _ensurePeopleLiveInState(person) {
                        item.State.should.eql(person.State);
                    });
                });
            });

            it('should return items that have no inner matches', function testGroupJoinWithNoInnerMatches() {
                var groupJoinIterable = groupJoin(uniqueStates, [], primitiveSelector, stateSelector, stateProjector, factoryFn),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(uniqueStates.length);
                groupJoinRes.forEach(function _validateEntries(item) {
                    item.should.have.keys('State', 'People');
                    item.People.data.should.have.lengthOf(0);
                });
            });

            it('should return empty array when source is empty', function testGroupJoinWithEmptySource() {
                var groupJoinIterable = groupJoin([], testData.dataSource.data, primitiveSelector, stateSelector, stateProjector, factoryFn),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(0);
            });
        });

        describe('...using defined equality comparer', function testGroupJoinWithDefinedComparer() {
            it('should return all items grouped by city', function testGroupJoinWithDefinedEqualityComparer() {
                var groupJoinIterable = groupJoin(uniqueCities, testData.dataSource.data, primitiveSelector, citySelector, cityProjector, factoryFn, cityComparer),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(uniqueCities.length);
                groupJoinRes.forEach(function _ensurePeopleLiveInCities(item) {
                    item.should.have.keys('City', 'People');
                    item.People.data.forEach(function _ensurePeopleLiveInCity(person) {
                        item.City.should.eql(person.City);
                    });
                });
            });

            it('should return all items grouped by state', function testGroupJoinWithDefinedEqualityComparer() {
                var groupJoinIterable = groupJoin(uniqueStates, testData.dataSource.data, primitiveSelector, stateSelector, stateProjector, factoryFn, stateComparer),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(uniqueStates.length);
                groupJoinRes.forEach(function _validateEntries(item) {
                    item.should.have.keys('State', 'People');
                    item.People.data.forEach(function _ensurePeopleLiveInState(person) {
                        item.State.should.eql(person.State);
                    });
                });
            });

            it('should prevent all matches when comparer is not comparing like values', function testGroupJoinWithIncorrectComparer() {
                function badComparer(a, b) {
                    return a === b.Zip;
                }

                var groupJoinIterable = groupJoin(uniqueCities, testData.dataSource.data, primitiveSelector, citySelector, cityProjector, factoryFn, badComparer),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(uniqueCities.length);
                groupJoinRes.forEach(function _ensurePeopleLiveInCities(item) {
                    item.should.have.keys('City', 'People');
                    item.People.data.should.have.lengthOf(0);
                });
            });

            it('should return items that have no inner matches', function testGroupJoinWithNoInnerMatches() {
                var groupJoinIterable = groupJoin(uniqueStates, [], primitiveSelector, stateSelector, stateProjector, factoryFn, stateComparer),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(uniqueStates.length);
                groupJoinRes.forEach(function _validateEntries(item) {
                    item.should.have.keys('State', 'People');
                    item.People.data.should.have.lengthOf(0);
                });
            });

            it('should return empty array when source is empty', function testGroupJoinWithEmptySource() {
                var groupJoinIterable = groupJoin([], testData.dataSource.data, primitiveSelector, stateSelector, stateProjector, factoryFn, stateComparer),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(0);
            });
        });

        describe('...using generators', function testGroupJoinWithGenerators() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            it('should return all items grouped by city', function testGroupJoinWithDefinedEqualityComparer() {
                var groupJoinIterable = groupJoin(gen(uniqueCities), gen(testData.dataSource.data), primitiveSelector, citySelector, cityProjector, factoryFn, cityComparer),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(uniqueCities.length);
                groupJoinRes.forEach(function _validateEntries(item) {
                    item.should.have.keys('City', 'People');
                    item.People.data.forEach(function _ensurePeopleLiveInState(person) {
                        item.City.should.eql(person.City);
                    });
                });
            });

            it('should return all items grouped by state', function testGroupJoinWithDefinedEqualityComparer() {
                var groupJoinIterable = groupJoin(gen(uniqueStates), gen(testData.dataSource.data), primitiveSelector, stateSelector, stateProjector, factoryFn, stateComparer),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(uniqueStates.length);
                groupJoinRes.forEach(function _validateEntries(item) {
                    item.should.have.keys('State', 'People');
                    item.People.data.forEach(function _ensurePeopleLiveInState(person) {
                        item.State.should.eql(person.State);
                    });
                });
            });

            it('should prevent all matches when comparer is not comparing like values', function testGroupJoinWithIncorrectComparer() {
                function badComparer(a, b) {
                    return a === b.Zip;
                }

                var groupJoinIterable = groupJoin(gen(uniqueCities), gen(testData.dataSource.data), primitiveSelector, citySelector, cityProjector, factoryFn, badComparer),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(uniqueCities.length);
                groupJoinRes.forEach(function _ensurePeopleLiveInCities(item) {
                    item.should.have.keys('City', 'People');
                    item.People.data.should.have.lengthOf(0);
                });
            });

            it('should return items that have no inner matches', function testGroupJoinWithNoInnerMatches() {
                var groupJoinIterable = groupJoin(gen(uniqueStates), gen([]), primitiveSelector, stateSelector, stateProjector, factoryFn, stateComparer),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(uniqueStates.length);
                groupJoinRes.forEach(function _validateEntries(item) {
                    item.should.have.keys('State', 'People');
                    item.People.data.should.have.lengthOf(0);
                });
            });

            it('should return empty array when source is empty', function testGroupJoinWithEmptySource() {
                var groupJoinIterable = groupJoin(gen([]), gen(testData.dataSource.data), primitiveSelector, stateSelector, stateProjector, factoryFn, stateComparer),
                    groupJoinRes = Array.from(groupJoinIterable());

                groupJoinRes.should.have.lengthOf(0);
            });
        });
    });

    describe('Test intersect...', function testIntersect() {
        function comparer(a, b) { return a.FirstName === b.FirstName; }

        var firstHalf = testData.dataSource.data.slice(0, testData.dataSource.data.length / 2),
            evenIdxs = testData.dataSource.data.filter(function _getEvenIndexedItems(item, idx) { return idx % 2; }),
            oddIdxs = testData.dataSource.data.filter(function _getOddIndexedItems(item, idx) { return !(idx % 2); });

        describe('... using default equality comparer', function testIntersectWithDefaultEqualityComparer() {
            it('should return source with collection equals source', function testIntersectWithSelf() {
                var intersectIterable = intersect(testData.dataSource.data, testData.dataSource.data),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(testData.dataSource.data.length);
                intersectRes.should.eql(testData.dataSource.data);
            });

            it('should return empty array when second parameter is empty', function testIntersectWithEmptySecondParameter() {
                var intersectIterable = intersect(testData.dataSource.data, []),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(0);
            });

            it('should return empty array when first parameter is empty', function testIntersectWithEmptyFirstParameter() {
                var intersectIterable = intersect([], testData.dataSource.data),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(0);
            });

            it('should return first half of testData.dataSource.data when intersected with first half', function testIntersectWithHalfData() {
                var intersectIterable = intersect(testData.dataSource.data, firstHalf),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(testData.dataSource.data.length / 2);
                intersectRes.should.eql(firstHalf);
            });

            it('should return even indexed items when intersected with those items', function testIntersectWithOnlyEvenIndexedItems() {
                var intersectIterable = intersect(testData.dataSource.data, evenIdxs),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(testData.dataSource.data.length / 2);
                intersectRes.should.eql(evenIdxs);
            });

            it('should return odd indexed items when intersected with those items', function testIntersectWithOnlyOddIndexedItems() {
                var intersectIterable = intersect(testData.dataSource.data, oddIdxs),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(testData.dataSource.data.length / 2);
                intersectRes.should.eql(oddIdxs);
            });

            it('should return no items when collections do not overlap', function testIntersectWithNonOverlappingCollections() {
                var intersectIterable = intersect(oddIdxs, evenIdxs),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(0);
            });
        });

        describe('... using defined equality comparer', function testIntersectWithDefinedEqualityComparer() {
            it('should return source items with unique first names when collection equals source', function testIntersectWithSelf() {
                var intersectIterable = intersect(testData.dataSource.data, testData.dataSource.data, comparer),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(testData.dataSource.data.length);
                intersectRes.should.eql(testData.dataSource.data);
            });

            it('should return empty array when second parameter is empty', function testIntersectWithEmptySecondParameter() {
                var intersectIterable = intersect(testData.dataSource.data, [], comparer),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(0);
            });

            it('should return empty array when first parameter is empty', function testIntersectWithEmptyFirstParameter() {
                var intersectIterable = intersect([], testData.dataSource.data, comparer),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(0);
            });

            it('should return first half of source with unique names when intersected with first half of source', function testIntersectWithFirstHalfOfSource() {
                var intersectIterable = intersect(testData.dataSource.data, firstHalf, comparer),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(testData.dataSource.data.length);
                intersectRes.should.eql(testData.dataSource.data);
            });

            it('should return even indexed items with unique names when intersected with even indexed items', function testIntersectWithEvenIndexedItems() {
                var intersectIterable = intersect(testData.dataSource.data, evenIdxs, function _comparer(a, b) { return a === b; }),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(testData.dataSource.data.length / 2);
                intersectRes.forEach(function checkForMatchingFirstNames(item, idx) {
                    item.FirstName.should.eql(evenIdxs[idx].FirstName);
                });
            });

            it('should return odd indexed items with unique names when intersected with odd indexed items', function testIntersectWithOddIndexedItems() {
                var intersectIterable = intersect(testData.dataSource.data, oddIdxs, function _comparer(a, b) { return a === b; }),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(testData.dataSource.data.length / 2);
                intersectRes.forEach(function checkForMatchingFirstNames(item, idx) {
                    item.FirstName.should.eql(oddIdxs[idx].FirstName);
                });
            });

            it('should return a single item when collections because of shared .FirstName property', function testIntersectWithNonOverlappingCollections() {
                var intersectIterable = intersect(oddIdxs, evenIdxs, function _comparer(a, b) { return a === b; }),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(0);
            });
        });

        describe('... using generator as a parameter', function testWithParametersAsGenerators() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            it('should return source when collection evaluates to the source', function testIntersectWithSecondParameterAsGenerator() {
                var intersectIterable = intersect(testData.dataSource.data, gen(testData.dataSource.data)),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(testData.dataSource.data.length);
                intersectRes.should.eql(testData.dataSource.data);
            });

            it('should return testData.dataSource.data when source evaluates to the same', function testIntersectWithFirstParameterAsGenerator() {
                var intersectIterable = intersect(gen(testData.dataSource.data), testData.dataSource.data),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(testData.dataSource.data.length);
                intersectRes.should.eql(testData.dataSource.data);
            });

            it('should return source when both parameters are generators', function testIntersectWithBothParametersAsGenerators() {
                var intersectIterable = intersect(gen(testData.dataSource.data), gen(testData.dataSource.data)),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(testData.dataSource.data.length);
                intersectRes.should.eql(testData.dataSource.data);
            });

            it('should function correctly with generators and a non-default comparer', function testIntersectWithGeneratorsAndComparer() {
                var intersectIterable = intersect(gen(testData.dataSource.data), gen(testData.dataSource.data), comparer),
                    intersectRes = Array.from(intersectIterable());

                intersectRes.should.have.lengthOf(testData.dataSource.data.length);
                intersectRes.should.eql(testData.dataSource.data);
            });
        });
    });

    describe('Test intersperse', function _testIntersperse() {
        it('should should return an empty array when given an empty iterator', function _testReturnsEmptyArray() {
            var intersperseIterable = intersperse([], 2),
                intersperseRes = Array.from(intersperseIterable());

            intersperseRes.should.be.an('array');
            intersperseRes.should.have.lengthOf(0);
        });

        it('should intersperse a value within an array', function _testIntersperseWithAnArray() {
            var intersperseIterable = intersperse([1, 2, 3, 4, 5], 0),
                intersperseRes = Array.from(intersperseIterable());

            intersperseRes.should.be.an('array');
            intersperseRes.should.have.lengthOf(9);
            intersperseRes.should.eql([1, 0, 2, 0, 3, 0, 4, 0, 5]);
        });

        it('should intersperse a value within a generator', function _testIntersperseWithAGenerator() {
            function *gen() {
                var i = 1;
                while (6 > i) {
                    yield i;
                    i++;
                }
            }

            var intersperseIterable = intersperse(gen(), 0),
                intersperseRes = Array.from(intersperseIterable());

            intersperseRes.should.be.an('array');
            intersperseRes.should.have.lengthOf(9);
            intersperseRes.should.eql([1, 0, 2, 0, 3, 0, 4, 0, 5]);
        });
    });

    describe('Test listJoin...', function testJoin() {
        var joinTestData = new Array(54).fill(1).map(function _mapTestData(item, idx) {
            return item * idx * idx;
        });

        var duplicateFirstNames = Array.prototype.concat.apply([], testData.dataSource.data.map(function _findDupes(item) {
            return Array.prototype.concat.apply([], testData.dataSource.data.filter(function _innerDupes(it) {
                return item.FirstName === it.FirstName;
            }));
        }));

        var duplicateFullNames = Array.prototype.concat.apply([], testData.dataSource.data.map(function _findDupes(item) {
            return Array.prototype.concat.apply([], testData.dataSource.data.filter(function _innerDupes(it) {
                return item.FirstName === it.FirstName && item.LastName === it.LastName;
            }));
        }));

        var duplicateLocations = Array.prototype.concat.apply([], testData.dataSource.data.map(function _findDupes(item) {
            return Array.prototype.concat.apply([], testData.dataSource.data.filter(function _innerDupes(it) {
                return item.City === it.City && item.State === it.State;
            }));
        }));

        function comparer(a, b) {
            return a.FirstName === b.FirstName;
        }

        function comparer2(a, b) {
            return a.FirstName === b.FirstName && a.LastName === b.LastName;
        }

        function comparer3(a, b) {
            return a.City === b.City && a.State == b.State;
        }

        function comparer4(a, b) {
            return a.FirstName === b;
        }

        function selector(item) {
            return item.FirstName;
        }

        function selector2(item) {
            return `${ item.FirstName } ${ item.LastName }`;
        }

        function selector3(item) {
            return {
                FirstName: item.FirstName,
                LastName: item.LastName
            };
        }

        function selector4(item) {
            return {
                City: item.City,
                State: item.State
            };
        }

        function selector5(item) {
            return { FirstName: item.FirstName };
        }

        function projector(a, b) {
            return {
                outerFirstName: a.FirstName,
                innerFirstName: b.FirstName
            }
        }

        function projector2(a, b) {
            return {
                sourceName: `${ a.FirstName } ${ a.LastName }`,
                otherName: `${ b.FirstName } ${ b.LastName }`
            };
        }

        function identity(item) {
            return item;
        }

        describe('...using default equality comparer', function testJoinWithArrays() {
            it('should return all test data items that share the same name', function testJoinOnFirstName() {
                var joinIterable = join(testData.dataSource.data, testData.dataSource.data, selector, selector, projector),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(duplicateFirstNames.length);
                joinRes.forEach(function _validateResults(item) {
                    item.outerFirstName.should.eql(item.innerFirstName);
                });
            });

            it('should return empty array when no matches are found', function testJoinWithNoMatches() {
                var joinIterable = join(testData.dataSource.data, joinTestData, selector, identity, projector),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(0);
            });

            it('should return empty array when second collection is empty', function testJoinWithNoMatches() {
                var joinIterable = join(testData.dataSource.data, [], selector, identity, projector),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(0);
            });

            it('should return empty array when source is empty', function testJoinWithEmptySource() {
                var joinIterable = join([], testData.dataSource.data, selector, identity, projector),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(0);
            });

            it('should return all test data items that share the same state and city', function testJoinWithSelector2() {
                var joinIterable = join(testData.dataSource.data, testData.dataSource.data, selector2, selector2, projector2),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(duplicateFullNames.length);
                joinRes.forEach(function _validateResults(item) {
                    item.should.have.keys('sourceName', 'otherName');
                    item.sourceName.should.eql(item.otherName);
                });
            });
        });

        describe('...using defined equality comparer', function testJoinWithDefinedEqualityComparer() {
            it('should return all test data items that share the same name', function testJoinOnFirstName() {
                var joinIterable = join(testData.dataSource.data, testData.dataSource.data, selector5, selector5, projector, comparer),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(duplicateFirstNames.length);
                joinRes.forEach(function _validateResults(item) {
                    if (item.outerFirstName !== item.innerFirstName) {
                        console.log(item);
                    }
                    item.outerFirstName.should.eql(item.innerFirstName);
                });
            });

            it('should return empty array when no matches are found', function testJoinWithNoMatches() {
                var joinIterable = join(testData.dataSource.data, joinTestData, selector5, identity, projector, comparer4),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(0);
            });

            it('should return empty array when second collection is empty', function testJoinWithNoMatches() {
                var joinIterable = join(testData.dataSource.data, [], selector5, identity, projector, comparer4),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(0);
            });

            it('should return empty array when source is empty', function testJoinWithEmptySource() {
                var joinIterable = join([], testData.dataSource.data, selector2, identity, projector, comparer),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(0);
            });

            it('should return all test data items that share the same state and city', function testJoinWithSelector2() {
                var joinIterable = join(testData.dataSource.data, testData.dataSource.data, selector4, selector4, projector2, comparer3),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(duplicateLocations.length);
                joinRes.forEach(function _validateResults(item) {
                    item.should.have.keys('sourceName', 'otherName');
                });
            });
        });

        describe('...using generators', function testJoinUsingGenerators() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            it('should return all test data items that share the same name', function testJoinOnFirstNameWithGenerators() {
                var joinIterable = join(gen(testData.dataSource.data), gen(testData.dataSource.data), selector, selector, projector),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(duplicateFirstNames.length);
                joinRes.forEach(function _validateResults(item) {
                    item.outerFirstName.should.eql(item.innerFirstName);
                });
            });

            it('should return empty array when no matches are found', function testJoinWithNoMatches() {
                var joinIterable = join(gen(testData.dataSource.data), gen(joinTestData), selector, identity, projector),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(0);
            });

            it('should return empty array when second collection is empty', function testJoinWithNoMatches() {
                var joinIterable = join(gen(testData.dataSource.data), gen([]), selector, identity, projector),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(0);
            });

            it('should return empty array when source is empty', function testJoinWithEmptySource() {
                var joinIterable = join(gen([]), gen(testData.dataSource.data), selector, identity, projector),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(0);
            });

            it('should return all test data items that share the same state and city', function testJoinWithSelector2() {
                var joinIterable = join(gen(testData.dataSource.data), gen(testData.dataSource.data), selector2, selector2, projector2),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(duplicateFullNames.length);
                joinRes.forEach(function _validateResults(item) {
                    item.should.have.keys('sourceName', 'otherName');
                    item.sourceName.should.eql(item.otherName);
                });
            });

            it('should return empty array when source is empty', function testJoinWithEmptySource() {
                var joinIterable = join(gen([]), gen(testData.dataSource.data), selector2, identity, projector, comparer),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(0);
            });

            it('should return all test data items that share the same state and city', function testJoinWithSelector2() {
                var joinIterable = join(gen(testData.dataSource.data), gen(testData.dataSource.data), selector4, selector4, projector2, comparer3),
                    joinRes = Array.from(joinIterable());

                joinRes.should.have.lengthOf(duplicateLocations.length);
                joinRes.forEach(function _validateResults(item) {
                    item.should.have.keys('sourceName', 'otherName');
                });
            });
        });
    });

    describe('Test union...', function testUnion() {
        function comparer(a, b) { return a.FirstName === b.FirstName; }

        var viewed = [];

        var uniqueFirstNames = testData.dataSource.data.filter(function findUniqueNames(item) {
            if (!viewed.some(function _findDupe(it) {
                    return item.FirstName === it.FirstName;
                }))
            {
                viewed[viewed.length] = item;
                return true;
            }
            return false;
        });

        describe('... using default equality comparer', function testWithDefaultEqualityComparer() {
            it('should return source collection when unioned with itself', function unionWithSelf() {
                var unionIterable = union(testData.dataSource.data, testData.dataSource.data),
                    unionRes = Array.from(unionIterable());

                unionRes.should.have.lengthOf(testData.dataSource.data.length);
                unionRes.should.eql(testData.dataSource.data);
            });

            it('should return source when unioned with empty collection', function testWithEmptyCollection() {
                var unionIterable = union(testData.dataSource.data, []),
                    unionRes = Array.from(unionIterable());

                unionRes.should.have.lengthOf(testData.dataSource.data.length);
                unionRes.should.eql(testData.dataSource.data);
            });

            it('should return collection when source is empty array', function testWithEmptySource() {
                var unionIterable = union([], testData.dataSource.data),
                    unionRes = Array.from(unionIterable());

                unionRes.should.have.lengthOf(testData.dataSource.data.length);
                unionRes.should.eql(testData.dataSource.data);
            });

            it('should return empty array when both sources are empty', function testWithEmptyArrays() {
                var unionIterable = union([], []),
                    unionRes = Array.from(unionIterable());

                unionRes.should.have.lengthOf(0);
            });
        });

        describe('... using defined equality comparer', function testWithDefinedEqualityComparer() {
            it('should return source less matching items when unioned with empty collection', function testWithEmptyCollection() {
                var unionIterable = union(testData.dataSource.data, [], comparer),
                    unionRes = Array.from(unionIterable());

                unionRes.should.have.lengthOf(uniqueFirstNames.length);
                unionRes.should.eql(uniqueFirstNames);
            });

            it('should return collection less matching items when source is empty', function testWithEmptySource() {
                var unionIterable = union([], testData.dataSource.data, comparer),
                    unionRes = Array.from(unionIterable());

                unionRes.should.have.lengthOf(uniqueFirstNames.length);
                unionRes.should.eql(uniqueFirstNames);
            });

            it('should return empty array when both sources are empty', function testWithEmptyArrays() {
                var unionIterable = union([], [], comparer),
                    unionRes = Array.from(unionIterable());

                unionRes.should.have.lengthOf(0);
            });
        });

        describe('... using generator as a parameter', function testWithParametersAsGenerators() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            it('should return testData.dataSource.data when generator is first parameter', function testWithFirstParameterAGenerator() {
                var unionIterable = union(gen(testData.dataSource.data), []),
                    unionRes = Array.from(unionIterable());

                unionRes.should.have.lengthOf(testData.dataSource.data.length);
                unionRes.should.eql(testData.dataSource.data);
            });

            it('should return testData.dataSource.data when generator is second parameter', function testWithSecondParameterAGenerator() {
                var unionIterable = union([], gen(testData.dataSource.data)),
                    unionRes = Array.from(unionIterable());

                unionRes.should.have.lengthOf(testData.dataSource.data.length);
                unionRes.should.eql(testData.dataSource.data);
            });

            it('should return source when both parameters are generators', function testWithBothParametersGenerators() {
                var unionIterable = union(gen(testData.dataSource.data), gen(testData.dataSource.data)),
                    unionRes = Array.from(unionIterable());

                unionRes.should.have.lengthOf(testData.dataSource.data.length);
                unionRes.should.eql(testData.dataSource.data);
            });

            it('should work with generators and non-default comparators', function testGeneratorsWithNonDefaultComparator() {
                var unionIterable1 = union(gen(testData.dataSource.data), testData.dataSource.data, comparer),
                    unionIterable2 = union(testData.dataSource.data, gen(testData.dataSource.data), comparer),
                    unionRes1 = Array.from(unionIterable1()),
                    unionRes2 = Array.from(unionIterable2());

                unionRes1.should.have.lengthOf(uniqueFirstNames.length);
                unionRes1.should.eql(uniqueFirstNames);
                unionRes2.should.have.lengthOf(uniqueFirstNames.length);
                unionRes2.should.eql(uniqueFirstNames);
            });
        });
    });

    describe('Test zip...', function testZip() {
        function zipSelector(a, b) {
            return { source: a, collection: b };
        }

        var zipTestData = testData.dataSource.data.map(function _mapTestData(item, idx) {
            return idx * idx;
        });

        var zipTestData2 = zipTestData.concat(zipTestData);

        describe('... using arrays', function testZipWithArrays() {
            it('should return full count of source when collection is same count', function testZipWithEqualLengthArray() {
                var zipIterable = zip(testData.dataSource.data, zipTestData, zipSelector),
                    zipRes = Array.from(zipIterable());

                zipRes.should.have.lengthOf(testData.dataSource.data.length);
                zipRes.forEach(function _testEachIdx(item, idx) {
                    item.source.should.eql(testData.dataSource.data[idx]);
                    item.collection.should.eql(zipTestData[idx]);
                });
            });

            it('should return empty array when collection is empty', function testZipWithEmptyCollection() {
                var zipIterable = zip(testData.dataSource.data, [], zipSelector),
                    zipRes = Array.from(zipIterable());

                zipRes.should.have.lengthOf(0);
            });

            it('should return empty array when source is empty', function testZipWithEmptySource() {
                var zipIterable = zip([], testData.dataSource.data, zipSelector),
                    zipRes = Array.from(zipIterable());

                zipRes.should.have.lengthOf(0);
            });

            it('should not return more items than the source has', function testZipWithCollectionLargerThanSource() {
                var zipIterable = zip(testData.dataSource.data, zipTestData2, zipSelector),
                    zipRes = Array.from(zipIterable());

                zipRes.should.have.lengthOf(testData.dataSource.data.length);
                zipRes.forEach(function _testEachIdx(item, idx) {
                    item.source.should.eql(testData.dataSource.data[idx]);
                    item.collection.should.eql(zipTestData[idx]);
                });
            });
        });

        describe('... using generators', function testZipWithGenerators() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            it('should return full count of source when collection is the same count', function testZipWithGeneratorContainingSameAmount() {
                var zipIterable = zip(testData.dataSource.data, gen(zipTestData), zipSelector),
                    zipRes = Array.from(zipIterable());

                zipRes.should.have.lengthOf(testData.dataSource.data.length);
                zipRes.forEach(function _testEachIdx(item, idx) {
                    item.source.should.eql(testData.dataSource.data[idx]);
                    item.collection.should.eql(zipTestData[idx]);
                });
            });

            it('should return empty array when generator is empty', function testZipWithEmptyCollection() {
                var zipIterable = zip(testData.dataSource.data, gen([]), zipSelector),
                    zipRes = Array.from(zipIterable());

                zipRes.should.have.lengthOf(0);
            });

            it('should return empty array when source is empty', function testZipWithEmptySource() {
                var zipIterable = zip([], gen(testData.dataSource.data), zipSelector),
                    zipRes = Array.from(zipIterable());

                zipRes.should.have.lengthOf(0);
            });

            it('should return full source count when both params are generators and have data', function testZipWithEmptyCollection() {
                var zipIterable = zip(gen(testData.dataSource.data), gen(testData.dataSource.data), zipSelector),
                    zipRes = Array.from(zipIterable());

                zipRes.should.have.lengthOf(testData.dataSource.data.length);
            });

            it('should return empty array when collection is empty', function testZipWithEmptyCollection() {
                var zipIterable = zip(gen(testData.dataSource.data), gen([]), zipSelector),
                    zipRes = Array.from(zipIterable());

                zipRes.should.have.lengthOf(0);
            });

            it('should return empty array when source is empty', function testZipWithEmptySource() {
                var zipIterable = zip(gen([]), gen(testData.dataSource.data), zipSelector),
                    zipRes = Array.from(zipIterable());

                zipRes.should.have.lengthOf(0);
            });
        });
    });

    describe('Test all', function testAll() {
        function isObject(item) {
            return 'object' === typeof item;
        }

        it('should return false when no predicate is supplied', function testAllWithNoPredicate() {
            all(testData.dataSource.data).should.be.false;
        });

        it('should return true when predicate is supplied and data passes', function testAllWithAllDataPassingPredicate() {
            all(testData.dataSource.data, isObject).should.be.true;
        });

        it('should return false when a single item passes predicate', function testAllWithSingleItemPassing() {
            var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, { a: 1 }];
            all(data, isObject).should.not.be.true;
        });

        it('should work with generators', function testAllWithGenerators() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            all(gen([])).should.not.be.true;
            all(gen(testData.dataSource.data)).should.be.false;
            all(gen(testData.dataSource.data), isObject).should.be.true;
            all(gen([1, 2, 3, 4, 5, 6, 7, 8, 9]), isObject).should.not.be.true;
        });
    });

    describe('Test any', function testAny() {
        function isObject(item) {
            return 'object' === typeof item;
        }

        it('should return true when no predicate is supplied and data exists', function testAnyWithDataAndNoPredicate() {
            any(testData.dataSource.data).should.be.true;
        });

        it('should return false when no predicate is supplied and no data exists', function testAnyWithNoDataAndNoPredicate() {
            any([]).should.not.be.true;
        });

        it('should return true when a single item passes predicate', function testAnyWithSingleItemPassing() {
            var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, { a: 1 }];
            any(data, isObject).should.be.true;
        });

        it('should return false if no items pass test', function testAnyWithNoItemsPassing() {
            any([1, 2, 3, 4, 5, 6, 7, 8, 9], isObject).should.not.be.true;
        });

        it('should work with generators', function testAnyWithGenerators() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            any(gen([])).should.not.be.true;
            any(gen(testData.dataSource.data)).should.be.true;
            any(gen(testData.dataSource.data), isObject).should.be.true;
            any(gen([1, 2, 3, 4, 5, 6, 7, 8, 9]), isObject).should.not.be.true;
        });
    });

    describe('Test contains', function testContains() {
        it('should return true when the first object of test data is used as value', function testContainsWithObjectFromTestData() {
            var containsRes = contains(testData.dataSource.data, testData.dataSource.data[0]);
            containsRes.should.be.true;
        });

        it('should return false when the first object of test data is cloned and passed as value', function testContainsWithClonedTestDataObject() {
            var obj = {};
            Object.keys(testData.dataSource.data[0]).forEach(function addKeys(key) {
                obj[key] = testData.dataSource.data[0][key];
            });
            var containsRes = contains(testData.dataSource.data, obj);
            containsRes.should.be.false;
        });

        it('should return true when examining primitives with no comparer', function testContainsWithPrimitiveAndNoComparer() {
            var containsRes = contains([1, 2, 3, 4, 5], 3);
            containsRes.should.be.true;
        });

        it('should return true when the first object of test data is cloned and a compare is given', function testContainsWithClonedTestDataObjectAndComparer() {
            var obj = {};
            Object.keys(testData.dataSource.data[0]).forEach(function addKeys(key) {
                obj[key] = testData.dataSource.data[0][key];
            });
            var containsRes = contains(testData.dataSource.data, obj, function _comparer(a, b) { return a.FirstName === b.FirstName; });
            containsRes.should.be.true;
        });
    });

    describe('Test count', function testLength() {
        var markFirstNameCount = testData.dataSource.data.filter(function _filterNames(item) {
            return 'Mark' === item.FirstName;
        }).length;

        it('should return the count of test data', function testCountUsingTestData() {
            var countRes = count(testData.dataSource.data);
            countRes.should.eql(testData.dataSource.data.length);
        });

        it('should return the count of a generator\'s data', function testCountUsingAGenerator() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            var countRes = count(gen(testData.dataSource.data));
            countRes.should.eql(testData.dataSource.data.length);
        });

        it('should return the count of item whose FirstName is Mark', function testCountUsingPredicate() {
            function predicate(item) { return 'Mark' === item.FirstName; }
            var countRes = count(testData.dataSource.data, predicate);
            countRes.should.eql(markFirstNameCount);
        });
    });

    describe('Test first', function testFirst() {
        function predicate() { return false; }

        it('should return first item from source when no predicate is passed', function testFirstWithNoPredicate() {
            var firstRes = first(testData.dataSource.data);
            firstRes.should.be.an('object');
            firstRes.should.eql(testData.dataSource.data[0]);
        });

        it('should return undefined when empty source is supplied', function testFirstWithEmptySource() {
            var firstRes = first([]);
            expect(firstRes).to.be.undefined;
        });

        it('should return undefined if no item passes predicate', function testFirstWithNonPassablePredicate() {
            var firstRes = first(testData.dataSource.data, predicate);
            expect(firstRes).to.be.undefined;
        });

        it('should work with generators', function testFirstWithGenerators() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            var firstRes1 = first(gen(testData.dataSource.data)),
                firstRes2 = first(gen([])),
                firstRes3 = first(gen(testData.dataSource.data), predicate);

            firstRes1.should.be.an('object');
            firstRes1.should.eql(testData.dataSource.data[0]);
            expect(firstRes2).to.be.undefined;
            expect(firstRes3).to.be.undefined;
        });
    });

    describe('Test fold', function testFold() {
        it('should return sum of values', function testFoldWithAddition() {
            var arr = [1, 2, 3, 4, 5];
            var foldRes = foldLeft(arr, function _fold(val, cur) { return cur + val; }, 0);
            foldRes.should.eql(15);
        });

        it('should return product of values', function testFoldWithMultiplication() {
            var arr = [1, 2, 3, 4, 5];
            var foldRes = foldLeft(arr, function _fold(val, cur) { return cur * val; }, 1);
            foldRes.should.eql(120);
        });

        it('should default initial to zero', function testFoldWithNoInitialValue() {
            var arr = [1, 2, 3, 4, 5];
            var foldRes = foldLeft(arr, function _fold(val, cur) { return cur * val; });
            foldRes.should.eql(0);
        });
    });

    describe('Test last', function testLast() {
        function predicate() { return false; }

        it('should return last item from source when no predicate is passed', function testLastWithNoPredicate() {
            var lastRes = last(testData.dataSource.data);
            lastRes.should.be.an('object');
            lastRes.should.eql(testData.dataSource.data[testData.dataSource.data.length - 1]);
        });

        it('should return undefined when empty source is supplied', function testLastWithEmptySource() {
            var firstRes = last([]);
            expect(firstRes).to.be.undefined;
        });

        it('should return undefined if no item passes predicate', function testLastWithNonPassablePredicate() {
            var firstRes = last(testData.dataSource.data, predicate);
            expect(firstRes).to.be.undefined;
        });

        it('should work with generators', function testLastWithGenerators() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            var firstRes1 = last(gen(testData.dataSource.data)),
                firstRes2 = last(gen([])),
                firstRes3 = last(gen(testData.dataSource.data), predicate);

            firstRes1.should.be.an('object');
            firstRes1.should.eql(testData.dataSource.data[testData.dataSource.data.length - 1]);
            expect(firstRes2).to.be.undefined;
            expect(firstRes3).to.be.undefined;
        });
    });

    describe('Test distinct...', function testDistinct() {
        var distinctNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            repeatedNumbers = distinctNumbers.map(function _numberRepeater(num) {
                if (num % 2) return num;
                return num + 1;
            });

        function nameComparer(a, b) {
            return `${ a.FirstName } ${ a.LastName }` === `${ b.FirstName } ${ b.LastName }`;
        }

        function mechanicComparer(a, b) {
            return a.drillDownData.some(function sameMechanicAndCar(item) {
                return item.MechanicName === b.drillDownData[0].MechanicName && item.Make === b.drillDownData[0].Make
                    && item.Model === b.drillDownData[0].Model && item.Year === b.drillDownData[0].Year;
            });
        }

        describe('...using default comparer', function testDistinctWithDefaultComparer() {
            it('should return all when comparing by reference on test data', function testForDistinctness() {
                var distinctIterable = distinct(testData.dataSource.data),
                    distinctRes = Array.from(distinctIterable());

                distinctRes.should.have.lengthOf(testData.dataSource.data.length);
                distinctRes.should.eql(testData.dataSource.data);
            });

            it('should return all distinct primitive values', function testDistinctWithUniquePrimitiveValues() {
                var distinctIterable = distinct(distinctNumbers),
                    distinctRes = Array.from(distinctIterable());

                distinctRes.should.have.lengthOf(distinctNumbers.length);
                distinctRes.should.eql(distinctNumbers);
            });

            it('should return half the count of repeated numbers', function testDistinctWithRepeatedPrimitives() {
                var distinctIterable = distinct(repeatedNumbers),
                    distinctRes = Array.from(distinctIterable());

                distinctRes.should.have.lengthOf(repeatedNumbers.length / 2);
                distinctRes.should.eql([1, 3, 5, 7, 9]);
            });
        });

        describe('...using defined comparer', function testDistinctWithDefinedComparer() {
            it('should return items with distinct full names', function testDistinctFullNames() {
                var distinctIterable = distinct(testData.dataSource.data, nameComparer),
                    distinctRes = Array.from(distinctIterable());

                var viewedNames = [];
                distinctRes.forEach(function _checkDistinctness(item) {
                    viewedNames.should.not.include(item.FirstName + ' ' + item.LastName);
                    viewedNames.push(item.FirstName + ' ' + item.LastName);
                });
            });

            it('should return items with unique mechanics and cars', function testDistinctMechanicsAndCars() {
                var distinctIterable = distinct(testData.dataSource.data, mechanicComparer),
                    distinctRes = Array.from(distinctIterable());

                var viewedMechanics = [];
                distinctRes.forEach(function _checkDistinctness(item) {
                    expect(viewedMechanics.every(function checkEveryMechanic(it) {
                        return it.MechanicName !== item.drillDownData[0].MechanicName || it.Make !== item.drillDownData[0].Make
                            || it.Model !== item.drillDownData[0].Model || it.Year !== item.drillDownData[0].Year;
                    })).to.be.true;
                    viewedMechanics = viewedMechanics.concat(item.drillDownData);
                });
            });
        });

        describe('...using generators', function testDistinctWithGenerators() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            it('should return all when comparing by reference on test data', function testForDistinctness() {
                var distinctIterable = distinct(gen(testData.dataSource.data)),
                    distinctRes = Array.from(distinctIterable());

                distinctRes.should.have.lengthOf(testData.dataSource.data.length);
                distinctRes.should.eql(testData.dataSource.data);
            });

            it('should return all distinct primitive values', function testDistinctWithUniquePrimitiveValues() {
                var distinctIterable = distinct(gen(distinctNumbers)),
                    distinctRes = Array.from(distinctIterable());

                distinctRes.should.have.lengthOf(distinctNumbers.length);
                distinctRes.should.eql(distinctNumbers);
            });

            it('should return half the count of repeated numbers', function testDistinctWithRepeatedPrimitives() {
                var distinctIterable = distinct(gen(repeatedNumbers)),
                    distinctRes = Array.from(distinctIterable());

                distinctRes.should.have.lengthOf(repeatedNumbers.length / 2);
                distinctRes.should.eql([1, 3, 5, 7, 9]);
            });

            it('should return items with distinct full names', function testDistinctFullNames() {
                var distinctIterable = distinct(gen(testData.dataSource.data), nameComparer),
                    distinctRes = Array.from(distinctIterable());

                var viewedNames = [];
                distinctRes.forEach(function _checkDistinctness(item) {
                    viewedNames.should.not.include(item.FirstName + ' ' + item.LastName);
                    viewedNames.push(item.FirstName + ' ' + item.LastName);
                });
            });

            it('should return items with unique mechanics and cars', function testDistinctMechanicsAndCars() {
                var distinctIterable = distinct(gen(testData.dataSource.data), mechanicComparer),
                    distinctRes = Array.from(distinctIterable());

                var viewedMechanics = [];
                distinctRes.forEach(function _checkDistinctness(item) {
                    expect(viewedMechanics.every(function checkEveryMechanic(it) {
                        return it.MechanicName !== item.drillDownData[0].MechanicName || it.Make !== item.drillDownData[0].Make
                            || it.Model !== item.drillDownData[0].Model || it.Year !== item.drillDownData[0].Year;
                    })).to.be.true;
                    viewedMechanics = viewedMechanics.concat(item.drillDownData);
                });
            });
        });
    });

    describe('Test ofType', function testOfType() {
        function typeTest() {}
        var obj = {};

        var typeTestData = [typeTest, Object.create(obj), 'string', 12345, false, Symbol(), null, undefined];

        it('should return all test data items when filtered by object', function testOfTypeWithObject() {
            var ofTypeIterable = ofType(testData.dataSource.data, typeNames.object),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(testData.dataSource.data.length);
            ofTypeRes.should.eql(testData.dataSource.data);
        });

        it('should return all test data items when filtered by specified object', function testOfTypeWithSpecifiedObject() {
            var objType = {
                FirstName: '',
                LastName: '',
                Phone: '',
                Email: '',
                Address: '',
                City: '',
                State: '',
                Zip: '',
                drillDownData: []
            };
            var ofTypeIterable = ofType(testData.dataSource.data, objType),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(testData.dataSource.data.length);
            ofTypeRes.should.eql(testData.dataSource.data);
        });

        it('should return nothing when asked for function types', function testOfTypeWithFunctions() {
            var ofTypeIterable = ofType(testData.dataSource.data, typeNames.function),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(0);
        });

        it('should return nothing when asked for number types', function testOfTypeWithNumbers() {
            var ofTypeIterable = ofType(testData.dataSource.data, typeNames.number),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(0);
        });

        it('should return nothing when asked for string types', function testOfTypeWithStrings() {
            var ofTypeIterable = ofType(testData.dataSource.data, typeNames.string),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(0);
        });

        it('should return nothing when asked for boolean types', function testOfTypeWithBooleans() {
            var ofTypeIterable = ofType(testData.dataSource.data, typeNames.boolean),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(0);
        });

        it('should return nothing when asked for symbol types', function testOfTypeWithSymbols() {
            var ofTypeIterable = ofType(testData.dataSource.data, typeNames.symbol),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(0);
        });

        it('should return nothing when asked for null values', function testOfTypeWithNullValues() {
            var ofTypeIterable = ofType(testData.dataSource.data, null),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(0);
        });

        it('should return the object in typeTestData', function testOfTypeAgainstTypeTestDataWithObjects() {
            var ofTypeIterable = ofType(typeTestData, obj),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(1);
            expect(obj.isPrototypeOf(ofTypeRes[0])).to.be.true;
        });

        it('should return the function in typeTestData', function testOfTypeAgainstTypeTestDataWithFunctions() {
            var ofTypeIterable1 = ofType(typeTestData, typeNames.function),
                ofTypeIterable2 = ofType(typeTestData, typeTest),
                ofTypeRes1 = Array.from(ofTypeIterable1()),
                ofTypeRes2 = Array.from(ofTypeIterable2());

            ofTypeRes1.should.have.lengthOf(1);
            ofTypeRes2.should.have.lengthOf(1);
            ofTypeRes1.should.eql(ofTypeRes2);
            ofTypeRes2[0].should.eql(typeTest);
        });

        it('should return the null value in typeTestData', function testOfTypeAgainstTypeTestDataWithNullValue() {
            var ofTypeIterable = ofType(typeTestData, null),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(1);
            expect(ofTypeRes[0]).to.eql(null);
        });

        it('should return the boolean value in typeTestData', function testOfTypeAgainstTypeTestDataWithBooleanValue() {
            var ofTypeIterable = ofType(typeTestData, typeNames.boolean),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(1);
            expect(ofTypeRes[0]).to.be.false;
        });

        it('should return the undefined value in typeTestData', function testTypeOfAgainstTypeTestDataWithUndefinedValue() {
            var ofTypeIterable = ofType(typeTestData, typeNames.undefined),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(1);
            expect(ofTypeRes[0]).to.be.undefined;
        });

        it('should return the number in typeTestData', function testTypeOfAgainstTypeTestDataWithNumbers() {
            var ofTypeIterable = ofType(typeTestData, typeNames.number),
                ofTypeRes = Array.from(ofTypeIterable());

            ofTypeRes.should.have.lengthOf(1);
            ofTypeRes[0].should.eql(12345);
        });
    });

    describe('Test where...', function testWhere() {
        var markData = testData.dataSource.data.filter(function _filterFullName(item) {
            return 'Mark' === item.FirstName && 'Mosby' === item.LastName;
        });

        var newNewYorkData = testData.dataSource.data.filter(function _filterCity(item) {
            return 'New New York' === item.City;
        });

        var leelaAndNewYork = testData.dataSource.data.filter(function _leelaNewYorkFilter(item) {
            return 'Leela' === item.LastName && 'New New York' === item.City;
        });

        it('should return all items if predicate is always true', function testWhereWithAlwaysTruePredicate() {
            var whereIterable = filter(testData.dataSource.data, function _true() { return true; }),
                whereRes = Array.from(whereIterable());

            whereRes.should.have.lengthOf(testData.dataSource.data.length);
            whereRes.should.eql(testData.dataSource.data);
        });

        it('should return no items if predicate is always false', function testWhereWithAlwaysFalsePredicate() {
            var whereIterable = filter(testData.dataSource.data, function _false() { return false; }),
                whereRes = Array.from(whereIterable());

            whereRes.should.have.lengthOf(0);
        });

        it('should return all items with full name = Mark Mosby', function testWhereWithFullNamePredicate() {
            var whereIterable = filter(testData.dataSource.data, function _name(item) { return 'Mark' === item.FirstName && 'Mosby' === item.LastName; }),
                whereRes = Array.from(whereIterable());

            whereRes.should.have.lengthOf(markData.length);
            whereRes.should.eql(markData);
        });

        it('should return all items with city = New New York', function testWhereWithCityPredicate() {
            var whereIterable = filter(testData.dataSource.data, function _city(item) { return 'New New York' === item.City; }),
                whereRes = Array.from(whereIterable());

            whereRes.should.have.lengthOf(newNewYorkData.length);
            whereRes.should.eql(newNewYorkData);
        });

        it('should return empty array when source is empty', function testWhereWithEmptySource() {
            function *gen(data) {
                for (let item of data)
                    yield item;
            }

            var whereIterable1 = filter([], function _true() {  return true; }),
                whereIterable2 = filter(gen([]), function _true() { return true; }),
                whereRes1 = Array.from(whereIterable1()),
                whereRes2 = Array.from(whereIterable2());

            whereRes1.should.have.lengthOf(0);
            whereRes2.should.have.lengthOf(0);
        });

        it('should no items if predicate is checking property that does not exist', function testWhereWithNoPropPredicate() {
            var whereIterable = filter(testData.dataSource.data, function _noProp(item) { return 0 === item.Face; }),
                whereRes = Array.from(whereIterable());

            whereRes.should.have.lengthOf(0);
        });

        it('should return all items with last name = Leela and city = New New York', function testWhereWithTwoProps() {
            var whereIterable = filter(testData.dataSource.data, function _nameAndCity(item) { return 'Leela' === item.LastName && 'New New York' === item.City; }),
                whereRes = Array.from(whereIterable());

            whereRes.should.have.lengthOf(leelaAndNewYork.length);
            whereRes.should.eql(leelaAndNewYork);
        });
    });

    describe('Test groupBy...', function testGroupBy() {
        var previousFieldsValues = [];

        afterEach(function cleanPreviousFieldsArray() {
            previousFieldsValues = [];
        });

        function firstNameSelector(item) {
            return item.FirstName;
        }

        function stateSelector(item) {
            return item.State;
        }

        function lastNameSelector(item) {
            return item.LastName;
        }

        function sortComparer(x, y, dir) {
            var t = x > y ? 1 : x === y ? 0 : -1;
            return 2 === dir ? t : -t;
        }

        var uniqueStates = [],
            uniqueFirstNames = [],
            uniqueLastNames = [];

        testData.dataSource.data.forEach(function _findUniqueStates(item) {
            if (!uniqueStates.some(function findDupe(it) {
                    return it === item.State;
                }))
                uniqueStates.push(item.State);
        });

        testData.dataSource.data.forEach(function _findUniqueStates(item) {
            if (!uniqueFirstNames.some(function findDupe(it) {
                    return it === item.FirstName;
                }))
                uniqueFirstNames.push(item.FirstName);
        });

        testData.dataSource.data.forEach(function _findUniqueStates(item) {
            if (!uniqueLastNames.some(function findDupe(it) {
                    return it === item.LastName;
                }))
                uniqueLastNames.push(item.LastName);
        });

        var factoryFn = createListDelegateInstance;

        describe('...using arrays', function testGroupByUsingArrays() {
            it('should group test data by state descending', function testGroupByOnStateDescending() {
                var groupObj = [ { keySelector: stateSelector, comparer: sortComparer, direction: sortDirection.descending } ],
                    groupByIterable = groupBy(testData.dataSource.data, groupObj, factoryFn),
                    groupByRes = Array.from(groupByIterable());

                groupByRes.should.have.lengthOf(uniqueStates.length);
                groupByRes.forEach(function validateKeyOrder(item) {
                    if (!previousFieldsValues.length)
                        previousFieldsValues[0] = item.key;
                    else {
                        item.key.should.be.below(previousFieldsValues[0]);
                        previousFieldsValues[0] = item.key;
                    }
                });
            });

            it('should group test data by state ascending', function testGroupByOnStateAscending() {
                var groupObj = [ { keySelector: stateSelector, comparer: sortComparer, direction: sortDirection.ascending } ],
                    groupByIterable = groupBy(testData.dataSource.data, groupObj, factoryFn),
                    groupByRes = Array.from(groupByIterable());

                groupByRes.should.have.lengthOf(uniqueStates.length);
                groupByRes.forEach(function validateKeyOrder(item) {
                    if (!previousFieldsValues.length)
                        previousFieldsValues[0] = item.key;
                    else {
                        item.key.should.be.above(previousFieldsValues[0]);
                        previousFieldsValues[0] = item.key;
                    }
                });
            });

            it('should group on multiple fields', function testGroupByOnMultipleFields() {
                var groupObj = [
                    { keySelector: stateSelector, direction: sortDirection.ascending },
                    { keySelector: lastNameSelector, direction: sortDirection.descending },
                    { keySelector: firstNameSelector, direction: sortDirection.descending }
                ];
                var groupByIterable = groupBy(testData.dataSource.data, groupObj, factoryFn),
                    groupByRes = Array.from(groupByIterable());

                groupByRes.should.have.lengthOf(uniqueStates.length);
                groupByRes.forEach(function validateStateKeys(item) {
                    if (!previousFieldsValues.length)
                        previousFieldsValues[0] = item.key;
                    else {
                        item.key.should.be.above(previousFieldsValues[0]);
                        item.value.forEach(function validateLastNameKey(it) {
                            if (!previousFieldsValues[1])
                                previousFieldsValues[1] = it.value.key;
                            else {
                                it.key.should.be.below(previousFieldsValues[1]);
                                it.value.forEach(function validateFirstNameKey(i) {
                                    if (!previousFieldsValues[2])
                                        previousFieldsValues[2] = i.value.key;
                                    else
                                        i.key.should.be.below(previousFieldsValues[2]);
                                });
                                previousFieldsValues[2] = null;
                            }
                        });
                        previousFieldsValues[1] = null;
                    }
                });
            });
        });
    });

    describe('Test map...', function testMap() {
        function _identity(item) {
            return item;
        }

        it('should return full names of all test data items', function testMap() {
            var mapIterable = map(testData.dataSource.data, function fullName(item) { return item.FirstName + ' ' + item.LastName; }),
                mapRes = Array.from(mapIterable());

            mapRes.should.have.lengthOf(testData.dataSource.data.length);
            mapRes.forEach(function _validateNames(item, idx) {
                let testDataItem = testData.dataSource.data[idx];
                item.should.eql(testDataItem.FirstName + ' ' + testDataItem.LastName);
            });
        });

        it('should function return unmolested test data when Identity is passed as function arg', function testMapWithIdentity() {
            var mapIterable = map(testData.dataSource.data, _identity),
                mapRes = Array.from(mapIterable());

            mapRes.should.have.lengthOf(testData.dataSource.data.length);
            mapRes.should.eql(testData.dataSource.data);
        });

        it('should return empty collection when source is empty', function testMapWithEmptySource() {
            var mapIterable = map([], _identity),
                mapRes = Array.from(mapIterable());

            mapRes.should.have.lengthOf(0);
        });
    });

    describe('Test orderBy...', function testOrderBy() {
        var previousFieldsValues = [];

        afterEach(function cleanPreviousFieldsArray() {
            previousFieldsValues = [];
        });

        function firstNameSelector(item) {
            return item.FirstName;
        }

        function stateSelector(item) {
            return item.State;
        }

        function lastNameSelector(item) {
            return item.LastName;
        }

        describe('...using arrays', function testOrderByUsingArrays() {
            it('should return test data ordered by FirstName ascending', function testOrderByOnFirstNameAscending() {
                var orderObj = [{ keySelector: firstNameSelector, direction: sortDirection.ascending }];
                var orderByIterable = sortBy(testData.dataSource.data, orderObj),
                    orderByRes = Array.from(orderByIterable());

                orderByRes.should.have.lengthOf(testData.dataSource.data.length);
                orderByRes.forEach(function validateResults(item) {
                    if (!previousFieldsValues.length)
                        previousFieldsValues[0] = item.FirstName;
                    else {
                        item.FirstName.should.be.at.least(previousFieldsValues[0]);
                        if (item.FirstName !== previousFieldsValues[0])
                            previousFieldsValues[0] = item.FirstName;
                    }
                });
            });

            it('should return test data ordered by FirstName descending', function testOrderByOnFirstNameDescending() {
                var orderObj = [{ keySelector: firstNameSelector, direction: sortDirection.descending }],
                    orderByIterable = sortBy(testData.dataSource.data, orderObj),
                    orderByRes = Array.from(orderByIterable());

                orderByRes.should.have.lengthOf(testData.dataSource.data.length);
                orderByRes.forEach(function validationResults(item) {
                    if (!previousFieldsValues.length)
                        previousFieldsValues[0] = item.FirstName;
                    else {
                        item.FirstName.should.be.at.most(previousFieldsValues[0]);
                        if (item.FirstName !== previousFieldsValues[0])
                            previousFieldsValues[0] = item.FirstName;
                    }
                });
            });

            it('should be able of sorting on more than one column', function testOrderByOnMultipleColumns() {
                var orderObj = [
                        { keySelector: stateSelector, direction: sortDirection.descending },
                        { keySelector: lastNameSelector, direction: sortDirection.ascending },
                        { keySelector: firstNameSelector, direction: sortDirection.ascending }
                    ],
                    orderByIterable = sortBy(testData.dataSource.data, orderObj),
                    orderByRes = Array.from(orderByIterable());

                orderByRes.should.have.lengthOf(testData.dataSource.data.length);
                orderByRes.forEach(function validateResults(item, idx) {
                    if (!previousFieldsValues.length) {
                        previousFieldsValues[0] = item.State;
                        previousFieldsValues[1] = item.LastName;
                        previousFieldsValues[2] = item.FirstName;
                    }
                    else {
                        if (item.State !== previousFieldsValues[0]) {
                            item.State.should.be.at.most(previousFieldsValues[0]);
                            previousFieldsValues[0] = item.State;
                            previousFieldsValues[1] = null;
                            previousFieldsValues[2] = null;
                        }
                        else if (item.LastName !== previousFieldsValues[1]) {
                            if (null !== previousFieldsValues[1]) {
                                item.LastName.should.be.at.least(previousFieldsValues[1]);
                            }
                            item.State.should.be.at.most(previousFieldsValues[0]);
                            previousFieldsValues[1] = item.LastName;
                        }
                        else if (item.FirstName !== previousFieldsValues[2]) {
                            if (null !== previousFieldsValues[2]) {
                                item.FirstName.should.be.at.least(previousFieldsValues[2]);
                            }
                            item.State.should.be.at.most(previousFieldsValues[0]);
                            item.LastName.should.be.at.least(previousFieldsValues[1]);
                            previousFieldsValues[2] = item.FirstName;
                        }
                        else {
                            item.State.should.be.at.most(previousFieldsValues[0]);
                            item.LastName.should.be.at.least(previousFieldsValues[1]);
                            item.FirstName.should.be.at.least(previousFieldsValues[2]);
                        }
                    }
                });
            });
        });
    });
});