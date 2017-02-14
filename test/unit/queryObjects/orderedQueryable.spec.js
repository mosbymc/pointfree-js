import { orderedQueryable } from '../../../src/queryObjects/orderedQueryable';
import { queryable } from '../../../src/queryObjects/queryable';
import { testData } from '../../testData';

function nameSelector(item) {
    return item.FirstName;
}

function nameProjector(item) {
    return item.FirstName;
}

function namePredicate(item) {
    return item.FirstName.length > 5;
}

function isObject(item) {
    return 'object' === typeof item;
}

orderedQueryable.source = testData.dataSource.data;

describe('Test orderedQueryable... ', function testOrderedQueryable() {
    it('should create a new queryable delegate', function testObjectDelegation() {
        var concatQueryable = orderedQueryable.queryableConcat(testData.dataSource.data),
            exceptQueryable = orderedQueryable.queryableExcept(testData.dataSource.data),
            groupJoinQueryable = orderedQueryable.queryableGroupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            queryableIntersect = orderedQueryable.queryableIntersect(testData.dataSource.data),
            queryableJoin = orderedQueryable.queryableJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            queryableUnion = orderedQueryable.queryableUnion(testData.dataSource.data),
            queryableZip = orderedQueryable.queryableZip(testData.dataSource.data, nameSelector),
            queryableWhere = orderedQueryable.queryableWhere(namePredicate),
            queryableDistinct = orderedQueryable.queryableDistinct(),
            queryableAll = orderedQueryable.queryableAll(isObject),
            queryableAny = orderedQueryable.queryableAny(isObject),
            queryableFirst = orderedQueryable.queryableFirst(isObject),
            queryableLast = orderedQueryable.queryableLast(isObject),
            queryableToArray = orderedQueryable.queryableToArray(),
            queryableToSet = orderedQueryable.queryableToSet(),
            queryableReverse = orderedQueryable.queryableReverse(),
            queryableMap = orderedQueryable.queryableMap(function (item) { return item; }),
            queryableGroupBy = orderedQueryable.queryableGroupBy(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableGroupByDescending = orderedQueryable.queryableGroupByDescending(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableOrderBy = orderedQueryable.queryableOrderBy(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableOrderByDescending = orderedQueryable.queryableOrderByDescending(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableFlatten = orderedQueryable.queryableFlatten(),
            queryableDeepFlatten = orderedQueryable.queryableFlattenDeep();

        //queryable object functions that return a new queryable object delegator; check to make sure the
        //returned object delegates to the queryable object.
        expect(queryable.isPrototypeOf(concatQueryable)).to.be.true;
        expect(queryable.isPrototypeOf(exceptQueryable)).to.be.true;
        expect(queryable.isPrototypeOf(groupJoinQueryable)).to.be.true;
        expect(queryable.isPrototypeOf(queryableIntersect)).to.be.true;
        expect(queryable.isPrototypeOf(queryableJoin)).to.be.true;
        expect(queryable.isPrototypeOf(queryableUnion)).to.be.true;
        expect(queryable.isPrototypeOf(queryableZip)).to.be.true;
        expect(queryable.isPrototypeOf(queryableWhere)).to.be.true;
        expect(queryable.isPrototypeOf(queryableDistinct)).to.be.true;
        expect(queryable.isPrototypeOf(queryableMap)).to.be.true;
        expect(queryable.isPrototypeOf(queryableGroupBy)).to.be.true;
        expect(queryable.isPrototypeOf(queryableGroupByDescending)).to.be.true;
        expect(orderedQueryable.isPrototypeOf(queryableOrderBy)).to.be.true;
        expect(orderedQueryable.isPrototypeOf(queryableOrderByDescending)).to.be.true;
        expect(queryable.isPrototypeOf(queryableFlatten)).to.be.true;
        expect(queryable.isPrototypeOf(queryableDeepFlatten)).to.be.true;

        //TODO: need to move these "methods" to the orderedQueryable if possible...
        //TODO: also need to have a function to handle calling of orderBy/orderByDescending to keep
        //TODO: consumers from accidentally over writing any existing ordering
        //orderedQueryable.thenBy.should.exist;
        //orderedQueryable.thenBy.should.be.a('function');

        queryableAll.should.be.true;
        queryableAny.should.be.true;
        queryableFirst.should.eql(testData.dataSource.data[0]);
        queryableLast.should.eql(testData.dataSource.data[testData.dataSource.data.length - 1]);

        Array.prototype.isPrototypeOf(queryableToArray).should.be.true;
        queryableToArray.should.eql(testData.dataSource.data);

        Set.prototype.isPrototypeOf(queryableToSet).should.be.true;
        queryableToSet.should.eql(new Set(testData.dataSource.data));

        Array.prototype.isPrototypeOf(queryableReverse).should.be.true;
        queryableReverse.should.eql(testData.dataSource.data.reverse());
    });
});