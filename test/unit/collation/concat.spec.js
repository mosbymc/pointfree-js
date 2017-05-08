import { concat } from '../../../src/collation/concat';
import { testData } from '../../testData';

describe('Test concat...', function testConcat() {
    function *gen(data) {
        for (let item of data)
            yield item;
    }

    it('should return test data x 2', function testConcatSourceWithItself() {
        var concatIterable = concat(testData.dataSource.data, testData.dataSource.data, 1),
            concatRes = Array.from(concatIterable());

        concatRes.should.have.lengthOf(testData.dataSource.data.length * 2);
        concatRes.slice(0, testData.dataSource.data.length).should.eql(testData.dataSource.data);
        concatRes.slice(testData.dataSource.data.length).should.eql(testData.dataSource.data);
    });

    it('should concat sources of different value types', function testConcatWithDifferingValueTypes() {
        var concatIterable = concat(testData.dataSource.data, [1, 2, 3, 4, 5], 1),
            concatRes = Array.from(concatIterable());

        concatRes.should.have.lengthOf(testData.dataSource.data.length + 5);
        concatRes.slice(0, testData.dataSource.data.length).should.eql(testData.dataSource.data);
        concatRes.slice(testData.dataSource.data.length).should.eql([1, 2, 3, 4, 5]);
    });

    it('should return test data when second param is empty array', function testConcatWithSecondParameterAnEmptyArray() {
        var concatIterable = concat(testData.dataSource.data, [], 1),
            concatRes = Array.from(concatIterable());

        concatRes.should.have.lengthOf(testData.dataSource.data.length);
        concatRes.should.eql(testData.dataSource.data);
    });

    it('should return test data when first param is empty and second param is test data', function testConcatWithFirstParameterAnEmptyArray() {
        var concatIterable = concat([], testData.dataSource.data, 1),
            concatRes = Array.from(concatIterable());

        concatRes.should.have.lengthOf(testData.dataSource.data.length);
        concatRes.should.eql(testData.dataSource.data);
    });

    it('should return test data when first param is an empty generator', function testConcatWithFirstParameterAnEmptyGenerator() {
        var concatIterable = concat(gen([]), testData.dataSource.data, 1),
            concatRes = Array.from(concatIterable());

        concatRes.should.have.lengthOf(testData.dataSource.data.length);
        concatRes.should.eql(testData.dataSource.data);
    });

    it('should return test data when second param is an empty generator', function testConcatWithSecondParameterAnEmptyGenerator() {
        var concatIterable = concat(testData.dataSource.data, gen([]), 1),
            concatRes = Array.from(concatIterable());

        concatRes.should.have.lengthOf(testData.dataSource.data.length);
        concatRes.should.eql(testData.dataSource.data);
    });

    it('should return test data x 2 when fed two generators', function testConcatWithTwoGenerators() {
        var concatIterable = concat(gen(testData.dataSource.data), gen(testData.dataSource.data), 1),
            concatRes = Array.from(concatIterable());

        concatRes.should.have.lengthOf(testData.dataSource.data.length * 2);
        concatRes.slice(0, testData.dataSource.data.length).should.eql(testData.dataSource.data);
        concatRes.slice(testData.dataSource.data.length).should.eql(testData.dataSource.data);
    });
});