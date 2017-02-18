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

        var concatQueryable = queryable.queryableConcat(testData.dataSource.data),
            exceptQueryable = queryable.queryableExcept(testData.dataSource.data),
            groupJoinQueryable = queryable.queryableGroupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector, comparer),
            queryableIntersect = queryable.queryableIntersect(testData.dataSource.data),
            queryableGroupJoin = queryable.queryableGroupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector, comparer),
            queryableJoin = queryable.queryableJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            queryableUnion = queryable.queryableUnion(testData.dataSource.data),
            queryableZip = queryable.queryableZip(testData.dataSource.data, nameSelector),
            queryableWhere = queryable.queryableWhere(namePredicate),
            queryableDistinct = queryable.queryableDistinct(),
            queryableAll = queryable.queryableAll(isObject),
            queryableAny = queryable.queryableAny(isObject),
            queryableFirst = queryable.queryableFirst(isObject),
            queryableLast = queryable.queryableLast(isObject),
            queryableToArray = queryable.queryableToArray(),
            queryableToSet = queryable.queryableToSet(),
            queryableReverse = queryable.queryableReverse(),
            queryableMap = queryable.queryableMap(function (item) { return item; }),
            queryableGroupBy = queryable.queryableGroupBy(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableGroupByDescending = queryable.queryableGroupByDescending(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableOrderBy = queryable.queryableOrderBy(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableOrderByDescending = queryable.queryableOrderByDescending(function selector(item) { return item.FirstName; }, function comparer(a, b) { return a <= b; }),
            queryableFlatten = queryable.queryableFlatten(),
            queryableDeepFlatten = queryable.queryableFlattenDeep();

        //queryable object functions that return a new queryable object delegator; check to make sure the
        //returned object delegates to the queryable object.
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
        expect(queryable.isPrototypeOf(queryableDistinct)).to.be.true;
        queryableDistinct.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableMap)).to.be.true;
        queryableMap.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableGroupBy)).to.be.true;
        queryableGroupBy.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableGroupByDescending)).to.be.true;
        queryableGroupByDescending.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableOrderBy)).to.be.true;
        queryableOrderBy.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableOrderByDescending)).to.be.true;
        queryableOrderByDescending.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableFlatten)).to.be.true;
        queryableFlatten.dataComputed.should.be.false;
        expect(queryable.isPrototypeOf(queryableDeepFlatten)).to.be.true;
        queryableDeepFlatten.dataComputed.should.be.false;

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
        var noItems = queryable.queryableTake(0),
            singleItem = queryable.queryableTake(1),
            fiveItems = queryable.queryableTake(5),
            allItems = queryable.queryableTake(testData.dataSource.data.length);

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

        var takeWhile1 = queryable.queryableTakeWhile(predicate1),
            takeWhile2 = queryable.queryableTakeWhile(predicate2),
            takeWhile3 = queryable.queryableTakeWhile(predicate3),
            takeWhile4 = queryable.queryableTakeWhile(predicate4);

        takeWhile1.should.have.lengthOf(0);
        //takeWhile2.should.have.lengthOf(testData.dataSource.data.length);
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

        var take = queryable.queryableTake(5),
            takeWhile = queryable.queryableTakeWhile(function _takeWhile(item) {
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
        var allItems = queryable.queryableSkip(0),
            lessOne = queryable.queryableSkip(1),
            lessFive = queryable.queryableSkip(5),
            noItems = queryable.queryableSkip(testData.dataSource.data.length);

        allItems.should.have.lengthOf(testData.dataSource.data.length);
        allItems.should.eql(testData.dataSource.data);
        lessOne.should.have.lengthOf(testData.dataSource.data.length - 1);
        lessOne.should.eql(testData.dataSource.data.slice(1));
        lessFive.should.have.lengthOf(testData.dataSource.data.length - 5);
        lessFive.should.eql(testData.dataSource.data.slice(5));
        noItems.should.have.lengthOf(0);
    });

    it('should have a functioning ski[ while', function testQueryableSkipWhile() {
        queryable.dataComputed = false;
        function predicate1() { return false; }
        function predicate2() { return true; }
        function predicate3(item) { return item.State === 'NY' || item.State === 'NJ'; }

        var skipWhile1 = queryable.queryableSkipWhile(predicate1),
            skipWhile2 = queryable.queryableSkipWhile(predicate2),
            skipWhile3 = queryable.queryableSkipWhile(predicate3);

        skipWhile1.should.have.lengthOf(testData.dataSource.data.length);
        skipWhile1.should.eql(testData.dataSource.data);
        skipWhile2.should.have.lengthOf(0);
        skipWhile3[0].State.should.not.eql('NY');
        skipWhile3[0].State.should.not.eql('NJ');
    });

    it('should take the shortcut if the queryable\'s has been evaluated on skip and skipWhile', function testShortCut() {
        queryable.dataComputed = true;
        queryable.evaluatedData = testData.dataSource.data;

        var skip = queryable.queryableSkip(10),
            skipWhile = queryable.queryableSkipWhile(function _pred() { return false; });

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