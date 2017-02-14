import { queryable } from '../../../src/queryObjects/queryable';
import { createNewQueryableDelegator } from '../../../src/queryObjects/queryObjectCreators';
import { testData } from '../../testData';

var firstThird = testData.dataSource.data.slice(0, testData.dataSource.data.length / 3);

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
});