import { deepFlatten } from '../../../src/projection/deepFlatten';
import { testData } from '../../testData';

var multi_nested_data = [
    [
        {
            a: [ [1, 2, 3], [4, 5, 6], [7, 8, 9] ],
            b: [ [10, 11, 12], [13, 14, 15], [16, 17, 18] ],
            c: [ [19, 20, 21], [22, 23, 24], [25, 26, 27] ],
            d: [82, 83, 84, 85, 86]
        },
        {
            a: [ [28, 29, 30], [31, 32, 33], [34, 35, 36] ],
            b: [ [37, 38, 39], [40, 41, 42], [43, 44, 45] ],
            c: [ [46, 47, 48], [49, 50, 51], [52, 53, 54] ],
            d: [87, 88, 89, 90, 91]
        },
        {
            a: [ [55, 56, 57], [58, 59, 60], [61, 62, 63] ],
            b: [ [64, 65, 66], [67, 68, 69], [70, 71, 72] ],
            c: [ [73, 74, 75], [76, 77, 78], [79, 80, 81] ],
            d: [92, 93, 94, 95, 96]
        },
        97,
        98,
        99,
        100,
        101,
        [102, 103, 104, 105, 106, [107, 108, 109, 110, 111, [112, 113, 114, 115, 116, 117, 118, 119, 120, 121] ] ]
    ],
    {
        a: [122, 123, 124, 125, 126],
        b: [127, [128, [129, [130, [131, [132, [133, [134, [135] ] ] ] ] ] ] ] ]
    }
];

describe('Test deepFlatten', function testDeepFlatten() {
    it('should act as Identity for already flat data', function testDeepFlattenWithFlatData() {
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

    it('should flatten many levels', function testDeepFlattenWithMultilevelNesting() {
        var deepFlattenIterable = deepFlatten(multi_nested_data),
            deepFlattenRes = Array.from(deepFlattenIterable());
        deepFlattenRes.should.have.lengthOf(135);
    });

    it('should work with a generator', function testDeepFlattenWithGenerators() {
        function *gen(data) {
            for (let item of data)
                yield item;
        }

        var deepFlattenIterable = deepFlatten(gen(multi_nested_data)),
            deepFlattenRes = Array.from(deepFlattenIterable());

        deepFlattenRes.should.have.lengthOf(135);
    });
});