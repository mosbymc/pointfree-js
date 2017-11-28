import { add, adjust, and, arraySet, both, concat, defaultPredicate, delegatesFrom, delegatesTo, divide, either, equals,
        falsey, flip, getWith, greaterThan, greaterThanOrEqual, has, inObject, invoke, isArray, isBoolean, isFunction,
        isObject, isNothing, isNull, isNumber, isPrimitive, isSomething, isString, isSymbol, isUndefined, lessThan,
        lessThanOrEqual, mapSet, modulus, multiply, negate, notEqual, noop, nth, objectSet, once, or, reverse, set,
        setSet, strictEquals, strictNotEqual, subtract, truthy, type, wrap } from '../../src/functionalHelpers';
import { identity, curry, ifElse } from '../../src/combinators';
import { not } from '../../src/decorators';
import { testData } from '../testData';

var testDataFirstNames = testData.dataSource.data.map(function _retrieveFirstNames(item) {
    return item.FirstName;
});

afterEach(function _resetData() {
    testData.dataSource.data.forEach(function _resetDataFirstNames(item, idx) {
        item.FirstName = testDataFirstNames[idx];
    });
});

describe('Test add', function _testAdd() {
    it('should add two numbers or strings', function _testAdd() {
        add(1, 2).should.eql(3);
        add('Ma', 'rk').should.eql('Mark');
    });
});

describe('Test adjust', function _testAdjust() {
    function _makeAdjustment(val) {
        return val * 2;
    }
    var list = [1, 2, 3, 4, 5];

    it('should return the list if the index is greater than the length', function _testAdjustWithGreaterIndex() {

        var res = adjust(_makeAdjustment, 5, list);

        res.should.be.an('array');
        res.should.eql(list);
    });

    it('should return the list if the index is less than the negative length', function _testAdjustWithLesserIndex() {

        var res = adjust(_makeAdjustment, -6, list);

        res.should.be.an('array');
        res.should.eql(list);
    });

    it('should update the value at the given index', function _testAdjustWithPositiveIndex() {
        var res = adjust(_makeAdjustment, 2, list);

        res.should.be.an('array');
        res.should.eql([1, 2, 6, 4, 5]);
    });

    it('should update the value at the given index starting from the end of the array', function _testAdjustWithNegativeIndex() {
        var res = adjust(_makeAdjustment, -4, list);

        res.should.be.an('array');
        res.should.eql([1, 4, 3, 4, 5]);
    });
});

describe('and', function testAnd() {
    it('should return a value of true', function testAndWithDoubleTrueValues() {
        var andResult = and(true, true);
        andResult.should.be.a('boolean');
        andResult.should.eql(true);
    });

    it('should return a value of false', function testAndWithDoubleAndSingleFalseValues() {
        var firstAnd = and(false, true),
            secondAnd = and(1, 0),
            thirdAnd = and(null, true);

        firstAnd.should.be.a('boolean');
        firstAnd.should.eql(false);

        secondAnd.should.be.a('boolean');
        secondAnd.should.eql(false);

        thirdAnd.should.be.a('boolean');
        thirdAnd.should.eql(false);
    });

    it('should return the first item', function testAndWithTruthyValues() {
        var firstAnd = and(true, true),
            secondAnd = and(1, {});

        firstAnd.should.be.a('boolean');
        firstAnd.should.eql(true);
        secondAnd.should.be.a('boolean');
    });
});

describe('Test both', function _testBoth() {
    it('should return the conjunction of two function invocations', function _testBoth() {
        function one() { return true; }
        function two() { return false; }

        var res1 = both(one, two),
            res2 = both(one, one),
            res3 = both(two, two),
            res4 = both(two, one);

        res1().should.be.false;
        res2().should.be.true;
        res3().should.be.false;
        res4().should.be.false;
    });
});

describe('Test concat', function _testConcat() {
    it('should  return first when rest is undefined', function _testConcatWithUndefinedRest() {
        concat([1, 2, 3, 4, 5])().should.eql([1, 2, 3, 4, 5]);
    });

    it('should return first when rest has length zero', function _testConcatWithEmptyArray() {
        concat([1, 2, 3, 4, 5])([]).should.eql([1, 2, 3, 4, 5]);
    });

    it('should concatenate arrays', function _testConcatWithArrays() {
        concat([1, 2, 3, 4, 5])(6, 7, 8, 9).should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('should concatenate strings', function _testConcatWithStrings() {
        concat('testing')(' 1, ', '2, ', '3...').should.eql('testing 1, 2, 3...');
    });
});

describe('Test divide', function _testDivide() {
    it('should divide two numbers', function _testDivide() {
        divide(1, 2).should.eql(0.5);
    });
});

describe('Test either', function _testEither() {
    it('should return the union of two function invocations', function _testEither() {
        function one() { return true; }
        function two() { return false; }

        var res1 = either(one, two),
            res2 = either(one, one),
            res3 = either(two, two),
            res4 = either(two, one);

        res1.should.be.true;
        res2.should.be.true;
        res3.should.be.false;
        res4.should.be.true;
    });
});

describe('Test equals', function _testEquals() {
    it('should test loose equality', function _testEquals() {
        equals(1, 1).should.be.true;
        equals('1', 1).should.be.true;
        equals(1, '1').should.be.true;
        equals(2, 1).should.be.false;
        equals(false, 0).should.be.true;
    });
});

describe('Test getWith', function _testGetWith() {
    it('should get a property from an object', function _testGetWith() {
        let getName = getWith('name'),
            obj1 = { name: 'Mike' },
            obj2 = { name: 'Charles' },
            obj3 = { noname: '' };

        getName(obj1).should.eql('Mike');
        getName(obj2).should.eql('Charles');
        expect(getName(obj3)).to.be.undefined;
    });
});

describe('Test greaterThan', function _testGreaterThan() {
    it('should return a boolean indicating if the first argument is greater than the second', function _testGreaterThan() {
        greaterThan('1', '2').should.be.false;
        greaterThan(1, 2).should.be.false;
        greaterThan(2, 1).should.be.true;
        greaterThan([], {}).should.be.false;
        greaterThan(5, '5').should.be.false;
    });
});

describe('Test greaterThanOrEqual', function _testGreaterThanOrEqual() {
    it('should return a boolean indicating if the first argument is greater than or equal to the second', function _testGreaterThanOrEqual() {
        greaterThanOrEqual('1', '2').should.be.false;
        greaterThanOrEqual('1', '1').should.be.true;
        greaterThanOrEqual(1, 2).should.be.false;
        greaterThanOrEqual(2, 1).should.be.true;
        greaterThanOrEqual([], {}).should.be.false;
        greaterThanOrEqual(5, '5').should.be.true;
    });
});

describe('Test has', function _testHas() {
    it('should return true if the object \'has\' the property', function _testHas() {
        let hasName = has('name'),
            obj1 = { name: 'Mike' },
            obj2 = { noname: 'Charles' },
            obj3 = Object.create(obj1);

        hasName(obj1).should.be.true;
        hasName(obj2).should.be.false;
        hasName(obj3).should.be.false;
    });
});

describe('identity', function testIdentity() {
    it('should return an empty array when passed an empty array', function testIdentityWithEmptyArray() {
        var emptyArr = [],
            identityResult = identity(emptyArr);

        identityResult.should.be.an('array');
        identityResult.should.have.lengthOf(0);
        identityResult.should.equal(emptyArr);
    });

    it('should return distinct values when called twice with different values', function testIdentityWithTwoValues() {
        var simpleObj = { a: 1, b: 2 },
            simpleObjResult = identity(simpleObj),
            testDataResult = identity(testData.dataSource.data);

        simpleObjResult.should.eql(simpleObj);
        testDataResult.should.eql(testData.dataSource.data);
    });

    it('should return same primitive values', function testIdentityWithPrimitiveValues() {
        var primNumber = 5,
            primString = 'Hello World',
            primBoolean = false;

        var numberResult = identity(primNumber),
            stringResult = identity(primString),
            booleanResult = identity(primBoolean);

        numberResult.should.eql(primNumber);
        stringResult.should.eql(primString);
        booleanResult.should.eql(primBoolean);
    });
});

describe('Test in', function _testIn() {
    it('should return true if the property is \'in\' the object', function _testIn() {
        let nameIn = inObject('name'),
            obj1 = { name: 'Mike' },
            obj2 = { noname: 'Charles' },
            obj3 = Object.create(obj1);

        nameIn(obj1).should.be.true;
        nameIn(obj2).should.be.false;
        nameIn(obj3).should.be.true;
    });
});

describe('Test isBoolean', function _testIsBoolean() {
    it('should return true is the argument is a boolean', function _testIsBoolean() {
        isBoolean(true).should.be.true;
        isBoolean(false).should.be.true;
        isBoolean(1).should.be.false;
        isBoolean('1').should.be.false;
        isBoolean([]).should.be.false;
        isBoolean({}).should.be.false;
        isBoolean(null).should.be.false;
        isBoolean().should.be.false;
    });
});

describe('isObject', function testIsObject() {
    it('should return true when item is any type of object', function testIsObjectWithObjects() {
        var resultOne = isObject(testData),
            resultTwo = isObject(testData.dataSource.data),
            resultThree = isObject(new Set()),
            resultFour = isObject(new Map());

        expect(resultOne,'testing').to.be.a('boolean');
        expect(resultOne).to.be.ok;

        expect(resultTwo).to.be.a('boolean');
        expect(resultTwo).to.be.ok;

        expect(resultThree).to.be.a('boolean');
        expect(resultThree).to.be.ok;

        expect(resultFour).to.be.a('boolean');
        expect(resultFour).to.be.ok;
    });

    it('should return false when item is not an object', function testIsObjectWithNonObjects() {
        var resultOne = isObject(true),
            resultTwo = isObject(null),
            resultThree = isObject(),
            resultFour = isObject(2),
            resultFive = isObject('string');

        expect(resultOne).to.be.a('boolean');
        expect(resultOne).to.not.be.ok;

        expect(resultTwo).to.be.a('boolean');
        expect(resultTwo).to.not.be.ok;

        expect(resultThree).to.be.a('boolean');
        expect(resultThree).to.not.be.ok;

        expect(resultFour).to.be.a('boolean');
        expect(resultFour).to.not.be.ok;

        expect(resultFive).to.be.a('boolean');
        expect(resultFive).to.not.be.ok;
    });
});

describe('Test isPrimitive', function _testIsPrimitive() {
    it('should return true if the item is a primitive type', function _testIsPrimitiveWithPrimitive() {
        var res1 = isPrimitive(1),
            res2 = isPrimitive('2'),
            res3 = isPrimitive(null),
            res4 = isPrimitive(undefined),
            res5 = isPrimitive(Symbol.for('is_primitive'));

        res1.should.be.true;
        res2.should.be.true;
        res3.should.be.true;
        res4.should.be.true;
        res5.should.be.true;
    });

    it('should return false if the item is not a primitive', function _testIsPrimitiveWithObjectAndFunction() {
        var res1 = isPrimitive({ a: 1 }),
            res2 = isPrimitive(x => x);

        res1.should.be.false;
        res2.should.be.false;
    });
});

describe('isArray', function testIsArray() {
    it('should return true when item is an array', function testIsArrayWithArray() {
        var isArrayResult1 = isArray([]),
            isArrayResult2 = isArray(testData.dataSource.data);

        expect(isArrayResult1).to.be.a('boolean');
        expect(isArrayResult1).to.be.ok;
        expect(isArrayResult2).to.be.a('boolean');
        expect(isArrayResult2).to.be.ok;
    });

    it('should return false when item is not an array', function testIsArrayWithNonArray() {
        var isArrayResult1 = isArray(testData),
            isArrayResult2 = isArray(function _noop() {}),
            isArrayResult3 = isArray(2),
            isArrayResult4 = isArray('2'),
            isArrayResult5 = isArray(true);

        expect(isArrayResult1).to.be.a('boolean');
        expect(isArrayResult1).to.not.be.ok;
        expect(isArrayResult2).to.be.a('boolean');
        expect(isArrayResult2).to.not.be.ok;
        expect(isArrayResult3).to.be.a('boolean');
        expect(isArrayResult3).to.not.be.ok;
        expect(isArrayResult4).to.be.a('boolean');
        expect(isArrayResult4).to.not.be.ok;
        expect(isArrayResult5).to.be.a('boolean');
        expect(isArrayResult5).to.not.be.ok;
    });
});

describe('isFunction', function testIsFunction() {
    it('should only return true when parameter is a function', function testIsFunction() {
        var isFunctionResult1 = isFunction(function _noop() {}),
            isFunctionResult2 = isFunction(),
            isFunctionResult3 = isFunction(null),
            isFunctionResult4 = isFunction(1),
            isFunctionResult5 = isFunction('1'),
            isFunctionResult6 = isFunction(true),
            isFunctionResult7 = isFunction(testData),
            isFunctionResult8 = isFunction(testData.dataSource.data);

        expect(isFunctionResult1).to.be.a('boolean');
        expect(isFunctionResult1).to.be.ok;
        expect(isFunctionResult2).to.be.a('boolean');
        expect(isFunctionResult2).to.not.be.ok;
        expect(isFunctionResult3).to.be.a('boolean');
        expect(isFunctionResult3).to.not.be.ok;
        expect(isFunctionResult4).to.be.a('boolean');
        expect(isFunctionResult4).to.not.be.ok;
        expect(isFunctionResult5).to.be.a('boolean');
        expect(isFunctionResult5).to.not.be.ok;
        expect(isFunctionResult6).to.be.a('boolean');
        expect(isFunctionResult6).to.not.be.ok;
        expect(isFunctionResult7).to.be.a('boolean');
        expect(isFunctionResult7).to.not.be.ok;
        expect(isFunctionResult8).to.be.a('boolean');
        expect(isFunctionResult8).to.not.be.ok;
    });
});

describe('Test isNull', function _testIsNull() {
    it('should return true if the argument is null', function _testIsNull() {
        isNull(null).should.be.true;
        isNull().should.be.false;
        isNull(1).should.be.false;
        isNull('1').should.be.false;
        isNull([]).should.be.false;
        isNull({}).should.be.false;
    });
});

describe('Test isNumber', function _testIsNumber() {
    it('should return true is the argument is a number', function _testIsNumber() {
        isNumber(1).should.be.true;
        isNumber('1').should.be.false;
        isNumber(false).should.be.false;
        isNumber([]).should.be.false;
        isNumber({}).should.be.false;
        isNumber().should.be.false;
        isNumber(null).should.be.false;
    });
});

describe('Test isSomething', function _testIsSomething() {
    it('should return true if the argument is not null or undefined', function _testIsSomething() {
        isSomething(1).should.be.true;
        isSomething('1').should.be.true;
        isSomething(false).should.be.true;
        isSomething({}).should.be.true;
        isSomething([]).should.be.true;
        isSomething(null).should.be.false;
        isSomething().should.be.false;
    });
});

describe('Test isSymbol', function _testIsSymbol() {
    it('should return true if the argument is a symbol', function _testIsSymbol() {
        isSymbol(1).should.be.false;
        isSymbol('1').should.be.false;
        isSymbol([]).should.be.false;
        isSymbol({}).should.be.false;
        isSymbol(null).should.be.false;
        isSymbol().should.be.false;
        isSymbol(true).should.be.false;
        isSymbol(Symbol()).should.be.true;
    });
});

describe('Test isUndefined', function _testIsUndefined() {
    it('should return true if the argument is undefined', function _testIsUndefined() {
        isUndefined().should.be.true;
        isUndefined(null).should.be.false;
        isUndefined(1).should.be.false;
        isUndefined('1').should.be.false;
        isUndefined([]).should.be.false;
        isUndefined({}).should.be.false;
        isUndefined(Symbol()).should.be.false;
    });
});

describe('ifElse', function testIfElse() {
    function truePredicate() {
        return true;
    }

    function falsePredicate() {
        return false;
    }

    function truthyPredicate() {
        return { a: 1 };
    }

    function falseyPredicate() {
        return null;
    }

    function notPredicate(value) {
        return !value;
    }

    function adder(value) {
        return ++value;
    }

    function subtractor(value) {
        return --value;
    }

    it('should return the if-valued function\'s execution value', function testIfElseWithTruthyIf() {
        var ifElseResult1 = ifElse(truePredicate, adder, subtractor, 1),
            ifElseResult2 = ifElse(truePredicate, subtractor, adder, 1),
            ifElseResult3 = ifElse(truthyPredicate, adder, subtractor, 1),
            ifElseResult4 = ifElse(notPredicate, adder, subtractor, 0);

        ifElseResult1.should.be.a('number');
        ifElseResult1.should.eql(2);
        ifElseResult2.should.be.a('number');
        ifElseResult2.should.eql(0);
        ifElseResult3.should.be.a('number');
        ifElseResult3.should.eql(2);
        ifElseResult4.should.be.a('number');
        ifElseResult4.should.eql(1);
    });

    it('should return the else-valued function\'s execution value', function testIfElseWithFalseyIf() {
        var ifElseResult1 = ifElse(falsePredicate, adder, subtractor, 1),
            ifElseResult2 = ifElse(falsePredicate, subtractor, adder, 1),
            ifElseResult3 = ifElse(falseyPredicate, subtractor, adder, 1),
            ifElseResult4 = ifElse(notPredicate, adder, subtractor, 1);

        ifElseResult1.should.be.a('number');
        ifElseResult1.should.eql(0);
        ifElseResult2.should.be.a('number');
        ifElseResult2.should.eql(2);
        ifElseResult3.should.be.a('number');
        ifElseResult3.should.eql(2);
        ifElseResult4.should.be.a('number');
        ifElseResult4.should.eql(0);
    });
});

describe('Test nth', function _testNth() {
    it('should return the nth positive element in an array', function _testNthWithArrayAndPositiveNumber() {
        nth(3, [1, 2, 3, 4, 5]).should.eql(4);
    });

    it('should return the nth positive character in a string', function _testNthWithStringAndPositiveNumber() {
        nth(3, 'testing').should.eql('t');
    });

    it('should return the nth negative element in an array', function _testNthWithArrayAndNegativeNumber() {
        nth(-3, [1, 2, 3, 4, 5]).should.eql(3);
    });

    it('should return the nth negative element in a string', function _testNthWithStringAndNegativeNumber() {
        nth(-3, 'testing').should.eql('i');
    });

    it('should return undefined when index is out of bounds in an array', function _testNthWithArrayAndOutOfBoundsIndex() {
        expect(nth(15, [1, 2, 3, 4, 5])).to.be.undefined;
    });

    it('should return an empty string when index is out of bounds in a string', function _testNthWithStringAndOutOfBoundsIndex() {
        nth(15, 'testing').should.eql('');
    });
});

describe('Test once', function _testOnce() {
    it('should only allow a function to be executed once', function _testOnce() {
        function _onlyOnce() { return true; }

        var onlyOnceSpy = sinon.spy(_onlyOnce),
            resFn = once(onlyOnceSpy);

        resFn();
        resFn();
        resFn();

        onlyOnceSpy.should.have.been.calledOnce;
    });
});

describe('or', function testOr() {
    it('should return a value of true', function testOrWithSingleAndDoubleTruthyValues() {
        var firstOr = or(true, 1),
            secondOr = or({}, []),
            thirdOr = or(2, 2);

        firstOr.should.be.a('boolean');
        firstOr.should.eql(true);

        secondOr.should.be.a('boolean');
        secondOr.should.eql(true);

        thirdOr.should.be.a('boolean');
        thirdOr.should.eql(true);
    });

    it('should return false when both functions return false', function testOrWithDoubleFalseyValues() {
        var orResult = or(false, 0);
        orResult.should.be.a('boolean');
        orResult.should.eql(false);
    });
});

describe('Test reverse', function _testReverse() {
    it('should reverse an array', function _testReverseWithAnArray() {
        reverse([1, 2, 3, 4, 5]).should.eql([5, 4, 3, 2, 1]);
    });

    it('should reverse a string', function _testReverseWithAString() {
        reverse('testing').should.eql('gnitset');
    });
});

describe('wrap', function testWrap() {
    it('should wrap all items', function testWrap() {
        function noop() { }

        var wrapResult1 = wrap(1),
            wrapResult2 = wrap('1'),
            wrapResult3 = wrap(true),
            wrapResult4 = wrap(null),
            wrapResult5 = wrap(),
            wrapResult6 = wrap({}),
            wrapResult7 = wrap([]),
            wrapResult8 = wrap(noop);

        wrapResult1.should.be.an('array');
        wrapResult1.should.have.lengthOf(1);
        wrapResult1.should.eql([1]);

        wrapResult2.should.be.an('array');
        wrapResult2.should.have.lengthOf(1);
        wrapResult2.should.eql(['1']);

        wrapResult3.should.be.an('array');
        wrapResult3.should.have.lengthOf(1);
        wrapResult3.should.eql([true]);

        wrapResult4.should.be.an('array');
        wrapResult4.should.have.lengthOf(1);
        wrapResult4.should.eql([null]);

        wrapResult5.should.be.an('array');
        wrapResult5.should.have.lengthOf(1);
        wrapResult5.should.eql([undefined]);

        wrapResult6.should.be.an('array');
        wrapResult6.should.have.lengthOf(1);
        wrapResult6.should.eql([{}]);

        wrapResult7.should.be.an('array');
        wrapResult7.should.have.lengthOf(1);
        wrapResult7.should.eql([[]]);

        wrapResult8.should.be.an('array');
        wrapResult8.should.have.lengthOf(1);
        wrapResult8.should.eql([noop]);
    });
});

describe('not', function testNot() {
    it('should return inverse booleanized value of function', function testNot() {
        function trueFunction() { return true; }
        function falseFunction() { return false; }
        function truthyFunction() { return { a: 1 }; }
        function falseyFunction() { return 0; }
        function inverseFunction(bool) { return !bool; }

        var not1 = not(trueFunction),
            not2 = not(falseFunction),
            not3 = not(truthyFunction),
            not4 = not(falseyFunction),
            not5 = not(inverseFunction),
            not6 = not(inverseFunction),
            not7 = not(not(inverseFunction)),
            not8 = not(not(inverseFunction));

        var notResult1 = not1(),
            notResult2 = not2(),
            notResult3 = not3(),
            notResult4 = not4(),
            notResult5 = not5(true),
            notResult6 = not6(false),
            notResult7 = not7(true),
            notResult8 = not8(false);

        notResult1.should.be.a('boolean');
        notResult1.should.not.be.ok;

        notResult2.should.be.a('boolean');
        notResult2.should.be.ok;

        notResult3.should.be.a('boolean');
        notResult3.should.not.be.ok;

        notResult4.should.be.a('boolean');
        notResult4.should.be.ok;

        notResult5.should.be.a('boolean');
        notResult5.should.be.ok;

        notResult6.should.be.a('boolean');
        notResult6.should.not.be.ok;

        notResult7.should.be.a('boolean');
        notResult7.should.be.not.be.ok;

        notResult8.should.be.a('boolean');
        notResult8.should.be.ok;
    });
});

describe('curry', function testCurry() {
    it('should repeatedly curry all functions while parameters remain', function testCurry() {
        function curryFunc1() { return 1; }
        function curryFunc2(param1) { return param1; }
        function curryFunc3(param1, param2) { return param1 + param2; }
        function curryFunc4(param1, param2, param3, param4, param5) { return param1 + param2 + param3 + param4 + param5; }

        var curry1 = curry(curryFunc1),
            curry2 = curry(curryFunc2),
            curry3 = curry(curryFunc3),
            curry4 = curry(curryFunc4);

        curry1.should.be.a('function');
        curry1.should.eql(curryFunc1);

        var curryResult1 = curry1();
        curryResult1.should.be.a('number');
        curryResult1.should.eql(1);

        var curryResult2 = curry2(2);
        curryResult2.should.be.a('number');
        curryResult2.should.eql(2);

        var tmpCurryResult3 = curry3(1);
        tmpCurryResult3.should.be.a('function');
        var curryResult3 = tmpCurryResult3(2);
        curryResult3.should.be.a('number');
        curryResult3.should.eql(3);

        var tmpCurryResult4 = curry4();
        tmpCurryResult4.should.be.a('function');
        tmpCurryResult4 = tmpCurryResult4(1);
        tmpCurryResult4.should.be.a('function');
        tmpCurryResult4 = tmpCurryResult4(2, 3);
        tmpCurryResult4.should.be.a('function');
        tmpCurryResult4 = tmpCurryResult4();
        tmpCurryResult4.should.be.a('function');
        tmpCurryResult4 = tmpCurryResult4(4);
        tmpCurryResult4.should.be.a('function');
        var curryResult4 = tmpCurryResult4(5, 6);
        curryResult4.should.be.a('number');
        curryResult4.should.eql(15);
    });
});

describe('Test truthy', function _testTruthy() {
    it('should return appropriate boolean response based on javascript values', function _testTruthy() {
        truthy(1).should.be.true;
        truthy(0).should.be.false;
        truthy(true).should.be.true;
        truthy(false).should.be.false;
        truthy([]).should.be.true;
        truthy({}).should.be.true;
        truthy('').should.be.false;
        truthy('123').should.be.true;
    });
});