import { internal_queryable, internal_orderedQueryable } from '../../../src/queryObjects/queryable';
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

internal_orderedQueryable.source = testData.dataSource.data;

describe('Test orderedQueryable... ', function testOrderedQueryable() {
    it('should create a new queryable delegate', function testObjectDelegation() {
        var queryableAddFront = internal_orderedQueryable.addFront([1, 2, 3, 4, 5]),
            concatQueryable = internal_orderedQueryable.concat(testData.dataSource.data),
            exceptQueryable = internal_orderedQueryable.except(testData.dataSource.data),
            groupJoinQueryable = internal_orderedQueryable.groupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            queryableIntersect = internal_orderedQueryable.intersect(testData.dataSource.data),
            queryableJoin = internal_orderedQueryable.join(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            queryableUnion = internal_orderedQueryable.union(testData.dataSource.data),
            queryableZip = internal_orderedQueryable.zip(testData.dataSource.data, nameSelector),
            queryableWhere = internal_orderedQueryable.where(namePredicate),
            queryableOfType = internal_orderedQueryable.ofType('object'),
            queryableDistinct = internal_orderedQueryable.distinct(),
            queryableAll = internal_orderedQueryable.all(isObject),
            queryableAny = internal_orderedQueryable.any(isObject),
            queryableContains = internal_orderedQueryable.contains(testData.dataSource.data[0]),
            queryableFirst = internal_orderedQueryable.first(isObject),
            queryableFold = internal_orderedQueryable.fold(function _fold(val, cur, idx){ return val + idx}, 0),
            queryableLast = internal_orderedQueryable.last(isObject),
            queryableLength = internal_orderedQueryable.count(),
            queryableToArray = internal_orderedQueryable.toArray(),
            queryableToSet = internal_orderedQueryable.toSet(),
            queryableReverse = internal_orderedQueryable.reverse(),
            queryableMap = internal_orderedQueryable.map(function (item) { return item; }),
            queryableDeepMap = internal_orderedQueryable.deepMap(function() {}),
            queryableGroupBy = internal_orderedQueryable.groupBy(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableGroupByDescending = internal_orderedQueryable.groupByDescending(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableFlatten = internal_orderedQueryable.flatten(),
            queryableDeepFlatten = internal_orderedQueryable.deepFlatten();

        //queryable object functions that return a new queryable object delegator; check to make sure the
        //returned object delegates to the queryable object.
        expect(internal_queryable.isPrototypeOf(queryableAddFront)).to.be.true;
        expect(internal_queryable.isPrototypeOf(concatQueryable)).to.be.true;
        expect(internal_queryable.isPrototypeOf(exceptQueryable)).to.be.true;
        expect(internal_queryable.isPrototypeOf(groupJoinQueryable)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableIntersect)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableJoin)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableUnion)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableZip)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableWhere)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableOfType)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableDistinct)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableMap)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableDeepMap)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableGroupBy)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableGroupByDescending)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableFlatten)).to.be.true;
        expect(internal_queryable.isPrototypeOf(queryableDeepFlatten)).to.be.true;

        //TODO: need to move these "methods" to the orderedQueryable if possible...
        //TODO: also need to have a function to handle calling of orderBy/orderByDescending to keep
        //TODO: consumers from accidentally over writing any existing ordering
        //orderedQueryable.thenBy.should.exist;
        //orderedQueryable.thenBy.should.be.a('function');

        queryableAll.should.be.true;
        queryableAny.should.be.true;
        queryableContains.should.be.true;
        queryableFirst.should.eql(testData.dataSource.data[0]);
        queryableFold.should.be.a('number');
        queryableFold.should.eql(1431);
        queryableLast.should.eql(testData.dataSource.data[testData.dataSource.data.length - 1]);
        queryableLength.should.be.a('number');
        queryableLength.should.eql(testData.dataSource.data.length);

        Array.prototype.isPrototypeOf(queryableToArray).should.be.true;
        queryableToArray.should.eql(testData.dataSource.data);

        Set.prototype.isPrototypeOf(queryableToSet).should.be.true;
        queryableToSet.should.eql(new Set(testData.dataSource.data));

        Array.prototype.isPrototypeOf(queryableReverse).should.be.true;
        queryableReverse.should.eql(testData.dataSource.data.reverse());
    });
});