import { except } from '../../../src/collation/except';
import { cacher } from '../../../src/helpers';
import { testData } from '../../testData';

describe('Test except...', function testExcept() {
    function comparer(a, b) { return a.FirstName === b.FirstName; }

    var havePreviouslyViewed = cacher(comparer),
        uniqueFirstNames = testData.dataSource.data.filter(function findUniqueNames(item) {
            return !havePreviouslyViewed(item) && item.FirstName !== 'Mark';
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