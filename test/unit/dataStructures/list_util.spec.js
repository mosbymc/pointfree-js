import { all, any, binarySearch, contains, count, equals, findIndex, findLastIndex, first, foldLeft, foldRight,
    last, reduceRight, unfold } from '../../../src/dataStructures/list_util';
import { list, ordered_list, createList } from '../../../src/dataStructures/list';
import { cacher, sortDirection, typeNames } from '../../../src/helpers';
import { testData } from '../../testData';

describe('Test List Iterators', function _testListIterators() {
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
});