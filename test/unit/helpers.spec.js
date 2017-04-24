import { defaultEqualityComparer, defaultGreaterThanComparer, defaultPredicate, memoizer, deepClone, deepCopy } from '../../src/helpers';
import { testData } from '../testData';

function checkClonedDataProps(orig, clone) {
    return Object.keys(orig).every(function checkEveryProp(key) {
        if (typeof orig[key] !== 'object' && !Array.isArray(orig[key]))
            return orig[key].should.eql(clone[key]);
        else if (Array.isArray(orig[key]))
            return checkClonedArrayIndices(orig[key], clone[key]);
        return checkClonedDataProps(orig[key], clone[key]);
    });
}

function checkClonedArrayIndices(orig, clone) {
    return clone.every(function testValuesForEquality(item, idx) {
        if (typeof item !== 'object')
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

describe('defaultEqualityComparer', function testDefaultEqualityComparer() {
    function testFunc() {}
    it('should return true when two items strictly equal each other', function testDecWithEqualItems() {
        var dec1 = defaultEqualityComparer(testFunc, testFunc),
            dec2 = defaultEqualityComparer(1, 1),
            dec3 = defaultEqualityComparer('me', 'me'),
            dec4 = defaultEqualityComparer(testData, testData),
            dec5 = defaultEqualityComparer(testData.dataSource.data, testData.dataSource.data),
            dec6 = defaultEqualityComparer(false, false),
            dec7 = defaultEqualityComparer(null, null),
            dec8 = defaultEqualityComparer(undefined);

        dec1.should.be.true;
        dec2.should.be.true;
        dec3.should.be.true;
        dec4.should.be.true;
        dec5.should.be.true;
        dec6.should.be.true;
        dec7.should.be.true;
        dec8.should.be.true;
    });

    it('should return false when two items are not strictly equal', function testDecWithUnequalItems() {
        function testFunc2() {}
        var dec1 = defaultEqualityComparer(testFunc, testFunc2),
            dec2 = defaultEqualityComparer(1, 2),
            dec3 = defaultEqualityComparer('me', 'you'),
            dec4 = defaultEqualityComparer(true, false),
            dec5 = defaultEqualityComparer(testData, testData.dataSource),
            dec6 = defaultEqualityComparer(null),
            dec7 = defaultEqualityComparer(undefined, 3),
            dec8 = defaultEqualityComparer(testFunc2, 'me'),
            dec9 = defaultEqualityComparer(true, null);

        dec1.should.not.be.true;
        dec2.should.not.be.true;
        dec3.should.not.be.true;
        dec4.should.not.be.true;
        dec5.should.not.be.true;
        dec6.should.not.be.true;
        dec7.should.not.be.true;
        dec8.should.not.be.true;
        dec9.should.not.be.true;
    });
});

describe('defaultGreaterThanComparer', function testDefaultGreaterThanComparer() {
    it('should return true when the first item is greater than the second', function testGreaterThanComparerWithGreaterFirstArg() {
        var dgc1 = defaultGreaterThanComparer(2, 1),
            dgc2 = defaultGreaterThanComparer('2', '1'),
            dgc3 = defaultGreaterThanComparer(true, false);

        dgc1.should.be.true;
        dgc2.should.be.true;
        dgc3.should.be.true;
    });

    it('should return false when the first item is less than or equal to the second', function testGreaterThanComparerWithLessThanOrEqualFirstArg() {
        var dgc1 = defaultGreaterThanComparer(1, 2),
            dgc2 = defaultGreaterThanComparer('1', '1'),
            dgc3 = defaultGreaterThanComparer(false, true);

        dgc1.should.not.be.true;
        dgc2.should.not.be.true;
        dgc3.should.not.be.true;
    });
});

describe('defaultPredicate', function testDefaultPredicate() {
    it('should always return true', function ensureDefaultPredicateReturnsTrue() {
        var dp1 = defaultPredicate(),
            dp2 = defaultPredicate(false),
            dp3 = defaultPredicate(true),
            dp4 = defaultPredicate(0),
            dp5 = defaultPredicate(null),
            dp6 = true;

        var i = 0;
        while (i < 20 && dp6) {
            dp6 = defaultPredicate();
            ++i;
        }
        dp1.should.be.true;
        dp2.should.be.true;
        dp3.should.be.true;
        dp4.should.be.true;
        dp5.should.be.true;
        dp6.should.be.true;
    });
});

describe('memoizer', function testMemoizer() {
    it('should remember unique values for each instance', function testMemoizer() {
        var mem1 = memoizer(),
            mem2 = memoizer(),
            mem3 = memoizer();

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