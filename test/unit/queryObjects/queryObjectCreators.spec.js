import { createNewQueryableDelegator, createNewOrderedQueryableDelegator } from '../../../src/queryObjects/queryDelegatorCreators';
import { internal_queryable, internal_orderedQueryable } from '../../../src/queryObjects/queryable';
import { sortDirection } from '../../../src/helpers';
import { orderBy } from '../../../src/projection/orderBy';
import { testData } from '../../testData';

function nameSelector(item) {
    return item.FirstName;
}

function nameProjector(item) {
    return item.FirstName;
}

function namePredicate(item) {
    return 5 < item.FirstName.length;
}

function comparer(a, b) {
    return a === b;
}

function keySelector(item) { return item.State; }
function lessThanComparer(a, b) { return a < b; }
var sortObj = [{ keySelector: keySelector, direction: sortDirection.ascending }];

var backupData = testData.dataSource.data.map(function _i(val) { return val; });

beforeEach(function setSource() {
    testData.dataSource.data = backupData;
});

describe('createNewQueryableDelegator', function testQueryableDelegatorObjectCreation() {
    it('should create a new queryable object delegator with actual pipeline array', function testSuccessfulCreation() {
        var queryDelegator = createNewQueryableDelegator(testData.dataSource.data);

        expect(queryDelegator).to.exist;

        //Properties that should be present
        //queryDelegator._data.should.eql(testData.dataSource.data);

        //Functions that should be present
        //queryDelegator._iterator.should.exist;
        //queryDelegator._iterator.should.be.a('function');

        //PROJECTION FUNCTIONS
        queryDelegator.deepMap.should.exist;
        queryDelegator.deepMap.should.be.a('function');
        queryDelegator.flatten.should.exist;
        queryDelegator.flatten.should.be.a('function');
        queryDelegator.groupBy.should.exist;
        queryDelegator.groupBy.should.be.a('function');
        queryDelegator.flatten.should.exist;
        queryDelegator.flatten.should.be.a('function');
        queryDelegator.deepFlatten.should.exist;
        queryDelegator.deepFlatten.should.be.a('function');
        queryDelegator.map.should.exist;
        queryDelegator.map.should.be.a('function');
        queryDelegator.orderBy.should.exist;
        queryDelegator.orderBy.should.be.a('function');
        queryDelegator.orderByDescending.should.exist;
        queryDelegator.orderByDescending.should.be.a('function');


        //COLLATION FUNCTIONS
        queryDelegator.addFront.should.exist;
        queryDelegator.addFront.should.be.a('function');
        queryDelegator.concat.should.exist;
        queryDelegator.concat.should.be.a('function');
        queryDelegator.except.should.exist;
        queryDelegator.except.should.be.a('function');
        queryDelegator.groupJoin.should.exist;
        queryDelegator.groupJoin.should.be.a('function');
        queryDelegator.intersect.should.exist;
        queryDelegator.intersect.should.be.a('function');
        queryDelegator.join.should.exist;
        queryDelegator.join.should.be.a('function');
        queryDelegator.union.should.exist;
        queryDelegator.union.should.be.a('function');
        queryDelegator.zip.should.exist;
        queryDelegator.zip.should.be.a('function');


        //LIMITATION FUNCTIONS
        queryDelegator.where.should.exist;
        queryDelegator.where.should.be.a('function');
        queryDelegator.ofType.should.exist;
        queryDelegator.ofType.should.be.a('function');
        queryDelegator.distinct.should.exist;
        queryDelegator.distinct.should.be.a('function');


        //EVALUATION FUNCTIONS
        queryDelegator.all.should.exist;
        queryDelegator.all.should.be.a('function');
        queryDelegator.any.should.exist;
        queryDelegator.any.should.be.a('function');
        queryDelegator.contains.should.exist;
        queryDelegator.contains.should.be.a('function');
        queryDelegator.first.should.exist;
        queryDelegator.first.should.be.a('function');
        queryDelegator.fold.should.exist;
        queryDelegator.fold.should.be.a('function');
        queryDelegator.last.should.exist;
        queryDelegator.last.should.be.a('function');
        queryDelegator.count.should.exist;
        queryDelegator.count.should.be.a('function');


        queryDelegator.take.should.exist;
        queryDelegator.take.should.be.a('function');
        queryDelegator.takeWhile.should.exist;
        queryDelegator.takeWhile.should.be.a('function');
        queryDelegator.skip.should.exist;
        queryDelegator.skip.should.be.a('function');
        queryDelegator.skipWhile.should.exist;
        queryDelegator.skipWhile.should.be.a('function');


        //MUTATION FUNCTIONS
        queryDelegator.toArray.should.exist;
        queryDelegator.toArray.should.be.a('function');
        queryDelegator.toSet.should.exist;
        queryDelegator.toSet.should.be.a('function');
        queryDelegator.reverse.should.exist;
        queryDelegator.reverse.should.be.a('function');

        //Functions that should not be present
        expect(queryDelegator.thenBy).to.not.exist;
        expect(queryDelegator.thenByDescending).to.not.exist;
    });

    it('should return a queryable or orderedQueryable in all cases', function testQueryableReturningFunctions() {
        var baseDelegate = createNewQueryableDelegator(testData.dataSource.data),
            mapDelegate = baseDelegate.map(function (item) { return item.State; }),
            deepMapDelegate = baseDelegate.deepMap(function(item) { return item.State; }),
            ofTypeDelegate = baseDelegate.ofType('object'),
            addFrontDelegate = baseDelegate.addFront([1, 2, 3, 4, 5]),
            whereDelegate = baseDelegate.where(namePredicate),
            concatDelegate = baseDelegate.concat([1, 2, 3, 4]),
            exceptDelegate = baseDelegate.except(testData.dataSource.data),
            groupJoinDelegate = baseDelegate.groupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            intersectDelegate = baseDelegate.intersect(testData.dataSource.data),
            joinDelegate = baseDelegate.join(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            unionDelegate = baseDelegate.union(testData.dataSource.data),
            zipDelegate = baseDelegate.zip(nameSelector, testData.dataSource.data),
            groupByDelegate = baseDelegate.groupBy(nameSelector, comparer),
            groupByDescendingDelegate = baseDelegate.groupByDescending(nameSelector, comparer),
            orderByDelegate = baseDelegate.orderBy(nameSelector, comparer),
            orderByDescendingDelegate = baseDelegate.orderByDescending(nameSelector, comparer),
            distinctDelegate = baseDelegate.distinct(),
            flattenDelegate = baseDelegate.flatten(),
            flattenDeepDelegate = baseDelegate.deepFlatten();

        expect(internal_queryable.isPrototypeOf(mapDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(deepMapDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(ofTypeDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(addFrontDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(whereDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(concatDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(exceptDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(groupJoinDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(intersectDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(joinDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(unionDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(zipDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(groupByDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(groupByDescendingDelegate)).to.be.true;
        expect(internal_orderedQueryable.isPrototypeOf(orderByDelegate)).to.be.true;
        expect(internal_orderedQueryable.isPrototypeOf(orderByDescendingDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(distinctDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(flattenDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(flattenDeepDelegate)).to.be.true;
    });

    it('should return a non-queryable object in all cases', function testNonQueryableReturningFunctions() {
        var baseDelegate = createNewQueryableDelegator(testData.dataSource.data),
            take = baseDelegate.take(5),
            takeWhile = baseDelegate.takeWhile(function _predicate(item) { return 4 < item.drillDownData.length; }),
            skip = baseDelegate.skip(40),
            skipWhile = baseDelegate.skipWhile(function _predicate(item) { return 5 < item.drillDownData.length; }),
            any1 = baseDelegate.any(),
            any2 = baseDelegate.any(function _predicate(item) { return 'Mike' === item.FirstName; }),
            all1 = baseDelegate.all(),
            all2 = baseDelegate.all(function _predicate(item) { return item.drillDownData.length; }),
            contains = baseDelegate.contains(testData.dataSource.data[0]),
            first1 = baseDelegate.first(),
            first2 = baseDelegate.first(function _predicate(item) { return 'Phillip J.' === item.FirstName; }),
            fold = baseDelegate.fold(function _fold(val, cur, idx){ return val + idx}, 0),
            last1 = baseDelegate.last(),
            last2 = baseDelegate.last(function _predicate(item) { return 'Mark' === item.FirstName; }),
            length = baseDelegate.count(),
            toArray = baseDelegate.toArray(),
            toSet = baseDelegate.toSet(),
            reverse = baseDelegate.reverse();

        expect(internal_queryable.isPrototypeOf(take)).to.be.false;
        take.should.be.an('array');
        expect(internal_queryable.isPrototypeOf(takeWhile)).to.be.false;
        takeWhile.should.be.an('array');
        expect(internal_queryable.isPrototypeOf(skip)).to.be.false;
        skip.should.be.an('array');
        expect(internal_queryable.isPrototypeOf(skipWhile)).to.be.false;
        skipWhile.should.be.an('array');
        expect(internal_queryable.isPrototypeOf(any1)).to.be.false;
        any1.should.be.true;
        expect(internal_queryable.isPrototypeOf(any2)).to.be.false;
        any2.should.be.false;
        expect(internal_queryable.isPrototypeOf(all1)).to.be.false;
        all1.should.be.true;
        expect(internal_queryable.isPrototypeOf(all2)).to.be.false;
        all2.should.be.true;
        expect(internal_queryable.isPrototypeOf(contains)).to.be.false;
        contains.should.be.true;
        expect(internal_queryable.isPrototypeOf(first1)).to.be.false;
        first1.should.eql(testData.dataSource.data[0]);
        expect(internal_queryable.isPrototypeOf(first2)).to.be.false;
        //first2.should.eql(testData.dataSource.data[0]);
        expect(internal_queryable.isPrototypeOf(fold)).to.be.false;
        fold.should.be.a('number');
        fold.should.eql(1431);
        expect(internal_queryable.isPrototypeOf(last1)).to.be.false;
        last1.should.eql(testData.dataSource.data[testData.dataSource.data.length - 1]);
        expect(internal_queryable.isPrototypeOf(last2)).to.be.false;
        //last2.should.eql(testData.dataSource.data[testData.dataSource.data.length - 1]);
        expect(internal_queryable.isPrototypeOf(length)).to.be.false;
        length.should.be.a('number');
        length.should.eql(testData.dataSource.data.length);
        expect(internal_queryable.isPrototypeOf(toArray)).to.be.false;
        toArray.should.be.an('array');
        expect(internal_queryable.isPrototypeOf(toSet)).to.be.false;
        expect(internal_queryable.isPrototypeOf(reverse)).to.be.false;
        reverse.should.be.an('array');
    });
});

describe('createNewOrderedQueryableDelegator', function testCreateNewQueryableDelegator() {
    it('should create a new queryable object delegator with actual pipeline array', function testSuccessfulCreation() {
        var orderedQueryDelegator = createNewOrderedQueryableDelegator(testData.dataSource.data, orderBy(testData.dataSource.data, sortObj), sortObj);

        expect(orderedQueryDelegator).to.exist;

        //Properties that should be present
        //queryDelegator._data.should.eql(testData.dataSource.data);

        //Functions that should be present
        //queryDelegator._iterator.should.exist;
        //queryDelegator._iterator.should.be.a('function');

        //PROJECTION FUNCTIONS
        orderedQueryDelegator.map.should.exist;
        orderedQueryDelegator.map.should.be.a('function');
        orderedQueryDelegator.deepMap.should.exist;
        orderedQueryDelegator.deepMap.should.be.a('function');
        orderedQueryDelegator.flatten.should.exist;
        orderedQueryDelegator.flatten.should.be.a('function');
        orderedQueryDelegator.groupBy.should.exist;
        orderedQueryDelegator.groupBy.should.be.a('function');
        orderedQueryDelegator.flatten.should.exist;
        orderedQueryDelegator.flatten.should.be.a('function');
        orderedQueryDelegator.deepFlatten.should.exist;
        orderedQueryDelegator.deepFlatten.should.be.a('function');
        orderedQueryDelegator.thenBy.should.exist;
        orderedQueryDelegator.thenBy.should.be.a('function');
        orderedQueryDelegator.thenByDescending.should.exist;
        orderedQueryDelegator.thenByDescending.should.be.a('function');


        //COLLATION FUNCTIONS
        orderedQueryDelegator.addFront.should.exist;
        orderedQueryDelegator.addFront.should.be.a('function');
        orderedQueryDelegator.concat.should.exist;
        orderedQueryDelegator.concat.should.be.a('function');
        orderedQueryDelegator.except.should.exist;
        orderedQueryDelegator.except.should.be.a('function');
        orderedQueryDelegator.groupJoin.should.exist;
        orderedQueryDelegator.groupJoin.should.be.a('function');
        orderedQueryDelegator.intersect.should.exist;
        orderedQueryDelegator.intersect.should.be.a('function');
        orderedQueryDelegator.join.should.exist;
        orderedQueryDelegator.join.should.be.a('function');
        orderedQueryDelegator.union.should.exist;
        orderedQueryDelegator.union.should.be.a('function');
        orderedQueryDelegator.zip.should.exist;
        orderedQueryDelegator.zip.should.be.a('function');


        //LIMITATION FUNCTIONS
        orderedQueryDelegator.where.should.exist;
        orderedQueryDelegator.where.should.be.a('function');
        orderedQueryDelegator.ofType.should.exist;
        orderedQueryDelegator.ofType.should.be.a('function');
        orderedQueryDelegator.distinct.should.exist;
        orderedQueryDelegator.distinct.should.be.a('function');


        //EVALUATION FUNCTIONS
        orderedQueryDelegator.all.should.exist;
        orderedQueryDelegator.all.should.be.a('function');
        orderedQueryDelegator.any.should.exist;
        orderedQueryDelegator.any.should.be.a('function');
        orderedQueryDelegator.contains.should.exist;
        orderedQueryDelegator.contains.should.be.a('function');
        orderedQueryDelegator.first.should.exist;
        orderedQueryDelegator.first.should.be.a('function');
        orderedQueryDelegator.fold.should.exist;
        orderedQueryDelegator.fold.should.be.a('function');
        orderedQueryDelegator.last.should.exist;
        orderedQueryDelegator.last.should.be.a('function');
        orderedQueryDelegator.count.should.exist;
        orderedQueryDelegator.count.should.be.a('function');


        orderedQueryDelegator.take.should.exist;
        orderedQueryDelegator.take.should.be.a('function');
        orderedQueryDelegator.takeWhile.should.exist;
        orderedQueryDelegator.takeWhile.should.be.a('function');
        orderedQueryDelegator.skip.should.exist;
        orderedQueryDelegator.skip.should.be.a('function');
        orderedQueryDelegator.skipWhile.should.exist;
        orderedQueryDelegator.skipWhile.should.be.a('function');


        //MUTATION FUNCTIONS
        orderedQueryDelegator.toArray.should.exist;
        orderedQueryDelegator.toArray.should.be.a('function');
        orderedQueryDelegator.toSet.should.exist;
        orderedQueryDelegator.toSet.should.be.a('function');
        orderedQueryDelegator.reverse.should.exist;
        orderedQueryDelegator.reverse.should.be.a('function');
    });

    it('should return a queryable or orderedQueryable in all cases', function testQueryableReturningFunctions() {
        var basedOrderedDelegate = createNewOrderedQueryableDelegator(testData.dataSource.data, orderBy(testData.dataSource.data, sortObj), sortObj),
            mapDelegate = basedOrderedDelegate.map(function (item) { return item.State; }),
            deepMapDelegate = basedOrderedDelegate.deepMap(function(item) { return item.State; }),
            ofTypeDelegate = basedOrderedDelegate.ofType('object'),
            addFrontDelegate = basedOrderedDelegate.addFront([1, 2, 3, 4, 5]),
            whereDelegate = basedOrderedDelegate.where(namePredicate),
            concatDelegate = basedOrderedDelegate.concat([1, 2, 3, 4]),
            exceptDelegate = basedOrderedDelegate.except(testData.dataSource.data),
            groupJoinDelegate = basedOrderedDelegate.groupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            intersectDelegate = basedOrderedDelegate.intersect(testData.dataSource.data),
            joinDelegate = basedOrderedDelegate.join(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            unionDelegate = basedOrderedDelegate.union(testData.dataSource.data),
            zipDelegate = basedOrderedDelegate.zip(nameSelector, testData.dataSource.data),
            groupByDelegate = basedOrderedDelegate.groupBy(nameSelector, comparer),
            groupByDescendingDelegate = basedOrderedDelegate.groupByDescending(nameSelector, comparer),
            thenByDelegate = basedOrderedDelegate.thenBy(nameSelector, comparer),
            thenByDescendingDelegate = basedOrderedDelegate.thenByDescending(nameSelector, comparer),
            distinctDelegate = basedOrderedDelegate.distinct(),
            flattenDelegate = basedOrderedDelegate.flatten(),
            flattenDeepDelegate = basedOrderedDelegate.deepFlatten();

        expect(internal_queryable.isPrototypeOf(mapDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(deepMapDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(ofTypeDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(addFrontDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(whereDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(concatDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(exceptDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(groupJoinDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(intersectDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(joinDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(unionDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(zipDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(groupByDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(groupByDescendingDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(thenByDelegate)).to.be.false;
        expect(internal_orderedQueryable.isPrototypeOf(thenByDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(thenByDescendingDelegate)).to.be.false;
        expect(internal_orderedQueryable.isPrototypeOf(thenByDescendingDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(distinctDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(flattenDelegate)).to.be.true;
        expect(internal_queryable.isPrototypeOf(flattenDeepDelegate)).to.be.true;
    });

    it('should return a non-queryable object in all cases', function testNonQueryableReturningFunctions() {
        var basedOrderedDelegate = createNewOrderedQueryableDelegator(testData.dataSource.data, orderBy(testData.dataSource.data, sortObj), sortObj),
            take = basedOrderedDelegate.take(5),
            takeWhile = basedOrderedDelegate.takeWhile(function _predicate(item) { return 4 < item.drillDownData.length; }),
            skip = basedOrderedDelegate.skip(40),
            skipWhile = basedOrderedDelegate.skipWhile(function _predicate(item) { return 5 < item.drillDownData.length; }),
            any1 = basedOrderedDelegate.any(),
            any2 = basedOrderedDelegate.any(function _predicate(item) { return 'Mike' === item.FirstName; }),
            all1 = basedOrderedDelegate.all(),
            all2 = basedOrderedDelegate.all(function _predicate(item) { return item.drillDownData.length; }),
            contains = basedOrderedDelegate.contains(testData.dataSource.data[0], function _c(a, b) { return a.FirstName === b.FirstName; }),
            first1 = basedOrderedDelegate.first(),
            first2 = basedOrderedDelegate.first(function _predicate(item) { return 'Phillip J.' === item.FirstName; }),
            fold = basedOrderedDelegate.fold(function _fold(val, cur, idx){ return val + idx}, 0),
            last1 = basedOrderedDelegate.last(),
            last2 = basedOrderedDelegate.last(function _predicate(item) { return 'Mark' === item.FirstName; }),
            length = basedOrderedDelegate.count(),
            toArray = basedOrderedDelegate.toArray(),
            toSet = basedOrderedDelegate.toSet(),
            reverse = basedOrderedDelegate.reverse();

        expect(internal_queryable.isPrototypeOf(take)).to.be.false;
        take.should.be.an('array');
        expect(internal_queryable.isPrototypeOf(takeWhile)).to.be.false;
        takeWhile.should.be.an('array');
        expect(internal_queryable.isPrototypeOf(skip)).to.be.false;
        skip.should.be.an('array');
        expect(internal_queryable.isPrototypeOf(skipWhile)).to.be.false;
        skipWhile.should.be.an('array');
        expect(internal_queryable.isPrototypeOf(any1)).to.be.false;
        any1.should.be.true;
        expect(internal_queryable.isPrototypeOf(any2)).to.be.false;
        any2.should.be.false;
        expect(internal_queryable.isPrototypeOf(all1)).to.be.false;
        all1.should.be.true;
        expect(internal_queryable.isPrototypeOf(all2)).to.be.false;
        all2.should.be.true;
        expect(internal_queryable.isPrototypeOf(contains)).to.be.false;
        contains.should.be.true;
        expect(internal_queryable.isPrototypeOf(first1)).to.be.false;
        expect(internal_queryable.isPrototypeOf(first2)).to.be.false;
        expect(internal_queryable.isPrototypeOf(fold)).to.be.false;
        fold.should.be.a('number');
        fold.should.eql(1431);
        expect(internal_queryable.isPrototypeOf(last1)).to.be.false;
        expect(internal_queryable.isPrototypeOf(last2)).to.be.false;
        expect(internal_queryable.isPrototypeOf(length)).to.be.false;
        length.should.be.a('number');
        length.should.eql(testData.dataSource.data.length);
        expect(internal_queryable.isPrototypeOf(toArray)).to.be.false;
        toArray.should.be.an('array');
        expect(internal_queryable.isPrototypeOf(toSet)).to.be.false;
        expect(internal_queryable.isPrototypeOf(reverse)).to.be.false;
        reverse.should.be.an('array');
    });
});