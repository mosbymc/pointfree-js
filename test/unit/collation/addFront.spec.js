import { addFront } from '../../../src/collation/addFront';
import { testData } from '../../testData';

describe('Test addFront...', function testAddFront() {
    function *gen(data) {
        for (let item of data)
            yield item;
    }

    it('should return test data x 2', function testConcatSourceWithItself() {
        var addFrontIterable = addFront(testData.dataSource.data, testData.dataSource.data),
            addFrontRes = Array.from(addFrontIterable());

        addFrontRes.should.have.lengthOf(testData.dataSource.data.length * 2);
        addFrontRes.slice(0, testData.dataSource.data.length).should.eql(testData.dataSource.data);
        addFrontRes.slice(testData.dataSource.data.length).should.eql(testData.dataSource.data);
    });

    it('should concat sources of different value types', function testConcatWithDifferingValueTypes() {
        var addFrontIterable = addFront(testData.dataSource.data, [1, 2, 3, 4, 5]),
            addFrontRes = Array.from(addFrontIterable());

        addFrontRes.should.have.lengthOf(testData.dataSource.data.length + 5);
        addFrontRes.slice(5).should.eql(testData.dataSource.data);
        addFrontRes.slice(0, 5).should.eql([1, 2, 3, 4, 5]);
    });

    it('should return test data when second param is empty array', function testConcatWithSecondParameterAnEmptyArray() {
        var addFrontIterable = addFront(testData.dataSource.data, []),
            addFrontRes = Array.from(addFrontIterable());

        addFrontRes.should.have.lengthOf(testData.dataSource.data.length);
        addFrontRes.should.eql(testData.dataSource.data);
    });

    it('should return test data when first param is empty and second param is test data', function testConcatWithFirstParameterAnEmptyArray() {
        var addFrontIterable = addFront([], testData.dataSource.data),
            addFrontRes = Array.from(addFrontIterable());

        addFrontRes.should.have.lengthOf(testData.dataSource.data.length);
        addFrontRes.should.eql(testData.dataSource.data);
    });

    it('should return test data when first param is an empty generator', function testConcatWithFirstParameterAnEmptyGenerator() {
        var addFrontIterable = addFront(gen([]), testData.dataSource.data),
            addFrontRes = Array.from(addFrontIterable());

        addFrontRes.should.have.lengthOf(testData.dataSource.data.length);
        addFrontRes.should.eql(testData.dataSource.data);
    });

    it('should return test data when second param is an empty generator', function testConcatWithSecondParameterAnEmptyGenerator() {
        var addFrontIterable = addFront(testData.dataSource.data, gen([])),
            addFrontRes = Array.from(addFrontIterable());

        addFrontRes.should.have.lengthOf(testData.dataSource.data.length);
        addFrontRes.should.eql(testData.dataSource.data);
    });

    it('should return test data x 2 when fed two generators', function testConcatWithTwoGenerators() {
        var addFrontIterable = addFront(gen(testData.dataSource.data), gen(testData.dataSource.data)),
            addFrontRes = Array.from(addFrontIterable());

        addFrontRes.should.have.lengthOf(testData.dataSource.data.length * 2);
        addFrontRes.slice(0, testData.dataSource.data.length).should.eql(testData.dataSource.data);
        addFrontRes.slice(testData.dataSource.data.length).should.eql(testData.dataSource.data);
    });
});