import { comparisons, defaultEqualityComparer, memoizer, memoizer2,
    getNumbersFromTime, comparator, dataTypeValueNormalizer, cloneData, cloneArray } from '../../src/helpers';
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

describe('cloneData', function testCloneData() {
    it('should clone data', function testCloneData() {
        var clonedData = cloneData(testData);
        expect(checkClonedDataProps(testData, clonedData)).to.be.true;
    });
});

describe('cloneArray', function testCloneArray() {
    it('should clone arrays', function testCloneArray() {
        var clonedArr = cloneArray(testData.dataSource.data);
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

describe('comparator', function testComparator() {
    function comparatorTestFunc1() {}
    function comparatorTestFunc2() {}

    it('should return proper values for strict equality comparisons', function testComparatorStrictEquality() {
        var compResult1 = comparator(comparisons.strictEquality, 1, 1),
            compResult2 = comparator(comparisons.strictEquality, 1, 1),
            compResult3 = comparator(comparisons.strictEquality, 1, 2),
            compResult4 = comparator(comparisons.strictEquality, testData, testData),
            compResult5 = comparator(comparisons.strictEquality, testData.dataSource.data, testData),
            compResult6 = comparator(comparisons.strictEquality, testData.dataSource.data, testData.dataSource.data),
            compResult7 = comparator(comparisons.strictEquality, null, null),
            compResult8 = comparator(comparisons.strictEquality, false, true),
            compResult9 = comparator(comparisons.strictEquality, undefined, null),
            compResult10 = comparator(comparisons.strictEquality, 1, null),
            compResult11 = comparator(comparisons.strictEquality, true, 3),
            compResult12 = comparator(comparisons.strictEquality, comparatorTestFunc1, comparatorTestFunc2),
            compResult13 = comparator(comparisons.strictEquality, comparatorTestFunc2, null),
            compResult14 = comparator(comparisons.strictEquality, comparatorTestFunc1, 3),
            compResult15 = comparator(comparisons.strictEquality, testData, comparatorTestFunc1),
            compResult16 = comparator(comparisons.strictEquality, comparatorTestFunc1, comparatorTestFunc1),
            compResult17 = comparator(comparisons.strictEquality, NaN, NaN);

        compResult1.should.be.true;
        compResult2.should.be.true;
        compResult3.should.not.be.true;
        compResult4.should.be.true;
        compResult5.should.not.be.true;
        compResult6.should.be.true;
        compResult7.should.be.true;
        compResult8.should.not.be.true;
        compResult9.should.not.be.true;
        compResult10.should.not.be.true;
        compResult11.should.not.be.true;
        compResult12.should.not.be.true;
        compResult13.should.not.be.true;
        compResult14.should.not.be.true;
        compResult15.should.not.be.true;
        compResult16.should.be.true;
        compResult17.should.not.be.true;
    });

    it('should return proper values for loose equality comparisons', function testComparatorLooseEquality() {
        var compResult1 = comparator(comparisons.looseEquality, 1, 1),
            compResult2 = comparator(comparisons.looseEquality, 1, 1),
            compResult3 = comparator(comparisons.looseEquality, 1, 2),
            compResult4 = comparator(comparisons.looseEquality, testData, testData),
            compResult5 = comparator(comparisons.looseEquality, testData.dataSource.data, testData),
            compResult6 = comparator(comparisons.looseEquality, testData.dataSource.data, testData.dataSource.data),
            compResult7 = comparator(comparisons.looseEquality, null, null),
            compResult8 = comparator(comparisons.looseEquality, false, true),
            compResult9 = comparator(comparisons.looseEquality, undefined, null),
            compResult10 = comparator(comparisons.looseEquality, 1, null),
            compResult11 = comparator(comparisons.looseEquality, true, 3),
            compResult12 = comparator(comparisons.looseEquality, comparatorTestFunc1, comparatorTestFunc2),
            compResult13 = comparator(comparisons.looseEquality, comparatorTestFunc2, null),
            compResult14 = comparator(comparisons.looseEquality, comparatorTestFunc1, 3),
            compResult15 = comparator(comparisons.looseEquality, testData, comparatorTestFunc1),
            compResult16 = comparator(comparisons.looseEquality, comparatorTestFunc1, comparatorTestFunc1),
            compResult17 = comparator(comparisons.looseEquality, 1, '1'),
            compResult18 = comparator(comparisons.looseEquality, '1', 1),
            compResult19 = comparator(comparisons.looseEquality, 1, true),
            compResult20 = comparator(comparisons.looseEquality, 0, false),
            compResult21 = comparator(comparisons.looseEquality, 0, null),
            compResult22 = comparator(comparisons.looseEquality, 0, undefined),
            compResult23 = comparator(comparisons.looseEquality, '0', false),
            compResult24 = comparator(comparisons.looseEquality, null, undefined),
            compResult25 = comparator(comparisons.looseEquality, NaN, NaN),
            compResult26 = comparator(comparisons.looseEquality, '', 0),
            compResult27 = comparator(comparisons.looseEquality, '', []),
            compResult28 = comparator(comparisons.looseEquality, 0,[]);

        compResult1.should.be.true;
        compResult2.should.be.true;
        compResult3.should.not.be.true;
        compResult4.should.be.true;
        compResult5.should.not.be.true;
        compResult6.should.be.true;
        compResult7.should.be.true;
        compResult8.should.not.be.true;
        compResult9.should.be.true;
        compResult10.should.not.be.true;
        compResult11.should.not.be.true;
        compResult12.should.not.be.true;
        compResult13.should.not.be.true;
        compResult14.should.not.be.true;
        compResult15.should.not.be.true;
        compResult16.should.be.true;
        compResult17.should.be.true;
        compResult18.should.be.true;
        compResult19.should.be.true;
        compResult20.should.be.true;
        compResult21.should.not.be.true;
        compResult22.should.not.be.true;
        compResult23.should.be.true;
        compResult24.should.be.true;
        compResult25.should.not.be.true;
        compResult26.should.be.true;
        compResult27.should.be.true;
        compResult28.should.be.true;
    });

    it('should return inverse values of strict equality when testing strict inequality', function testComparatorStrictInequality() {
        var compResult1 = comparator(comparisons.strictInequality, 1, 1),
            compResult2 = comparator(comparisons.strictInequality, 1, 1),
            compResult3 = comparator(comparisons.strictInequality, 1, 2),
            compResult4 = comparator(comparisons.strictInequality, testData, testData),
            compResult5 = comparator(comparisons.strictInequality, testData.dataSource.data, testData),
            compResult6 = comparator(comparisons.strictInequality, testData.dataSource.data, testData.dataSource.data),
            compResult7 = comparator(comparisons.strictInequality, null, null),
            compResult8 = comparator(comparisons.strictInequality, false, true),
            compResult9 = comparator(comparisons.strictInequality, undefined, null),
            compResult10 = comparator(comparisons.strictInequality, 1, null),
            compResult11 = comparator(comparisons.strictInequality, true, 3),
            compResult12 = comparator(comparisons.strictInequality, comparatorTestFunc1, comparatorTestFunc2),
            compResult13 = comparator(comparisons.strictInequality, comparatorTestFunc2, null),
            compResult14 = comparator(comparisons.strictInequality, comparatorTestFunc1, 3),
            compResult15 = comparator(comparisons.strictInequality, testData, comparatorTestFunc1),
            compResult16 = comparator(comparisons.strictInequality, comparatorTestFunc1, comparatorTestFunc1),
            compResult17 = comparator(comparisons.strictInequality, NaN, NaN);

        compResult1.should.not.be.true;
        compResult2.should.not.be.true;
        compResult3.should.be.true;
        compResult4.should.not.be.true;
        compResult5.should.be.true;
        compResult6.should.not.be.true;
        compResult7.should.not.be.true;
        compResult8.should.be.true;
        compResult9.should.be.true;
        compResult10.should.be.true;
        compResult11.should.be.true;
        compResult12.should.be.true;
        compResult13.should.be.true;
        compResult14.should.be.true;
        compResult15.should.be.true;
        compResult16.should.not.be.true;
        compResult17.should.be.true;
    });

    it('should mostly return inverse values of loose equality when testing loose inequality', function testComparatorLooseInequality() {
        var compResult1 = comparator(comparisons.looseInequality, 1, 1),
            compResult2 = comparator(comparisons.looseInequality, 1, 1),
            compResult3 = comparator(comparisons.looseInequality, 1, 2),
            compResult4 = comparator(comparisons.looseInequality, testData, testData),
            compResult5 = comparator(comparisons.looseInequality, testData.dataSource.data, testData),
            compResult6 = comparator(comparisons.looseInequality, testData.dataSource.data, testData.dataSource.data),
            compResult7 = comparator(comparisons.looseInequality, null, null),
            compResult8 = comparator(comparisons.looseInequality, false, true),
            compResult9 = comparator(comparisons.looseInequality, undefined, null),
            compResult10 = comparator(comparisons.looseInequality, 1, null),
            compResult11 = comparator(comparisons.looseInequality, true, 3),
            compResult12 = comparator(comparisons.looseInequality, comparatorTestFunc1, comparatorTestFunc2),
            compResult13 = comparator(comparisons.looseInequality, comparatorTestFunc2, null),
            compResult14 = comparator(comparisons.looseInequality, comparatorTestFunc1, 3),
            compResult15 = comparator(comparisons.looseInequality, testData, comparatorTestFunc1),
            compResult16 = comparator(comparisons.looseInequality, comparatorTestFunc1, comparatorTestFunc1),
            compResult17 = comparator(comparisons.looseInequality, 1, '1'),
            compResult18 = comparator(comparisons.looseInequality, '1', 1),
            compResult19 = comparator(comparisons.looseInequality, 1, true),
            compResult20 = comparator(comparisons.looseInequality, 0, false),
            compResult21 = comparator(comparisons.looseInequality, 0, null),
            compResult22 = comparator(comparisons.looseInequality, 0, undefined),
            compResult23 = comparator(comparisons.looseInequality, '0', false),
            compResult24 = comparator(comparisons.looseInequality, null, undefined),
            compResult25 = comparator(comparisons.looseInequality, NaN, NaN),
            compResult26 = comparator(comparisons.looseInequality, '', 0),
            compResult27 = comparator(comparisons.looseInequality, '', []),
            compResult28 = comparator(comparisons.looseInequality, 0,[]);

        compResult1.should.not.be.true;
        compResult2.should.not.be.true;
        compResult3.should.be.true;
        compResult4.should.not.be.true;
        compResult5.should.be.true;
        compResult6.should.not.be.true;
        compResult7.should.not.be.true;
        compResult8.should.be.true;
        compResult9.should.not.be.true;
        compResult10.should.be.true;
        compResult11.should.be.true;
        compResult12.should.be.true;
        compResult13.should.be.true;
        compResult14.should.be.true;
        compResult15.should.be.true;
        compResult16.should.not.be.true;
        compResult17.should.not.be.true;
        compResult18.should.not.be.true;
        compResult19.should.not.be.true;
        compResult20.should.not.be.true;
        compResult21.should.be.true;
        compResult22.should.be.true;
        compResult23.should.not.be.true;
        compResult24.should.not.be.true;
        compResult25.should.be.true;
        compResult26.should.not.be.true;
        compResult27.should.not.be.true;
        compResult28.should.not.be.true;
    });

    it('should return proper values when comparing numbers and strings', function testComparatorGreaterThanOrEqual() {
        var compResult1 = comparator(comparisons.greaterThanOrEqual, 1, 1),
            compResult2 = comparator(comparisons.greaterThanOrEqual, 1, 2),
            compResult3 = comparator(comparisons.greaterThanOrEqual, '1', 1),
            compResult4 = comparator(comparisons.greaterThanOrEqual, 2, 1),
            compResult5 = comparator(comparisons.greaterThanOrEqual, '1', '1'),
            compResult6 = comparator(comparisons.greaterThanOrEqual, '1', 10),
            compResult7 = comparator(comparisons.greaterThanOrEqual, '2315', '1241535');

        compResult1.should.be.true;
        compResult2.should.not.be.true;
        compResult3.should.be.true;
        compResult4.should.be.true;
        compResult5.should.be.true;
        compResult6.should.not.be.true;
        compResult7.should.be.true;
    });

    it('should return proper values when comparing numbers and strings', function testComparatorGreaterThan() {
        var compResult1 = comparator(comparisons.greaterThan, 1, 1),
            compResult2 = comparator(comparisons.greaterThan, 1, 2),
            compResult3 = comparator(comparisons.greaterThan, '1', 1),
            compResult4 = comparator(comparisons.greaterThan, 2, 1),
            compResult5 = comparator(comparisons.greaterThan, '1', '1'),
            compResult6 = comparator(comparisons.greaterThan, '1', 10),
            compResult7 = comparator(comparisons.greaterThan, '2315', '1241535');

        compResult1.should.not.be.true;
        compResult2.should.not.be.true;
        compResult3.should.not.be.true;
        compResult4.should.be.true;
        compResult5.should.not.be.true;
        compResult6.should.not.be.true;
        compResult7.should.be.true;
    });

    it('should return proper values when comparing numbers and strings', function testComparatorLessThanOrEqual() {
        var compResult1 = comparator(comparisons.lessThanOrEqual, 1, 1),
            compResult2 = comparator(comparisons.lessThanOrEqual, 1, 2),
            compResult3 = comparator(comparisons.lessThanOrEqual, '1', 1),
            compResult4 = comparator(comparisons.lessThanOrEqual, 2, 1),
            compResult5 = comparator(comparisons.lessThanOrEqual, '1', '1'),
            compResult6 = comparator(comparisons.lessThanOrEqual, '1', 10),
            compResult7 = comparator(comparisons.lessThanOrEqual, '2315', '1241535');

        compResult1.should.be.true;
        compResult2.should.be.true;
        compResult3.should.be.true;
        compResult4.should.not.be.true;
        compResult5.should.be.true;
        compResult6.should.be.true;
        compResult7.should.not.be.true;
    });

    it('should return proper values when comparing numbers and strings', function testComparatorLessThan() {
        var compResult1 = comparator(comparisons.lessThan, 1, 1),
            compResult2 = comparator(comparisons.lessThan, 1, 2),
            compResult3 = comparator(comparisons.lessThan, '1', 1),
            compResult4 = comparator(comparisons.lessThan, 2, 1),
            compResult5 = comparator(comparisons.lessThan, '1', '1'),
            compResult6 = comparator(comparisons.lessThan, '1', 10),
            compResult7 = comparator(comparisons.lessThan, '2315', '1241535');

        compResult1.should.not.be.true;
        compResult2.should.be.true;
        compResult3.should.not.be.true;
        compResult4.should.not.be.true;
        compResult5.should.not.be.true;
        compResult6.should.be.true;
        compResult7.should.not.be.true;
    });

    it('should return proper values indicating falsey-ness', function testComparatorFalsey() {
        var compResult1 = comparator(comparisons.falsey, false),
            compResult2 = comparator(comparisons.falsey, true),
            compResult3 = comparator(comparisons.falsey, testData),
            compResult4 = comparator(comparisons.falsey, testData.dataSource.data),
            compResult5 = comparator(comparisons.falsey, []),
            compResult6 = comparator(comparisons.falsey, 0),
            compResult7 = comparator(comparisons.falsey, 1),
            compResult8 = comparator(comparisons.falsey, null),
            compResult9 = comparator(comparisons.falsey),
            compResult10 = comparator(comparisons.falsey, NaN),
            compResult11 = comparator(comparisons.falsey, '0'),
            compResult12 = comparator(comparisons.falsey, comparatorTestFunc1);

        compResult1.should.be.true;
        compResult2.should.not.be.true;
        compResult3.should.not.be.true;
        compResult4.should.not.be.true;
        compResult5.should.not.be.true;
        compResult6.should.be.true;
        compResult7.should.not.be.true;
        compResult8.should.be.true;
        compResult9.should.be.true;
        compResult10.should.be.true;
        compResult11.should.not.be.true;
        compResult12.should.not.be.true;
    });

    it('should return proper values indicating truthy-ness', function testComparatorTruthy() {
        var compResult1 = comparator(comparisons.truthy, false),
            compResult2 = comparator(comparisons.truthy, true),
            compResult3 = comparator(comparisons.truthy, testData),
            compResult4 = comparator(comparisons.truthy, testData.dataSource.data),
            compResult5 = comparator(comparisons.truthy, []),
            compResult6 = comparator(comparisons.truthy, 0),
            compResult7 = comparator(comparisons.truthy, 1),
            compResult8 = comparator(comparisons.truthy, null),
            compResult9 = comparator(comparisons.truthy),
            compResult10 = comparator(comparisons.truthy, NaN),
            compResult11 = comparator(comparisons.truthy, '0'),
            compResult12 = comparator(comparisons.truthy, comparatorTestFunc1);

        compResult1.should.not.be.true;
        compResult2.should.be.true;
        compResult3.should.be.true;
        compResult4.should.be.true;
        compResult5.should.be.true;
        compResult6.should.not.be.true;
        compResult7.should.be.true;
        compResult8.should.not.be.true;
        compResult9.should.not.be.true;
        compResult10.should.not.be.true;
        compResult11.should.be.true;
        compResult12.should.be.true;
    });

    it('should return proper values when checking if a substring is contained within a string', function testComparatorContains() {
        var compResult1 = comparator(comparisons.contains, 'me', 'm'),
            compResult2 = comparator(comparisons.contains, 12, '12'),
            compResult3 = comparator(comparisons.contains, 'racecar', 'car'),
            compResult4 = comparator(comparisons.contains, 'wewwewewwe', 'w'),
            compResult5 = comparator(comparisons.contains, 'ittabl', 'ittabl'),
            compResult6 = comparator(comparisons.contains, 'ittabq', 'ittabl');

        compResult1.should.be.true;
        compResult2.should.be.true;
        compResult3.should.be.true;
        compResult4.should.be.true;
        compResult5.should.be.true;
        compResult6.should.not.be.true;
    });

    it('should return proper values when checking if a substring is not contained within a string', function testComparatorNotContains() {
        var compResult1 = comparator(comparisons.doesNotContain, 'me', 'm'),
            compResult2 = comparator(comparisons.doesNotContain, 12, '12'),
            compResult3 = comparator(comparisons.doesNotContain, 'racecar', 'car'),
            compResult4 = comparator(comparisons.doesNotContain, 'wewwewewwe', 'w'),
            compResult5 = comparator(comparisons.doesNotContain, 'ittabl', 'ittabl'),
            compResult6 = comparator(comparisons.doesNotContain, 'ittabq', 'ittabl');

        compResult1.should.not.be.true;
        compResult2.should.not.be.true;
        compResult3.should.not.be.true;
        compResult4.should.not.be.true;
        compResult5.should.not.be.true;
        compResult6.should.be.true;
    });

    it('should return proper values when checking if a string starts with a given substring', function testComparatorStartsWith() {
        var compResult1 = comparator(comparisons.startsWith, 'me', 'me'),
            compResult2 = comparator(comparisons.startsWith, 'me', 'm'),
            compResult3 = comparator(comparisons.startsWith, 'n', 'fe'),
            compResult4 = comparator(comparisons.startsWith, 'm', 'me');

        compResult1.should.be.true;
        compResult2.should.be.true;
        compResult3.should.not.be.true;
        compResult4.should.not.be.true;
    });

    it('should return proper values when checking if a string ends with a given substring', function testComparatorEndsWith() {
        var compResult1 = comparator(comparisons.endsWith, 'me', 'me'),
            compResult2 = comparator(comparisons.endsWith, 'me', 'e'),
            compResult3 = comparator(comparisons.endsWith, 'n', 'fe'),
            compResult4 = comparator(comparisons.endsWith, 'e', 'me');

        compResult1.should.be.true;
        compResult2.should.be.true;
        compResult3.should.not.be.true;
        compResult4.should.not.be.true;
    });
});

describe('getNumbersFromTime', function testGetNumbersFromTime() {
    it('should return should hours, minutes, seconds, and meridiem', function testGetNumbersFromTime() {
        var time1 = getNumbersFromTime('11:42:42 PM'),
            time2 = getNumbersFromTime('2:21:45 PM'),
            time3 = getNumbersFromTime('14:21:45'),
            time4 = getNumbersFromTime('11:42:42 AM'),
            time5 = getNumbersFromTime('11:42:42'),
            time6 = getNumbersFromTime('1.232.645'),
            time7 = getNumbersFromTime('12 AM'),
            time8 = getNumbersFromTime('12:00');

        time1.should.be.an('array');
        time1.should.have.lengthOf(4);
        time1[0].should.eql(11);
        time1[1].should.eql('42');
        time1[2].should.eql('42');
        time1[3].should.eql('PM');

        time2.should.be.an('array');
        time2.should.have.lengthOf(4);
        time2[0].should.eql(2);
        time2[1].should.eql('21');
        time2[2].should.eql('45');
        time2[3].should.eql('PM');

        time3.should.be.an('array');
        time3.should.have.lengthOf(3);
        time3[0].should.eql(14);
        time3[1].should.eql('21');
        time3[2].should.eql('45');

        time4.should.be.an('array');
        time4.should.have.lengthOf(4);
        time4[0].should.eql(time1[0]);
        time4[1].should.eql(time1[2]);
        time3[2].should.eql('45');
        time4[3].should.eql('AM');

        time5.should.be.an('array');
        time5.should.have.lengthOf(3);
        time5[0].should.eql(time4[0]);
        time5[1].should.eql(time4[1]);
        time5[2].should.eql(time4[2]);

        time6.should.be.an('array');
        time6.should.have.lengthOf(4);
        time6[0].should.eql(12);
        time6[1].should.eql('00');
        time6[2].should.eql('00');
        time6[3].should.eql('AM');

        time7.should.be.an('array');
        time7.should.have.lengthOf(3);
        time7[0].should.eql(12);
        time7[1].should.eql('00');
        time7[2].should.eql('00');

        time8.should.be.an('array');
        time8.should.have.lengthOf(3);
        time8[0].should.eql(12);
        time8[1].should.eql('00');
        time8[2].should.eql('00');
    });
});

describe('dataTypeValueNormalizer', function testDataTypeValueNormalizer() {
    it('should properly normalize values by data type', function testDataTypeValueNormalizer() {
        var unknownTypeValue = 123;

        var normalizeResult1 = dataTypeValueNormalizer('time', '3:33:21 PM'),
            normalizeResult2 = dataTypeValueNormalizer('time', '15:33:21'),
            normalizeResult3 = dataTypeValueNormalizer('number', 16.2),
            normalizeResult4 = dataTypeValueNormalizer('number', '16.2'),
            normalizeResult5 = dataTypeValueNormalizer('date', '10-18-1982'),
            normalizeResult6 = dataTypeValueNormalizer('date', '18-10-1982'),
            normalizeResult7 = dataTypeValueNormalizer('date', 123),
            normalizeResult8 = dataTypeValueNormalizer('datetime', '10-18-1982 06:55:21 PM'),
            normalizeResult9 = dataTypeValueNormalizer('datetime', '18-10-1982 18:55:21'),
            normalizeResult10 = dataTypeValueNormalizer('datetime', 123),
            normalizeResult11 = dataTypeValueNormalizer(),
            normalizeResult12 = dataTypeValueNormalizer(null, null),
            normalizeResult13 = dataTypeValueNormalizer('some unknown type', unknownTypeValue);

        normalizeResult1.should.be.an('number');
        normalizeResult1.should.eql(56901);

        normalizeResult2.should.be.an('number');
        normalizeResult2.should.eql(normalizeResult1);

        normalizeResult3.should.be.a('number');
        normalizeResult3.should.eql(16.2);

        normalizeResult4.should.be.a('number');
        normalizeResult4.should.eql(normalizeResult3);

        normalizeResult5.should.be.a('date');
        expect(normalizeResult5 instanceof Date).to.be.true;
        normalizeResult5.getDate().should.eql(18);
        normalizeResult5.getYear().should.eql(82);
        normalizeResult5.getMonth().should.eql(10);

        normalizeResult6.should.be.a('date');
        expect(normalizeResult6 instanceof Date).to.be.true;
        normalizeResult6.getDate().should.eql(18);
        normalizeResult6.getYear().should.eql(82);
        normalizeResult6.getMonth().should.eql(10);
        normalizeResult6.getDate().should.eql(normalizeResult5.getDate());
        normalizeResult6.getTime().should.eql(normalizeResult5.getTime());
        normalizeResult6.getYear().should.eql(normalizeResult5.getYear());
        normalizeResult6.getMonth().should.eql(normalizeResult5.getMonth());

        normalizeResult7.should.be.a('date');
        expect(normalizeResult7 instanceof Date).to.be.true;

        normalizeResult8.should.be.a('number');
        normalizeResult8.should.eql(406443669201);

        normalizeResult9.should.be.a('number');
        normalizeResult9.should.eql(normalizeResult8);

        normalizeResult10.should.be.a('number');
        normalizeResult10.should.eql(0);

        expect(normalizeResult11).to.be.undefined;
        expect(normalizeResult12).to.be.null;

        normalizeResult13.should.eql(unknownTypeValue.toString());
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

describe('memoizer2', function testMemoizer() {
    it('should remember unique values for each instance', function testMemoizer() {
        var mem1 = memoizer2(),
            mem2 = memoizer2(),
            mem3 = memoizer2();

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