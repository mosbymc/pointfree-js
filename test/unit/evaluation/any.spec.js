import { any } from '../../../src/evaluation/any';
import { testData } from '../../testData';

function isObject(item) {
    return typeof item === 'object';
}

describe('Test any', function testAny() {
    it('should return true when no predicate is supplied and data exists', function testAnyWithDataAndNoPredicate() {
        any(testData.dataSource.data).should.be.true;
    });

    it('should return false when no predicate is supplied and no data exists', function testAnyWithNoDataAndNoPredicate() {
        any([]).should.not.be.true;
    });

    it('should return true when a single item passes predicate', function testAnyWithSingleItemPassing() {
        var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, { a: 1 }];
        any(data, isObject).should.be.true;
    });

    it('should return false if no items pass test', function testAnyWithNoItemsPassing() {
        any([1, 2, 3, 4, 5, 6, 7, 8, 9], isObject).should.not.be.true;
    });

    it('should work with generators', function testAnyWithGenerators() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        any(gen([])).should.not.be.true;
        any(gen(testData.dataSource.data)).should.be.true;
        any(gen(testData.dataSource.data), isObject).should.be.true;
        any(gen([1, 2, 3, 4, 5, 6, 7, 8, 9]), isObject).should.not.be.true;
    });
});