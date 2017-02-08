import { last } from '../../../src/evaluation/last';
import { testData } from '../../testData';

function predicate() { return false; }

describe('Test last', function testLast() {
    it('should return last item from source when no predicate is passed', function testLastWithNoPredicate() {
        var firstRes = last(testData.dataSource.data);
        firstRes.should.be.an('object');
        firstRes.should.eql(testData.dataSource.data[testData.dataSource.data.length - 1]);
    });

    it('should return undefined when empty source is supplied', function testLastWithEmptySource() {
        var firstRes = last([]);
        expect(firstRes).to.be.undefined;
    });

    it('should return undefined if no item passes predicate', function testLastWithNonPassablePredicate() {
        var firstRes = last(testData.dataSource.data, predicate);
        expect(firstRes).to.be.undefined;
    });

    it('should work with generators', function testLastWithGenerators() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        var firstRes1 = last(gen(testData.dataSource.data)),
            firstRes2 = last(gen([])),
            firstRes3 = last(gen(testData.dataSource.data), predicate);

        firstRes1.should.be.an('object');
        firstRes1.should.eql(testData.dataSource.data[testData.dataSource.data.length - 1]);
        expect(firstRes2).to.be.undefined;
        expect(firstRes3).to.be.undefined;
    });
});