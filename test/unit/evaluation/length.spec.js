import { length } from '../../../src/evaluation/length';
import { testData } from '../../testData';

describe('Test length', function testLength() {
    it('should return the length of test data', function testLengthUsingTestData() {
        var lengthRes = length(testData.dataSource.data);
        lengthRes.should.eql(testData.dataSource.data.length);
    });

    it('should return the length of a generator\'s data', function testLengthUsingAGenerator() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        var lengthRes = length(gen(testData.dataSource.data));
        lengthRes.should.eql(testData.dataSource.data.length);
    });
});