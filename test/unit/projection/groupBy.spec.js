import { groupBy } from '../../../src/projection/groupBy';
import { createNewQueryableDelegator } from '../../../src/queryObjects/queryDelegatorCreators';
import { sortDirection } from '../../../src/helpers';
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

var uniqueStates = [],
    uniqueFirstNames = [],
    uniqueLastNames = [];

testData.dataSource.data.forEach(function _findUniqueStates(item) {
    if (!uniqueStates.some(function findDupe(it) {
        return it === item.State;
        }))
        uniqueStates.push(item.State);
});

testData.dataSource.data.forEach(function _findUniqueStates(item) {
    if (!uniqueFirstNames.some(function findDupe(it) {
            return it === item.FirstName;
        }))
        uniqueFirstNames.push(item.FirstName);
});

testData.dataSource.data.forEach(function _findUniqueStates(item) {
    if (!uniqueLastNames.some(function findDupe(it) {
            return it === item.LastName;
        }))
        uniqueLastNames.push(item.LastName);
});


describe('Test groupBy...', function testGroupBy() {
    describe('...using arrays', function testGroupByUsingArrays() {
        it('should group test data by state descending', function testGroupByOnStateDescending() {
            console.log(createNewQueryableDelegator);
            var groupObj = [ { keySelector: stateSelector, comparer: comparer, direction: sortDirection.descending } ],
                groupByIterable = groupBy(testData.dataSource.data, groupObj, createNewQueryableDelegator),
                groupByRes = Array.from(groupByIterable());

            groupByRes.should.have.lengthOf(uniqueStates.length);
            groupByRes.forEach(function validateKeyOrder(item) {
                if (!previousFieldsValues.length)
                    previousFieldsValues[0] = item.key;
                else {
                    item.key.should.be.below(previousFieldsValues[0]);
                    previousFieldsValues[0] = item.key;
                }
            });
        });

        it('should group test data by state ascending', function testGroupByOnStateAscending() {
            var groupObj = [ { keySelector: stateSelector, comparer: comparer, direction: sortDirection.ascending } ],
                groupByIterable = groupBy(testData.dataSource.data, groupObj, createNewQueryableDelegator),
                groupByRes = Array.from(groupByIterable());

            groupByRes.should.have.lengthOf(uniqueStates.length);
            groupByRes.forEach(function validateKeyOrder(item) {
                if (!previousFieldsValues.length)
                    previousFieldsValues[0] = item.key;
                else {
                    item.key.should.be.above(previousFieldsValues[0]);
                    previousFieldsValues[0] = item.key;
                }
            });
        });

        it('should group on multiple fields', function testGroupByOnMultipleFields() {
            var groupObj = [
                { keySelector: stateSelector, direction: sortDirection.ascending },
                { keySelector: lastNameSelector, direction: sortDirection.descending },
                { keySelector: firstNameSelector, direction: sortDirection.descending }
            ];
            var groupByIterable = groupBy(testData.dataSource.data, groupObj, createNewQueryableDelegator),
                groupByRes = Array.from(groupByIterable());

            groupByRes.should.have.lengthOf(uniqueStates.length);
            groupByRes.forEach(function validateStateKeys(item) {
                if (!previousFieldsValues.length)
                    previousFieldsValues[0] = item.key;
                else {
                    item.key.should.be.above(previousFieldsValues[0]);
                    item.source.forEach(function validateLastNameKey(it) {
                        if (!previousFieldsValues[1])
                            previousFieldsValues[1] = it.source.key;
                        else {
                            it.key.should.be.below(previousFieldsValues[1]);
                            it.source.forEach(function validateFirstNameKey(i) {
                                if (!previousFieldsValues[2])
                                    previousFieldsValues[2] = i.source.key;
                                else
                                    i.key.should.be.below(previousFieldsValues[2]);
                            });
                            previousFieldsValues[2] = null;
                        }
                    });
                    previousFieldsValues[1] = null;
                }
            });
        });
    });
});