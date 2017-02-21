import { deepMap } from '../../../src/projection/deepMap';
import { testData } from '../../testData';

function testFunc(item) {
    return item.State || item.Year;
}

function identity(item) {
    return item;
}

describe('Test deep map', function testDeepMap() {
    it('should return an array of strings', function testDeepMap() {
        var deepMapIterable = deepMap(testData.dataSource.data, testFunc),
            deepMapRes = Array.from(deepMapIterable());

        deepMapRes.forEach(function _validateResults(item) {
            item.should.be.a('string');
        });
    });

    it('should return test data when identity is passed as an argument', function testDeepMapWithIdentity() {
        var deepMapIterable = deepMap(testData.dataSource.data, identity),
            deepMapRes = Array.from(deepMapIterable());

        deepMapRes.forEach(function _validateResults(item) {
            item.should.have.keys('FirstName', 'LastName', 'Phone', 'Email', 'Address', 'City', 'State', 'Zip', 'drillDownData');
        });
    });

    it('should return flattened data when identity is pass as an argument to grouped data', function testDeepMapWithIdentityOnGroupedData() {
        var data = [
            [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ],
            [
                [10, 11, 12],
                [13, 14, 15],
                [16, 17, 18]
            ]
        ];

        var deepMapIterable = deepMap(data, identity),
            deepMapRes = Array.from(deepMapIterable());
        deepMapRes.should.have.lengthOf(18);
        deepMapRes.forEach(function validateResults(item, idx) {
            item.should.eql(idx + 1);
        });
    });
});