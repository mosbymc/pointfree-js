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

function comparer(a, b) {
    return a === b;
}

function isObject(item) {
    return 'object' === typeof item;
}

beforeEach(function setSource() {
    queryable.source = testData.dataSource.data;
});

describe('Test queryable', function testQueryable() {
    it('should create a new queryable delegate', function testObjectDelegation() {
        expect(queryable.dataComputed).to.be.undefined;
        expect(queryable.evaluatedData).to.be.undefined;

        var queryableAddFront = queryable.addFront([1, 2, 3, 4, 5]),
            concatQueryable = queryable.concat(testData.dataSource.data),
            exceptQueryable = queryable.except(testData.dataSource.data),
            groupJoinQueryable = queryable.groupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector, comparer),
            queryableIntersect = queryable.intersect(testData.dataSource.data),
            queryableGroupJoin = queryable.groupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector, comparer),
            queryableJoin = queryable.join(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            queryableUnion = queryable.union(testData.dataSource.data),
            queryableZip = queryable.zip(testData.dataSource.data, nameSelector),
            queryableWhere = queryable.where(namePredicate),
            queryableOfType = queryable.ofType('object'),
            queryableDistinct = queryable.distinct(),
            queryableAll = queryable.all(isObject),
            queryableAny = queryable.any(isObject),
            queryableContains = queryable.contains(testData.dataSource.data[0]),
            queryableFold = queryable.fold(function _fold(val, cur, idx){ return val + idx}, 0),
            queryableFirst = queryable.first(isObject),
            queryableLast = queryable.last(isObject),
            queryableLength = queryable.count(),
            queryableToArray = queryable.toArray(),
            queryableToSet = queryable.toSet(),
            queryableReverse = queryable.reverse(),
            queryableDeepMap = queryable.deepMap(function() {}),
            queryableMap = queryable.map(function (item) { return item; }),
            queryableGroupBy = queryable.groupBy(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableGroupByDescending = queryable.groupByDescending(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableOrderBy = queryable.orderBy(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableOrderByDescending = queryable.orderByDescending(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableFlatten = queryable.flatten(),
            queryableDeepFlatten = queryable.deepFlatten();

        //queryable object functions that return a new queryable object delegator; check to make sure the
        //returned object delegates to the queryable object.
        expect(queryable.isPrototypeOf(queryableAddFront)).to.be.true;
        queryableAddFront.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(concatQueryable)).to.be.true;
        concatQueryable.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(exceptQueryable)).to.be.true;
        exceptQueryable.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(groupJoinQueryable)).to.be.true;
        groupJoinQueryable.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableIntersect)).to.be.true;
        queryableIntersect.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableGroupJoin)).to.be.true;
        queryableGroupJoin.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableJoin)).to.be.true;
        queryableJoin.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableUnion)).to.be.true;
        queryableUnion.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableZip)).to.be.true;
        queryableZip.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableWhere)).to.be.true;
        queryableWhere.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableOfType)).to.be.true;
        queryableOfType.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableDistinct)).to.be.true;
        queryableDistinct.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableDeepMap)).to.be.true;
        queryableDeepMap.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableMap)).to.be.true;
        queryableMap.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableGroupBy)).to.be.true;
        queryableGroupBy.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableGroupByDescending)).to.be.true;
        queryableGroupByDescending.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableOrderBy)).to.be.false;
        queryableOrderBy.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableOrderByDescending)).to.be.false;
        queryableOrderByDescending.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableFlatten)).to.be.true;
        queryableFlatten.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableDeepFlatten)).to.be.true;
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

    it('should properly extend the queryable object', function testQueryableExtension() {
        queryable.extend('testFunc', function _testFunc(source) {
            return function *testFuncIterator() {
                for (let item of source) yield item;
            }
        });

        var q1 = queryable.from(testData.dataSource.data),
            q2 = q1.testFunc(),
            q2Data = q2.data;

        expect(queryable.isPrototypeOf(q2)).to.be.true;
        q2Data.should.have.lengthOf(testData.dataSource.data.length);
        q2Data.should.eql(testData.dataSource.data);
    });

    it('should have a functioning take', function testQueryablesTake() {
        var noItems = queryable.take(0),
            singleItem = queryable.take(1),
            fiveItems = queryable.take(5),
            allItems = queryable.take(testData.dataSource.data.length);

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

        var takeWhile1 = queryable.takeWhile(predicate1),
            takeWhile2 = queryable.takeWhile(predicate2),
            takeWhile3 = queryable.takeWhile(predicate3),
            takeWhile4 = queryable.takeWhile(predicate4);

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
        queryable.dataComputed = true;
        queryable.evaluatedData = testData.dataSource.data;

        var take = queryable.take(5),
            takeWhile = queryable.takeWhile(function _takeWhile(item) {
                return item.FirstName !== 'Mark';
            });

        take.should.have.lengthOf(5);
        take.should.eql(testData.dataSource.data.slice(0, 5));

        takeWhile.forEach(function _validateResult(item) {
            item.FirstName.should.not.eql('Mark');
        }) ;
    });

    it('should have a functioning skip', function testSkip() {
        queryable.dataComputed = false;
        var allItems = queryable.skip(0),
            lessOne = queryable.skip(1),
            lessFive = queryable.skip(5),
            noItems = queryable.skip(testData.dataSource.data.length);

        allItems.should.have.lengthOf(testData.dataSource.data.length);
        allItems.should.eql(testData.dataSource.data);
        lessOne.should.have.lengthOf(testData.dataSource.data.length - 1);
        lessOne.should.eql(testData.dataSource.data.slice(1));
        lessFive.should.have.lengthOf(testData.dataSource.data.length - 5);
        lessFive.should.eql(testData.dataSource.data.slice(5));
        noItems.should.have.lengthOf(0);
    });

    it('should have a functioning skip while', function testQueryableSkipWhile() {
        queryable.dataComputed = false;
        function predicate1() { return false; }
        function predicate2() { return true; }
        function predicate3(item) { return item.State === 'NY' || item.State === 'NJ'; }

        var skipWhile1 = queryable.skipWhile(predicate1),
            skipWhile2 = queryable.skipWhile(predicate2),
            skipWhile3 = queryable.skipWhile(predicate3);

        skipWhile1.should.have.lengthOf(testData.dataSource.data.length);
        skipWhile1.should.eql(testData.dataSource.data);
        skipWhile2.should.have.lengthOf(0);
        skipWhile3[0].State.should.not.eql('NY');
        skipWhile3[0].State.should.not.eql('NJ');
    });

    it('should take the shortcut if the queryable\'s has been evaluated on skip and skipWhile', function testShortCut() {
        queryable.dataComputed = true;
        queryable.evaluatedData = testData.dataSource.data;

        var skip = queryable.skip(10),
            skipWhile = queryable.skipWhile(function _pred() { return false; });

        skip.should.have.lengthOf(testData.dataSource.data.length - 10);
        skip.should.eql(testData.dataSource.data.slice(10));
        skipWhile.should.have.lengthOf(testData.dataSource.data.length);
        skipWhile.should.eql(testData.dataSource.data);
    });

    it('should create a new queryable delegator object with appropriate source form', function testQueryableDotFrom() {
        function genWrapper(data) {
            return function *genny() {
                for (let item of data)
                    yield item;
            }
        }

        var stringSource = 'This is a stringy source';

        var q1 = queryable.from(testData.dataSource.data),
            q2 = queryable.from(genWrapper(testData.dataSource.data)),
            q3 = queryable.from(q1),
            q4 = queryable.from(),
            q5 = queryable.from(null),
            q6 = queryable.from({ a: 1, b: 2}),
            q7 = queryable.from(stringSource),
            q8 = queryable.from(1),
            q9 = queryable.from(false);

        q1.source.should.eql(testData.dataSource.data);
        q2.source.should.not.eql(testData.dataSource.data);
        q3.source.should.eql(q1);
        q4.source.should.be.an('array');
        q4.source.should.have.lengthOf(0);
        q5.source.should.be.an('array');
        q5.source.should.have.lengthOf(1);
        q6.source.should.be.an('array');
        q6.source.should.have.lengthOf(1);
        q7.source.should.be.an('array');
        q7.source.should.have.lengthOf(stringSource.length);
        q8.source.should.be.an('array');
        q8.source.should.have.lengthOf(1);
        q9.source.should.be.an('array');
        q9.source.should.have.lengthOf(1);
    });
});