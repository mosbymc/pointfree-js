import { cacher, deepClone, deepCopy } from '../../src/helpers';
import { testData } from '../testData';

function checkClonedDataProps(orig, clone) {
    return Object.keys(orig).every(function checkEveryProp(key) {
        if ('object' !== typeof orig[key] && !Array.isArray(orig[key]))
            return orig[key].should.eql(clone[key]);
        else if (Array.isArray(orig[key]))
            return checkClonedArrayIndices(orig[key], clone[key]);
        return checkClonedDataProps(orig[key], clone[key]);
    });
}

function checkClonedArrayIndices(orig, clone) {
    return clone.every(function testValuesForEquality(item, idx) {
        if ('object' !== typeof item)
            return item.should.eql(orig[idx]);
        return checkClonedDataProps(orig[idx], item);
    });
}

describe('deepClone', function testCloneData() {
    it('should clone data', function testCloneData() {
        var clonedData = deepClone(testData);
        expect(checkClonedDataProps(testData, clonedData)).to.be.true;
    });
});

describe('deepCopy', function testCloneArray() {
    it('should clone arrays', function testCloneArray() {
        var clonedArr = deepCopy(testData.dataSource.data);
        expect(checkClonedArrayIndices(testData.dataSource.data, clonedArr)).to.be.true;
    });
});

describe('cacher', function testMemoizer() {
    it('should remember unique values for each instance', function testMemoizer() {
        function comparer(a, b) { return a === b; }
        var mem1 = cacher(comparer),
            mem2 = cacher(comparer),
            mem3 = cacher(comparer);

        testData.dataSource.data.forEach(function findUniques(item) {
            mem1(item).should.not.be.true;
            mem2(item).should.not.be.true;
            mem1(item).should.be.true;
        });

        [1, 1, 2, 2, 3, 3, 4, 4, 5, 5].forEach(function findUniques(item, idx) {
            mem3(item).should.eql(!!(idx % 2));
        });
    });
});