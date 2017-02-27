import { internal_queryable, internal_orderedQueryable } from '../../../src/queryObjects/queryable';
import { createNewQueryableDelegator } from '../../../src/queryObjects/queryObjectCreators';
import { testData } from '../../testData';

var firstThird = testData.dataSource.data.slice(0, testData.dataSource.data.length / 3);
var drillDownData = Array.prototype.concat.apply([], testData.dataSource.data.map(function _getDrillDownData(item) {
    return item.drillDownData;
}));

describe('Test queryable object function chaining', function testQueryable() {
    it('should work', function pleaseWork() {

        var queryRes = createNewQueryableDelegator(testData.dataSource.data)
            .groupBy(function state(item) {
                return item.State;
            }, function comparer(a, b) {
                return a <= b;
            })
            .flatten()
            .intersect(firstThird, function _comparer(a, b) {
                return a.FirstName === b.FirstName;
            }).data;

        expect(internal_queryable.isPrototypeOf(queryRes)).to.not.be.true;
        queryRes.should.be.an('array');
        queryRes.should.have.lengthOf(firstThird.length);
        queryRes.should.not.eql(firstThird);    //due to grouping/flattening

        //this is due to the cloning that takes place; this is ensuring that the data in one queryable
        //will not be affected by the operations on another queryable in the chain
        queryRes.forEach(function validateExists(item) {
            firstThird.some(function _findMatch(it) {
                return it === item;
            }).should.be.not.true;
        });
    });

    it('should chain some more functions', function testMoreFunctionChaining() {
        var prevName = '';
        var base = createNewQueryableDelegator(testData.dataSource.data),
            q1 = base.where(function _pred(item) {
                return item.FirstName === 'Mark' || item.State === 'NY';
            }),
            q2 = q1.orderBy(function _keySelector(item) {
                return item.LastName;
            }, function _comparer(a, b) {
                return a <= b;
            }),
            q3 = q2.map(function _fn(item) {
                return item.drillDownData;
            }),
            q4 = q3.flatten(),
            q5 = q4.where(function _pred(item) {
                return item.Year < '2005';
            });

        base.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(base)).to.be.true;
        expect(internal_queryable.isPrototypeOf(base)).to.be.true;
        q1.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(q1)).to.be.true;
        q2.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(q2)).to.be.false;
        expect(internal_orderedQueryable.isPrototypeOf(q2)).to.be.true;
        q3.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(q3)).to.be.true;
        q4.dataComputed.should.be.false;
        expect(internal_queryable.isPrototypeOf(q4)).to.be.true;

        expect(q1.evaluatedData).to.be.undefined;
        expect(q2.evaluatedData).to.be.undefined;
        expect(q3.evaluatedData).to.be.undefined;
        expect(q4.evaluatedData).to.be.undefined;

        var q1Data = q1.data,
            q2Data = q2.data,
            q3Data = q3.data,
            q4Data = q4.data,
            q5Data = q5.data,
            q6Data = q5.data;

        q1.evaluatedData.should.eql(q1Data);
        q1.dataComputed.should.be.true;
        q2.evaluatedData.should.eql(q2Data);
        q2.dataComputed.should.be.true;
        q3.evaluatedData.should.eql(q3Data);
        q3.dataComputed.should.be.true;
        q4.evaluatedData.should.eql(q4Data);
        q4.dataComputed.should.be.true;
        q5.evaluatedData.should.eql(q5Data);
        q5.dataComputed.should.be.true;
        q5.evaluatedData.should.eql(q6Data);
        q6Data.should.eql(q5Data);

        q1Data.should.be.an('array');
        q2Data.should.be.an('array');
        q3Data.should.be.an('array');
        q4Data.should.be.an('array');
        q5Data.should.be.an('array');

        q1Data.length.should.be.lessThan(testData.dataSource.data.length);
        q3Data.length.should.be.lessThan(drillDownData.length);
        q4Data.length.should.be.lessThan(drillDownData.length);
        q5Data.length.should.be.lessThan(drillDownData.length);

        q1Data.forEach(function _validateResults(item) {
            expect(item.FirstName === 'Mark' || item.State === 'NY').to.be.true;
        });
        q2Data.forEach(function _validateResults(item) {
            if (prevName === '') prevName = item.LastName;
            item.LastName.should.be.at.least(prevName);
        });
        q3Data.forEach(function _validateResults(item) {
            item.should.be.an('array');
            item.forEach(function validateItem(it) {
                it.MechanicName.should.not.be.undefined;
                it.Make.should.not.be.undefined;
                it.Model.should.not.be.undefined;
                it.Year.should.not.be.undefined;
                it.Doors.should.not.be.undefined;
                it.EngineType.should.not.be.undefined;
                it.EngineSize.should.not.be.undefined;
            });
        });
        q4Data.forEach(function _validateResults(item) {
            item.MechanicName.should.not.be.undefined;
            item.Make.should.not.be.undefined;
            item.Model.should.not.be.undefined;
            item.Year.should.not.be.undefined;
            item.Doors.should.not.be.undefined;
            item.EngineType.should.not.be.undefined;
            item.EngineSize.should.not.be.undefined;
        });
        q5Data.forEach(function _validateResults(item) {
            item.Year.should.be.at.most('2005');
        });
    });
});