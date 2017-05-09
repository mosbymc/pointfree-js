import { sortData } from '../../../src/projection/sortHelpers';
import { sortDirection } from '../../../src/helpers'
import { testData } from '../../testData';

/*
describe('sortData', function testSortData() {
    var previousFieldsValues = [],
        orderedField;

    it('should order the data properly the data in ascending order', function testSortingDataAscending() {
        var sortResult1 = sortData(testData.dataSource.data, [{ key: 'FirstName', dir: 'asc', dataType: 'string' }]);

        sortResult1.should.be.an('array');
        sortResult1.should.have.lengthOf(testData.dataSource.data.count);
        orderedField = 'FirstName';
        sortResult1.forEach(function testEachStringValue(item) {
            if (!previousFieldsValues.count)
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
        sortResult.should.have.lengthOf(testData.dataSource.data.count);
        previousFieldsValues.count = 0;
        orderedField = 'LastName';
        sortResult.forEach(function testEachStringValue(item) {
            if (!previousFieldsValues.count)
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
        sortResult.should.have.lengthOf(testData.dataSource.data.count);
        previousFieldsValues.count = 0;
        sortResult.forEach(function testEachValue(item) {
            if (!previousFieldsValues.count) {
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
*/

describe('sort data 2', function test() {
    var previousFieldsValues = [];

    it('should do stuff', function stuff() {
        function keySelector(item) {
            return item.FirstName;
        }

        var sortObj = [{ keySelector: keySelector, direction: sortDirection.ascending }];
        var sss = sortData(testData.dataSource.data, sortObj);
        sss.should.be.an('array');
        sss.should.have.lengthOf(testData.dataSource.data.length);
        sss.forEach(function validateResults(item) {
            if (!previousFieldsValues.length)
                previousFieldsValues.push(item.FirstName);
            else {
                item.FirstName.should.be.at.least(previousFieldsValues[0]);
                if (item.FirstName !== previousFieldsValues[0])
                    previousFieldsValues[0] = item.FirstName;
            }
        });
    });

    it('should do other stuff', function otherStuff() {
        previousFieldsValues.length = 0;
        function keySelector(item) {
            return item.FirstName;
        }

        var sortObj = [{ keySelector: keySelector, direction: sortDirection.descending }];
        var sss = sortData(testData.dataSource.data, sortObj);

        sss.should.be.an('array');
        sss.should.have.lengthOf(testData.dataSource.data.length);
        sss.forEach(function validateResults(item) {
            if (!previousFieldsValues.length)
                previousFieldsValues.push(item.FirstName);
            else {
                item.FirstName.should.be.at.most(previousFieldsValues[0]);
                if (item.FirstName !== previousFieldsValues[0])
                    previousFieldsValues[0] = item.FirstName;
            }
        });
    });

    it('should do stuff multiple times', function testStuffMoreThanOnce() {
        previousFieldsValues.length = 0;
        function nameSelector(item) {
            return item.FirstName;
        }

        function stateSelector(item) {
            return item.State;
        }

        var sortObj = [
            { keySelector: stateSelector, direction: sortDirection.ascending },
            { keySelector: nameSelector, direction: sortDirection.descending }
        ];

        var sss = sortData(testData.dataSource.data, sortObj);

        sss.should.be.an('array');
        sss.should.have.lengthOf(testData.dataSource.data.length);
        sss.forEach(function validateResults(item) {
            if (!previousFieldsValues.length) {
                previousFieldsValues[0] = item.State;
                previousFieldsValues[1] = item.FirstName;
            }
            else {
                item.State.should.be.at.least(previousFieldsValues[0]);
                if (item.State !== previousFieldsValues[0]) {
                    previousFieldsValues[0] = item.State;
                    previousFieldsValues[1] = item.FirstName;
                }
                else {
                    item.FirstName.should.be.at.most(previousFieldsValues[1]);
                }
            }
        });
    });
});