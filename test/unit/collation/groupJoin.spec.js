import { groupJoin } from '../../../src/collation/groupJoin';
import { testData } from '../../testData';

var preViewed = {};
var uniqueCities = testData.dataSource.data.filter(function _gatherUniqueCities(item) {
    if (!(item.City in preViewed)) {
        preViewed[item.City] = true;
        return item.City;
    }
}).map(function _selectOnlyCities(item) {
    return item.City;
});

var uniqueStates = testData.dataSource.data.filter(function _gatherUniqueStates(item) {
    if (!(item.State in preViewed)) {
        preViewed[item.State] = true;
        return item.State;
    }
}).map(function _selectOnlyStates(item) {
    return item.State;
});

function primitiveSelector(item) {
    return item;
}

function citySelector(item) {
    return item.City;
}

function stateSelector(item) {
    return item.State;
}

function cityProjector(a, b) {
    return {
        City: a,
        People: b
    };
}

function stateProjector(a, b) {
    return {
        State: a,
        People: b
    };
}

function cityComparer(a, b) {
    return a === b.City;
}

function stateComparer(a, b) {
    return a === b.State;
}

describe('Test groupJoin...', function testGroupJoin() {
    describe('...using default equality comparer', function testGroupJoinUsingDefaultComparer() {
        it('should return all items grouped by city', function testBasicGroupJoin() {
            var groupJoinIterable = groupJoin(uniqueCities, testData.dataSource.data, primitiveSelector, citySelector, cityProjector),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(uniqueCities.length);
            groupJoinRes.forEach(function _validateEntries(item) {
                item.should.have.keys('City', 'People');
                item.People.should.be.an('array');
                item.People.forEach(function _ensurePeopleLiveInCity(person) {
                    item.City.should.eql(person.City);
                });
            });
        });

        it('should return all items grouped by state', function testBasicGroupJoin() {
            var groupJoinIterable = groupJoin(uniqueStates, testData.dataSource.data, primitiveSelector, stateSelector, stateProjector),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(uniqueStates.length);
            groupJoinRes.forEach(function _validateEntries(item) {
                item.should.have.keys('State', 'People');
                item.People.should.be.an('array');
                item.People.forEach(function _ensurePeopleLiveInState(person) {
                    item.State.should.eql(person.State);
                });
            });
        });

        it('should return items that have no inner matches', function testGroupJoinWithNoInnerMatches() {
            var groupJoinIterable = groupJoin(uniqueStates, [], primitiveSelector, stateSelector, stateProjector),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(uniqueStates.length);
            groupJoinRes.forEach(function _validateEntries(item) {
                item.should.have.keys('State', 'People');
                item.People.should.be.an('array');
                item.People.should.have.lengthOf(0);
            });
        });

        it('should return empty array when source is empty', function testGroupJoinWithEmptySource() {
            var groupJoinIterable = groupJoin([], testData.dataSource.data, primitiveSelector, stateSelector, stateProjector),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(0);
        });
    });

    describe('...using defined equality comparer', function testGroupJoinWithDefinedComparer() {
        it('should return all items grouped by city', function testGroupJoinWithDefinedEqualityComparer() {
            var groupJoinIterable = groupJoin(uniqueCities, testData.dataSource.data, primitiveSelector, citySelector, cityProjector, cityComparer),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(uniqueCities.length);
            groupJoinRes.forEach(function _ensurePeopleLiveInCities(item) {
                item.should.have.keys('City', 'People');
                item.People.should.be.an('array');
                item.People.forEach(function _ensurePeopleLiveInCity(person) {
                    item.City.should.eql(person.City);
                });
            });
        });

        it('should return all items grouped by state', function testGroupJoinWithDefinedEqualityComparer() {
            var groupJoinIterable = groupJoin(uniqueStates, testData.dataSource.data, primitiveSelector, stateSelector, stateProjector, stateComparer),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(uniqueStates.length);
            groupJoinRes.forEach(function _validateEntries(item) {
                item.should.have.keys('State', 'People');
                item.People.should.be.an('array');
                item.People.forEach(function _ensurePeopleLiveInState(person) {
                    item.State.should.eql(person.State);
                });
            });
        });

        it('should prevent all matches when comparer is not comparing like values', function testGroupJoinWithIncorrectComparer() {
            function badComparer(a, b) {
                return a === b.Zip;
            }

            var groupJoinIterable = groupJoin(uniqueCities, testData.dataSource.data, primitiveSelector, citySelector, cityProjector, badComparer),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(uniqueCities.length);
            groupJoinRes.forEach(function _ensurePeopleLiveInCities(item) {
                item.should.have.keys('City', 'People');
                item.People.should.be.an('array');
                item.People.should.have.lengthOf(0);
            });
        });

        it('should return items that have no inner matches', function testGroupJoinWithNoInnerMatches() {
            var groupJoinIterable = groupJoin(uniqueStates, [], primitiveSelector, stateSelector, stateProjector, stateComparer),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(uniqueStates.length);
            groupJoinRes.forEach(function _validateEntries(item) {
                item.should.have.keys('State', 'People');
                item.People.should.be.an('array');
                item.People.should.have.lengthOf(0);
            });
        });

        it('should return empty array when source is empty', function testGroupJoinWithEmptySource() {
            var groupJoinIterable = groupJoin([], testData.dataSource.data, primitiveSelector, stateSelector, stateProjector, stateComparer),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(0);
        });
    });

    describe('...using generators', function testGroupJoinWithGenerators() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        it('should return all items grouped by city', function testGroupJoinWithDefinedEqualityComparer() {
            var groupJoinIterable = groupJoin(gen(uniqueCities), gen(testData.dataSource.data), primitiveSelector, citySelector, cityProjector, cityComparer),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(uniqueCities.length);
            groupJoinRes.forEach(function _validateEntries(item) {
                item.should.have.keys('City', 'People');
                item.People.should.be.an('array');
                item.People.forEach(function _ensurePeopleLiveInState(person) {
                    item.City.should.eql(person.City);
                });
            });
        });

        it('should return all items grouped by state', function testGroupJoinWithDefinedEqualityComparer() {
            var groupJoinIterable = groupJoin(gen(uniqueStates), gen(testData.dataSource.data), primitiveSelector, stateSelector, stateProjector, stateComparer),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(uniqueStates.length);
            groupJoinRes.forEach(function _validateEntries(item) {
                item.should.have.keys('State', 'People');
                item.People.should.be.an('array');
                item.People.forEach(function _ensurePeopleLiveInState(person) {
                    item.State.should.eql(person.State);
                });
            });
        });

        it('should prevent all matches when comparer is not comparing like values', function testGroupJoinWithIncorrectComparer() {
            function badComparer(a, b) {
                return a === b.Zip;
            }

            var groupJoinIterable = groupJoin(gen(uniqueCities), gen(testData.dataSource.data), primitiveSelector, citySelector, cityProjector, badComparer),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(uniqueCities.length);
            groupJoinRes.forEach(function _ensurePeopleLiveInCities(item) {
                item.should.have.keys('City', 'People');
                item.People.should.be.an('array');
                item.People.should.have.lengthOf(0);
            });
        });

        it('should return items that have no inner matches', function testGroupJoinWithNoInnerMatches() {
            var groupJoinIterable = groupJoin(gen(uniqueStates), gen([]), primitiveSelector, stateSelector, stateProjector, stateComparer),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(uniqueStates.length);
            groupJoinRes.forEach(function _validateEntries(item) {
                item.should.have.keys('State', 'People');
                item.People.should.be.an('array');
                item.People.should.have.lengthOf(0);
            });
        });

        it('should return empty array when source is empty', function testGroupJoinWithEmptySource() {
            var groupJoinIterable = groupJoin(gen([]), gen(testData.dataSource.data), primitiveSelector, stateSelector, stateProjector, stateComparer),
                groupJoinRes = Array.from(groupJoinIterable());

            groupJoinRes.should.have.lengthOf(0);
        });
    });
});