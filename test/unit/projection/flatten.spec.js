import { flatten } from '../../../src/projection/flatten';
import { testData } from '../../testData';

describe('Test flatten', function testFlatten() {
    it('should act as identity with already flat data', function testFlattenWithFlatData() {
        var flattenIterable = flatten(testData.dataSource.data),
            flattenRes = Array.from(flattenIterable());

        flattenRes.should.have.lengthOf(testData.dataSource.data.length);
        flattenRes.should.eql(testData.dataSource.data);
    });

    it('should flatten an array that contains arrays', function testFlattenWithNestedArrays() {
        var data = [];
        data[0] = testData.dataSource.data.slice(0, 10);
        data[1] = testData.dataSource.data.slice(10, 20);
        data[2] = testData.dataSource.data.slice(20, 30);
        data[3] = testData.dataSource.data.slice(30, 40);
        data[4] = testData.dataSource.data.slice(40);
        var flattenIterable = flatten(data),
            flattenRes = Array.from(flattenIterable());

        flattenRes.should.have.lengthOf(testData.dataSource.data.length);
        flattenRes.should.eql(testData.dataSource.data);
    });

    it('should only flatten a nested array a single level', function testFlattenWithMultiLevelNestedArrays() {
        var data = [
            [
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9]
            ],
            [
                [10, 11, 12],
                [13, 14, 15],
                [16, 17, 18]
            ]
        ];

        var flattenIterable = flatten(data),
            flattenRes = Array.from(flattenIterable());

        flattenRes.should.have.lengthOf(data.reduce(function aggregateLengths(prev, curr) {
            return prev + curr.length;
        }, 0));

        var lastVal = 0;
        flattenRes.every(function validateProperOrdering(item) {
            return item.every(function validateProperOrdering(it) {
                it.should.eql(1 + lastVal);
                if (it === 1 + lastVal) {
                    lastVal = it;
                    return true;
                }
                return false;
            });
        }).should.be.true;
    });

    it('should work with generators', function testFlattenWithGenerators() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        var data1 = [];
        data1[0] = testData.dataSource.data.slice(0, 10);
        data1[1] = testData.dataSource.data.slice(10, 20);
        data1[2] = testData.dataSource.data.slice(20, 30);
        data1[3] = testData.dataSource.data.slice(30, 40);
        data1[4] = testData.dataSource.data.slice(40);

        var data2 = [
            [ [1, 2, 3], [4, 5, 6], [7, 8, 9] ],
            [ [10, 11, 12], [13, 14, 15], [16, 17, 18] ]
        ];

        var flattenIterable1 = flatten(gen(testData.dataSource.data)),
            flattenIterable2 = flatten(gen(data1)),
            flattenIterable3 = flatten(gen(data2)),
            flattenRes1 = Array.from(flattenIterable1()),
            flattenRes2 = Array.from(flattenIterable2()),
            flattenRes3 = Array.from(flattenIterable3());

        flattenRes1.should.have.lengthOf(testData.dataSource.data.length);
        flattenRes1.should.eql(testData.dataSource.data);

        flattenRes2.should.have.lengthOf(testData.dataSource.data.length);
        flattenRes2.should.eql(testData.dataSource.data);

        flattenRes3.should.have.lengthOf(data2.reduce(function aggregateLengths(prev, curr) {
            return prev + curr.length;
        }, 0));

        var lastVal = 0;
        flattenRes3.every(function validateProperOrdering(item) {
            return item.every(function validateProperOrdering(it) {
                it.should.eql(1 + lastVal);
                if (it === 1 + lastVal) {
                    lastVal = it;
                    return true;
                }
                return false;
            });
        }).should.be.true;
    });
});