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
        var concatQueryable = orderedQueryable.orderedConcat(testData.dataSource.data),
            exceptQueryable = orderedQueryable.orderedExcept(testData.dataSource.data),
            groupJoinQueryable = orderedQueryable.orderedGroupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            queryableIntersect = orderedQueryable.orderedIntersect(testData.dataSource.data),
            queryableJoin = orderedQueryable.orderedJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            queryableUnion = orderedQueryable.orderedUnion(testData.dataSource.data),
            queryableZip = orderedQueryable.orderedZip(testData.dataSource.data, nameSelector),
            queryableWhere = orderedQueryable.orderedWhere(namePredicate),
            queryableDistinct = orderedQueryable.orderedDistinct(),
            queryableAll = orderedQueryable.orderedAll(isObject),
            queryableAny = orderedQueryable.orderedAny(isObject),
            queryableFirst = orderedQueryable.orderedFirst(isObject),
            queryableLast = orderedQueryable.orderedLast(isObject),
            queryableToArray = orderedQueryable.orderedQueryableToArray(),
            queryableToSet = orderedQueryable.orderedQueryableToSet(),
            queryableReverse = orderedQueryable.orderedQueryableReverse(),
            queryableMap = orderedQueryable.orderedMap(function (item) { return item; }),
            queryableGroupBy = orderedQueryable.orderedGroupBy(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableGroupByDescending = orderedQueryable.orderedGroupByDescending(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableOrderBy = orderedQueryable.queryableOrderBy(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableOrderByDescending = orderedQueryable.queryableOrderByDescending(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableFlatten = orderedQueryable.orderedFlatten(),
            queryableDeepFlatten = orderedQueryable.orderedFlattenDeep();

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