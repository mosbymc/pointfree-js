import { all } from '../../../src/evaluation/all';
import { testData } from '../../testData';

function *gen(data) {
    for (let item of data)
        yield item;
}

function isObject(item) {
    return typeof item === 'object';
}

describe('Test all', function testAll() {
    it('should return false when no predicate is supplied', function testAllWithNoPredicate() {
        all(testData.dataSource.data).should.not.be.true;
    });

    it('should return true when predicate is supplied and data passes', function testAllWithAllDataPassingPredicate() {
        all(testData.dataSource.data, isObject).should.be.true;
    });

    it('should return false when a single item passes predicate', function testAllWithSingleItemPassing() {
        var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, { a: 1 }];
        all(data, isObject).should.not.be.true;
    });

    it('should work with generators', function testAllWithGenerators() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        all(gen([])).should.not.be.true;
        all(gen(testData.dataSource.data)).should.not.be.true;
        all(gen(testData.dataSource.data), isObject).should.be.true;
        all(gen([1, 2, 3, 4, 5, 6, 7, 8, 9]), isObject).should.not.be.true;
    });
});