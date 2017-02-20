import { zip } from '../../../src/collation/zip';
import { testData } from '../../testData';

describe('Test zip...', function testZip() {
    function zipSelector(a, b) {
        return { source: a, collection: b };
    }

    var zipTestData = new Array(54);
    zipTestData = zipTestData.fill(1).map(function _mapTestData(item, idx) {
        return item * idx * idx;
    });

    var zipTestData2 = zipTestData.concat(zipTestData);

    describe('... using arrays', function testZipWithArrays() {
        it('should return full length of source when collection is same length', function testZipWithEqualLengthArray() {
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

        it('should return full length of source when collection is the same length', function testZipWithGeneratorContainingSameAmount() {
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

        it('should return full source length when both params are generators and have data', function testZipWithEmptyCollection() {
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