import { queryable, orderedQueryable } from '../../../src/queryObjects/queryable';
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
        var queryableAddFront = orderedQueryable.addFront([1, 2, 3, 4, 5]),
            concatQueryable = orderedQueryable.concat(testData.dataSource.data),
            exceptQueryable = orderedQueryable.except(testData.dataSource.data),
            groupJoinQueryable = orderedQueryable.groupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            queryableIntersect = orderedQueryable.intersect(testData.dataSource.data),
            queryableJoin = orderedQueryable.join(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            queryableUnion = orderedQueryable.union(testData.dataSource.data),
            queryableZip = orderedQueryable.zip(testData.dataSource.data, nameSelector),
            queryableWhere = orderedQueryable.where(namePredicate),
            queryableOfType = orderedQueryable.ofType('object'),
            queryableDistinct = orderedQueryable.distinct(),
            queryableAll = orderedQueryable.all(isObject),
            queryableAny = orderedQueryable.any(isObject),
            queryableContains = orderedQueryable.contains(testData.dataSource.data[0]),
            queryableFirst = orderedQueryable.first(isObject),
            queryableFold = orderedQueryable.fold(function _fold(val, cur, idx){ return val + idx}, 0),
            queryableLast = orderedQueryable.last(isObject),
            queryableLength = orderedQueryable.count(),
            queryableToArray = orderedQueryable.toArray(),
            queryableToSet = orderedQueryable.toSet(),
            queryableReverse = orderedQueryable.reverse(),
            queryableMap = orderedQueryable.map(function (item) { return item; }),
            queryableDeepMap = orderedQueryable.deepMap(function() {}),
            queryableGroupBy = orderedQueryable.groupBy(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableGroupByDescending = orderedQueryable.groupByDescending(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableFlatten = orderedQueryable.flatten(),
            queryableDeepFlatten = orderedQueryable.deepFlatten();

        //queryable object functions that return a new queryable object delegator; check to make sure the
        //returned object delegates to the queryable object.
        expect(queryable.isPrototypeOf(queryableAddFront)).to.be.true;
        expect(queryable.isPrototypeOf(concatQueryable)).to.be.true;
        expect(queryable.isPrototypeOf(exceptQueryable)).to.be.true;
        expect(queryable.isPrototypeOf(groupJoinQueryable)).to.be.true;
        expect(queryable.isPrototypeOf(queryableIntersect)).to.be.true;
        expect(queryable.isPrototypeOf(queryableJoin)).to.be.true;
        expect(queryable.isPrototypeOf(queryableUnion)).to.be.true;
        expect(queryable.isPrototypeOf(queryableZip)).to.be.true;
        expect(queryable.isPrototypeOf(queryableWhere)).to.be.true;
        expect(queryable.isPrototypeOf(queryableOfType)).to.be.true;
        expect(queryable.isPrototypeOf(queryableDistinct)).to.be.true;
        expect(queryable.isPrototypeOf(queryableMap)).to.be.true;
        expect(queryable.isPrototypeOf(queryableDeepMap)).to.be.true;
        expect(queryable.isPrototypeOf(queryableGroupBy)).to.be.true;
        expect(queryable.isPrototypeOf(queryableGroupByDescending)).to.be.true;
        expect(queryable.isPrototypeOf(queryableFlatten)).to.be.true;
        expect(queryable.isPrototypeOf(queryableDeepFlatten)).to.be.true;

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