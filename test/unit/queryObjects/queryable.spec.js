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

queryable.source = testData.dataSource.data;

describe('Test queryable', function testQueryable() {
    it('should create a new queryable delegate', function testObjectDelegation() {
        var concatQueryable = queryable.queryableConcat(testData.dataSource.data),
            exceptQueryable = queryable.queryableExcept(testData.dataSource.data),
            groupJoinQueryable = queryable.queryableGroupJoin(testData.dataSource.data, nameSelector, nameSelector, nameProjector),
            queryableIntersect = queryable.queryableIntersect(testData.dataSource.data),
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
            queryableReverse = queryable.queryableReverse();

        expect(queryable.isPrototypeOf(concatQueryable)).to.be.true;
        expect(queryable.isPrototypeOf(exceptQueryable)).to.be.true;
        expect(queryable.isPrototypeOf(groupJoinQueryable)).to.be.true;
        expect(queryable.isPrototypeOf(queryableIntersect)).to.be.true;
        expect(queryable.isPrototypeOf(queryableJoin)).to.be.true;
        expect(queryable.isPrototypeOf(queryableUnion)).to.be.true;
        expect(queryable.isPrototypeOf(queryableZip)).to.be.true;
        expect(queryable.isPrototypeOf(queryableWhere)).to.be.true;
        expect(queryable.isPrototypeOf(queryableDistinct)).to.be.true;
        queryableAll.should.be.true;
        queryableAny.should.be.true;
        queryableFirst.should.eql(testData.dataSource.data[0]);
        queryableLast.should.eql(testData.dataSource.data[testData.dataSource.data.length - 1]);
        queryableToArray.should.eql(testData.dataSource.data);
        queryableToSet.should.eql(new Set(testData.dataSource.data));
        queryableReverse.should.eql(testData.dataSource.data.reverse());
    });

    it('should have a functioning take', function testQueryablesTake() {
        var noItems = queryable.queryableTake(0),
            singleItem = queryable.queryableTake(),
            fiveItems = queryable.queryableTake(5),
            allItems = queryable.queryableTake(testData.dataSource.data.length);

        expect(noItems).to.be.undefined;
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
        console.log(takeWhile2);
        //takeWhile2.should.have.lengthOf(testData.dataSource.data.length);
        //takeWhile2.should.eql(testData.dataSource.data);
        takeWhile3.forEach(function _checkDrillDownLength(item) {
            item.drillDownData.length.should.be.at.least(5);
        });
        takeWhile4.forEach(function _checkFirstNames(item) {
            item.FirstName.should.not.eql('Mark');
        });
    });


});