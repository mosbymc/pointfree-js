import {
    all, any, applyWhenReady, c, compose, constant, curry, curryN, curryRight, first,
    fixedPoint, fork, identity, ifElse, ifThisThenThat, kestrel, m, pipe, o, q, reduce,
    rev, second, sequence, t, thrush, u, uncurry, w, when, whenNot, y, uncurryN
} from '../../src/combinators';

describe('Test combinators', function _testCombinators() {
    describe('Test all', function _testAll() {
        function one(arg) { return arg; }
        function two(arg) { return !arg; }

        it('should return true when all functions return true', function _testAllReturnsTrue() {
            all(one, one, one, one)(true).should.be.true;
        });

        it('should return false if any function returns false', function _testAllReturnsFalse() {
            all(one, one, two)(true).should.be.false;
        });
    });

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
            function mathEm(num1, num2, num3) {
                return num1 + num2 * num3;
            }

            curryRight(mathEm)(3, 2, 1).should.eql(7);
        });
    });

    describe('Test ifThisThenThat', function _testIfThisThenThat() {
        function pred(arg) { return !!arg; }
        function ifFunc(arg) { return 2 * arg; }

        it('should invoke the \'if\' function when the predicate returns true', function _testIfThisThenThatWithTruthyValue() {
            ifThisThenThat(pred, ifFunc, 6, 6).should.eql(12);
        });

        it('should not invoke the \'if\' function when the predicate returns false', function _testIfThisThenThatWithFalseyValue() {
            ifThisThenThat(pred, ifFunc, 0, 6).should.eql(6);
        });
    });

    describe('Test sequence', function _testSequence() {
        function one(arg1, arg2) {
            arg1.a++;
            arg2.a--;
        }

        function two(arg1, arg2) {
            arg1.a++;
            arg2.a--;
        }

        var obj1 = { a: 1 },
            obj2 = { a: 1 };

        var seqFn = sequence([one, two]);

        seqFn(obj1, obj2);

        obj1.a.should.eql(3);
        obj2.a.should.eql(-1);
    });

    describe('Test uncurry', function _testUncurry() {
        function _uncurry(arg1, arg2) {
            return arg1 + arg2;
        }

        it('should return the original function when passed a curried function', function _testUncurryWithACurriedFunction() {
            uncurry(curry(_uncurry)).should.eql(_uncurry);
            uncurry(curry(_uncurry))(1, 2).should.eql(3);
        });

        it('should return the original function when passed a non-curried function', function _testUncurryWithAnUnCurriedFunction() {
            uncurry(_uncurry).should.eql(_uncurry);
            uncurry(_uncurry)(1, 2).should.eql(3);
        });
    });

    describe('Test uncurryN', function _testUncurryN() {
        var func = x => y => z => x + y + z;

        it('should uncurry a manually curried function', function _testPartialUncurrying() {
            var uncurriedFunc = uncurryN(2, func),
                res = uncurriedFunc(1, 2);

            res = res(3);

            res.should.eql(6);
        });

        it('should not invoke the function until the requisite number of arguments has been supplied', function() {
            var uncurriedFunc = uncurryN(4, func);
            uncurriedFunc(1, 2, 3).should.be.a('function');
            uncurriedFunc(1, 2, 3, 4).should.eql(6);

            var res = uncurriedFunc(1, 2, 3);
            res(1).should.eql(6);
        });
    });

    describe('Test whenNot', function _testWhenNot() {
        function transform(arg) { return 2 + arg; }

        it('should not run the \'success\' function if the predicate returns true', function _testWhenNotWithTruthyPredicate() {
            function pred() { return true; }

            whenNot(pred, transform, 2).should.eql(2);
        });

        it('should run the \'success\' function if the predicate return false', function _testWhenNotWithFalseyPredicate() {
            function pred() { return false; }

            whenNot(pred, transform, 2).should.eql(4);
        });
    });

    describe('Test applyWhenReady', function _testApplyWhenReady() {
        it('should apply the function to all the arguments when \'.apply\' or \'.leftApply\' is invoked', function _testApplyWhenReadyLeftApply() {
            var test = (...args) => args.reduce((acc, x) => acc + x, 0);

            var waiting = applyWhenReady(test);
            waiting = waiting(1, 2, 3, 4, 5);
            waiting = waiting(6, 7, 8, 9, 10);
            waiting = waiting(11, 12, 13, 14, 15);

            waiting.apply().should.eql(120);
            waiting.leftApply().should.eql(waiting.apply());
        });

        it('should apply the function to all the arguments in reverse order when \'.rightApply\' is invoked', function _testApplyWhenReadyRightApply() {
            var test = (...args) => args.reduce((acc, x) => acc - x, 0);

            var waiting = applyWhenReady(test);
            waiting = waiting(1, 2, 3, 4, 5);
            waiting = waiting(6, 7, 8, 9, 10);
            waiting = waiting(11, 12, 13, 14, 15);

            waiting.rightApply().should.eql(-120);
        });
    });
});