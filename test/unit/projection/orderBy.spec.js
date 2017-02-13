import { orderBy } from '../../../src/projection/orderBy';
import { testData } from '../../testData';

var previousFieldsValues = [];

afterEach(function cleanPreviousFieldsArray() {
    previousFieldsValues = [];
});

function firstNameSelector(item) {
    return item.FirstName;
}

function stateSelector(item) {
    return item.State;
}

function lastNameSelector(item) {
    return item.LastName;
}

function comparer(a, b) {
    return a <= b;
}

describe('Test orderBy...', function testOrderBy() {
    describe('...using arrays', function testOrderByUsingArrays() {
        it('should return test data ordered by FirstName ascending', function testOrderByOnFirstNameAscending() {
            var orderObj = [{ keySelector: firstNameSelector, comparer: comparer, direction: 'asc' }];
            var orderByIterable = orderBy(testData.dataSource.data, orderObj),
                orderByRes = Array.from(orderByIterable());

            orderByRes.should.have.lengthOf(testData.dataSource.data.length);
            orderByRes.forEach(function validateResults(item) {
                if (!previousFieldsValues.length)
                    previousFieldsValues[0] = item.FirstName;
                else {
                    item.FirstName.should.be.at.least(previousFieldsValues[0]);
                    if (item.FirstName !== previousFieldsValues[0])
                        previousFieldsValues[0] = item.FirstName;
                }
            });
        });

        it('should return test data ordered by FirstName descending', function testOrderByOnFirstNameDescending() {
            var orderObj = [{ keySelector: firstNameSelector, comparer: comparer, direction: 'desc' }],
                orderByIterable = orderBy(testData.dataSource.data, orderObj),
                orderByRes = Array.from(orderByIterable());

            orderByRes.should.have.lengthOf(testData.dataSource.data.length);
            orderByRes.forEach(function validationResults(item) {
                if (!previousFieldsValues.length)
                    previousFieldsValues[0] = item.FirstName;
                else {
                    item.FirstName.should.be.at.most(previousFieldsValues[0]);
                    if (item.FirstName !== previousFieldsValues[0])
                        previousFieldsValues[0] = item.FirstName;
                }
            });
        });

        it('should be able of sorting on more than one column', function testOrderByOnMultipleColumns() {
            var orderObj = [
                { keySelector: stateSelector, comparer: comparer, direction: 'desc' },
                { keySelector: lastNameSelector, comparer: comparer, direction: 'asc' },
                { keySelector: firstNameSelector, comparer: comparer, direction: 'asc' }
                ],
                orderByIterable = orderBy(testData.dataSource.data, orderObj),
                orderByRes = Array.from(orderByIterable());

            orderByRes.should.have.lengthOf(testData.dataSource.data.length);
            orderByRes.forEach(function validateResults(item) {
                if (!previousFieldsValues.length) {
                    previousFieldsValues[0] = item.State;
                    previousFieldsValues[1] = item.LastName;
                    previousFieldsValues[2] = item.FirstName;
                }
                else {
                    if (item.State !== previousFieldsValues[0]) {
                        item.State.should.be.at.most(previousFieldsValues[0]);
                        previousFieldsValues[0] = item.State;
                        previousFieldsValues[1] = null;
                        previousFieldsValues[2] = null;
                    }
                    else if (item.LastName !== previousFieldsValues[1]) {
                        if (null !== previousFieldsValues[1]) {
                            item.LastName.should.be.at.least(previousFieldsValues[1]);
                        }
                        item.State.should.be.at.most(previousFieldsValues[0]);
                        previousFieldsValues[1] = item.LastName;
                    }
                    else if (item.FirstName !== previousFieldsValues[2]) {
                        if (null !== previousFieldsValues[2]) {
                            item.FirstName.should.be.at.least(previousFieldsValues[2]);
                        }
                        item.State.should.be.at.most(previousFieldsValues[0]);
                        item.LastName.should.be.at.least(previousFieldsValues[1]);
                        previousFieldsValues[2] = item.FirstName;
                    }
                    else {
                        item.State.should.be.at.most(previousFieldsValues[0]);
                        item.LastName.should.be.at.least(previousFieldsValues[1]);
                        item.FirstName.should.be.at.least(previousFieldsValues[2]);
                    }
                }
            });
        });
    });
});