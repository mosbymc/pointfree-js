import { internal_queryable } from '../../../src/queryObjects/queryable';
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

beforeEach(function setSource() {
    internal_queryable.source = testData.dataSource.data;
});

describe('Test queryable', function testQueryable() {
    it('should create a new queryable delegate', function testObjectDelegation() {
        expect(internal_queryable.dataComputed).to.be.undefined;
        expect(internal_queryable.evaluatedData).to.be.undefined;

        var queryableAddFront = internal_queryable.addFront([1, 2, 3, 4, 5]),
            concatQueryable = internal_queryable.concat(testData.dataSource.data),
            exceptQueryable = internal_queryable.except(testData.dataSource.data),
            groupJoinQueryable = internal_queryable.groupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector, comparer),
            queryableIntersect = internal_queryable.intersect(testData.dataSource.data),
            queryableGroupJoin = internal_queryable.groupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector, comparer),
            queryableJoin = internal_queryable.join(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            queryableUnion = internal_queryable.union(testData.dataSource.data),
            queryableZip = internal_queryable.zip(testData.dataSource.data, nameSelector),
            queryableWhere = internal_queryable.where(namePredicate),
            queryableOfType = internal_queryable.ofType('object'),
            queryableDistinct = internal_queryable.distinct(),
            queryableAll = internal_queryable.all(isObject),
            queryableAny = internal_queryable.any(isObject),
            queryableContains = internal_queryable.contains(testData.dataSource.data[0]),
            queryableFold = internal_queryable.fold(function _fold(val, cur, idx){ return val + idx}, 0),
            queryableFirst = internal_queryable.first(isObject),
            queryableLast = internal_queryable.last(isObject),
            queryableLength = internal_queryable.count(),
            queryableToArray = internal_queryable.toArray(),
            queryableToSet = internal_queryable.toSet(),
            queryableReverse = internal_queryable.reverse(),
            queryableDeepMap = internal_queryable.deepMap(function() {}),
            queryableMap = internal_queryable.map(function (item) { return item; }),
            queryableGroupBy = internal_queryable.groupBy(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableGroupByDescending = internal_queryable.groupByDescending(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableOrderBy = internal_queryable.orderBy(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableOrderByDescending = internal_queryable.orderByDescending(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableFlatten = internal_queryable.flatten(),
            queryableDeepFlatten = internal_queryable.deepFlatten();

        //queryable object functions that return a new queryable object delegator; check to make sure the
        //returned object delegates to the queryable object.
        expect(internal_queryable.isPrototypeOf(queryableAddFront)).to.be.true;
        queryableAddFront.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(concatQueryable)).to.be.true;
        concatQueryable.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(exceptQueryable)).to.be.true;
        exceptQueryable.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(groupJoinQueryable)).to.be.true;
        groupJoinQueryable.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableIntersect)).to.be.true;
        queryableIntersect.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableGroupJoin)).to.be.true;
        queryableGroupJoin.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableJoin)).to.be.true;
        queryableJoin.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableUnion)).to.be.true;
        queryableUnion.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableZip)).to.be.true;
        queryableZip.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableWhere)).to.be.true;
        queryableWhere.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableOfType)).to.be.true;
        queryableOfType.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableDistinct)).to.be.true;
        queryableDistinct.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableDeepMap)).to.be.true;
        queryableDeepMap.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableMap)).to.be.true;
        queryableMap.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableGroupBy)).to.be.true;
        queryableGroupBy.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableGroupByDescending)).to.be.true;
        queryableGroupByDescending.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableOrderBy)).to.be.false;
        queryableOrderBy.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableOrderByDescending)).to.be.false;
        queryableOrderByDescending.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableFlatten)).to.be.true;
        queryableFlatten.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(queryableDeepFlatten)).to.be.true;
        queryableDeepFlatten.dataComputed.should.be.false;

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

    it('should have a functioning take', function testQueryablesTake() {
        var noItems = internal_queryable.take(0),
            singleItem = internal_queryable.take(1),
            fiveItems = internal_queryable.take(5),
            allItems = internal_queryable.take(testData.dataSource.data.length);

        noItems.should.have.lengthOf(0);
        singleItem.should.have.lengthOf(1);
        singleItem.should.eql(testData.dataSource.data.slice(0, 1));
        fiveItems.should.have.lengthOf(5);
        fiveItems.should.eql(testData.dataSource.data.slice(0, 5));
        allItems.should.have.lengthOf(testData.dataSource.data.length);
        allItems.should.eql(testData.dataSource.data);
    });

    it('should have a functioning take while', function testQueryableTakeWhile() {
        function predicate1() { return false; }
        function predicate2() { return true; }
        function predicate3(item) { return item.drillDownData.length >= 5; }
        function predicate4(item) { return item.FirstName !== 'Mark'; }

        var takeWhile1 = internal_queryable.takeWhile(predicate1),
            takeWhile2 = internal_queryable.takeWhile(predicate2),
            takeWhile3 = internal_queryable.takeWhile(predicate3),
            takeWhile4 = internal_queryable.takeWhile(predicate4);

        takeWhile1.should.have.lengthOf(0);
        //takeWhile2.should.have.lengthOf(testData.dataSource.data.count);
        //takeWhile2.should.eql(testData.dataSource.data);
        takeWhile3.forEach(function _checkDrillDownLength(item) {
            item.drillDownData.length.should.be.at.least(5);
        });
        takeWhile4.forEach(function _checkFirstNames(item) {
            item.FirstName.should.not.eql('Mark');
        });
    });

    it('should take the shortcut if the queryable\'s has been evaluated', function testShortCut() {
        internal_queryable.dataComputed = true;
        internal_queryable.evaluatedData = testData.dataSource.data;

        var take = internal_queryable.take(5),
            takeWhile = internal_queryable.takeWhile(function _takeWhile(item) {
                return item.FirstName !== 'Mark';
            });

        take.should.have.lengthOf(5);
        take.should.eql(testData.dataSource.data.slice(0, 5));

        takeWhile.forEach(function _validateResult(item) {
            item.FirstName.should.not.eql('Mark');
        }) ;
    });

    it('should have a functioning skip', function testSkip() {
        internal_queryable.dataComputed = false;
        var allItems = internal_queryable.skip(0),
            lessOne = internal_queryable.skip(1),
            lessFive = internal_queryable.skip(5),
            noItems = internal_queryable.skip(testData.dataSource.data.length);

        allItems.should.have.lengthOf(testData.dataSource.data.length);
        allItems.should.eql(testData.dataSource.data);
        lessOne.should.have.lengthOf(testData.dataSource.data.length - 1);
        lessOne.should.eql(testData.dataSource.data.slice(1));
        lessFive.should.have.lengthOf(testData.dataSource.data.length - 5);
        lessFive.should.eql(testData.dataSource.data.slice(5));
        noItems.should.have.lengthOf(0);
    });

    it('should have a functioning skip while', function testQueryableSkipWhile() {
        internal_queryable.dataComputed = false;
        function predicate1() { return false; }
        function predicate2() { return true; }
        function predicate3(item) { return item.State === 'NY' || item.State === 'NJ'; }

        var skipWhile1 = internal_queryable.skipWhile(predicate1),
            skipWhile2 = internal_queryable.skipWhile(predicate2),
            skipWhile3 = internal_queryable.skipWhile(predicate3);

        skipWhile1.should.have.lengthOf(testData.dataSource.data.length);
        skipWhile1.should.eql(testData.dataSource.data);
        skipWhile2.should.have.lengthOf(0);
        skipWhile3[0].State.should.not.eql('NY');
        skipWhile3[0].State.should.not.eql('NJ');
    });

    it('should take the shortcut if the queryable\'s has been evaluated on skip and skipWhile', function testShortCut() {
        internal_queryable.dataComputed = true;
        internal_queryable.evaluatedData = testData.dataSource.data;

        var skip = internal_queryable.skip(10),
            skipWhile = internal_queryable.skipWhile(function _pred() { return false; });

        skip.should.have.lengthOf(testData.dataSource.data.length - 10);
        skip.should.eql(testData.dataSource.data.slice(10));
        skipWhile.should.have.lengthOf(testData.dataSource.data.length);
        skipWhile.should.eql(testData.dataSource.data);
    });
});