import { all, any, applyWhenReady, c, compose, constant, curry, curryN, curryRight, filtering, filterReducer, first,
        fixedPoint, fork, identity, ifElse, ifThisThenThat, kestrel, m, mapped, mapping, mapReducer, pipe, o, q, reduce,
        rev, second, sequence, t, thrush, u, w, when, whenNot, y } from '../../src/combinators';

describe('Test combinators', function _testCombinators() {
    describe('Test any', function _testAny() {
        function one(arg) { return arg; }
        function two(arg) { return !arg; }

        it('should return true when one function returns true', function _testAnyReturnsTrue() {
            any(two, two, two, one)(true).should.be.true;
        });

        it('should return false if all functions returns false', function _testAnyReturnsFalse() {
            any(two, two, two)(true).should.be.false;
        });
    });

    describe('Test c combinator', function _testC_Combinator() {
        it('should return application of x to y to z', function _testC_CombinatorAppliesArgsCorrectly() {
            function one(fn) {
                return function _one(arg) {
                    return fn(3 + arg);
                }
            }
            function two(arg) { return arg * 3; }

            c(one, two, 6).should.eql(27);
        });
    });

    describe('Test reverse', function _testReverse() {
        it('should reverse the arguments', function _reverseTest() {
            function revTest(arg1, arg2, arg3) {
                return rev(arg1, arg2, arg3);
            }

            revTest(1, 2, 3).should.eql([3, 2, 1]);
        });
    });

    describe('Test curryN', function _testCurryN() {
        it('should re-curry successfully', function _testCurryN_Re_Currying() {
            function testFn(arg1, arg2, arg3, arg4) {
                return arg1 + arg2 + arg3 + arg4;
            }

            var curriedTestFn = curryN(null, 4, testFn),
                intermediateFn = curriedTestFn(1),
                re_curriedFn = curryN(null, 2, intermediateFn);

            re_curriedFn(2, 3).should.eql(NaN);
        });
    });

    describe('Test curryRight', function _testCurryRight() {
        it('should curry and right apply the arguments', function _curryRightTest() {

        });
    });
});