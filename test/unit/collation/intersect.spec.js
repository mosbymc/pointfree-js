import { intersect } from '../../../src/collation/intersect';
import { memoizer2 } from '../../../src/helpers';
import { testData } from '../../testData';

describe('Test intersect...', function testIntersect() {
    function comparer(a, b) { return a.FirstName === b.FirstName; }

    var havePreviouslyViewed = memoizer2(comparer),
        uniqueFirstNames = testData.dataSource.data.filter(function findUniqueNames(item) {
            return !havePreviouslyViewed(item);
        });

    var firstHalf = testData.dataSource.data.slice(0, testData.dataSource.data.length / 2),
        evenIdxs = testData.dataSource.data.filter(function _getEvenIndexedItems(item, idx) { return idx % 2; }),
        oddIdxs = testData.dataSource.data.filter(function _getOddIndexedItems(item, idx) { return !(idx % 2); });

    havePreviouslyViewed = memoizer2(comparer);
    var firstHalfAndUniqueNames = firstHalf.filter(function _findUniqueNames(item) {
        return !(havePreviouslyViewed(item));
    });

    havePreviouslyViewed = memoizer2(comparer);
    var evensAndUniqueNames = evenIdxs.filter(function _findUniqueNames(item) {
        return !(havePreviouslyViewed(item));
    });

    havePreviouslyViewed = memoizer2(comparer);
    var oddsAndUniqueNames = oddIdxs.filter(function _findUniqueNames(item) {
        return !(havePreviouslyViewed(item));
    });

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

            intersectRes.should.have.lengthOf(uniqueFirstNames.length);
            intersectRes.should.eql(uniqueFirstNames);
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

            intersectRes.should.have.lengthOf(firstHalfAndUniqueNames.length);
            intersectRes.should.eql(firstHalfAndUniqueNames);
        });

        it('should return even indexed items with unique names when intersected with even indexed items', function testIntersectWithEvenIndexedItems() {
            var intersectIterable = intersect(testData.dataSource.data, evenIdxs, comparer),
                intersectRes = Array.from(intersectIterable());

            intersectRes.should.have.lengthOf(evensAndUniqueNames.length);
            intersectRes.forEach(function checkForMatchingFirstNames(item, idx) {
                item.FirstName.should.eql(evensAndUniqueNames[idx].FirstName);
            });
        });

        it('should return odd indexed items with unique names when intersected with odd indexed items', function testIntersectWithOddIndexedItems() {
            var intersectIterable = intersect(testData.dataSource.data, oddIdxs, comparer),
                intersectRes = Array.from(intersectIterable());

            intersectRes.should.have.lengthOf(oddsAndUniqueNames.length);
            intersectRes.forEach(function checkForMatchingFirstNames(item, idx) {
                item.FirstName.should.eql(oddsAndUniqueNames[idx].FirstName);
            });
        });

        it('should return a single item when collections because of shared .FirstName property', function testIntersectWithNonOverlappingCollections() {
            var intersectIterable = intersect(oddIdxs, evenIdxs, comparer),
                intersectRes = Array.from(intersectIterable());

            intersectRes.should.have.lengthOf(1);
            intersectRes[0].FirstName.should.eql('Mark');
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

            intersectRes.should.have.lengthOf(uniqueFirstNames.length);
            intersectRes.should.eql(uniqueFirstNames);
        });
    });
});