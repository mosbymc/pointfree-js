import { sortData } from '../../../src/projection/sortHelpers';
import { testData } from '../../testData';

describe('sortData', function testSortData() {
    var previousFieldsValues = [],
        orderedField;

    it('should order the data properly the data in ascending order', function testSortingDataAscending() {
        var sortResult1 = sortData(testData.dataSource.data, [{ key: 'FirstName', dir: 'asc', dataType: 'string' }]);

        sortResult1.should.be.an('array');
        sortResult1.should.have.lengthOf(testData.dataSource.data.length);
        orderedField = 'FirstName';
        sortResult1.forEach(function testEachStringValue(item) {
            if (!previousFieldsValues.length)
                previousFieldsValues.push(item[orderedField]);
            else {
                item[orderedField].should.be.at.least(previousFieldsValues[0]);
                if (item[orderedField] !== previousFieldsValues[0])
                    previousFieldsValues[0] = item[orderedField];
            }
        });
    });

    it('should sort the data in descending order', function testSortDataDescending() {
        var sortResult = sortData(testData.dataSource.data, [{ key: 'LastName', dir: 'desc' }]);

        sortResult.should.be.an('array');
        sortResult.should.have.lengthOf(testData.dataSource.data.length);
        previousFieldsValues.length = 0;
        orderedField = 'LastName';
        sortResult.forEach(function testEachStringValue(item) {
            if (!previousFieldsValues.length)
                previousFieldsValues.push(item[orderedField]);
            else {
                item[orderedField].should.be.at.most(previousFieldsValues[0]);
                if (item[orderedField] !== previousFieldsValues[0])
                    previousFieldsValues[0] = item[orderedField];
            }
        });
    });

    it('should sort on more than one field', function testSortingOnTwoFields() {
        var sortResult = sortData(testData.dataSource.data, [{ key: 'Zip', dir: 'desc', dataType: 'number' }, { key: 'FirstName', dir: 'asc', dataType: 'string' }]);

        sortResult.should.be.an('array');
        sortResult.should.have.lengthOf(testData.dataSource.data.length);
        previousFieldsValues.length = 0;
        sortResult.forEach(function testEachValue(item) {
            if (!previousFieldsValues.length) {
                previousFieldsValues.push(+item.Zip);
                previousFieldsValues.push(item.FirstName);
            }
            else {
                if (+item.Zip !== previousFieldsValues[0]) {
                    (+item.Zip).should.be.at.most(previousFieldsValues[0]);
                    previousFieldsValues[0] = +item.Zip;
                    previousFieldsValues[1] = null;
                }
                else if (item.FirstName !== previousFieldsValues[1]) {
                    if (null !== previousFieldsValues[1])
                        item.FirstName.should.be.at.least(previousFieldsValues[1]);
                    previousFieldsValues[1] = item.FirstName;
                }
                else {
                    (+item.Zip).should.be.at.most(previousFieldsValues[0]);
                    item.FirstName.should.be.at.least(previousFieldsValues[1]);
                }
            }
        });
    });
});