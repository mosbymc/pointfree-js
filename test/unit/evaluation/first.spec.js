import { first } from '../../../src/evaluation/first';
import { testData } from '../../testData';

function predicate() { return false; }

describe('Test first', function testFirst() {
    it('should return first item from source when no predicate is passed', function testFirstWithNoPredicate() {
        var firstRes = first(testData.dataSource.data);
        firstRes.should.be.an('object');
        firstRes.should.eql(testData.dataSource.data[0]);
    });

    it('should return undefined when empty source is supplied', function testFirstWithEmptySource() {
        var firstRes = first([]);
        expect(firstRes).to.be.undefined;
    });

    it('should return undefined if no item passes predicate', function testFirstWithNonPassablePredicate() {
        var firstRes = first(testData.dataSource.data, predicate);
        expect(firstRes).to.be.undefined;
    });

    it('should work with generators', function testFirstWithGenerators() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        var firstRes1 = first(gen(testData.dataSource.data)),
            firstRes2 = first(gen([])),
            firstRes3 = first(gen(testData.dataSource.data), predicate);

        firstRes1.should.be.an('object');
        firstRes1.should.eql(testData.dataSource.data[0]);
        expect(firstRes2).to.be.undefined;
        expect(firstRes3).to.be.undefined;
    });
});