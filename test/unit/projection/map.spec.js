import { map } from '../../../src/projection/map';
import { testData } from '../../testData';

function _identity(item) {
    return item;
}

describe('Test map...', function testMap() {
    it('should return full names of all test data items', function testMap() {
        var mapIterable = map(testData.dataSource.data, function fullName(item) { return item.FirstName + ' ' + item.LastName; }),
            mapRes = Array.from(mapIterable());

        mapRes.should.have.lengthOf(testData.dataSource.data.length);
        mapRes.forEach(function _validateNames(item, idx) {
            let testDataItem = testData.dataSource.data[idx];
            item.should.eql(testDataItem.FirstName + ' ' + testDataItem.LastName);
        });
    });

    it('should function return unmolested test data when identity is passed as function arg', function testMapWithIdentity() {
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