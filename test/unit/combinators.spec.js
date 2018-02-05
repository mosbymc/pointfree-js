import {
    all, any, applyWhenReady, c, compose, constant, curry, curryN, curryRight, first,
    fixedPoint, fork, identity, ifElse, ifThisThenThat, kestrel, m, pipe, o, q, reduce,
    rev, second, sequence, t, thrush, u, uncurry, w, when, whenNot, y, uncurryN
} from '../../src/combinators';

describe('Test combinators', function _testCombinators() {
    describe('all', function _testAll() {
        function one(arg) { return arg; }
        function two(arg) { return !arg; }

        it('should return true when all functions return true', function _testAllReturnsTrue() {
            all(one, one, one, one)(true).should.be.true;
        });

        it('should return false if any function returns false', function _testAllReturnsFalse() {
            all(one, one, two)(true).should.be.false;
        });
    });

    describe('any', function _testAny() {
        function one(arg) { return arg; }
        function two(arg) { return !arg; }

        it('should return true when one function returns true', function _testAnyReturnsTrue() {
            any(two, two, two, one)(true).should.be.true;
        });

        it('should return false if all functions returns false', function _testAnyReturnsFalse() {
            any(two, two, two)(true).should.be.false;
        });
    });

    describe('c combinator', function _testC_Combinator() {
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

    describe('reverse', function _testReverse() {
        it('should reverse the arguments', function _reverseTest() {
            function revTest(arg1, arg2, arg3) {
                return rev(arg1, arg2, arg3);
            }

            revTest(1, 2, 3).should.eql([3, 2, 1]);
        });
    });

    describe('Test curry', function _testCurry() {
        it('should curry a function only once', function _testCurry() {
            function f(arg1, arg2, arg3) { return 0; }
            let cf = curry(f),
                res = curry(cf);

            cf.orig.should.eql(res.orig);
            cf.orig.should.eql(f);
            res.orig.should.eql(f);
        });
    });

    describe('curryN', function _testCurryN() {
        it('should re-curry successfully', function _testCurryN_Re_Currying() {
            function testFn(arg1, arg2, arg3, arg4) {
                return arg1 + arg2 + arg3 + arg4;
            }

            var curriedTestFn = curryN(4, testFn),
                intermediateFn = curriedTestFn(1),
                re_curriedFn = curryN(2, intermediateFn);

            re_curriedFn(2, 3).should.eql(NaN);
        });

        //TODO: Even though the code this test executes is perfectly valid, and Wallaby.js doesn't seem to have a
        //TODO: problem with it, running the tests via mocha seems to cause things to explode (similar to mocha
        //TODO: freaking out because I passed a function to Object.setProperty rather than a plain object). So,
        //TODO: for the time being, I'll leave the test out.
        /*it('should give a user-friendly string representation of the curried function', function _testCurryNToString() {
            function fourArgs(arg1, arg2, arg3, arg4) { return arg1 + arg2 + arg3 + arg4; }

            var curriedFunc = curryN(4, fourArgs, []),
                res = curriedFunc(1)(2, 3);
            res.toString().should.eql('function fourArgs(arg1, arg2, arg3, arg4) {\n                $_$wf(28);\n                return $_$w(28, 32), arg1 + arg2 + arg3 + arg4;\n            }(1, 2, 3)');
        });*/
    });

    describe('Test curryRight', function _testCurryRight() {
        it('should curry and right apply the arguments', function _curryRightTest() {
            function mathEm(num1, num2, num3) {
                return num1 + num2 * num3;
            }

            curryRight(mathEm)(3, 2, 1).should.eql(7);
        });
    });

    describe('Test fixedPoint', function _testFixedPoint() {
        it('should act on a recursive function', function _testFixedPoint() {
            fixedPoint(recur => x => 1 === x ? 1 : x * recur(x - 1))(5).should.eql(120)
        });
    });

    describe('Test fork', function  _testFork() {
        it('should run each execute each inner function and apply the outer function to the results', function _testFork() {
            function f1(arg) { return arg * arg; }
            function f2(arg) { return 10 * arg; }
            function f3(arg1, arg2) { return arg1 + arg2; }

            let f1Spy = sinon.spy(f1),
                f2Spy = sinon.spy(f2),
                f3Spy = sinon.spy(f3);

            let forkFn = fork(f3Spy, f1Spy, f2Spy),
                res = forkFn(5);

            res.should.eql(75);
            f1Spy.should.have.been.calledOnce;
            f2Spy.should.have.been.calledOnce;
            f3Spy.should.have.been.calledOnce;
            f1Spy.should.have.returned(25);
            f2Spy.should.have.returned(50);
            f3Spy.should.have.returned(75);
            f3Spy.should.have.been.calledWith(25, 50);
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

    describe('Test pipe', function _testPipe() {
        it('should return a function that, when invoked, applies all arguments to the first function and the the results to each subsequent function', function _testPipe() {
            function f1(arg1, arg2, arg3) { return (arg1 + arg2) * arg3; }
            function f2(arg) { return arg * arg; }
            function f3(arg) { return arg - 10; }
            function f4(arg) { return arg + 5; }

            let f1Spy = sinon.spy(f1),
                f2Spy = sinon.spy(f2),
                f3Spy = sinon.spy(f3),
                f4Spy = sinon.spy(f4);

            let piped = pipe(f1Spy, f2Spy, f3Spy, f4Spy),
                res = piped(2, 4);

            res.should.be.a('function');
            res.length.should.eql(1);

            res = res(6);

            piped.toString().should.eql('f1(f2(f3(f4)))()');
            res.should.eql(1291);

            f1Spy.should.have.been.calledOnce;
            f2Spy.should.have.been.calledOnce;
            f3Spy.should.have.been.calledOnce;
            f4Spy.should.have.been.calledOnce;

            f1Spy.should.have.been.calledWith(2, 4, 6);
            f2Spy.should.have.been.calledWith(36);
            f3Spy.should.have.been.calledWith(1296);
            f4Spy.should.have.been.calledWith(1286);
        });
    });

    describe('Test q', function _testQ() {
        it('should execute', function _testQ() {
            let a = x => x * x,
                b = x => x + 10;
            q(a, b, 10).should.eql(110);
        });
    });

    describe('Test reduce', function _testReduce() {
        it('should reduce the list', function _testReduce() {
            reduce((x, y) => x +  y, 0, [1, 2, 3, 4, 5]).should.eql(15);
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

        var seqFn = sequence(one, two);

        seqFn(obj1, obj2);

        obj1.a.should.eql(3);
        obj2.a.should.eql(-1);
    });

    describe('Test t', function _testT() {
        it('should execute', function _testT() {
            t(10, x => x * x).should.eql(100);
        });
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

    describe('Test w', function _testW() {
        it('should execute', function _testW() {
            w(x => y => x * y, 5).should.eql(25);
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

        it('should return the arguments provided to the function', function _testApplyWhenReadyArgs() {
            var test = (...args) => args.reduce((acc, x) => acc - x, 0),
                waiting = applyWhenReady(test);

            waiting = waiting(1, 2, 3, 4, 5);
            waiting = waiting(6, 7, 8, 9, 10);
            waiting.args().should.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
    });
});