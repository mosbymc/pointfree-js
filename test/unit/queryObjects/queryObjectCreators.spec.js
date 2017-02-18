import { createNewQueryableDelegator, createNewOrderedQueryableDelegator } from '../../../src/queryObjects/queryObjectCreators';
import { queryable } from '../../../src/queryObjects/queryable';
import { orderedQueryable } from '../../../src/queryObjects/orderedQueryable';
import { orderBy } from '../../../src/projection/orderBy';
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

function comparer(a, b) {
    return a === b;
}

function isObject(item) {
    return 'object' === typeof item;
}

describe('createNewQueryableDelegator', function testQueryableDelegatorObjectCreation() {
    it('should create a new queryable object delegator with actual pipeline array', function testSuccessfulCreation() {
        var queryDelegator = createNewQueryableDelegator(testData.dataSource.data);

        expect(queryDelegator).to.exist;

        //Properties that should be present
        //queryDelegator._data.should.eql(testData.dataSource.data);
        expect(queryDelegator.evaluatedData).to.be.undefined;
        queryDelegator.dataComputed.should.be.false;

        //Functions that should be present
        //queryDelegator._iterator.should.exist;
        //queryDelegator._iterator.should.be.a('function');

        //PROJECTION FUNCTIONS
        queryDelegator.flatten.should.exist;
        queryDelegator.flatten.should.be.a('function');
        queryDelegator.groupBy.should.exist;
        queryDelegator.groupBy.should.be.a('function');
        queryDelegator.flatten.should.exist;
        queryDelegator.flatten.should.be.a('function');
        queryDelegator.flattenDeep.should.exist;
        queryDelegator.flattenDeep.should.be.a('function');
        queryDelegator.orderBy.should.exist;
        queryDelegator.orderBy.should.be.a('function');
        queryDelegator.orderByDescending.should.exist;
        queryDelegator.orderByDescending.should.be.a('function');


        //COLLATION FUNCTIONS
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
        queryDelegator.distinct.should.exist;
        queryDelegator.distinct.should.be.a('function');


        //EVALUATION FUNCTIONS
        queryDelegator.all.should.exist;
        queryDelegator.all.should.be.a('function');
        queryDelegator.any.should.exist;
        queryDelegator.any.should.be.a('function');
        queryDelegator.first.should.exist;
        queryDelegator.first.should.be.a('function');
        queryDelegator.last.should.exist;
        queryDelegator.last.should.be.a('function');


        queryDelegator.take.should.exist;
        queryDelegator.take.should.be.a('function');
        queryDelegator.takeWhile.should.exist;
        queryDelegator.takeWhile.should.be.a('function');
        queryDelegator.skip.should.exist;
        queryDelegator.skip.should.be.a('function');
        queryDelegator.skipWhile.should.exist;
        queryDelegator.skipWhile.should.be.a('function');

        //Functions that should not be present
        expect(queryDelegator.thenBy).to.not.exist;
        expect(queryDelegator.thenByDescending).to.not.exist;
    });

    it('should return a queryable or orderedQueryable in all cases', function testDefaultParameterValues() {
        var baseDelegate = createNewQueryableDelegator(testData.dataSource.data),
            mapDelegate = baseDelegate.map(function (item) { return item.State; }),
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
            flattenDeepDelegate = baseDelegate.flattenDeep();

        expect(queryable.isPrototypeOf(mapDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(whereDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(concatDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(exceptDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(groupJoinDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(intersectDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(joinDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(unionDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(zipDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(groupByDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(groupByDescendingDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(orderByDelegate)).to.be.true;
        expect(orderedQueryable.isPrototypeOf(orderByDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(orderByDescendingDelegate)).to.be.true;
        expect(orderedQueryable.isPrototypeOf(orderByDescendingDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(distinctDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(flattenDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(flattenDeepDelegate)).to.be.true;
    });
});

describe('createNewOrderedQueryableDelegator', function testCreateNewQueryableDelegator() {
    it('should create a new queryable object delegator with actual pipeline array', function testSuccessfulCreation() {
        function keySelector(item) { return item.State; }
        function comparer(a, b) { return a < b; }
        var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
        var orderedQueryDelegator = createNewOrderedQueryableDelegator(this, orderBy(this, sortObj), sortObj);

        expect(orderedQueryDelegator).to.exist;

        //Properties that should be present
        //queryDelegator._data.should.eql(testData.dataSource.data);
        expect(orderedQueryDelegator.evaluatedData).to.be.undefined;
        orderedQueryDelegator.dataComputed.should.be.false;

        //Functions that should be present
        //queryDelegator._iterator.should.exist;
        //queryDelegator._iterator.should.be.a('function');

        //PROJECTION FUNCTIONS
        orderedQueryDelegator.flatten.should.exist;
        orderedQueryDelegator.flatten.should.be.a('function');
        orderedQueryDelegator.groupBy.should.exist;
        orderedQueryDelegator.groupBy.should.be.a('function');
        orderedQueryDelegator.flatten.should.exist;
        orderedQueryDelegator.flatten.should.be.a('function');
        orderedQueryDelegator.flattenDeep.should.exist;
        orderedQueryDelegator.flattenDeep.should.be.a('function');
        orderedQueryDelegator.orderBy.should.exist;
        orderedQueryDelegator.orderBy.should.be.a('function');
        orderedQueryDelegator.orderByDescending.should.exist;
        orderedQueryDelegator.orderByDescending.should.be.a('function');
        orderedQueryDelegator.thenBy.should.exist;
        orderedQueryDelegator.thenBy.should.be.a('function');
        orderedQueryDelegator.thenByDescending.should.exist;
        orderedQueryDelegator.thenByDescending.should.be.a('function');


        //COLLATION FUNCTIONS
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
        orderedQueryDelegator.distinct.should.exist;
        orderedQueryDelegator.distinct.should.be.a('function');


        //EVALUATION FUNCTIONS
        orderedQueryDelegator.all.should.exist;
        orderedQueryDelegator.all.should.be.a('function');
        orderedQueryDelegator.any.should.exist;
        orderedQueryDelegator.any.should.be.a('function');
        orderedQueryDelegator.first.should.exist;
        orderedQueryDelegator.first.should.be.a('function');
        orderedQueryDelegator.last.should.exist;
        orderedQueryDelegator.last.should.be.a('function');


        orderedQueryDelegator.take.should.exist;
        orderedQueryDelegator.take.should.be.a('function');
        orderedQueryDelegator.takeWhile.should.exist;
        orderedQueryDelegator.takeWhile.should.be.a('function');
        orderedQueryDelegator.skip.should.exist;
        orderedQueryDelegator.skip.should.be.a('function');
        orderedQueryDelegator.skipWhile.should.exist;
        orderedQueryDelegator.skipWhile.should.be.a('function');
    });

    it('should return a queryable or orderedQueryable in all cases', function testDefaultParameterValues() {
        function keySelector(item) { return item.State; }
        function comparer(a, b) { return a < b; }
        var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: 'asc' }];
        var basedOrderedDelegate = createNewOrderedQueryableDelegator(this, orderBy(this, sortObj), sortObj),
            mapDelegate = basedOrderedDelegate.map(function (item) { return item.State; }),
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
            orderByDelegate = basedOrderedDelegate.orderBy(nameSelector, comparer),
            orderByDescendingDelegate = basedOrderedDelegate.orderByDescending(nameSelector, comparer),
            thenByDelegate = basedOrderedDelegate.thenBy(nameSelector, comparer),
            thenByDescendingDelegate = basedOrderedDelegate.thenByDescending(nameSelector, comparer),
            distinctDelegate = basedOrderedDelegate.distinct(),
            flattenDelegate = basedOrderedDelegate.flatten(),
            flattenDeepDelegate = basedOrderedDelegate.flattenDeep();

        expect(queryable.isPrototypeOf(mapDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(whereDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(concatDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(exceptDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(groupJoinDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(intersectDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(joinDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(unionDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(zipDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(groupByDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(groupByDescendingDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(orderByDelegate)).to.be.true;
        expect(orderedQueryable.isPrototypeOf(orderByDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(orderByDescendingDelegate)).to.be.true;
        expect(orderedQueryable.isPrototypeOf(orderByDescendingDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(thenByDelegate)).to.be.true;
        expect(orderedQueryable.isPrototypeOf(thenByDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(thenByDescendingDelegate)).to.be.true;
        expect(orderedQueryable.isPrototypeOf(thenByDescendingDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(distinctDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(flattenDelegate)).to.be.true;
        expect(queryable.isPrototypeOf(flattenDeepDelegate)).to.be.true;
    });
});