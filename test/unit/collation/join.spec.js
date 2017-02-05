import { join } from '../../../src/collation/join';
import { testData } from '../../testData';

var joinTestData = new Array(54);
joinTestData = joinTestData.fill(1).map(function _mapTestData(item, idx) {
    return item * idx * idx;
});

var duplicateFirstNames = Array.prototype.concat.apply([],testData.dataSource.data.map(function _findDupes(item) {
    return Array.prototype.concat.apply([], testData.dataSource.data.filter(function _innerDupes(it) {
        return item.FirstName === it.FirstName;
    }));
}));

var duplicateFullNames = Array.prototype.concat.apply([],testData.dataSource.data.map(function _findDupes(item) {
    return Array.prototype.concat.apply([], testData.dataSource.data.filter(function _innerDupes(it) {
        return item.FirstName === it.FirstName && item.LastName === it.LastName;
    }));
}));

var duplicateLocations = Array.prototype.concat.apply([],testData.dataSource.data.map(function _findDupes(item) {
    return Array.prototype.concat.apply([], testData.dataSource.data.filter(function _innerDupes(it) {
        return item.City === it.City && item.State === it.State;
    }));
}));

function comparer(a, b) {
    return a.FirstName === b.FirstName;
}

function comparer2(a, b) {
    return a.FirstName === b.FirstName && a.LastName === b.LastName;
}

function comparer3(a, b) {
    return a.City === b.City && a.State == b.State;
}

function comparer4(a, b) {
    return a.FirstName === b;
}

function selector(item) {
    return item.FirstName;
}

function selector2(item) {
    return `${ item.FirstName } ${ item.LastName }`;
}

function selector3(item) {
    return {
        FirstName: item.FirstName,
        LastName: item.LastName
    };
}

function selector4(item) {
    return {
        City: item.City,
        State: item.State
    };
}

function selector5(item) {
    return { FirstName: item.FirstName };
}

function projector(a, b) {
    return {
        outerFirstName: a.FirstName,
        innerFirstName: b.FirstName
    }
}

function projector2(a, b) {
    return {
        sourceName: `${ a.FirstName } ${ a.LastName }`,
        otherName: `${ b.FirstName } ${ b.LastName }`
    };
}

function identity(item) {
    return item;
}

describe('Test join...', function testJoin() {
    describe('...using default equality comparer', function testJoinWithArrays() {
        it('should return all test data items that share the same name', function testJoinOnFirstName() {
            var joinIterable = join(testData.dataSource.data, testData.dataSource.data, selector, selector, projector),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(duplicateFirstNames.length);
            joinRes.forEach(function _validateResults(item) {
                item.outerFirstName.should.eql(item.innerFirstName);
            });
        });

        it('should return empty array when no matches are found', function testJoinWithNoMatches() {
            var joinIterable = join(testData.dataSource.data, joinTestData, selector, identity, projector),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(0);
        });

        it('should return empty array when second collection is empty', function testJoinWithNoMatches() {
            var joinIterable = join(testData.dataSource.data, [], selector, identity, projector),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(0);
        });

        it('should return empty array when source is empty', function testJoinWithEmptySource() {
            var joinIterable = join([], testData.dataSource.data, selector, identity, projector),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(0);
        });

        it('should return all test data items that share the same state and city', function testJoinWithSelector2() {
            var joinIterable = join(testData.dataSource.data, testData.dataSource.data, selector2, selector2, projector2),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(duplicateFullNames.length);
            joinRes.forEach(function _validateResults(item) {
                item.should.have.keys('sourceName', 'otherName');
                item.sourceName.should.eql(item.otherName);
            });
        });
    });

    describe('...using defined equality comparer', function testJoinWithDefinedEqualityComparer() {
        it('should return all test data items that share the same name', function testJoinOnFirstName() {
            var joinIterable = join(testData.dataSource.data, testData.dataSource.data, selector5, selector5, projector, comparer),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(duplicateFirstNames.length);
            joinRes.forEach(function _validateResults(item) {
                if (item.outerFirstName !== item.innerFirstName) {
                    console.log(item);
                }
                item.outerFirstName.should.eql(item.innerFirstName);
            });
        });

        it('should return empty array when no matches are found', function testJoinWithNoMatches() {
            var joinIterable = join(testData.dataSource.data, joinTestData, selector5, identity, projector, comparer4),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(0);
        });

        it('should return empty array when second collection is empty', function testJoinWithNoMatches() {
            var joinIterable = join(testData.dataSource.data, [], selector5, identity, projector, comparer4),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(0);
        });

        it('should return empty array when source is empty', function testJoinWithEmptySource() {
            var joinIterable = join([], testData.dataSource.data, selector2, identity, projector, comparer),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(0);
        });

        it('should return all test data items that share the same state and city', function testJoinWithSelector2() {
            var joinIterable = join(testData.dataSource.data, testData.dataSource.data, selector4, selector4, projector2, comparer3),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(duplicateLocations.length);
            joinRes.forEach(function _validateResults(item) {
                item.should.have.keys('sourceName', 'otherName');
            });
        });
    });

    describe('...using generators', function testJoinUsingGenerators() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        it('should return all test data items that share the same name', function testJoinOnFirstNameWithGenerators() {
            var joinIterable = join(gen(testData.dataSource.data), gen(testData.dataSource.data), selector, selector, projector),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(duplicateFirstNames.length);
            joinRes.forEach(function _validateResults(item) {
                item.outerFirstName.should.eql(item.innerFirstName);
            });
        });

        it('should return empty array when no matches are found', function testJoinWithNoMatches() {
            var joinIterable = join(gen(testData.dataSource.data), gen(joinTestData), selector, identity, projector),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(0);
        });

        it('should return empty array when second collection is empty', function testJoinWithNoMatches() {
            var joinIterable = join(gen(testData.dataSource.data), gen([]), selector, identity, projector),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(0);
        });

        it('should return empty array when source is empty', function testJoinWithEmptySource() {
            var joinIterable = join(gen([]), gen(testData.dataSource.data), selector, identity, projector),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(0);
        });

        it('should return all test data items that share the same state and city', function testJoinWithSelector2() {
            var joinIterable = join(gen(testData.dataSource.data), gen(testData.dataSource.data), selector2, selector2, projector2),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(duplicateFullNames.length);
            joinRes.forEach(function _validateResults(item) {
                item.should.have.keys('sourceName', 'otherName');
                item.sourceName.should.eql(item.otherName);
            });
        });

        it('should return empty array when source is empty', function testJoinWithEmptySource() {
            var joinIterable = join(gen([]), gen(testData.dataSource.data), selector2, identity, projector, comparer),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(0);
        });

        it('should return all test data items that share the same state and city', function testJoinWithSelector2() {
            var joinIterable = join(gen(testData.dataSource.data), gen(testData.dataSource.data), selector4, selector4, projector2, comparer3),
                joinRes = Array.from(joinIterable());

            joinRes.should.have.lengthOf(duplicateLocations.length);
            joinRes.forEach(function _validateResults(item) {
                item.should.have.keys('sourceName', 'otherName');
            });
        });
    });
});