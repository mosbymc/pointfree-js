import { where } from '../../../src/limitation/where';
import { testData } from '../../testData';

var markData = testData.dataSource.data.filter(function _filterFullName(item) {
    return item.FirstName === 'Mark' && item.LastName === 'Mosby';
});

var newNewYorkData = testData.dataSource.data.filter(function _filterCity(item) {
    return item.City === 'New New York';
});

var leelaAndNewYork = testData.dataSource.data.filter(function _leelaNewYorkFilter(item) {
    return item.LastName === 'Leela' && item.City === 'New New York';
});

describe('Test where...', function testWhere() {
    it('should return all items if predicate is always true', function testWhereWithAlwaysTruePredicate() {
        var whereIterable = where(testData.dataSource.data, function _true() { return true; }),
            whereRes = Array.from(whereIterable());

        whereRes.should.have.lengthOf(testData.dataSource.data.length);
        whereRes.should.eql(testData.dataSource.data);
    });

    it('should return no items if predicate is always false', function testWhereWithAlwaysFalsePredicate() {
        var whereIterable = where(testData.dataSource.data, function _false() { return false; }),
            whereRes = Array.from(whereIterable());

        whereRes.should.have.lengthOf(0);
    });

    it('should return all items with full name = Mark Mosby', function testWhereWithFullNamePredicate() {
        var whereIterable = where(testData.dataSource.data, function _name(item) { return item.FirstName === 'Mark' && item.LastName === 'Mosby'; }),
            whereRes = Array.from(whereIterable());

        whereRes.should.have.lengthOf(markData.length);
        whereRes.should.eql(markData);
    });

    it('should return all items with city = New New York', function testWhereWithCityPredicate() {
        var whereIterable = where(testData.dataSource.data, function _city(item) { return item.City === 'New New York'; }),
            whereRes = Array.from(whereIterable());

        whereRes.should.have.lengthOf(newNewYorkData.length);
        whereRes.should.eql(newNewYorkData);
    });

    it('should return empty array when source is empty', function testWhereWithEmptySource() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        var whereIterable1 = where([], function _true() {  return true; }),
            whereIterable2 = where(gen([]), function _true() { return true; }),
            whereRes1 = Array.from(whereIterable1()),
            whereRes2 = Array.from(whereIterable2());

        whereRes1.should.have.lengthOf(0);
        whereRes2.should.have.lengthOf(0);
    });

    it('should no items if predicate is checking property that does not exist', function testWhereWithNoPropPredicate() {
        var whereIterable = where(testData.dataSource.data, function _noProp(item) { return item.Face === 0; }),
            whereRes = Array.from(whereIterable());

        whereRes.should.have.lengthOf(0);
    });

    it('should return all items with last name = Leela and city = New New York', function testWhereWithTwoProps() {
        var whereIterable = where(testData.dataSource.data, function _nameAndCity(item) { return item.LastName === 'Leela' && item.City === 'New New York'; }),
            whereRes = Array.from(whereIterable());

        whereRes.should.have.lengthOf(leelaAndNewYork.length);
        whereRes.should.eql(leelaAndNewYork);
    });
});