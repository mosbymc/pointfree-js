import { contains } from '../../../src/evaluation/contains';
import { testData } from '../../testData';

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