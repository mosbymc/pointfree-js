import { union } from '../../../src/collation/union';
import { memoizer } from '../../../src/helpers';
import { testData } from '../../testData';

describe('Test union...', function testUnion() {
    function comparer(a, b) { return a.FirstName === b.FirstName; }

    var havePreviouslyViewed = memoizer(comparer),
        uniqueFirstNames = testData.dataSource.data.filter(function findUniqueNames(item) {
            return !havePreviouslyViewed(item);
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