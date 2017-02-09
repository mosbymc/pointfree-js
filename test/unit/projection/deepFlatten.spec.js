import { deepFlatten } from '../../../src/projection/deepFlatten';
import { testData } from '../../testData';

describe('Test deepFlatten', function testDeepFlatten() {
    it('should act as identity for already flat data', function testDeepFlattenWithFlatData() {
        var deepFlattenIterable = deepFlatten(testData.dataSource.data),
            deepFlattenRes = Array.from(deepFlattenIterable());

        deepFlattenRes.should.have.lengthOf(testData.dataSource.data.length);
        deepFlattenRes.should.eql(testData.dataSource.data);
    });

    it('should flatten an array that contains arrays', function testFlattenWithNestedArrays() {
        var data = [];
        data[0] = testData.dataSource.data.slice(0, 10);
        data[1] = testData.dataSource.data.slice(10, 20);
        data[2] = testData.dataSource.data.slice(20, 30);
        data[3] = testData.dataSource.data.slice(30, 40);
        data[4] = testData.dataSource.data.slice(40);
        var flattenIterable = deepFlatten(data, 2),
            flattenRes = Array.from(flattenIterable());

        flattenRes.should.have.lengthOf(testData.dataSource.data.length);
        flattenRes.should.eql(testData.dataSource.data);
    });
});