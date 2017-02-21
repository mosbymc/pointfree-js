import { count } from '../../../src/evaluation/count';
import { testData } from '../../testData';

var markFirstNameCount = testData.dataSource.data.filter(function _filterNames(item) {
    return item.FirstName === 'Mark';
}).length;

describe('Test count', function testLength() {
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
        function predicate(item) { return item.FirstName === 'Mark'; }
        var countRes = count(testData.dataSource.data, predicate);
        countRes.should.eql(markFirstNameCount);
    });
});